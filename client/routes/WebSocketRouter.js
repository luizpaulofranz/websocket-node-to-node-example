const express = require('express');
const WebSocketRouter = express.Router();
//const WebSocketController = require('../constrollers/WebSocket.controller');

WebSocketRouter.route('/sendMessage').get(function (req, res) {
    obj = { "msg": "Default message send by client!" };
    // socket is a global defined on root file client.js
    socket.send(JSON.stringify(obj));
    res.render('ws/index');
});

WebSocketRouter.route('/post').post(function (req, res) {
    console.log(req.body);
    socket.send(JSON.stringify(jsonExample));
    res.render('ws/index');
});

WebSocketRouter.route('/post').post(function (req, res) {
  const customMessage = new Coin(req.body);
  console.log("Custom Message on /post route. WebSocketRouter.js", customMessage);
  socket.send(JSON.stringify(customMessage));
  res.render('ws/index');
});

WebSocketRouter.route('/').get(function (req, res) {
    // show our index WS page
    res.render('ws/index');
});

// sample of json
const jsonExample = 
  {
    "_id": "5c927844c03f759e66e90789",
    "index": 0,
    "guid": "5703e750-298b-41db-b205-baba59fadfde",
    "isActive": true,
    "balance": "$2,947.17",
    "picture": "http://placehold.it/32x32",
    "age": 35,
    "eyeColor": "brown",
    "name": {
      "first": "Winifred",
      "last": "Andrews"
    },
    "company": "GINK",
    "email": "winifred.andrews@gink.info",
    "phone": "+1 (924) 579-3174",
    "address": "955 Jay Street, Nettie, Washington, 1130",
    "about": "Proident ipsum ea aute aliqua reprehenderit fugiat adipisicing irure adipisicing sunt commodo laborum. Et quis minim laboris sint adipisicing est veniam aute nulla cupidatat excepteur Lorem deserunt. Excepteur magna Lorem est mollit voluptate. Elit ea dolore eiusmod nisi exercitation irure.",
    "registered": "Thursday, March 2, 2017 7:03 PM",
    "latitude": "19.204025",
    "longitude": "118.070128",
    "tags": ["amet","velit","amet","ad","proident"],
    "range": [ 0,1,2,3,4,5,6,7,8,9],
    "friends": [
      {
        "id": 0,
        "name": "Herring Lamb"
      },
      {
        "id": 1,
        "name": "Morton Alston"
      },
      {
        "id": 2,
        "name": "Richard Estrada"
      }
    ],
    "greeting": "Hello, Winifred! You have 10 unread messages.",
    "favoriteFruit": "apple"
  };

module.exports = WebSocketRouter;