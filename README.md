# Connector Framework

This [framework](framework.js) can be used to handle the connection between multiple mobile clients and a specific endpoint (server/client/game). 
The repository consists beside the framework HTML templates for mobile controllers and
a websocket server for a better understanding how the framework works and how it can be used. The framework was implemented in combination
with a platformer game to test a typical use case scenario. The project of the game shows how the framework has to be used in the opposite endpoint and can
be found at the following link:

[Platformer game](https://github.com/TemperMichael/Master-Thesis-Temper-Platformer)

The framework establishes a connection to a server via a WebSocket and has methods and listeners to cover the following points:
* Messaging
* Directions
* Jump
* Dash
* Username
* ID
* Vector2D
* Vector3D

## Getting started

The project is based on WebSockets and Node.js, so both of them have to be installed first. To install Node.js the following link can be used:

[Node.js Installer](https://nodejs.org/en/#download)

Then the WebSocket library has to be installed in the root of the project with the following command in the terminal:

```
npm install --save ws
```

Additional documentation about the WebSocket library can be found here: 

[WebSocket library documentation](https://www.npmjs.com/package/ws)

After this, there are several points which have to be considered:
* The IP address and the port of the websocket server have to be entered at the files of all endpoints.
  * The default port is 3000 and can be changed in the following file:
    ```
    YourProjectPath/NodeJS-Server-Master-Thesis/server.js
    ```
  * To get the IP address the following command can be used in the terminal:
    ```
    ifconfig
    ```
    The IP address next to "inet" has to be used. (e.g.: 10.59.0.74) **Important**: The global IP address and port forwarding
    have to be used when a external server is used instead of a server in the local network.
  * The IP address and the port have to be entered in the following files:
    * In the controller files at:
      ```
      YourProjectPath/NodeJS-Server-Master-Thesis/controller/buttons/controller.js
      YourProjectPath/NodeJS-Server-Master-Thesis/controller/joystick/controller.js
      YourProjectPath/NodeJS-Server-Master-Thesis/controller/gyroscope/controller.js
      ```
      Here the IP address and the port have to be entered correctly in the constructor of the connector variable:
      ```js
      var connector = new Connector("10.59.0.74", "3000");
      ```
    * If the platformer game above will be used, then the IP address and the port have to be entered also at:
      ```
      YourProjectPath/Master-Thesis-Temper-Platformer/Assets/Scripts/Global.cs
      ```
      For the following variable:
      ```cs
      public static string IP = "10.59.0.74:3000";
      ```
 * All devices have to be in the same network if a local server is used.
 * The server has to be started before the clients can connect. To start the server go to the project root path and use the command:
    ```
    node server.js
    ```
 * If changes in the server file have been made, the server has to be restarted.
 
## How to use the framework
 
 If the framework will be used for a private project, one of the "controller.js" files would be a good reference to see how it works.
 First a `Connector` object has to be created:
 ```js
 var connector = new Connector("10.59.0.74", "3000");
 ```
 This starts a WebSocket in the background and establishes a connection with the server. As next step some kind of identification should be used to differentiate between the clients.
 Due to time constraints, random generated numbers which are saved in the cookies are used in the framework as an ID. This solution
 could be improved by using a database for example.
 ```js
 if (!connector.getId()) {
    connector.setId();
 }
 ```
 Afterwards there are several methods and listeners which can be used.
 
## Methods
 
 The methods offer a way to send messages to the other endpoints. They cover multiple points which are mentioned above, the following code
 snippet shows for example a way to start and stop the movement of a character when a button is pressed and released:
 ```js
 document.getElementById("leftButton").addEventListener('touchstart', function (event) {
    connector.moveLeft();
 });

 document.getElementById("leftButton").addEventListener('touchend', function (event) {
    connector.stopLeft();
 });
 ```
 It's also possible to send unique commands by either easily extending the framework or by using the following method:
 ```js
 connector.sendCommand({
    message: "doStuff",
    playerID: connector.getId()
  })
  ```
  
  ## Listeners
  
  The listeners offer a great way to handle incomming commands. The following code shows some methods which can be used to listen to the WebSocket events:
  ```js
  connector.onOpen = function (event) {
    // ...
  }

  connector.onMessage = function (event) {
    console.log("Received: " + event.data);
  }
  ```
  The `onMessage` method is called for every incoming message to cover also unique commands. To stick to the code snippet of the methods, 
  the following example shows how to react to the incoming movement commands:
  ```js
  connector.onMoveLeft = function(event) {
    // start character movement
  }

  connector.onStopLeft = function (event) {
    // stop character movement
  }
  ```
  A covering of the messages without the use of the framework and its listeners by using for example an other programming language like C# could
  look like this:
  ```cs
  if (jsonResponse.message == "stopLeft") {
	  // stop character movement
}
  ```

## Testing
  To test the connection the server has to be started like mentioned above. Afterwards the mobile clients can connect to the server by entering 
  the IP address and the port in the browsers. (e.g.: 10.59.0.74:3000) The project will then detect the mobile platform and redirects automatically to the files of the controllers.
 
  If the previously mentioned platformer game will be used, the game can either be used by starting it directly in the Unity engine or by building
  it as a WebGL build with the name "game" in the folder `NodeJS-Server-Master-Thesis`. Then it can be easily started by
  entering the IP address and the port of the WebSocket server in any desktop browser. (e.g.: 10.59.0.74:3000)
  The project will then detect the desktop platform and redirects automatically to the files of the game.
  
  Furthermore the Chrome Developer Tools are recommended, which offer a great
  way to test the connection with different devices and operating systems without the need of a physical device. They can be found in the Google Chrome browser at:
  ```
  Chrome menu > Tools > Developer Tools
  ```

## Built with
* [Node.js](https://nodejs.org/en/)
* [HTML](https://www.w3.org/html/)
* [Javascript](https://www.javascript.com)
* [CSS](https://www.w3.org/standards/webdesign/htmlcss)
* [WebSocket](https://www.websocket.org)
* [Unity](https://unity3d.com/de/) - Platformer game
## Author
* [**Michael Temper**](https://github.com/TemperMichael)
