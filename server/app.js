//https://github.com/websockets/ws
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const WebSocket = require('ws');

// middleware to handle http body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** ########################################################### */
/** ############ ROUTE CONTROLS, REST ENDPOINTS ############### */
/** ########################################################### */
app.post('/sendBroadcast', (req, res) => {
  //res.writeHead(200, {'Content-Type': 'application/json'});
  if (sendMessageToAllClients() ) {
    return res.send({"status":"Ok"});
  } else {
    return res.send({"status":"Error", "msg": "Não há clientes conectados!"});
  }
});

app.post('/sendSpecific', (req, res) => {
  
  const { idClient, msg } = req.body;

  if (idClient) {
    if (sendMessageToSpecificClient(idClient, msg)) {
      return res.send({"status":"Ok"});
    } else {
      return res.send({"status":"Error", "msg": "There is no client with the given id!"});
    }
  } else {
    return res.send({"status":"Error", "msg": 'The "idClient" field is required!'});
  }
});

app.post('/sendFile', (req, res) => {
  
  const { idClient } = req.body;

  if (idClient) {
    if (sendFileToSpecificClient(idClient)) {
      return res.send({"status":"Ok"});
    } else {
      return res.send({"status":"Error", "msg": "There is no client with the given id!"});
    }
  } else {
    return res.send({"status":"Error", "msg": 'The "idClient" field is required!'});
  }
});


// SSL setup to reach HTTPS and WSS
const server = new https.createServer({
  key: fs.readFileSync('./ssl/MyKey.key'),
  cert: fs.readFileSync('./ssl/MyCertificate.crt'),
}, app);

const wss = new WebSocket.Server({ server });
// contem todos os sockets dos clientes
// hold all client sockets
let clients = [];

wss.on('connection', (socket, req) => {
  // we get the IP connection, it'll be our socket ID
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // ::ffff: to IPV6, just erase it for now
  ip = ip.replace("::ffff:", "");
  // to handle clients, connected clients
  socket.id = ip;
  clients[socket.id] = socket;

  socket.on('message', message => {
    console.log('received: %s', message);
  });
});

/** ########## SERVER ACTIONS ########## */
// only three at the moment, send message to specific client, to all clients and send a file to specific client
const sendMessageToSpecificClient = (clientId, message) => {
  message = (message) ? message : `Hello client ${clientId}`;
  if (clients[clientId]) {
    clients[clientId].send(message);
    return true;
  } else {
    return false;
  }
}

const sendMessageToAllClients = (message = 'Hello my clients!') => {
  //clients.send(message);
  if(clients.length > 0){
    clients.forEach( client => {
      client.send(message);
    });
    return true;
  } else {
    console.log('Não há clientes conectados!')
    return false;
  }
}

const sendFileToSpecificClient = clientId => {
  const file = fs.readFileSync('./filesToSend/gandalf.jpg');
  /*const ret = {
    'type': 'file',
    'fileName': 'executable.exe',
    'file': file.toString('base64')
  };*/

  if (clients[clientId]) {
    clients[clientId].send(file);
    return true;
  } else {
    return false;
  }
}

server.listen(8080);