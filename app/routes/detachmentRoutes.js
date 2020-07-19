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

router
  .route("/geojson")
  .get(cacheController.getCache, detachmentController.getDetachmentsJson);

router
  .route("/add-many")
  .post(cacheController.clearHash, detachmentController.storeDetachments);

router
  .route("/:id")
  .get(cacheController.getCache, detachmentController.getDetachment)
  .patch(cacheController.clearHash, detachmentController.updateDetachment);

router
  .route("/nearest-employee/:id")
  .get(cacheController.getCache, detachmentController.findNearestEmployee);

router
  .route("/nearest-employee-geo/:id")
  .get(cacheController.getCache, detachmentController.findNearestEmployeeGeo);

module.exports = router;
