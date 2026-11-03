// Canvas-based Confetti & Particle Celebration Engine
// Standalone, ultra-smooth 60fps animations

class ConfettiEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animId = null;
        this.colors = [
            '#e11d48', '#dc2626', '#b91c1c', '#f43f5e', 
            '#fb7185', '#f59e0b', '#fde047', '#ffd166', 
            '#ffffff', '#ff9ff3', '#f368e0'
        ];
        this.emojis = ['🌹', '🎂', '🎉', '🎁', '✨', '💖', '🐰', '🍓', '👑'];
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '99999';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, isEmoji = false) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 9 + 4;
        return {
            x: x !== undefined ? x : Math.random() * this.canvas.width,
            y: y !== undefined ? y : Math.random() * -50,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity - 3,
            size: Math.random() * 8 + 6,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            gravity: 0.25,
            drag: 0.98,
            opacity: 1,
            isEmoji: isEmoji || Math.random() < 0.15,
            emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)]
        };
    }

    burst(x, y, count = 70) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(x, y));
        }
        this.start();
    }

    cannon() {
        const leftX = this.canvas.width * 0.15;
        const rightX = this.canvas.width * 0.85;
        const bottomY = this.canvas.height * 0.85;

        for (let i = 0; i < 60; i++) {
            const p1 = this.createParticle(leftX, bottomY);
            p1.vx = (Math.random() * 8 + 4);
            p1.vy = -(Math.random() * 14 + 10);
            this.particles.push(p1);

            const p2 = this.createParticle(rightX, bottomY);
            p2.vx = -(Math.random() * 8 + 4);
            p2.vy = -(Math.random() * 14 + 10);
            this.particles.push(p2);
        }
        this.start();
    }

    rain(durationMs = 4000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            if (Date.now() - startTime > durationMs) {
                clearInterval(interval);
                return;
            }
            for (let i = 0; i < 6; i++) {
                this.particles.push(this.createParticle(Math.random() * this.canvas.width, -20));
            }
            this.start();
        }, 100);
    }

    start() {
        if (!this.animId) {
            this.loop();
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.006;

            if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);

            if (p.isEmoji) {
                this.ctx.font = `${p.size * 2}px sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(p.emoji, 0, 0);
            } else {
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
            }

            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animId = requestAnimationFrame(() => this.loop());
        } else {
            this.animId = null;
        }
    }
}

let confetti;
document.addEventListener('DOMContentLoaded', () => {
    confetti = new ConfettiEngine();
});

