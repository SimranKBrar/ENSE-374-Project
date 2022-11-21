//setup
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const port = 3006;

const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());


const mongoose = require( 'mongoose' );

// connects to the "test" database (ensure mongod is running!)
// the later arguments fix some deprecation warnings
mongoose.connect( 'mongodb://localhost:27017/test', 
                  { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema ({
  username: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



const itemSchema = new mongoose.Schema ({
  _id : Number,
  text :String,
  price: String,
  desc: String,
  img: String,
  category: String,
  creator : userSchema
});
// this creates a collection called `games` (Weird, but intuitive)
//const Users = mongoose.model ( "Users", userSchema );
const Items = mongoose.model ( "Items", itemSchema );

const fs = require( "fs" ); 
const { stringify } = require("querystring");

app.listen (port, () => {

    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => { //front page
  res.sendFile(__dirname + "/register.html")
   
    console.log("A user requested the root route");
  });

  app.get("/list", (req, res) => { //form to list an item
    res.render("addItem");
    console.log("A user requested the root route");
  });

  app.get("/index", (req, res) => { //redirect to front page
    res.render("index");
    console.log("A user requested the root route");
  });

  app.get("/index.html", (req, res) => { //redirect to front page
    res.render("index");
    console.log("A user requested the root route");
  });

  app.get("/search", async(req, res) => {//search results or category results
    
    
    const items = await Items.find();
    console.log(items);
    const username =req.user.username;
        res.render("items", { username: username, items: items }); //send that alongside username to renders
    
    
   // res.render("items");

    console.log("A user requested the root route");
  });


  app.post("/additem", async(req, res) => { //search results or category results
    
    const items = await Items.count();

    let itemCount = items + 1;
    console.log(itemCount);

    const item = new Items({
      _id : itemCount,
      text : req.body.itemName,
      price:  req.body.itemPrice,
      desc:  req.body.itemDesc,
      img: req.body.itemFile,
      category:  req.body.itemCat,
      creator : req.user
  });
  
  item.save();
  
  console.log(req.body.itemName);
  console.log(req.body.itemPrice);
  console.log(req.body.itemDesc);
  console.log(req.body.itemFile);
  console.log(req.body.itemCat);
  
    res.redirect( "/index");
    console.log(req.user);
    console.log("Submitted the item list");
  });

  app.post("/itemdetail", async(req, res) => { //item detail page
    
    const items = await Items.find( { _id : req.body._id});
    console.log(items);
    res.render("itemDesc", { items: items });  // sends item to get rendered
    console.log("A user requested the root route");
  });

  app.post("/login", (req, res) => { //login route using passport
    console.log( "User " + req.body.username + " is attempting to log in" );
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                res.render( "index" ); 
            });
        }
    });
   
  
  });



  app.post("/register", (req, res) => { //register route using passport


    console.log( "User " + req.body.username + " is attempting to register" );
    if(req.body.auth == process.env.AUTHKEY){
      User.register({ username : req.body.username }, 
        req.body.password, 
        ( err, user ) => {
  if ( err ) {
  console.log( err );
  res.redirect( "/" );
  } else {
  passport.authenticate( "local" )( req, res, () => {
    res.redirect( "/index" );
  });
  }
  });
    }
    else{
      res.redirect( "/" );
    }
  
  });


  app.get("/cart.html", (req, res) => { //page for cart
    res.sendFile(__dirname + "/cart.html")
    console.log("A user requested the root route");
  });
  app.get("/checkout.html", (req, res) => { //checkout form
    res.sendFile(__dirname + "/checkout.html")
    console.log("A user requested the root route");
  });
  app.get("/menu.html", (req, res) => { //render menu page
    res.sendFile(__dirname + "/menu.html")
    console.log("A user requested the root route");
  });
  

  app.get("/add_product", (req, res) => { //front page
    res.sendFile(__dirname + "/add_product.html")
    console.log("A user requested the add product route");
  }); 
