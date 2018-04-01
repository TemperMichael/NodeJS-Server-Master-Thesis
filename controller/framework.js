var lastTouchEnd = 0;

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

Connector.prototype.onOpen = function (event) {};

Connector.prototype.onMessage = function (event) {};

Connector.prototype.onClose = function (event) {};

Connector.prototype.onError = function (event) {};

Connector.prototype.sendCommand = function (command) {
  this.ws.send(JSON.stringify(command));
}

Connector.prototype.preventDoubleTapZoom = function (event) {
  if (event.target.nodeName != "INPUT") {
    event.preventDefault();
  }
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