const expand = (rowCount, columnCount, startAt = 1) => {
  let index = startAt;
  return Array(rowCount)
    .fill(0)
    .map(() => {
      return `(${Array(columnCount)
        .fill(0)
        .map(() => `$${index++}`)
        .join(",")})`;
    })
    .join(",");
};

/**
 * @param {Array} arr
 * @description returns array of values
 */
const flatten = (arr) => {
  let newArr = [];
  // Array of Objects
  arr.forEach((getValue) => {
    Object.values(getValue).forEach((pushValue) => newArr.push(pushValue));
  });
  // Array of Array
  // arr.forEach((pushValue) => (pushValue).forEach((pushValue) => newArr.push(pushValue)))
  return newArr;
};

module.exports = { expand, flatten };
