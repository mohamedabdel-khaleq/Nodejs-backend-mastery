const fs = require("fs");

const writable = fs.createWriteStream("output.txt");

writable.write("Hello Node.js\n");
writable.write("Learning Streams\n");
writable.write("Backend Development\n");

writable.end();

writable.on("finish", () => {
  console.log("Writing Completed");
});

writable.on("error", (err) => {
  console.error("Error:", err.message);
});
