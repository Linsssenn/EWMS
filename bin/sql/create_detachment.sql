-- Create a New Empty Table
CREATE TABLE detachment
	(
	  id SERIAL PRIMARY KEY,
	  name character varying(50),
	  address character varying(50),
	  city character varying(50),
	  zip character varying(10),
	  lat numeric,
	  lon numeric,
	  geom geometry(POINT,4326)
	);

-- Create an Index to the table
CREATE INDEX detachment_gist ON detachment USING gist (geom)