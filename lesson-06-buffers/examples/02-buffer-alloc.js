// Buffer.alloc(size) allocates and zero-fills the Buffer.
const buffer = Buffer.alloc(5);

console.log(buffer); // <Buffer 00 00 00 00 00>
console.log(buffer.length); // 5
