const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

function heartbeat() {
  this.isAlive = true;
}

//WEB SOCKET CONNECTION
wss.on('connection', (ws, req) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  // Unique id from web socket
  let socketID = req.headers['sec-websocket-key'];
  console.log('web-socket server connected');

  // Message received from client
  ws.on('message', (message) => {
    let clientSite = JSON.parse(message);
    console.log(clientSite);
  });
  // Message send to client
  ws.send(JSON.stringify({ key: 12, socketID }));

  ws.on('close', () => {
    // When socket connection is close
  });
});
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      console.log('Heartbeat Closed');
      return ws.terminate();
    } else {
      console.log('Heartbeat Running');
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});
