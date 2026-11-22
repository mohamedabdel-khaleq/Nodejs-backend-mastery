// Buffer.concat() — جمع عدة Buffers في Buffer جديدة

const buffer1 = Buffer.from("Hello ");
const buffer2 = Buffer.from("Node ");
const buffer3 = Buffer.from("JS");

const result = Buffer.concat([buffer1, buffer2, buffer3]);

console.log(result.toString()); // Hello Node JS
console.log(result.length); // 13

// تحديد طول الناتج
const a = Buffer.from("ABC");
const b = Buffer.from("DEF");
const c = Buffer.from("GHI");

const limited = Buffer.concat([a, b, c], 5);

console.log(limited.toString()); // ABCDE
console.log(limited.length); // 5
