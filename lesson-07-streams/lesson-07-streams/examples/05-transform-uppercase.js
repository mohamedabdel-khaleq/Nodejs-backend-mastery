const fs = require("fs");
const { Transform, pipeline } = require("stream");

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

pipeline(
  fs.createReadStream("source.txt"),
  upperCaseTransform,
  fs.createWriteStream("uppercase.txt"),
  (err) => {
    if (err) {
      console.error("Error:", err.message);
      return;
    }

    console.log("Transformation Completed");
  }
);
