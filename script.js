// ============================
//  MINI GAME - FAZENDA DO FUTURO
// ============================

// Perguntas e escolhas
const questions = [
  {
    id: 1,
    emoji: "💧",
    text: "Sua fazenda precisa de irrigação. Qual método você escolhe?",
    choices: [
      {
        text: "🌱 Instalo sensores de umidade e irrigação por gotejamento",
        isGreen: true,
        title: "Escolha Sustentável! 🌿",
        result: "Economiza até 60% de água e protege rios da região.",
        impact: "✅ +1 Ponto Verde | Economia de água",
        isPositive: true
      },
      {
        text: "🚿 Uso aspersores 24h por dia sem controle",
        isGreen: false,
        title: "Consequência Negativa! 🏭",
        result: "Desperdício de água e erosão do solo.",
        impact: "⚠️ +1 Ponto Cinza | Solo comprometido",
        isPositive: false
      }
    ]
  },
  {
    id: 2,
    emoji: "🌳",
    text: "Uma área da sua fazenda tem mata nativa. O que você faz?",
    choices: [
      {
        text: "🌿 Preservo a mata como Reserva Legal",
        isGreen: true,
        title: "Decisão Sábia! 🌲",
        result: "Mantém nascentes e polinizadores ativos.",
        impact: "✅ +1 Ponto Verde | Créditos de carbono",
        isPositive: true
      },
      {
        text: "🪓 Derrubo para ampliar a área plantada",
        isGreen: false,
        title: "Dano Ambiental! ⚠️",
        result: "Perda de biodiversidade e multas ambientais.",
        impact: "⚠️ +1 Ponto Cinza | Multa ambiental",
        isPositive: false
      }
    ]
  },
  {
    id: 3,
    emoji: "⚡",
    text: "Sua fazenda consome muita energia elétrica. O que você decide?",
    choices: [
      {
        text: "☀️ Instalo painéis solares e uso biogás",
        isGreen: true,
        title: "Inovação Sustentável! 🌟",
        result: "Energia limpa e economia de até 90%.",
        impact: "✅ +1 Ponto Verde | Energia renovável",
        isPositive: true
      },
      {
        text: "🔥 Queimo restos de colheita e compro energia da rede",
        isGreen: false,
        title: "Impacto Negativo! 💨",
        result: "Emissão de CO₂ e perda de nutrientes do solo.",
        impact: "⚠️ +1 Ponto Cinza | Solo empobrecido",
        isPositive: false
      }
    ]
  }
];

// Variáveis globais
let currentQuestion = 0;
let greenScore = 0;
let grayScore = 0;

// ============================
//  INICIALIZAÇÃO APÓS DOM CARREGADO
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const gameModal = document.getElementById('gameModal');
  if (gameModal) {
    gameModal.addEventListener('click', function(e) {
      if (e.target === this) closeGame();
    });
  }

  // Animação de entrada
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  const animatables = document.querySelectorAll(
    '.menu-card, .benefit-card, .timeline-item, .action-item, .tech-item'
  );

  animatables.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });
});

// ============================
//  MODAL
// ============================
function openGame() {
  document.getElementById('gameModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  resetGame();
  showScreen('screen-intro');
}

function closeGame() {
  document.getElementById('gameModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ============================
//  CONTROLE DE TELAS
// ============================
function showScreen(id) {
  document.querySelectorAll('.game-screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// ============================
//  LÓGICA DO JOGO
// ============================
function resetGame() {
  currentQuestion = 0;
  greenScore = 0;
  grayScore = 0;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  document.getElementById('greenScore').textContent = greenScore;
  document.getElementById('grayScore').textContent = grayScore;
}

function startGame() {
  currentQuestion = 0;
  showQuestion();
}

function showQuestion() {
  if (currentQuestion >= questions.length) {
    showEnd();
    return;
  }

  const q = questions[currentQuestion];
  const pct = (currentQuestion / questions.length) * 100;

  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('questionNum').textContent = `Situação ${currentQuestion + 1} de ${questions.length}`;
  document.getElementById('questionEmoji').textContent = q.emoji;
  document.getElementById('questionText').textContent = q.text;

  const area = document.getElementById('choicesArea');
  area.innerHTML = '';

  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.onclick = () => selectChoice(choice);
    area.appendChild(btn);
  });

  showScreen('screen-question');
}

function selectChoice(choice) {
  if (choice.isGreen) {
    greenScore++;
  } else {
    grayScore++;
  }
  updateScoreDisplay();

  document.getElementById('resultEmoji').textContent = choice.isGreen ? '🌿' : '⚠️';
  document.getElementById('resultTitle').textContent = choice.title;
  document.getElementById('resultText').textContent = choice.result;

  const impactEl = document.getElementById('resultImpact');
  impactEl.textContent = choice.impact;
  impactEl.className = 'result-impact ' + (choice.isPositive ? 'positive' : 'negative');

  showScreen('screen-result');
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showEnd();
  } else {
    showQuestion();
  }
}

function showEnd() {
  document.getElementById('progressBar').style.width = '100%';
  document.getElementById('finalGreen').textContent = greenScore;
  document.getElementById('finalGray').textContent = grayScore;

  let emoji, title, message;

  if (greenScore === 3) {
    emoji = '🌾🏆🌿';
    title = 'Agricultor Sustentável!';
    message = 'Parabéns! Você fez todas as escolhas certas!';
  } else if (greenScore === 2) {
    emoji = '🌱👍';
    title = 'No Caminho Certo!';
    message = 'Muito bom! Pequenos ajustes ainda podem melhorar.';
  } else if (greenScore === 1) {
    emoji = '🌻⚠️';
    title = 'Ainda Pode Melhorar!';
    message = 'Você tem boas intenções, mas precisa aprender mais.';
  } else {
    emoji = '🏭😟';
    title = 'Hora de Rever os Conceitos!';
    message = 'Suas escolhas causaram impacto negativo. Tente novamente!';
  }

  document.getElementById('endEmoji').textContent = emoji;
  document.getElementById('endTitle').textContent = title;
  document.getElementById('endText').textContent = `Você fez ${greenScore} de 3 escolhas sustentáveis.`;
  document.getElementById('endMessage').textContent = message;

  showScreen('screen-end');
}

function restartGame() {
  resetGame();
  showScreen('screen-intro');
}

// ============================
//  SCROLL SUAVE
// ============================
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
