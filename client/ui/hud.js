// HUD (Heads-Up Display) - Shows player stats, money, round info
export class HUD {
    constructor(scene) {
        this.scene = scene;
        this.elements = {};
    }

    create() {
        const { width, height } = this.scene.cameras.main;

        // Health bar
        this.elements.health = this.scene.add.text(16, 16, 'Health: 100', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#4ecdc4',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.elements.health.setScrollFactor(0);
        this.elements.health.setDepth(1000);

        // Money
        this.elements.money = this.scene.add.text(16, 50, 'Money: $800', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffe66d',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.elements.money.setScrollFactor(0);
        this.elements.money.setDepth(1000);

        // Weapon
        this.elements.weapon = this.scene.add.text(16, 84, 'Weapon: Pistol', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.elements.weapon.setScrollFactor(0);
        this.elements.weapon.setDepth(1000);

        // Ammo
        this.elements.ammo = this.scene.add.text(16, 114, 'Ammo: 12/36', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.elements.ammo.setScrollFactor(0);
        this.elements.ammo.setDepth(1000);

        // Round info (top center)
        this.elements.round = this.scene.add.text(width / 2, 20, 'Round 1', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            backgroundColor: '#000000',
            padding: { x: 15, y: 8 }
        });
        this.elements.round.setOrigin(0.5, 0);
        this.elements.round.setScrollFactor(0);
        this.elements.round.setDepth(1000);

        // Phase indicator
        this.elements.phase = this.scene.add.text(width / 2, 55, 'BUY PHASE', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#4ecdc4',
            backgroundColor: '#000000',
            padding: { x: 12, y: 6 }
        });
        this.elements.phase.setOrigin(0.5, 0);
        this.elements.phase.setScrollFactor(0);
        this.elements.phase.setDepth(1000);

        // Timer
        this.elements.timer = this.scene.add.text(width / 2, 90, '30', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 8 }
        });
        this.elements.timer.setOrigin(0.5, 0);
        this.elements.timer.setScrollFactor(0);
        this.elements.timer.setDepth(1000);

        // Kill feed (top right)
        this.elements.killFeed = this.scene.add.text(width - 16, 16, '', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 },
            align: 'right'
        });
        this.elements.killFeed.setOrigin(1, 0);
        this.elements.killFeed.setScrollFactor(0);
        this.elements.killFeed.setDepth(1000);

        // Score (bottom center)
        this.elements.score = this.scene.add.text(width / 2, height - 30, 'Team A: 0 | Team B: 0', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 12, y: 6 }
        });
        this.elements.score.setOrigin(0.5, 0);
        this.elements.score.setScrollFactor(0);
        this.elements.score.setDepth(1000);
    }

    updateHealth(health) {
        if (this.elements.health) {
            this.elements.health.setText(`Health: ${health}`);
            
            // Color based on health
            if (health > 70) {
                this.elements.health.setColor('#4ecdc4');
            } else if (health > 30) {
                this.elements.health.setColor('#ffe66d');
            } else {
                this.elements.health.setColor('#ff6b6b');
            }
        }
    }

    updateMoney(money) {
        if (this.elements.money) {
            this.elements.money.setText(`Money: $${money}`);
        }
    }

    updateWeapon(weaponName) {
        if (this.elements.weapon) {
            this.elements.weapon.setText(`Weapon: ${weaponName}`);
        }
    }

    updateAmmo(current, reserve) {
        if (this.elements.ammo) {
            this.elements.ammo.setText(`Ammo: ${current}/${reserve}`);
        }
    }

    updateRound(roundNumber) {
        if (this.elements.round) {
            this.elements.round.setText(`Round ${roundNumber}`);
        }
    }

    updatePhase(phase) {
        if (this.elements.phase) {
            this.elements.phase.setText(phase.toUpperCase());
            
            // Color based on phase
            switch(phase.toLowerCase()) {
                case 'buy':
                    this.elements.phase.setColor('#4ecdc4');
                    break;
                case 'action':
                    this.elements.phase.setColor('#ff6b6b');
                    break;
                case 'round end':
                    this.elements.phase.setColor('#ffe66d');
                    break;
            }
        }
    }

    updateTimer(seconds) {
        if (this.elements.timer) {
            this.elements.timer.setText(`${seconds}`);
            
            // Color based on time
            if (seconds > 10) {
                this.elements.timer.setColor('#ffffff');
            } else if (seconds > 5) {
                this.elements.timer.setColor('#ffe66d');
            } else {
                this.elements.timer.setColor('#ff6b6b');
            }
        }
    }

    addKillFeedEntry(killer, victim) {
        if (this.elements.killFeed) {
            const entry = `${killer} eliminated ${victim}`;
            const currentText = this.elements.killFeed.text;
            const lines = currentText ? currentText.split('\n') : [];
            
            lines.unshift(entry);
            
            // Keep only last 5 entries
            if (lines.length > 5) {
                lines.pop();
            }
            
            this.elements.killFeed.setText(lines.join('\n'));
            
            // Fade out after 5 seconds
            this.scene.time.delayedCall(5000, () => {
                const currentLines = this.elements.killFeed.text.split('\n');
                currentLines.pop();
                this.elements.killFeed.setText(currentLines.join('\n'));
            });
        }
    }

    updateScore(teamAScore, teamBScore) {
        if (this.elements.score) {
            this.elements.score.setText(`Team A: ${teamAScore} | Team B: ${teamBScore}`);
        }
    }

    destroy() {
        Object.values(this.elements).forEach(element => {
            if (element) element.destroy();
        });
        this.elements = {};
    }
}
