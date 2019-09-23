var express = require("express");
var router = express.Router();
var Camp = require("../models/campground");
var middlewareObj = require("../middleware");

//INDEX - SHOW CAMP GROUNDS
router.get("/", (req, res) => {
	//access database and use it to render views page
	Camp.find({}, (err, campgrounds) => {
		if (!err) {
			//render views page
			res.render("campgrounds/campgrounds", { campgrounds: campgrounds });
		}
	});
});

//NEW - FORM TO MAKE A NEW CAMPGROUND
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
	//render views page
	res.render("campgrounds/new");
});

//SHOW - PAGE FOR EACH CAMPGROUND
router.get("/:id", (req, res) => {
	//get data from get request
	var id = req.params.id;
	//acces database to get specific campground
	Camp.findById(id).populate("comments").exec(function (err, camp) {
		if (!err) {
			res.render("campgrounds/show", { camp: camp });
		}
	});
});

//EDIT - FORM TO EDIT CAMPGROUND STILL NOT EDITING ANYTHING
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res) => {
	Camp.findById(req.params.id, (err, camp) => {
		res.render("campgrounds/edit", { camp: camp });
	});
});

//UPDATE - UPDATE INFORMATIONS IN CAMP GROUND
router.put("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
	Camp.findByIdAndUpdate(req.params.id, req.body.camp, (err, camp) => {
		if (!err) {
			//redirect to get 
			res.redirect(req.params.id);
		}
	});
});

//DESTROY - DELETES A CAMP GROUND
router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
	Camp.findByIdAndRemove(req.params.id, (err, camp) => {
		if (!err) {
			//redirect to get 
			res.redirect("/campgrounds");
		}
	});
});

//CREATE - CREATE NEW CAMP GROUNDS
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	//get data from post request
	var newCampground = req.body.camp;
	newCampground.author = author;
	//insert new campground in the database
	Camp.create(newCampground, (err, camp) => {
		if (!err) {
			//redirect to get 
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;