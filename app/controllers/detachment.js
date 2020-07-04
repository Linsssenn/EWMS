const Detachment = require("../models/detachment/index");
const DetachmentTable = require("../models/detachment/table");
const catchAsync = require("../utils/catchAsync");
const handleAsync = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const Session = require("../models/account/session");
const { saveCache } = require("../services/cache");

exports.getDetachmentsJson = catchAsync(async (req, res, next) => {
  const [detachment, detachmentErr] = await handleAsync(
    DetachmentTable.getDetachmentsGeo()
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

exports.storeDetachments = catchAsync(async (req, res, next) => {
  if (!Array.isArray(req.body))
    return next(new AppError("Please send an array of value", 400));

  const detachmentArr = req.body.map((value) => {
    const detach = new Detachment(value).validDetachment();
    if (detach.hasOwnProperty("error"))
      return next(new AppError("Validation Error", 400, detach.error));
    return detach.success;
  });

  const [detachment, detachmentErr] = await handleAsync(
    DetachmentTable.storeDetachments(detachmentArr)
  );

  if (detachmentErr)
    return next(new AppError("There was an error in fetching the data", 400));
  res.status(200).json({ message: "adding new detachment success" });
});

exports.getDetachments = catchAsync(async (req, res, next) => {
  console.log(req.cookies.sessionString);
  const [detachment, detachmentErr] = await handleAsync(
    DetachmentTable.getDetachments(req.query)
  );
  if (detachmentErr)
    return next(new AppError("There was an error in fetching the data", 400));
  await saveCache({
    key: req.cookies.sessionString,
    hash: req.originalUrl,
    data: detachment,
  });

  res.status(200).json(detachment);
});

exports.getDetachmentById = catchAsync(async (req, res, next) => {
  const [detachment, detachmentErr] = await handleAsync(
    DetachmentTable.getDetachmentById(req.params.id)
  );
  if (detachmentErr || !detachment)
    return next(new AppError("There was an error in getting the data", 400));

  res.status(200).json(detachment);
});

exports.updateDetachment = catchAsync(async (req, res, next) => {
  const [detachment, detachmentErr] = await handleAsync(
    DetachmentTable.updateDetachment({
      detachment: req.body,
      id: req.params.id,
    })
  );
  if (detachmentErr)
    return next(new AppError("There was an error in getting the data", 400));

  res.status(200).json({ message: "Detachment updated successfully" });
});

exports.findNearestEmployee = catchAsync(async (req, res, next) => {
  const [employees, employeesErr] = await handleAsync(
    DetachmentTable.findNearestEmployee({ opts: req.query, id: req.params.id })
  );
  if (employeesErr || !employees)
    return next(new AppError("There was an error in getting the data", 400));

  res.status(200).json({ employees });
});
