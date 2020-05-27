CREATE TABLE employee_genInfo (
    id      SERIAL PRIMARY KEY,
    name VARCHAR(64),
    employmentType VARCHAR(64),
    email VARCHAR(64),
    dateAdded TIMESTAMP NOT NULL,
);