const pool = require("../../../bin/databasePool");
const { hash } = require("../helper/hash");
const handleAsync = require("../../utils/asyncHandler");

class AccountTable {
  static storeAccount({ usernameHash, passwordHash }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO account("usernameHash", "passwordHash") 
        VALUES($1, $2) RETURNING id`,
        [usernameHash, passwordHash],
        (error, response) => {
          console.log(usernameHash);
          if (error) return reject(error);
          resolve(response.rows[0]);
        }
      );
    });
  }

  static getAccount({ usernameHash }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT id, "passwordHash", "sessionId" FROM account 
            WHERE "usernameHash" = $1`,
        [usernameHash],
        (error, response) => {
          if (error) return reject(error);
          // return 1 rows if resolve

          resolve({ account: response.rows[0] });
        }
      );
    });
  }

  static updateSessionId({ sessionId, usernameHash }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE account SET "sessionId"= $1
           WHERE "usernameHash" = $2 RETURNING account.*`,
        [sessionId, usernameHash],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows[0]);
        }
      );
    });
  }
}
module.exports = AccountTable;
