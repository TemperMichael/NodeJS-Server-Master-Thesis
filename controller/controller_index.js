var lastTouchEnd = 0;

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, false);

document.addEventListener('touchend', function (event) {
    preventDoubleTapZoom(event);
}, false);


var buttons = document.getElementsByTagName("button");
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        console.log(event.target.innerText);
        switch (event.target.innerText) {
            case "Buttons":
                window.location.assign("./buttons/controller.html");
                break;
            case "Joystick":
                window.location.assign("./joystick/controller.html");
                break;
            case "Gyroscope":
                window.location.assign("./gyroscope/controller.html");
                break;
            default:
                console.log("Button error");
                break;
        }
    });
}

function preventDoubleTapZoom(event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}