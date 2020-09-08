CREATE TABLE employee_address (
    id      SERIAL PRIMARY KEY,
    city VARCHAR(64),
    region VARCHAR(64),
    zipCode INTEGER,
    lat numeric,
	lon numeric,
    geom geometry(POINT,4326)
);

-- Create an Index to the table
CREATE INDEX employee_adxdress_gist ON employee_address USING gist (geom)