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
        connector.sendCommand({
            type: direction + "Up",
            playerID: "" + connector.getCookie("playerID")
        });
        lastDirection = direction + "Up";
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
                direction = direction + "Up";
                connector.sendCommand({
                    type: direction,
                    playerID: "" + connector.getCookie("playerID")
                });
                lastDirection = direction;
            }

            if (lastDirection != direction) {
                connector.sendCommand({
                    type: direction,
                    playerID: "" + connector.getCookie("playerID")
                });
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
    ws.send({
        type: "username",
        playerID: "" + connector.getCookie("playerID"),
        username: document.getElementById("inputText").value
    });
}

function resetInputColor() {
    document.getElementById("inputText").style.backgroundColor = "white";
    document.getElementById("inputText").style.color = "black";
}