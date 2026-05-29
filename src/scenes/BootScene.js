export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.createGeneratedTextures();
  }

  create() {
    this.scene.start('GameScene');
    this.scene.launch('UIScene');
  }

  createGeneratedTextures() {
    this.createPlayerTexture();
    this.createFemalePlayerTexture();
    this.createPromptTexture();
  }

  createPlayerTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Frame 0: pose neutra.
    graphics.fillStyle(0x1f2d4a, 1);
    graphics.fillRect(8, 14, 6, 18);
    graphics.fillRect(26, 14, 6, 18);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(8, 30, 6, 7);
    graphics.fillRect(26, 30, 6, 7);
    graphics.fillStyle(0x2f3a56, 1);
    graphics.fillRect(12, 10, 16, 18);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(14, 2, 12, 10);
    graphics.fillStyle(0xffd166, 1);
    graphics.fillRect(10, 0, 20, 5);
    graphics.fillStyle(0x3a86ff, 1);
    graphics.fillRect(10, 28, 8, 14);
    graphics.fillRect(22, 28, 8, 14);
    graphics.fillStyle(0x1b1f3b, 1);
    graphics.fillRect(8, 42, 10, 4);
    graphics.fillRect(22, 42, 10, 4);
    graphics.generateTexture('player-idle', 40, 48);
    graphics.clear();

    // Frame 1: passo com a perna esquerda.
    graphics.fillStyle(0x1f2d4a, 1);
    graphics.fillRect(6, 13, 6, 16);
    graphics.fillRect(28, 16, 6, 18);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(6, 27, 6, 7);
    graphics.fillRect(28, 32, 6, 7);
    graphics.fillStyle(0x2f3a56, 1);
    graphics.fillRect(12, 10, 16, 18);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(14, 2, 12, 10);
    graphics.fillStyle(0xffd166, 1);
    graphics.fillRect(10, 0, 20, 5);
    graphics.fillStyle(0x3a86ff, 1);
    graphics.fillRect(8, 28, 8, 14);
    graphics.fillRect(24, 28, 8, 14);
    graphics.fillStyle(0x1b1f3b, 1);
    graphics.fillRect(6, 42, 10, 4);
    graphics.fillRect(26, 42, 10, 4);
    graphics.generateTexture('player-walk-1', 40, 48);
    graphics.clear();

    // Frame 2: passo com a perna direita.
    graphics.fillStyle(0x1f2d4a, 1);
    graphics.fillRect(8, 16, 6, 18);
    graphics.fillRect(28, 13, 6, 16);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(8, 32, 6, 7);
    graphics.fillRect(28, 27, 6, 7);
    graphics.fillStyle(0x2f3a56, 1);
    graphics.fillRect(12, 10, 16, 18);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(14, 2, 12, 10);
    graphics.fillStyle(0xffd166, 1);
    graphics.fillRect(10, 0, 20, 5);
    graphics.fillStyle(0x3a86ff, 1);
    graphics.fillRect(14, 28, 8, 14);
    graphics.fillRect(20, 28, 8, 14);
    graphics.fillStyle(0x1b1f3b, 1);
    graphics.fillRect(12, 42, 10, 4);
    graphics.fillRect(20, 42, 10, 4);
    graphics.generateTexture('player-walk-2', 40, 48);
    graphics.destroy();
  }

  createFemalePlayerTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Frame 0: pose neutra com cabelo longo e silhueta feminina simples.
    graphics.fillStyle(0x4a2c2a, 1);
    graphics.fillRect(11, 1, 18, 18);
    graphics.fillRect(8, 9, 6, 20);
    graphics.fillRect(26, 9, 6, 20);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(14, 3, 12, 10);
    graphics.fillStyle(0x1f2d4a, 1);
    graphics.fillRect(8, 16, 6, 18);
    graphics.fillRect(26, 16, 6, 18);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(8, 32, 6, 7);
    graphics.fillRect(26, 32, 6, 7);
    graphics.fillStyle(0x2f3a56, 1);
    graphics.fillRect(12, 13, 16, 15);
    graphics.fillStyle(0xff6b9a, 1);
    graphics.fillTriangle(10, 28, 20, 14, 30, 28);
    graphics.fillRect(11, 27, 18, 10);
    graphics.fillStyle(0x3a86ff, 1);
    graphics.fillRect(11, 36, 7, 8);
    graphics.fillRect(22, 36, 7, 8);
    graphics.fillStyle(0x1b1f3b, 1);
    graphics.fillRect(9, 42, 9, 4);
    graphics.fillRect(22, 42, 9, 4);
    graphics.generateTexture('player-female-idle', 40, 48);
    graphics.clear();

    // Frame 1: passo esquerdo.
    graphics.fillStyle(0x4a2c2a, 1);
    graphics.fillRect(11, 1, 18, 18);
    graphics.fillRect(8, 9, 6, 20);
    graphics.fillRect(26, 9, 6, 20);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(14, 3, 12, 10);
    graphics.fillStyle(0x1f2d4a, 1);
    graphics.fillRect(6, 15, 6, 16);
    graphics.fillRect(28, 18, 6, 18);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(6, 29, 6, 7);
    graphics.fillRect(28, 34, 6, 7);
    graphics.fillStyle(0x2f3a56, 1);
    graphics.fillRect(12, 13, 16, 15);
    graphics.fillStyle(0xff6b9a, 1);
    graphics.fillTriangle(9, 28, 20, 14, 31, 28);
    graphics.fillRect(10, 27, 20, 10);
    graphics.fillStyle(0x3a86ff, 1);
    graphics.fillRect(8, 36, 7, 8);
    graphics.fillRect(25, 36, 7, 8);
    graphics.fillStyle(0x1b1f3b, 1);
    graphics.fillRect(6, 42, 9, 4);
    graphics.fillRect(25, 42, 9, 4);
    graphics.generateTexture('player-female-walk-1', 40, 48);
    graphics.clear();

    // Frame 2: passo direito.
    graphics.fillStyle(0x4a2c2a, 1);
    graphics.fillRect(11, 1, 18, 18);
    graphics.fillRect(8, 9, 6, 20);
    graphics.fillRect(26, 9, 6, 20);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(14, 3, 12, 10);
    graphics.fillStyle(0x1f2d4a, 1);
    graphics.fillRect(8, 18, 6, 18);
    graphics.fillRect(28, 15, 6, 16);
    graphics.fillStyle(0xf0b27a, 1);
    graphics.fillRect(8, 34, 6, 7);
    graphics.fillRect(28, 29, 6, 7);
    graphics.fillStyle(0x2f3a56, 1);
    graphics.fillRect(12, 13, 16, 15);
    graphics.fillStyle(0xff6b9a, 1);
    graphics.fillTriangle(9, 28, 20, 14, 31, 28);
    graphics.fillRect(10, 27, 20, 10);
    graphics.fillStyle(0x3a86ff, 1);
    graphics.fillRect(14, 36, 7, 8);
    graphics.fillRect(20, 36, 7, 8);
    graphics.fillStyle(0x1b1f3b, 1);
    graphics.fillRect(12, 42, 9, 4);
    graphics.fillRect(20, 42, 9, 4);
    graphics.generateTexture('player-female-walk-2', 40, 48);
    graphics.destroy();
  }

  createPromptTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    graphics.fillStyle(0xffffff, 1);
    graphics.fillRoundedRect(0, 0, 280, 44, 8);
    graphics.lineStyle(3, 0x29524a, 1);
    graphics.strokeRoundedRect(0, 0, 280, 44, 8);
    graphics.generateTexture('interaction-prompt-bg', 280, 44);
    graphics.destroy();
  }
}
