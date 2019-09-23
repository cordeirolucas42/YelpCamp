// APP INITIALIZATION
var express = require("express"); //import NPM express
var app = express(); //initialize app with express
var passport = require("passport");
var localStrategy = require("passport-local");
var flash = require("connect-flash");
app.use(flash());
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
var bodyParser = require("body-parser"); //import NPM body-parser
app.use(bodyParser.urlencoded({extended: true})); //setting body-parser
app.set("view engine", "ejs"); //setting ejs as standard
var theport = process.env.PORT || 5000;

//get routes from other files
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//DATABASE INITIALIZATION 
//REMEMBER TO START MONGOD IN ANOTHER TERMINAL
var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// heroku config:get MONGODB_URI 
var uri = 'mongodb://heroku_kwqtcvpl:6vc6v5m55i5v41jb0tj5hejgvl@ds211368.mlab.com:11368/heroku_kwqtcvpl';
mongoose.connect(process.env.MONGODB_URI);

// //SEEDING THE DATABASE
// seedDB = require("./seeds");
// seedDB();

var User = require("./models/user");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "yada yada yada",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

// START SERVER
app.listen(theport,function(err){
	if (err){
		console.log(err);
	} else {
		console.log("Listening on port "+theport);
	}
});