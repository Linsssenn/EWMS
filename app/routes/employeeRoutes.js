const express = require("express");
const employeeController = require("../controllers/employee");
const accountController = require("../controllers/account");

const router = express.Router({ mergeParams: true });

router.use(accountController.protect);

router
  .route("/")
  .get(employeeController.getEmployees)
  .post(employeeController.storeEmployee);

router
  .route("/:id")
  .get(employeeController.getEmployee)
  .put(employeeController.updateEmployee);

module.exports = router;
