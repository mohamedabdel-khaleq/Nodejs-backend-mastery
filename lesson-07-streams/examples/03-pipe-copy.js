const fs = require("fs");

fs.createReadStream("source.txt")
  .pipe(fs.createWriteStream("destination.txt"));
