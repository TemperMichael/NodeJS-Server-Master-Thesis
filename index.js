'use strict'

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = 3000;

const ws = require("ws");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
res.send("Hallo"); 
});

const server = http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
  };

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
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

const wsServer = new ws.Server({server});
wsServer.on("connection", socket => {
  socket.on("message", data => {
    const message = JSON.parse(data);
    console.log(message);
    switch (message.type) {


      case "ping":
      socket.send(JSON.stringify({type: "ping", reply: "pong"}));
      break;
      case "request":
      socket.send(JSON.stringify({type: "request", reply: "response"}));
      break;
      case "jump":
      wsServer.clients.forEach(client => {
        if(client.readyState !== ws.OPEN){
          return;
        }
          client.send(JSON.stringify({type: "jump", jump: "true"}));
      });
      break;
       case "left":
      wsServer.clients.forEach(client => {
        if(client.readyState !== ws.OPEN){
          return;
        }
          client.send(JSON.stringify({type: "left", moveLeft: "true"}));
      });
      break;
       case "right":
      wsServer.clients.forEach(client => {
        if(client.readyState !== ws.OPEN){
          return;
        }
          client.send(JSON.stringify({type: "right", moveRight: "true"}));
      });
      break;
       case "leftUp":
      wsServer.clients.forEach(client => {
        if(client.readyState !== ws.OPEN){
          return;
        }
          client.send(JSON.stringify({type: "left", moveLeft: "false"}));
      });
      break;

       case "rightUp":
      wsServer.clients.forEach(client => {
        if(client.readyState !== ws.OPEN){
          return;
        }
          client.send(JSON.stringify({type: "right", moveRight: "false"}));
      });
      break;
      default:
      socket.send(JSON.stringify({type: "error"}));
    }

  });
});


function bin2string(array){
  var result = "";
  for(var i = 0; i < array.length; ++i){
    result+= (String.fromCharCode(array[i]));
  }
  return result;
}

server.listen(port, () => {
  console.log("Server is running on port 3000...");
});


  
 