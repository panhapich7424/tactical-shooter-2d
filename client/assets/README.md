# Game Assets

This folder contains all game assets for Tactical Shooter 2D.

## Current Status
The game currently uses **procedurally generated placeholder graphics** created in code. This allows the game to run immediately without requiring asset files.

## Asset Structure

```
/assets
  /sprites
    /agents       - Character sprites (32x32px)
    /weapons      - Weapon sprites
    /effects      - Muzzle flash, explosions
  /tiles
    /floors       - Floor tile variations (32x32px)
    /walls        - Wall and obstacle tiles (32x32px)
  /audio
    /sfx          - Sound effects (gunshots, footsteps)
    /music        - Background music
  /ui
    /icons        - UI icons and buttons
    /fonts        - Custom fonts
```

## Creating Pixel Art Assets

### Recommended Tools (Free)
- **Piskel** (https://www.piskelapp.com/) - Browser-based, no install
- **Aseprite** ($20, but worth it)
- **GIMP** (Free, open source)
- **Krita** (Free, open source)

### Sprite Specifications

#### Agent Sprites (32x32px)
- Top-down view
- 8 directional frames (optional, can use rotation)
- Idle, walk, shoot animations
- Export as sprite sheet or individual frames

#### Tile Sprites (32x32px)
- Floor tiles: concrete, grass, metal
- Wall tiles: solid, destructible
- Cover objects: crates, barriers

#### Weapon Sprites (16x16px or 24x24px)
- Top-down view
- Pistol, rifle, sniper variants
- Muzzle flash effects

### Color Palette Suggestions
```
Primary: #4ecdc4 (Cyan)
Secondary: #ff6b6b (Red)
Accent: #ffe66d (Yellow)
Dark: #1a1a2e (Background)
Gray: #666666 (Walls)
```

## Adding Assets to Game

### 1. Place Files
Put your asset files in the appropriate subfolder.

### 2. Update BootScene.js
Replace the `createPlaceholderAssets()` calls with actual asset loading:

```javascript
// In BootScene.js loadAssets() method
this.load.image('player', 'assets/sprites/agents/agent1.png');
this.load.image('bullet', 'assets/sprites/effects/bullet.png');
this.load.image('tile', 'assets/tiles/floors/concrete.png');
this.load.image('wall', 'assets/tiles/walls/wall.png');
```

### 3. For Sprite Sheets
```javascript
this.load.spritesheet('player', 'assets/sprites/agents/agent1.png', {
    frameWidth: 32,
    frameHeight: 32
});
```

### 4. For Audio
```javascript
this.load.audio('shoot', 'assets/audio/sfx/gunshot.mp3');
this.load.audio('bgm', 'assets/audio/music/background.mp3');
```

## Free Asset Resources

### Pixel Art
- **OpenGameArt.org** - Free game assets
- **itch.io** - Many free asset packs
- **Kenney.nl** - High-quality free assets

### Audio
- **Freesound.org** - Free sound effects
- **OpenGameArt.org** - Free music and SFX
- **Incompetech** - Royalty-free music

### Fonts
- **Google Fonts** - Free web fonts
- **DaFont** - Free fonts (check license)

## Asset Optimization

### Images
- Use PNG for sprites (transparency support)
- Keep file sizes small (<100KB per sprite)
- Use sprite sheets for animations (more efficient)

### Audio
- Use MP3 or OGG format
- Keep file sizes reasonable (<500KB per file)
- Normalize audio levels

### Loading Performance
- Preload all assets in BootScene
- Show loading progress bar
- Use texture atlases for many small sprites

## License Considerations

When using third-party assets:
1. Check the license (CC0, CC-BY, etc.)
2. Provide attribution if required
3. Keep a CREDITS.md file listing all assets and authors
4. Don't use assets with "No Commercial Use" restrictions if you plan to monetize

## Next Steps

1. Create or find agent sprites (4-5 different characters)
2. Create tile sets for different map themes
3. Add weapon sprites and effects
4. Add UI elements (health bars, ability icons)
5. Add sound effects for immersion
6. Add background music

## Current Placeholders

The game generates these placeholders in code:
- **Player**: 32x32 cyan square
- **Bullet**: 8x8 yellow circle
- **Tile**: 32x32 dark gray square with border
- **Wall**: 32x32 gray square

These work perfectly for development and testing!
