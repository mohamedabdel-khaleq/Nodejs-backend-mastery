const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.on("userRegistered", user => console.log(`${user.name} | ${user.email}`));
emitter.emit("userRegistered", {name:"Mohamed", email:"mohamed@example.com"});
