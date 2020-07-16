const express = require("express");
const employeeController = require("../controllers/employee");
const accountController = require("../controllers/account");
const cacheController = require("../controllers/cache");

const router = express.Router({ mergeParams: true });

router.use(accountController.protect);

router
  .route("/")
  .get(cacheController.getCache, employeeController.getEmployees)
  .post(employeeController.storeEmployee);

router
  .route("/:id")
  .get(cacheController.getCache, employeeController.getEmployee)
  .put(employeeController.updateEmployee);

router
  .route("/nearest-detachment/:id")
  .get(cacheController.getCache, employeeController.findNearestDetachment);

router
  .route("/nearest-detachment-geo/:id")
  .get(cacheController.getCache, employeeController.findNearestDetachmentGeo);

module.exports = router;
