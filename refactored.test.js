const { groupByOrderIdAndFilter,calculateInvoices } = require("./refactored");
const {
  data1,
  result1,
  data2,
  result2,
  data3,
  result3
} = require("./data");

test("groupByOrderIdAndFilter with 4 loop length and 2 ids", () => {
  expect(JSON.stringify(groupByOrderIdAndFilter(data1))).toBe(JSON.stringify(result1));
});

test("groupByOrderIdAndFilter with 20 loop length and 4 ids", () => {
  expect(JSON.stringify(groupByOrderIdAndFilter(data2))).toBe(JSON.stringify(result2));
});

test("calculateInvoices", () => {
  expect(JSON.stringify(calculateInvoices(...data3))).toBe(JSON.stringify(result3));
});
