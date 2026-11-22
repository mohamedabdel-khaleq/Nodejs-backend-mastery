const EventEmitter = require("events");
const emitter = new EventEmitter();
function sayHello(){console.log("Hello");}
emitter.on("greet", sayHello);
emitter.off("greet", sayHello);
emitter.emit("greet");
