export default class Player {
  constructor(scene, x, y, speed, movementBounds, profile) {
    this.scene = scene;
    this.speed = speed;
    this.movementBounds = movementBounds;
    this.profile = profile;
    this.texturePrefix = profile.gender === 'female' ? 'player-female' : 'player';
    this.walkAnimationKey = `${this.texturePrefix}-walk`;
    this.isMoving = false;
    this.cursors = scene.input.keyboard.createCursorKeys();

    this.sprite = scene.physics.add.sprite(x, y, `${this.texturePrefix}-idle`);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDepth(20);
    this.sprite.setTint(Number(profile.color));
    this.sprite.body.setSize(24, 42);
    this.sprite.body.setOffset(8, 4);

    this.shadow = scene.add.ellipse(x, y - 2, 34, 10, 0x17202a, 0.26);
    this.shadow.setDepth(19);

    this.label = scene.add.text(x, y - 58, profile.name, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#29524a',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(30);

    this.message = scene.add.text(x, y - 86, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#213d35',
      backgroundColor: '#fffbef',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(31).setVisible(false);

    this.createAnimations();
  }

  createAnimations() {
    if (this.scene.anims.exists(this.walkAnimationKey)) {
      return;
    }

    this.scene.anims.create({
      key: this.walkAnimationKey,
      frames: [
        { key: `${this.texturePrefix}-walk-1` },
        { key: `${this.texturePrefix}-idle` },
        { key: `${this.texturePrefix}-walk-2` },
        { key: `${this.texturePrefix}-idle` }
      ],
      frameRate: 8,
      repeat: -1
    });
  }

  update() {
    const touchInput = window.CIDADE_TOUCH_INPUT;
    const movingLeft = this.cursors.left.isDown || touchInput?.left;
    const movingRight = this.cursors.right.isDown || touchInput?.right;
    const movingUp = this.cursors.up.isDown || touchInput?.up;
    const movingDown = this.cursors.down.isDown || touchInput?.down;
    const direction = new Phaser.Math.Vector2(0, 0);

    if (movingLeft && !movingRight) {
      direction.x = -1;
      this.sprite.setFlipX(true);
    }

    if (movingRight && !movingLeft) {
      direction.x = 1;
      this.sprite.setFlipX(false);
    }

    if (movingUp && !movingDown) {
      direction.y = -1;
    }

    if (movingDown && !movingUp) {
      direction.y = 1;
    }

    if (direction.length() > 0) {
      direction.normalize();
      this.sprite.setVelocity(direction.x * this.speed, direction.y * this.speed);
      this.sprite.play(this.walkAnimationKey, true);
      this.isMoving = true;
    } else {
      this.sprite.setVelocity(0, 0);
      this.sprite.stop();
      this.sprite.setTexture(`${this.texturePrefix}-idle`);
      this.isMoving = false;
    }

    this.keepInsideRoad();
    this.shadow.setPosition(this.sprite.x, this.sprite.y - 2);
    this.label.setPosition(this.sprite.x, this.sprite.y - 58);
    this.message.setPosition(this.sprite.x, this.sprite.y - 86);
    this.sprite.setDepth(20 + this.sprite.y / 1000);
    this.shadow.setDepth(this.sprite.depth - 0.1);
  }

  keepInsideRoad() {
    const clampedY = Phaser.Math.Clamp(
      this.sprite.y,
      this.movementBounds.top,
      this.movementBounds.bottom
    );

    if (clampedY !== this.sprite.y) {
      this.sprite.y = clampedY;
      this.sprite.setVelocityY(0);
    }
  }

  getFeetPosition() {
    return {
      x: this.sprite.x,
      y: this.sprite.y
    };
  }

  getNetworkState() {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
      flipX: this.sprite.flipX,
      moving: this.isMoving,
      gender: this.profile.gender
    };
  }

  showMessage(text) {
    this.message.setText(text);
    this.message.setVisible(true);

    this.scene.time.delayedCall(1800, () => {
      this.message.setVisible(false);
    });
  }
}
