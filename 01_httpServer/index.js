let http = require('http');
let fs = require('fs');

const server = http.createServer((req, res) => {
  res.write("Hello Manpreet here\n");
  let log = `Time : ${Date.now()}  URL: ${req.url} \n`
  fs.appendFileSync("log.txt", log)
  res.end("\nServer end Response");
})

server.listen(3000, () => {
  console.log("Server running on port 3000");
});