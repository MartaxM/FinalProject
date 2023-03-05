const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * User schema
 *  username username of the user
 *  email
 *  password, hashed
 *  
 *  User does not reference any other schema
 */

let UserSchema = new Schema({
   username: { type: String },
   email: { type: String },
   password: { type: String }
});

module.exports = mongoose.model("users", UserSchema);