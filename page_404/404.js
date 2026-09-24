// SPDX-FileCopyrightText: 2026 Аполлинария Аверченко
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const gameOver = document.getElementById("game_over");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");
let score = 0;
let highScore = 0; 
let isGameRunning = false;
let scoreInterval;
let isAlive;
let currentUser = null;

// РџСЂРѕРІРµСЂРєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    console.log('РўРµРєСѓС‰РёР№ РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ:', user ? JSON.parse(user) : null);
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

// Р—Р°РіСЂСѓР·РєР° Р»СѓС‡С€РµРіРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р° РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
function loadHighScore() {
    if (!currentUser) return;
    fetch(`http://localhost:3000/users?userName=${currentUser.userName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РґР°РЅРЅС‹Рµ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ');
            }
            return response.json();
        })
        .then(users => {
            if (users.length > 0) {
                highScore = parseInt(users[0].bestScore) || 0;
                updateScoreDisplay();
            }
        })
        .catch(error => {
            console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё Р»СѓС‡С€РµРіРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р°:', error);
        });
}

// РћР±РЅРѕРІР»РµРЅРёРµ Р»СѓС‡С€РµРіРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р° РІ db.json
function updateHighScore() {
    if (!currentUser || score <= highScore) return;
    fetch(`http://localhost:3000/users?userName=${currentUser.userName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('РќРµ СѓРґР°Р»РѕСЃСЊ РЅР°Р№С‚Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ');
            }
            return response.json();
        })
        .then(users => {
            if (users.length > 0) {
                const user = users[0];
                return fetch(`http://localhost:3000/users/${user.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ bestScore: score.toString() })
                });
            }
            throw new Error('РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ РЅР°Р№РґРµРЅ');
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('РќРµ СѓРґР°Р»РѕСЃСЊ РѕР±РЅРѕРІРёС‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚');
            }
            highScore = score;
            updateScoreDisplay();
        })
        .catch(error => {
            console.error('РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ Р»СѓС‡С€РµРіРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р°:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // РџСЂРѕРІРµСЂРєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё
    if (checkAuth()) {
        loadHighScore();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && isGameRunning) {
        jump();
    }
});

function jump() {
    if (!dino.classList.contains("jump")) {
        dino.classList.add("jump");
        setTimeout(function() {
            dino.classList.remove("jump");
        }, 300);
    }
}

function startGame() {
    isGameRunning = true;
    score = 0;
    updateScoreDisplay();
    cactus.style.animation = "CactusMove 1.5s infinite linear";
    gameOver.style.display = "none";
    restartButton.style.display = "none";
    startScore();
    isAlive = setInterval(checkCollision, 10);
}

function checkCollision() {
    if (!isGameRunning) return;
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));
    if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
        endGame();
    }
}

function startScore() {
    scoreInterval = setInterval(updateScore, 100);
}

function updateScore() {
    if (!isGameRunning) return;
    score++;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const formattedScore = score.toString().padStart(6, '0');
    const formattedHighScore = highScore.toString().padStart(6, '0');
    scoreDisplay.textContent = `Score: ${formattedScore} | Best: ${formattedHighScore}`;
}

function endGame() {
    isGameRunning = false;
    clearInterval(isAlive);
    clearInterval(scoreInterval);
    cactus.style.animation = "none";
    gameOver.style.display = "block";
    restartButton.style.display = "block";

    if (score > highScore) {
        updateHighScore();
    }
}

function restartGame() {
    startGame();
}

startGame();
