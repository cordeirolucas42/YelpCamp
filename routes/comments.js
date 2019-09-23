var express = require("express");
var router = express.Router({ mergeParams: true });
var Camp = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware");

//NEW
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
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
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
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
					req.flash("success","Succesfully created comment");
					res.redirect("/campgrounds/" + camp._id);
				}
			});
		}
	});
});

//EDIT
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, comment) => {
		res.render("comments/edit", { comment: comment, campId: req.params.id });
	});
});

//UPDATE
router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if (!err) {
			//redirect to get 
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
		if (!err) {
			//redirect to get
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;