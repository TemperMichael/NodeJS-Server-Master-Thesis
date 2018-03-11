if (!getCookie("playerID")) {
    setCookie("playerID", Math.floor(Math.random() * 1000000000), 3);
}

var ws;
var connect = function () {
    ws = new WebSocket('ws://10.59.0.74:3000');
    ws.onopen = function () {
        ws.send(JSON.stringify({
            type: "username",
            playerID: "" + getCookie("playerID"),
            username: "getInitialUserInfo"
        }));
    };
    ws.onmessage = function (e) {
        console.log("Received: " + e.data);
        const message = JSON.parse(e.data);
        if (getCookie("playerID") + "Game" == message.playerID) {
            console.log("Received Name! " + message.username);
            document.getElementById('usernameLabel').innerHTML = message.username;
        }
    }
    ws.onerror = function (err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
    };
    ws.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 1000);
    };
};

connect();

var joystick;
var joystickAvailable = false;
if (Math.abs(window.orientation) === 90) {
    joystick = new VirtualJoystick({
        mouseSupport: true,
        limitStickTravel: true,
        strokeStyle: "white",
        stickRadius: 50
    });
    joystickAvailable = true;
}

window.addEventListener("orientationchange", function () {
    if (Math.abs(window.orientation) === 90) {
        joystick = new VirtualJoystick({
            mouseSupport: true,
            limitStickTravel: true,
            strokeStyle: "white",
            stickRadius: 50
        });
        joystickAvailable = true;
    } else {
        if (joystickAvailable) {
            joystick.destroy();
            joystickAvailable = false;
        }
    }
}, false);

if (joystickAvailable) {
    if (joystick.right()) {
        cube.position.x = cube.position.x + 60 * frameTime;
    }
    if (joystick.left()) {
        cube.position.x = cube.position.x - 60 * frameTime;
    }
    if (joystick.up()) {
        cube.position.y = cube.position.y + 60 * frameTime;
    }
    if (joystick.down()) {
        cube.position.y = cube.position.y - 60 * frameTime;
    }
}




var lastTouchEnd = 0;

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, false);

document.addEventListener('touchend', function (event) {
    preventDoubleTapZoom(event);
}, false);

document.getElementById("submitButton").addEventListener('touchstart', function (e) {
    setInputName();
});

document.getElementById("inputText").addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        setInputName();
    }
});


document.getElementById("jumpButton").addEventListener('touchstart', function (event) {
    sendCommand("jump");
});

document.getElementById("dashButton").addEventListener('touchstart', function (event) {
    sendCommand("dash");
});


function setInputName() {
    document.getElementById("inputText").style.backgroundColor = "green";
    document.getElementById("inputText").style.color = "white";
    ws.send(JSON.stringify({
        type: "username",
        playerID: "" + getCookie("playerID"),
        username: document.getElementById("inputText").value
    }));
}

function resetInputColor() {
    document.getElementById("inputText").style.backgroundColor = "white";
    document.getElementById("inputText").style.color = "black";
}

function sendCommand(commandName) {
    preventDoubleTapZoom(event)
    ws.send(JSON.stringify({
        type: commandName,
        playerID: "" + getCookie("playerID")
    }));
}

function preventDoubleTapZoom(event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}