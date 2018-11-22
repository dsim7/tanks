
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
let request = require('request');

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
  let token = req.body.apptoken;

  // verify token and see which app is calling
  let appQuery = firebase.database().ref("tokens/badgebook");
  appQuery.once("value").then((snapshot) => {
    let apptoken = snapshot.val();

    // badgebook login
    if (apptoken == "0c2e67ce-3f0e-4441-8fd3-2527bb88e880") {
      badgebookQuery(req, res);

    } else {
      res.json("Invalid token");
      res.end();
    }
  });
});

app.get('/badgebooklogin/:userid/:apptoken', (req, res) => {
  let token = req.params.apptoken;
  let badgebookUserId = req.params.userid;
  console.log(token);
  console.log(badgebookUserId);
  let externalTokenQuery = firebase.database().ref("externaltokens/"+token);
  externalTokenQuery.once("value").then((snapshot) => {
    if (snapshot.val() == "badgebook") {
      let badgebookuserQuery = firebase.database().ref("badgebookid-user/"+badgebookUserId);
      badgebookuserQuery.once("value").then((snapshot) => {
        let userId = snapshot.val();
        if (userId) {
          res.redirect('/game.html#'+userId);
        } else {
          console.log("making new entry")
          // create entry for new user in users
          let usersQuery = firebase.database().ref("users");
          let newUserIdKey = usersQuery.push({
              firebaseId : "BadgeBook ID",
              username : "BadgeBook User",
              score : 0
          }).key;
          let bbusersQuery = firebase.database().ref("badgebookid-user");
          bbusersQuery.child(badgebookUserId).set(newUserIdKey).then(() => {
            // redirect to game
            res.redirect('/game.html#'+newUserIdKey);
          });
        }
      }).catch(() => {
        console.log("caught");
      });
    } else {
      console.log("wrong token")
      res.end();
    }
  });
  
});

app.post('/badgebooklogin', (req, res) => {
  let token = req.body.apptoken;
  let badgebookUserId = req.body.userid;
  let externalTokenQuery = firebase.database().ref("externaltokens/"+token);
  externalTokenQuery.once("value").then((snapshot) => {
    if (snapshot.val() == "badgebook") {
      let badgebookuserQuery = firebase.database().ref("badgebookid-user/"+badgebookUserId);
      badgebookuserQuery.once("value").then((snapshot) => {
        let userId = snapshot.val();
        if (userId) {
          res.redirect('/game.html#'+userId);
        } else {
          res.end();
        }
      });
    } else {
      res.end();
    }
  });
});

var badgebookQuery = (req, res) => {
  let badgebookUserId = req.body.userid;

  let badgebookuserQuery = firebase.database().ref("badgebookid-user/"+badgebookUserId);
  badgebookuserQuery.once("value").then((snapshot) => {
    let userId = snapshot.val();
    let userQuery = firebase.database().ref("users/"+userId);
    userQuery.once("value").then((snapshot) => {
      let score = snapshot.child("score").val();
      res.json({
        score : score,
        userid : badgebookUserId
      });
      res.end();
    });
  });
}

var badgebookWriteOnWall = (userid) => {
  let tokenQuery = firebase.database().ref("tokens/badgebook");
  tokenQuery.once("value").then((snapshot) => {
    let token = snapshot.val();
    request.post(
      'badgebook wall url',
      { 
        json : { 
          token : token,
          // ...
        }
      },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
      });
  });
}

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
