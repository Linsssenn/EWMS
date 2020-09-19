const pool = require("../../../bin/databasePool");
const GeoJsonHelper = require("../helper/geoJson");
const { expand, flatten, updateString } = require("../helper/queryBuilder");
const handleAsync = require("../../utils/asyncHandler");
const Pagination = require("../helper/pagination");

class DetachmentTable {
  static storeDetachment(detachment) {
    const { name, address, city, zip, lat, lon } = detachment;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO detachment(name, address, city, zip, lat, lon) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
        [name, address, city, zip, lat, lon],
        (error, response) => {
          if (error) return reject(error);
          const detachmentId = response.rows[0].id;
          resolve(detachmentId);
        }
      );
    });
  }

  static storeDetachments(detachmentArray) {
    return new Promise((resolve, reject) => {
      const sqlParameter = expand(
        detachmentArray.length,
        Object.keys(detachmentArray[0]).length
      );
      const sqlArguments = flatten(detachmentArray);
      pool.query(
        `INSERT INTO detachment(name, address, city, zip, lat, lon) VALUES ${sqlParameter} returning id`,
        sqlArguments,
        (error, response) => {
          if (error) return reject(error);
          const detachment = response.rows;
          resolve(detachment);
        }
      );
    });
  }

  static getDetachmentsGeoJson() {
    return new Promise((resolve, reject) => {
      const detachmentQuery =
        "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((id, name)) As properties FROM detachment As lg) As f) As fc";
      pool.query(detachmentQuery, (error, response) => {
        if (error) return reject(error);
        resolve(response.rows[0].row_to_json);
      });
    });
  }

  static countDetachment() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT COUNT(*) from detachment", (error, response) => {
        if (error) return reject(error);
        resolve(response.rows[0]);
      });
    });
  }

  static getDetachmentsGeo(opts = {}) {
    const { page = 1, limit = 25 } = opts;
    const skip = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM detachment LIMIT $1 OFFSET $2",
        [limit, skip],
        (error, response) => {
          if (error) return reject(error);
          const detachmentJson = new GeoJsonHelper(response.rows);
          resolve(detachmentJson);
        }
      );
    });
  }

  static getDetachment(detachmentId) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM detachment WHERE id = $1",
        [detachmentId],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows[0]);
        }
      );
    });
  }

  static async getDetachments(opts = {}) {
    const { page, limit, fields, sort, search } = opts;

    const paginate = new Pagination({
      table: "detachment",
      limit,
      page,
      fields,
      sort,
      search,
    });
    const [data, dataErr] = await handleAsync(paginate.paginate().execute());
    const [{ count }, countErr] = await handleAsync(
      paginate.paginate().count()
    );

    if (dataErr) throw dataErr;
    if (countErr) throw countErr;
    return { data, count };
  }

  /**
   *
   * @param {Object} detachment
   * @param {Number} id
   */
  static updateDetachment({ detachment, id }) {
    const detachString = updateString(detachment);
    const detachValue = Object.values(detachment);
    detachValue.push(id);
    const idCount = `$${detachValue.length}`;
    const sqlQuery = `UPDATE detachment SET ${detachString} WHERE id = ${idCount}`;

    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, detachValue, (error, response) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }

  // find nearest employee from a detachment
  /**
   * @description Implemented a sub-query / CTE in SQL to skip lat and lon error
   */
  static findNearestEmployee({ opts = {}, id }) {
    const { page = 1, limit = 25 } = opts;
    const skip = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      pool.query(
        `WITH employee_validate_address AS (
        SELECT * FROM employee_address WHERE ST_XMin(ST_SetSRID(ST_MakePoint(lon,lat),4326)) > -126 AND ST_XMax(ST_SetSRID(ST_MakePoint(lon,lat),4326)) < 130
        AND ST_YMin(ST_SetSRID(ST_MakePoint(lon,lat),4326)) > -10 AND ST_YMax(ST_SetSRID(ST_MakePoint(lon,lat),4326)) < 70
        ),
        validate_detachment AS (
        SELECT
        *
        FROM 
        detachment
        WHERE ST_XMin(ST_SetSRID(ST_MakePoint(lon,lat),4326)) > -126
        AND ST_XMax(ST_SetSRID(ST_MakePoint(lon,lat),4326)) < 130
        AND ST_YMin(ST_SetSRID(ST_MakePoint(lon,lat),4326)) > -10
        AND ST_YMax(ST_SetSRID(ST_MakePoint(lon,lat),4326)) < 77
        )
        SELECT employee.id, info.name, info.employmentType, info.email, info.homePhone, info.cellPhone, address.city, address.region, address.zipCode, address.lat, address.lon,round(cast(ST_Distance(ST_Transform(ST_SetSRID(ST_MakePoint(address.lon,address.lat),4326),3857), 
        ST_Transform(ST_SetSRID(ST_MakePoint(detachment.lon
       ,detachment.lat),4326),3857)) *  0.000621371192 as numeric),2)  as dist_miles 
       FROM validate_detachment as detachment, employee INNER JOIN employee_genInfo info ON info.id = employee."infoId" INNER JOIN employee_validate_address address ON address.id = employee."addressId" WHERE detachment.id = $1 ORDER BY dist_miles ASC LIMIT $2 OFFSET $3`,
        [id, limit, skip],
        (error, response) => {
          console.log(error);
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }

  static async findNearestEmployeeGeo({ opts = {}, id }) {
    const [employee, employeeErr] = await handleAsync(
      this.findNearestEmployee({ opts, id })
    );
    if (employeeErr) throw employeeErr;

    const employeeJson = new GeoJsonHelper(employee);
    return employeeJson;
  }
}

module.exports = DetachmentTable;
