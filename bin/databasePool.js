const { Pool } = require("pg");
const databaseConfiguration = require("../secrets/databaseConfiguration");

let pool;
if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
} else {
  pool = new Pool(databaseConfiguration);
}

module.exports = pool;

// TEST
// pool.query("SELECT * FROM detachment", (error, response) => {
//   if (error) console.log(error);
//   console.log("response.rows", response.rows);
// });
