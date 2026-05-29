import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#7ec8e3',
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, GameScene, UIScene]
};

function getSavedProfile() {
  const savedProfile = window.localStorage.getItem('cidade-player-profile');

  if (!savedProfile) {
    return null;
  }

  try {
    return JSON.parse(savedProfile);
  } catch {
    return null;
  }
}

function setupCharacterCreation() {
  const screen = document.querySelector('#character-screen');
  const form = document.querySelector('#character-form');
  const nameInput = document.querySelector('#player-name');
  const savedProfile = getSavedProfile();

  if (savedProfile) {
    nameInput.value = savedProfile.name;
    const colorInput = form.querySelector(`[value="${savedProfile.color}"]`);
    const genderInput = form.querySelector(`[value="${savedProfile.gender}"]`);
    colorInput?.setAttribute('checked', 'checked');
    genderInput?.setAttribute('checked', 'checked');
  }

  return new Promise((resolve) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const profile = {
        name: String(formData.get('playerName')).trim().slice(0, 16) || 'Visitante',
        color: String(formData.get('playerColor') || '0x3a86ff'),
        gender: String(formData.get('playerGender') || 'male')
      };

      window.localStorage.setItem('cidade-player-profile', JSON.stringify(profile));
      screen.classList.add('is-hidden');
      resolve(profile);
    });
  });
}

window.addEventListener('load', async () => {
  window.CIDADE_PLAYER_PROFILE = await setupCharacterCreation();
  new Phaser.Game(config);
});
