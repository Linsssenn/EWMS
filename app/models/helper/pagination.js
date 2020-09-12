const pool = require("../../../bin/databasePool");

const DEFAULT_PROPERTIES = {
  page: 1,
  limit: 10,
  fields: "*",
  sort: "1",
  search: "",
};

class Pagination {
  constructor({ table, page, limit, fields, sort, search }) {
    this.table = table;

    this.page = page || DEFAULT_PROPERTIES.page;
    this.limit = limit || DEFAULT_PROPERTIES.limit;
    this.fields = fields || DEFAULT_PROPERTIES.fields;
    this.sort = sort || DEFAULT_PROPERTIES.sort;
    this.search = search || DEFAULT_PROPERTIES.search;
  }

  paginate() {
    this.page = this.page * 1;
    this.limit = this.limit * 1;
    this.skip = (this.page - 1) * this.limit;

    return this;
  }

  // Prepared Statement does not work in ORDER BY
  execute() {
    return new Promise((resolve, reject) => {
      const query = `SELECT ${this.fields} FROM ${this.table} WHERE name ILIKE $1 ORDER BY ${this.sort} ASC LIMIT $2 OFFSET $3`;

      pool.query(
        query,
        [`${this.search}%`, this.limit, this.skip],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }

  count() {
    return new Promise((resolve, reject) => {
      const query = `SELECT count(*) FROM ${this.table}`;
      pool.query(
        query,

        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows[0]);
        }
      );
    });
  }
}

module.exports = Pagination;
// const paginate = new Pagination({
//   table: `(SELECT employee.id as empId, info.*, address.* FROM employee INNER JOIN employee_genInfo info ON info.id = employee."infoId" INNER JOIN employee_address address ON address.id = employee."addressId") as FOO`,
//   //   fields: ["name, lat, lon"],
//   page: 1,
//   limit: 1,
//   sort: "dateadded",
// });
// const paginate = new Pagination({
//   table: "detachment",
//   fields: ["name"],
//   page: 3,
//   limit: 2,
//   // paginateString: { page: 1, limit: 2 },
//   // sort: "dateadded",
// });

// const paginate = new Pagination({
//   table: `(SELECT employee.id, info.name, address.city, address.lat, address.lon, ST_Distance(ST_Transform(ST_SetSRID(ST_MakePoint(address.lon,address.lat),4326),3857), ST_Transform(ST_SetSRID(ST_MakePoint(detachment.lon
//     ,detachment.lat),4326),3857)) *  0.000621371192  as dist_miles FROM detachment, employee RIGHT JOIN employee_genInfo info ON info.id = employee."infoId" RIGHT JOIN employee_address address ON address.id = employee."addressId" WHERE detachment.id = 1) as FOO`,
//   // fields: ["id, name"],
//   page: 1,
//   limit: 2,
//   sort: "id",
// });
// paginate
//   .paginate()
//   .execute()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
// paginate
//   .count()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
