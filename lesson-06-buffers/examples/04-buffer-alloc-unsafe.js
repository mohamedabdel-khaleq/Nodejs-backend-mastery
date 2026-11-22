// allocUnsafe() does not guarantee that memory is initialized.
// Always overwrite the bytes you plan to read or expose.
const buffer = Buffer.allocUnsafe(5);
const bytesWritten = buffer.write("Hello");

console.log(buffer.subarray(0, bytesWritten).toString()); // Hello
