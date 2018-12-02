
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
let http = require('http');
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
  let appQuery = firebase.database().ref("tokens/badgebook");
  appQuery.once("value").then((snapshot) => {
    if (snapshot.val() == req.body.apptoken) {
      badgebookQuery(req, res);
    } else {
      res.json("Invalid token");
      res.end();
    }
  });
});

app.post('/api/1.0/top', (req, res) => {
  let appQuery = firebase.database().ref("tokens/badgebook");
  appQuery.once("value").then((snapshot) => {
    if (snapshot.val() == req.body.apptoken) {
      topQuery(req, res);
    } else {
      res.json("Invalid token");
      res.end();
    }
  });
});

app.get('/test', (req, res) => {
  var post_options = {
    host: 'localhost',
    port: '3000',
    path: '/badgebooklogin',
    method: 'POST',
  };
  console.log("making post request");
  var post_req = http.request(post_options, function(res) {
    
  });
  
  post_req.write("");
  post_req.end();
  res.end();
});

app.post('/badgebooklogin', (req, res) => {
  console.log("redirecting");
  res.redirect('/game.html#nebraska');
  // console.log("post request received");
  // let userid = req.body.userid;
  // let externalTokenQuery = firebase.database().ref("tokens/badgebook");
  // externalTokenQuery.once("value").then((snapshot) => {
  //   console.log("reading");
  //   if (snapshot.val() == req.body.apptoken) {
  //     console.log("redirecting");
  //     res.redirect('/game.html#'+userid);
  //   } else {
  //     res.json("Invalid token");
  //     res.end();
  //   }
  // });
});


app.get('/badgebooklogin', (req, res) => {
  console.log("redirecting");
  res.redirect('/game.html#nebraska');
  // console.log("post request received");
  // let userid = req.body.userid;
  // let externalTokenQuery = firebase.database().ref("tokens/badgebook");
  // externalTokenQuery.once("value").then((snapshot) => {
  //   console.log("reading");
  //   if (snapshot.val() == req.body.apptoken) {
  //     console.log("redirecting");
  //     res.redirect('/game.html#'+userid);
  //   } else {
  //     res.json("Invalid token");
  //     res.end();
  //   }
  // });
});


var badgebookQuery = (req, res) => {
  let badgebookUserId = req.body.userid;

  let userQuery = firebase.database().ref("users/"+badgebookUserId);
  userQuery.once("value").then((snapshot) => {
    let score = snapshot.child("score").val();
    res.json({
      user: badgebookUserId,
      appname: "Space Defense",
      badgetype: "Score",
      value: score
    });
    res.end();
  });
}

var topQuery = (req, res) => {
  let topUsers = [];
  let x = parseInt(req.body.top);

  let topQuery = firebase.database().ref("users");
  topQuery.orderByChild("score").limitToLast(x).once("value").then((snapshot) => {
    snapshot.forEach((element) => {
      topUsers.push(element.key);
    });
    res.json({
      appname: "Space Defense",
      topUsers: topUsers
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

let model = new Model(io);
