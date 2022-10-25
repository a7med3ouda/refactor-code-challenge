// comment if you want to test without database
const startCronJob = require('nugttah-backend/helpers/start.cron.job');
const Helpers = require('nugttah-backend/helpers');
const Invoice = require('nugttah-backend/modules/invoices');
const DirectOrder = require('nugttah-backend/modules/direct.orders');
const Part = require('nugttah-backend/modules/parts');
const DirectOrderPart = require('nugttah-backend/modules/direct.order.parts');

// code start
async function getAllParts() {
  const dps = await DirectOrderPart.Model.find({
    // partClass: { $in: ["StockPart", "QuotaPart"] },
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
}

exports.groupByOrderIdAndFilter = function (dataArray) {
  const result = {};

  dataArray.forEach((ele) => {
    const id = ele.directOrderId;

    if (ele.partClass === "StockPart" || ele.partClass === "QuotaPart") {
      if (result[id] === undefined) {
        result[id] = {
          directOrderPartsIdList: [],
          requestPartsIdList: [],
          total: 0,
        };
      }

      result[id].directOrderPartsIdList.push(ele._id);
      result[id].total += ele.priceBeforeDiscount;
    }

    if (ele.partClass === "requestPart") {
      if (result[id] === undefined) {
        result[id] = {
          directOrderPartsIdList: [],
          requestPartsIdList: [],
          total: 0,
        };
      }
      result[id].requestPartsIdList.push(ele._id);
      result[id].total += ele.premiumPriceBeforeDiscount;
    }
  });

  return Object.entries(result);
};

exports.calculateInvoices = function (totalAmount, directOrder, invoces) {
  let { walletPaymentAmount, discountAmount, deliveryFees } = directOrder;
  if (deliveryFees && invoces.length === 0) {
    totalAmount += deliveryFees;
  }

  if (walletPaymentAmount) {
    invoces.forEach((invo) => {
      const subtract = walletPaymentAmount - invo.walletPaymentAmount;
      walletPaymentAmount = subtract < 0 ? subtract : 0;
    });
    walletPaymentAmount =
      walletPaymentAmount < totalAmount ? walletPaymentAmount : totalAmount;
    totalAmount -= walletPaymentAmount;
  }

  if (discountAmount) {
    invoces.forEach((nvc) => {
      const subtract = discountAmount - nvc.discountAmount;
      discountAmount = subtract < 0 ? subtract : 0;
    });
    discountAmount =
      discountAmount < totalAmount ? discountAmount : totalAmount;
    totalAmount -= discountAmount;
  }

  return {
    totalAmount,
    walletPaymentAmount,
    discountAmount,
  };
};

async function createInvoice() {
  try {
    const allParts = await getAllParts();
    const directOrderPartsGroups = groupByOrderIdAndFilter(allParts);

    const invcs = [];

    for (const allDirectOrderParts of directOrderPartsGroups) {
      const directOrder = await DirectOrder.Model.findOne({
        _id: allDirectOrderParts[0],
      }).select(
        "partsIds requestPartsIds discountAmount deliveryFees walletPaymentAmount"
      );

      // can be better
      const invoces = await Invoice.Model.find({
        directOrderId: allDirectOrderParts[0],
      }).select("walletPaymentAmount discountAmount deliveryFees");

      const { directOrderPartsIdList, requestPartsIdList, total } =
        allDirectOrderParts[1];

      const TotalPrice = Helpers.Numbers.toFixedNumber(total);

      const { totalAmount, walletPaymentAmount, discountAmount } =
        calculateInvoices(TotalPrice, directOrder, invoces);

      if (totalAmount < 0) {
        throw Error(
          `Could not create invoice for directOrder: ${directOrder._id} with totalAmount: ${totalAmount}. `
        );
      }

      const invoice = await Invoice.Model.create({
        directOrderId: directOrder._id,
        directOrderPartsIds: directOrderPartsIdList,
        requestPartsIds: requestPartsIdList,
        totalPartsAmount: TotalPrice,
        deliveryFees: directOrder.deliveryFees,
        totalAmount,
        walletPaymentAmount,
        discountAmount,
      });

      await DirectOrder.Model.updateOne(
        { _id: directOrder._id },
        { $addToSet: { invoicesIds: invoice._id } }
      );

      await DirectOrderPart.Model.updateMany(
        { _id: { $in: directOrderPartsIdList } },
        { invoiceId: invoice._id }
      );

      await Part.Model.updateMany(
        { _id: { $in: requestPartsIdList } },
        { invoiceId: invoice._id }
      );

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

// comment if you want to test without database
startCronJob("*/1 * * * *", createInvoice, true); // at 00:00 every day

module.exports = createInvoice;
