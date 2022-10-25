const partClass = ["StockPart", "QuotaPart", "requestPart"];

// exports.data1 = Array(4)
//   .fill()
//   .map((_, i) => {
//     return {
//       directOrderId: (i % 2) + 1,
//       partClass: partClass[i % 3],
//     };
//   });

// //directOrderParts // ["StockPart", "QuotaPart"]
// //requestParts // ["requestPart"]
// exports.result1 = [
//   [
//     "1",
//     {
//       directOrderParts: [
//         {
//           directOrderId: 1,
//           partClass: "StockPart",
//         },
//       ],
//       requestParts: [
//         {
//           directOrderId: 1,
//           partClass: "requestPart", //3
//         },
//       ],
//     },
//   ],
//   [
//     "2",
//     {
//       directOrderParts: [
//         {
//           directOrderId: 2,
//           partClass: "QuotaPart",
//         },
//         {
//           directOrderId: 2,
//           partClass: "StockPart",
//         },
//       ],
//       requestParts: [],
//     },
//   ],
// ];

// exports.data2 = Array(20)
//   .fill()
//   .map((_, i) => {
//     return {
//       directOrderId: (i % 4) + 1,
//       partClass: partClass[i % 3],
//     };
//   });

// //directOrderParts // ["StockPart", "QuotaPart"]
// //requestParts // ["requestPart"]
// exports.result2 = [
//   [
//     "1",
//     {
//       directOrderParts: [
//         {
//           directOrderId: 1,
//           partClass: "StockPart", //1
//         },
//         {
//           directOrderId: 1,
//           partClass: "QuotaPart", //5
//         },
//         {
//           directOrderId: 1,
//           partClass: "StockPart", //13
//         },
//         {
//           directOrderId: 1,
//           partClass: "QuotaPart", //17
//         },
//       ],
//       requestParts: [
//         {
//           directOrderId: 1,
//           partClass: "requestPart", //9
//         },
//       ],
//     },
//   ],
//   [
//     "2",
//     {
//       directOrderParts: [
//         {
//           directOrderId: 2,
//           partClass: "QuotaPart", //2
//         },
//         {
//           directOrderId: 2,
//           partClass: "StockPart", //10
//         },
//         {
//           directOrderId: 2,
//           partClass: "QuotaPart", //14
//         },
//       ],
//       requestParts: [
//         {
//           directOrderId: 2,
//           partClass: "requestPart", //6
//         },
//         {
//           directOrderId: 2,
//           partClass: "requestPart", //18
//         },
//       ],
//     },
//   ],
//   [
//     "3",
//     {
//       directOrderParts: [
//         {
//           directOrderId: 3,
//           partClass: "StockPart", //7
//         },
//         {
//           directOrderId: 3,
//           partClass: "QuotaPart", //11
//         },
//         {
//           directOrderId: 3,
//           partClass: "StockPart", //19
//         },
//       ],
//       requestParts: [
//         {
//           directOrderId: 3,
//           partClass: "requestPart", //3
//         },
//         {
//           directOrderId: 3,
//           partClass: "requestPart", //15
//         },
//       ],
//     },
//   ],
//   [
//     "4",
//     {
//       directOrderParts: [
//         {
//           directOrderId: 4,
//           partClass: "StockPart", //4
//         },
//         {
//           directOrderId: 4,
//           partClass: "QuotaPart", //8
//         },
//         {
//           directOrderId: 4,
//           partClass: "StockPart", //16
//         },
//         {
//           directOrderId: 4,
//           partClass: "QuotaPart", //20
//         },
//       ],
//       requestParts: [
//         {
//           directOrderId: 4,
//           partClass: "requestPart", //12
//         },
//       ],
//     },
//   ],
// ];

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
      totalPrice: 10 + 60,
    },
  ],
  [
    "drId2",
    {
      directOrderPartsIdList: ["id2", "id4"],
      requestPartsIdList: [],
      totalPrice: 20 + 40,
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
      totalPrice: 10 + 50 + 900 + 130 + 170,
    },
  ],
  [
    "drId2",
    {
      directOrderPartsIdList: ["id2", "id10", "id14"],
      requestPartsIdList: ["id6", "id18"],
      totalPrice: 20 + 600 + 100 + 140 + 1800,
    },
  ],
  [
    "drId3",
    {
      directOrderPartsIdList: ["id7", "id11", "id19"],
      requestPartsIdList: ["id3", "id15"],
      totalPrice: 300 + 70 + 110 + 1500 + 190,
    },
  ],
  [
    "drId4",
    {
      directOrderPartsIdList: ["id4", "id8", "id16", "id20"],
      requestPartsIdList: ["id12"],
      totalPrice: 40 + 80 + 1200 + 160 + 200,
    },
  ],
];
