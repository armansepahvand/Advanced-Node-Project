const mongoose = require("mongoose");
const util = require("util");

//set up the redis client
const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

//promisify client.get to return a promise
client.hget = util.promisify(client.hget);

//save the mongoose query exec prototype function into a constant
const exec = mongoose.Query.prototype.exec;

//prototype function to set cache to true for each query that applies this function
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  return this;
};

mongoose.Query.prototype.exec = async function () {
  //if the the route does not aplly the cache function return run the original exec function
  if (!this.useCache) {
    console.log("no cache");
    return exec.apply(this, arguments);
  }
  //Create a unique key from mongoose collection name and query options
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  //save the value for the key in cacheValue if it exists
  const cacheValue = await client.hget(this.hashKey, key);

  //return the value if it exists
  if (cacheValue) {
    console.log("Cache used");
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  //issue the query and store the results in redis server
  const result = await exec.apply(this, arguments);

  //set the result of mongoose query exec into redis and set the expiery to 10 second
  client.hset(this.hashKey, key, JSON.stringify(result));
  return result;
};
