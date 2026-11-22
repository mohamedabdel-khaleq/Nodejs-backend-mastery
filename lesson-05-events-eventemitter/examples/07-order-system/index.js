const events = require("./events");
const { createOrder } = require("./order");
let count = 0;
events.on("orderCreated", order => console.log(`Notification: Order #${order.id} received!`));
events.on("orderCreated", () => { count++; console.log(`Statistics updated: ${count} order(s)`); });
createOrder({id:101, product:"Keyboard", price:1200});