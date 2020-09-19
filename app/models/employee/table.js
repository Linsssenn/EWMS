const pool = require("../../../bin/databasePool");
const { updateString } = require("../helper/queryBuilder");
const GeoJsonHelper = require("../helper/geoJson");
const handleAsync = require("../../utils/asyncHandler");

class EmployeeTable {
  static getEmployees({ opts = {} }) {
    const { page = 1, limit = 25, search = "" } = opts;
    const skip = (page - 1) * limit;

    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT employee.id, info.name,  info.employmentType, info.email, info.homePhone, info.cellPhone, info.dateAdded, address.city, address.region, address.zipCode, address.lat, address.lon, address.geom  FROM employee INNER JOIN employee_genInfo info ON info.id = employee."infoId" INNER JOIN employee_address address ON address.id = employee."addressId" WHERE info.name ILIKE $1 LIMIT $2 OFFSET $3',
        [`${search}%`, limit, skip],
        (error, response) => {
          if (error) return reject(error);

          resolve({ rows: response.rows, count: response.rowCount });
        }
      );
    });
  }

  static countEmployee() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT COUNT(*) from employee", (error, response) => {
        if (error) return reject(error);
        resolve(response.rows[0]);
      });
    });
  }

  static getEmployee(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT employee.id, info.name,  info.employmentType, info.email, info.homePhone, info.cellPhone, info.dateAdded, address.city, address.region, address.zipCode, address.lat, address.lon, address.geom  FROM employee INNER JOIN employee_genInfo info ON info.id = employee."infoId" INNER JOIN employee_address address ON address.id = employee."addressId" WHERE employee.id = $1',
        [id],
        (error, response) => {
          if (error) return reject(error);

          resolve(response.rows[0]);
        }
      );
    });
  }

  /**
   * @param {Object} genInfo
   * @param {Object} address
   */

  static async storeEmployee({ info, address }) {
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
      } = info;
      const { city, region, zipCode, lat, lon } = address;
      await client.query("BEGIN");
      const insertInfo =
        "INSERT INTO employee_genInfo(name, employmentType, email, homePhone, cellPhone, dateAdded) VALUES($1, $2, $3, $4, $5, $6) RETURNING id";

      const infoId = await client.query(insertInfo, [
        name,
        employmentType,
        email,
        homePhone,
        cellPhone,
        dateAdded,
      ]);
      const insertAddInfo =
        "INSERT INTO employee_address( city, region, zipCode, lat, lon) VALUES($1, $2, $3, $4, $5) RETURNING id";
      const addressId = await client.query(insertAddInfo, [
        city,
        region,
        zipCode,
        lat,
        lon,
      ]);
      const insertEmployee =
        'INSERT INTO employee("infoId", "addressId") VALUES ($1, $2) RETURNING id';

      const employee = await client.query(insertEmployee, [
        infoId.rows[0].id,
        addressId.rows[0].id,
      ]);
      await client.query("COMMIT");
      return employee.rows[0].id;
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
   * @param {Object} address
   * @param {Number} id
   */
  static async updateEmployee({ info = {}, address = {}, id }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Select the two ID's
      const res = await client.query("SELECT * from employee WHERE id = $1", [
        id,
      ]);

      const infoString = updateString(info);
      const infoValue = Object.values(info);
      infoValue.push(res.rows[0].infoId);
      const infoQuery = `UPDATE employee_genInfo SET ${infoString} WHERE id = $${infoValue.length}`;

      const addressString = updateString(address);
      const addressValue = Object.values(address);
      addressValue.push(res.rows[0].addressId);
      const addressQuery = `UPDATE employee_address SET ${addressString} WHERE id = $${addressValue.length}`;

      // Run two query

      if (!!Object.keys(info).length) {
        await client.query(infoQuery, infoValue);
      }

      if (!!Object.keys(address).length) {
        await client.query(addressQuery, addressValue);
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");

      throw error;
    } finally {
      client.release();
    }
  }

  // Find nearest detachment from an employee's home
  static findNearestDetachment({ opts = {}, id }) {
    const { page = 1, limit = 25 } = opts;
    const skip = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      pool.query(
        `WITH employee_validate_address AS (
          SELECT * FROM employee_address WHERE ST_XMin(ST_SetSRID(ST_MakePoint(lon,lat),4326)) > -126 AND ST_XMax(ST_SetSRID(ST_MakePoint(lon,lat),4326)) < 130
          AND ST_YMin(ST_SetSRID(ST_MakePoint(lon,lat),4326)) > -10 AND ST_YMax(ST_SetSRID(ST_MakePoint(lon,lat),4326)) < 70
          ),
          employee_validate_detachment AS (
          SELECT
          *
          FROM 
          detachment
          WHERE ST_XMin(ST_SetSRID(ST_MakePoint(lon,lat),4326)) > -126
          AND ST_XMax(ST_SetSRID(ST_MakePoint(lon,lat),4326)) < 130
          AND ST_YMin(ST_SetSRID(ST_MakePoint(lon,lat),4326)) > -10
          AND ST_YMax(ST_SetSRID(ST_MakePoint(lon,lat),4326)) < 77
          )
      SELECT detachment.id, detachment.name as name, detachment.address AS address, detachment.lon, detachment.lat, round(cast(ST_Distance(ST_Transform(ST_SetSRID(ST_MakePoint(employee_address.lon,employee_address.lat),4326),3857), ST_Transform(ST_SetSRID(ST_MakePoint(detachment.lon,detachment.lat),4326),3857)) *  0.000621371192 as numeric),2)  as dist_miles FROM employee  INNER JOIN employee_validate_address as employee_address ON employee_address.id = employee."addressId", employee_validate_detachment as detachment WHERE employee.id = $1 ORDER BY dist_miles ASC LIMIT $2 OFFSET $3`,
        [id, limit, skip],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }

  static async findNearestDetachmentGeo({ opts = {}, id }) {
    const [detachment, detachmentErr] = await handleAsync(
      this.findNearestDetachment({ opts, id })
    );
    if (detachmentErr) throw detachmentErr;

    const detachmentJson = new GeoJsonHelper(detachment);
    return detachmentJson;
  }
}

module.exports = EmployeeTable;
