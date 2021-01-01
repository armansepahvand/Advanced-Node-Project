const mongoose = require("mongoose");

//save the mongoose query exec prototype function into a constant
const exec = mongoose.Query.prototype.exec;
