const http = require("http");

const file = require("fs");

const url = require("url");

const host = "localhost";

const port = 8000;

const server = http.createServer(processRequest); // create the server object
server.listen(port, host, () => {
  // Bind the port and host to the server
  console.log("Your server is running!");
});

function processRequest(request, response) {
  let urlObject = url.parse(request.url, true);
  // console.log(urlObject);

  //First request the index .html
  if (request.method === "GET") {
    if (request.url === "/" || request.url === "/index.html") {
      file.readFile("../index.html", "utf8", function (err, contents) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/html" });
          response.end();
          return;
        }
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(contents);
      });
    } else if (request.url.indexOf(".jpeg") > -1) {
      let location = request.url;
      location = location.substr(1);
      console.log(location);

      file.readFile("../" + location, function (err, contents) {
        if (err) {
          response.writeHead(500, { "Content-Type": "image/jpeg" });
          response.end();
          return;
        }
        response.writeHead(200, { "Content-Type": "image/jpeg" });
        response.end(contents);
      });
    } else if (request.url.indexOf(".svg") > -1) {
      let location = request.url;
      location = location.substr(1);

      file.readFile("../" + location, function (err, contents) {
        if (err) {
          response.writeHead(500, { "Content-Type": "image/svg+xml" });
          response.end();
          return;
        }
        response.writeHead(200, { "Content-Type": "image/svg+xml" });
        response.end(contents);
      });
    } else if (request.url === "/view_pickup.html") {
      file.readFile("../view_pickup.html", "utf8", function (err, contents) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/html" });
          response.end();
          return;
        }
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(contents);
      });
    } else if (request.url === "/add.html") {
      file.readFile("../add.html", "utf8", function (err, contents) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/html" });
          response.end();
          return;
        }
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(contents);
      });
    } else if (request.url === "/drop.html") {
      file.readFile("../drop.html", "utf8", function (err, contents) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/html" });
          response.end();
          return;
        }
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(contents);
      });
    } else if (request.url === "/css/comm-fridge.css") {
      file.readFile("../css/comm-fridge.css", "utf8", function (err, contents) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/css" });
          response.end();
          return;
        }

        response.writeHead(200, { "Content-Type": "text/css" });
        response.end(contents);
      });
    } else if (request.url === "/js/comm-fridge.js") {
      file.readFile("./comm-fridge.js", "utf8", function (err, contents) {
        if (err) {
          response.writeHead(500, {
            "Content-Type": "application/javascript",
          });
          response.end();
          return;
        }
        response.writeHead(200, { "Content-Type": "application/javascript" });
        response.end(contents);
      });
    } else if (request.url === "/js/comm-fridge-data.json") {
      file.readFile(
        "./comm-fridge-data.json",
        "utf8",
        function (err, contents) {
          if (err) {
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end();
            return;
          }
          //fridges = JSON.parse(contents);

          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(contents);
        }
      );
    } else if (request.url === "/js/comm-fridge-items.json") {
      file.readFile(
        "./comm-fridge-items.json",
        "utf8",
        function (err, contents) {
          if (err) {
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end();
            return;
          }
          fridgeItem = JSON.parse(contents);
          //console.log(contents);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(contents);
        }
      );
    } else {
      response.statusCode = 404;
      response.write("Unknown resource.");
      response.end();
    }
  } else if (request.method === "POST") {
    if (request.url === "/endpoint") {
      let data = "";
      request.on("data", (chunk) => {
        data += chunk.toString();
      });
      request.on("end", () => {
        const fridgeData = JSON.parse(data);
        console.log(fridgeData);
        file.readFile(
          "comm-fridge-data.json",
          "utf-8",
          function (err, contents) {
            if (err) {
              throw err;
            }
            let fridgeJson = JSON.parse(contents); //contents is the contents of the json file.
            let aFridge = fridgeJson.filter(
              (fridge) => fridge.name === fridgeData.fridgeName
            )[0];
            let aFridgeItem = aFridge.items.filter(
              (item) => item.name === fridgeData.itemName
            );
            aFridge.num_items_accepted += parseInt(fridgeData.itemQty);
            aFridge.can_accept_items -= fridgeData.itemQty;
            if (aFridgeItem.length === 1) {
              //if the item already exists, update the quantity
              aFridgeItem.quantity += fridgeData.itemQty;
            } else {
              //else add new item
              aFridge.items.push({
                name: fridgeData.itemName,
                quantity: fridgeData.itemQty,
                type: fridgeData.itemType,
                img: fridgeData.img,
              });
            }

            file.writeFile(
              "comm-fridge-data.json",
              JSON.stringify(fridgeJson),
              (writeError) => {
                if (writeError) {
                  throw writeError;
                }
                response.writeHead(200, {
                  "Content-Type": "application/javascript",
                });
                response.end();
              }
            );
          }
        );
      });
    } else if (request.url === "/newItem") {
      let data = "";
      request.on("data", (chunk) => {
        data += chunk.toString();
      });

      request.on("end", () => {
        const clientData = JSON.parse(data);

        let newItem = {
          name: clientData.name,
          type: clientData.type,
          img: clientData.img,
        };

        fridgeItem.push(newItem);

        file.writeFile(
          "comm-fridge-items.json",
          JSON.stringify(fridgeItem),
          function (writeError) {
            if (writeError) {
              console.log(
                "An error occured when writing to the fridges-items.json"
              );
              throw writeError;
            } else {
              file.readFile(
                "comm-fridge-items.json",
                "utf-8",
                function (err, contents) {
                  if (err) {
                    response.writeHead(500, {
                      "Content-Type": "application/javascript",
                    });
                    response.end();
                    return;
                  }
                  response.writeHead(200, {
                    "Content-Type": "application/javascript",
                  });
                  response.end(contents);
                }
              );
            }
          }
        );
      });
    } else {
      response.statusCode = 404;
      response.write("Unknown resource.");
      response.end();
    }
  }
}
