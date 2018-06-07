var connector = new Connector("192.168.1.126", "3000");
var currentTime;
var roundTripTime;
var latency = 0;
var timeDelta;


connector.onOpen = function (event) {
    connector.setUsername("getInitialUserInfo");
}

connector.onMessage = function (event) {
    console.log("Received: " + event.data);
}

connector.onUsername = function (event) {
    const message = JSON.parse(event.data);
    if (connector.getId() == message.playerID) {
        document.getElementById('usernameLabel').innerHTML = message.username;
    }
}

connector.onCalculateLatency = function (event) {
    const message = JSON.parse(event.data);
    if (message.playerID == connector.getId()) {
        currentTime = new Date().getTime();
        roundTripTime = currentTime - parseFloat(message.clientTimestampSent);
        latency = roundTripTime / 2;
        timeDelta = (parseFloat(message.serverTimestamp) - currentTime) + latency;
        connector.sendCommand({
            message: "latencyJump",
            deviceInformation: JSON.stringify(DeviceDetection.getDeviceInformation()),
            latency: "" + latency,
            syncServerTime: "" + (parseFloat(message.serverTimestamp) + timeDelta),
            clientTimestampSent: message.clientTimestampSent,
            serverTimestamp: message.serverTimestamp,
            clientTimestampReceived: "" + currentTime,
            playerID: connector.getId()
        })
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
                if (direction == "left") {
                    connector.moveLeft();
                } else if (direction == "right") {
                    connector.moveRight();
                }
                lastDirection = direction;
            }
        }, 100);
    });

    joystick.addEventListener('touchEnd', function () {
        if (lastDirection == "left") {
            connector.stopLeft();
        } else if (lastDirection == "right") {
            connector.stopRight();
        }
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

document.getElementById("jumpButton").addEventListener('touchstart', function (event) {
    connector.sendCommand({
        message: "jump",
        clientTimestampSent: new Date().getTime(),
        playerID: connector.getId(),
    })
});

document.getElementById("dashButton").addEventListener('touchstart', function (event) {
    connector.dash();
});

document.getElementById("submitButton").addEventListener('touchstart', function (e) {
    setInputName();
});

document.getElementById("inputText").addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        setInputName();
    }
});

function setInputName() {
    document.getElementById("inputText").style.backgroundColor = "green";
    document.getElementById("inputText").style.color = "white";
    connector.setUsername(document.getElementById("inputText").value);
}

function resetInputColor() {
    document.getElementById("inputText").style.backgroundColor = "white";
    document.getElementById("inputText").style.color = "black";
}