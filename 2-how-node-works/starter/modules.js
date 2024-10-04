// console.log(arguments);
// console.log(require("module").wrapper);

//module.exports
const C = require("./test-module-1");

const calculator1 = new C();
console.log(calculator1.add(2, 5));

//exports
const calc2 = require("./test-module-2");
console.log(calc2.add(2, 3));

const { add, mul } = require("./test-module-2");
console.log(mul(2, 3));

//caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
