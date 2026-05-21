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
