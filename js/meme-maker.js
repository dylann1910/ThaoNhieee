// Interactive Birthday Meme Maker for Thảo Nhi (22nd Birthday Red Edition)
// No AI images - Uses beautiful Canvas Vector Art & allows Custom Photo Upload

class MemeMaker {
    constructor() {
        this.canvas = document.getElementById('meme-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.customImage = null;
        this.currentTemplate = 'queen_22';

        this.topText = "CHÚC MỪNG SINH NHẬT THẢO NHI 22 TUỔI";
        this.bottomText = "TUỔI MỚI GIÀU XỤ, ĐỎ RỰC RỠ NHA!";
        this.fontSize = 32;
        this.fontFamily = "'Impact', 'Arial Black', sans-serif";
        this.textColor = "#FFFFFF";
        this.strokeColor = "#000000";
        
        this.stickers = []; // { emoji, x, y, size }
        this.selectedSticker = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        const topInput = document.getElementById('meme-top-text');
        const bottomInput = document.getElementById('meme-bottom-text');
        const fontSizeSlider = document.getElementById('meme-font-size');
        const textColorPicker = document.getElementById('meme-text-color');
        const templateSelect = document.getElementById('meme-template-select');
        const uploadInput = document.getElementById('meme-file-upload');
        const downloadBtn = document.getElementById('meme-download-btn');
        const clearStickersBtn = document.getElementById('meme-clear-stickers-btn');
        const stickerBtns = document.querySelectorAll('.sticker-btn');

        if (topInput) {
            topInput.addEventListener('input', (e) => {
                this.topText = e.target.value.toUpperCase();
                this.render();
            });
        }

        if (bottomInput) {
            bottomInput.addEventListener('input', (e) => {
                this.bottomText = e.target.value.toUpperCase();
                this.render();
            });
        }

        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                this.fontSize = parseInt(e.target.value, 10);
                this.render();
            });
        }

        if (textColorPicker) {
            textColorPicker.addEventListener('input', (e) => {
                this.textColor = e.target.value;
                this.render();
            });
        }

        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => {
                this.currentTemplate = e.target.value;
                this.customImage = null;
                this.render();
            });
        }

        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            this.customImage = img;
                            this.currentTemplate = 'custom';
                            const aspect = img.height / img.width;
                            this.canvas.height = Math.round(600 * aspect);
                            this.render();
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        stickerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const emoji = btn.getAttribute('data-emoji');
                this.stickers.push({
                    emoji: emoji,
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2,
                    size: 64
                });
                if (window.sound) sound.playDing();
                this.render();
            });
        });

        if (clearStickersBtn) {
            clearStickersBtn.addEventListener('click', () => {
                this.stickers = [];
                this.render();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.download();
            });
        }

        // Preset caption buttons
        const presetBtns = document.querySelectorAll('.meme-preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const top = btn.getAttribute('data-top') || "";
                const bottom = btn.getAttribute('data-bottom') || "";
                this.topText = top.toUpperCase();
                this.bottomText = bottom.toUpperCase();
                if (topInput) topInput.value = this.topText;
                if (bottomInput) bottomInput.value = this.bottomText;
                if (window.sound) sound.playSparkle();
                this.render();
            });
        });

        // Pointer interactions for dragging stickers
        this.canvas.addEventListener('mousedown', (e) => this.handlePointerDown(e));
        window.addEventListener('mousemove', (e) => this.handlePointerMove(e));
        window.addEventListener('mouseup', () => this.handlePointerUp());

        this.canvas.addEventListener('touchstart', (e) => this.handlePointerDown(e.touches[0]));
        window.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handlePointerMove(e.touches[0]);
            }
        }, { passive: false });
        window.addEventListener('touchend', () => this.handlePointerUp());
    }

    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    handlePointerDown(e) {
        const coords = this.getCanvasCoords(e);
        for (let i = this.stickers.length - 1; i >= 0; i--) {
            const s = this.stickers[i];
            const dist = Math.hypot(coords.x - s.x, coords.y - s.y);
            if (dist < s.size) {
                this.selectedSticker = s;
                this.isDragging = true;
                this.dragOffset = { x: coords.x - s.x, y: coords.y - s.y };
                this.stickers.splice(i, 1);
                this.stickers.push(s);
                this.render();
                return;
            }
        }
    }

    handlePointerMove(e) {
        if (!this.isDragging || !this.selectedSticker) return;
        const coords = this.getCanvasCoords(e);
        this.selectedSticker.x = coords.x - this.dragOffset.x;
        this.selectedSticker.y = coords.y - this.dragOffset.y;
        this.render();
    }

    handlePointerUp() {
        this.isDragging = false;
        this.selectedSticker = null;
    }

    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = this.ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    drawTextWithOutline(lines, startY, isTop = true) {
        this.ctx.font = `900 ${this.fontSize}px ${this.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = isTop ? 'top' : 'bottom';
        this.ctx.fillStyle = this.textColor;
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = Math.max(4, Math.round(this.fontSize / 6));
        this.ctx.lineJoin = 'round';
        this.ctx.miterLimit = 2;

        const lineHeight = this.fontSize * 1.15;
        const totalHeight = lines.length * lineHeight;
        let y = isTop ? startY : startY - totalHeight + lineHeight;

        lines.forEach((line) => {
            this.ctx.strokeText(line, this.canvas.width / 2, y);
            this.ctx.fillText(line, this.canvas.width / 2, y);
            y += lineHeight;
        });
    }

    drawTemplateBackground() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        if (this.currentTemplate === 'custom' && this.customImage) {
            this.ctx.drawImage(this.customImage, 0, 0, w, h);
            return;
        }

        // Draw Clean Vector Templates (Zero AI artifacts)
        if (this.currentTemplate === 'queen_22') {
            // Elegant Vibrant Red Birthday 22 Theme
            const grad = this.ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#e11d48');
            grad.addColorStop(1, '#9f1239');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, w, h);

            // Gold Sparkles and Confetti dots
            this.ctx.fillStyle = '#fde047';
            for (let i = 0; i < 30; i++) {
                const rx = (i * 73) % w;
                const ry = (i * 107) % h;
                this.ctx.beginPath();
                this.ctx.arc(rx, ry, (i % 4) + 3, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Big Birthday Cake Vector Centerpiece
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(w / 2, h / 2 + 10, 160, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.lineWidth = 6;
            this.ctx.strokeStyle = '#000000';
            this.ctx.stroke();

            // Big Number "22"
            this.ctx.font = '900 110px "Bungee", Impact, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#e11d48';
            this.ctx.fillText('22', w / 2, h / 2 - 15);
            this.ctx.lineWidth = 6;
            this.ctx.strokeStyle = '#000000';
            this.ctx.strokeText('22', w / 2, h / 2 - 15);

            // Sub text inside circle
            this.ctx.font = '700 24px "Fredoka", sans-serif';
            this.ctx.fillStyle = '#b45309';
            this.ctx.fillText('🎂 TUỔI MỚI RỰC RỠ 🎂', w / 2, h / 2 + 65);

        } else if (this.currentTemplate === 'cute_bunny') {
            // Pastel Red / Coral background with Cute Bunny Vector
            this.ctx.fillStyle = '#ffe4e6';
            this.ctx.fillRect(0, 0, w, h);

            // Red border frame
            this.ctx.lineWidth = 14;
            this.ctx.strokeStyle = '#e11d48';
            this.ctx.strokeRect(10, 10, w - 20, h - 20);

            // Vector Bunny Face
            const cx = w / 2;
            const cy = h / 2 + 15;

            // Ears
            this.ctx.fillStyle = '#ffffff';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 5;

            // Left ear
            this.ctx.beginPath();
            this.ctx.ellipse(cx - 50, cy - 130, 26, 75, -0.15, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = '#f43f5e';
            this.ctx.beginPath();
            this.ctx.ellipse(cx - 50, cy - 130, 14, 50, -0.15, 0, Math.PI * 2);
            this.ctx.fill();

            // Right ear
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.ellipse(cx + 50, cy - 130, 26, 75, 0.15, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = '#f43f5e';
            this.ctx.beginPath();
            this.ctx.ellipse(cx + 50, cy - 130, 14, 50, 0.15, 0, Math.PI * 2);
            this.ctx.fill();

            // Head
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 105, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            // Eyes (Cute happy winks)
            this.ctx.lineWidth = 6;
            this.ctx.beginPath();
            this.ctx.arc(cx - 38, cy - 10, 18, Math.PI * 1.1, Math.PI * 1.9);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(cx + 38, cy - 10, 18, Math.PI * 1.1, Math.PI * 1.9);
            this.ctx.stroke();

            // Blush
            this.ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(cx - 55, cy + 20, 18, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(cx + 55, cy + 20, 18, 0, Math.PI * 2);
            this.ctx.fill();

            // Nose
            this.ctx.fillStyle = '#e11d48';
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy + 15, 10, 7, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Mouth
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(cx - 10, cy + 30, 12, 0, Math.PI * 0.85);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(cx + 10, cy + 30, 12, Math.PI * 0.15, Math.PI);
            this.ctx.stroke();

        } else if (this.currentTemplate === 'red_envelope') {
            // Red Lucky Envelope / Bao Lì Xì Meme
            this.ctx.fillStyle = '#dc2626';
            this.ctx.fillRect(0, 0, w, h);

            // Gold decorative frame
            this.ctx.strokeStyle = '#fde047';
            this.ctx.lineWidth = 8;
            this.ctx.strokeRect(30, 30, w - 60, h - 60);

            // Central Gold Seal
            this.ctx.fillStyle = '#fde047';
            this.ctx.beginPath();
            this.ctx.arc(w / 2, h / 2, 110, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.font = '900 80px "Bungee", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#dc2626';
            this.ctx.fillText('QUÀ', w / 2, h / 2);
        }
    }

    render() {
        if (!this.canvas || !this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw vector background template
        this.drawTemplateBackground();

        // Draw stickers
        this.stickers.forEach(s => {
            this.ctx.font = `${s.size}px sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(s.emoji, s.x, s.y);
        });

        const maxWidth = this.canvas.width * 0.92;

        // Draw Top Text
        if (this.topText.trim()) {
            this.ctx.font = `900 ${this.fontSize}px ${this.fontFamily}`;
            const topLines = this.wrapText(this.topText, maxWidth);
            this.drawTextWithOutline(topLines, 20, true);
        }

        // Draw Bottom Text
        if (this.bottomText.trim()) {
            this.ctx.font = `900 ${this.fontSize}px ${this.fontFamily}`;
            const bottomLines = this.wrapText(this.bottomText, maxWidth);
            this.drawTextWithOutline(bottomLines, this.canvas.height - 20, false);
        }
    }

    download() {
        const link = document.createElement('a');
        link.download = `Meme_Thao_Nhi_22_Tuoi_${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
        if (window.confetti) confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
        if (window.sound) sound.playFanfare();
    }
}

let memeMaker;
document.addEventListener('DOMContentLoaded', () => {
    memeMaker = new MemeMaker();
});
