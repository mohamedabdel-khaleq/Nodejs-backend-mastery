const fs = require("fs");
const { pipeline } = require("stream");

pipeline(
  fs.createReadStream("source.txt"),
  fs.createWriteStream("destination.txt"),
  (err) => {
    if (err) {
      console.error("Pipeline Failed:", err.message);
      return;
    }

    console.log("File Copied Successfully");
  }
);
