const { clearHash, getCache } = require("../services/cache");
const catchAsync = require("../utils/catchAsync");

exports.getCache = catchAsync(async (req, res, next) => {
  const result = await getCache({
    key: req.cookies.sessionString,
    hash: req.originalUrl,
  });
  if (result) {
    console.log("cache");
    res.status(200).json(result);
  } else {
    next();
  }
});

exports.clearHash = catchAsync(async (req, res, next) => {
  clearHash(req.cookies.sessionString);
  next();
});
