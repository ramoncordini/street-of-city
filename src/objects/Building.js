export default class Building {
  constructor(scene, data) {
    this.scene = scene;
    this.data = data;
    this.interactionRange = data.interactionRange ?? 150;
    this.baseY = data.y;

    this.container = scene.add.container(data.x, data.y);
    this.container.setDepth(5);

    this.drawBuilding();
    this.drawSceneDetails();
    this.drawVariantLabels();
    this.drawLabel();
    this.drawInteractionMarker();
  }

  drawBuilding() {
    const { width, height, color, roofColor, variant } = this.data;
    const graphics = this.scene.add.graphics();

    if (variant === 'park') {
      this.drawPark(graphics, width, height, color, roofColor);
    } else if (variant === 'museum') {
      this.drawMuseum(graphics, width, height, color, roofColor);
    } else if (variant === 'church') {
      this.drawChurch(graphics, width, height, color, roofColor);
    } else if (variant === 'westphal') {
      this.drawWestphal(graphics, width, height, color, roofColor);
    } else {
      this.drawStorefront(graphics, width, height, color, roofColor);
    }

    this.container.add(graphics);
  }

  drawStorefront(graphics, width, height, color, roofColor) {
    const left = -width / 2;
    const top = -height;

    graphics.fillStyle(color, 1);
    graphics.fillRect(left, top, width, height);

    graphics.fillStyle(roofColor, 1);
    graphics.fillTriangle(left - 14, top + 8, 0, top - 46, width / 2 + 14, top + 8);

    graphics.fillStyle(0xfffbef, 1);
    graphics.fillRect(left + 28, top + 62, 54, 46);
    graphics.fillRect(left + width - 82, top + 62, 54, 46);

    graphics.fillStyle(0x29524a, 1);
    graphics.fillRect(left + width / 2 - 28, -72, 56, 72);

    graphics.fillStyle(0xf6d365, 1);
    graphics.fillRect(left + 20, top + 24, width - 40, 28);
  }

  drawPark(graphics, width, height, color, roofColor) {
    const left = -width / 2;
    const top = -height;

    graphics.fillStyle(0x8bd17c, 1);
    graphics.fillRect(left, top + 58, width, height - 58);

    graphics.fillStyle(roofColor, 1);
    graphics.fillRect(left + 38, top + 92, width - 76, 16);
    graphics.fillRect(left + 52, top + 108, 18, 42);
    graphics.fillRect(left + width - 70, top + 108, 18, 42);

    graphics.fillStyle(0x8d5524, 1);
    graphics.fillRect(left + 30, top + 42, 16, 72);
    graphics.fillRect(left + width - 54, top + 28, 16, 86);

    graphics.fillStyle(0x2d6a4f, 1);
    graphics.fillCircle(left + 38, top + 34, 42);
    graphics.fillCircle(left + width - 46, top + 20, 48);

    graphics.fillStyle(color, 1);
    graphics.fillRect(left + 96, top + 32, 78, 62);
    graphics.fillStyle(0xfffbef, 1);
    graphics.fillTriangle(left + 86, top + 40, left + 135, top, left + 184, top + 40);
  }

  drawMuseum(graphics, width, height, color, roofColor) {
    const left = -width / 2;
    const top = -height;

    graphics.fillStyle(color, 1);
    graphics.fillRect(left, top + 40, width, height - 40);

    graphics.fillStyle(roofColor, 1);
    graphics.fillTriangle(left - 12, top + 42, 0, top - 28, width / 2 + 12, top + 42);

    graphics.fillStyle(0xd9c9a3, 1);
    for (let x = left + 36; x < width / 2 - 20; x += 52) {
      graphics.fillRect(x, top + 72, 24, height - 72);
    }

    graphics.fillStyle(0x29524a, 1);
    graphics.fillRect(-32, -78, 64, 78);

    graphics.fillStyle(0xf6d365, 1);
    graphics.fillRect(left + 44, top + 18, width - 88, 22);
  }

  drawChurch(graphics, width, height, color, roofColor) {
    const left = -width / 2;
    const top = -height;

    // Corpo principal claro, inspirado nas igrejas turisticas serranas brasileiras.
    graphics.fillStyle(color, 1);
    graphics.fillRect(left + 78, top + 104, width - 112, height - 104);
    graphics.fillRect(left + 122, top + 72, width - 198, 58);

    graphics.fillStyle(0xcfd8d3, 1);
    graphics.fillRect(left + 92, top + 120, width - 140, 6);
    graphics.fillRect(left + 92, top + 156, width - 140, 6);

    // Telhados escuros em blocos, com empena central.
    graphics.fillStyle(roofColor, 1);
    graphics.fillRect(left + 54, top + 96, 116, 24);
    graphics.fillRect(left + width - 118, top + 100, 86, 24);
    graphics.fillTriangle(left + 104, top + 106, 0, top + 50, left + width - 104, top + 106);
    graphics.fillTriangle(left + 128, top + 112, 0, top + 68, left + width - 128, top + 112);

    // Cupula arredondada no fundo, com lanterna no topo.
    graphics.fillStyle(0xdfe7e2, 1);
    graphics.fillCircle(left + width - 118, top + 64, 58);
    graphics.fillRect(left + width - 176, top + 64, 116, 76);
    graphics.fillStyle(0xb9c7c1, 1);
    graphics.fillRect(left + width - 174, top + 62, 112, 5);
    graphics.fillRect(left + width - 122, top + 8, 8, 132);
    graphics.fillRect(left + width - 154, top + 54, 8, 78);
    graphics.fillRect(left + width - 88, top + 54, 8, 78);
    graphics.fillStyle(0xdfe7e2, 1);
    graphics.fillRect(left + width - 144, top - 2, 52, 42);
    graphics.fillStyle(roofColor, 1);
    graphics.fillTriangle(left + width - 146, top - 2, left + width - 118, top - 34, left + width - 90, top - 2);
    graphics.fillStyle(0x30343f, 1);
    graphics.fillRect(left + width - 120, top - 48, 4, 18);
    graphics.fillRect(left + width - 126, top - 42, 16, 4);

    // Torre lateral alta com ponta fina e cruz.
    graphics.fillStyle(color, 1);
    graphics.fillRect(left + 34, top + 26, 78, height - 26);
    graphics.fillStyle(0xcfd8d3, 1);
    graphics.fillRect(left + 44, top + 44, 58, 5);
    graphics.fillRect(left + 44, top + 132, 58, 5);
    graphics.fillStyle(0xd9a072, 1);
    graphics.fillTriangle(left + 30, top + 28, left + 73, top - 66, left + 116, top + 28);
    graphics.fillStyle(0x30343f, 1);
    graphics.fillRect(left + 71, top - 86, 4, 22);
    graphics.fillRect(left + 64, top - 78, 18, 4);

    // Janelas verticais e rosetas.
    graphics.fillStyle(0xf7fbff, 1);
    graphics.fillRect(left + 58, top + 62, 28, 58);
    graphics.fillRect(left + 140, top + 146, 32, 58);
    graphics.fillRect(left + 202, top + 146, 32, 58);
    graphics.fillRect(left + width - 82, top + 156, 24, 44);
    graphics.lineStyle(3, 0x6b8790, 1);
    graphics.strokeRect(left + 58, top + 62, 28, 58);
    graphics.strokeRect(left + 140, top + 146, 32, 58);
    graphics.strokeRect(left + 202, top + 146, 32, 58);
    graphics.strokeRect(left + width - 82, top + 156, 24, 44);
    graphics.fillCircle(left + 73, top + 150, 13);
    graphics.fillCircle(0, top + 132, 16);
    graphics.fillStyle(0xf7fbff, 1);
    graphics.fillCircle(left + 73, top + 150, 8);
    graphics.fillCircle(0, top + 132, 10);

    // Porta central para manter a interacao alinhada com o pe da construcao.
    graphics.fillStyle(0x29524a, 1);
    graphics.fillRect(-28, -74, 56, 74);
    graphics.fillStyle(0xf6d365, 1);
    graphics.fillRect(-3, -38, 6, 6);

    // Jardim baixo para reforcar a atmosfera acolhedora sem bloquear a rua.
    graphics.fillStyle(0x3f8f57, 1);
    graphics.fillRect(left + 12, -18, width - 24, 18);
    graphics.fillStyle(0xf6d365, 1);
    graphics.fillRect(left + 42, -26, 10, 10);
    graphics.fillStyle(0xe76f51, 1);
    graphics.fillRect(left + width - 54, -26, 10, 10);
  }

  drawWestphal(graphics, width, height, color, roofColor) {
    const left = -width / 2;
    const top = -height;

    // Fachada baixa com varanda aberta, inspirada na referencia da Cachacaria Westphal.
    graphics.fillStyle(0xf2ead3, 1);
    graphics.fillRect(left + 18, top + 54, width - 36, height - 54);
    graphics.fillStyle(color, 1);
    graphics.fillRect(left + 44, top + 82, width - 88, height - 82);

    graphics.fillStyle(0xe7ddc7, 1);
    graphics.fillRect(left + 10, top + 70, width - 20, 20);
    graphics.fillRect(left + 36, top + 96, 18, height - 96);
    graphics.fillRect(left + width - 58, top + 96, 18, height - 96);
    graphics.fillRect(-10, top + 96, 20, height - 96);

    // Telhado colonial com fileiras de telhas.
    graphics.fillStyle(roofColor, 1);
    graphics.fillRect(left + 4, top + 26, width - 8, 44);
    graphics.fillTriangle(left - 10, top + 70, 0, top + 18, width / 2 + 10, top + 70);
    graphics.fillStyle(0x8d6a4f, 1);
    for (let tileX = left + 18; tileX < width / 2 - 12; tileX += 22) {
      graphics.fillRect(tileX, top + 34, 13, 30);
      graphics.fillRect(tileX + 7, top + 42, 13, 24);
    }

    // Interior sombreado da varanda.
    graphics.fillStyle(0x203a36, 0.78);
    graphics.fillRect(left + 58, top + 104, width - 116, 92);

    graphics.fillStyle(0x29524a, 1);
    graphics.fillRect(left + 82, top + 118, 48, 78);
    graphics.fillRect(left + width - 130, top + 118, 48, 78);

    graphics.fillStyle(0xfffbef, 1);
    graphics.fillRect(left + 146, top + 116, 64, 42);
    graphics.fillStyle(0x6b8790, 1);
    graphics.fillRect(left + 154, top + 124, 48, 28);

    // Balcao e detalhes de mesas na frente da loja.
    graphics.fillStyle(0x8d5524, 1);
    graphics.fillRect(left + 72, -56, 84, 14);
    graphics.fillRect(left + 88, -42, 10, 34);
    graphics.fillRect(left + 132, -42, 10, 34);
    graphics.fillRect(left + width - 142, -52, 72, 12);
    graphics.fillRect(left + width - 126, -40, 10, 30);
    graphics.fillRect(left + width - 88, -40, 10, 30);

    // Placa central da marca.
    graphics.fillStyle(0x5c3b28, 1);
    graphics.fillRoundedRect(-76, top + 86, 152, 34, 6);
    graphics.lineStyle(2, 0xf6d365, 1);
    graphics.strokeRoundedRect(-76, top + 86, 152, 34, 6);
    graphics.fillStyle(0xf6d365, 1);
    graphics.fillRect(-54, top + 98, 108, 4);
    graphics.fillRect(-42, top + 108, 84, 4);

    // Area lateral clara que lembra o volume branco da fachada real.
    graphics.fillStyle(0xe8eee9, 1);
    graphics.fillRect(left + width - 74, top + 90, 54, height - 90);
    graphics.fillStyle(0x29524a, 1);
    graphics.fillRect(left + width - 58, top + 120, 28, 62);

    // Porta central usada pela interacao invisivel no nivel dos pes.
    graphics.fillStyle(0x1b1f3b, 1);
    graphics.fillRect(-26, -76, 52, 76);
    graphics.fillStyle(0xf6d365, 1);
    graphics.fillRect(18, -40, 6, 6);
  }

  drawSceneDetails() {
    if (this.data.variant !== 'westphal') {
      return;
    }

    this.drawWestphalOppositeSide();
  }

  drawVariantLabels() {
    if (this.data.variant !== 'westphal') {
      return;
    }

    const top = -this.data.height;
    const brandText = this.scene.add.text(0, top + 103, 'WESTPHAL', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#f6d365',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const subtitleText = this.scene.add.text(0, top + 116, 'CACHACARIA', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '9px',
      color: '#fffbef',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.container.add([brandText, subtitleText]);
  }

  drawWestphalOppositeSide() {
    const container = this.scene.add.container(this.data.x, this.data.y + 112);
    const graphics = this.scene.add.graphics();
    container.setDepth(24);

    // Cantinho rustico no outro lado da rua: bancos, mesas, barril e placa vertical.
    graphics.fillStyle(0x4f8f4f, 1);
    graphics.fillRect(-190, -14, 380, 32);

    this.drawWoodTable(graphics, -130, -12);
    this.drawWoodTable(graphics, -38, -8);
    this.drawBench(graphics, 54, -18, 112);
    this.drawBarrel(graphics, 142, -34);
    this.drawSignPost(graphics, 184, -86);

    container.add(graphics);
    this.streetDetails = container;
  }

  drawWoodTable(graphics, x, y) {
    graphics.fillStyle(0x8d5524, 1);
    graphics.fillRect(x - 28, y, 56, 8);
    graphics.fillRect(x - 16, y + 8, 8, 32);
    graphics.fillRect(x + 8, y + 8, 8, 32);
    graphics.fillStyle(0x5c3b28, 1);
    graphics.fillRect(x - 34, y + 40, 68, 6);
  }

  drawBench(graphics, x, y, width) {
    graphics.fillStyle(0x8d5524, 1);
    graphics.fillRect(x - width / 2, y, width, 14);
    graphics.fillRect(x - width / 2 + 8, y + 20, width - 16, 10);
    graphics.fillRect(x - width / 2 + 14, y + 14, 8, 38);
    graphics.fillRect(x + width / 2 - 22, y + 14, 8, 38);
    graphics.fillStyle(0x5c3b28, 1);
    graphics.fillRect(x - width / 2 - 6, y - 4, width + 12, 6);
  }

  drawBarrel(graphics, x, y) {
    graphics.fillStyle(0x6f4a35, 1);
    graphics.fillEllipse(x, y + 26, 58, 22);
    graphics.fillRect(x - 29, y, 58, 52);
    graphics.fillEllipse(x, y, 58, 22);
    graphics.lineStyle(3, 0x3d2a20, 1);
    graphics.strokeEllipse(x, y, 58, 22);
    graphics.strokeEllipse(x, y + 52, 58, 22);
    graphics.strokeRect(x - 29, y, 58, 52);
    graphics.lineStyle(3, 0xd9c9a3, 1);
    graphics.strokeRect(x - 24, y + 10, 48, 8);
    graphics.strokeRect(x - 24, y + 34, 48, 8);
  }

  drawSignPost(graphics, x, y) {
    graphics.fillStyle(0x5c3b28, 1);
    graphics.fillRect(x - 5, y + 20, 10, 90);
    graphics.fillStyle(0x9a5c2e, 1);
    graphics.fillTriangle(x - 58, y + 8, x + 42, y - 4, x + 32, y + 26);
    graphics.fillTriangle(x - 48, y + 38, x + 52, y + 28, x + 38, y + 58);
    graphics.fillStyle(0xf6d365, 1);
    graphics.fillRect(x - 42, y + 12, 58, 4);
    graphics.fillRect(x - 28, y + 42, 56, 4);
  }

  drawLabel() {
    const labelY = -this.data.height - 66;

    const labelBackground = this.scene.add.rectangle(0, labelY, 168, 36, 0xfffbef, 1)
      .setStrokeStyle(2, 0x29524a);

    const labelText = this.scene.add.text(0, labelY, this.data.title, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#21413b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.container.add([labelBackground, labelText]);
  }

  drawInteractionMarker() {
    this.marker = this.scene.add.circle(0, -this.data.height - 96, 10, 0xf6d365, 1)
      .setStrokeStyle(3, 0x29524a);
    this.marker.setVisible(false);
    this.container.add(this.marker);
  }

  setActiveState(isActive) {
    this.marker.setVisible(isActive);
    this.container.setScale(isActive ? 1.03 : 1);
  }

  getCenterX() {
    return this.data.x;
  }

  getInteractionPayload() {
    return {
      id: this.data.id,
      title: this.data.title,
      description: this.data.description,
      // Este campo deixa a integracao futura livre para paginas, galerias, videos ou WordPress.
      contentType: this.data.contentType ?? 'modal'
    };
  }

  getDoorTriggerBounds() {
    const width = this.data.doorTriggerWidth ?? 92;
    const top = this.data.y + (this.data.doorTriggerOffsetY ?? 8);
    const height = this.data.doorTriggerHeight ?? 8;

    return new Phaser.Geom.Rectangle(
      this.data.x - width / 2,
      top,
      width,
      height
    );
  }
}
