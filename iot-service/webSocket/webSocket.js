const { setWSS } = require('./publisher');

module.exports = (wss) => {
  setWSS(wss); // Store the WebSocket server instance

  wss.on('connection', (ws, req) => {
    console.log(` WebSocket connected: ${req.socket.remoteAddress}`);
    ws.send(JSON.stringify({ message: 'Welcome to IoT live stream' }));

    ws.on('message', (msg) => {
      console.log('Message from client:', msg);
    });

    ws.on('close', () => {
      console.log(' WebSocket client disconnected');
    });

    ws.on('error', (err) => {
      console.error(' WS error:', err.message);
    });
  });
};
