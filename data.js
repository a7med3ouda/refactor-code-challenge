const partClass = ["StockPart", "QuotaPart", "requestPart"];

exports.data3 = Array(4)
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
exports.result3 = [
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

exports.data4 = Array(20)
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
exports.result4 = [
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
