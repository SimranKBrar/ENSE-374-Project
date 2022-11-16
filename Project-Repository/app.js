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

 