var lastTouchEnd = 0;

var Connector = function (ipAdress, port) {
  var ws;
  ws = new WebSocket("ws://" + ipAdress + ":" + port);

  ws.onopen = (event) => {
    this.onOpen(event);
  };
  ws.onmessage = (event) => {
    this.onMessage(event);
  }
  ws.onerror = function (error) {
    this.onError(error);
    console.error('Socket encountered error: ', error.message, 'Closing socket');
    ws.close();
  };
  ws.onclose = function (event) {
    this.onClose(event);
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', event.reason);
    setTimeout(function () {
      connect();
    }, 1000);
  };

  this.ws = ws;
}

Connector.prototype.onOpen = function (event) {};

Connector.prototype.onMessage = function (event) {};

Connector.prototype.onClose = function (event) {};

Connector.prototype.onError = function (event) {};


Connector.prototype.sendCommand = function (command) {
  this.ws.send(JSON.stringify(command));
}

Connector.prototype.preventDoubleTapZoom = function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}

Connector.prototype.preventScroll = function (event) {
  event.preventDefault();
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