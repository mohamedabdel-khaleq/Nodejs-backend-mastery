const fs = require("fs");

// Buffer output
const buffer = fs.readFileSync("./files/message.txt");
console.log(buffer);

// Read as a string
const text = fs.readFileSync("./files/message.txt", "utf8");
console.log(text);
