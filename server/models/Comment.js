const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/**
 * Comment schema
 *  comment_user ObjectId of the user who wrote the comment
 *  text comment content
 * 
 */
let CommentSchema = new Schema({
    comment_user: {type: mongoose.Schema.Types.ObjectId, ref:"users"},
    text : {type:String}
});

module.exports = mongoose.model("comments", CommentSchema);