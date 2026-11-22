const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.on("welcome", () => console.log("Welcome!"));
emitter.emit("welcome");
