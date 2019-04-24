const os = require('os');
const WebSocket = require('ws');
const fs = require('fs');
// websocket server host
const SERVER_HOST = "127.0.0.1:8080";

// apenas para recuperar o IP do cliente
const getMyIp = () => {
  let ifaces = os.networkInterfaces();
  let values = Object.keys(ifaces).map(function(name) {
    return ifaces[name];
  });
  values = [].concat.apply([], values).filter(function(val){ 
    return val.family == 'IPv4' && val.internal == false; 
  });

  return values.length ? values[0].address : null;
}

const ip = getMyIp();
// https://github.com/websockets/ws
// maxPayload: The maximum allowed message size in bytes. for big files we must change it
// rejectUnauthorized: reject or not SSL connections with self signed certificates
// docs: https://github.com/websockets/ws/blob/master/doc/ws.md
const socket = new WebSocket(`wss://${SERVER_HOST}`, { rejectUnauthorized: false, maxPayload: 1073741824 });

/** WEBSOCKET CONFIGS */
socket.addEventListener('open', () => {
  socket.send(`{ "msg": "Hello my server!", "ip": "${ip}"}`);
});

socket.addEventListener('message', event => {
  // buffer is for files
  if (Buffer.isBuffer(event.data) ) {
    // creates folder
    fs.mkdir(`${__dirname}/arquivosTransferidos/`, { recursive: true }, (err) => {
      if (err) throw err;
    });
    // for while, the file name and extensions are fixed
    // when the type is buffer, we can't send other data than the buffer itself
    // requires more messages get the correct name and extensions
    fs.writeFile(`${__dirname}/arquivosTransferidos/test.jpg`, event.data, function (err) {
      if (err) throw err;
      console.log('arquivo recebido!')
    });
  } else { 
    console.log(`Message from server: ${event.data}`);
  }
});

module.exports = socket;