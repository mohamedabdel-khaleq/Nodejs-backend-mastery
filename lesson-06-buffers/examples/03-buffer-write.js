// Write text into an allocated Buffer.
const buffer = Buffer.alloc(10);
const bytesWritten = buffer.write("Node.js");

console.log("Buffer:", buffer);
console.log("Size:", buffer.length);
console.log("Bytes written:", bytesWritten);
console.log("Written text:", buffer.subarray(0, bytesWritten).toString());
