// Buy Menu - Weapon and equipment purchase system
export class BuyMenu {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.isOpen = false;
        this.weapons = [
            { name: 'Pistol', price: 0, damage: 20, fireRate: 300, ammo: 12, reserve: 36 },
            { name: 'SMG', price: 1000, damage: 25, fireRate: 100, ammo: 25, reserve: 75 },
            { name: 'Rifle', price: 2700, damage: 35, fireRate: 150, ammo: 30, reserve: 90 },
            { name: 'Sniper', price: 4500, damage: 100, fireRate: 800, ammo: 5, reserve: 15 },
            { name: 'Shotgun', price: 1800, damage: 80, fireRate: 600, ammo: 7, reserve: 21 }
        ];
    }

    create() {
        const { width, height } = this.scene.cameras.main;
        
        // Create container (hidden by default)
        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(2000);
        this.container.setVisible(false);

        // Background overlay
        const overlay = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        this.container.add(overlay);

        // Title
        const title = this.scene.add.text(width / 2, 100, 'BUY MENU', {
            fontSize: '42px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        this.container.add(title);

        // Instructions
        const instructions = this.scene.add.text(width / 2, 150, 'Press B to close | Click to purchase', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        });
        instructions.setOrigin(0.5);
        this.container.add(instructions);

        // Weapon list
        this.weaponButtons = [];
        this.weapons.forEach((weapon, index) => {
            const y = 220 + (index * 80);
            
            // Weapon card background
            const cardBg = this.scene.add.rectangle(width / 2, y, 600, 70, 0x1a1a1a);
            cardBg.setStrokeStyle(2, 0x4ecdc4);
            this.container.add(cardBg);

            // Weapon name
            const nameText = this.scene.add.text(width / 2 - 280, y - 20, weapon.name, {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            this.container.add(nameText);

            // Weapon stats
            const statsText = this.scene.add.text(width / 2 - 280, y + 5, 
                `Damage: ${weapon.damage} | Fire Rate: ${weapon.fireRate}ms | Ammo: ${weapon.ammo}/${weapon.reserve}`, {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#aaaaaa'
            });
            this.container.add(statsText);

            // Price
            const priceText = this.scene.add.text(width / 2 + 250, y, `$${weapon.price}`, {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: weapon.price === 0 ? '#4ecdc4' : '#ffe66d',
                fontStyle: 'bold'
            });
            priceText.setOrigin(1, 0.5);
            this.container.add(priceText);

            // Make interactive
            cardBg.setInteractive({ useHandCursor: true });
            
            cardBg.on('pointerover', () => {
                cardBg.setFillStyle(0x2a2a2a);
            });
            
            cardBg.on('pointerout', () => {
                cardBg.setFillStyle(0x1a1a1a);
            });
            
            cardBg.on('pointerdown', () => {
                this.purchaseWeapon(weapon);
            });

            this.weaponButtons.push({ cardBg, nameText, statsText, priceText, weapon });
        });

        // Close button
        const closeButton = this.scene.add.text(width / 2, height - 80, 'CLOSE (B)', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff6b6b',
            padding: { x: 30, y: 12 }
        });
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        
        closeButton.on('pointerover', () => {
            closeButton.setStyle({ backgroundColor: '#ff5252' });
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setStyle({ backgroundColor: '#ff6b6b' });
        });
        
        closeButton.on('pointerdown', () => {
            this.close();
        });
        
        this.container.add(closeButton);

        // Add keyboard shortcut
        this.scene.input.keyboard.on('keydown-B', () => {
            this.toggle();
        });
    }

    open() {
        if (this.container) {
            this.container.setVisible(true);
            this.isOpen = true;
            this.updateAffordability();
        }
    }

    close() {
        if (this.container) {
            this.container.setVisible(false);
            this.isOpen = false;
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    updateAffordability() {
        const playerMoney = this.scene.playerMoney || 800;
        
        this.weaponButtons.forEach(({ cardBg, nameText, priceText, weapon }) => {
            const canAfford = playerMoney >= weapon.price;
            
            if (canAfford) {
                nameText.setColor('#ffffff');
                priceText.setColor(weapon.price === 0 ? '#4ecdc4' : '#ffe66d');
                cardBg.setStrokeStyle(2, 0x4ecdc4);
            } else {
                nameText.setColor('#666666');
                priceText.setColor('#666666');
                cardBg.setStrokeStyle(2, 0x666666);
            }
        });
    }

    purchaseWeapon(weapon) {
        const playerMoney = this.scene.playerMoney || 800;
        
        if (playerMoney >= weapon.price) {
            // Emit purchase event
            this.scene.events.emit('weaponPurchased', weapon);
            
            // Show feedback
            this.showPurchaseFeedback(weapon.name);
            
            // Close menu
            this.close();
        } else {
            // Show error
            this.showError('Not enough money!');
        }
    }

    showPurchaseFeedback(weaponName) {
        const { width, height } = this.scene.cameras.main;
        
        const feedback = this.scene.add.text(width / 2, height / 2, `Purchased: ${weaponName}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#4ecdc4',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        });
        feedback.setOrigin(0.5);
        feedback.setScrollFactor(0);
        feedback.setDepth(3000);

        // Fade out
        this.scene.tweens.add({
            targets: feedback,
            alpha: 0,
            y: height / 2 - 50,
            duration: 1500,
            onComplete: () => {
                feedback.destroy();
            }
        });
    }

    showError(message) {
        const { width, height } = this.scene.cameras.main;
        
        const error = this.scene.add.text(width / 2, height / 2, message, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        });
        error.setOrigin(0.5);
        error.setScrollFactor(0);
        error.setDepth(3000);

        // Shake effect
        this.scene.tweens.add({
            targets: error,
            x: width / 2 + 10,
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: error,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        error.destroy();
                    }
                });
            }
        });
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
        this.scene.input.keyboard.off('keydown-B');
    }
}
