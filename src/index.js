const WebSocket = require('ws');
const fetch = require('node-fetch');

const host = '192.168.0.46:1780';
const request = {
  id: 0,
  jsonrpc: '2.0',
  method: 'Server.GetRPCVersion',
};

const ws = new WebSocket(`ws://${host}/jsonrpc`);

async function handleStreamOnUpdate(message) {
  if (message.params && message.params.stream && message.params.stream.status === 'playing') {
    console.log('Turning on tv...');
    try {
      await fetch('http://192.168.0.55:8080/device/dev0/turnOn', { method: 'POST' });
      await fetch('http://192.168.0.55:8080/command/setActive', { method: 'POST' });
    } catch (e) {
      console.log(`ERROR: ${JSON.stringify(e)}`);
    }
  }
}

ws.addEventListener('message', (message) => {
  const data = JSON.parse(message.data);
  if (data.method === 'Stream.OnUpdate') {
    handleStreamOnUpdate(data);
  }
});

ws.addEventListener('open', () => {
  console.log('Listening...')
  return ws.send(JSON.stringify(++request.id && request))
});
