// Mini Challenge — Buffer Operations

const a = Buffer.from("Hi ");
const b = Buffer.from("Node");

const joined = Buffer.concat([a, b], 5);
const text = joined.toString();

console.log(text); // Hi No
console.log(joined.length); // 5
console.log(Buffer.isBuffer(text)); // false
console.log(Buffer.byteLength(text)); // 5
