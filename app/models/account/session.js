const { v4: uuidv4 } = require("uuid");
const { hash } = require("../helper/hash");

const SEPERATOR = "|";

class Session {
  constructor({ username }) {
    this.username = username;
    this.id = uuidv4(); // generates randomId
  }

  toString() {
    //1 foo, randomId
    const { username, id } = this;
    return Session.sessionString({ username, id });
  }

  static sessionString({ username, id }) {
    // 2 call acountData function
    // accountData = foo|randomId
    const accountData = Session.accountData({ username, id });
    // return the value of foo|randomId|hash(foo|randomId)
    return `${accountData}${SEPERATOR}${hash(accountData)}`;
    // must call Session.parse(sessionString)
  }

  static accountData({ username, id }) {
    // 3 returns foo|randomId
    return `${username}${SEPERATOR}${id}`;
  }

  /**
   *
   * @param {String} sessionString
   * @description returns boolean
   */
  static verify(sessionString) {
    // sessionString = foo|randomId|hash(foo|randomId)
    // return username: foo, id: randomId, sessionHash: hash(foo|randomId)
    const { username, id, sessionHash } = Session.parse(sessionString);

    // get the username and id
    // returns foo|randomId
    const accountData = Session.accountData({ username, id });
    // hash(foo|randomId) === hash(foo|randomId) returns true if true
    return hash(accountData) === sessionHash;
  }

  /**
   * @param {String} sessionString
   */
  static parse(sessionString) {
    // 3 sessionString = foo|randomId|hash(foo|randomId)
    const sessionData = sessionString.split(SEPERATOR);
    // getRid of Seperator and return an array
    // username: foo,
    // id: randomId,
    // sessionHash: hash(foo|randomId)
    return {
      username: sessionData[0],
      id: sessionData[1],
      sessionHash: sessionData[2],
    };
  }
}

module.exports = Session;

// const sessionString = new Session({ username: "foo" });

// const sessionFoo = sessionString.toString();
// console.log("sessionFoo", sessionFoo);
// console.log("Session.parse(sessionFoo):", Session.parse(sessionFoo));

// const fakeFooString = `admin_${sessionFoo}`;

// console.log("Session.verify(fakeFooString)", Session.verify(fakeFooString));
