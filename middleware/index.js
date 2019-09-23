var Camp = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj={};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		//acces database to get specific campground
		Camp.findById(req.params.id, (err, camp) => {
			if (!err) {
				if (camp.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error","You need to own the post to do this");
					res.redirect("back");
				}
			} else {
				req.flash("error","Campground not found");
			}
		});
	} else {
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		//acces database to get specific campground
		Comment.findById(req.params.comment_id, (err, comment) => {
			if (!err) {
				if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error","You need to own the comment to do this");
					res.redirect("back");
				}
			} else {
				req.flash("error","Comment not found");
			}
		});
	} else {
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

module.exports = middlewareObj;