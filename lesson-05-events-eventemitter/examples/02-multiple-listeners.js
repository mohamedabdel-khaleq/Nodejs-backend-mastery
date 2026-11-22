const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.on("orderCreated", () => console.log("Save order"));
emitter.on("orderCreated", () => console.log("Send notification"));
emitter.on("orderCreated", () => console.log("Update statistics"));
emitter.emit("orderCreated");
