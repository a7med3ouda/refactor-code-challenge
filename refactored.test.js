const { filterDataWithHashTable } = require("./refactored");
const { filterIds } = require("./refactored");
const {
  // data1,
  // result1,
  // data2,
  // result2,
  data3,
  result3,
  data4,
  result4,
} = require("./data");

// test("filterDataWithHashTable with 4 loop length and 2 ids", () => {
//   expect(JSON.stringify(filterDataWithHashTable(data1))).toBe(
//     JSON.stringify(result1)
//   );
// });

// test("filterDataWithHashTable with 20 loop length and 4 ids", () => {
//   expect(JSON.stringify(filterDataWithHashTable(data2))).toBe(
//     JSON.stringify(result2)
//   );
// });

test("filterData with 4 loop length and 2 ids", () => {
  expect(JSON.stringify(filterIds(data3))).toBe(JSON.stringify(result3));
});

test("filterData with 20 loop length and 4 ids", () => {
  expect(JSON.stringify(filterIds(data4))).toBe(JSON.stringify(result4));
});
