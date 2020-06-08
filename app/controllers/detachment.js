const Detachment = require("../models/detachment/index");
const DetachmentTable = require("../models/detachment/table");
const catchAsync = require("../utils/catchAsync");
const handleAsync = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

exports.getDetachmentsJson = catchAsync(async (req, res, next) => {
  const [detachment, detachmentErr] = await handleAsync(
    DetachmentTable.getDetachmentsGeoJson()
  );
  if (detachmentErr)
    return next(new AppError("There was an error in fetching the data", 400));
  res.status(200).json(detachment);
});

exports.storeDetachment = catchAsync(async (req, res, next) => {
  const { name, address, city, zip, lat, lon } = req.body;
  const detach = new Detachment({
    name,
    address,
    city,
    zip,
    lat,
    lon,
  }).validDetachment(); // replace if express-validator is implemented
  if (detach.hasOwnProperty("error"))
    return next(new AppError("Validation Error", 400, detach.error));
  const [detachment, detachmentErr] = await handleAsync(
    DetachmentTable.storeDetachment(detach.success)
  );
  if (detachmentErr)
    return next(new AppError("There was an error in fetching the data", 400));
  res.status(200).json({ message: "adding new detachment success" });
});
