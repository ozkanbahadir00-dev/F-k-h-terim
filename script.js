/**
 * İslam Hukuku Bilgi Kartları - Interactive Application
 * Fetches cards.json and dynamically renders flashcards with blur toggle
 */

async function loadCards() {
    try {
        const response = await fetch('cards.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cards = await response.json();
        renderCards(cards);
    } catch (error) {
        console.error('Error loading cards:', error);
        const container = document.getElementById('cards-container');
        container.innerHTML = '<p style="color: #e74c3c; text-align: center;">Kartlar yüklenirken hata oluştu.</p>';
    }
}

function renderCards(cards) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    cards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        container.appendChild(cardElement);
    });
}

function createCardElement(card, index = 0) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.id = card.id;
    cardDiv.style.setProperty('--i', Math.min(index, 10));

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header';

    const questionDiv = document.createElement('div');
    questionDiv.className = 'card-question';
    questionDiv.textContent = card.shown;

    const topicSpan = document.createElement('span');
    topicSpan.className = 'card-topic';
    topicSpan.textContent = card.topic;

    headerDiv.appendChild(questionDiv);
    headerDiv.appendChild(topicSpan);

    const answerWrap = document.createElement('div');
    answerWrap.className = 'card-answer-wrap';

    const answerDiv = document.createElement('div');
    answerDiv.className = 'card-answer';
    answerDiv.textContent = card.answer;

    answerWrap.appendChild(answerDiv);

    answerWrap.addEventListener('click', () => {
        const isRevealed = answerWrap.classList.toggle('revealed');
        answerDiv.classList.toggle('revealed', isRevealed);
    });

    cardDiv.appendChild(headerDiv);
    cardDiv.appendChild(answerWrap);

    return cardDiv;
}

document.addEventListener('DOMContentLoaded', loadCards);

/* ── Mouse trail — uhrevi ışık zerrecikleri ── */
(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'trail-canvas';
    Object.assign(canvas.style, {
        position: 'fixed',
        inset: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '9999',
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];

    // Altın ve zümrüt ton paleti
    const COLORS = [
        'rgba(201,168,71,',   // gold
        'rgba(232,208,138,',  // gold-light
        'rgba(255,240,180,',  // warm white-gold
        'rgba(31,107,80,',    // emerald-glow
        'rgba(180,220,200,',  // pale emerald
    ];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let mx = -999, my = -999;
    let moveCount = 0;
    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        // Her 3 harekette bir zerre — seyrek
        moveCount++;
        if (moveCount % 3 === 0) spawnParticle(mx, my);
    });

    function spawnParticle(x, y) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        particles.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            r: Math.random() * 1.2 + 0.3,       // yarıçap: 0.3–1.5 px
            alpha: Math.random() * 0.22 + 0.08,  // çok daha soluk başlangıç
            vx: (Math.random() - 0.5) * 0.3,
            vy: -(Math.random() * 0.5 + 0.1),    // hafifçe yukarı süzülsün
            decay: Math.random() * 0.014 + 0.010,
            color,
        });
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) { particles.splice(i, 1); continue; }

            // Hafif hale efekti
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
            grad.addColorStop(0, p.color + p.alpha + ')');
            grad.addColorStop(1, p.color + '0)');

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Parlak merkez nokta
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.min(p.alpha * 1.8, 1) + ')';
            ctx.fill();
        }

        requestAnimationFrame(tick);
    }
    tick();
})();
