const express = require('express');
const app = express();
const mongoose = require('mongoose');
const CoinRouter = require('./routes/CoinRouter');
const SocketRouter = require('./routes/WebSocketRouter');
const bodyParser = require('body-parser');

// creates a global with our socket, to access it on several parts (must have a better way =/)
GLOBAL.socket = require('./wsConfig');

/** EXPRESS AND MONGOOSE CONFIGS */
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://user:pass@blabla.mlab.com:17846/websocket-impl")
    .then(() => console.log("DB Successfully connected!"))
    .catch( err => console.log(err));

// css and js includes on express
// app.use(express.static('public'));
// setting our view parsing engine
app.set('view engine', 'ejs');
// setting middleware to parse BODY
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// rotes
app.use('/', SocketRouter);
// SIMPLE CRUD EXAMPLE
app.use('/coins', CoinRouter)

const port = 3000;
app.listen(port, function(){
  console.log(`client on port ${port}.`);
});

