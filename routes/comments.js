var express = require("express");
var router = express.Router({ mergeParams: true });
var Camp = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, (req, res) => {
	//get data from get request
	var id = req.params.id;
	//acces database to get specific campground
	Camp.findById(id).populate("comments").exec(function (err, camp) {
		if (!err) {
			console.log(camp);
			res.render("comments/new", { camp: camp });
		}
	});
});

router.post("/", isLoggedIn, (req, res) => {
	//get data from get request
	var id = req.params.id;
	var newComment = {
		text: req.body.comment,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	};
	//acces database to get specific campground
	Camp.findById(id).exec(function (err, camp) {
		if (!err) {
			Comment.create(newComment, (err, comment) => {
				if (!err) {
					camp.comments.push(comment);
					camp.save();
					res.redirect("/campgrounds/" + camp._id);
				}
			});
		}
	});
});

//MIDDLEWARE
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;