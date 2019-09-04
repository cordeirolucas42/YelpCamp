// APP INITIALIZATION
var express = require("express"); //import NPM express
var app = express(); //initialize app with express
var request = require("request"); //import NPM require
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
var bodyParser = require("body-parser"); //import NPM body-parser
app.use(bodyParser.urlencoded({extended: true})); //setting body-parser
app.set("view engine", "ejs"); //setting ejs as standard
var theport = process.env.PORT || 5000;

//DATABASE INITIALIZATION
//REMEMBER TO START MONGOD IN ANOTHER TERMINAL
var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// heroku config:get MONGODB_URI
var uri = 'mongodb://heroku_kwqtcvpl:6vc6v5m55i5v41jb0tj5hejgvl@ds211368.mlab.com:11368/heroku_kwqtcvpl';
var options = {
	"server": {
		"socketOptions": {
			"keepAlive": 300000,
			"connectTimeoutMS": 30000
		}
	},
	"replset": {
		"socketOptions": {
			"keepAlive": 300000,
			"connectTimeoutMS": 30000
		}
	}
}
mongoose.connect(uri, options);
seedDB = require("./seeds");
seedDB();
var Camp = require("./models/campground");
var Comment = require("./models/comment");

//LANDING PAGE
app.get("/", (req,res)=>{
	//render views page
	res.render("landing");
});

//INDEX - SHOW CAMP GROUNDS
app.get("/campgrounds", (req,res)=>{
	//access database and use it to render views page
	Camp.find({},(err,campgrounds)=>{
		if(!err){
			//render views page
			res.render("campgrounds/campgrounds",{campgrounds:campgrounds});
		}
	});	
});

//NEW - FORM TO MAKE A NEW CAMPGROUND
app.get("/campgrounds/new", (req,res)=>{
	//render views page
	res.render("campgrounds/new");
});

//SHOW - PAGE FOR EACH CAMPGROUND
app.get("/campgrounds/:id", (req,res)=>{
	//get data from get request
	var id = req.params.id;
	//acces database to get specific campground
	Camp.findById(id).populate("comments").exec(function(err,camp){
		if(!err){
			console.log(camp);
			res.render("campgrounds/show",{camp:camp});
		}
	});
});

//EDIT - FORM TO EDIT CAMPGROUND STILL NOT EDITING ANYTHING
app.get("/campgrounds/:id/edit", (req,res)=>{
	//get data from get request
	var id = req.params.id;
	//acces database to get specific campground
	Camp.findById(id,(err,camp)=>{
		if(!err){
			res.render("campgrounds/edit",{camp:camp});
		}
	});
});

//UPDATE - UPDATE INFORMATIONS IN CAMP GROUND
app.put("/campgrounds/:id",(req,res)=>{
	Camp.findByIdAndUpdate(req.params.id,req.body.camp, (err,camp)=>{
		if(!err){
			//redirect to get /campgrounds
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY - DELETES A CAMP GROUND
app.delete("/campgrounds/:id",(req,res)=>{
	Camp.findByIdAndRemove(req.params.id,(err,camp)=>{
		if(!err){
			//redirect to get /campgrounds
			res.redirect("/campgrounds");
		}
	});
});

//CREATE - CREATE NEW CAMP GROUNDS
app.post("/campgrounds", (req,res)=>{
	//get data from post request
	var newCampground = req.body.camp;
	//insert new campground in the database
	Camp.create(newCampground,(err,camp)=>{
		if(!err){
			//redirect to get /campgrounds
			res.redirect("/campgrounds");
		}
	});	
});

// app.get("/campgrounds/:id/comments", (req,res)=>{

// });

app.get("/campgrounds/:id/comments/new", (req,res)=>{
	//get data from get request
	var id = req.params.id;
	//acces database to get specific campground
	Camp.findById(id).populate("comments").exec(function(err,camp){
		if(!err){
			console.log(camp);
			res.render("comments/new",{camp:camp});
		}
	});
});

app.post("/campgrounds/:id/comments", (req,res)=>{
	//get data from get request
	var id = req.params.id;
	//acces database to get specific campground
	Camp.findById(id).exec(function(err,camp){
		if(!err){
			Comment.create(req.body.comment,(err,comment)=>{
				if(!err){
					camp.comments.push(comment);
					camp.save();
					res.redirect("/campgrounds/"+camp._id);
				}
			});			
		}
	});
});

// START SERVER
app.listen(theport,function(err){
	if (err){
		console.log(err);
	} else {
		console.log("Listening on port "+theport);
	}
});