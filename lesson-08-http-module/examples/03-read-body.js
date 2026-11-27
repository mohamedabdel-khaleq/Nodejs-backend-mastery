const http = require("http");

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/data") {
    try {
      const data = await readRequestBody(req);
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ received: data }));
    } catch {
      res.statusCode = 400;
      res.end("Invalid JSON");
    }
    return;
  }

  res.end("Send POST /data with JSON");
});

server.listen(3000, () => console.log("Listening on 3000"));
