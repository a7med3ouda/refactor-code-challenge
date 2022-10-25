const { groupByOrderIdAndFilter } = require("./refactored");
const {
  data3,
  result3,
  data4,
  result4,
} = require("./data");

test("filterData with 4 loop length and 2 ids", () => {
  expect(JSON.stringify(groupByOrderIdAndFilter(data3))).toBe(JSON.stringify(result3));
});

test("filterData with 20 loop length and 4 ids", () => {
  expect(JSON.stringify(groupByOrderIdAndFilter(data4))).toBe(JSON.stringify(result4));
});
