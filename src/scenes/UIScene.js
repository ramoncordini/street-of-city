export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.modalElements = [];
  }

  create() {
    this.gameScene = this.scene.get('GameScene');
    this.createInteractionPrompt();
    this.createModal();
    this.registerEvents();
  }

  createInteractionPrompt() {
    const centerX = this.scale.width / 2;

    this.promptContainer = this.add.container(centerX, this.scale.height - 86);
    this.promptContainer.setScrollFactor(0);
    this.promptContainer.setDepth(20);

    const promptBg = this.add.image(0, 0, 'interaction-prompt-bg');
    const promptText = this.add.text(0, -2, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#21413b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.promptContainer.add([promptBg, promptText]);
    this.promptText = promptText;
    this.promptContainer.setVisible(false);
  }

  createModal() {
    const { width, height } = this.scale;

    this.modalOverlay = this.add.rectangle(0, 0, width, height, 0x17202a, 0.68)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(50)
      .setInteractive();

    this.modalPanel = this.add.rectangle(width / 2, height / 2, 560, 300, 0xfffbef, 1)
      .setStrokeStyle(4, 0x29524a)
      .setScrollFactor(0)
      .setDepth(51);

    this.modalTitle = this.add.text(width / 2, height / 2 - 94, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '34px',
      color: '#213d35',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(52);

    this.modalDescription = this.add.text(width / 2, height / 2 - 18, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#34524a',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 460 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(52);

    this.closeButton = this.add.rectangle(width / 2, height / 2 + 98, 150, 46, 0x2a9d8f, 1)
      .setStrokeStyle(3, 0x1d6f65)
      .setScrollFactor(0)
      .setDepth(52)
      .setInteractive({ useHandCursor: true });

    this.closeButtonText = this.add.text(width / 2, height / 2 + 98, 'Fechar', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(53);

    this.closeButton.on('pointerdown', () => this.closeLocationModal());
    this.input.keyboard.on('keydown-ESC', () => this.closeLocationModal());

    this.modalElements = [
      this.modalOverlay,
      this.modalPanel,
      this.modalTitle,
      this.modalDescription,
      this.closeButton,
      this.closeButtonText
    ];

    this.closeLocationModal();
  }

  registerEvents() {
    this.gameScene.events.on('interaction:show', ({ text, buildingTitle }) => {
      this.promptText.setText(`${text}: ${buildingTitle}`);
      this.promptContainer.setVisible(true);
    });

    this.gameScene.events.on('interaction:hide', () => {
      this.promptContainer.setVisible(false);
    });
  }

  openLocationModal(locationData) {
    this.modalTitle.setText(locationData.title);
    this.modalDescription.setText(locationData.description);
    this.modalElements.forEach((element) => element.setVisible(true));
    this.gameScene.scene.pause();
  }

  closeLocationModal() {
    this.modalElements.forEach((element) => element.setVisible(false));

    if (this.gameScene?.scene.isPaused()) {
      this.gameScene.scene.resume();
    }
  }
}
