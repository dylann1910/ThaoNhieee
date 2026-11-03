// Main Application Controller for Thảo Nhi's 22nd Birthday Web App (Red Edition)

document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initCake();
    initBunny();
    initSoundboard();
    initBGMToggle();
    initFloatingAmbient();
    initStatsRoast();
});

/* ========================================================
   0. Interactive Dog Meme Gift Intro Overlay
   ======================================================== */
function initIntro() {
    const overlay = document.getElementById('birthday-intro-overlay');
    const giftBoxWrapper = document.getElementById('intro-gift-box-wrapper');
    const dogHoldingBox = document.getElementById('dog-holding-box');
    const dogHoldingFlowers = document.getElementById('dog-holding-flowers');
    const introTitlePrompt = document.getElementById('intro-title-prompt');
    const introCelebrationText = document.getElementById('intro-celebration-text');
    const enterSiteBtn = document.getElementById('enter-site-btn');
    const replayIntroBtn = document.getElementById('replay-intro-btn');

    let isExploded = false;

    const explodeGift = () => {
        if (isExploded) return;
        isExploded = true;

        // Hide gift box with explosion animation
        if (giftBoxWrapper) {
            giftBoxWrapper.classList.add('gift-explode-anim');
        }

        // Play sounds & confetti
        if (window.sound) {
            sound.playHorn();
            setTimeout(() => sound.playFanfare(), 250);
            setTimeout(() => sound.playApplause(), 600);
        }

        if (window.confetti) {
            const rect = overlay.getBoundingClientRect();
            confetti.burst(rect.width / 2, rect.height * 0.45, 90);
            confetti.cannon();
        }

        // Switch Dog from holding box to holding bouquet of flowers
        setTimeout(() => {
            if (dogHoldingBox) dogHoldingBox.classList.add('hidden');
            if (dogHoldingFlowers) dogHoldingFlowers.classList.remove('hidden');

            if (introTitlePrompt) introTitlePrompt.classList.add('hidden');
            if (introCelebrationText) {
                introCelebrationText.classList.remove('hidden');
                introCelebrationText.classList.add('text-pop-celebrate');
            }
        }, 300);
    };

    if (giftBoxWrapper) {
        giftBoxWrapper.addEventListener('click', explodeGift);
        giftBoxWrapper.addEventListener('touchend', (e) => {
            e.preventDefault();
            explodeGift();
        }, { passive: false });
    }

    if (enterSiteBtn) {
        enterSiteBtn.addEventListener('click', () => {
            if (overlay) {
                overlay.classList.add('intro-hidden');
            }
            // Start BGM automatically if possible
            if (window.sound && !sound.isPlayingBGM) {
                const bgmBtn = document.getElementById('bgm-toggle-btn');
                if (bgmBtn) bgmBtn.click();
            }
        });
    }

    // Ability to replay intro anytime
    if (replayIntroBtn) {
        replayIntroBtn.addEventListener('click', () => {
            isExploded = false;
            if (dogHoldingBox) dogHoldingBox.classList.remove('hidden');
            if (dogHoldingFlowers) dogHoldingFlowers.classList.add('hidden');
            if (giftBoxWrapper) giftBoxWrapper.classList.remove('gift-explode-anim');
            if (introTitlePrompt) introTitlePrompt.classList.remove('hidden');
            if (introCelebrationText) introCelebrationText.classList.add('hidden');
            if (overlay) overlay.classList.remove('intro-hidden');
        });
    }
}

/* ========================================================
   1. Interactive 22nd Birthday Cake & Candle Blowing
   ======================================================== */
