const partClass = ["StockPart", "QuotaPart", "requestPart"];

exports.data1 = Array(4)
  .fill()
  .map((_, i) => {
    return {
      _id: `id${i + 1}`,
      partClass: partClass[i % 3],
      directOrderId: `drId${(i % 2) + 1}`,
      priceBeforeDiscount: (i + 1) * 10,
      premiumPriceBeforeDiscount: (i + 1) * 20,
    };
  });

//directOrderParts // ["StockPart", "QuotaPart"] -- //requestParts // ["requestPart"]
exports.result1 = [
  [
    "drId1",
    {
      directOrderPartsIdList: ["id1"],
      requestPartsIdList: ["id3"],
      total: 10 + 60,
    },
  ],
  [
    "drId2",
    {
      directOrderPartsIdList: ["id2", "id4"],
      requestPartsIdList: [],
      total: 20 + 40,
    },
  ],
];

exports.data2 = Array(20)
  .fill()
  .map((_, i) => {
    return {
      _id: `id${i + 1}`,
      partClass: partClass[i % 3],
      directOrderId: `drId${(i % 4) + 1}`,
      priceBeforeDiscount: (i + 1) * 10,
      premiumPriceBeforeDiscount: (i + 1) * 100,
    };
  });

//directOrderParts // ["StockPart", "QuotaPart"] -- priceBeforeDiscount
//requestParts // ["requestPart"] -- premiumPriceBeforeDiscount
exports.result2 = [
  [
    "drId1",
    {
      directOrderPartsIdList: ["id1", "id5", "id13", "id17"],
      requestPartsIdList: ["id9"],
      total: 10 + 50 + 900 + 130 + 170,
    },
  ],
  [
    "drId2",
    {
      directOrderPartsIdList: ["id2", "id10", "id14"],
      requestPartsIdList: ["id6", "id18"],
      total: 20 + 600 + 100 + 140 + 1800,
    },
  ],
  [
    "drId3",
    {
      directOrderPartsIdList: ["id7", "id11", "id19"],
      requestPartsIdList: ["id3", "id15"],
      total: 300 + 70 + 110 + 1500 + 190,
    },
  ],
  [
    "drId4",
    {
      directOrderPartsIdList: ["id4", "id8", "id16", "id20"],
      requestPartsIdList: ["id12"],
      total: 40 + 80 + 1200 + 160 + 200,
    },
  ],
];

exports.data3 = [
  100,
  {
    partsIds: ["id1", "id2", "id3"],
    requestPartsIds: ["rqId1", "rqId2", "rqId3"],
    discountAmount: 20,
    deliveryFees: 10,
    walletPaymentAmount: 30,
  },
  [
    { walletPaymentAmount: 20, discountAmount: 10, deliveryFees: 15 },
    { walletPaymentAmount: 15, discountAmount: 5, deliveryFees: 10 },
  ],
];

// 100
// 30 , 20

//===

// 30 - 20 = 10  --- 0
// 0 - 15 = -15

// -15
// 115

///////

// 20 - 10 = 10 ---0
// 0 - 5 = -5

// -5
// 120




exports.result3 = {
  totalAmount: 120,
  walletPaymentAmount: -15,
  discountAmount: -5,
};
