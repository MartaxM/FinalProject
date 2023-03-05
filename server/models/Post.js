const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Post schema
 *  post_user ObjectId of the user who wrote the post
 *  title post title
 *  text post content
 *  code snippet of code
 *  comments list of ObjectIds of the Comments answering the post
 *  
 *  comments are references
 */

let PostSchema = new Schema({
    post_user:{type: mongoose.Schema.Types.ObjectId, ref:"users"},
    title : {type:String},
    text : {type:String},
    code: {type:String},
    comments:[{type: mongoose.Schema.Types.ObjectId, ref:"comments"}]
    
});

module.exports = mongoose.model("posts", PostSchema);