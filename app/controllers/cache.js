const { clearHash, getCache } = require("../services/cache");
const catchAsync = require("../utils/catchAsync");

exports.getCache = catchAsync(async (req, res, next) => {
  const result = await getCache({
    key: req.accountId,
    hash: req.originalUrl,
  });
  if (result) {
    // console.log("cache", req.originalUrl);
    res.status(200).json(result);
  } else {
    next();
  }
});

exports.clearHash = catchAsync(async (req, res, next) => {
  clearHash(req.accountId);
  next();
});
