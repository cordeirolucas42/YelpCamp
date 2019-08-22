var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({ //creating Schema
	text: String,
	author: String
});
module.exports = mongoose.model("Comment", commentSchema); //creating model and collection