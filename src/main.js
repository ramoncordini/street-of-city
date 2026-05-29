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
    mode: Phaser.Scale.RESIZE,
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

function setupTouchControls() {
  const pressedDirections = new Set();
  const actionButton = document.querySelector('#mobile-action');

  window.CIDADE_TOUCH_INPUT = {
    get left() {
      return pressedDirections.has('left');
    },
    get right() {
      return pressedDirections.has('right');
    },
    get up() {
      return pressedDirections.has('up');
    },
    get down() {
      return pressedDirections.has('down');
    },
    actionPressed: false,
    consumeAction() {
      const wasPressed = this.actionPressed;
      this.actionPressed = false;
      return wasPressed;
    }
  };

  document.querySelectorAll('[data-direction]').forEach((button) => {
    const direction = button.dataset.direction;

    const press = (event) => {
      event.preventDefault();
      pressedDirections.add(direction);
      button.classList.add('is-active');
    };

    const release = (event) => {
      event.preventDefault();
      pressedDirections.delete(direction);
      button.classList.remove('is-active');
    };

    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
  });

  actionButton?.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    window.CIDADE_TOUCH_INPUT.actionPressed = true;
    actionButton.classList.add('is-active');
  });

  actionButton?.addEventListener('pointerup', (event) => {
    event.preventDefault();
    actionButton.classList.remove('is-active');
  });
}

async function requestImmersiveMode() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // Navegadores podem recusar fullscreen; o layout continua ocupando a viewport.
  }

  try {
    await screen.orientation?.lock?.('landscape');
  } catch {
    // iOS e alguns navegadores so permitem orientar manualmente; exibimos aviso em portrait.
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
      requestImmersiveMode();
      resolve(profile);
    });
  });
}

window.addEventListener('load', async () => {
  setupTouchControls();
  window.CIDADE_PLAYER_PROFILE = await setupCharacterCreation();
  new Phaser.Game(config);
});
