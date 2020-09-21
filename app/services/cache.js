const redis = require("redis");
const util = require("util");

let client;
if (process.env.NODE_ENV === "production") {
  client = redis.createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_AUTH_PASS,
  });
} else {
  client = redis.createClient();
}

client.hget = util.promisify(client.hget);

client.on("error", function (err) {
  console.log("Error " + err);
});

function saveCache({ key, hash, data, expiration = 60 }) {
  return new Promise((resolve, reject) => {
    client.hmset(key, hash, JSON.stringify(data), function (err, result) {
      if (err || !result) reject(err);
      client.expire(key, expiration);
      resolve(result);
    });
  });
}

async function getCache({ key, hash }) {
  const cacheValue = await client.hget(key, hash);
  if (cacheValue) {
    const result = JSON.parse(cacheValue);
    return result;
  }
  return null;
}

function clearHash(key) {
  console.log("CLEARING key");
  client.del(key);
}

module.exports = { clearHash, getCache, saveCache };
