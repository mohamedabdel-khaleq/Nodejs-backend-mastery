// Buffer.byteLength() — حساب حجم البيانات بالـ Bytes

const english = "Hello";
console.log(english.length); // 5
console.log(Buffer.byteLength(english)); // 5

const arabic = "محمد";
console.log(arabic.length); // 4
console.log(Buffer.byteLength(arabic)); // 8 (UTF-8)

const mixed = "Hello محمد";
console.log(mixed.length); // 9
console.log(Buffer.byteLength(mixed)); // 14
