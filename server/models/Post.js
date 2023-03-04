const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let PostSchema = new Schema({
    user:{type: mongoose.ObjectId},
    title : {type:String},
    text : {type:String},
    code: {type:String},
    comments: [mongoose.ObjectId]
});

module.exports = mongoose.model("posts", PostSchema);