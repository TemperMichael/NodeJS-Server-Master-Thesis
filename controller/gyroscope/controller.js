var connector = new Connector("91.250.101.23", "3000");

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
    connector.jump();
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