/* ============================================================
   SPECIAL GIFT FOR MAHA — script.js
   All interactive behavior for the site lives here.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     SCREEN ORDER + NAVIGATION
     ---------------------------------------------------------- */
  const screenOrder = [
    'screen-lock',
    'screen-welcome',
    'screen-story',
    'screen-gallery',
    'screen-quiz',
    'screen-letter',
    'screen-final'
  ];

  const screens = {};
  screenOrder.forEach(id => { screens[id] = document.getElementById(id); });

  const dotsContainer = document.getElementById('progress-dots');
  // build progress dots (skip the lock screen — it isn't "part of the journey")
  const dotScreens = screenOrder.slice(1);
  dotScreens.forEach(id => {
    const d = document.createElement('span');
    d.className = 'dot';
    d.dataset.screen = id;
    dotsContainer.appendChild(d);
  });
  dotsContainer.classList.add('hidden');

  function updateDots(activeId){
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach(d => d.classList.toggle('active', d.dataset.screen === activeId));
  }

  function goToScreen(id){
    if(!screens[id]) return;
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    if(id === 'screen-lock'){
      dotsContainer.classList.add('hidden');
    } else {
      dotsContainer.classList.remove('hidden');
      updateDots(id);
    }

    // trigger scroll-reveal checks for the newly active screen
    setTimeout(checkReveals, 50);

    if(id === 'screen-final'){
      resizeConfetti();
    }
  }

  // wire up every "next" button
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => goToScreen(btn.dataset.next));
  });

  /* ----------------------------------------------------------
     LOCK SCREEN — "When did our friendship begin?"
     ---------------------------------------------------------- */
  const yearButtons = document.querySelectorAll('.year-btn');
  const lockFeedback = document.getElementById('lock-feedback');
  const unlockLoader = document.getElementById('unlock-loader');
  const CORRECT_YEAR = '2024';

  yearButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.disabled) return;

      if(btn.dataset.year === CORRECT_YEAR){
        yearButtons.forEach(b => b.disabled = true);
        btn.classList.add('correct');
        lockFeedback.textContent = '';
        unlockLoader.classList.add('show');

        setTimeout(() => {
          goToScreen('screen-welcome');
        }, 2600);
      } else {
        btn.classList.add('wrong');
        lockFeedback.textContent = 'Wrong answer 😭 Try again, bestie!';
        setTimeout(() => btn.classList.remove('wrong'), 450);
      }
    });
  });

  /* ----------------------------------------------------------
     MUSIC PLAY / PAUSE
     Note: if no music file has been added to assets/music.mp3,
     play() will simply fail silently — the button still toggles.
     ---------------------------------------------------------- */
  const music = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  let musicPlaying = false;

  musicBtn.addEventListener('click', () => {
    if(!musicPlaying){
      music.play().catch(() => { /* no music file yet — ignore */ });
      musicPlaying = true;
      musicBtn.classList.add('playing');
    } else {
      music.pause();
      musicPlaying = false;
      musicBtn.classList.remove('playing');
    }
  });

  /* ----------------------------------------------------------
     SCROLL REVEALS (timeline nodes + gallery cards)
     ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.thread-node, .gallery-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealTargets.forEach(el => revealObserver.observe(el));

  function checkReveals(){
    // manually flag anything already in view when a screen becomes active
    revealTargets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.9 && rect.bottom > 0){
        el.classList.add('in-view');
      }
    });
  }

  /* ----------------------------------------------------------
     QUIZ — single-select button groups
     ---------------------------------------------------------- */
  document.querySelectorAll('.quiz-options').forEach(group => {
    const options = group.querySelectorAll('.quiz-btn');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  });

  /* ----------------------------------------------------------
     FINAL SURPRISE — typewriter reveal + confetti
     ---------------------------------------------------------- */
  const finalPrompt = document.getElementById('final-prompt');
  const finalMessage = document.getElementById('final-message');
  const finalRevealBtn = document.getElementById('final-reveal-btn');

  finalRevealBtn.addEventListener('click', () => {
    finalPrompt.style.display = 'none';
    finalMessage.classList.remove('hidden');
    typewriterSequence();
    launchConfetti();
  });

  function typewriterSequence(){
    const lines = finalMessage.querySelectorAll('.typewriter, .typewriter-heading');
    let delay = 0;

    lines.forEach((el) => {
      const text = el.dataset.text || '';
      el.textContent = '';
      el.style.borderRightColor = 'var(--pink-soft)';

      setTimeout(() => {
        typeInto(el, text, () => {
          el.style.borderRightColor = 'transparent';
        });
      }, delay);

      // roughly 35ms per character, plus a pause between lines
      delay += text.length * 35 + 500;
    });
  }

  function typeInto(el, text, onDone){
    let i = 0;
    const speed = 35;
    const interval = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if(i >= text.length){
        clearInterval(interval);
        if(onDone) onDone();
      }
    }, speed);
  }

  /* ----------------------------------------------------------
     AMBIENT: floating hearts
     ---------------------------------------------------------- */
  const heartsContainer = document.getElementById('floating-hearts');
  const heartSymbols = ['🤍','💗','✨'];

  function spawnHeart(){
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    const left = Math.random() * 100;
    const size = 12 + Math.random() * 16;
    const duration = 9 + Math.random() * 8;
    const drift = (Math.random() * 80 - 40) + 'px';

    heart.style.left = left + 'vw';
    heart.style.fontSize = size + 'px';
    heart.style.setProperty('--drift', drift);
    heart.style.animationDuration = duration + 's';

    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  setInterval(spawnHeart, 900);
  for(let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 300);

  /* ----------------------------------------------------------
     AMBIENT: sparkle canvas (subtle twinkling dots throughout)
     ---------------------------------------------------------- */
  const sparkleCanvas = document.getElementById('sparkle-canvas');
  const sCtx = sparkleCanvas.getContext('2d');
  let sparkles = [];

  function resizeSparkleCanvas(){
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
  }
  resizeSparkleCanvas();
  window.addEventListener('resize', resizeSparkleCanvas);

  function initSparkles(){
    sparkles = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 22000);
    for(let i = 0; i < count; i++){
      sparkles.push({
        x: Math.random() * sparkleCanvas.width,
        y: Math.random() * sparkleCanvas.height,
        r: Math.random() * 1.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02
      });
    }
  }
  initSparkles();
  window.addEventListener('resize', initSparkles);

  function drawSparkles(){
    sCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    sparkles.forEach(s => {
      s.phase += s.speed;
      const alpha = (Math.sin(s.phase) + 1) / 2 * 0.6 + 0.1;
      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sCtx.fillStyle = `rgba(255, 214, 232, ${alpha})`;
      sCtx.fill();
    });
    requestAnimationFrame(drawSparkles);
  }
  requestAnimationFrame(drawSparkles);

  /* ----------------------------------------------------------
     CONFETTI (final screen only)
     ---------------------------------------------------------- */
  const confettiCanvas = document.getElementById('confetti-canvas');
  const cCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  let confettiRunning = false;

  function resizeConfetti(){
    const rect = screens['screen-final'].getBoundingClientRect();
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.resizeConfetti = resizeConfetti;
  window.addEventListener('resize', resizeConfetti);

  const confettiColors = ['#ff7bab', '#ffd6e8', '#d94f86', '#ffffff'];

  function launchConfetti(){
    resizeConfetti();
    confettiPieces = [];
    const count = 90;
    for(let i = 0; i < count; i++){
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.5,
        w: 6 + Math.random() * 6,
        h: 10 + Math.random() * 8,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        speedY: 2 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 2,
        opacity: 1
      });
    }
    if(!confettiRunning){
      confettiRunning = true;
      requestAnimationFrame(runConfetti);
    }
    // stop spawning influence after a while by letting pieces fall off-screen
  }

  function runConfetti(){
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let stillActive = false;

    confettiPieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rot += p.rotSpeed;

      if(p.y < confettiCanvas.height + 30){
        stillActive = true;
      }

      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rot * Math.PI) / 180);
      cCtx.fillStyle = p.color;
      cCtx.globalAlpha = p.opacity;
      cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cCtx.restore();
    });

    if(stillActive){
      requestAnimationFrame(runConfetti);
    } else {
      confettiRunning = false;
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  /* ----------------------------------------------------------
     INIT
     ---------------------------------------------------------- */
  goToScreen('screen-lock');
});
