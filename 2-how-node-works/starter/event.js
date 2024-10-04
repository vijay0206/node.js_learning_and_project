const EventEmitter = require("events");

const http = require("http");

class Sale extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sale();

myEmitter.on("newSale", () => {
  console.log("There was a new Sale");
});

myEmitter.on("newSale", () => {
  console.log("additional logging");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock`);
});

myEmitter.emit("newSale", 9);

///////////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request Received");
  console.log(req.url);
  res.end("Request Received");
});

server.on("request", (req, res) => {
  console.log("request listened again");
});

server.on("close", () => {
  console.log("Server Closed ");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("waiting for requests.....");
});
