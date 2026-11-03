// Dedicated Canvas-based Flower Bouquet Maker for Thảo Nhi (22nd Birthday Red Edition)
// Allows creating lush, elegant flower bouquets and downloading as high-res PNG!

class BouquetStudio {
    constructor() {
        this.canvas = document.getElementById('bouquet-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.flowers = []; // Array of { type, x, y, size, angle, color }
        this.wrapperStyle = 'wrap-red';
        this.cardMessage = "Gửi tặng Thảo Nhi tuổi 22 rực rỡ 🌹";

        this.init();
    }

    init() {
        this.canvas.width = 600;
        this.canvas.height = 700;
        this.bindEvents();
        this.autoArrange22Flowers();
    }

    bindEvents() {
        const flowerBtns = document.querySelectorAll('.add-flower-btn');
        const auto22Btn = document.getElementById('auto-22-flowers-btn');
        const clearBtn = document.getElementById('clear-bouquet-btn');
        const downloadBtn = document.getElementById('download-bouquet-btn');
        const wrapperSelect = document.getElementById('bouquet-wrapper-select');
        const cardTextInput = document.getElementById('bouquet-card-text');

        flowerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.flowers.length >= 35) {
                    alert("Bó hoa đã rất đầy và rực rỡ rồi! 💐");
                    return;
                }
                const flowerType = btn.getAttribute('data-flower-type') || 'rose';
                this.addSingleFlower(flowerType);
                if (window.sound) sound.playFlower();
            });
        });

        if (auto22Btn) {
            auto22Btn.addEventListener('click', () => {
                this.autoArrange22Flowers();
                if (window.sound) sound.playFanfare();
                if (window.confetti) confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 70);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.flowers = [];
                this.render();
                this.updateCount();
                if (window.sound) sound.playDing();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.download();
            });
        }

        if (wrapperSelect) {
            wrapperSelect.addEventListener('change', (e) => {
                this.wrapperStyle = e.target.value;
                this.render();
                if (window.sound) sound.playDing();
            });
        }

        if (cardTextInput) {
            cardTextInput.addEventListener('input', (e) => {
                this.cardMessage = e.target.value.trim() || "Gửi tặng Thảo Nhi tuổi 22 🌹";
                this.render();
            });
        }
    }

    addSingleFlower(type) {
        // Arrange naturally in a dome centered at (300, 280)
        const count = this.flowers.length;
        const radius = Math.min(180, 50 + Math.sqrt(count) * 26);
        const angle = (count * 137.5) * (Math.PI / 180); // Golden angle
        const jitterX = (Math.random() - 0.5) * 20;
        const jitterY = (Math.random() - 0.5) * 20;

        const x = 300 + Math.cos(angle) * (radius * 0.85) + jitterX;
        const y = 280 + Math.sin(angle) * (radius * 0.65) - 30 + jitterY;

        this.flowers.push({
            type: type,
            x: x,
            y: y,
            size: Math.random() * 8 + 36,
            angle: (Math.random() - 0.5) * 0.4
        });

        this.render();
        this.updateCount();
    }

    autoArrange22Flowers() {
        this.flowers = [];
        // Perfectly balanced dome of 22 flowers
        const flowerTypes = [
            'rose', 'rose', 'tulip', 'rose', 'sunflower', 'rose',
            'carnation', 'rose', 'tulip', 'rose', 'daisy', 'rose',
            'rose', 'sunflower', 'rose', 'tulip', 'rose', 'carnation',
            'rose', 'daisy', 'rose', 'rose'
        ];

        // 1 central rose
        this.flowers.push({ type: 'rose', x: 300, y: 250, size: 46, angle: 0 });

        // Inner ring of 7 flowers
        for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2 + 0.2;
            const r = 65;
            this.flowers.push({
                type: flowerTypes[i + 1],
                x: 300 + Math.cos(a) * r,
                y: 250 + Math.sin(a) * (r * 0.8),
                size: 42,
                angle: (i % 2 === 0 ? 0.15 : -0.15)
            });
        }

        // Outer ring of 14 flowers
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            const rx = 135;
            const ry = 105;
            this.flowers.push({
                type: flowerTypes[i + 8],
                x: 300 + Math.cos(a) * rx,
                y: 250 + Math.sin(a) * ry,
                size: 38,
                angle: (i % 2 === 0 ? -0.2 : 0.2)
            });
        }

        this.render();
        this.updateCount();
    }

    updateCount() {
        const countEl = document.getElementById('bouquet-count');
        const tagMsg = document.getElementById('bouquet-tag-msg');
        if (countEl) countEl.textContent = this.flowers.length;

        if (tagMsg) {
            if (this.flowers.length === 22) {
                tagMsg.innerHTML = "✨ <b>Tuyệt đẹp! Đúng 22 bông hoa rực rỡ chúc mừng tuổi 22 của Thảo Nhi!</b> 🌹✨";
                tagMsg.className = "text-xs font-bold text-red-600 bg-red-100 p-2 rounded-lg border border-red-300 mt-2";
            } else {
                tagMsg.innerHTML = `Bó hoa hiện có <b>${this.flowers.length}</b> đóa hoa tươi thắm.`;
                tagMsg.className = "text-xs font-semibold text-gray-700 mt-2";
            }
        }
    }

    // ================= Canvas Drawing Helpers =================
    drawBackground() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Elegant Warm Cream/Rose Pearl Gradient
        const grad = this.ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, 450);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#fff1f2');
        grad.addColorStop(1, '#ffe4e6');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, w, h);

        // Decorative Border Frame
        this.ctx.strokeStyle = '#e11d48';
        this.ctx.lineWidth = 6;
        this.ctx.strokeRect(12, 12, w - 24, h - 24);

        this.ctx.strokeStyle = '#fde047';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(18, 18, w - 36, h - 36);

        // Little corner hearts
        const drawCornerHeart = (x, y) => {
            this.ctx.font = '16px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('🌹', x, y);
        };
        drawCornerHeart(30, 30);
        drawCornerHeart(w - 30, 30);
        drawCornerHeart(30, h - 30);
        drawCornerHeart(w - 30, h - 30);

        // Header Title on Canvas
        this.ctx.font = '900 22px "Bungee", Impact, sans-serif';
        this.ctx.fillStyle = '#be123c';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("BÓ HOA TUỔI 22 • THẢO NHI", w / 2, 48);

        this.ctx.font = '600 13px "Fredoka", sans-serif';
        this.ctx.fillStyle = '#881337';
        this.ctx.fillText("HAPPY 22ND BIRTHDAY • ALWAYS BLOOMING", w / 2, 70);
    }

    drawWrapper() {
        const ctx = this.ctx;

        let wrapColor1 = '#be123c';
        let wrapColor2 = '#9f1239';
        let tissueColor = '#ffffff';

        if (this.wrapperStyle === 'wrap-pink') {
            wrapColor1 = '#f472b6';
            wrapColor2 = '#db2777';
            tissueColor = '#fff5f5';
        } else if (this.wrapperStyle === 'wrap-vintage') {
            wrapColor1 = '#d97706';
            wrapColor2 = '#b45309';
            tissueColor = '#fef3c7';
        } else if (this.wrapperStyle === 'wrap-black') {
            wrapColor1 = '#27272a';
            wrapColor2 = '#09090b';
            tissueColor = '#f4f4f5';
        }

        ctx.save();

        // 1. White Tissue Paper Flared Collar Behind
        ctx.fillStyle = tissueColor;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(140, 270);
        ctx.quadraticCurveTo(80, 230, 110, 380);
        ctx.lineTo(240, 480);
        ctx.lineTo(360, 480);
        ctx.lineTo(490, 380);
        ctx.quadraticCurveTo(520, 230, 460, 270);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 2. Outer Wrapping Paper Left Fold
        ctx.fillStyle = wrapColor1;
        ctx.strokeStyle = '#1e1b18';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(120, 320);
        ctx.quadraticCurveTo(180, 410, 250, 580);
        ctx.lineTo(350, 580);
        ctx.quadraticCurveTo(240, 470, 190, 350);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. Outer Wrapping Paper Right Fold
        ctx.fillStyle = wrapColor2;
        ctx.beginPath();
        ctx.moveTo(480, 320);
        ctx.quadraticCurveTo(420, 410, 350, 580);
        ctx.lineTo(250, 580);
        ctx.quadraticCurveTo(360, 470, 410, 350);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 4. Central Wrap Body
        const wrapGrad = ctx.createLinearGradient(200, 380, 400, 580);
        wrapGrad.addColorStop(0, wrapColor1);
        wrapGrad.addColorStop(1, wrapColor2);
        ctx.fillStyle = wrapGrad;
        ctx.beginPath();
        ctx.moveTo(180, 340);
        ctx.lineTo(420, 340);
        ctx.lineTo(345, 580);
        ctx.lineTo(255, 580);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 5. Stems Peeking Out at Bottom
        ctx.strokeStyle = '#2d6a4f';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(280, 580); ctx.lineTo(270, 625);
        ctx.moveTo(295, 580); ctx.lineTo(295, 630);
        ctx.moveTo(310, 580); ctx.lineTo(315, 628);
        ctx.moveTo(325, 580); ctx.lineTo(335, 622);
        ctx.stroke();

        // 6. Gold Ribbon Bow at Neck
        const ribbonY = 520;
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#1e1b18';
        ctx.lineWidth = 3;

        // Dangling Ribbons
        ctx.beginPath();
        ctx.moveTo(290, ribbonY + 5);
        ctx.quadraticCurveTo(260, ribbonY + 50, 250, ribbonY + 80);
        ctx.lineTo(262, ribbonY + 80);
        ctx.quadraticCurveTo(275, ribbonY + 45, 300, ribbonY + 10);
        ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(310, ribbonY + 5);
        ctx.quadraticCurveTo(340, ribbonY + 50, 350, ribbonY + 80);
        ctx.lineTo(338, ribbonY + 80);
        ctx.quadraticCurveTo(325, ribbonY + 45, 300, ribbonY + 10);
        ctx.fill(); ctx.stroke();

        // Left Loop
        ctx.beginPath();
        ctx.ellipse(275, ribbonY, 24, 14, -0.25, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // Right Loop
        ctx.beginPath();
        ctx.ellipse(325, ribbonY, 24, 14, 0.25, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // Center Knot
        ctx.beginPath();
        ctx.arc(300, ribbonY, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill(); ctx.stroke();

        ctx.restore();
    }

    drawFlower(f) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);

        const r = f.size;

        if (f.type === 'rose') {
            // Elegant Layered Red Velvet Rose
            // Leaves behind
            ctx.fillStyle = '#40916c';
            ctx.strokeStyle = '#1e1b18';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(-r * 0.7, -r * 0.4, r * 0.45, r * 0.25, -0.6, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(r * 0.7, r * 0.4, r * 0.45, r * 0.25, 0.6, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            // Petal Layers
            const colors = ['#881337', '#be123c', '#e11d48', '#f43f5e', '#fb7185'];
            for (let i = 0; i < 5; i++) {
                const layerR = r * (1 - i * 0.17);
                ctx.fillStyle = colors[i];
                ctx.strokeStyle = '#4c0519';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.arc(0, 0, layerR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Swirl lines inside
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc((i % 2 === 0 ? 2 : -2), (i % 2 === 0 ? -2 : 2), layerR * 0.7, 0, Math.PI * 1.5);
                ctx.stroke();
            }

        } else if (f.type === 'tulip') {
            // Tulip
            ctx.fillStyle = '#e11d48';
            ctx.strokeStyle = '#1e1b18';
            ctx.lineWidth = 2.5;

            // Tulip cup
            ctx.beginPath();
            ctx.moveTo(-r * 0.6, -r * 0.4);
            ctx.quadraticCurveTo(-r * 0.8, r * 0.7, 0, r * 0.85);
            ctx.quadraticCurveTo(r * 0.8, r * 0.7, r * 0.6, -r * 0.4);
            ctx.quadraticCurveTo(r * 0.3, 0, 0, -r * 0.5);
            ctx.quadraticCurveTo(-r * 0.3, 0, -r * 0.6, -r * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Center petal
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 0.3, r * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

        } else if (f.type === 'sunflower') {
            // Sunflower
            ctx.strokeStyle = '#1e1b18';
            ctx.lineWidth = 1.8;

            // Golden Petals
            const petalCount = 12;
            for (let i = 0; i < petalCount; i++) {
                ctx.save();
                ctx.rotate((i / petalCount) * Math.PI * 2);
                ctx.fillStyle = '#fde047';
                ctx.beginPath();
                ctx.ellipse(0, -r * 0.7, r * 0.22, r * 0.45, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            // Dark Center
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

        } else if (f.type === 'daisy') {
            // Daisy / Baby's breath
            ctx.strokeStyle = '#1e1b18';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 8; i++) {
                ctx.save();
                ctx.rotate((i / 8) * Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.ellipse(0, -r * 0.6, r * 0.2, r * 0.38, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

        } else if (f.type === 'carnation') {
            // Carnation
            ctx.fillStyle = '#fb7185';
            ctx.strokeStyle = '#9f1239';
            ctx.lineWidth = 2;
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, r * (0.8 - i * 0.1), 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    drawCardTag() {
        const ctx = this.ctx;
        // Pinned Greeting Card Tag attached to bouquet wrap
        const tagX = 300;
        const tagY = 440;
        const tagW = 260;
        const tagH = 65;

        ctx.save();
        ctx.translate(tagX, tagY);
        ctx.rotate(-0.04);

        // Drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(-tagW / 2 + 4, -tagH / 2 + 4, tagW, tagH);

        // Card base
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-tagW / 2, -tagH / 2, tagW, tagH);

        // Border
        ctx.strokeStyle = '#be123c';
        ctx.lineWidth = 3;
        ctx.strokeRect(-tagW / 2, -tagH / 2, tagW, tagH);

        // Inner dashed border
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-tagW / 2 + 4, -tagH / 2 + 4, tagW - 8, tagH - 8);

        // Pin icon at top center
        ctx.fillStyle = '#be123c';
        ctx.beginPath();
        ctx.arc(0, -tagH / 2 + 6, 4, 0, Math.PI * 2);
        ctx.fill();

        // Card Text
        ctx.font = '700 13px "Fredoka", "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = '#1e1b18';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.cardMessage, 0, 2);

        // Sub text
        ctx.font = '600 10px sans-serif';
        ctx.fillStyle = '#be123c';
        ctx.fillText("★ ĐÓA HOA TƯƠI THẮM DÀNH TẶNG CHO EM ★", 0, 19);

        ctx.restore();
    }

    render() {
        if (!this.canvas || !this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawWrapper();

        // Draw all flowers
        this.flowers.forEach(f => {
            this.drawFlower(f);
        });

        // Draw card tag on the bouquet wrapper
        this.drawCardTag();
    }

    download() {
        const link = document.createElement('a');
        link.download = `Bo_Hoa_Tang_Thao_Nhi_22_Tuoi_${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();

        if (window.confetti) {
            confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
        }
        if (window.sound) sound.playFanfare();
    }
}

let bouquetStudio;
document.addEventListener('DOMContentLoaded', () => {
    bouquetStudio = new BouquetStudio();
});

