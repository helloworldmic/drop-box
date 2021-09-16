/*********************************************
 * RMB:change to localhost:8080, not just click and open
 * index.html!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *************************************/

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
function write(name, body) {
  //file name, body: content of file
  //use node.js 14.17.6 documentation
  return new Promise((resolve, reject) => {
    fs.writeFile(uploadDirectory + path.sep + name, body, (err) => {
      // wrong: "uploaded"
      //file can be: <string> | <Buffer> | <URL> | <integer>
      if (err) {
        console.log(error);
        reject(err); //no return
      } else {
        resolve(name); //not body
      }
    });
  }).then(read); // invoke read fn
}

function read(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(uploadDirectory + path.sep + filename, (err, data) => {
      // no data, not __dirname
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
//this part is to understand what need to be / , home directory
/*
app.get("/", (req, res) => {
  console.log("initial request ");
  res.sendFile(path.join(__dirname + "/pages/index.html"));
});
*/

// home directory, /, is localhost:8080, not equal index.html
//the reason why we see index.html is bcoz of line20,
//we ask the server to send back index.html

//if need to test, need a route,app.post/ app.get+res.send   i.e.request & response
//why not homedirectory / ? for this get request, should not direct to /, coz you'll still see /, ie not going to other pages
//this part: make a request to server to list out all of the files within the folder uploaded
app.get("/filesinfolder", (req, res) => {
  console.log("hello world");
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
  console.log("getting here");
  // console.log(req.files); not req.files.file (looking at its parents is a better way to debug)
  console.log(req.files.data);
  if (req.files.data.name) {
    //all change fr (req.files.file.name), coz indemy.js, ajsx, store as data:formData, not file:formData
    console.log("inside if"); //put here to check how far the code runs and whether the last line runs, if last line runs, it shows in console.log
    // check existence of file
    cache[req.files.data.name] = write(
      req.files.data.name,
      req.files.data.data
    ); //wrong: req.files.file
    cache[req.files.data.name].then(() => {
      res.send(req.files.data.name);
    });
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
    cache[req.params.filename].then((body) => {
      //not:data
      res.send(body); //not:data
      //not req.files.file.data, coz it's resolved fr write fn
    });
  } else {
    console.log("not in cache");
    cache[req.params.filename] = read(req.params.filename); // add this step if not in cache
    cache[req.params.filename].then((body) => {
      //not: data
      res.send(body);
    });
  }
});

app.listen(8080, () => {
  console.log("Application listening to port 8080");
});

//   req.body;
//   req.files;
//   res.send("file received"); //res.send &res.sendFile stop the res
