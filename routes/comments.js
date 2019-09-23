var express = require("express");
var router = express.Router({ mergeParams: true });
var Camp = require("../models/campground");
var Comment = require("../models/comment");

//NEW
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

//CREATE
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

//EDIT
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, comment) => {
		res.render("comments/edit", { comment: comment, campId: req.params.id });
	});
});

//UPDATE
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if (!err) {
			//redirect to get 
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
		if (!err) {
			//redirect to get 
			res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		//acces database to get specific campground
		Comment.findById(req.params.comment_id, (err, comment) => {
			if (!err) {
				if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

module.exports = router;