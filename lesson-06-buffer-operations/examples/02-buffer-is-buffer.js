// Buffer.isBuffer() — التحقق من نوع القيمة

const data = Buffer.from("Hello Node.js");

console.log(Buffer.isBuffer(data)); // true
console.log(Buffer.isBuffer("Hello Node.js")); // false
console.log(Buffer.isBuffer(100)); // false
console.log(Buffer.isBuffer([1, 2, 3])); // false

function processData(value) {
  if (Buffer.isBuffer(value)) {
    console.log("This is a Buffer");
    console.log(value.toString());
  } else {
    console.log("This is not a Buffer");
  }
}

processData(Buffer.from("Node.js"));
processData("React.js");
