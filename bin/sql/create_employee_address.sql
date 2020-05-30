CREATE TABLE employee_address (
    id      SERIAL PRIMARY KEY,
    streetAddress VARCHAR(64),
    city VARCHAR(64),
    state VARCHAR(64),
    zipCode INTEGER NOT NULL,
    lat numeric,
	lon numeric,
    geom geometry(POINT,4326)
);

-- Create an Index to the table
CREATE INDEX employee_address_gist ON employee_address USING gist (geom)