import './style.css';
import Phaser from 'phaser';

// scenes
import UIScene from './scenes/UIScene';
import PreloadScene from './scenes/preloadScene';
import MenuScene from './scenes/menuScene';
import LabScene from './scenes/labScene';
import TestScene from './scenes/testScene';
import LoginScene from './scenes/loginScene';
import ScoreboardScene from './scenes/scoreboardScene';
import WorkspaceScene from './scenes/workspaceScene';
import KnowledgeHubScene from './scenes/knowledgeHubScene';

let game = null;

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#f4f6fa',
    parent: 'game-container',
    scene: [
        MenuScene,
        LabScene,
        WorkspaceScene,
        PreloadScene,
        UIScene,
        TestScene,
        LoginScene,
        ScoreboardScene,
        KnowledgeHubScene
    ],
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
    }
};

export function startGame() {
    if (game) return game;

    game = new Phaser.Game(config);
    return game;
}

export function stopGame() {
    if (game) {
        game.destroy(true);
        game = null;
    }
}
