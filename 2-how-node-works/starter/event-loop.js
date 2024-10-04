const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1;

setTimeout(() => console.log("Timer1 finished"), 0);
setImmediate(() => console.log("Immediate1 finished"));

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("-------------");

  setTimeout(() => console.log("Timer2 finished"), 0);
  setTimeout(() => console.log("Timer3 finished"), 3000);
  setImmediate(() => console.log("Immediate2 finished"));

  process.nextTick(() => {
    console.log("process.nexttick");
  });

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "password is encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "password is encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "password is encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "password is encrypted");

  console.log("End of I/O callback function.");
});

console.log("Hello from the top level code");
