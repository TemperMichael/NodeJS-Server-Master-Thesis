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
      response.write("Error 404 - File "+ uri + " Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += 'index.html';

    fs.readFile(filename, "binary", function (err, file) {
      if (err) {
        response.writeHead(500, {
          "Content-Type": "text/plain"
        });
        response.write("SERVER ERROR:" +err + "\n");
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

});

const wsServer = new ws.Server({
  server
});
wsServer.on("connection", socket => {
  socket.on("message", data => {
    const message = JSON.parse(data);
    console.log(message);
    switch (message.type) {


      case "ping":
        socket.send(JSON.stringify({
          type: "ping",
          reply: "pong"
        }));
        break;
      case "request":
        socket.send(JSON.stringify({
          type: "request",
          reply: "response"
        }));
        break;
      case "jump":
        wsServer.clients.forEach(client => {
          if (client.readyState !== ws.OPEN) {
            return;
          }
          client.send(JSON.stringify({
            type: "jump",
            jump: "true",
            time: message.time,
            playerID: message.playerID
          }));
        });
        break;
      case "dash":
        wsServer.clients.forEach(client => {
          if (client.readyState !== ws.OPEN) {
            return;
          }
          client.send(JSON.stringify({
            type: "dash",
            dash: "true",
            time: message.time,
            playerID: message.playerID
          }));
        });
        break;
      case "left":
        wsServer.clients.forEach(client => {
          if (client.readyState !== ws.OPEN) {
            return;
          }
          client.send(JSON.stringify({
            type: "left",
            moveLeft: "true",
            time: message.time,
            playerID: message.playerID
          }));
        });
        break;
      case "right":
        wsServer.clients.forEach(client => {
          if (client.readyState !== ws.OPEN) {
            return;
          }
          client.send(JSON.stringify({
            type: "right",
            moveRight: "true",
            time: message.time,
            playerID: message.playerID
          }));
        });
        break;
      case "leftUp":
        wsServer.clients.forEach(client => {
          if (client.readyState !== ws.OPEN) {
            return;
          }
          client.send(JSON.stringify({
            type: "left",
            moveLeft: "false",
            time: message.time,
            playerID: message.playerID
          }));
        });
        break;

      case "rightUp":
        wsServer.clients.forEach(client => {
          if (client.readyState !== ws.OPEN) {
            return;
          }
          client.send(JSON.stringify({
            type: "right",
            moveRight: "false",
            time: message.time,
            playerID: message.playerID
          }));
        });
        break;

      case "reset":
        wsServer.clients.forEach(client => {
          if (client.readyState !== ws.OPEN) {
            return;
          }
          client.send(JSON.stringify({
            reset: "true"
          }));
        });
        break;
      default:
        socket.send(JSON.stringify({
          type: "error"
        }));
    }

  });
});

wsServer.on('error', () => console.log('errored'));


function bin2string(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += (String.fromCharCode(array[i]));
  }
  return result;
}



server.listen(port, () => {
    console.log('Server is running on port: %s', port);
});