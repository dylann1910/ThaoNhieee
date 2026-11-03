// Web Audio API Synthesizer & Sound Effects Engine - Birthday Red Edition
// 100% Safari (iOS & macOS), Chrome, Firefox & Edge compatible

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isUnlocked = false;
        this.isPlayingBGM = false;
        this.bgmTimeout = null;
        this.bgmStep = 0;
        this.tempo = 145; // BPM

        this.setupSafariUnlock();
    }

    // Safely get or create the AudioContext lazily
    getContext() {
        if (!this.ctx) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            } catch (e) {
                console.warn('Could not initialize AudioContext:', e);
            }
        }
        return this.ctx;
    }

    // Safari & iOS WebKit unlock routine
    unlock() {
        const ctx = this.getContext();
        if (!ctx) return;

        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        if (!this.isUnlocked) {
            try {
                // 1. Play 1-sample silent Web Audio buffer
                const buffer = ctx.createBuffer(1, 1, 22050);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.start(0);

                // 2. Play tiny silent HTML5 audio to unlock iOS silent switch / audio session
                const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
                silentAudio.volume = 0.01;
                silentAudio.play().catch(() => {});

                this.isUnlocked = true;
            } catch (e) {
                // Ignore silent unlock error
            }
        }
    }

    // Setup global capture listeners for first user interaction (tap / click)
    setupSafariUnlock() {
        const unlockEvents = ['click', 'touchend', 'mouseup', 'keydown'];
        const handleUnlock = () => {
            this.unlock();
            const ctx = this.getContext();
            if (ctx && ctx.state === 'running') {
                unlockEvents.forEach(ev => {
                    document.removeEventListener(ev, handleUnlock, { capture: true });
                });
            }
        };

        unlockEvents.forEach(ev => {
            document.addEventListener(ev, handleUnlock, { capture: true, passive: true });
        });
    }

    // Direct Web Audio clock tone scheduler (100% immune to Safari setTimeout timer throttling)
    scheduleTone(freq, startTime, duration = 0.2, type = 'sine', gainVal = 0.15) {
        const ctx = this.getContext();
        if (!ctx || freq <= 0) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(gainVal, startTime);
            gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.05);
        } catch (e) {
            console.warn('scheduleTone error:', e);
        }
    }

    // Single note synthesizer
    playTone(freq, duration = 0.2, type = 'sine', gainVal = 0.15) {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx || freq <= 0) return;

        const now = Math.max(ctx.currentTime, 0.001);
        this.scheduleTone(freq, now, duration, type, gainVal);
    }

    // Cute Rabbit Munching / Eating Sound
    playMunch() {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = Math.max(ctx.currentTime, 0.001);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.04);
            osc.frequency.linearRampToValueAtTime(250, now + 0.09);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.0001, now + 0.09);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {
            console.warn('playMunch error:', e);
        }
    }

    // Flower add sound (Soft high chime, scheduled on Web Audio clock)
    playFlower() {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx) return;

        const now = Math.max(ctx.currentTime, 0.001);
        const notes = [659.25, 880, 1046.5]; // E5, A5, C6
        notes.forEach((f, idx) => {
            this.scheduleTone(f, now + idx * 0.055, 0.18, 'sine', 0.15);
        });
    }

    // Party horn (kazoo/brass comical sound)
    playHorn() {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = Math.max(ctx.currentTime, 0.001);
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'square';

            osc1.frequency.setValueAtTime(320, now);
            osc1.frequency.linearRampToValueAtTime(450, now + 0.15);
            osc1.frequency.setValueAtTime(420, now + 0.35);

            osc2.frequency.setValueAtTime(325, now);
            osc2.frequency.linearRampToValueAtTime(455, now + 0.15);
            osc2.frequency.setValueAtTime(425, now + 0.35);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
            gain.gain.linearRampToValueAtTime(0.0001, now + 0.45);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.48);
            osc2.stop(now + 0.48);
        } catch (e) {
            console.warn('playHorn error:', e);
        }
    }

    // Birthday Fanfare / Victory (Direct hardware timeline scheduling)
    playFanfare() {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx) return;

        const now = Math.max(ctx.currentTime, 0.001);
        const notes = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 523.25, d: 0.12 }, // C5
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.25 }, // E5
            { f: 783.99, d: 0.45 }  // G5
        ];

        let offset = 0;
        notes.forEach(note => {
            this.scheduleTone(note.f, now + offset, note.d, 'triangle', 0.25);
            offset += note.d + 0.035;
        });
    }

    // Comic "Bruh" sound
    playBruh() {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = Math.max(ctx.currentTime, 0.001);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.linearRampToValueAtTime(70, now + 0.4);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.0001, now + 0.45);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.46);
        } catch (e) {
            console.warn('playBruh error:', e);
        }
    }

    // Sparkle / Magic shimmer
    playSparkle() {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx) return;

        const now = Math.max(ctx.currentTime, 0.001);
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((f, idx) => {
            this.scheduleTone(f, now + idx * 0.06, 0.15, 'sine', 0.12);
        });
    }

    // Coin / Ding sound
    playDing() {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = Math.max(ctx.currentTime, 0.001);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.0001, now + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.36);
        } catch (e) {
            console.warn('playDing error:', e);
        }
    }

    // Cheering / Applause noise
    playApplause() {
        this.unlock();
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const sampleRate = ctx.sampleRate || 44100;
            const bufferSize = Math.floor(sampleRate * 1.2);
            const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1100;
            filter.Q.value = 1.2;

            const gain = ctx.createGain();
            const now = Math.max(ctx.currentTime, 0.001);
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
            gain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(now);
            noise.stop(now + 1.22);
        } catch (e) {
            console.warn('playApplause error:', e);
        }
    }

    // 8-bit Chiptune Happy Birthday song
    toggleBGM(onNotePlayed) {
        this.unlock();
        if (this.isPlayingBGM) {
            this.stopBGM();
            return false;
        } else {
            this.startBGM(onNotePlayed);
            return true;
        }
    }

    startBGM(onNotePlayed) {
        this.unlock();
        this.isPlayingBGM = true;
        this.bgmStep = 0;

        // Happy Birthday Melody
        const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
        const C5 = 523.25, D5 = 587.33, Bb4 = 466.16;

        const melody = [
            { f: C4, d: 0.75 }, { f: C4, d: 0.25 }, { f: D4, d: 1 }, { f: C4, d: 1 }, { f: F4, d: 1 }, { f: E4, d: 2 },
            { f: C4, d: 0.75 }, { f: C4, d: 0.25 }, { f: D4, d: 1 }, { f: C4, d: 1 }, { f: G4, d: 1 }, { f: F4, d: 2 },
            { f: C4, d: 0.75 }, { f: C4, d: 0.25 }, { f: C5, d: 1 }, { f: A4, d: 1 }, { f: F4, d: 1 }, { f: E4, d: 1 }, { f: D4, d: 2 },
            { f: Bb4, d: 0.75 }, { f: Bb4, d: 0.25 }, { f: A4, d: 1 }, { f: F4, d: 1 }, { f: G4, d: 1 }, { f: F4, d: 2 },
            { f: 0, d: 1 }
        ];

        const beatDuration = 60 / this.tempo;

        const playNext = () => {
            if (!this.isPlayingBGM) return;

            const note = melody[this.bgmStep];
            if (note.f > 0) {
                this.playTone(note.f, note.d * beatDuration * 0.9, 'square', 0.08);
                this.playTone(note.f / 2, note.d * beatDuration * 0.9, 'triangle', 0.05);

                if (typeof onNotePlayed === 'function') {
                    try { onNotePlayed(note.f); } catch (e) {}
                }
            }

            const stepDurationMs = note.d * beatDuration * 1000;
            this.bgmStep = (this.bgmStep + 1) % melody.length;
            this.bgmTimeout = setTimeout(playNext, stepDurationMs);
        };

        playNext();
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
    }
}

// Global instance attached to both local and window scope
const sound = new SoundEngine();
window.sound = sound;
