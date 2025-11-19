// Bomb System - Plant and Defuse mechanics
export class BombSystem {
    constructor(scene) {
        this.scene = scene;
        this.isPlanting = false;
        this.isDefusing = false;
        this.plantProgress = 0;
        this.defuseProgress = 0;
        this.plantTime = 3000; // 3 seconds
        this.defuseTime = 5000; // 5 seconds
        this.bombPlanted = false;
        this.bombPosition = null;
        
        // Setup E key for plant/defuse
        this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update(delta) {
        if (!this.scene.isCompetitive) return;
        
        // Check if E key is held
        if (this.eKey.isDown) {
            this.handleEKeyHold(delta);
        } else {
            // Reset progress if key released
            if (this.isPlanting) {
                this.cancelPlant();
            }
            if (this.isDefusing) {
                this.cancelDefuse();
            }
        }
    }

    handleEKeyHold(delta) {
        const player = this.scene.player;
        if (!player) return;
        
        // Red team: Plant bomb
        if (this.scene.myTeam === 'red' && this.scene.hasBomb && !this.bombPlanted) {
            // Check if in bomb site
            const inSiteA = this.scene.competitiveMap.isInBombSite(player.x, player.y, 'A');
            const inSiteB = this.scene.competitiveMap.isInBombSite(player.x, player.y, 'B');
            
            if (inSiteA || inSiteB) {
                this.plantBomb(delta, inSiteA ? 'A' : 'B');
            }
        }
        
        // Blue team: Defuse bomb
        if (this.scene.myTeam === 'blue' && this.bombPlanted) {
            // Check if near bomb
            if (this.bombPosition) {
                const distance = Phaser.Math.Distance.Between(
                    player.x, player.y,
                    this.bombPosition.x, this.bombPosition.y
                );
                
                if (distance < 100) {
                    this.defuseBomb(delta);
                }
            }
        }
    }

    plantBomb(delta, site) {
        if (!this.isPlanting) {
            this.isPlanting = true;
            this.plantProgress = 0;
            this.showPlantProgress();
            console.log(`Planting bomb at site ${site}...`);
        }
        
        this.plantProgress += delta;
        this.updatePlantProgress();
        
        if (this.plantProgress >= this.plantTime) {
            this.completePlant(site);
        }
    }

    completePlant(site) {
        this.isPlanting = false;
        this.bombPlanted = true;
        this.bombPosition = {
            x: this.scene.player.x,
            y: this.scene.player.y,
            site: site
        };
        
        // Remove bomb from inventory
        this.scene.hasBomb = false;
        if (this.scene.bombIndicator) {
            this.scene.bombIndicator.destroy();
            this.scene.bombIndicator = null;
        }
        
        // Hide progress bar
        this.hidePlantProgress();
        
        // Create bomb sprite
        this.createBombSprite();
        
        // Show notification
        this.showNotification(`Bomb planted at site ${site}!`, '#ff0000');
        
        console.log(`Bomb planted at site ${site}!`);
    }

    defuseBomb(delta) {
        if (!this.isDefusing) {
            this.isDefusing = true;
            this.defuseProgress = 0;
            this.showDefuseProgress();
            console.log('Defusing bomb...');
        }
        
        this.defuseProgress += delta;
        this.updateDefuseProgress();
        
        if (this.defuseProgress >= this.defuseTime) {
            this.completeDefuse();
        }
    }

    completeDefuse() {
        this.isDefusing = false;
        this.bombPlanted = false;
        
        // Remove bomb sprite
        if (this.bombSprite) {
            this.bombSprite.destroy();
            this.bombSprite = null;
        }
        
        // Hide progress bar
        this.hideDefuseProgress();
        
        // Show notification
        this.showNotification('Bomb defused!', '#0000ff');
        
        console.log('Bomb defused!');
    }

    cancelPlant() {
        this.isPlanting = false;
        this.plantProgress = 0;
        this.hidePlantProgress();
    }

    cancelDefuse() {
        this.isDefusing = false;
        this.defuseProgress = 0;
        this.hideDefuseProgress();
    }

    showPlantProgress() {
        const { width, height } = this.scene.cameras.main;
        
        this.plantProgressBg = this.scene.add.rectangle(width / 2, height - 100, 300, 30, 0x000000, 0.8);
        this.plantProgressBg.setScrollFactor(0);
        this.plantProgressBg.setDepth(2000);
        
        this.plantProgressBar = this.scene.add.rectangle(width / 2 - 150, height - 100, 0, 26, 0xff0000);
        this.plantProgressBar.setOrigin(0, 0.5);
        this.plantProgressBar.setScrollFactor(0);
        this.plantProgressBar.setDepth(2001);
        
        this.plantProgressText = this.scene.add.text(width / 2, height - 100, 'Planting...', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        this.plantProgressText.setOrigin(0.5);
        this.plantProgressText.setScrollFactor(0);
        this.plantProgressText.setDepth(2002);
    }

    updatePlantProgress() {
        if (this.plantProgressBar) {
            const progress = this.plantProgress / this.plantTime;
            this.plantProgressBar.width = 300 * progress;
        }
    }

    hidePlantProgress() {
        if (this.plantProgressBg) this.plantProgressBg.destroy();
        if (this.plantProgressBar) this.plantProgressBar.destroy();
        if (this.plantProgressText) this.plantProgressText.destroy();
    }

    showDefuseProgress() {
        const { width, height } = this.scene.cameras.main;
        
        this.defuseProgressBg = this.scene.add.rectangle(width / 2, height - 100, 300, 30, 0x000000, 0.8);
        this.defuseProgressBg.setScrollFactor(0);
        this.defuseProgressBg.setDepth(2000);
        
        this.defuseProgressBar = this.scene.add.rectangle(width / 2 - 150, height - 100, 0, 26, 0x0000ff);
        this.defuseProgressBar.setOrigin(0, 0.5);
        this.defuseProgressBar.setScrollFactor(0);
        this.defuseProgressBar.setDepth(2001);
        
        this.defuseProgressText = this.scene.add.text(width / 2, height - 100, 'Defusing...', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        this.defuseProgressText.setOrigin(0.5);
        this.defuseProgressText.setScrollFactor(0);
        this.defuseProgressText.setDepth(2002);
    }

    updateDefuseProgress() {
        if (this.defuseProgressBar) {
            const progress = this.defuseProgress / this.defuseTime;
            this.defuseProgressBar.width = 300 * progress;
        }
    }

    hideDefuseProgress() {
        if (this.defuseProgressBg) this.defuseProgressBg.destroy();
        if (this.defuseProgressBar) this.defuseProgressBar.destroy();
        if (this.defuseProgressText) this.defuseProgressText.destroy();
    }

    createBombSprite() {
        if (this.bombPosition) {
            // Create bomb visual
            const bombGraphics = this.scene.add.graphics();
            bombGraphics.fillStyle(0xff0000, 1);
            bombGraphics.fillCircle(this.bombPosition.x, this.bombPosition.y, 16);
            bombGraphics.setDepth(10);
            
            const bombText = this.scene.add.text(this.bombPosition.x, this.bombPosition.y, '💣', {
                fontSize: '32px'
            });
            bombText.setOrigin(0.5);
            bombText.setDepth(11);
            
            this.bombSprite = this.scene.add.container(0, 0, [bombGraphics, bombText]);
            
            // Pulsing animation
            this.scene.tweens.add({
                targets: this.bombSprite,
                scale: 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
    }

    showNotification(message, color) {
        const { width, height } = this.scene.cameras.main;
        
        const notification = this.scene.add.text(width / 2, height / 2 - 100, message, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: color,
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            fontStyle: 'bold'
        });
        notification.setOrigin(0.5);
        notification.setScrollFactor(0);
        notification.setDepth(3000);
        
        // Fade out
        this.scene.tweens.add({
            targets: notification,
            alpha: 0,
            y: height / 2 - 150,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }

    destroy() {
        this.hidePlantProgress();
        this.hideDefuseProgress();
        if (this.bombSprite) {
            this.bombSprite.destroy();
        }
    }
}
