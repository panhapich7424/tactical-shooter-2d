// Round Timer - Manages game phases and timing
export class RoundTimer {
    constructor(scene) {
        this.scene = scene;
        this.currentPhase = 'buy';
        this.timeRemaining = 30;
        this.roundNumber = 1;
        this.timerEvent = null;
        
        // Phase durations (in seconds)
        this.phaseDurations = {
            buy: 30,
            action: 120,
            roundEnd: 5
        };
    }

    start() {
        this.startPhase('buy');
    }

    startPhase(phase) {
        this.currentPhase = phase;
        this.timeRemaining = this.phaseDurations[phase];
        
        // Clear existing timer
        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        // Emit phase change event
        this.scene.events.emit('phaseChanged', phase);
        
        // Start countdown
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.tick,
            callbackScope: this,
            loop: true
        });
    }

    tick() {
        this.timeRemaining--;
        
        // Emit timer update
        this.scene.events.emit('timerUpdate', this.timeRemaining);
        
        // Check if phase ended
        if (this.timeRemaining <= 0) {
            this.onPhaseEnd();
        }
    }

    onPhaseEnd() {
        switch(this.currentPhase) {
            case 'buy':
                this.startPhase('action');
                break;
            case 'action':
                this.startPhase('roundEnd');
                break;
            case 'roundEnd':
                this.nextRound();
                break;
        }
    }

    nextRound() {
        this.roundNumber++;
        this.scene.events.emit('roundChanged', this.roundNumber);
        this.startPhase('buy');
    }

    forcePhase(phase) {
        this.startPhase(phase);
    }

    pause() {
        if (this.timerEvent) {
            this.timerEvent.paused = true;
        }
    }

    resume() {
        if (this.timerEvent) {
            this.timerEvent.paused = false;
        }
    }

    stop() {
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }
    }

    getCurrentPhase() {
        return this.currentPhase;
    }

    getTimeRemaining() {
        return this.timeRemaining;
    }

    getRoundNumber() {
        return this.roundNumber;
    }

    destroy() {
        this.stop();
    }
}
