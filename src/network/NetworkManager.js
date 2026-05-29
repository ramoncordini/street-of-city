export default class NetworkManager {
  constructor({ profile, onCurrentPlayers, onPlayerJoined, onPlayerMoved, onPlayerLeft, onInteraction, onStatus }) {
    this.profile = profile;
    this.handlers = {
      onCurrentPlayers,
      onPlayerJoined,
      onPlayerMoved,
      onPlayerLeft,
      onInteraction,
      onStatus
    };
    this.socket = null;
    this.localId = null;
    this.lastSentAt = 0;
  }

  connect(initialPosition) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//${window.location.host}/ws`;

    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      this.handlers.onStatus?.('online');
      this.send('join', {
        name: this.profile.name,
        color: this.profile.color,
        gender: this.profile.gender,
        x: initialPosition.x,
        y: initialPosition.y,
        flipX: false
      });
    });

    this.socket.addEventListener('close', () => {
      this.handlers.onStatus?.('offline');
    });

    this.socket.addEventListener('error', () => {
      this.handlers.onStatus?.('offline');
    });

    this.socket.addEventListener('message', (event) => {
      this.handleMessage(event.data);
    });
  }

  handleMessage(rawMessage) {
    let message;

    try {
      message = JSON.parse(rawMessage);
    } catch {
      return;
    }

    if (message.type === 'welcome') {
      this.localId = message.payload.id;
      return;
    }

    if (message.type === 'currentPlayers') {
      this.handlers.onCurrentPlayers?.(message.payload.players, this.localId);
      return;
    }

    if (message.type === 'playerJoined') {
      this.handlers.onPlayerJoined?.(message.payload.player, this.localId);
      return;
    }

    if (message.type === 'playerMoved') {
      this.handlers.onPlayerMoved?.(message.payload.player);
      return;
    }

    if (message.type === 'playerLeft') {
      this.handlers.onPlayerLeft?.(message.payload.id);
      return;
    }

    if (message.type === 'interaction') {
      this.handlers.onInteraction?.(message.payload);
    }
  }

  sendMovement(playerState) {
    const now = performance.now();

    if (now - this.lastSentAt < 50) {
      return;
    }

    this.lastSentAt = now;
    this.send('move', playerState);
  }

  sendInteraction(targetId, text) {
    this.send('interaction', {
      targetId,
      text
    });
  }

  send(type, payload) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify({ type, payload }));
  }
}
