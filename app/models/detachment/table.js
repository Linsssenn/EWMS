const pool = require("../../../bin/databasePool");
const Detachment = require("./index");

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

  static storeDetachments(detachmentArray) {}
}

// Tester
const detachment = new Detachment({
  name: "Wew",
  address: "address",
  city: "city",
  zip: "zip",
  lat: 14.299063,
  lon: 120.949937,
}).validDetachment();

DetachmentTable.storeDetachment(detachment.success)
  .then((detachmentId) => console.log(detachmentId))
  .catch((error) => console.log(error));

module.exports = DetachmentTable;
