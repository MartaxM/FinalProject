const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let PostSchema = new Schema({
    post_user:{type: mongoose.Schema.Types.ObjectId, ref:"users"},
    title : {type:String},
    text : {type:String},
    code: {type:String},
    comments:[{type: mongoose.Schema.Types.ObjectId, ref:"comments"}]
    
});

module.exports = mongoose.model("posts", PostSchema);