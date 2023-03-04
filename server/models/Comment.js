const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    comment_user: {type: mongoose.Schema.Types.ObjectId, ref:"users"},
    text : {type:String}
});

module.exports = mongoose.model("comments", CommentSchema);