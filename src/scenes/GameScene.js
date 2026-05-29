import Player from '../objects/Player.js';
import Building from '../objects/Building.js';
import RemotePlayer from '../objects/RemotePlayer.js';
import NetworkManager from '../network/NetworkManager.js';

const CITY_WIDTH = 4300;
const PLAYER_SPEED = 230;
const ROAD_BOTTOM_MARGIN = 12;
const ROAD_HEIGHT = 148;
const PLAYER_BOTTOM_MARGIN = 12;

const BUILDING_DATA = [
  {
    id: 'padaria',
    title: 'Padaria',
    description: 'Uma padaria de esquina com cafe fresco, pao quentinho e mesas na calcada.',
    x: 520,
    width: 230,
    height: 190,
    color: 0xf4a261,
    roofColor: 0xb94e48
  },
  {
    id: 'praca',
    title: 'Praca',
    description: 'Uma praca arborizada com bancos, coreto e clima de fim de tarde no interior.',
    x: 1030,
    width: 270,
    height: 130,
    color: 0x6abf69,
    roofColor: 0x2d6a4f,
    variant: 'park'
  },
  {
    id: 'museu',
    title: 'Museu',
    description: 'Um museu historico com fachada colonial, exposicoes locais e muita memoria da cidade.',
    x: 1560,
    width: 260,
    height: 220,
    color: 0xf6e6c2,
    roofColor: 0x8d5524,
    variant: 'museum'
  },
  {
    id: 'restaurante',
    title: 'Restaurante',
    description: 'Restaurante familiar com comida brasileira, varanda colorida e musica ao vivo nos fins de semana.',
    x: 2160,
    width: 300,
    height: 205,
    color: 0xe76f51,
    roofColor: 0x264653
  },
  {
    id: 'igreja',
    title: 'Igreja',
    description: 'Uma igreja charmosa no alto da cidade, com torre pontuda, cupula clara e jardins ao redor.',
    x: 2560,
    width: 340,
    height: 265,
    color: 0xe8eee9,
    roofColor: 0x30343f,
    variant: 'church',
    interactionRange: 190,
    doorTriggerWidth: 84
  },
  {
    id: 'westphal',
    title: 'Cachacaria Westphal',
    description: 'Uma cachacaria acolhedora com fachada verde, varanda aberta, mesas de madeira e um cantinho rustico com barris.',
    x: 3140,
    width: 370,
    height: 210,
    color: 0x55b49c,
    roofColor: 0x6f4a35,
    variant: 'westphal',
    interactionRange: 190,
    doorTriggerWidth: 96
  },
  {
    id: 'pousada',
    title: 'Pousada',
    description: 'Uma pousada acolhedora com redes, jardim florido e vista para as ladeiras da cidade.',
    x: 3840,
    width: 280,
    height: 210,
    color: 0x9c89b8,
    roofColor: 0x4a4e69
  }
];

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.nearbyBuilding = null;
    this.nearbyRemotePlayer = null;
    this.promptedRemotePlayer = null;
  }

  create() {
    this.worldWidth = CITY_WIDTH;
    this.playerSpeed = PLAYER_SPEED;
    this.groundY = this.scale.height - ROAD_BOTTOM_MARGIN - ROAD_HEIGHT;
    this.playerRoadY = this.scale.height - PLAYER_BOTTOM_MARGIN;
    this.roadBounds = {
      top: this.groundY + 8,
      bottom: this.playerRoadY
    };
    this.lastInteractedBuilding = null;
    this.remotePlayers = new Map();
    this.profile = window.CIDADE_PLAYER_PROFILE ?? {
      name: 'Visitante',
      color: '0x3a86ff'
    };

    this.physics.world.setBounds(0, 0, this.worldWidth, this.scale.height);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.scale.height);

    this.drawSky();
    this.drawCityBackground();
    this.drawStreet();

    this.buildings = BUILDING_DATA.map((buildingData) => {
      return new Building(this, {
        ...buildingData,
        y: this.groundY
      });
    });

    this.player = new Player(this, 120, this.playerRoadY, this.playerSpeed, this.roadBounds, this.profile);
    this.player.sprite.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08, -160, 0);
    this.cameras.main.setDeadzone(160, 80);

    this.interactWithPlayerKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.setupNetwork();

    this.events.emit('interaction:hide');
  }

  update() {
    this.player.update();
    this.updateRemotePlayers();
    this.syncLocalPlayer();
    this.updateInteractionState();
    this.updateRemotePlayerInteraction();
  }

  setupNetwork() {
    this.network = new NetworkManager({
      profile: this.profile,
      onCurrentPlayers: (players, localId) => {
        players.forEach((playerData) => this.addRemotePlayer(playerData, localId));
      },
      onPlayerJoined: (playerData, localId) => {
        this.addRemotePlayer(playerData, localId);
      },
      onPlayerMoved: (playerData) => {
        this.remotePlayers.get(playerData.id)?.updateFromNetwork(playerData);
      },
      onPlayerLeft: (id) => {
        this.removeRemotePlayer(id);
      },
      onInteraction: (payload) => {
        this.handleRemoteInteraction(payload);
      },
      onStatus: (status) => {
        this.events.emit('network:status', status);
      }
    });

    this.network.connect(this.player.getFeetPosition());
  }

  addRemotePlayer(playerData, localId) {
    if (playerData.id === localId || this.remotePlayers.has(playerData.id)) {
      return;
    }

    this.remotePlayers.set(playerData.id, new RemotePlayer(this, playerData));
  }

  removeRemotePlayer(id) {
    const remotePlayer = this.remotePlayers.get(id);

    if (!remotePlayer) {
      return;
    }

    remotePlayer.destroy();
    this.remotePlayers.delete(id);
  }

  updateRemotePlayers() {
    this.remotePlayers.forEach((remotePlayer) => remotePlayer.update());
  }

  syncLocalPlayer() {
    this.network?.sendMovement(this.player.getNetworkState());
  }

  updateRemotePlayerInteraction() {
    const remotePlayer = this.findClosestRemotePlayer();
    this.nearbyRemotePlayer = remotePlayer;

    if (remotePlayer !== this.promptedRemotePlayer) {
      this.promptedRemotePlayer = remotePlayer;

      if (remotePlayer) {
        this.events.emit('interaction:show', {
          text: 'Espaco para cumprimentar',
          buildingTitle: remotePlayer.name
        });
      } else {
        this.events.emit('interaction:hide');
      }
    }

    const mobileActionPressed = window.CIDADE_TOUCH_INPUT?.consumeAction();

    if (remotePlayer && (Phaser.Input.Keyboard.JustDown(this.interactWithPlayerKey) || mobileActionPressed)) {
      const text = 'Ola!';
      this.player.showMessage(text);
      remotePlayer.showMessage(`${this.profile.name}: ${text}`);
      this.network?.sendInteraction(remotePlayer.id, text);
    }
  }

  findClosestRemotePlayer() {
    const playerFeet = this.player.getFeetPosition();
    let closestPlayer = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    this.remotePlayers.forEach((remotePlayer) => {
      const remoteFeet = remotePlayer.getFeetPosition();
      const distance = Phaser.Math.Distance.Between(playerFeet.x, playerFeet.y, remoteFeet.x, remoteFeet.y);

      if (distance < 90 && distance < closestDistance) {
        closestPlayer = remotePlayer;
        closestDistance = distance;
      }
    });

    return closestPlayer;
  }

  handleRemoteInteraction(payload) {
    if (payload.targetId === this.network.localId) {
      this.player.showMessage(`${payload.fromName}: ${payload.text}`);
      return;
    }

    this.remotePlayers.get(payload.fromId)?.showMessage(payload.text);
  }

  updateInteractionState() {
    const closestBuilding = this.findClosestInteractiveBuilding();
    const doorBuilding = this.findDoorContactBuilding();

    if (closestBuilding !== this.nearbyBuilding) {
      this.nearbyBuilding?.setActiveState(false);
      closestBuilding?.setActiveState(true);
      this.nearbyBuilding = closestBuilding;
    }

    if (!doorBuilding) {
      this.lastInteractedBuilding = null;
      return;
    }

    if (doorBuilding !== this.lastInteractedBuilding) {
      this.lastInteractedBuilding = doorBuilding;
      this.scene.get('UIScene').openLocationModal(doorBuilding.getInteractionPayload());
    }
  }

  findClosestInteractiveBuilding() {
    const playerX = this.player.sprite.x;
    let closestBuilding = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    this.buildings.forEach((building) => {
      const distance = Math.abs(playerX - building.getCenterX());

      if (distance < building.interactionRange && distance < closestDistance) {
        closestBuilding = building;
        closestDistance = distance;
      }
    });

    return closestBuilding;
  }

  findDoorContactBuilding() {
    return this.buildings.find((building) => this.isPlayerTouchingDoor(building)) ?? null;
  }

  isPlayerTouchingDoor(building) {
    const doorBounds = building.getDoorTriggerBounds();
    const playerFeet = this.player.getFeetPosition();

    return Phaser.Geom.Rectangle.Contains(doorBounds, playerFeet.x, playerFeet.y);
  }

  drawSky() {
    const sky = this.add.graphics();
    sky.fillStyle(0x7ec8e3, 1);
    sky.fillRect(0, 0, this.worldWidth, this.scale.height);

    sky.fillStyle(0xfff1a8, 1);
    sky.fillCircle(150, 88, 38);

    // Nuvens simples em blocos para reforcar a estetica pixel art.
    for (let x = 340; x < this.worldWidth; x += 680) {
      sky.fillStyle(0xffffff, 0.82);
      sky.fillRect(x, 78, 80, 18);
      sky.fillRect(x + 24, 58, 64, 20);
      sky.fillRect(x + 74, 70, 74, 18);
    }
  }

  drawCityBackground() {
    const background = this.add.graphics();

    for (let x = 0; x < this.worldWidth; x += 180) {
      const height = Phaser.Math.Between(70, 145);
      background.fillStyle(0x68a7ad, 0.48);
      background.fillRect(x, this.groundY - height - 76, 120, height);
      background.fillStyle(0xf8f4d9, 0.65);

      for (let windowY = this.groundY - height - 54; windowY < this.groundY - 90; windowY += 26) {
        background.fillRect(x + 18, windowY, 12, 12);
        background.fillRect(x + 58, windowY, 12, 12);
      }
    }

    background.setScrollFactor(0.35, 1);
  }

  drawStreet() {
    const street = this.add.graphics();

    street.fillStyle(0x4f6d7a, 1);
    street.fillRect(0, this.groundY - 20, this.worldWidth, 28);

    street.fillStyle(0x40555f, 1);
    street.fillRect(0, this.groundY + 8, this.worldWidth, 130);

    street.fillStyle(0xf6d365, 1);
    for (let x = 80; x < this.worldWidth; x += 180) {
      street.fillRect(x, this.groundY + 68, 86, 8);
    }

    street.fillStyle(0x2d3f48, 1);
    street.fillRect(0, this.groundY + 128, this.worldWidth, 20);
  }
}
