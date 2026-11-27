const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.end("Home Page");
  } else if (req.method === "GET" && req.url === "/about") {
    res.end("About Page");
  } else if (req.method === "GET" && req.url === "/products") {
    res.end("Products Page");
  } else {
    res.statusCode = 404;
    res.end("Route Not Found");
  }
});

server.listen(3000, () => console.log("Listening on port 3000"));
