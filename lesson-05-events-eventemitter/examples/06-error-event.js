const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.on("error", err => console.error("Handled:", err.message));
emitter.emit("error", new Error("Something failed"));
