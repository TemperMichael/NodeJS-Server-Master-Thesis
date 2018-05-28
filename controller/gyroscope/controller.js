var connector = new Connector("193.11.184.203", "3000");
var currentTime;
var roundTripTime;
var latency = 0;
var timeDelta;
var startDebugOnLoad = true;
var serverClock;

if (!connector.getId()) {
    connector.setId();
}

connector.onOpen = function (event) {
    connector.setUsername("getInitialUserInfo");
}

connector.onMessage = function (event) {
    console.log("Received: " + event.data);
}

connector.onUsername = function (event) {
    const message = JSON.parse(event.data);
    if (connector.getId() + "Game" == message.playerID) {
        document.getElementById('usernameLabel').innerHTML = message.username;
    }
}

connector.onEnableDebugMode = function (event) {
    enableDebugging();
}

connector.onDisableDebugMode = function (event) {
    disableDebugging();
}

connector.onSynchronizeServerTime = function (event) {
    if (startDebugOnLoad) {
        enableDebugging();
    }
    const message = JSON.parse(event.data);
    if (message.playerID == connector.getId()) {
        currentTime = new Date().getTime();
        roundTripTime = currentTime - parseFloat(message.clientTimestamp);
        latency = roundTripTime / 2;
        timeDelta = parseFloat(message.serverTimestamp) - currentTime + latency;
    }
}

connector.onServerTimeUpdate = function (event) {
    const message = JSON.parse(event.data);
    serverClock = new Date(parseFloat(message.serverTimestamp) + timeDelta);
    document.getElementById('timesLabel').innerHTML = "Server Time: " + ("0" + serverClock.getUTCHours()).slice(-2) + ":" + ("0" + serverClock.getUTCMinutes()).slice(-2) + ":" + ("0" + serverClock.getUTCSeconds()).slice(-2) + ":" + serverClock.getUTCMilliseconds() + "<br/><br/>Latency: " + latency + " ms<br/><br/>Time delta: " + timeDelta + " ms";

    if (serverClock.getSeconds() % 5 == 0) {
        connector.sendLatency(latency);
    }
}

var gn;
var direction = "";
var lastDirection = "";

if (Math.abs(window.orientation) === 90) {
    setupGyroscope();
}

window.addEventListener("orientationchange", function () {
    if (Math.abs(window.orientation) === 90) {
        setupGyroscope();
    } else {
        gn.stop();
        if (direction == "left") {
            connector.stopLeft();
        } else if (direction == "right") {
            connector.stopRight();
        }
        lastDirection = direction + "stop";
    }
}, false);

function setupGyroscope() {
    gn = new GyroNorm();
    gn.init().then(function () {
        gn.start(function (data) {
            if (data.do.beta > 10) {
                direction = "right";
            } else if (data.do.beta < -10) {
                direction = "left";
            } else {
                if (direction == "left") {
                    direction = "leftstop"
                } else if (direction == "right") {
                    direction = "rightstop"
                }
            }

            if (lastDirection != direction) {
                switch (direction) {
                    case "left":
                        connector.moveLeft();
                        break;
                    case "right":
                        connector.moveRight();
                        break;
                    case "leftstop":
                        connector.stopLeft();
                        break;
                    case "rightstop":
                        connector.stopRight();
                        break;
                    default:
                        break;
                }
                lastDirection = direction;
            }
        });
    }).catch(function (e) {
        alert(e.message);
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
        deviceInformation: JSON.stringify(DeviceDetection.getDeviceInformation()),
        serverClock: "test",
        playerID: connector.getId()
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

function enableDebugging() {
    connector.startTimeSynchronizing();
    document.getElementById("timesLabel").style.display = "block";
    startDebugOnLoad = false;
}

function disableDebugging() {
    connector.stopTimeSynchronizing();
    document.getElementById("timesLabel").style.display = "none";
}