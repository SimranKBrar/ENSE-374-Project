//setup
const express = require("express");
const mongoose = require( 'mongoose' );
const app = express();
app.set("view engine", "ejs");
const port = 3007;

const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();

var bodyParser = require('body-parser');
  
var path = require('path');


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());





mongoose.connect( 'mongodb://localhost:27017/test', 
                  { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema ({ //schema for users
  username: String,
  password: String,
});


userSchema.plugin(passportLocalMongoose);  //passport setup for login and signup pages

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



const itemSchema = new mongoose.Schema ({ //item schema 
  _id : Number,
  text :String,
  price: String,
  desc: String,
  img:
  {
      data: Buffer,
      contentType: String
  },
  category: String,
  creator : userSchema
});
itemSchema.index({text: 'text'});

const Items = mongoose.model ( "Items", itemSchema );

const contactSchema = new mongoose.Schema ({ //item schema 
  _id : Number,
  text :String,
  item: itemSchema,
  contactor: userSchema,
  contacted : userSchema
});

const Contacts = mongoose.model ( "Contacts", contactSchema );
var multer = require('multer');
  
var storage = multer.diskStorage({ // required for image upload
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage }); //required for image upload


const fs = require( "fs" ); 
const { stringify } = require("querystring");
















app.listen (port, () => {

    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => { //front page
  res.sendFile(__dirname + "/register.html")
   
    console.log("A user requested the register page");
  });

  app.get("/list", (req, res) => { //form to list an item
    res.render("addItem");
    console.log("A user requested the Add product page");
  });

  app.get("/index", async(req, res) => { //redirect to front page
    const items = await (await Items.find().limit(4).sort({_id : -1}));
    const u = req.user.username;
    res.render("index", {  items: items, u : u });
    console.log("A user requested the root route");
  });

  app.get("/index.html", (req, res) => { //redirect to front page
    res.render("index");
    console.log("A user requested the dashboard page");
  });

  app.get("/my_products", (req, res) => { //redirect to my products page
    res.render("my_products");
    console.log("A user requested the my product page");
  });

  app.post("/search", async(req, res) => {//search results
    
    let searchString = req.body.searchText;
    const items = await Items.find({$text: {$search: searchString}});
    const username =req.user.username;
    res.render("search", { username: username, items: items }); //send that alongside username to renders
    
    console.log("A user requested the root route");
  });


  app.get("/allItems", async(req, res) => {//displays all items
    
    
    const items = await Items.find();
  
    const username =req.user.username;
        res.render("shopall", { username: username, items: items }); //send that alongside username to renders
    
    console.log("A user requested the root route");
  });

 
  app.post("/category", async(req, res) => {//displays items based on which category is slected
   
    
    const items = await Items.find({category : req.body.category });
    
    const username =req.user.username;
    let category = req.body.category;
    res.render("items", { username: username, items: items, category :category }); //send that alongside username to renders
    
  });

  

  app.post("/additem", upload.single('image'), async(req, res) => { //add item to data base from form
    
    const items = await Items.count();

    let itemCount = items + 1;
   

    const item = new Items({
      _id : itemCount,
      text : req.body.itemName,
      price:  req.body.itemPrice,
      desc:  req.body.itemDesc,
      img: {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    },
      category:  req.body.itemCat,
      creator : req.user
  });
  
  item.save();
  
  
    res.redirect( "/index");
    
    console.log("Submitted the item list");
  });

  app.post("/itemdetail", async(req, res) => { //item detail page
    
    const items = await Items.find( { _id : req.body._id});
  
    const username = req.user.username;
    res.render("itemDesc", { items: items, username: username });  // sends item to get rendered
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
              res.redirect("/index");
            });
        }
    });
   
  
  });

  app.post("/register", (req, res) => { //register route using passport
    console.log( "User " + req.body.username + " is attempting to register" );
      User.register({ username : req.body.username }, 
        req.body.password, 
        ( err, user ) => {
  if ( err ) {
  console.log( err );
  res.redirect( "/" );
  } else {
  passport.authenticate( "local" )( req, res, () => {
    res.redirect( "/" );
  });
  }
  });
  });



  app.post("/contact", async(req, res) => { //redirects to contact form
    const items = await Items.find( { _id : req.body._id});
   
    console.log("A user requested the conatct form");
    
    res.render("contact", { items: items });
  });

  app.get("/contactPage", async(req, res) => { //redirects to contact page
    let username = req.user;
    const contacts = await Contacts.find({contacted : username});

    console.log("A user requested the conatct form");
    
    res.render("contaced", { contacts: contacts });
  });
 

  app.post("/contactForm", async(req, res) => { //redirects to contact form
   
  

    // save conatct info within its own data table

    const contacts = await Contacts.count();

    const items = await Items.find({_id : req.body._id});
    const item = items[0];
    let contactCount = contacts + 1;


    const contact = new Contacts({
      _id : contactCount,
      text : req.body.contactInfo,
      item: item,
      contactor: req.user,
      contacted : item.creator
  });
  
  contact.save();
  
 
    res.redirect( "/index");
 
    console.log("A user requested the contact form");
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
