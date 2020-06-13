const pool = require("../../../bin/databasePool");
const detachmentData = require("../../../data/detachment.json");
const Detachment = require("./index");
const GeoJsonHelper = require("../helper/geoJson");
const { expand, flatten, updateString } = require("../helper/queryBuilder");

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

  static storeMultipleDetachments(detachmentArray) {
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

  static storeDetachments(detachmentArray) {
    const detachmentArrString = JSON.stringify(detachmentArray);

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO detachment(name, address, city, zip, lat, lon)
      SELECT name, address, city, zip, lat, lon FROM jsonb_to_recordset
      ($1::jsonb) AS t (name text, address text, city text, zip int, lat double precision, lon double precision) RETURNING id`,
        [detachmentArrString],
        (error, response) => {
          if (error) return reject(error);
          const detachmentIds = response.rows;
          resolve(detachmentIds);
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

  static getDetachmentsGeo() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM detachment", (error, response) => {
        if (error) return reject(error);
        const jsonCoffee = new GeoJsonHelper(response.rows);
        resolve(jsonCoffee);
      });
    });
  }

  static getDetachmentById(detachmentId) {
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

  static getDetachments() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM detachment", (error, response) => {
        if (error) return reject(error);
        resolve(response.rows);
      });
    });
  }

  /**
   *
   * @param {Object} detachment
   * @param {Number} id
   */
  static updateDetachment(detachment, id) {
    const detachString = updateString(detachment);
    const detachValue = Object.values(detachment);
    detachValue.push(id);
    const idCount = `$${detachValue.length}`;
    const sqlQuery = `UPDATE detachment SET ${detachString} WHERE id = ${idCount}`;
    console.log(sqlQuery, detachValue);
    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, detachValue, (error, response) => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
}

// const detach = new Detachment({
//   name: "Pogi Japanese Restaurant 1000",
//   address: "Dasmariñas, Cavite",
//   city: "Cavite",
//   zip: 4114,
//   lat: 14.291301,
//   lon: 120.977593,
// }).validDetachment();
// console.log(detach);
// DetachmentTable.updateDetachment(
//   {
//     name: "Pogi Japanese Restaurant 1",
//     lat: 14.291301,
//     lon: 120.977593,
//   },
//   2
// )
//   .then((res) => console.log("success"))
//   .catch((err) => console.log(err));

// console.time();
// DetachmentTable.getDetachments()
//   .then((detachmentData) => console.log(detachmentData))
//   .catch((error) => console.log(error));
// console.timeEnd();
// console.time();
// DetachmentTable.getDetachmentsGeoJson()
//   .then((detachmentJson) => {
//     console.log(detachmentJson);
//   })
//   .catch((error) => console.log(error));
// console.timeEnd();

// console.time();
// const detachmentArr = [];

// for (let index = 0; index < detachmentData.length; index++) {
//   const { name, address, city, zip, lat, lon } = detachmentData[index];

//   const detach = new Detachment({
//     name,
//     address,
//     city,
//     zip,
//     lat,
//     lon,
//   }).validDetachment();
//   if (detach.hasOwnProperty("success")) {
//     detachmentArr.push(detach.success);
//   } else {
//     // empty array then stop the loop
//     detachmentArr.splice(0, detachmentArr.length);
//     detachmentArr.push(detach);
//     break;
//   }
// }
// if (!detachmentArr[0].error) {
//   DetachmentTable.storeMultipleDetachments(detachmentArr)
//     .then((detachmentIds) => console.log(detachmentIds))
//     .catch((error) => console.log(error));
// }

// console.timeEnd();

// DetachmentTable.storeDetachment(detachment.success)
//   .then((detachmentId) => console.log(detachmentId))
//   .catch((error) => console.log(error));

module.exports = DetachmentTable;
