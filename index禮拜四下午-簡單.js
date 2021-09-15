// V1 Set up
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");

app.use(fileUpload());

const fs = require("fs");

let userCache = {};  //??????
console.log("USER CACHE: ", userCache);
console.log(Object.entries(userCache).length);
// setting up application level middleware
// handle json data in the body
app.use(express.json());
// handle data from forms
app.use(express.urlencoded({ extended: false }));

// user made middleware
app.use("/", (req, res, next) => {
  console.log(req.method);
  console.log(req.url);
  next();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

// You will need to send a file and store it
app.post("/form", (req, res) => {
  console.log(Object.entries(userCache).length);
  if (Object.entries(userCache).length <= 0) {
    console.log("in here");
    let data = fs.readFileSync("./users.json");
    userCache = JSON.parse(data);
    console.log("read user cache ", userCache);
  }

  console.log(req.body);
  userCache[req.body.fname] = {
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email,
    age: req.body.age,
  };

  console.log(userCache);
  console.log(req.files.file);

  fs.writeFile(
    `./uploaded/${req.files.file.name}`,
    req.files.file.data,
    (err) => {
      if (err) {
        console.log(err);
        console.log("Error");
      }
    }
  );

  fs.writeFile("./users.json", JSON.stringify(userCache), (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/user/:firstname", (req, res) => {
  if (userCache[req.params.firstname]) {
    res.send(userCache[req.params.firstname]);
  } else {
    fs.readFile("./users.json", (err, data) => {
      if (err) {
        console.log(err);
      }
      userCache = JSON.parse(data);
      if (userCache[req.params.firstname]) {
        res.send(userCache[req.params.firstname]);
      } else {
        res.send("User not found");
      }
    });
  }
});

app.get("/weather", (req, res) => {
  res.send("Sunny");
});
app.get("/temperature", (req, res) => {
  res.send("Really hot");
});
app.get("/student/:name", (req, res) => {
  if (req.params.name === "Sam") {
    res.send("You are the teacher Sam....");
  }
  res.send("Welcome to the page student " + req.params.name);
});

app.listen(8080, () => {
  console.log("Application listening to port 8080");
});

/* V2 Setup
const app = require('express')()
*/
