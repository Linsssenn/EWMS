const Employee = require("../models/employee/table");
const catchAsync = require("../utils/catchAsync");
const handleAsync = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const EmployeeTable = require("../models/employee/table");

exports.getEmployee = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const [employee, employeeErr] = await handleAsync(Employee.getEmployee(id));
  if (employeeErr)
    return next(new AppError("There was an error in fetching the data", 400));

  res.status(200).json({ employee });
});

exports.getEmployees = catchAsync(async (req, res, next) => {
  const [employees, employeesErr] = await handleAsync(
    Employee.getEmployees({ opts: req.query })
  );
  if (employeesErr)
    return next(new AppError("There was an error in fetching the data", 400));

  res.status(200).json({ employees });
});

exports.storeEmployee = catchAsync(async (req, res, next) => {
  const { info, address } = req.body;
  const [employees, employeeErr] = await handleAsync(
    EmployeeTable.storeEmployee({ genInfo: info, addressInfo: address })
  );
  if (employeeErr)
    return next(new AppError("There was an error in fetching the data", 400));
  res.status(200).json({ message: "Employee added succesfully" });
});

exports.updateEmployee = catchAsync(async (req, res, next) => {
  const { info, address } = req.body;
  const [employee, employeeErr] = await handleAsync(
    EmployeeTable.updateEmployee({
      genInfo: info,
      addressInfo: address,
      id: req.params.id,
    })
  );
  if (employeeErr)
    return next(new AppError("There was an error in fetching the data", 400));
  res.status(200).json({ message: "Employee updated succesfully" });
});
