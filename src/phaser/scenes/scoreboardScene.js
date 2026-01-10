import Phaser from 'phaser';
import { db } from '../../firebase/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default class ScoreboardScene extends Phaser.Scene {
    constructor() {
        super('ScoreboardScene');
        this.cameFromMenu = false;
        this.elements = {};
        this.leaderboard = [];
        this.currentUser = null;
    }

    init(data) {
        this.cameFromMenu = data.cameFromMenu || false;
    }

    preload() {
        for (let i = 1; i <= 14; i++) {
            this.load.image(
                `avatar${i}`,
                new URL(`../avatars/avatar${i}.png`, import.meta.url).href
            );
        }
    }

    create() {
        const { width, height } = this.scale;

        // container for all display objects so we can clear/rebuild on resize
        this.root = this.add.container(0, 0);

        // start listening for auth changes so we can highlight the current player
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            // rebuild to update highlight if needed
            if (this.root) {
                this.root.removeAll(true);
                const { width: w, height: h } = this.scale;
                this.buildLayout(w, h);
            }
        });

        // load leaderboard from Firestore first, then build layout
        this.loadLeaderboard()
            .catch(err => {
                console.error('Failed to load leaderboard from Firestore', err);
            })
            .finally(() => {
                this.buildLayout(width, height);
            });

        // listen for resize
        this.scale.on('resize', (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;

            // clear old display objects
            this.root.removeAll(true);
            this.buildLayout(w, h);
        });

        // ESC
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.cameFromMenu) {
                this.scene.start('LabScene');
            } else {
                this.scene.start('LabScene');
            }
        });
    }

    async loadLeaderboard() {
        // Query all users ordered by xp desc
        const usersCol = collection(db, 'users');
        const q = query(usersCol, orderBy('xp', 'desc'));
        const snapshot = await getDocs(q);
        const users = [];
        snapshot.forEach(docSnap => {
            users.push({ id: docSnap.id, ...docSnap.data() });
        });
        this.leaderboard = users;
    }

    buildLayout(width, height) {
        const root = this.root;

        // BACKGROUND (proportional heights)
        const floorHeight = Math.max(120, height * 0.18);
        const wallHeight = height - floorHeight;

        const wall = this.add.rectangle(0, 0, width, wallHeight, 0xe8e8e8).setOrigin(0);
        const floor = this.add.rectangle(0, wallHeight, width, floorHeight, 0xd4c4a8).setOrigin(0);
        root.add([wall, floor]);

        // TABLE (scale with width/height, keep limits)
        const tableWidth = Phaser.Math.Clamp(width * 0.55, 400, 900);
        const tableHeight = Phaser.Math.Clamp(height * 0.35, 220, 420);
        const tableX = width / 2;
        const tableY = height / 2 + tableHeight * 0.15;

        const tableTop = this.add.rectangle(tableX, tableY, tableWidth, 30, 0x8b4513).setOrigin(0.5);
        const surface = this.add.rectangle(
            tableX,
            tableY + 15,
            tableWidth - 30,
            tableHeight - 30,
            0xa0826d
        ).setOrigin(0.5, 0);

        root.add([tableTop, surface]);

        // GRID ON TABLE
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x8b7355, 0.3);
        const gridSize = 30;
        const gridStartX = tableX - (tableWidth - 30) / 2;
        const gridStartY = tableY + 15;
        const gridEndX = tableX + (tableWidth - 30) / 2;
        const gridEndY = tableY + 15 + (tableHeight - 30);

        for (let x = gridStartX; x <= gridEndX; x += gridSize) {
            grid.beginPath();
            grid.moveTo(x, gridStartY);
            grid.lineTo(x, gridEndY);
            grid.strokePath();
        }
        for (let y = gridStartY; y <= gridEndY; y += gridSize) {
            grid.beginPath();
            grid.moveTo(gridStartX, y);
            grid.lineTo(gridEndX, y);
            grid.strokePath();
        }
        root.add(grid);

        // TABLE LEGS
        const legWidth = 20;
        const legHeight = Math.max(100, tableHeight * 0.5);
        const leg1 = this.add.rectangle(
            tableX - tableWidth / 2 + 40,
            tableY + tableHeight / 2 + 20,
            legWidth,
            legHeight,
            0x654321
        );
        const leg2 = this.add.rectangle(
            tableX + tableWidth / 2 - 40,
            tableY + tableHeight / 2 + 20,
            legWidth,
            legHeight,
            0x654321
        );
        root.add([leg1, leg2]);

        // PANEL (relative to table/center)
        const panelWidth = Phaser.Math.Clamp(width * 0.55, 380, 800);
        const panelHeight = Phaser.Math.Clamp(height * 0.45, 260, 550);
        const panelX = width / 2 - panelWidth / 2;
        const panelY = height / 2 - panelHeight / 2 - 20;

        const panel = this.add.graphics();
        panel.fillStyle(0xffffff, 0.92);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 25);
        panel.lineStyle(3, 0xcccccc, 1);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 25);
        root.add(panel);

        // TITLE
        const title = this.add.text(width / 2, panelY + 35, 'LESTVICA', {
            fontFamily: 'Arial',
            fontSize: `${Math.round(0.045 * height)}px`,
            fontStyle: 'bold',
            color: '#222'
        }).setOrigin(0.5);
        root.add(title);

        // USERS (use Firestore data only)
        const users = this.leaderboard || [];

        const isCurrentUser = (userDoc) => {
            if (!this.currentUser) return false;
            const auth = this.currentUser;
            if (userDoc.id && auth.uid && userDoc.id === auth.uid) return true;
            if (userDoc.email && auth.email && userDoc.email === auth.email) return true;
            if (userDoc.displayname && auth.displayName && userDoc.displayname === auth.displayName) return true;
            return false;
        };

        // already sorted by Firestore query (xp desc), but ensure fallback sort
        users.sort((a, b) => (b.xp ?? b.score ?? 0) - (a.xp ?? a.score ?? 0));

        const rowHeight = 35;
        const maxVisibleRows = Math.floor((panelHeight - 140) / rowHeight);
        const visibleUsers = users.slice(0, maxVisibleRows);

        visibleUsers.forEach((user, index) => {
            const y = panelY + 80 + index * rowHeight;
            const rank = index + 1;

            // Resolve username and score
            const username = user.displayname || user.username || user.email || '—';
            const score = user.xp ?? user.score ?? 0;

            // avatar: if Firestore stores an avatar index (1..14) that matches preloaded assets
            if (user.avatarIndex && Number.isFinite(user.avatarIndex) && this.textures.exists(`avatar${user.avatarIndex}`)) {
                const avatar = this.add.image(panelX + 60, y + 15, `avatar${user.avatarIndex}`)
                    .setDisplaySize(40, 40)
                    .setOrigin(0.5);
                root.add(avatar);
            } else {
                // draw a simple circle + initials
                const circle = this.add.circle(panelX + 60, y + 15, 20, 0xe0e0e0);
                const initials = String(username).split(' ').map(s => s[0] || '').slice(0,2).join('').toUpperCase();
                const initialsText = this.add.text(panelX + 60, y + 10, initials, {
                    fontSize: '14px',
                    color: '#444'
                }).setOrigin(0.5, 0.5);
                root.add([circle, initialsText]);
            }

            // rank
            const rankText = this.add.text(panelX + 100, y + 5, `${rank}.`, {
                fontSize: '22px',
                color: '#444'
            });
            root.add(rankText);

            // username
            const style = isCurrentUser(user)
                ? { fontSize: '22px', color: '#0f5cad', fontStyle: 'bold' }
                : { fontSize: '22px', color: '#222' };
            const nameText = this.add.text(panelX + 140, y + 5, username, style);
            root.add(nameText);

            // score
            const scoreText = this.add.text(panelX + panelWidth - 80, y + 5, `${score}`, {
                fontSize: '22px',
                color: '#0044cc'
            }).setOrigin(1, 0);
            root.add(scoreText);
        });

        if (visibleUsers.length === 0) {
            const emptyText = this.add.text(width / 2, panelY + panelHeight / 2, 'Trenutno ni uporabnikov na lestvici.', {
                fontSize: '18px',
                color: '#777'
            }).setOrigin(0.5);
            root.add(emptyText);
        }

        // BACK BUTTON
        const backButton = this.add.text(width / 2, panelY + panelHeight - 40, '↩ Nazaj', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#0066ff',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setStyle({ color: '#0044cc' }))
            .on('pointerout', () => backButton.setStyle({ color: '#0066ff' }))
            .on('pointerdown', () => {
                if (this.cameFromMenu) {
                    this.scene.start('MenuScene');
                } else {
                    this.scene.start('WorkspaceScene');
                }
            });

        root.add(backButton);
    }
}
