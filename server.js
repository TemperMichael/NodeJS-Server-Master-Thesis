'use strict'

var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  port = 3000;

const ws = require("ws");

const server = http.createServer(function (request, response) {

  var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd(), uri);

  var contentTypesByExtension = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  };

  fs.exists(filename, function (exists) {
    if (!exists) {
      response.writeHead(404, {
        "Content-Type": "text/plain"
      });
      response.write("Error 404 - File " + uri + " Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += 'index.html';

    fs.readFile(filename, "binary", function (err, file) {
      if (err) {
        response.writeHead(500, {
          "Content-Type": "text/plain"
        });
        response.write("SERVER ERROR:" + err + "\n");
        response.end();
        return;
      }

      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) headers["Content-Type"] = contentType;
      response.writeHead(200, headers);
      response.write(file, "binary");
      response.end();
    });
  });

}).setTimeout(0);

server.listen(port, () => {
  console.log('Server is running on port: %s', port);
});

server.on('error', function (exc) {
  sys.log("Server Error: " + exc);
});

const wsServer = new ws.Server({
  server
});

wsServer.on("connection", socket => {
  socket.on("message", data => {
    const message = JSON.parse(data);
    console.log("----------------\nFrom Client:");
    console.log(message);
    switch (message.type) {
      case "jump":
        message.jump = "true";
        break;
      case "dash":
        message.dash = "true";
        break;
      case "left":
        message.moveLeft = "true";
        break;
      case "right":
        message.moveRight = "true";
        break;
      case "leftUp":
        message.moveLeft = "false";
        break;
      case "rightUp":
        message.moveRight = "false";
        break;
      case "username":
        //Placeholder
        break;
      case "reset":
        //Placeholder
        break;
      default:
        socket.send(JSON.stringify({
          type: "error"
        }));
    }
    sendCommand(message);
  });

  socket.on('error', function (exc) {
    console.log("Socket Server Error: " + exc);
  });
});

wsServer.on('error', function (exc) {
  sys.log("WS Server Error: " + exc);
});

function sendCommand(message) {
  console.log("To Client:");
  console.log(message);
  console.log("\n");
  wsServer.clients.forEach(client => {
    if (client.readyState !== ws.OPEN) {
      return;
    }
    client.send(JSON.stringify({
      type: message.type,
      jump: message.jump,
      playerID: message.playerID,
      dash: message.dash,
      moveLeft: message.moveLeft,
      moveRight: message.moveRight,
      username: message.username,
      reset: message.reset
    }));
  });
}

function bin2string(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += (String.fromCharCode(array[i]));
  }
  return result;
}