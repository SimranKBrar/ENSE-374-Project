//setup
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const port = 3005;


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const fs = require( "fs" ); 

app.listen (port, () => {

    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => { //front page
  res.sendFile(__dirname + "/register.html")
  // res.render("index");
    console.log("A user requested the root route");
  });

  app.get("/list", (req, res) => { //form to list an item
    res.render("addItem");
    console.log("A user requested the root route");
  });

  app.get("/index", (req, res) => { //redirect to front page
    res.redirect( "/" );
    console.log("A user requested the root route");
  });

  app.get("/index", (req, res) => { //redirect to front page
    res.redirect( "/" );
    console.log("A user requested the root route");
  });

  app.get("/search", (req, res) => { //search results or category results
    res.render("items");
    console.log("A user requested the root route");
  });
  app.get("/itemdetail", (req, res) => { //item detail page
    res.render("itemDesc");
    console.log("A user requested the root route");
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
