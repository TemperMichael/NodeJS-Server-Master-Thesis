'use strict'

var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  port = 3000;

const ws = require("ws");

var desktopGameClient;

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
  console.log('Server is running on port: %s and ip address: %s', port, server.address().address);
});

server.on('error', function (exc) {
  console.log("Server Error: " + exc);
});

const wsServer = new ws.Server({
  server
});

wsServer.on("connection", (socket, req) => {
  console.log(req.url);
  if (req.url == "/?endpoint=desktopGame") {
    desktopGameClient = socket;
    socket.on("message", data => {
      const message = JSON.parse(data);
      console.log("----------------\nMessage to clients:");
      console.log(message);
      console.log("\n");
      wsServer.clients.forEach(client => {
        if (client.readyState !== ws.OPEN || (client == desktopGameClient && !(message.message == "resetCenter" || message.message == "resetRandom"))) {
          return;
        }
        client.send(JSON.stringify(message));
      });
    });
  } else  {
    socket.on("message", data => {
      const message = JSON.parse(data);
      console.log("----------------\nMessage to server:");
      console.log(message);
      console.log("\n");
      if (desktopGameClient != null && desktopGameClient.readyState == ws.OPEN) {
        desktopGameClient.send(JSON.stringify(message));
      }
    });
  }
  socket.on('error', function (exc) {
    console.log("Socket Server Error: " + exc);
  });
});

wsServer.on('error', function (exc) {
  console.log("WS Server Error: " + exc);
});


function bin2string(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += (String.fromCharCode(array[i]));
  }
  return result;
}