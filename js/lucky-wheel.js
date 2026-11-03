// Lucky Birthday Wheel for Thảo Nhi's 22nd Birthday
// High-performance canvas spinning wheel with custom options, physics, sounds & prizes!

const WHEEL_PALETTE = [
    { bg: "#e11d48", text: "#ffffff" }, // Red rose
    { bg: "#f59e0b", text: "#1e1b18" }, // Amber/gold
    { bg: "#be123c", text: "#ffffff" }, // Deep rose
    { bg: "#10b981", text: "#ffffff" }, // Emerald green
    { bg: "#8b5cf6", text: "#ffffff" }, // Purple
    { bg: "#ec4899", text: "#ffffff" }, // Pink
    { bg: "#f97316", text: "#ffffff" }, // Orange
    { bg: "#dc2626", text: "#ffffff" }, // Crimson
    { bg: "#06b6d4", text: "#ffffff" }, // Cyan
    { bg: "#6366f1", text: "#ffffff" }  // Indigo
];

// Exact default options requested by user
const DEFAULT_ROMANTIC_OPTIONS = [
    { text: "Hôn 💋", desc: "Được nhận ngay 1 nụ hôn ngọt ngào ngày sinh nhật!" },
    { text: "Thơm má 🥰", desc: "Được thơm má 1 cái cực kỳ đáng yêu!" },
    { text: "Ôm thật chặt 🤗", desc: "Một cái ôm ấm áp 30 giây tiếp thêm năng lượng tuổi 22!" },
    { text: "Cầu được ước thấy ✨", desc: "Ước bất cứ điều gì trong ngày sinh nhật cũng sẽ thành sự thật!" }
];

