const fs = require("fs");

console.log("1 - Start");

fs.readFile("./files/message.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("File content:", data);
});

console.log("2 - Continue");
