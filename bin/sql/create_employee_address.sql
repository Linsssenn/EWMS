CREATE TABLE employee_address (
    id      SERIAL PRIMARY KEY,
    streetAddress (64),
    city VARCHAR(64),
    state VARCHAR(64),
    zipCode INTEGER(4) NOT NULL,
    homePhone VARCHAR(64),
    cellPhone INTEGER(11),
    lat numeric,
	lon numeric
);