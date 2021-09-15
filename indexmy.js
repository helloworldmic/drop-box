const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.static("pages"));
//static method loads folder called pages, and diplay
//wrong: dropbox, should be the folder contain index.html
// if it's not called index.html, then have to write on browser link
// if it's called index.html, just type: localhost:8080 will direct to index.html
const cache = {};
const uploadDirectory = __dirname + path.sep + "uploaded";

app.get("/", (req, res) => {
  console.log("initial request ");
  res.sendFile(path.join(__dirname + "/pages/index.html"));
});
// home directory, /, is localhost:8080, not equal index.html
//the reason why we see index.html is bcoz of line20,
//we ask the server to send back index.html

//if need to test, need a route,app.post/ app.get+res.send
//i.e.request & response
//for get request, should not direct to /, coz you'll see / still
app.get("/data", (req, res) => {
  console.log("alternative req");
  //why not homedirectory / ?
  fs.readdir(uploadDirectory, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});
//https://www.npmjs.com/package/express-fileupload
app.post("/", (req, res) => {
  console.log(req.files.file);
  if (req.files.file) {
    // check existence of file
    cache[req.files.file] = write(req.files.file.name, req.files.file.data) //wrong: req.files.file
      .then(res.send(req.files.file.name));
  }
});
// for app.post here, no use to check error
// if (error) { console.log(error);}
//else { console.log(data); res.send(data); }
// https://expressjs.com/en/guide/routing.html
app.get("/uploaded/:filename", (req, res) => {
  console.log(req.params.filename);
  if (cache[req.params.filename]) {
    console.log("in cache");
    cache[req.params.filename].then((data) => {
      res.send(data);
      //not req.files.file.data, coz it's resolved fr write fn
    });
  } else {
    console.log("not in cache");
    cache[req.params.filename] = read(req.params.filename); // add this step if not in cache
    cache[req.params.filename].then((data) => {
      res.send(data);
    });
  }
});

app.listen(8080, () => {
  console.log("Application listening to port 8080");
});

//   req.body;
//   req.files;
//   res.send("file received"); //res.send &res.sendFile stop the res