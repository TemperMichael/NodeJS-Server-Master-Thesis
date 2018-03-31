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

document.addEventListener('touchmove', function (event) {
    connector.prevenScroll(event);
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

document.getElementById("rightButton").addEventListener('touchstart', function (event) {
    connector.sendCommand({
        type: "right",
        playerID: "" + connector.getCookie("playerID")
    });
});

document.getElementById("rightButton").addEventListener('touchend', function (event) {
    connector.sendCommand({
        type: "rightUp",
        playerID: "" + connector.getCookie("playerID")
    });
});

document.getElementById("leftButton").addEventListener('touchstart', function (event) {
    connector.sendCommand({
        type: "left",
        playerID: "" + connector.getCookie("playerID")
    });
});

document.getElementById("leftButton").addEventListener('touchend', function (event) {
    connector.sendCommand({
        type: "leftUp",
        playerID: "" + connector.getCookie("playerID")
    });
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