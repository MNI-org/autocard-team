import Phaser from 'phaser';

export default class LabScene extends Phaser.Scene {
  constructor() {
    super('LabScene');
  }

  preload() {
        this.load.image('avatar1', new URL('../avatars/avatar1.png', import.meta.url).href);
        this.load.image('avatar2', new URL('../avatars/avatar2.png', import.meta.url).href);
        this.load.image('avatar3', new URL('../avatars/avatar3.png', import.meta.url).href);
        this.load.image('avatar4', new URL('../avatars/avatar4.png', import.meta.url).href);
        this.load.image('avatar5', new URL('../avatars/avatar5.png', import.meta.url).href);
        this.load.image('avatar6', new URL('../avatars/avatar6.png', import.meta.url).href);
        this.load.image('avatar7', new URL('../avatars/avatar7.png', import.meta.url).href);
        this.load.image('avatar8', new URL('../avatars/avatar8.png', import.meta.url).href);
        this.load.image('avatar9', new URL('../avatars/avatar9.png', import.meta.url).href);
        this.load.image('avatar10', new URL('../avatars/avatar10.png', import.meta.url).href);
        this.load.image('avatar11', new URL('../avatars/avatar11.png', import.meta.url).href);
    }


  create() {
    const { width, height } = this.cameras.main;

    // ozadje laboratorija
    this.add.rectangle(0, 0, width, height, 0xf0f0f0).setOrigin(0);

    // stena
    this.add.rectangle(0, 0, width, height - 150, 0xe8e8e8).setOrigin(0);

    // tla
    this.add.rectangle(0, height - 150, width, 150, 0xd4c4a8).setOrigin(0);

    // miza
    const tableX = width / 2;
    const tableY = height / 2 + 50;
    const tableWidth = 500;
    const tableHeight = 250;

    // miza (del, ki se klikne)
    const tableTop = this.add.rectangle(tableX, tableY, tableWidth, 30, 0x8b4513).setOrigin(0.5);

    // delovna površina mize
    const tableSurface = this.add.rectangle(tableX, tableY + 15, tableWidth - 30, tableHeight - 30, 0xa0826d).setOrigin(0.5, 0);

    // mreža
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x8b7355, 0.3);
    const gridSize = 30;
    const gridStartX = tableX - (tableWidth - 30) / 2;
    const gridStartY = tableY + 15;
    const gridEndX = tableX + (tableWidth - 30) / 2;
    const gridEndY = tableY + 15 + (tableHeight - 30);

    for (let x = gridStartX; x <= gridEndX; x += gridSize) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, gridStartY);
      gridGraphics.lineTo(x, gridEndY);
      gridGraphics.strokePath();
    }
    for (let y = gridStartY; y <= gridEndY; y += gridSize) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(gridStartX, y);
      gridGraphics.lineTo(gridEndX, y);
      gridGraphics.strokePath();
    }

    // nogice mize
    const legWidth = 20;
    const legHeight = 150;
    this.add.rectangle(tableX - tableWidth / 2 + 40, tableY + tableHeight / 2 + 20, legWidth, legHeight, 0x654321);
    this.add.rectangle(tableX + tableWidth / 2 - 40, tableY + tableHeight / 2 + 20, legWidth, legHeight, 0x654321);

    // interaktivnost mize
    const interactiveZone = this.add.zone(tableX, tableY + tableHeight / 2, tableWidth, tableHeight)
      .setInteractive({ useHandCursor: true });

    const instruction = this.add.text(tableX, tableY - 80, 'Klikni na mizo in začni graditi svoj električni krog!', {
      fontSize: '24px',
      color: '#333',
      fontStyle: 'bold',
      backgroundColor: '#ffffff',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // animacija besedila
    this.tweens.add({
      targets: instruction,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // zoom na mizo
    interactiveZone.on('pointerdown', () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('WorkspaceScene');
      });
    });

    interactiveZone.on('pointerover', () => {
      tableSurface.setFillStyle(0xb09070);
    });

    interactiveZone.on('pointerout', () => {
      tableSurface.setFillStyle(0xa0826d);
    });

    const username = localStorage.getItem('username');
    const pfp = localStorage.getItem('profilePic');

    // avvatar
    const uiX = 230;
    const uiY = 55;

    // pozdravno besedilo
    this.add.text(uiX + 60, uiY - 10, `Dobrodošel v laboratoriju, uporabnik ${username}!`, {
      fontSize: '22px',
      color: '#222',
      fontStyle: 'bold'
    });

    const logoutButton = this.add.text(40, 30, '↩ Nazaj', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#0066ff',
      padding: { x: 20, y: 10 }
    })
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => logoutButton.setStyle({ color: '#0044cc' }))
      .on('pointerout', () => logoutButton.setStyle({ color: '#0066ff' }))
      .on('pointerdown', () => {
        window.location.href = "http://localhost:3000";
      });

    const buttonWidth = 180;
    const buttonHeight = 45;
    const cornerRadius = 10;
    const rightMargin = 60;
    const topMargin = 40;

    // za knjižnico znanja
    const knowledgeButtonBg = this.add.graphics();
    knowledgeButtonBg.fillStyle(0x3399ff, 1);
    knowledgeButtonBg.fillRoundedRect(width - buttonWidth - rightMargin, uiY - 10, buttonWidth, buttonHeight, cornerRadius);

    const knowledgeButton = this.add.text(width - buttonWidth / 2 - rightMargin, uiY - 10 + buttonHeight / 2, 'Knjižnica znanja', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        knowledgeButtonBg.clear();
        knowledgeButtonBg.fillStyle(0x0f5cad, 1);
        knowledgeButtonBg.fillRoundedRect(width - buttonWidth - rightMargin, topMargin + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius);
      })
      .on('pointerout', () => {
        knowledgeButtonBg.clear();
        knowledgeButtonBg.fillStyle(0x3399ff, 1);
        knowledgeButtonBg.fillRoundedRect(width - buttonWidth - rightMargin, topMargin + buttonHeight + 20, buttonWidth, buttonHeight, cornerRadius);
      })
      .on('pointerdown', () => {
        this.scene.start('KnowledgeHubScene');
      });

    console.log(JSON.parse(localStorage.getItem('users')));
  }
}
