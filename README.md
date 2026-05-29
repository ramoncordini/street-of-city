# Cidade 2D Explorer

MVP de um site gamificado em Phaser 3 com visual 2D side-scrolling, personagem controlavel, criacao de personagem, multiplayer, camera suave e construcoes interativas.

## Teste online

Versao publicada para testes:

```text
https://street-of-city.onrender.com/
```

No plano gratuito do Render, o primeiro acesso pode demorar alguns segundos se o servico estiver inativo.

## Como executar

Use o servidor Node incluido na raiz do projeto:

```bash
npm start
```

Depois abra:

```text
http://localhost:3000/
```

O projeto usa Phaser 3 via CDN no `index.html`, entao nao precisa de build ou TypeScript. O servidor `server.js` tambem abre o WebSocket em `/ws` para sincronizar os jogadores.

## Controles

- Seta esquerda: andar para a esquerda
- Seta direita: andar para a direita
- Seta cima: andar para cima dentro da estrada
- Seta baixo: andar para baixo dentro da estrada
- Encostar no nivel da porta de uma construcao: interagir
- Espaco perto de outro jogador: cumprimentar
- Esc ou botao Fechar: fechar modal

## Onde alterar

- Construcoes e textos: `src/scenes/GameScene.js`, constante `BUILDING_DATA`
- Tamanho da cidade: `src/scenes/GameScene.js`, constante `CITY_WIDTH`
- Velocidade do jogador: `src/scenes/GameScene.js`, constante `PLAYER_SPEED`
- Altura da caminhada na estrada: `src/scenes/GameScene.js`, constante `PLAYER_ROAD_Y`
- Limites verticais da estrada: `src/scenes/GameScene.js`, constantes `ROAD_TOP_Y` e `ROAD_BOTTOM_Y`
- Area invisivel de contato das portas: `src/objects/Building.js`, metodo `getDoorTriggerBounds`
- Visual de cada construcao: `src/objects/Building.js`
- Logica do jogador: `src/objects/Player.js`
- Interface/modal: `src/scenes/UIScene.js`
- Estilos da pagina: `src/styles/game.css`
- Sincronizacao multiplayer no cliente: `src/network/NetworkManager.js`
- Servidor HTTP e WebSocket: `server.js`

## Estrutura

```text
.
├── index.html
├── package.json
├── README.md
├── server.js
└── src
    ├── assets
    │   ├── audio
    │   └── images
    ├── main.js
    ├── network
    │   └── NetworkManager.js
    ├── objects
    │   ├── Building.js
    │   ├── Player.js
    │   └── RemotePlayer.js
    ├── scenes
    │   ├── BootScene.js
    │   ├── GameScene.js
    │   └── UIScene.js
    └── styles
        └── game.css
```
