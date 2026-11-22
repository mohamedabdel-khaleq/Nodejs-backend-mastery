const events = require("./events");
function createOrder(order){ console.log(`Order created: #${order.id}`); events.emit("orderCreated", order); }
nmodule.exports = { createOrder };