function initCake() {
    const blowBtn = document.getElementById('blow-candles-btn');
    const flames = document.querySelectorAll('.flame');
    const smokeParticles = document.querySelectorAll('.smoke');
    const cakeMessage = document.getElementById('cake-blown-message');

    let isBlown = false;

    if (blowBtn) {
        blowBtn.addEventListener('click', () => {
            if (isBlown) {
                // Re-light
                flames.forEach(f => f.classList.remove('blown-out'));
                smokeParticles.forEach(s => s.classList.remove('active'));
                if (cakeMessage) cakeMessage.classList.add('hidden');
                blowBtn.innerHTML = '🎂 Bấm Thổi Nến & Cầu Nguyện!';
                isBlown = false;
                if (window.sound) sound.playDing();
                return;
            }

            // Blow out
            isBlown = true;
            flames.forEach(f => f.classList.add('blown-out'));
            smokeParticles.forEach(s => s.classList.add('active'));

            if (cakeMessage) {
                cakeMessage.classList.remove('hidden');
            }

            blowBtn.innerHTML = '✨ Bấm Để Thắp Lại Nến 22!';

            // Sound & FX
            if (window.sound) {
                sound.playHorn();
                setTimeout(() => sound.playFanfare(), 300);
                setTimeout(() => sound.playApplause(), 800);
            }

            if (window.confetti) {
                const rect = blowBtn.getBoundingClientRect();
                confetti.burst(rect.left + rect.width / 2, rect.top, 100);
                confetti.cannon();
            }
        });
    }
}

/* ========================================================
   2. Interactive Rabbit / Bé Thỏ Vỗ Béo (Kawaii Edition)
   ======================================================== */
function initBunny() {
    const bunnyFace = document.getElementById('bunny-svg-wrapper');
    const eyesNormal = document.getElementById('bunny-eyes-normal');
    const eyesHappy = document.getElementById('bunny-eyes-happy');
    const bunnyCounter = document.getElementById('bunny-counter');
    const bunnyTitle = document.getElementById('bunny-rank-title');
    const feedCarrotBtn = document.getElementById('feed-carrot-btn');
    const feedStrawberryBtn = document.getElementById('feed-strawberry-btn');
    const petBunnyBtn = document.getElementById('pet-bunny-btn');

    let eatCount = parseInt(localStorage.getItem('thaoNhiBunnyCount') || '0', 10);

    const updateBunnyUI = () => {
        if (bunnyCounter) bunnyCounter.textContent = eatCount.toLocaleString('vi-VN');
        if (bunnyTitle) {
            if (eatCount < 10) bunnyTitle.textContent = "Thỏ Bé Xíu Đáng Yêu 🐇";
            else if (eatCount < 25) bunnyTitle.textContent = "Thỏ Múp Míp Hạnh Phúc 🐰";
            else if (eatCount < 50) bunnyTitle.textContent = "Thỏ Tròn Ủm Xinh Xắn 🥕";
            else bunnyTitle.textContent = "Chúa Tể Thỏ Đáng Yêu Vô Địch 👑";
        }
    };

    updateBunnyUI();

    const doFeed = (e, icon) => {
        eatCount++;
        localStorage.setItem('thaoNhiBunnyCount', eatCount);
        updateBunnyUI();

        // Bounce animation
        if (bunnyFace) {
            bunnyFace.classList.remove('bunny-bounce');
            void bunnyFace.offsetWidth; // trigger reflow
            bunnyFace.classList.add('bunny-bounce');
        }

        // Happy eyes wink
        if (eyesNormal && eyesHappy) {
            eyesNormal.classList.add('hidden');
            eyesHappy.classList.remove('hidden');
            setTimeout(() => {
                eyesNormal.classList.remove('hidden');
                eyesHappy.classList.add('hidden');
            }, 380);
        }

        // Sound & Floating FX
        if (window.sound) sound.playMunch();
        spawnFloatingEmoji(e, icon);

        if (eatCount % 22 === 0 && window.confetti) {
            confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 60);
            if (window.sound) sound.playFanfare();
        }
    };

    if (feedCarrotBtn) feedCarrotBtn.addEventListener('click', (e) => doFeed(e, '🥕'));
    if (feedStrawberryBtn) feedStrawberryBtn.addEventListener('click', (e) => doFeed(e, '🍓'));
    if (petBunnyBtn) petBunnyBtn.addEventListener('click', (e) => doFeed(e, '💖'));

    if (bunnyFace) {
        bunnyFace.addEventListener('click', (e) => doFeed(e, '✨'));
    }
}

function spawnFloatingEmoji(e, emoji) {
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.textContent = emoji;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (e && e.clientX !== undefined) {
        x = e.clientX;
        y = e.clientY;
    }

    el.style.left = `${x + (Math.random() * 30 - 15)}px`;
    el.style.top = `${y - 10}px`;
    document.body.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 1000);
}

/* ========================================================
   3. Soundboard & BGM Controller
   ======================================================== */
