(function () {
  'use strict';

  /* ===== SCENE DATA ===== */
  var GOMBALANS = [
    'Kamu tahu kenapa mawar iri padamu? Karena kecantikanmu tak bisa ditiru bunga manapun.',
    'Seperti sakura yang mekar di musim semi, kehadiranmu membuat hidupku penuh warna.',
    'Kamu adalah matahariku ke mana pun kamu pergi, hatiku selalu mengikuti.'
  ];

  var SCENES = [
    {
      id: 'opening', lines: [
        { text: 'Di hari istimewa ini...', speed: 65, pause: 900 },
        { text: 'Seseorang yang sangat berarti', speed: 55, pause: 700 },
        { text: 'sedang bertambah usia...', speed: 55, pause: 1500 }
      ], interact: { type: 'input', id: 'opening', key: 'playerName' },
      transition: { type: 'portal', text: '✨ Memasuki gerbang kerajaan...', dur: 3200 }
    },

    {
      id: 'kingdom', lines: [
        { text: '👑 Kerajaan', speed: 80, pause: 900, cls: 'title gold' },
        { text: '', pause: 400 },
        { text: 'Selamat datang, {playerName}...', speed: 50, pause: 800 },
        { text: 'Seperti seorang ratu dalam hidupku...', speed: 48, pause: 700 },
        { text: 'Kamu membawa cahaya di setiap langkahku.', speed: 48, pause: 700 },
        { text: '', pause: 300 },
        { text: 'Setiap senyummu adalah mahkota', speed: 42, pause: 400, cls: 'small' },
        { text: 'yang menghiasi hari-hariku.', speed: 42, pause: 1800, cls: 'small' }
      ], transition: { type: 'ride', text: '🏇 Menunggang kuda melewati padang emas...', dur: 3500 }
    },

    {
      id: 'forest', lines: [
        { text: '🌿 Hutan Ajaib', speed: 80, pause: 900, cls: 'title green' },
        { text: '', pause: 400 },
        { text: 'Di setiap langkah dalam gelap...', speed: 50, pause: 700 },
        { text: 'Kamu adalah arah dan harapan.', speed: 48, pause: 800 },
        { text: '', pause: 300 },
        { text: 'Ketika dunia terasa sunyi,', speed: 42, pause: 400, cls: 'small' },
        { text: 'kamu menjadi cahaya yang membimbingku pulang.', speed: 42, pause: 1200, cls: 'small' }
      ], interact: { type: 'choice', id: 'forest', key: 'chosenGombalan' },
      transition: { type: 'sink', text: '🌊 Menyelam ke kedalaman lautan...', dur: 3800 }
    },

    {
      id: 'ocean', lines: [
        { text: '🌊 Lautan', speed: 80, pause: 900, cls: 'title blue' },
        { text: '', pause: 400 },
        { text: 'Sedalam lautan...', speed: 55, pause: 700 },
        { text: 'Perasaanku untukmu tak pernah bertepi.', speed: 48, pause: 800 },
        { text: '', pause: 300 },
        { text: 'Seperti ombak yang selalu kembali ke pantai,', speed: 42, pause: 400, cls: 'small' },
        { text: 'hatiku akan selalu menemukan jalannya kepadamu.', speed: 42, pause: 800, cls: 'small' },
        { text: '', pause: 500 },
        { text: '💐 "{chosenGombalan}"', speed: 35, pause: 2500, cls: 'gombalan' }
      ], transition: { type: 'fly', text: '☁️ Terbang menuju angkasa...', dur: 3500 }
    },

    {
      id: 'sky', lines: [
        { text: '☁️ Angkasa', speed: 80, pause: 900, cls: 'title sky' },
        { text: '', pause: 400 },
        { text: 'Dan setinggi langit...', speed: 55, pause: 700 },
        { text: 'Harapanku bersamamu tak terbatas.', speed: 48, pause: 800 },
        { text: '', pause: 300 },
        { text: 'Bersama, kita bisa meraih bintang-bintang', speed: 42, pause: 400, cls: 'small' },
        { text: 'dan menenun mimpi di antara awan-awan.', speed: 42, pause: 1800, cls: 'small' }
      ], transition: { type: 'flash', text: '', dur: 2500 }
    },

    {
      id: 'final', lines: [
        { text: '25', speed: 0, pause: 1500, cls: 'badge' },
        { text: 'Selamat Ulang Tahun yang ke-25', speed: 50, pause: 900, cls: 'title-final' },
        { text: 'Annisa Hanif ❤️', speed: 65, pause: 1200, cls: 'name' },
        { text: '', pause: 500 },
        { text: 'Terima kasih sudah hadir dalam hidupku...', speed: 42, pause: 800 },
        { text: 'Kamu adalah hadiah terindah dari semesta.', speed: 42, pause: 800 },
        { text: '', pause: 400 },
        { text: 'Aku mencintaimu, hari ini, esok, dan seterusnya...', speed: 45, pause: 2000, cls: 'bold-msg' }
      ], interact: { type: 'input', id: 'final', key: 'wish' },
      transition: null
    },

    {
      id: 'closing', lines: [
        { text: 'Harapanmu di usia yang baru ini:', speed: 45, pause: 800, cls: 'small' },
        { text: '"{wish}"', speed: 35, pause: 1800, cls: 'wish-display' },
        { text: '', pause: 600 },
        { text: '"Setiap detik bersamamu', speed: 48, pause: 400, cls: 'quote' },
        { text: 'adalah petualangan', speed: 48, pause: 400, cls: 'quote' },
        { text: 'yang tak ingin kulewatkan."', speed: 48, pause: 2000, cls: 'quote' }
      ], transition: null
    }
  ];

  /* ===== STATE ===== */
  var vars = {};
  var musicPlaying = false;
  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* ===== DOM ===== */
  var gate = document.getElementById('gate');
  var enterBtn = document.getElementById('enter-btn');
  var musicToggle = document.getElementById('music-toggle');
  var bgMusic = document.getElementById('bg-music');
  var replayBtn = document.getElementById('replay-btn');
  var transOverlay = document.getElementById('transition-overlay');
  var transText = document.getElementById('transition-text');
  var transFigure = document.getElementById('transition-figure');
  var transCanvas = document.getElementById('transition-canvas');

  /* ===== GATE ===== */
  // Gate stars
  var gCtx, gStars = [];
  (function initGateStars() {
    var c = document.getElementById('gate-canvas');
    if (!c) return;
    gCtx = c.getContext('2d');
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    for (var i = 0; i < 150; i++)gStars.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.5 + .5, a: Math.random(), s: Math.random() * .005 + .002 });
    function draw() {
      gCtx.clearRect(0, 0, c.width, c.height);
      gStars.forEach(function (s) {
        s.a += s.s; if (s.a > 1) s.s = -Math.abs(s.s); if (s.a < 0) s.s = Math.abs(s.s);
        gCtx.beginPath(); gCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2); gCtx.fillStyle = 'rgba(255,248,231,' + s.a + ')'; gCtx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();

  enterBtn.addEventListener('click', function () {
    gate.classList.add('hidden');
    musicToggle.classList.add('visible');
    tryPlayMusic();
    setTimeout(function () { startJourney(); }, 1000);
  });

  /* ===== MUSIC ===== */
  function tryPlayMusic() {
    bgMusic.volume = 0.5;
    bgMusic.play().then(function () { musicPlaying = true; musicToggle.classList.add('playing'); musicToggle.textContent = '♫'; })
      .catch(function () { musicPlaying = false; musicToggle.textContent = '♪'; });
  }
  musicToggle.addEventListener('click', function () {
    if (musicPlaying) { bgMusic.pause(); musicPlaying = false; musicToggle.classList.remove('playing'); musicToggle.textContent = '♪'; }
    else { bgMusic.play().then(function () { musicPlaying = true; musicToggle.classList.add('playing'); musicToggle.textContent = '♫'; }).catch(function () { }); }
  });

  /* ===== SCENE ENGINE ===== */
  function startJourney() {
    vars = {};
    document.querySelectorAll('.text-box').forEach(function (t) { t.innerHTML = ''; });
    document.querySelectorAll('.interact-box').forEach(function (b) { b.classList.add('hidden'); b.classList.remove('show', 'fade-out'); });
    document.getElementById('closing-actions').classList.add('hidden');
    document.getElementById('closing-actions').classList.remove('show');
    initDecorations();
    playScene(0);
  }

  function activateScene(id) {
    document.querySelectorAll('.scene').forEach(function (s) { s.classList.remove('active'); });
    document.getElementById('scene-' + id).classList.add('active');
    if (id === 'opening') {
      startStarsCanvas();
      createOpeningDecor();
    }
    if (id === 'ocean') startOceanCanvas();
    if (id === 'forest') createForestDecor();
  }

  function interp(text) { return text.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] || m; }); }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function playScene(idx) {
    if (idx >= SCENES.length) return;
    var scene = SCENES[idx];
    activateScene(scene.id);
    await wait(900);

    // Type lines
    var textBox = document.getElementById('text-' + scene.id);
    textBox.style.transition = 'none';
    textBox.style.opacity = '1';
    textBox.innerHTML = '';

    for (var i = 0; i < scene.lines.length; i++) {
      var line = scene.lines[i];
      var txt = interp(line.text);

      // Badge special
      if (line.cls === 'badge') {
        var badge = document.createElement('div');
        badge.className = 'final-badge'; badge.innerHTML = '<span>' + txt + '</span>';
        textBox.appendChild(badge);
        await wait(line.pause || 1000); continue;
      }

      var el = document.createElement('p');
      el.className = 'typed-line';
      if (line.cls) line.cls.split(' ').forEach(function (c) { el.classList.add(c); });
      textBox.appendChild(el);

      if (txt === '') { await wait(line.pause || 300); continue; }

      // Typing
      var cursor = document.createElement('span'); cursor.className = 'cursor'; cursor.textContent = '|';
      el.appendChild(cursor);

      var chars = Array.from(txt);
      for (var j = 0; j < chars.length; j++) {
        el.insertBefore(document.createTextNode(chars[j]), cursor);
        await wait(line.speed || 50);
      }
      await wait(300);
      cursor.remove();
      await wait(line.pause || 500);
    }

    // Interaction
    if (scene.interact) {
      await handleInteraction(scene.interact);
    }

    // Transition to next
    if (scene.transition && idx + 1 < SCENES.length) {
      var tBox = document.getElementById('text-' + scene.id);
      tBox.style.transition = 'opacity 0.4s ease';
      tBox.style.opacity = '0';
      await wait(300);
      await playTransition(scene.transition, idx + 1);
      playScene(idx + 1);
    } else if (!scene.transition && idx + 1 < SCENES.length) {
      // No transition → just go next
      var tBox = document.getElementById('text-' + scene.id);
      tBox.style.transition = 'opacity 0.4s ease';
      tBox.style.opacity = '0';
      await wait(400);
      playScene(idx + 1);
    } else {
      // End
      var ca = document.getElementById('closing-actions');
      ca.classList.remove('hidden');
      setTimeout(function () { ca.classList.add('show'); }, 100);
    }
  }

  /* ===== INTERACTIONS ===== */
  async function handleInteraction(interact) {
    var box = document.getElementById('interact-' + interact.id);
    box.classList.remove('hidden');
    setTimeout(function () { box.classList.add('show'); }, 50);

    if (interact.type === 'input') {
      // Type the label
      var label = box.querySelector('.interact-label');
      if (interact.id === 'opening') {
        // Set label
        label.textContent = '';
        return new Promise(function (resolve) {
          var btn = box.querySelector('.interact-btn');
          btn.onclick = function () {
            vars[interact.key] = "Annisa Hanif";
            box.classList.add('fade-out');
            setTimeout(function () { box.classList.add('hidden'); box.classList.remove('show', 'fade-out'); resolve(); }, 600);
          };
        });
      }

      return new Promise(function (resolve) {
        var btn = box.querySelector('.interact-btn');
        var inp = box.querySelector('.interact-input, .interact-textarea');
        if (inp) inp.focus();

        function submit() {
          var v = (inp ? inp.value : '').trim();
          if (!v) return;
          vars[interact.key] = v;
          box.classList.add('fade-out');
          setTimeout(function () { box.classList.add('hidden'); box.classList.remove('show', 'fade-out'); resolve(); }, 600);
        }
        btn.onclick = submit;
        if (inp) inp.onkeydown = function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } };
      });

    } else if (interact.type === 'choice') {
      return new Promise(function (resolve) {
        var btns = box.querySelectorAll('.flower-btn');
        btns.forEach(function (btn) {
          btn.onclick = function () {
            var idx = parseInt(btn.dataset.idx);
            vars[interact.key] = GOMBALANS[idx];

            // Visual feedback
            btns.forEach(function (b, i) { if (i !== idx) b.classList.add('dimmed'); });
            btn.classList.add('selected');

            // Show gombalan
            var gEl = document.getElementById('gombalan-text');
            gEl.textContent = '"' + GOMBALANS[idx] + '"';
            gEl.classList.remove('hidden');
            setTimeout(function () { gEl.classList.add('show'); }, 50);

            setTimeout(function () {
              box.classList.add('fade-out');
              setTimeout(function () { box.classList.add('hidden'); box.classList.remove('show', 'fade-out'); resolve(); }, 600);
            }, 3000);
          };
        });
      });
    }
  }

  async function typeIntoElement(el, text, speed) {
    el.textContent = '';
    var chars = Array.from(text);
    for (var i = 0; i < chars.length; i++) {
      el.textContent += chars[i];
      await wait(speed || 50);
    }
  }

  /* ===== TRANSITIONS ===== */
  async function playTransition(trans, nextIdx) {
    transText.textContent = trans.text;
    transFigure.textContent = '';
    transFigure.style.cssText = '';

    // Clear previous transition elements
    transOverlay.querySelectorAll('.sink-bubble,.wind-line').forEach(function (e) { e.remove(); });

    // Set type class
    transOverlay.className = 'transition-overlay active ' + trans.type;

    // Type-specific elements
    if (trans.type === 'ride') {
      transFigure.textContent = '🏇';
    }
    if (trans.type === 'sink') {
      for (var i = 0; i < 20; i++) {
        var b = document.createElement('div'); b.className = 'sink-bubble';
        b.style.left = Math.random() * 100 + '%'; b.style.bottom = '-20px';
        b.style.width = b.style.height = (8 + Math.random() * 15) + 'px';
        b.style.animationDuration = (2 + Math.random() * 3) + 's';
        b.style.animationDelay = Math.random() * 2 + 's';
        transOverlay.appendChild(b);
      }
    }
    if (trans.type === 'fly') {
      for (var k = 0; k < 15; k++) {
        var w = document.createElement('div'); w.className = 'wind-line';
        w.style.left = Math.random() * 100 + '%';
        w.style.height = (40 + Math.random() * 80) + 'px';
        w.style.animationDuration = (1 + Math.random() * 2) + 's';
        w.style.animationDelay = Math.random() * 1.5 + 's';
        transOverlay.appendChild(w);
      }
    }

    // Draw particles on canvas
    startTransitionParticles(trans.type);

    // Wait mid-transition, then swap scene
    await wait(trans.dur * 0.45);
    activateScene(SCENES[nextIdx].id);
    await wait(trans.dur * 0.25);

    // Exit
    transOverlay.classList.add('leaving');
    await wait(trans.dur * 0.3);
    transOverlay.className = 'transition-overlay';
    transText.textContent = '';
    transFigure.textContent = '';
    stopTransitionParticles();
  }

  /* ===== TRANSITION PARTICLES (Canvas) ===== */
  var tpRAF = null;
  function startTransitionParticles(type) {
    var c = transCanvas;
    var ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    var particles = [];
    var count = isMobile ? 30 : 60;

    for (var i = 0; i < count; i++) {
      if (type === 'portal') {
        var angle = Math.random() * Math.PI * 2;
        particles.push({ x: c.width / 2, y: c.height / 2, vx: Math.cos(angle) * (1 + Math.random() * 2), vy: Math.sin(angle) * (1 + Math.random() * 2), r: Math.random() * 2 + 1, a: 1, color: 'rgba(212,168,83,' });
      } else if (type === 'sink') {
        particles.push({ x: Math.random() * c.width, y: c.height + Math.random() * 100, vx: (Math.random() - .5) * .5, vy: -(1 + Math.random() * 2), r: Math.random() * 3 + 1, a: .7, color: 'rgba(150,210,255,' });
      } else if (type === 'fly') {
        particles.push({ x: Math.random() * c.width, y: c.height + Math.random() * 200, vx: (Math.random() - .5), vy: -(2 + Math.random() * 3), r: Math.random() * 2 + .5, a: .8, color: 'rgba(255,255,255,' });
      } else if (type === 'ride') {
        particles.push({ x: Math.random() * c.width, y: c.height * .6 + Math.random() * c.height * .3, vx: 2 + Math.random() * 3, vy: (Math.random() - .5), r: Math.random() * 2 + 1, a: .5, color: 'rgba(180,140,80,' });
      } else {
        particles.push({ x: c.width / 2 + (Math.random() - .5) * 100, y: c.height / 2 + (Math.random() - .5) * 100, vx: (Math.random() - .5) * 3, vy: (Math.random() - .5) * 3, r: Math.random() * 2 + 1, a: 1, color: 'rgba(255,255,255,' });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.a -= .003;
        if (p.a <= 0) p.a = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.a + ')'; ctx.fill();
      });
      tpRAF = requestAnimationFrame(draw);
    }
    draw();
  }
  function stopTransitionParticles() { if (tpRAF) { cancelAnimationFrame(tpRAF); tpRAF = null; } }

  /* ===== CANVAS: STARS (Opening) ===== */
  var starsRAF = null;
  function startStarsCanvas() {
    if (starsRAF) cancelAnimationFrame(starsRAF);
    var c = document.getElementById('canvas-stars'); if (!c) return;
    var ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    var stars = [];
    var count = isMobile ? 200 : 500;
    for (var i = 0; i < count; i++)stars.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.8 + .3, a: Math.random(), s: Math.random() * .008 + .002 });

    function draw() {
      ctx.fillStyle = 'rgba(10,22,40,0.15)'; ctx.fillRect(0, 0, c.width, c.height);
      stars.forEach(function (s) {
        s.a += s.s; if (s.a > 1) s.s = -Math.abs(s.s); if (s.a < .1) s.s = Math.abs(s.s);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,248,231,' + s.a + ')'; ctx.fill();
        if (s.r > 1.2) { ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(212,168,83,' + (s.a * .15) + ')'; ctx.fill(); }
      });
      starsRAF = requestAnimationFrame(draw);
    }
    ctx.fillStyle = '#0a1628'; ctx.fillRect(0, 0, c.width, c.height);
    draw();
  }

  /* ===== CANVAS: OCEAN ===== */
  var oceanRAF = null;
  function startOceanCanvas() {
    if (oceanRAF) cancelAnimationFrame(oceanRAF);
    var c = document.getElementById('canvas-ocean'); if (!c) return;
    var ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    var t = 0;

    function draw() {
      ctx.fillStyle = '#040e1a'; ctx.fillRect(0, 0, c.width, c.height);
      // Draw wave layers
      for (var layer = 0; layer < 4; layer++) {
        var baseY = c.height * (.35 + layer * .12);
        var alpha = .08 + layer * .04;
        ctx.beginPath(); ctx.moveTo(0, c.height);
        for (var x = 0; x <= c.width; x += 4) {
          var y = baseY + Math.sin(x * .008 + t * (1 + layer * .2) + layer) * 20 + Math.sin(x * .015 + t * 1.5 + layer * 2) * 10;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(c.width, c.height); ctx.closePath();
        ctx.fillStyle = 'rgba(12,45,72,' + (.3 + layer * .15) + ')'; ctx.fill();
        // Highlight
        ctx.beginPath();
        for (var x2 = 0; x2 <= c.width; x2 += 4) {
          var y2 = baseY + Math.sin(x2 * .008 + t * (1 + layer * .2) + layer) * 20 + Math.sin(x2 * .015 + t * 1.5 + layer * 2) * 10;
          if (x2 === 0) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
        }
        ctx.strokeStyle = 'rgba(100,180,246,' + alpha + ')'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      t += .01;
      oceanRAF = requestAnimationFrame(draw);
    }
    draw();
  }

  /* ===== DECORATIONS ===== */
  function initDecorations() {
    createSparkles(); createFireflies(); createOceanDots(); createClouds();
    createHearts('hearts-final'); createHearts('hearts-closing');
    createOceanDecor(); createSkyDecor(); createForestDecor();
    createOpeningDecor();
  }

  function createOpeningDecor() {
    var c = document.getElementById('opening-decor'); if (!c) return; c.innerHTML = '';
    // Saturn
    var saturn = document.createElement('div'); saturn.className = 'saturn';
    saturn.innerHTML = '<div class="saturn-orb"></div><div class="saturn-ring"></div>';
    c.appendChild(saturn);
    // Moon
    var moon = document.createElement('div'); moon.className = 'moon';
    c.appendChild(moon);
    // Asteroids
    for (var i = 0; i < 6; i++) {
      var a = document.createElement('div'); a.className = 'asteroid';
      a.style.width = a.style.height = (10 + Math.random() * 20) + 'px';
      a.style.left = (Math.random() * 100) + '%'; a.style.top = (Math.random() * 100) + '%';
      a.style.animationDelay = Math.random() * 5 + 's'; a.style.animationDuration = (20 + Math.random() * 20) + 's';
      c.appendChild(a);
    }
    // Comets Interval - Slower (Moving Right)
    setInterval(function () {
      if (!document.getElementById('scene-opening').classList.contains('active')) return;
      var co = document.createElement('div'); co.className = 'shooting-comet';
      co.style.left = '-10%'; // Start at left
      co.style.top = (10 + Math.random() * 40) + '%';
      co.style.animation = "comet-shot 4s linear forwards";
      c.appendChild(co);
      setTimeout(function () { co.remove(); }, 4100);
    }, 8000);
  }

  function createForestDecor() {
    var c = document.getElementById('forest-decor'); if (!c) return; c.innerHTML = '';
    // Meadow
    var m = document.createElement('div'); m.className = 'meadow'; c.appendChild(m);
    // Butterflies - Increased count and better start
    for (var i = 0; i < 8; i++) {
      var b = document.createElement('div'); b.className = 'butterfly';
      b.style.top = (10 + Math.random() * 60) + '%';
      b.style.left = (Math.random() * 80) + '%';
      b.style.animationDelay = (i * 1.2) + 's';
      c.appendChild(b);
    }
  }

  function createOceanDecor() {
    var c = document.getElementById('ocean-decor'); if (!c) return; c.innerHTML = '';
    // Pearls - High count
    for (var j = 0; j < 15; j++) {
      var p = document.createElement('div'); p.className = 'pearl';
      p.style.left = (2 + Math.random() * 96) + '%'; p.style.bottom = (2 + Math.random() * 30) + '%';
      p.style.animationDelay = Math.random() * 5 + 's'; c.appendChild(p);
    }

    // Dolphins Pod Spawning
    function spawnPod() {
      if (!document.getElementById('scene-ocean').classList.contains('active')) return;
      var count = 3 + Math.floor(Math.random() * 3);
      for (var k = 0; k < count; k++) {
        (function (idx) {
          setTimeout(function () {
            var d = document.createElement('div'); d.className = 'dolphin';
            d.style.top = (30 + Math.random() * 40) + '%';
            d.style.animation = "dolphin-jump 3s ease-in-out forwards";
            c.appendChild(d);
            setTimeout(function () { d.remove(); }, 3100);
          }, idx * 400);
        })(k);
      }
    }
    setInterval(spawnPod, 6000);
    spawnPod();
  }

  function createSkyDecor() {
    var c = document.getElementById('sky-decor'); if (!c) return; c.innerHTML = '';
    // Sun
    var sun = document.createElement('div'); sun.className = 'sun'; c.appendChild(sun);
    // Birds
    birdContainer();
  }

  function birdContainer() {
    var c = document.getElementById('sky-decor'); if (!c) return;
    for (var i = 0; i < 5; i++) {
      var b = document.createElement('div'); b.className = 'bird';
      b.style.top = (10 + Math.random() * 30) + '%'; b.style.left = '-50px';
      b.style.animation = "fly-across " + (15 + Math.random() * 10) + "s linear infinite";
      b.style.animationDelay = (i * 3) + 's'; c.appendChild(b);
    }
  }

  function createSparkles() {
    var c = document.getElementById('sparkles-kingdom'); if (!c) return; c.innerHTML = '';
    for (var i = 0; i < (isMobile ? 15 : 35); i++) {
      var s = document.createElement('div'); s.className = 'sparkle';
      s.style.left = Math.random() * 100 + '%'; s.style.top = (30 + Math.random() * 60) + '%';
      s.style.animationDuration = (3 + Math.random() * 4) + 's'; s.style.animationDelay = Math.random() * 5 + 's';
      s.style.width = s.style.height = (2 + Math.random() * 4) + 'px'; c.appendChild(s);
    }
  }
  function createFireflies() {
    var c = document.getElementById('fireflies-forest'); if (!c) return; c.innerHTML = '';
    for (var i = 0; i < (isMobile ? 12 : 25); i++) {
      var f = document.createElement('div'); f.className = 'firefly';
      f.style.left = Math.random() * 100 + '%'; f.style.top = (15 + Math.random() * 65) + '%';
      f.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px'); f.style.setProperty('--dy', (Math.random() * -80 - 40) + 'px');
      f.style.animationDuration = (5 + Math.random() * 7) + 's'; f.style.animationDelay = Math.random() * 5 + 's';
      f.style.width = f.style.height = (3 + Math.random() * 4) + 'px'; c.appendChild(f);
    }
  }
  function createOceanDots() {
    var c = document.getElementById('ocean-lights'); if (!c) return; c.innerHTML = '';
    for (var i = 0; i < (isMobile ? 12 : 25); i++) {
      var d = document.createElement('div'); d.className = 'ocean-dot';
      d.style.left = Math.random() * 100 + '%'; d.style.top = (25 + Math.random() * 65) + '%';
      d.style.animationDuration = (4 + Math.random() * 5) + 's'; d.style.animationDelay = Math.random() * 4 + 's'; c.appendChild(d);
    }
  }
  function createClouds() {
    var c = document.getElementById('clouds-sky'); if (!c) return; c.innerHTML = '';
    for (var i = 0; i < (isMobile ? 5 : 10); i++) {
      var cl = document.createElement('div'); cl.className = 'css-cloud';
      cl.style.width = (80 + Math.random() * 150) + 'px'; cl.style.height = (30 + Math.random() * 50) + 'px';
      cl.style.top = (10 + Math.random() * 60) + '%'; cl.style.left = (-200 + Math.random() * 100) + 'px';
      cl.style.animationDuration = (20 + Math.random() * 30) + 's'; cl.style.animationDelay = Math.random() * 15 + 's';
      cl.style.opacity = .12 + Math.random() * .15; c.appendChild(cl);
    }
  }
  function createHearts(id) {
    var c = document.getElementById(id); if (!c) return; c.innerHTML = '';
    var h = ['❤️', '💕', '💖', '💗', '✨'];
    for (var i = 0; i < (isMobile ? 8 : 18); i++) {
      var el = document.createElement('div'); el.className = 'fl-heart';
      el.textContent = h[Math.floor(Math.random() * h.length)];
      el.style.left = Math.random() * 100 + '%'; el.style.bottom = '-20px';
      el.style.animationDuration = (7 + Math.random() * 9) + 's'; el.style.animationDelay = Math.random() * 12 + 's';
      el.style.fontSize = (.7 + Math.random() * 1) + 'rem'; c.appendChild(el);
    }
  }

  /* ===== REPLAY ===== */
  replayBtn.addEventListener('click', function () {
    // Reset
    document.querySelectorAll('.flower-btn').forEach(function (b) { b.classList.remove('selected', 'dimmed'); b.onclick = null; });
    document.getElementById('gombalan-text').classList.remove('show'); document.getElementById('gombalan-text').classList.add('hidden');
    var nameInp = document.getElementById('input-name'); if (nameInp) nameInp.value = '';
    var wishInp = document.getElementById('input-wish'); if (wishInp) wishInp.value = '';
    if (starsRAF) { cancelAnimationFrame(starsRAF); starsRAF = null; }
    if (oceanRAF) { cancelAnimationFrame(oceanRAF); oceanRAF = null; }
    startJourney();
  });

  /* ===== RESIZE ===== */
  window.addEventListener('resize', function () {
    var c1 = document.getElementById('canvas-stars'); if (c1 && c1.getContext) { c1.width = window.innerWidth; c1.height = window.innerHeight; }
    var c2 = document.getElementById('canvas-ocean'); if (c2 && c2.getContext) { c2.width = window.innerWidth; c2.height = window.innerHeight; }
  });

})();
