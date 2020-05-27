-- Create a New Empty Table
CREATE TABLE detachment
	(
	  id serial NOT NULL,
	  name character varying(50),
	  address character varying(50),
	  city character varying(50),
	  zip character varying(10),
	  lat numeric,
	  lon numeric
	);