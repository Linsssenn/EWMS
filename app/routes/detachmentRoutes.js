const express = require("express");
const detachmentController = require("../controllers/detachment");
const authController = require("../controllers/account");
const router = express.Router();

router.get(
  "/detachment-geojson",
  authController.protect,
  detachmentController.getDetachmentsJson
);

router.post(
  "/add-detachment",
  authController.protect,
  detachmentController.storeDetachment
);
module.exports = router;
