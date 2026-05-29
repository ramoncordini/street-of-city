export default class RemotePlayer {
  constructor(scene, playerData) {
    this.scene = scene;
    this.id = playerData.id;
    this.name = playerData.name;
    this.gender = playerData.gender;
    this.texturePrefix = playerData.gender === 'female' ? 'player-female' : 'player';
    this.walkAnimationKey = `${this.texturePrefix}-walk`;
    this.targetX = playerData.x;
    this.targetY = playerData.y;

    this.shadow = scene.add.ellipse(playerData.x, playerData.y - 2, 34, 10, 0x17202a, 0.22);
    this.shadow.setDepth(19);

    this.sprite = scene.add.sprite(playerData.x, playerData.y, `${this.texturePrefix}-idle`);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDepth(20);
    this.sprite.setTint(Number(playerData.color));
    this.sprite.setFlipX(Boolean(playerData.flipX));

    this.label = scene.add.text(playerData.x, playerData.y - 58, playerData.name, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#29524a',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(30);

    this.message = scene.add.text(playerData.x, playerData.y - 86, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#213d35',
      backgroundColor: '#fffbef',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(31).setVisible(false);
  }

  updateFromNetwork(playerData) {
    this.targetX = playerData.x;
    this.targetY = playerData.y;
    this.sprite.setFlipX(Boolean(playerData.flipX));

    if (playerData.moving) {
      this.sprite.play(this.walkAnimationKey, true);
    } else {
      this.sprite.stop();
      this.sprite.setTexture(`${this.texturePrefix}-idle`);
    }
  }

  update() {
    this.sprite.x = Phaser.Math.Linear(this.sprite.x, this.targetX, 0.35);
    this.sprite.y = Phaser.Math.Linear(this.sprite.y, this.targetY, 0.35);
    this.shadow.setPosition(this.sprite.x, this.sprite.y - 2);
    this.label.setPosition(this.sprite.x, this.sprite.y - 58);
    this.message.setPosition(this.sprite.x, this.sprite.y - 86);
    this.sprite.setDepth(20 + this.sprite.y / 1000);
    this.shadow.setDepth(this.sprite.depth - 0.1);
  }

  showMessage(text) {
    this.message.setText(text);
    this.message.setVisible(true);

    this.scene.time.delayedCall(1800, () => {
      this.message.setVisible(false);
    });
  }

  getFeetPosition() {
    return {
      x: this.sprite.x,
      y: this.sprite.y
    };
  }

  destroy() {
    this.shadow.destroy();
    this.sprite.destroy();
    this.label.destroy();
    this.message.destroy();
  }
}
