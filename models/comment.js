var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({ //creating Schema
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectID,
			ref: "User"
		},
		username: String
	}
});
module.exports = mongoose.model("Comment", commentSchema); //creating model and collection