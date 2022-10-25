// const startCronJob = require('nugttah-backend/helpers/start.cron.job');
// const Helpers = require('nugttah-backend/helpers');
// const Invoice = require('nugttah-backend/modules/invoices');
// const DirectOrder = require('nugttah-backend/modules/direct.orders');
// const Part = require('nugttah-backend/modules/parts');
// const DirectOrderPart = require('nugttah-backend/modules/direct.order.parts');

let startCronJob;
let Helpers;
let Invoice;
let DirectOrder;
let Part;
let DirectOrderPart;

async function getDirectOrderPartsGroups() {
  try {
    const dps = await DirectOrderPart.Model.find({
      partClass: { $in: ["StockPart", "QuotaPart", "requestPart"] },
      createdAt: { $gt: new Date("2021-04-01") },
      invoiceId: { $exists: false },
      fulfillmentCompletedAt: { $exists: true },
    }).select("_id directOrderId partClass priceBeforeDiscount");

    const all_ps = await Part.Model.find({
      partClass: "requestPart",
      createdAt: { $gt: new Date("2021-04-01") },
      invoiceId: { $exists: false },
      pricedAt: { $exists: true },
      directOrderId: { $exists: true },
    }).select("_id directOrderId partClass premiumPriceBeforeDiscount");

    return all_ps.concat(dps);
  } catch (error) {
    throw Error(
      `Could not fetch parts data in the database. ${error.message} `
    );
  }
}

// exports.filterDataWithHashTable = function (dataArray) {
//   const result = {};

//   // O(n)
//   dataArray.forEach((ele) => {
//     const id = ele.directOrderId;

//     if (result[id] === undefined) {
//       result[id] = {
//         directOrderParts: [],
//         requestParts: [],
//       };
//     }

//     if (ele.partClass === "StockPart" || ele.partClass === "QuotaPart") {
//       if (result[id].directOrderParts === undefined) {
//         result[id].directOrderParts = [ele];
//       } else {
//         result[id].directOrderParts.push(ele);
//       }
//     }
//     if (ele.partClass === "requestPart") {
//       if (result[id].requestParts === undefined) {
//         result[id].requestParts = [ele];
//       } else {
//         result[id].requestParts.push(ele);
//       }
//     }
//   });

//   // O(n)
//   return Object.entries(result);
// };

exports.filterIds = function (dataArray) {
  const result = {};

  // O(n)
  dataArray.forEach((ele) => {
    const id = ele.directOrderId;

    if (result[id] === undefined) {
      result[id] = {
        directOrderPartsIdList: [],
        requestPartsIdList: [],
        totalPrice: 0,
      };
    }

    if (ele.partClass === "StockPart" || ele.partClass === "QuotaPart") {
      result[id].directOrderPartsIdList.push(ele._id);
      result[id].totalPrice += ele.priceBeforeDiscount;
    }

    if (ele.partClass === "requestPart") {
      result[id].requestPartsIdList.push(ele._id);
      result[id].totalPrice += ele.premiumPriceBeforeDiscount;
    }
  });

  // O(n)
  return Object.entries(result);
};

async function createInvoice() {
  try {
    const allParts = await getDirectOrderPartsGroups();
    const directOrderPartsGroups = filterIds(allParts);

    const invcs = [];

    for (const allDirectOrderParts of directOrderPartsGroups) {
      const directOrder = await DirectOrder.Model.findOne({
        _id: allDirectOrderParts[0],
      }).select(
        "partsIds requestPartsIds discountAmount deliveryFees walletPaymentAmount"
      );

      const invoces = await Invoice.Model.find({
        directOrderId: allDirectOrderParts[0],
      }).select("walletPaymentAmount discountAmount deliveryFees");

      const dps_id = allDirectOrderParts[1].directOrderParts.idList;
      const rps_id = allDirectOrderParts[1].requestParts.idList;

      const TotalPrice = Helpers.Numbers.toFixedNumber(
        allDirectOrderParts[1].totalPrice
      );

      const { deliveryFees } = directOrder;
      let { walletPaymentAmount, discountAmount } = directOrder;
      let totalAmount = TotalPrice;
      if (directOrder.deliveryFees && invoces.length === 0) {
        totalAmount += directOrder.deliveryFees;
      }

      if (walletPaymentAmount) {
        invoces.forEach((invo) => {
          walletPaymentAmount = Math.min(
            0,
            walletPaymentAmount - invo.walletPaymentAmount
          );
        });
        walletPaymentAmount = Math.min(walletPaymentAmount, totalAmount);
        totalAmount -= walletPaymentAmount;
      }
      if (discountAmount) {
        invoces.forEach((nvc) => {
          discountAmount = Math.min(0, discountAmount - nvc.discountAmount);
        });
        discountAmount = Math.min(discountAmount, totalAmount);
        totalAmount -= discountAmount;
      }

      if (totalAmount < 0) {
        throw Error(
          `Could not create invoice for directOrder: ${directOrder._id} with totalAmount: ${totalAmount}. `
        );
      }

      const invoice = await Invoice.Model.create({
        directOrderId: directOrder._id,
        directOrderPartsIds: dps_id,
        requestPartsIds: rps_id,
        totalPartsAmount: TotalPrice,
        totalAmount,
        deliveryFees,
        walletPaymentAmount,
        discountAmount,
      });

      await DirectOrder.Model.updateOne(
        { _id: directOrder._id },
        { $addToSet: { invoicesIds: invoice._id } }
      );
      
      for (const dp_id of dps_id) {
        await DirectOrderPart.Model.updateOne(
          { _id: dp_id },
          { invoiceId: invoice._id }
        );
      }

      // wait for updates before pushing to invoices array
      await rps_id.map((rp_id) => {
        return new Promise((resolve, reject) => {
          Part.Model.updateOne({ _id: rp_id }, { invoiceId: invoice._id })
            .then(function (result) {
              return resolve(result);
            })
            .catch(() => {
              reject();
            });
        });
      });

      invcs.push(invoice._id);
    }
    return {
      case: 1,
      message: "invoices created successfully.",
      invoicesIds: invcs,
    };
  } catch (err) {
    Helpers.reportError(err);
  }
}

// startCronJob("*/1 * * * *", createInvoice, true); // at 00:00 every day

// module.exports = createInvoice;
