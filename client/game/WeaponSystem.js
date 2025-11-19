// Weapon System - Manage weapon switching and stats
export class WeaponSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentSlot = 1;
        
        // Weapon definitions
        this.weapons = {
            1: { // Rifle
                name: 'Rifle',
                damage: 35,
                fireRate: 150,
                ammo: 30,
                reserve: 90,
                icon: '🔫'
            },
            2: { // Pistol
                name: 'Pistol',
                damage: 20,
                fireRate: 300,
                ammo: 12,
                reserve: 36,
                icon: '🔫'
            },
            3: { // Knife
                name: 'Knife',
                damage: 50,
                fireRate: 500,
                ammo: Infinity,
                reserve: 0,
                icon: '🔪'
            },
            4: { // Grenade
                name: 'Grenade',
                damage: 100,
                fireRate: 2000,
                ammo: 2,
                reserve: 0,
                icon: '💣'
            },
            5: { // Bomb (Red team only)
                name: 'Bomb',
                damage: 0,
                fireRate: 0,
                ammo: 1,
                reserve: 0,
                icon: '💣'
            }
        };
        
        // Current weapon state
        this.currentWeapon = this.weapons[1];
        this.currentAmmo = this.currentWeapon.ammo;
        this.reserveAmmo = this.currentWeapon.reserve;
        
        this.setupKeyBindings();
    }

    setupKeyBindings() {
        // Number keys for weapon switching
        this.scene.input.keyboard.on('keydown-ONE', () => this.switchWeapon(1));
        this.scene.input.keyboard.on('keydown-TWO', () => this.switchWeapon(2));
        this.scene.input.keyboard.on('keydown-THREE', () => this.switchWeapon(3));
        this.scene.input.keyboard.on('keydown-FOUR', () => this.switchWeapon(4));
        this.scene.input.keyboard.on('keydown-FIVE', () => this.switchWeapon(5));
    }

    switchWeapon(slot) {
        // Check if slot 5 (bomb) is available
        if (slot === 5 && !this.scene.hasBomb) {
            console.log('No bomb to switch to');
            return;
        }
        
        if (this.weapons[slot]) {
            this.currentSlot = slot;
            this.currentWeapon = this.weapons[slot];
            this.currentAmmo = this.currentWeapon.ammo;
            this.reserveAmmo = this.currentWeapon.reserve;
            
            console.log(`Switched to ${this.currentWeapon.name}`);
            
            // Update HUD
            if (this.scene.hud) {
                this.scene.hud.updateWeapon(this.currentWeapon.name);
                this.scene.hud.updateAmmo(this.currentAmmo, this.reserveAmmo);
            }
            
            // Show weapon switch feedback
            this.showWeaponSwitch();
        }
    }

    showWeaponSwitch() {
        const { width, height } = this.scene.cameras.main;
        
        const text = this.scene.add.text(width / 2, height - 100, 
            `${this.currentWeapon.icon} ${this.currentWeapon.name}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 8 }
        });
        text.setOrigin(0.5);
        text.setScrollFactor(0);
        text.setDepth(2000);
        
        // Fade out
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    getCurrentWeapon() {
        return this.currentWeapon;
    }

    getCurrentSlot() {
        return this.currentSlot;
    }

    useAmmo() {
        if (this.currentAmmo > 0 && this.currentAmmo !== Infinity) {
            this.currentAmmo--;
            if (this.scene.hud) {
                this.scene.hud.updateAmmo(this.currentAmmo, this.reserveAmmo);
            }
            return true;
        }
        return false;
    }

    reload() {
        if (this.reserveAmmo > 0 && this.currentAmmo < this.currentWeapon.ammo) {
            const needed = this.currentWeapon.ammo - this.currentAmmo;
            const reloadAmount = Math.min(needed, this.reserveAmmo);
            this.currentAmmo += reloadAmount;
            this.reserveAmmo -= reloadAmount;
            
            if (this.scene.hud) {
                this.scene.hud.updateAmmo(this.currentAmmo, this.reserveAmmo);
            }
        }
    }

    destroy() {
        this.scene.input.keyboard.off('keydown-ONE');
        this.scene.input.keyboard.off('keydown-TWO');
        this.scene.input.keyboard.off('keydown-THREE');
        this.scene.input.keyboard.off('keydown-FOUR');
        this.scene.input.keyboard.off('keydown-FIVE');
    }
}
