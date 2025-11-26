let players = [];
let currentPlayer = 0;
let score = [0, 0];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCards = [];

const icons = [
    "bi-star-fill", "bi-heart-fill", "bi-lightning-fill", "bi-bell-fill",
    "bi-camera-fill", "bi-moon-stars-fill", "bi-diamond-fill", "bi-brightness-alt-high-fill"
];

// Duplicar para 16 cartas
let cards = [];

function startGame() {
    const p1 = document.getElementById("player1").value.trim();
    const p2 = document.getElementById("player2").value.trim();

    if (!p1 || !p2) {
        alert("Ingresa los dos nombres, compa.");
        return;
    }

    players = [p1, p2];

    document.getElementById("players-setup").classList.add("d-none");
    document.getElementById("scoreboard").classList.remove("d-none");

    document.getElementById("nameP1").innerText = p1;
    document.getElementById("nameP2").innerText = p2;

    updateTurnIndicator();
    initBoard();
}

function updateTurnIndicator() {
    document.getElementById("turnIndicator").innerText =
        `Turno: ${players[currentPlayer]}`;
}

function updateScoreboard() {
    document.getElementById("scoreP1").innerText = score[0];
    document.getElementById("scoreP2").innerText = score[1];
}

function initBoard() {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";

    cards = [...icons, ...icons]
        .map(icon => ({ icon, id: Math.random() }))
        .sort(() => Math.random() - 0.5);

    cards.forEach((card, index) => {
        const col = document.createElement("div");
        col.className = "col-3";

        const tile = document.createElement("div");
        tile.className = "card-tile";
        tile.dataset.index = index;

        const inner = document.createElement("div");
        inner.className = "card-inner";

        tile.appendChild(inner);
        col.appendChild(tile);
        board.appendChild(col);

        tile.addEventListener("click", () => flipCard(tile));
    });
}

function flipCard(tile) {
    if (lockBoard) return;
    if (tile.classList.contains("flipped") || tile.classList.contains("matched")) return;

    tile.classList.add("flipped");

    if (!firstCard) {
        firstCard = getCard(tile);
        return;
    }

    secondCard = getCard(tile);

    lockBoard = true;

    if (firstCard.icon === secondCard.icon) {
        matchedCards = [firstCard.element, secondCard.element];

        showQuestionModal(
            () => { // ✔ Correcta
                score[currentPlayer]++;
                updateScoreboard();

                matchedCards.forEach(c => c.classList.add("matched"));
                resetTurn();
            },
            () => { // ❌ Incorrecta
                matchedCards.forEach(c =>
                    setTimeout(() => c.classList.remove("flipped"), 500)
                );
                resetTurn();
            }
        );
    } else {
        // Falló pareja
        setTimeout(() => {
            firstCard.element.classList.remove("flipped");
            secondCard.element.classList.remove("flipped");
            resetTurn();
        }, 600);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    matchedCards = [];
    lockBoard = false;

    currentPlayer = currentPlayer === 0 ? 1 : 0;
    updateTurnIndicator();
}

function getCard(tile) {
    const index = tile.dataset.index;
    return { icon: cards[index].icon, element: tile };
}

function showQuestionModal(onCorrect, onWrong) {
    document.getElementById("questionText").innerText =
        "Traduce: 'Dog'";

    const modal = new bootstrap.Modal(document.getElementById("questionModal"));
    modal.show();

    document.querySelectorAll(".answer-option").forEach(btn => {
        btn.onclick = function () {
            const correct = this.dataset.correct === "true";
            modal.hide();
            correct ? onCorrect() : onWrong();
        };
    });
}