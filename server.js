
// Import game classes
let Model = require('./model');

let firebase = require('firebase');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD9h19hi_gkfMp1dYP82KzafhdnKiZ83f0",
  authDomain: "space-defense-67854.firebaseapp.com",
  databaseURL: "https://space-defense-67854.firebaseio.com",
  projectId: "space-defense-67854",
  storageBucket: "space-defense-67854.appspot.com",
};
firebase.initializeApp(config);


// Import express framework
let express = require('express');
let bodyParser = require('body-parser');

// Create express app
let app = express();

// Create server listening to port 3000
let server = app.listen(process.env.PORT || 3000, () => {
  console.log("listening");
});

// Import socket.io and create socket server for the server
let io = require('socket.io')(server);

// Serve the public folder
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.post('/api/1.0/scores', (req, res) => {
  let userId = req.body.userid;
  let token = req.body.apptoken;
  let ref = firebase.database().ref("tokens/"+token);
  ref.once("value").then((snapshot) => {
    if (snapshot.val() != null) {
      let ref2 = firebase.database().ref("scores/"+userId);
      ref2.once("value").then((snapshot) => {
        res.json({ score : snapshot.val() });
      });
    } else {
      res.end();
    }
  });
});

// app.get("/score/:uid", (req, res) => {
//   let userJson = {};
//   userJson.token = "123456";
//   let userId = req.params.uid;
//   let ref = firebase.database().ref("scores/"+userId);
//   ref.once("value").then((snapshot) => {
//     userJson.score = snapshot.val();
//     res.json([ userJson ]);
//   });
// })

let model = new Model(io);
