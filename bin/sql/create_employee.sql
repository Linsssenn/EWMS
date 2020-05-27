CREATE TABLE employee (
    "infoId" INTEGER REFERENCES employee_genInfo(id),
    "addressId" INTEGER REFERENCES employee_address(id),
    -- infoId + addressId = PRIMARY KEY
    PRIMARY KEY ("infoId", "addressId")
);