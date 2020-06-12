CREATE TABLE employee (
    id SERIAL,
    "infoId" INTEGER REFERENCES employee_genInfo(id),
    "addressId" INTEGER REFERENCES employee_address(id),
    -- infoId + addressId = PRIMARY KEY
    PRIMARY KEY ("infoId", "addressId", id)
);