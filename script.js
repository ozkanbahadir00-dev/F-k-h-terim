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

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        container.appendChild(cardElement);
    });
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.id = card.id;

    const topicSpan = document.createElement('span');
    topicSpan.className = 'card-topic';
    topicSpan.textContent = card.topic;

    const questionDiv = document.createElement('div');
    questionDiv.className = 'card-question';
    questionDiv.textContent = card.shown;

    const answerDiv = document.createElement('div');
    answerDiv.className = 'card-answer';
    answerDiv.textContent = card.answer;

    answerDiv.addEventListener('click', () => {
        answerDiv.classList.toggle('revealed');
    });

    cardDiv.appendChild(topicSpan);
    cardDiv.appendChild(questionDiv);
    cardDiv.appendChild(answerDiv);

    return cardDiv;
}

document.addEventListener('DOMContentLoaded', loadCards);
