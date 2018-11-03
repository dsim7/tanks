
// Import game classes
let Model = require('model');

// Import express framework
let express = require('express');

// Create express app
let app = express();

// Create server listening to port 3000
let server = app.listen(3000, () => {
  console.log("listening to port 3000");
});

// Import socket.io and create socket server for the server
let io = require('socket.io')(server);

// Serve the public folder
app.use(express.static('public'));

let model = new Model(io);
