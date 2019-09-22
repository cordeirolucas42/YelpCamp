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
			console.log(err);
			return res.render("register");
		} else {
			passport.authenticate("local")(req,res,function(){
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
    res.redirect("/login");
});

//MIDDLEWARE
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;