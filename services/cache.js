const mongoose = require("mongoose");
//set up the redis client
const redis= require('redis');
const redisUrl="redis://127.0.0.1:6379";
const client =redis.createClient(redisUrl);

//save the mongoose query exec prototype function into a constant
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {

  //Create a unique key from mongoose collection name and query options  
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name,
  });
  

  return exec.apply(this, arguments);
};
