function write(name, body) {
  //file name, body: content of file
  //use node.js 14.17.6 documentation
  return new Promise((resolve, reject) => {
    fs.writeFile("uploaded", name, body, (err) => {
      // wrong: "uploaded"
      //file can be: <string> | <Buffer> | <URL> | <integer>
      if (err) {
        return reject(err);
      } else {
        resolve(body);
      }
    });
  }).then(read)// invoke read fn
}

function read(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + Path2D.sep + filename, data, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
