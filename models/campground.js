var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({ //creating Schema
	name: String,
	image: String,
	description: String,
	comments: [
		{
		   type: mongoose.Schema.Types.ObjectId,
		   ref: "Comment"
		}
	 ]
});
module.exports = mongoose.model("Camp", campSchema); //creating model and collection