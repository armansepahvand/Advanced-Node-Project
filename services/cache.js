const mongoose = require("mongoose");

//save the mongoose query exec prototype function into a constant
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {

  //Create a unique key from mongoose collection name and query options  
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name,
  });
  

  return exec.apply(this, arguments);
};