function initSoundboard() {
    const buttons = document.querySelectorAll('.soundboard-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const soundType = btn.getAttribute('data-sound');
            if (!window.sound) return;

            switch (soundType) {
                case 'horn': sound.playHorn(); break;
                case 'fanfare': sound.playFanfare(); break;
                case 'applause': sound.playApplause(); break;
                case 'bruh': sound.playBruh(); break;
                case 'sparkle': sound.playSparkle(); break;
                case 'ding': sound.playDing(); break;
                case 'munch': sound.playMunch(); break;
                default: sound.playDing(); break;
            }

            btn.classList.add('scale-95');
            setTimeout(() => btn.classList.remove('scale-95'), 120);
        });
    });
}

function initBGMToggle() {
    const bgmBtn = document.getElementById('bgm-toggle-btn');
    const bgmStatus = document.getElementById('bgm-status');
    const musicNotes = document.getElementById('bgm-notes');

    if (bgmBtn && window.sound) {
        bgmBtn.addEventListener('click', () => {
            const isPlaying = sound.toggleBGM(() => {
                if (musicNotes) {
                    musicNotes.classList.add('scale-125');
                    setTimeout(() => musicNotes.classList.remove('scale-125'), 100);
                }
            });

            if (isPlaying) {
                bgmBtn.classList.add('bg-red-600', 'text-white');
                bgmBtn.classList.remove('bg-white', 'text-gray-900');
                if (bgmStatus) bgmStatus.textContent = "Nhạc: BẬT 🎵";
                if (musicNotes) musicNotes.classList.remove('hidden');
            } else {
                bgmBtn.classList.remove('bg-red-600', 'text-white');
                bgmBtn.classList.add('bg-white', 'text-gray-900');
                if (bgmStatus) bgmStatus.textContent = "Nhạc: TẮT 🔇";
                if (musicNotes) musicNotes.classList.add('hidden');
            }
        });
    }
}

/* ========================================================
   5. Fun Stats & Roast Sheet (Tuổi 22)
   ======================================================== */
function initStatsRoast() {
    const rerollBtn = document.getElementById('reroll-roast-btn');
    const quoteEl = document.getElementById('daily-roast-quote');

    const quotes = [
        "\"22 tuổi rồi, chúc em luôn giữ nụ cười rạng rỡ và nguồn năng lượng tích cực lan tỏa đến mọi người!\"",
        "\"Thích màu đỏ vì màu đỏ đem lại may mắn, và vì màu đỏ tượng trưng cho tài khoản luôn rực lửa!\"",
        "\"Người ta bảo 22 tuổi phải ra dáng quý cô thanh lịch, còn Thảo Nhi chọn làm chúa tể hề hước đáng yêu!\"",
        "\"Sáng tuyên bố tuổi 22 phải ngủ sớm dậy sớm, tối 2h sáng vẫn miệt mài xem video ngắn.\"",
        "\"Tuổi 22 chỉ ước giản đơn: Ăn hoài không béo, deadline tự biến mất, và ví tiền luôn rực rỡ!\""
    ];

    if (rerollBtn && quoteEl) {
        rerollBtn.addEventListener('click', () => {
            const random = quotes[Math.floor(Math.random() * quotes.length)];
            quoteEl.style.opacity = '0';
            setTimeout(() => {
                quoteEl.textContent = random;
                quoteEl.style.opacity = '1';
            }, 180);
            if (window.sound) sound.playDing();
        });
    }
}

/* ========================================================
   6. Floating Emojis / Background Ambient
   ======================================================== */
function initFloatingAmbient() {
    const container = document.getElementById('floating-elements-bg');
    if (!container) return;

    const emojis = ['🌹', '🎂', '🥕', '🐰', '👑', '🍓', '✨', '🎁', '💖'];
    for (let i = 0; i < 16; i++) {
        const span = document.createElement('span');
        span.className = 'floating-ambient-item';
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = `${Math.random() * 95}vw`;
        span.style.top = `${Math.random() * 95}vh`;
        span.style.animationDuration = `${Math.random() * 8 + 6}s`;
        span.style.animationDelay = `${Math.random() * 5}s`;
        span.style.fontSize = `${Math.random() * 18 + 18}px`;
        container.appendChild(span);
    }
}
