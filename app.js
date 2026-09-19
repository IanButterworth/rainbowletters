(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------

  const MAX_LETTERS = 20;   // beyond this the oldest letter floats away
  const MAX_CHIPS = 8;      // previously typed words shown at the bottom
  const MAX_UNICORNS = 3;

  // Free play, word hunt with every letter named, and word hunt where the
  // letters are only named once found. The 🎯 button cycles through them.
  const MODES = ['free', 'hunt', 'quiet'];
  const MODE_ICON = { free: '🎯', hunt: '🎯', quiet: '🤫' };

  const DIGIT_EMOJI = { 0: '0️⃣', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣' };

  // Language packs (letter pictures, word emoji, UI text, voices) live in languages.js.
  const LANGS = window.RL_LANGUAGES;

  const BURST_EMOJI = ['✨', '⭐', '🌟', '💖', '💗', '🌈', '🌸', '🍬', '🎀', '🫧', '💫', '🦄'];
  const PASTELS = ['#ff8fd0', '#ffb3c6', '#ffd97d', '#9ee7a0', '#8fd0ff', '#c9a7ff', '#ffc09f', '#a5f3fc', '#fff176'];
  const RAINBOW = ['#ff5e7e', '#ff9f43', '#ffe14d', '#5ee37a', '#4fc3ff', '#8f7bff', '#ff7bff'];

  // ---------------------------------------------------------------------------
  // DOM + helpers
  // ---------------------------------------------------------------------------

  const $ = (id) => document.getElementById(id);
  const wordEl = $('word');
  const stage = $('stage');
  const hint = $('hint');
  const garden = $('garden');
  const flyersEl = $('flyers');
  const startEl = $('start');
  const startModes = $('start-modes');
  const guideEl = $('guide');
  const guideEmoji = $('guide-emoji');
  const guideMsg = $('guide-msg');
  const btnGuide = $('btn-guide');
  const btnMusic = $('btn-music');
  const btnFull = $('btn-full');
  const touchInput = $('touch-input');

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const isLetter = (ch) => /\p{L}/u.test(ch);
  const isDigit = (ch) => /\p{N}/u.test(ch);

  let started = false;
  let musicPref = true;
  let modePref = 'free';
  try {
    musicPref = localStorage.getItem('rl-music') !== 'off';
    // rl-guide was the on/off switch before there were three modes.
    modePref = localStorage.getItem('rl-mode') || (localStorage.getItem('rl-guide') === 'on' ? 'hunt' : 'free');
  } catch (_) { /* private mode */ }
  if (!MODES.includes(modePref)) modePref = 'free';

  // ---------------------------------------------------------------------------
  // Sound: Web Audio synth for effects and a looping music-box tune.
  // Everything is in C major pentatonic so key mashing still sounds sweet.
  // ---------------------------------------------------------------------------

  const Sound = (() => {
    let ctx = null;
    let master, sfx, music, reverb, noiseBuf;
    let musicTimer = null;
    let nextBeatTime = 0;
    let beat = 0;
    let phraseIdx = 0;

    const BPM = 96;
    const SPB = 60 / BPM;
    const PENTA = [0, 2, 4, 7, 9];

    const CHORDS = {
      C: [60, 64, 67, 72],
      G: [59, 62, 67, 71],
      Am: [57, 60, 64, 69],
      Em: [59, 64, 67, 71],
      F: [57, 60, 65, 69],
    };
    const BASS = { C: 48, G: 43, Am: 45, Em: 40, F: 41 };

    // [beat, midi, duration in beats]; each phrase is 8 bars of 4/4
    const PHRASES = [
      {
        chords: ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'G'],
        mel: [
          [0, 72, 1], [1, 76, 1], [2, 79, 1], [3, 76, 1],
          [4, 81, 1.5], [5.5, 79, 0.5], [6, 76, 1], [7, 74, 1],
          [8, 72, 1], [9, 74, 1], [10, 76, 1], [11, 79, 1],
          [12, 81, 2], [14, 79, 2],
          [16, 76, 1], [17, 79, 1], [18, 81, 1], [19, 84, 1],
          [20, 81, 1.5], [21.5, 79, 0.5], [22, 76, 1], [23, 74, 1],
          [24, 72, 1], [25, 76, 1], [26, 74, 1], [27, 76, 1],
          [28, 72, 3],
        ],
      },
      {
        chords: ['C', 'G', 'Am', 'Em', 'F', 'C', 'G', 'C'],
        mel: [
          [0, 79, 1], [1, 81, 1], [2, 79, 1], [3, 76, 1],
          [4, 74, 2], [6, 76, 1], [7, 79, 1],
          [8, 81, 1], [9, 84, 1], [10, 81, 1], [11, 79, 1],
          [12, 76, 3],
          [16, 74, 1], [17, 76, 1], [18, 79, 1], [19, 81, 1],
          [20, 79, 1.5], [21.5, 76, 0.5], [22, 74, 1], [23, 72, 1],
          [24, 74, 1], [25, 76, 1], [26, 79, 1], [27, 76, 1],
          [28, 72, 4],
        ],
      },
    ];

    function makeReverb() {
      const len = Math.floor(ctx.sampleRate * 2.5);
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      const conv = ctx.createConvolver();
      conv.buffer = buf;
      return conv;
    }

    function makeNoise() {
      const len = Math.floor(ctx.sampleRate * 1.5);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return buf;
    }

    function init() {
      if (ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 4;
      comp.connect(ctx.destination);

      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(comp);

      reverb = makeReverb();
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.35;
      reverb.connect(reverbGain);
      reverbGain.connect(master);

      sfx = ctx.createGain();
      sfx.gain.value = 0.6;
      sfx.connect(master);
      sfx.connect(reverb);

      music = ctx.createGain();
      music.gain.value = 0;
      music.connect(master);
      const musicSend = ctx.createGain();
      musicSend.gain.value = 0.5;
      music.connect(musicSend);
      musicSend.connect(reverb);

      noiseBuf = makeNoise();
      return true;
    }

    function resume() {
      if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
    }

    function suspend() {
      if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
    }

    // Music-box style bell: sine fundamental with a couple of soft partials.
    function bell(midi, t, dur, vol, dest) {
      const f = mtof(midi);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      g.connect(dest);
      const partials = [[1, 1, 'sine'], [2, 0.3, 'sine'], [3, 0.08, 'triangle']];
      for (const [ratio, amp, type] of partials) {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f * ratio;
        const og = ctx.createGain();
        og.gain.value = amp;
        o.connect(og);
        og.connect(g);
        o.start(t);
        o.stop(t + dur + 0.05);
      }
    }

    function pad(tones, t, dur) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.5);
      g.gain.setValueAtTime(0.05, t + dur - 0.6);
      g.gain.linearRampToValueAtTime(0, t + dur);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 900;
      g.connect(lp);
      lp.connect(music);
      for (const m of tones) {
        for (const det of [-7, 7]) {
          const o = ctx.createOscillator();
          o.type = 'triangle';
          o.frequency.value = mtof(m);
          o.detune.value = det;
          o.connect(g);
          o.start(t);
          o.stop(t + dur + 0.1);
        }
      }
    }

    function bass(midi, t, dur) {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = mtof(midi);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 420;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(lp);
      lp.connect(g);
      g.connect(music);
      o.start(t);
      o.stop(t + dur + 0.05);
    }

    function whoosh(t, vol = 0.12) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(500, t);
      bp.frequency.exponentialRampToValueAtTime(5000, t + 0.6);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      src.connect(bp);
      bp.connect(g);
      g.connect(sfx);
      src.start(t);
      src.stop(t + 0.75);
    }

    function scheduleBeat(b, t) {
      const ph = PHRASES[phraseIdx];
      const chord = ph.chords[Math.floor(b / 4)];
      for (const [nb, m, d] of ph.mel) {
        if (nb >= b && nb < b + 1) bell(m, t + (nb - b) * SPB, d * SPB * 1.3, 0.3, music);
      }
      if (b % 4 === 0) pad(CHORDS[chord], t, 4 * SPB);
      if (b % 2 === 0) bass(BASS[chord], t, SPB * 1.8);
      const tones = CHORDS[chord];
      for (let s = 0; s < 2; s++) {
        const idx = ((b % 4) * 2 + s) % tones.length;
        bell(tones[idx], t + s * SPB / 2, SPB * 0.9, 0.09, music);
      }
    }

    function tick() {
      while (nextBeatTime < ctx.currentTime + 0.3) {
        scheduleBeat(beat, nextBeatTime);
        nextBeatTime += SPB;
        beat++;
        if (beat >= 32) {
          beat = 0;
          phraseIdx = (phraseIdx + 1) % PHRASES.length;
        }
      }
    }

    function startMusic() {
      if (!ctx || musicTimer) return;
      nextBeatTime = ctx.currentTime + 0.1;
      beat = 0;
      musicTimer = setInterval(tick, 100);
      music.gain.cancelScheduledValues(ctx.currentTime);
      music.gain.setTargetAtTime(0.3, ctx.currentTime, 0.6);
    }

    function stopMusic() {
      if (!musicTimer) return;
      clearInterval(musicTimer);
      musicTimer = null;
      music.gain.cancelScheduledValues(ctx.currentTime);
      music.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
    }

    // i in 0..1 maps onto two octaves of pentatonic from C5 to A6
    function pling(i) {
      if (!ctx) return;
      const k = Math.round(Math.max(0, Math.min(1, i)) * 9);
      const midi = 72 + 12 * Math.floor(k / 5) + PENTA[k % 5];
      const t = ctx.currentTime;
      bell(midi, t, 1.1, 0.35, sfx);
      bell(midi + 12, t + 0.02, 0.5, 0.06, sfx);
    }

    function pop() {
      if (!ctx) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(640, t);
      o.frequency.exponentialRampToValueAtTime(170, t + 0.18);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g);
      g.connect(sfx);
      o.start(t);
      o.stop(t + 0.22);
    }

    // A soft "uh-uh": two low notes stepping down, for wrong keys in the no-hints hunt.
    function nope() {
      if (!ctx) return;
      const t = ctx.currentTime;
      [[196, 0], [156, 0.14]].forEach(([f, dt]) => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, t + dt);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t + dt);
        g.gain.exponentialRampToValueAtTime(0.16, t + dt + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.16);
        o.connect(g);
        g.connect(sfx);
        o.start(t + dt);
        o.stop(t + dt + 0.18);
      });
    }

    function sparkle() {
      if (!ctx) return;
      const t = ctx.currentTime;
      const base = pick([91, 93, 96, 98]);
      bell(base, t, 0.4, 0.12, sfx);
      bell(base + 4, t + 0.07, 0.4, 0.1, sfx);
    }

    function fanfare(big) {
      if (!ctx) return;
      const t = ctx.currentTime;
      const notes = big ? [72, 76, 79, 84, 88] : [72, 76, 79, 84];
      notes.forEach((m, i) => bell(m, t + i * 0.09, 1.2, 0.32, sfx));
      const end = t + notes.length * 0.09;
      [84, 88, 91, 96].forEach((m) => bell(m, end, 2.2, 0.16, sfx));
      for (let i = 0; i < 12; i++) bell(pick([91, 93, 96, 98, 100, 103]), t + 0.3 + i * 0.05, 0.5, 0.07, sfx);
      whoosh(t, big ? 0.16 : 0.1);
    }

    return { init, resume, suspend, startMusic, stopMusic, pling, pop, nope, sparkle, fanfare };
  })();

  // ---------------------------------------------------------------------------
  // Voice: speaks each letter and each finished word.
  // ---------------------------------------------------------------------------

  const Voice = (() => {
    const synth = window.speechSynthesis;
    let voice = null;
    let pack = null;   // the current language pack: preferred voice names and a BCP 47 tag

    // Pick a voice for the current language: a preferred name first, then any
    // voice for that language. With no match the utterance still carries the
    // language tag so the engine can choose.
    function choose() {
      if (!synth || !pack) return;
      const code = pack.speech.slice(0, 2).toLowerCase();
      const voices = synth.getVoices().filter((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith(code));
      voice = null;
      for (const name of pack.voices) {
        const v = voices.find((x) => x.name.includes(name));
        if (v) { voice = v; return; }
      }
      voice = voices.find((v) => v.default) || voices.find((v) => v.localService) || voices[0] || null;
    }

    if (synth) synth.addEventListener('voiceschanged', choose);

    function setLanguage(langPack) {
      pack = langPack;
      choose();
    }

    // Never call speechSynthesis.cancel(): on Chrome for macOS cancelling an
    // utterance that is still starting can wedge the engine for the whole
    // browser until restart. Instead keep one utterance in flight and one
    // waiting; when keys are mashed only the latest waiting one is spoken.
    let current = null;   // referenced so Chrome cannot garbage-collect it mid-speech
    let next = null;
    let watchdog = null;

    function speakNow(req) {
      const u = new SpeechSynthesisUtterance(req.text);
      if (voice) { u.voice = voice; u.lang = voice.lang; }
      else if (pack) u.lang = pack.speech;
      u.rate = req.rate;
      u.pitch = req.pitch;
      current = u;
      const done = () => {
        if (current !== u) return;
        current = null;
        clearTimeout(watchdog);
        // A follow-up may call say() and go straight out; the waiting one then keeps waiting.
        if (req.then) req.then();
        if (current) return;
        const n = next;
        next = null;
        if (n) speakNow(n);
      };
      u.onend = done;
      u.onerror = done;
      clearTimeout(watchdog);
      // If the engine never reports the end, assume it stalled and move on.
      watchdog = setTimeout(done, 2500 + req.text.length * 120);
      try { synth.speak(u); } catch (_) { done(); }
    }

    // `then` runs once this utterance has finished (or been given up on), but
    // not if it is dropped while waiting.
    function say(text, { rate = 0.9, pitch = 1.15, then = null } = {}) {
      if (!synth) return;
      const req = { text, rate, pitch, then };
      if (current) next = req;
      else speakNow(req);
    }

    return { say, setLanguage };
  })();

  // ---------------------------------------------------------------------------
  // FX: canvas particles (sparkles, confetti, emoji showers) and flying unicorns.
  // ---------------------------------------------------------------------------

  const FX = (() => {
    const canvas = $('fx');
    const c2 = canvas.getContext('2d');
    const MAX = 900;
    const ps = [];
    const flyers = [];
    const sprites = new Map();
    let W = 0, H = 0;
    let ambientClock = 0;
    let hue = 0;

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      c2.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    // Emoji are pre-rendered once per glyph; fillText per particle is too slow.
    function sprite(emoji) {
      let s = sprites.get(emoji);
      if (s) return s;
      const size = 96;
      s = document.createElement('canvas');
      s.width = s.height = size;
      const x = s.getContext('2d');
      x.font = `${size * 0.78}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText(emoji, size / 2, size / 2 + size * 0.05);
      sprites.set(emoji, s);
      return s;
    }

    function add(p) {
      if (ps.length >= MAX) ps.shift();
      p.age = 0;
      p.rot = p.rot || 0;
      p.vr = p.vr || 0;
      p.g = p.g == null ? 0 : p.g;
      p.drag = p.drag == null ? 0 : p.drag;
      ps.push(p);
    }

    function burst(x, y, { count = 14, emojis = BURST_EMOJI, speed = [120, 460], size = [18, 44], featured = null } = {}) {
      for (let i = 0; i < count; i++) {
        const a = rand(0, Math.PI * 2);
        const v = rand(speed[0], speed[1]);
        const isEmoji = Math.random() < 0.55;
        add({
          kind: isEmoji ? 'emoji' : 'dot',
          emoji: pick(emojis),
          color: pick(PASTELS),
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - 120,
          g: 380,
          drag: 1.2,
          vr: rand(-4, 4),
          size: rand(size[0], size[1]),
          life: rand(0.9, 1.7),
        });
      }
      if (featured) {
        add({
          kind: 'emoji', emoji: featured, x, y,
          vx: rand(-80, 80), vy: rand(-520, -380),
          g: 520, drag: 0.4, vr: rand(-1.5, 1.5),
          size: rand(80, 110), life: 2.2,
        });
      }
    }

    function confetti(x, y, count) {
      for (let i = 0; i < count; i++) {
        const a = rand(-Math.PI, 0);
        const v = rand(300, 900);
        add({
          kind: 'confetti',
          color: pick(RAINBOW),
          x, y,
          vx: Math.cos(a) * v * rand(0.6, 1.4),
          vy: Math.sin(a) * v,
          g: 700,
          drag: 1.4,
          vr: rand(-10, 10),
          size: rand(8, 16),
          life: rand(2, 3.4),
        });
      }
    }

    // Emoji falling gently from the top, like snow.
    function rain(emoji, count) {
      for (let i = 0; i < count; i++) {
        add({
          kind: 'emoji', emoji,
          x: rand(0, W), y: rand(-H * 0.6, -40),
          vx: 0, vy: rand(90, 220),
          g: 40, drag: 0,
          vr: rand(-1.5, 1.5),
          sway: { f: rand(1, 2.5), a: rand(30, 90), o: rand(0, 6) },
          size: rand(40, 76),
          life: 7,
        });
      }
    }

    function trail(x, y) {
      hue = (hue + 12) % 360;
      add({
        kind: 'dot', color: `hsl(${hue} 100% 70%)`,
        x: x + rand(-6, 6), y: y + rand(-6, 6),
        vx: rand(-30, 30), vy: rand(-60, -10),
        g: 60, drag: 1, size: rand(5, 11), life: rand(0.6, 1),
      });
      if (Math.random() < 0.25) {
        add({
          kind: 'emoji', emoji: pick(['✨', '⭐', '💖', '🌟']),
          x, y, vx: rand(-40, 40), vy: rand(-80, -20),
          g: 80, drag: 1, vr: rand(-3, 3), size: rand(12, 22), life: rand(0.7, 1.2),
        });
      }
    }

    function ambient(dt) {
      ambientClock += dt;
      if (ambientClock < 0.18) return;
      ambientClock = 0;
      const emojiOne = Math.random() < 0.3;
      add({
        kind: emojiOne ? 'emoji' : 'dot',
        emoji: pick(['✨', '🫧', '⭐', '💖', '🌸']),
        color: pick(PASTELS),
        x: rand(0, W), y: H + 20,
        vx: rand(-15, 15), vy: rand(-70, -30),
        g: 0, drag: 0,
        vr: rand(-1, 1),
        sway: { f: rand(0.5, 1.5), a: rand(10, 40), o: rand(0, 6) },
        twinkle: rand(2, 5),
        size: emojiOne ? rand(14, 26) : rand(3, 8),
        life: rand(6, 11),
      });
    }

    function unicorn() {
      if (flyers.length >= MAX_UNICORNS) return;
      const el = document.createElement('div');
      el.className = 'unicorn';
      el.textContent = '🦄';
      flyersEl.appendChild(el);
      flyers.push({
        el, t: 0,
        dur: rand(2.8, 3.6),
        y0: rand(0.12, 0.5) * H,
        amp: rand(18, 45),
        dir: Math.random() < 0.5 ? 1 : -1,
        trailHue: rand(0, 360),
      });
    }

    function updateFlyers(dt) {
      for (let i = flyers.length - 1; i >= 0; i--) {
        const f = flyers[i];
        f.t += dt;
        if (f.t >= f.dur) {
          f.el.remove();
          flyers.splice(i, 1);
          continue;
        }
        const p = f.t / f.dur;
        const x = f.dir > 0 ? -160 + (W + 320) * p : W + 160 - (W + 320) * p;
        const y = f.y0 + Math.sin(f.t * 5) * f.amp;
        // The unicorn glyph faces left, so flip it when flying right.
        f.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scaleX(${-f.dir})`;
        f.trailHue = (f.trailHue + 240 * dt) % 360;
        for (let k = 0; k < 3; k++) {
          add({
            kind: 'dot', color: `hsl(${(f.trailHue + k * 40) % 360} 100% 70%)`,
            x: x - f.dir * rand(20, 60), y: y + rand(-30, 30),
            vx: -f.dir * rand(20, 80), vy: rand(-40, 40),
            g: 30, drag: 0.5, size: rand(6, 14), life: rand(0.6, 1.2),
          });
        }
        if (Math.random() < 0.3) {
          add({
            kind: 'emoji', emoji: pick(['✨', '⭐', '💖', '🌈']),
            x: x - f.dir * 50, y: y + rand(-20, 20),
            vx: -f.dir * rand(20, 60), vy: rand(-60, 20),
            g: 100, drag: 0.5, vr: rand(-3, 3), size: rand(14, 28), life: rand(0.8, 1.4),
          });
        }
      }
    }

    function update(dt) {
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.age += dt;
        if (p.age >= p.life || p.y > H + 120 || p.y < -H) {
          ps.splice(i, 1);
          continue;
        }
        p.vy += p.g * dt;
        const k = 1 - p.drag * dt;
        p.vx *= k;
        p.vy *= k;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.sway) p.x += Math.sin(p.age * p.sway.f + p.sway.o) * p.sway.a * dt;
        p.rot += p.vr * dt;
      }
    }

    function draw() {
      c2.clearRect(0, 0, W, H);
      for (const p of ps) {
        const fadeStart = p.life * 0.65;
        let alpha = p.age < fadeStart ? 1 : 1 - (p.age - fadeStart) / (p.life - fadeStart);
        if (p.twinkle) alpha *= 0.55 + 0.45 * Math.sin(p.age * p.twinkle);
        c2.globalAlpha = Math.max(0, Math.min(1, alpha));
        c2.save();
        c2.translate(p.x, p.y);
        c2.rotate(p.rot);
        if (p.kind === 'emoji') {
          const s = p.size;
          c2.drawImage(sprite(p.emoji), -s / 2, -s / 2, s, s);
        } else if (p.kind === 'confetti') {
          c2.fillStyle = p.color;
          const w = p.size, h = p.size * 0.55;
          c2.scale(1, Math.max(0.15, Math.abs(Math.cos(p.age * 9 + p.rot))));
          c2.fillRect(-w / 2, -h / 2, w, h);
        } else {
          c2.fillStyle = p.color;
          c2.globalAlpha *= 0.35;
          c2.beginPath();
          c2.arc(0, 0, p.size, 0, Math.PI * 2);
          c2.fill();
          c2.globalAlpha /= 0.35;
          c2.beginPath();
          c2.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          c2.fill();
          c2.fillStyle = 'rgba(255,255,255,0.9)';
          c2.beginPath();
          c2.arc(0, 0, p.size * 0.22, 0, Math.PI * 2);
          c2.fill();
        }
        c2.restore();
      }
      c2.globalAlpha = 1;
    }

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) {
        ambient(dt);
        updateFlyers(dt);
        update(dt);
        draw();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return {
      burst, confetti, rain, trail, unicorn,
      get width() { return W; },
      get height() { return H; },
    };
  })();

  // ---------------------------------------------------------------------------
  // Languages
  // ---------------------------------------------------------------------------

  const startLangs = $('start-langs');

  let langCode = LANGS.order[0];
  let lang = LANGS.data[langCode];
  const wordIndex = {};   // language code -> normalized word -> { word, emoji }

  // Accent-insensitive key so MAMA finds MAMÁ and NINO finds NIÑO.
  const normalize = (s) => s.normalize('NFD').replace(/\p{M}/gu, '');

  function indexFor(code) {
    if (!wordIndex[code]) {
      const map = {};
      for (const [word, emoji] of Object.entries(LANGS.data[code].words)) {
        const key = normalize(word);
        if (!map[key]) map[key] = { word, emoji };
      }
      wordIndex[code] = map;
    }
    return wordIndex[code];
  }

  function lookupWord(word) {
    return indexFor(langCode)[normalize(word)] || null;
  }

  function letterEmoji(ch) {
    if (isDigit(ch)) return DIGIT_EMOJI[ch] || null;
    return lang.letters[ch] || lang.letters[normalize(ch)] || null;
  }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  function renderLangChips(container) {
    if (!container) return;
    container.textContent = '';
    for (const code of LANGS.order) {
      const b = document.createElement('button');
      b.type = 'button';
      b.tabIndex = -1;
      b.className = 'lang' + (code === langCode ? ' on' : '');
      b.textContent = LANGS.data[code].name;
      b.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage(code);
        b.blur();
      });
      container.appendChild(b);
    }
  }

  function renderModeChips(container) {
    if (!container) return;
    container.textContent = '';
    for (const mode of MODES) {
      const b = document.createElement('button');
      b.type = 'button';
      b.tabIndex = -1;
      b.className = 'mode' + (mode === modePref ? ' on' : '');
      b.textContent = lang.ui.modes[mode];
      b.addEventListener('click', (e) => {
        e.preventDefault();
        Guide.set(mode);
        b.blur();
      });
      container.appendChild(b);
    }
  }

  function setLanguage(code) {
    if (!LANGS.data[code]) return;
    langCode = code;
    lang = LANGS.data[code];
    try { localStorage.setItem('rl-lang', code); } catch (_) { /* ignore */ }
    document.documentElement.lang = code;
    document.title = lang.ui.title;
    setText('start-title', lang.ui.title);
    setText('start-tap', lang.ui.tap);
    setText('hint-text', lang.ui.hint);
    btnGuide.title = lang.ui.modes[modePref];
    btnMusic.title = lang.ui.music;
    btnFull.title = lang.ui.fullscreen;
    Voice.setLanguage(lang);
    renderModeChips(startModes);
    renderLangChips(startLangs);
  }

  // Remembered choice, else the browser's language if we have it, else the first option.
  function initialLang() {
    try {
      const saved = localStorage.getItem('rl-lang');
      if (saved && LANGS.data[saved]) return saved;
    } catch (_) { /* ignore */ }
    const wanted = (navigator.languages || [navigator.language || '']).map((l) => l.slice(0, 2).toLowerCase());
    return wanted.find((l) => LANGS.data[l]) || LANGS.order[0];
  }

  setLanguage(initialLang());

  // ---------------------------------------------------------------------------
  // Letters and words
  // ---------------------------------------------------------------------------

  const letters = [];

  function layout() {
    const n = wordEl.querySelectorAll('.letter:not(.bye)').length;
    if (!n) { wordEl.style.fontSize = ''; return; }
    const W = window.innerWidth * 0.94;
    const H = window.innerHeight;
    const rows = n <= 10 ? 1 : (n <= 20 ? 2 : 3);
    const perRow = Math.ceil(n / rows);
    const size = Math.min(H * 0.42, (H * 0.6) / (rows * 1.15), W / (perRow * 0.74));
    wordEl.style.fontSize = Math.max(30, size) + 'px';
  }
  window.addEventListener('resize', layout);

  function vanish(el) {
    el.classList.add('bye');
    setTimeout(() => el.remove(), 380);
  }

  // The rainbow glyph inside a letter, with its own hue and float phase.
  function placeGlyph(el, ch) {
    el.style.setProperty('--h', Math.floor(rand(0, 360)));
    el.style.setProperty('--d', (-rand(0, 3)).toFixed(2) + 's');
    const glyph = document.createElement('span');
    glyph.className = 'glyph';
    glyph.style.setProperty('--h', el.style.getPropertyValue('--h'));
    glyph.textContent = ch;
    el.appendChild(glyph);
  }

  function addChar(ch) {
    if (letters.length >= MAX_LETTERS) {
      const oldest = letters.shift();
      vanish(oldest.el);
    }
    const el = document.createElement('span');
    el.className = 'letter';
    placeGlyph(el, ch);
    wordEl.appendChild(el);
    letters.push({ ch, el });
    layout();
    letterFx(ch, el);
  }

  // Sparkles from the letter, a music-box note and its name.
  function letterFx(ch, el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    FX.burst(cx, cy, { featured: letterEmoji(ch) });

    let pitch;
    if (isDigit(ch)) pitch = (parseInt(ch, 10) || 0) / 9;
    else if (ch >= 'A' && ch <= 'Z') pitch = (ch.charCodeAt(0) - 65) / 25;
    else pitch = (ch.codePointAt(0) % 26) / 25;
    Sound.pling(pitch);
    // Lowercase: voices read an uppercase letter as "capital L".
    Voice.say(ch.toLocaleLowerCase(langCode));
    hideHint();
  }

  function removeChar() {
    const last = letters.pop();
    if (!last) {
      FX.burst(FX.width / 2, FX.height / 2, { count: 8, size: [12, 26] });
      Sound.sparkle();
      return;
    }
    vanish(last.el);
    layout();
    Sound.pop();
    hideHint();
  }

  function addChip(word, emoji, spoken) {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.style.setProperty('--h', Math.floor(rand(0, 360)));
    chip.textContent = emoji ? `${word} ${emoji}` : word;
    chip.addEventListener('click', () => {
      Voice.say(spoken, { rate: 0.85, pitch: 1.2 });
      // Replay the pop so the tap is visibly acknowledged.
      chip.style.animation = 'none';
      void chip.offsetWidth;
      chip.style.animation = '';
    });
    garden.appendChild(chip);
    while (garden.children.length > MAX_CHIPS) garden.firstChild.remove();
  }

  function celebrate(praise) {
    const word = letters.map((l) => l.ch).join('');
    const cx = FX.width / 2;
    const cy = FX.height / 2;
    if (!word) {
      FX.burst(cx + rand(-cx * 0.6, cx * 0.6), cy + rand(-cy * 0.6, cy * 0.6), { count: 18 });
      Sound.sparkle();
      return;
    }

    const entry = lookupWord(word);
    const emoji = entry ? entry.emoji : null;

    // Clone the word so it can fly off while new typing starts immediately.
    const clone = wordEl.cloneNode(true);
    clone.removeAttribute('id');
    const fly = document.createElement('div');
    fly.className = 'flyaway';
    fly.appendChild(clone);
    if (emoji) {
      const e = document.createElement('div');
      e.className = 'wordemoji';
      e.textContent = emoji;
      e.style.fontSize = Math.min(parseFloat(wordEl.style.fontSize) * 0.6, window.innerHeight * 0.22) + 'px';
      fly.appendChild(e);
    }
    stage.appendChild(fly);
    setTimeout(() => fly.remove(), 2600);

    wordEl.textContent = '';
    letters.length = 0;
    layout();

    FX.confetti(cx, cy, emoji ? 70 : 100);
    FX.burst(cx, cy, { count: 30, speed: [200, 700], size: [24, 56] });
    if (emoji) FX.rain(emoji, Math.min(40, 14 + word.length * 3));
    FX.unicorn();
    if (emoji || word.length >= 5) setTimeout(FX.unicorn, 450);

    Sound.fanfare(!!emoji);
    // Speak the dictionary spelling when there is one, so MAMA is said "mamá".
    const spoken = (entry ? entry.word : word).toLocaleLowerCase(langCode);
    Voice.say(spoken, {
      rate: 0.85,
      pitch: 1.2,
      // Word hunt cheers after the word, brighter and a little quicker.
      then: praise ? () => Voice.say(praise, { rate: 1, pitch: 1.4 }) : null,
    });
    addChip(word, emoji, spoken);
    hideHint();
  }

  // ---------------------------------------------------------------------------
  // Word hunt: a guided mode that picks a short word from the dictionary and
  // asks for it one letter at a time. A wrong key gets a friendly nudge, never
  // a buzzer. The no-hints variant names a letter only once it is found, and
  // answers a wrong key with a small shake and a soft "uh-uh".
  // ---------------------------------------------------------------------------

  const Guide = (() => {
    const MIN = 2, MAX = 5;   // word lengths worth hunting for
    const on = () => modePref !== 'free';
    const quiet = () => modePref === 'quiet';
    let chars = [];           // the target spelling, one letter per slot
    let spoken = '';          // the same, as the voice says it
    let hue = 0;
    let pool = [];            // shuffled candidates, refilled when empty
    let poolLang = null;
    let busy = false;         // the celebration gap before the next word
    let nextTimer = null;
    let revertTimer = null;
    const lastPick = new Map();

    function nextTarget() {
      if (poolLang !== langCode) { pool = []; poolLang = langCode; }
      if (!pool.length) {
        pool = Object.entries(lang.words)
          .filter(([w]) => { const n = [...w].length; return n >= MIN && n <= MAX && [...w].every(isLetter); })
          .map(([word, emoji]) => ({ word, emoji }));
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
      }
      return pool.pop();
    }

    // Accented letters outside the pack's alphabet (É, Ó) accept the plain
    // key; letters in it (Ñ, Å, Ä, Ö) have a key of their own and must match.
    function matches(pressed, target) {
      if (pressed === target) return true;
      return !lang.letters[target] && normalize(pressed) === normalize(target);
    }

    // {letter} and {pressed} become big rainbow glyphs on screen.
    function show(template, pressed) {
      guideMsg.textContent = '';
      const next = chars[letters.length] || '';
      for (const part of template.split(/(\{letter\}|\{pressed\})/)) {
        if (!part) continue;
        const span = document.createElement('span');
        if (part === '{letter}' || part === '{pressed}') {
          span.className = 'guide-letter rainbow-text';
          span.style.setProperty('--h', part === '{letter}' ? hue : (hue + 160) % 360);
          span.textContent = part === '{letter}' ? next : pressed;
        } else {
          span.textContent = part;
        }
        guideMsg.appendChild(span);
      }
      const inner = guideEl.firstElementChild;
      inner.classList.remove('wiggle');
      void inner.offsetWidth;
      inner.classList.add('wiggle');
    }

    // Uppercase inside a sentence: the voices read "Find a" as the article
    // ("find uh") but "Find A" as the letter. Alone, a letter goes lowercase
    // instead, since "A" on its own is read as "capital A".
    function say(template, pressed) {
      const next = chars[letters.length] || '';
      Voice.say(template
        .replace('{letter}', next.toLocaleUpperCase(langCode))
        .replace('{pressed}', (pressed || '').toLocaleUpperCase(langCode)));
    }

    // A random phrase from the list, never the same one twice running.
    function phrase(list) {
      const options = list.filter((t) => t !== lastPick.get(list));
      const t = pick(options.length ? options : list);
      lastPick.set(list, t);
      return t;
    }

    // "Find C", "Now find A", "Now T", "Finally S"; nothing in the no-hints hunt.
    function ask() {
      if (quiet()) return '';
      const i = letters.length;
      if (i === 0) return lang.ui.find;
      if (i === chars.length - 1) return lang.ui.last;
      return i === 1 ? lang.ui.next : lang.ui.then;
    }

    // A cheer goes on screen and out loud; the word itself is only spoken,
    // since it is already on screen as the row of slots.
    function prompt({ cheer = '', word = false } = {}) {
      clearTimeout(revertTimer);
      const text = [cheer, ask()].filter(Boolean).join(' ');
      show(text);
      const speech = word ? [spoken + '!', text].filter(Boolean).join(' ') : text;
      if (speech) say(speech);
    }

    function mark() {
      [...wordEl.children].forEach((el, i) => el.classList.toggle('want', i === letters.length));
    }

    function begin() {
      busy = false;
      const target = nextTarget();
      if (!target) { set(false); return; }
      chars = [...target.word];
      spoken = target.word.toLocaleLowerCase(langCode);
      hue = Math.floor(rand(0, 360));
      guideEmoji.textContent = target.emoji;
      wordEl.textContent = '';
      letters.length = 0;
      for (const ch of chars) {
        const el = document.createElement('span');
        el.className = 'letter ghost';
        el.style.setProperty('--d', (-rand(0, 3)).toFixed(2) + 's');
        el.textContent = ch;
        wordEl.appendChild(el);
      }
      layout();
      mark();
      prompt({ word: true });
      guideEl.classList.remove('hidden');
    }

    function fill() {
      const i = letters.length;
      const ch = chars[i];
      const el = wordEl.children[i];
      el.classList.remove('ghost', 'want');
      el.textContent = '';
      placeGlyph(el, ch);
      letters.push({ ch, el });
      letterFx(ch, el);
      if (letters.length === chars.length) finish();
      else { mark(); prompt({ cheer: phrase(lang.ui.yes) }); }
    }

    // Name what they pressed, show its picture, and ask again. The no-hints
    // hunt just shakes the word and hums a soft "uh-uh".
    function miss(ch) {
      if (quiet()) {
        Sound.nope();
        wordEl.classList.remove('shake');
        void wordEl.offsetWidth;
        wordEl.classList.add('shake');
        return;
      }
      FX.burst(rand(FX.width * 0.2, FX.width * 0.8), rand(FX.height * 0.25, FX.height * 0.75), { count: 10, featured: letterEmoji(ch) });
      Sound.sparkle();
      clearTimeout(revertTimer);
      show(lang.ui.oops, ch);
      say(lang.ui.oops, ch);
      revertTimer = setTimeout(() => show(ask()), 2500);
    }

    function undo() {
      const last = letters.pop();
      if (!last) {
        FX.burst(FX.width / 2, FX.height / 2, { count: 8, size: [12, 26] });
        Sound.sparkle();
        return;
      }
      last.el.textContent = last.ch;
      last.el.classList.add('ghost');
      Sound.pop();
      mark();
      prompt();
    }

    function finish() {
      busy = true;
      clearTimeout(revertTimer);
      const cheer = phrase(lang.ui.praise);
      show(cheer);
      celebrate(cheer);
      // Let the word be heard and the confetti settle before the next one.
      nextTimer = setTimeout(begin, 2200);
    }

    function key(k) {
      if (busy) { stray(); return; }
      if ([...k].length === 1) {
        if (isLetter(k) || isDigit(k)) {
          const ch = k.toLocaleUpperCase();
          if (matches(ch, chars[letters.length])) fill(); else miss(ch);
        } else if (k === ' ') prompt({ word: true });
        else stray();
      } else if (k === 'Enter') prompt({ word: true });
      else if (k === 'Backspace' || k === 'Delete') undo();
      else if (!['Escape', 'Shift', 'CapsLock', 'Meta', 'Control', 'Alt'].includes(k)) stray(8, [12, 26]);
      hideHint();
    }

    // Idle: say the word and ask again, once.
    function remind() {
      if (!busy) prompt({ word: true });
    }

    function set(mode) {
      modePref = mode;
      try { localStorage.setItem('rl-mode', mode); } catch (_) { /* ignore */ }
      btnGuide.textContent = MODE_ICON[mode];
      btnGuide.title = lang.ui.modes[mode];
      btnGuide.classList.toggle('on', on());
      renderModeChips(startModes);
      clearTimeout(nextTimer);
      clearTimeout(revertTimer);
      if (!started) return;   // start() begins the hunt once play begins
      if (on()) {
        hideHint();
        begin();
      } else {
        busy = false;
        guideEl.classList.add('hidden');
        wordEl.textContent = '';
        letters.length = 0;
        layout();
      }
    }

    // The 🎯 button steps through the modes.
    function cycle() {
      set(MODES[(MODES.indexOf(modePref) + 1) % MODES.length]);
    }

    function start() {
      if (on()) { hideHint(); begin(); }
    }

    return { key, remind, set, cycle, start, get on() { return on(); } };
  })();

  // ---------------------------------------------------------------------------
  // Idle hint
  // ---------------------------------------------------------------------------

  let idleTimer = null;

  function scheduleHint() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!started) return;
      if (Guide.on) Guide.remind();
      else if (!letters.length) hint.classList.remove('hidden');
    }, 8000);
  }

  function hideHint() {
    hint.classList.add('hidden');
    scheduleHint();
  }

  // ---------------------------------------------------------------------------
  // Start (first interaction unlocks audio)
  // ---------------------------------------------------------------------------

  function start() {
    if (started) return;
    started = true;
    Sound.init();
    Sound.resume();
    if (musicPref) Sound.startMusic();
    btnMusic.textContent = musicPref ? '🎵' : '🔇';
    startEl.classList.add('gone');
    setTimeout(() => startEl.remove(), 800);
    Voice.say(lang.ui.greeting);
    FX.confetti(FX.width / 2, FX.height / 2, 80);
    FX.unicorn();
    scheduleHint();
    Guide.start();
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------

  // Key-mashing guard: a small token bucket so two hands on the keyboard
  // cannot flood the screen, the synth or the speech engine. Bursts of up to
  // 8 keys go through, then 8 per second.
  const bucket = { tokens: 8, max: 8, perSec: 8, last: performance.now() };

  function takeToken() {
    const now = performance.now();
    bucket.tokens = Math.min(bucket.max, bucket.tokens + ((now - bucket.last) / 1000) * bucket.perSec);
    bucket.last = now;
    if (bucket.tokens < 1) return false;
    bucket.tokens -= 1;
    return true;
  }

  // Keys that make no letter still do something fun.
  function stray(count = 10, size) {
    FX.burst(rand(FX.width * 0.2, FX.width * 0.8), rand(FX.height * 0.2, FX.height * 0.8), { count, size });
    Sound.sparkle();
  }

  function handleKey(k) {
    if (!takeToken()) return;
    if (Guide.on) { Guide.key(k); return; }
    if ([...k].length === 1) {
      if (isLetter(k)) addChar(k.toLocaleUpperCase());
      else if (isDigit(k)) addChar(k);
      else if (k === ' ') celebrate();
      else stray();
      return;
    }
    switch (k) {
      case 'Enter':
        celebrate();
        break;
      case 'Backspace':
      case 'Delete':
        removeChar();
        break;
      case 'Escape':
      case 'Shift':
      case 'CapsLock':
      case 'Meta':
      case 'Control':
      case 'Alt':
        break;
      default:
        // Arrow keys, Tab, function keys and friends.
        stray(8, [12, 26]);
    }
  }

  window.addEventListener('keydown', (e) => {
    const k = e.key;
    // Soft keyboards and IMEs deliver text through the input event instead.
    if (k === 'Unidentified' || k === 'Process' || e.isComposing) return;
    // Swallow every shortcut the browser lets us swallow (find, print, save,
    // reload, zoom, address bar...). Close-tab and quit cannot be blocked from
    // a page; beforeunload below adds a confirmation for those.
    e.preventDefault();
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.repeat) return;
    if (!started) start();
    Sound.resume();
    handleKey(k);
  }, true);

  // Touch devices: tapping focuses a hidden input so the on-screen keyboard appears.
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  touchInput.addEventListener('input', (e) => {
    const data = e.data || touchInput.value;
    touchInput.value = '';
    if (!data) return;
    if (!started) start();
    Sound.resume();
    for (const ch of data) handleKey(ch);
  });

  let lastTap = 0;
  window.addEventListener('pointerdown', (e) => {
    // Buttons, including the language names on the start screen, must not start the game or spark.
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (!started) start();
    Sound.resume();
    if (e.timeStamp - lastTap < 80) return;
    lastTap = e.timeStamp;
    FX.burst(e.clientX, e.clientY, { count: 12, size: [14, 34] });
    Sound.sparkle();
    hideHint();
  });

  window.addEventListener('pointerup', () => {
    if (coarsePointer) {
      try { touchInput.focus({ preventScroll: true }); } catch (_) { /* ignore */ }
    }
  });

  let lastTrail = 0;
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastTrail < 28) return;
    lastTrail = now;
    FX.trail(e.clientX, e.clientY);
  });

  // ---------------------------------------------------------------------------
  // Controls
  // ---------------------------------------------------------------------------

  btnGuide.addEventListener('click', (e) => {
    e.preventDefault();
    if (!started) start();
    Guide.cycle();
    btnGuide.blur();
  });

  btnMusic.addEventListener('click', (e) => {
    e.preventDefault();
    if (!started) start();
    musicPref = !musicPref;
    try { localStorage.setItem('rl-music', musicPref ? 'on' : 'off'); } catch (_) { /* ignore */ }
    if (musicPref) Sound.startMusic(); else Sound.stopMusic();
    btnMusic.textContent = musicPref ? '🎵' : '🔇';
    btnMusic.blur();
  });

  async function goFullscreen() {
    const root = document.documentElement;
    try {
      if (root.requestFullscreen) await root.requestFullscreen({ navigationUI: 'hide' });
      else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
    } catch (_) { /* not allowed here */ }
    // Keyboard lock (Chrome, Edge) captures Escape and other system keys while
    // full screen; the parent then holds Escape to leave.
    try {
      if (navigator.keyboard && navigator.keyboard.lock) await navigator.keyboard.lock();
    } catch (_) { /* unsupported */ }
  }

  btnFull.addEventListener('click', (e) => {
    e.preventDefault();
    if (!started) start();
    goFullscreen();
    btnFull.blur();
  });

  function onFullscreenChange() {
    const full = !!(document.fullscreenElement || document.webkitFullscreenElement);
    document.body.classList.toggle('is-full', full);
    if (!full && navigator.keyboard && navigator.keyboard.unlock) {
      try { navigator.keyboard.unlock(); } catch (_) { /* ignore */ }
    }
  }
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  btnMusic.textContent = musicPref ? '🎵' : '🔇';
  btnGuide.textContent = MODE_ICON[modePref];
  btnGuide.classList.toggle('on', modePref !== 'free');

  // ---------------------------------------------------------------------------
  // Guards against accidental navigation and other surprises
  // ---------------------------------------------------------------------------

  for (const ev of ['contextmenu', 'selectstart', 'dragstart']) {
    window.addEventListener(ev, (e) => e.preventDefault());
  }

  // No scrolling, pull-to-refresh, pinch zoom or swipe-to-go-back.
  document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  window.addEventListener('wheel', (e) => { if (e.ctrlKey || e.metaKey) e.preventDefault(); }, { passive: false });

  // Ask before closing, reloading or leaving once she has started playing.
  window.addEventListener('beforeunload', (e) => {
    if (!started) return;
    e.preventDefault();
    e.returnValue = '';
  });

  // Back button or back swipe: stay put.
  try {
    history.pushState({ rainbow: true }, '');
    window.addEventListener('popstate', () => {
      try { history.pushState({ rainbow: true }, ''); } catch (_) { /* ignore */ }
    });
  } catch (_) { /* file:// in some browsers */ }

  // Pause music when the tab is hidden so it does not play over other things.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) Sound.suspend();
    else if (started) Sound.resume();
  });
})();
