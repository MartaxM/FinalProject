const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    user: {type: mongoose.ObjectId},
    text : {type:String}
});

module.exports = mongoose.model("comments", CommentSchema);