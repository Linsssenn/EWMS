const express = require("express");
const detachmentController = require("../controllers/detachment");
const accountController = require("../controllers/account");
const cacheController = require("../controllers/cache");
const router = express.Router({ mergeParams: true });

router.use(accountController.protect);

router
  .route("/")
  .get(cacheController.getCache, detachmentController.getDetachments)
  .post(cacheController.clearHash, detachmentController.storeDetachment);

router.route("/geojson").get(detachmentController.getDetachmentsJson);

router.route("/add-many").post(detachmentController.storeDetachments);

router
  .route("/:id")
  .get(detachmentController.getDetachmentById)
  .put(detachmentController.updateDetachment);

router
  .route("/nearest-employee/:id")
  .get(detachmentController.findNearestEmployee);

module.exports = router;
