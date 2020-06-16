const pool = require("../../../bin/databasePool");

class Pagination {
  constructor({ table, paginateString, fields, sortField }) {
    this.table = table;
    this.paginateString = paginateString || {};
    this.fields = fields || "*";
    this.sortField = sortField || "id";
  }

  paginate() {
    this.paginateString.page = this.paginateString.page * 1 || 1;
    this.paginateString.limit = this.paginateString.limit * 1 || 100;
    this.paginateString.skip =
      (this.paginateString.page - 1) * this.paginateString.limit;

    return this;
  }

  execute() {
    return new Promise((resolve, reject) => {
      const query = `SELECT ${this.fields} FROM ${this.table} ORDER BY ${this.sortField} ASC LIMIT $1 OFFSET $2`;

      pool.query(
        query,
        [this.paginateString.limit, this.paginateString.skip],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }

  count() {
    return new Promise((resolve, reject) => {
      const query = `SELECT count(*) as TotalCount FROM ${this.table}`;
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

const paginate = new Pagination({
  table: `(SELECT employee.id as empId, info.*, address.* FROM employee INNER JOIN employee_genInfo info ON info.id = employee."infoId" INNER JOIN employee_address address ON address.id = employee."addressId") as FOO`,
  //   fields: ["name, lat, lon"],
  paginateString: { page: 1, limit: 2 },
  sortField: "dateadded",
});
paginate
  .paginate()
  .execute()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
paginate
  .count()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
