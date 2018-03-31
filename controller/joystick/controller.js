var connector = new Connector("10.59.0.74", "3000");

if (!connector.getCookie("playerID")) {
    connector.setCookie("playerID", Math.floor(Math.random() * 1000000000), 3);
}

connector.onOpen = function (event) {
    connector.sendCommand({
        type: "username",
        playerID: "" + connector.getCookie("playerID"),
        username: "getInitialUserInfo"
    });
}

connector.onMessage = function (event) {
    console.log("Received: " + event.data);
    const message = JSON.parse(event.data);
    if (connector.getCookie("playerID") + "Game" == message.playerID) {
        console.log("Received Name! " + message.username);
        document.getElementById('usernameLabel').innerHTML = message.username;
    }
}

var joystick;
var joystickAvailable = false;
var direction = "";
var lastDirection = "";

if (Math.abs(window.orientation) === 90) {
    setupJoystick();
}

window.addEventListener("orientationchange", function () {
    if (Math.abs(window.orientation) === 90) {
        setupJoystick();
    } else {
        if (joystickAvailable) {
            joystick.destroy();
            joystickAvailable = false;
        }
    }
}, false);


function setupJoystick() {
    joystick = new VirtualJoystick({
        mouseSupport: true,
        limitStickTravel: true,
        strokeStyle: "white",
        stickRadius: 50
    });
    joystickAvailable = true;
    joystick.addEventListener('touchStart', function () {
        setInterval(function () {
            if (joystick.right()) {
                direction = "right";
            }
            if (joystick.left()) {
                direction = "left";
            }
            if (joystick.up()) {

            }
            if (joystick.down()) {

            }

            if (lastDirection != direction) {
                connector.sendCommand({
                    type: direction,
                    playerID: "" + connector.getCookie("playerID")
                });
                lastDirection = direction;
            }
        }, 100);
    });

    joystick.addEventListener('touchEnd', function () {
        connector.sendCommand({
            type: lastDirection + "Up",
            playerID: "" + connector.getCookie("playerID")
        });
        direction = "";
        lastDirection = "";
    });
}

document.addEventListener('touchmove', function (event) {
    connector.preventScroll(event);
}, false);

document.addEventListener('touchend', function (event) {
    connector.preventDoubleTapZoom(event);
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
    connector.sendCommand({
        type: "jump",
        playerID: "" + connector.getCookie("playerID")
    });
});

document.getElementById("dashButton").addEventListener('touchstart', function (event) {
    connector.sendCommand({
        type: "dash",
        playerID: "" + connector.getCookie("playerID")
    });
});

function setInputName() {
    document.getElementById("inputText").style.backgroundColor = "green";
    document.getElementById("inputText").style.color = "white";
    connector.sendCommand({
        type: "username",
        playerID: "" + connector.getCookie("playerID"),
        username: document.getElementById("inputText").value
    });
}

function resetInputColor() {
    document.getElementById("inputText").style.backgroundColor = "white";
    document.getElementById("inputText").style.color = "black";
}