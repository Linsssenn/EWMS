const pool = require("../../../bin/databasePool");
const {
  expand,
  flatten,
  updateString,
  updateValueExclude,
} = require("../helper/queryBuilder");
const GeoJsonHelper = require("../helper/geoJson");

class EmployeeTable {
  static getEmployee({ employeeId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM employee WHERE id = $1`,
        [employeeId],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows[0]);
        }
      );
    });
  }

  /**
   * @param {Object} genInfo
   * @param {Object} addressInfo
   */

  static async storeEmployee({ genInfo, addressInfo }) {
    const {
      name,
      employmentType,
      email,
      homePhone,
      cellPhone,
      dateAdded,
    } = genInfo;
    const { streetAddress, city, state, zipCode, lat, lon } = addressInfo;
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const insertGenInfo =
        "INSERT INTO employee_genInfo(name, employmentType, email, homePhone, cellPhone, dateAdded) VALUES($1, $2, $3, $4, $5, $6) RETURNING id";
      const genInfoId = await client.query(insertGenInfo, [
        name,
        employmentType,
        email,
        homePhone,
        cellPhone,
        dateAdded,
      ]);
      const insertAddInfo =
        "INSERT INTO employee_address(streetAddress, city, state, zipCode, lat, lon) VALUES($1, $2, $3, $4, $5, $6) RETURNING id";
      const addInfoId = await client.query(insertAddInfo, [
        streetAddress,
        city,
        state,
        zipCode,
        lat,
        lon,
      ]);
      const insertEmployee =
        'INSERT INTO employee("infoId", "addressId") VALUES ($1, $2)';
      console.log(genInfoId.rows[0].id, addInfoId.rows[0].id);
      await client.query(insertEmployee, [
        genInfoId.rows[0].id,
        addInfoId.rows[0].id,
      ]);
      await client.query("COMMIT");
      return { message: "Successfully inserted a data" };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  /**
   *
   * @param {Object} genInfo
   * @param {Object} addressInfo
   * @param {Number} id
   */
  static updateEmployee({ genInfo, addressInfo, infoId, addressId }) {
    const genInfoString = updateString(genInfo);
    const genInfoValue = Object.values(genInfo);
    genInfoValue.push(infoId);
    const idCount = `$${genInfoValue.length}`;
    const sqlQuery = `UPDATE employee_genInfo SET ${genInfoString} WHERE id = ${idCount}`;
  }
}

const genInfo = {
  name: "Linssen",
  employmentType: "Junior Dev",
  email: "linssen@gmail.com",
  homePhone: 09553092415,
  cellPhone: 09553092415,
  dateAdded: new Date(),
};

const addressInfo = {
  streetAddress: "Dasmariñas, Cavite",
  city: "Cavite",
  state: "CALABARZON",
  zipCode: 4114,
  lat: 14.299063,
  lon: 120.949937,
};

EmployeeTable.updateEmployee({ genInfo, addressInfo, infoId: 1 });

// EmployeeTable.storeEmployee({ genInfo, addressInfo })
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
