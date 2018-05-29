var Connector = function (ipAdress, port) {
  var _ipAdress = ipAdress;
  var _port = port;
  var ws;

  startWebsocket(this);

  function startWebsocket(connector) {
    ws = new WebSocket("ws://" + _ipAdress + ":" + _port);

    ws.onopen = (event) => {
      connector.onOpen(event);
    };
    ws.onmessage = (event) => {
      connector.onMessage(event);
      switch (JSON.parse(event.data).message) {
        case "moveLeft":
          connector.onMoveLeft(event);
          break;
        case "stopLeft":
          connector.onStopLeft(event);
          break;
        case "moveRight":
          connector.onMoveRight(event);
          break;
        case "stopRight":
          connector.onStopRight(event);
          break;
        case "moveUp":
          connector.onMoveUp(event);
          break;
        case "stopUp":
          connector.onStopUp(event);
          break;
        case "moveDown":
          connector.onMoveDown(event);
          break;
        case "stopDown":
          connector.onStopDown(event);
          break;
        case "jump":
          connector.onJump(event);
          break;
        case "dash":
          connector.onDash(event);
          break;
        case "username":
          connector.onUsername(event);
          break;
        case "vector2d":
          connector.onVector2D(event);
          break;
        case "vector3d":
          connector.onVector3D(event);
          break;
        case "calculateLatency":
          connector.onCalculateLatency(event);
          break;
        default:
          break;
      }
    }

    ws.onerror = (error) => {
      connector.onError(error);
      console.error('Socket encountered error: ', error.message, 'Closing socket');
      ws.close();
    };
    ws.onclose = (event) => {
      connector.onClose(event);
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', event.reason);
      setTimeout(function () {
        startWebsocket(connector);
      }, 1500);
    };
    connector.ws = ws;
  }
}

// Listener

Connector.prototype.onOpen = function (event) {};

Connector.prototype.onMessage = function (event) {};

Connector.prototype.onClose = function (event) {};

Connector.prototype.onError = function (event) {};

Connector.prototype.onMoveLeft = function (event) {}

Connector.prototype.onStopLeft = function (event) {}

Connector.prototype.onMoveRight = function (event) {}

Connector.prototype.onStopRight = function (event) {}

Connector.prototype.onMoveUp = function (event) {}

Connector.prototype.onStopUp = function (event) {}

Connector.prototype.onMoveDown = function (event) {}

Connector.prototype.onStopDown = function (event) {}

Connector.prototype.onJump = function (event) {}

Connector.prototype.onDash = function (event) {}

Connector.prototype.onUsername = function (event) {}

Connector.prototype.onVector2D = function (event) {}

Connector.prototype.onVector3D = function (event) {}

Connector.prototype.onCalculateLatency = function (event) {};

// Methods

Connector.prototype.sendCommand = function (command) {
  this.ws.send(JSON.stringify(command));
}

Connector.prototype.moveLeft = function () {
  this.sendCommand({
    message: "moveLeft",
    playerID: this.getId()
  })
}

Connector.prototype.stopLeft = function () {
  this.sendCommand({
    message: "stopLeft",
    playerID: this.getId()
  })
}

Connector.prototype.moveRight = function () {
  this.sendCommand({
    message: "moveRight",
    playerID: this.getId()
  })
}

Connector.prototype.stopRight = function () {
  this.sendCommand({
    message: "stopRight",
    playerID: this.getId()
  })
}

Connector.prototype.moveUp = function () {
  this.sendCommand({
    message: "moveUp",
    playerID: this.getId()
  })
}

Connector.prototype.stopUp = function () {
  this.sendCommand({
    message: "stopUp",
    playerID: this.getId()
  })
}

Connector.prototype.moveDown = function () {
  this.sendCommand({
    message: "moveDown",
    playerID: this.getId()
  })
}

Connector.prototype.stopDown = function () {
  this.sendCommand({
    message: "stopDown",
    playerID: this.getId()
  })
}

Connector.prototype.jump = function () {
  this.sendCommand({
    message: "jump",
    playerID: this.getId()
  })
}

Connector.prototype.dash = function () {
  this.sendCommand({
    message: "dash",
    playerID: this.getId()
  })
}

Connector.prototype.setUsername = function (username) {
  this.sendCommand({
    message: "username",
    username: username,
    playerID: this.getId()
  })
}

Connector.prototype.sendVector2D = function (x, y) {
  this.sendCommand({
    message: "vector2d",
    playerID: this.getId(),
    x: x,
    y: y
  })
}

Connector.prototype.sendVector3D = function (x, y, z) {
  this.sendCommand({
    message: "vector3d",
    playerID: this.getId(),
    x: x,
    y: y,
    z: z
  })
}

// Others

Connector.prototype.preventDoubleTapZoom = function (event) {
  if (event.target.nodeName != "INPUT") {
    event.preventDefault();
  }
}

Connector.prototype.preventScroll = function (event) {
  event.preventDefault();
}

// Here could be a database used for better authentication

Connector.prototype.getId = function () {
  return this.getCookie("playerID");
}

Connector.prototype.setId = function () {
  this.setCookie("playerID", Math.floor(Math.random() * 1000000000), 3);
}

Connector.prototype.setCookie = function (name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

Connector.prototype.getCookie = function (name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

Connector.prototype.eraseCookie = function (name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}