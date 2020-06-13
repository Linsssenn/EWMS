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

/**
 * @description returns a string of an Update statement values
 * @param {Object} object
 * @returns {String} value = $1, value = $2
 */
const updateString = (object) => {
  return Object.keys(object)
    .map((value, index) => {
      return `${value} = $${index + 1}`;
    })
    .join(", ");
};

/**
 * When used
 *  - updateQueryStringExclude(Object, ["key1", "key2"])
 * @description returns a string of an Update statement values
 * @param {Object} object
 * @param {Array} excludeKeys
 * @returns {String} value = $1, value = $2
 */
const updateStringExclude = (object, excludeKeys) => {
  return Object.keys(object)
    .filter((value) => !excludeKeys.includes(value))
    .map((value, index) => {
      return `${value} = $${index + 1}`;
    })
    .join(", ");
};

const updateValueExclude = (object, excludeKeys) => {
  return Object.keys(object)
    .filter((key) => !excludeKeys.includes(key))
    .reduce((newObject, key) => {
      newObject.push(object[key]);
      return newObject;
    }, []);
};

module.exports = {
  expand,
  flatten,
  updateString,
  updateStringExclude,
  updateValueExclude,
};
