const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.on("test", () => console.log("A"));
emitter.once("test", () => console.log("B"));
emitter.on("test", () => console.log("C"));
emitter.emit("test");
emitter.emit("test");
emitter.emit("test");
