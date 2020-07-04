const pool = require("../../../bin/databasePool");
const { updateString } = require("../helper/queryBuilder");
const Pagination = require("../helper/pagination");

class EmployeeTable {
  static getEmployees({ opts = {} }) {
    const { page = 1, limit = 10 } = opts;
    const skip = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT employee.id, info.*, address.* FROM employee INNER JOIN employee_genInfo info ON info.id = employee."infoId" INNER JOIN employee_address address ON address.id = employee."addressId" LIMIT $1 OFFSET $2',
        [limit, skip],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }

  static getEmployee(employeeId) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT employee.id, info.*, address.* FROM employee INNER JOIN employee_genInfo info ON info.id = employee."infoId" INNER JOIN employee_address address ON address.id = employee."addressId" WHERE employee.id = $1',
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
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
    try {
      const {
        name,
        employmentType,
        email,
        homePhone,
        cellPhone,
        dateAdded,
      } = genInfo;
      const { streetAddress, city, state, zipCode, lat, lon } = addressInfo;
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
  static async updateEmployee({ genInfo, addressInfo, id }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const genInfoString = updateString(genInfo);
      const genInfoValue = Object.values(genInfo);
      genInfoValue.push(id);
      const genInfoQuery = `UPDATE employee_genInfo SET ${genInfoString} WHERE id = $${genInfoValue.length}`;

      const addressString = updateString(addressInfo);
      const addressValue = Object.values(addressInfo);
      addressValue.push(id);
      const addressQuery = `UPDATE employee_address SET ${addressString} WHERE id = $${addressValue.length}`;

      // Run two query
      await client.query(genInfoQuery, genInfoValue);
      await client.query(addressQuery, addressValue);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Find nearest detachment from an employee's home
  static findNearestDetachment({ opts = {}, employeeId }) {
    const { page = 1, limit = 10 } = opts;
    const skip = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT detachment.id, detachment.address AS detachment_address, detachment.name as detachment_name, ST_Distance(ST_Transform(ST_SetSRID(ST_MakePoint(employee_address.lon,employee_address.lat),4326),3857), ST_Transform(ST_SetSRID(ST_MakePoint(detachment.lon,detachment.lat),4326),3857)) *  0.000621371192  as dist_miles FROM employee_address, detachment WHERE employee_address.id = $1 ORDER BY dist_miles ASC LIMIT $2 OFFSET $3",
        [employeeId, limit, skip],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
}

module.exports = EmployeeTable;
