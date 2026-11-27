const _ = require("lodash");

const users = [
  { id: 1, name: "Ahmed", age: 20 },
  { id: 2, name: "Mohamed", age: 25 },
  { id: 3, name: "Ali", age: 17 },
  { id: 4, name: "Omar", age: 30 },
];

const adults = _.filter(users, (user) => user.age >= 18);
const sortedByAge = _.sortBy(users, "age");
const names = _.map(users, "name");

console.log("Adults:", adults);
console.log("Sorted:", sortedByAge);
console.log("Names:", names);
