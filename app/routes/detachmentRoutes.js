const express = require("express");
const detachmentController = require("../controllers/detachment");
const accountController = require("../controllers/account");
const router = express.Router({ mergeParams: true });

router.use(accountController.protect);

router
  .route("/")
  .get(detachmentController.getDetachments)
  .post(detachmentController.storeDetachment);

router.route("/geojson").get(detachmentController.getDetachmentsJson);

router.route("/add-many").post(detachmentController.storeMultipleDetachments);

router.route("/:id").get(detachmentController.getDetachmentById);
module.exports = router;