class LuckyWheel {
    constructor() {
        this.canvas = document.getElementById('wheel-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.segments = this.loadSavedOptions();

        this.currentAngle = 0;
        this.isSpinning = false;
        this.spinVelocity = 0;
        this.friction = 0.985;
        this.lastTickedSegment = -1;

        this.init();
    }

    loadSavedOptions() {
        try {
            const saved = localStorage.getItem('thaoNhiWheelSegments_v4');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length >= 2) {
                    return this.assignColors(parsed);
                }
            }
        } catch (e) {}
        return this.assignColors(DEFAULT_ROMANTIC_OPTIONS);
    }

    assignColors(items) {
        return items.map((item, idx) => {
            const pal = WHEEL_PALETTE[idx % WHEEL_PALETTE.length];
            return {
                text: item.text,
                desc: item.desc || `Chúc mừng Thảo Nhi nhận được: ${item.text}! Hãy thực hiện ngay nhé! 💖`,
                color: pal.bg,
                textCol: pal.text
            };
        });
    }

    saveOptions() {
        try {
            const dataToSave = this.segments.map(s => ({ text: s.text, desc: s.desc }));
            localStorage.setItem('thaoNhiWheelSegments_v4', JSON.stringify(dataToSave));
        } catch (e) {}
    }

    init() {
        this.canvas.width = 380;
        this.canvas.height = 380;
        this.bindEvents();
        this.renderChips();
        this.drawWheel();
    }

    bindEvents() {
        const spinBtn = document.getElementById('spin-wheel-btn');
        const closeModalBtn = document.getElementById('close-wheel-modal-btn');
        const modal = document.getElementById('wheel-result-modal');

        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                if (this.isSpinning) return;
                this.spin();
            });
        }

        if (closeModalBtn && modal) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        // Add option form
        const addForm = document.getElementById('add-wheel-option-form');
        const input = document.getElementById('new-wheel-option-input');
        if (addForm && input) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.isSpinning) return;

                const text = input.value.trim();
                if (!text) return;

                if (this.segments.length >= 16) {
                    alert("Vòng quay đã đạt tối đa 16 ô rồi nhé!");
                    return;
                }

                // Check duplicate
                if (this.segments.some(s => s.text.toLowerCase() === text.toLowerCase())) {
                    alert("Ô này đã có trên vòng quay rồi!");
                    return;
                }

                this.segments.push({
                    text: text,
                    desc: `Chúc mừng Thảo Nhi quay trúng: ${text}! Hãy cùng thực hiện nhé! 🌹✨`
                });

                this.segments = this.assignColors(this.segments);
                this.saveOptions();
                this.renderChips();
                this.drawWheel();

                input.value = '';
                if (window.sound) sound.playDing();
            });
        }

        // Reset to default 4 options
        const resetBtn = document.getElementById('reset-wheel-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.isSpinning) return;
                this.segments = this.assignColors(DEFAULT_ROMANTIC_OPTIONS);
                this.saveOptions();
                this.renderChips();
                this.drawWheel();
                if (window.sound) sound.playDing();
            });
        }
    }

    renderChips() {
        const container = document.getElementById('wheel-chips-container');
        const badge = document.getElementById('wheel-count-badge');
        if (badge) badge.textContent = `${this.segments.length} Ô`;

        if (!container) return;
        container.innerHTML = '';

        this.segments.forEach((seg, idx) => {
            const chip = document.createElement('div');
            chip.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-black font-bold text-xs shadow-sm transition-all';
            chip.style.backgroundColor = seg.color;
            chip.style.color = seg.textCol;

            chip.innerHTML = `
                <span class="truncate max-w-[120px]">${this.escapeHtml(seg.text)}</span>
                <button type="button" class="del-chip-btn hover:scale-125 transition-transform font-black ml-0.5 text-xs focus:outline-none" data-index="${idx}" title="Xóa ô này">✕</button>
            `;
            container.appendChild(chip);
        });

        // Bind delete buttons
        container.querySelectorAll('.del-chip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.isSpinning) return;

                if (this.segments.length <= 2) {
                    alert("Vòng quay cần tối thiểu 2 ô nhé!");
                    return;
                }

                const index = parseInt(btn.getAttribute('data-index'), 10);
                this.segments.splice(index, 1);
                this.segments = this.assignColors(this.segments);
                this.saveOptions();
                this.renderChips();
                this.drawWheel();
                if (window.sound) sound.playDing();
            });
        });
    }

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    spin() {
        if (this.segments.length < 2) return;
        this.isSpinning = true;
        // Random dramatic velocity
        this.spinVelocity = Math.random() * 14 + 32;
        if (window.sound) sound.playHorn();

        const animate = () => {
            this.currentAngle += this.spinVelocity * (Math.PI / 180);
            this.spinVelocity *= this.friction;

            // Check tick sound on segment pass
            const numSegs = this.segments.length;
            const currentSeg = Math.floor(((this.currentAngle % (Math.PI * 2)) / (Math.PI * 2)) * numSegs);
            if (currentSeg !== this.lastTickedSegment) {
                this.lastTickedSegment = currentSeg;
                if (window.sound) sound.playDing();
            }

            this.drawWheel();

            if (this.spinVelocity > 0.05) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                this.onSpinComplete();
            }
        };

        requestAnimationFrame(animate);
    }

    onSpinComplete() {
        const numSegs = this.segments.length;
        const segAngle = (Math.PI * 2) / numSegs;

        // Pointer is at top (12 o'clock = 1.5 * PI)
        const normalized = ((1.5 * Math.PI - this.currentAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const winningIndex = Math.floor(normalized / segAngle) % numSegs;

        const won = this.segments[winningIndex];

        // Show Modal
        const modal = document.getElementById('wheel-result-modal');
        const titleEl = document.getElementById('wheel-result-title');
        const descEl = document.getElementById('wheel-result-desc');

        if (titleEl) titleEl.textContent = won.text;
        if (descEl) descEl.textContent = won.desc;
        if (modal) modal.classList.remove('hidden');

        if (window.sound) sound.playFanfare();
        if (window.confetti) confetti.cannon();
    }

    drawWheel() {
        const ctx = this.ctx;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const r = cx - 18;
        const numSegs = this.segments.length;
        const segAngle = (Math.PI * 2) / numSegs;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Outer Ring with Gold Border & Lights
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r + 12, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b18';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();

        // Perimeter bulbs
        const bulbCount = Math.max(16, numSegs * 2);
        for (let i = 0; i < bulbCount; i++) {
            const bulbAngle = (i / bulbCount) * Math.PI * 2;
            const bx = cx + Math.cos(bulbAngle) * (r + 8);
            const by = cy + Math.sin(bulbAngle) * (r + 8);
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fillStyle = (i % 2 === 0 ? '#dc2626' : '#ffffff');
            ctx.fill();
        }
        ctx.restore();

        // Draw Segments
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.currentAngle);

        // Font calculation based on segment count
        let fontSize = 13;
        if (numSegs >= 14) fontSize = 10;
        else if (numSegs >= 10) fontSize = 11;
        else if (numSegs <= 6) fontSize = 14;

        for (let i = 0; i < numSegs; i++) {
            const startA = i * segAngle;
            const endA = startA + segAngle;
            const seg = this.segments[i];

            // Slice
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, r, startA, endA);
            ctx.closePath();
            ctx.fillStyle = seg.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Text
            ctx.save();
            ctx.rotate(startA + segAngle / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = seg.textCol;
            ctx.font = `700 ${fontSize}px "Fredoka", sans-serif`;

            // Truncate if too long
            let displayText = seg.text;
            if (displayText.length > 18) {
                displayText = displayText.substring(0, 16) + '...';
            }

            ctx.fillText(displayText, r - 20, 0);
            ctx.restore();
        }

        // Center hub
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#1e1b18';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fillStyle = '#e11d48';
        ctx.fill();

        ctx.font = '900 12px "Bungee", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("22", 0, 0);

        ctx.restore();

        // Draw Fixed Top Pointer (Arrow pointing down at 12 o'clock)
        ctx.save();
        ctx.fillStyle = '#e11d48';
        ctx.strokeStyle = '#1e1b18';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 14, 10);
        ctx.lineTo(cx + 14, 10);
        ctx.lineTo(cx, 38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, 16, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
        ctx.restore();
    }
}

let luckyWheel;
document.addEventListener('DOMContentLoaded', () => {
    luckyWheel = new LuckyWheel();
});
