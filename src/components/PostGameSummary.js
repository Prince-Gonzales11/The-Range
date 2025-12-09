export class PostGameSummary {
  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'postgame-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.style.display = 'none';

    this.overlay.innerHTML = `
      <div class="pg-container">
        <header class="pg-header">
          <h1 id="pg-title">Training Complete!</h1>
          <p id="pg-subtitle" class="pg-sub">Difficulty: Beginner</p>
        </header>

        <main class="pg-grid" aria-label="Post game summary">
          <section class="pg-card pg-summary" aria-labelledby="pg-summary-title">
            <h2 id="pg-summary-title" class="pg-card-title">Session Summary</h2>
            <div class="pg-score" id="pg-score">0</div>
            <div class="pg-score-label">Final Score</div>

            <div class="pg-stats">
              <div class="pg-stat">
                <div class="pg-stat-value pg-green" id="pg-accuracy">0%</div>
                <div class="pg-stat-label">Accuracy</div>
              </div>
              <div class="pg-stat">
                <div class="pg-stat-value pg-orange" id="pg-hits">0</div>
                <div class="pg-stat-label">Hits</div>
              </div>
              <div class="pg-stat">
                <div class="pg-stat-value pg-red" id="pg-misses">0</div>
                <div class="pg-stat-label">Misses</div>
              </div>
              <div class="pg-stat">
                <div class="pg-stat-value pg-purple" id="pg-total">0</div>
                <div class="pg-stat-label">Total Shots</div>
              </div>
            </div>

            <div class="pg-achievements" id="pg-achievements" aria-live="polite"></div>

            <div class="pg-actions">
              <button class="pg-btn pg-primary" id="pg-replay">Play Again</button>
              <button class="pg-btn pg-secondary" id="pg-back">Back to Hub</button>
            </div>
          </section>
        </main>
      </div>
    `;

    document.body.appendChild(this.overlay);
    this._bind();
  }

  _bind() {
    this.overlay.querySelector('#pg-replay')?.addEventListener('click', () => {
      this.hide();
      document.dispatchEvent(new CustomEvent('postgame:action', { detail: { action: 'replay' } }));
    });
    this.overlay.querySelector('#pg-back')?.addEventListener('click', () => {
      this.hide();
      document.dispatchEvent(new CustomEvent('postgame:action', { detail: { action: 'back' } }));
    });
    // leaderboard removed
  }

  show(stats) {
    const title = this.overlay.querySelector('#pg-title');
    const sub = this.overlay.querySelector('#pg-subtitle');
    const scoreEl = this.overlay.querySelector('#pg-score');
    const accEl = this.overlay.querySelector('#pg-accuracy');
    const hitsEl = this.overlay.querySelector('#pg-hits');
    const missEl = this.overlay.querySelector('#pg-misses');
    const totalEl = this.overlay.querySelector('#pg-total');
    const achEl = this.overlay.querySelector('#pg-achievements');

    title.textContent = stats.reason === 'timer' ? 'Training Complete!' : 'Game Over!';
    sub.textContent = `Difficulty: ${stats.difficultyName || stats.difficulty}`;
    scoreEl.textContent = String(stats.score || 0);
    accEl.textContent = `${Math.round(stats.accuracy || 0)}%`;
    hitsEl.textContent = String(stats.hits || 0);
    missEl.textContent = String(stats.misses || 0);
    totalEl.textContent = String(stats.totalShots || 0);

    const ach = Array.isArray(stats.achievements) ? stats.achievements : [];
    achEl.innerHTML = ach.length
      ? `<ul class="pg-badges">${ach.map(a => `<li class="pg-badge">${a}</li>`).join('')}</ul>`
      : '';

    this.overlay.style.display = 'block';
    requestAnimationFrame(() => {
      this.overlay.classList.add('pg-open');
      this.overlay.querySelector('#pg-replay')?.focus();
    });
  }

  hide() {
    this.overlay.classList.remove('pg-open');
    this.overlay.style.display = 'none';
  }

  
}

