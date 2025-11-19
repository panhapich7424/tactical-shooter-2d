# Competitive 5v5 Mode - Implementation Roadmap

## 🎯 Goal
Transform the game into a competitive 5v5 tactical shooter with:
- Matchmaking (10 players)
- Team-based gameplay (Red vs Blue / Terrorist vs Counter-Terrorist)
- Bomb plant/defuse mechanics
- Round system (first to 13 wins)
- Half-time team switch
- Kill/Death tracking
- Scoreboard with MVP

## ⚠️ Scope Warning
This is a **MASSIVE** feature requiring:
- ~3000+ lines of new code
- Complete game logic rewrite
- Extensive server-side validation
- Complex UI systems
- Weeks of development time

## 📋 Implementation Phases

### Phase 6.1: Matchmaking System (Week 1)
**Goal**: Replace room system with competitive matchmaking

**Tasks**:
1. Create MatchmakingScene
2. Implement matchmaking queue in Firebase
3. Auto-match 10 players
4. Random team assignment (5v5)
5. Create match instance

**Files to Create/Modify**:
- `client/scenes/MatchmakingScene.js` ✅ (Created)
- `client/network/matchmaking.js` (New)
- `functions/matchmaking.js` (New Cloud Function)
- Update `MenuScene.js` - Replace multiplayer button

**Estimated Time**: 20-30 hours

### Phase 6.2: Team System (Week 2)
**Goal**: Implement Red/Blue teams with roles

**Tasks**:
1. Assign players to teams (5 Red, 5 Blue)
2. Implement team colors/indicators
3. Add team-specific spawn points
4. Prevent friendly fire
5. Team chat (optional)

**Files to Create/Modify**:
- `client/game/TeamManager.js` (New)
- `client/scenes/GameScene.js` (Major update)
- Update player sprites with team colors
- Update HUD with team info

**Estimated Time**: 15-20 hours

### Phase 6.3: Bomb Mechanics (Week 3)
**Goal**: Implement bomb plant/defuse system

**Tasks**:
1. Assign bomb to random Red team player
2. Create bomb drop on death
3. Implement bomb pickup
4. Create plant sites (A & B)
5. Implement plant mechanic (hold E for 3s)
6. Implement defuse mechanic (hold E for 7s)
7. Bomb timer (30s countdown)
8. Explosion animation/logic

**Files to Create/Modify**:
- `client/game/BombManager.js` (New)
- `client/ui/BombUI.js` (New)
- `functions/bombLogic.js` (New Cloud Function)
- Update `GameScene.js` with bomb logic

**Estimated Time**: 25-35 hours

### Phase 6.4: Hit Detection & Death System (Week 4)
**Goal**: Implement player damage and death

**Tasks**:
1. Add hitboxes to players
2. Implement bullet-player collision
3. Calculate damage (headshot multiplier)
4. Handle player death
5. Spectator mode for dead players
6. Round-end respawn
7. Kill feed updates

**Files to Create/Modify**:
- `client/game/CombatSystem.js` (New)
- `client/game/SpectatorMode.js` (New)
- `functions/hitDetection.js` (New Cloud Function)
- Update `GameScene.js` with combat logic

**Estimated Time**: 30-40 hours

### Phase 6.5: Round System (Week 5)
**Goal**: Implement 25-round competitive format

**Tasks**:
1. Round win conditions:
   - All enemies eliminated
   - Bomb exploded (Red wins)
   - Bomb defused (Blue wins)
   - Time expired (Blue wins)
2. Round counter (first to 13 wins)
3. Round end screen
4. Economy system (money per round)
5. Buy phase (30s at round start)
6. Action phase (120s)

**Files to Create/Modify**:
- `client/game/RoundManager.js` (New)
- `client/ui/RoundEndScreen.js` (New)
- Update `RoundTimer.js` with new logic
- `functions/roundLogic.js` (New Cloud Function)

**Estimated Time**: 25-30 hours

### Phase 6.6: Half-Time System (Week 6)
**Goal**: Implement team switch at round 12

**Tasks**:
1. Detect half-time (after round 12)
2. Switch teams (Red ↔ Blue)
3. Preserve win counts
4. Show half-time screen
5. Reset positions

**Files to Create/Modify**:
- `client/game/HalfTimeManager.js` (New)
- `client/ui/HalfTimeScreen.js` (New)
- Update `RoundManager.js`
- `functions/halfTimeLogic.js` (New Cloud Function)

