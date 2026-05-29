const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = __dirname;
const players = new Map();
const clients = new Map();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const server = http.createServer((request, response) => {
  const requestedPath = request.url === '/' ? '/index.html' : request.url;
  const safePath = path.normalize(decodeURIComponent(requestedPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream'
    });
    response.end(content);
  });
});

server.on('upgrade', (request, socket) => {
  if (request.url !== '/ws') {
    socket.destroy();
    return;
  }

  const key = request.headers['sec-websocket-key'];
  const acceptKey = crypto
    .createHash('sha1')
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest('base64');

  socket.write([
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptKey}`,
    '',
    ''
  ].join('\r\n'));

  const id = crypto.randomUUID();
  clients.set(id, socket);
  send(socket, 'welcome', { id });

  socket.on('data', (buffer) => {
    const message = decodeFrame(buffer);

    if (!message) {
      return;
    }

    handleMessage(id, message);
  });

  socket.on('close', () => removePlayer(id));
  socket.on('error', () => removePlayer(id));
});

function handleMessage(id, message) {
  if (message.type === 'join') {
    const player = {
      id,
      name: sanitizeName(message.payload.name),
      color: sanitizeColor(message.payload.color),
      gender: sanitizeGender(message.payload.gender),
      x: Number(message.payload.x) || 120,
      y: Number(message.payload.y) || 528,
      flipX: false,
      moving: false
    };

    players.set(id, player);
    send(clients.get(id), 'currentPlayers', {
      players: Array.from(players.values())
    });
    broadcastExcept(id, 'playerJoined', { player });
    return;
  }

  if (message.type === 'move') {
    const player = players.get(id);

    if (!player) {
      return;
    }

    player.x = Number(message.payload.x) || player.x;
    player.y = Number(message.payload.y) || player.y;
    player.flipX = Boolean(message.payload.flipX);
    player.moving = Boolean(message.payload.moving);
    player.gender = sanitizeGender(message.payload.gender || player.gender);

    broadcastExcept(id, 'playerMoved', { player });
    return;
  }

  if (message.type === 'interaction') {
    const player = players.get(id);

    if (!player) {
      return;
    }

    broadcast('interaction', {
      fromId: id,
      fromName: player.name,
      targetId: message.payload.targetId,
      text: String(message.payload.text || 'Ola!').slice(0, 40)
    });
  }
}

function removePlayer(id) {
  const socket = clients.get(id);

  if (socket && !socket.destroyed) {
    socket.destroy();
  }

  clients.delete(id);

  if (players.delete(id)) {
    broadcast('playerLeft', { id });
  }
}

function sanitizeName(name) {
  return String(name || 'Visitante').replace(/[<>]/g, '').trim().slice(0, 16) || 'Visitante';
}

function sanitizeColor(color) {
  const value = String(color || '0x3a86ff');
  return /^0x[0-9a-fA-F]{6}$/.test(value) ? value : '0x3a86ff';
}

function sanitizeGender(gender) {
  return gender === 'female' ? 'female' : 'male';
}

function broadcast(type, payload) {
  clients.forEach((socket) => send(socket, type, payload));
}

function broadcastExcept(excludedId, type, payload) {
  clients.forEach((socket, id) => {
    if (id !== excludedId) {
      send(socket, type, payload);
    }
  });
}

function send(socket, type, payload) {
  if (!socket || socket.destroyed) {
    return;
  }

  socket.write(encodeFrame(JSON.stringify({ type, payload })));
}

function decodeFrame(buffer) {
  const secondByte = buffer[1];
  const length = secondByte & 0x7f;
  const maskStart = length === 126 ? 4 : 2;
  const dataStart = maskStart + 4;
  const masks = buffer.slice(maskStart, dataStart);
  const data = buffer.slice(dataStart, dataStart + length);
  const decoded = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 1) {
    decoded[i] = data[i] ^ masks[i % 4];
  }

  try {
    return JSON.parse(decoded.toString('utf8'));
  } catch {
    return null;
  }
}

function encodeFrame(message) {
  const payload = Buffer.from(message);
  const frame = [0x81];

  if (payload.length < 126) {
    frame.push(payload.length);
  } else {
    frame.push(126, (payload.length >> 8) & 255, payload.length & 255);
  }

  return Buffer.concat([Buffer.from(frame), payload]);
}

server.listen(PORT, () => {
  console.log(`Cidade 2D Explorer multiplayer em http://localhost:${PORT}`);
});
