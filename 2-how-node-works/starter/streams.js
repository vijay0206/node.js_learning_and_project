const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //   Solution 1:
  // -------------------------------
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     res.end(data);
  //   });
  //
  //   solution 2 streams
  // ----------------------------
  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });
  //
  //   readable.on("end", () => {
  //     res.end();
  //   });
  //
  //   readable.on("error", (error) => {
  //     console.log(error);
  //     res.statusCode = 500;
  //     res.end("File not found");
  //   });

  // solution3
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  //readableSource.pipe(writableDestination)
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is listening");
});
