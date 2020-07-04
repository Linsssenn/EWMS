const redis = require("redis");
const util = require("util");
const client = redis.createClient();
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
// Id, req.originalUrl
getCache({
  key: "a5bc9064-0101-4204-a4a9-4b1672e13ffd",
  hash: "/api/v1/detachment",
})
  .then((value) => console.log(value))
  .catch((err) => console.log(err));
// const { id } = Session.parse(sessionString);
// req.url;
// const data = {
//   name: "Greenwich",
//   address: "Greenwich - Robinsons Dasmariñas",
//   city: "Cavite",
//   zip: 4114,
//   lat: 14.299907,
//   lon: 120.953701,
// };
// saveCache({ key: "id", hash: "getDetach", data })
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));
