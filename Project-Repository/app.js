//setup
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const port = 3004;


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const fs = require( "fs" ); 

app.listen (port, () => {

    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => { //front page
    res.sendFile(__dirname + "/index.html")
    console.log("A user requested the root route");
  });
  app.get("/list.html", (req, res) => { //front page
    res.sendFile(__dirname + "/list.html")
    console.log("A user requested the root route");
  });
  app.get("/cart.html", (req, res) => { //front page
    res.sendFile(__dirname + "/cart.html")
    console.log("A user requested the root route");
  });
  app.get("/index", (req, res) => { //front page
    res.sendFile(__dirname + "/index.html")
    console.log("A user requested the root route");
  });
  app.get("/index.html", (req, res) => { //front page
    res.sendFile(__dirname + "/index.html")
    console.log("A user requested the root route");
  });
  app.get("/search.html", (req, res) => { //front page
    res.sendFile(__dirname + "/search.html")
    console.log("A user requested the root route");
  });
  app.get("/itemdetail.html", (req, res) => { //front page
    res.sendFile(__dirname + "/itemdetail.html")
    console.log("A user requested the root route");
  });
  app.get("/checkout.html", (req, res) => { //front page
    res.sendFile(__dirname + "/checkout.html")
    console.log("A user requested the root route");
  });
  app.get("/menu.html", (req, res) => { //front page
    res.sendFile(__dirname + "/menu.html")
    console.log("A user requested the root route");
  });