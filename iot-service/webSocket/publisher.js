let wssInstance = null;

function setWSS(wss) {
  wssInstance = wss;
}

function broadcastNewIoTData(data) {
  if (!wssInstance) return;
  const payload = JSON.stringify({ type: 'iot_data', data });

  wssInstance.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

module.exports = { setWSS, broadcastNewIoTData };
