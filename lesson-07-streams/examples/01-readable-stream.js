const fs = require("fs");

const readable = fs.createReadStream("data.txt");

readable.on("data", (chunk) => {
  console.log("New Chunk:");
  console.log(chunk.toString());
});

readable.on("end", () => {
  console.log("Reading Completed");
});

readable.on("error", (err) => {
  console.error("Error:", err.message);
});
