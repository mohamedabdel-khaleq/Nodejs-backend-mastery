const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Hello From Node.js Server!");
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
