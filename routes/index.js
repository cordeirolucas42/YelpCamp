var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//LANDING PAGE
router.get("/", (req,res)=>{
	//render views page
	res.render("landing");
});

//AUTH ROUTES
router.get("/register",(req,res)=>{
	res.render("register");
});

router.post("/register",(req,res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err,user)=>{
		if(err){
			console.log(err)
			req.flash("error",err.message);
			return res.redirect("/register");
		} else {			
			passport.authenticate("local")(req,res,function(){	
				req.flash("success","Welcome!");
				res.redirect("/campgrounds");
			});
		}
	});
});

router.get("/login",(req,res)=>{
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req,res)=>{}
);

router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Successfully logged out");
    res.redirect("/login");
});

module.exports = router;