**Estimated Time**: 10-15 hours

### Phase 6.7: Scoreboard & Stats (Week 7)
**Goal**: Track and display player statistics

**Tasks**:
1. Track kills, deaths, assists
2. Calculate KDA ratio
3. Determine MVP (most kills + plants/defuses)
4. Create end-match scoreboard
5. Display individual stats
6. Show match summary

**Files to Create/Modify**:
- `client/ui/Scoreboard.js` (New)
- `client/ui/MatchSummary.js` (New)
- `client/game/StatsTracker.js` (New)
- `functions/statsCalculation.js` (New Cloud Function)

**Estimated Time**: 20-25 hours

## 📊 Total Estimated Time
**145-195 hours** (4-5 weeks full-time development)

## 🔧 Technical Requirements

### Server-Side (Firebase Cloud Functions)
```javascript
// New functions needed:
- matchmaking.js (~500 lines)
- bombLogic.js (~400 lines)
- hitDetection.js (~600 lines)
- roundLogic.js (~500 lines)
- halfTimeLogic.js (~300 lines)
- statsCalculation.js (~400 lines)

Total: ~2700 lines of server code
```

### Client-Side
```javascript
// New files needed:
- MatchmakingScene.js (~300 lines) ✅
- TeamManager.js (~400 lines)
- BombManager.js (~600 lines)
- CombatSystem.js (~800 lines)
- SpectatorMode.js (~300 lines)
- RoundManager.js (~500 lines)
- HalfTimeManager.js (~200 lines)
- StatsTracker.js (~300 lines)
- Scoreboard.js (~400 lines)
- MatchSummary.js (~300 lines)
- BombUI.js (~200 lines)
- RoundEndScreen.js (~200 lines)
- HalfTimeScreen.js (~150 lines)

Total: ~4650 lines of client code
```

### Database Structure
```javascript
/matchmaking/
  queue/
    {playerId}: { joinedAt, rank, region }

/matches/
  {matchId}/
    status: "waiting" | "in_progress" | "completed"
    teams:
      red: [player1, player2, player3, player4, player5]
      blue: [player6, player7, player8, player9, player10]
    bombCarrier: playerId
    bombLocation: { x, y } | null
    bombPlanted: boolean
    bombSite: "A" | "B" | null
    currentRound: 1-25
    scores:
      red: 0-13
      blue: 0-13
    halfTime: boolean
    players:
      {playerId}:
        team: "red" | "blue"
        alive: boolean
        health: 0-100
        kills: 0
        deaths: 0
        assists: 0
        plants: 0
        defuses: 0
```

## 💰 Cost Impact
With this complexity:
- **Cloud Functions**: ~$50-100/month (heavy computation)
- **Realtime Database**: ~$30-50/month (constant updates)
- **Total**: ~$80-150/month for 50 concurrent players

## 🚀 Quick Start (Simplified Version)

If you want to start small, implement in this order:

### Minimal Viable Competitive Mode (2 weeks)
1. **Matchmaking** (3 days)
   - Queue system
   - Auto-match 10 players
   
2. **Teams** (2 days)
   - Random 5v5 assignment
   - Team colors
   
3. **Basic Combat** (4 days)
   - Hit detection
   - Player death
   - Round end on team elimination
   
4. **Simple Rounds** (3 days)
   - First to 5 wins (instead of 13)
   - No bomb mechanics
   - Basic scoreboard

This gives you a playable competitive mode in ~2 weeks instead of 2 months.

## 📝 Recommendation

Given the massive scope, I recommend:

### Option A: Hire a Developer
This is 4-5 weeks of full-time work. Consider hiring someone to implement this.

### Option B: Use Existing Framework
Consider using a game engine like Unity or Unreal with networking built-in.

### Option C: Simplified Version
Implement the "Minimal Viable Competitive Mode" above, then iterate.

### Option D: Step-by-Step Implementation
I can help you implement ONE phase at a time. Start with Phase 6.1 (Matchmaking).

## 🎯 Next Steps

**Choose your path**:
1. Full implementation (4-5 weeks)
2. Simplified version (2 weeks)
3. One phase at a time (ongoing)

**If you want to proceed**, let me know which phase to start with, and I'll provide the complete code for that phase.

---

**Current Status**: Roadmap created, MatchmakingScene started
**Recommendation**: Start with Phase 6.1 (Matchmaking) and build incrementally
**Estimated Full Completion**: 4-5 weeks full-time development
