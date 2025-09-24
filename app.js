// CAE Multiverse - Core App Logic
// Handles navigation, galaxy map rendering, modals, quizzes, artifacts, legacy hall, and community

(() => {
  const DATA = window.CAE_DATA;

  // ---------- State & Persistence ----------
  const LS_KEY = 'cae_state_v1';
  const defaultState = {
    artifacts: {}, // { pathId: true }
    scores: {}, // { pathId: percent }
    leaderboard: [
      { name: 'NovaEngineer', score: 7200, guild: 'Flow Knights' },
      { name: 'MeshMaverick', score: 6400, guild: 'Mesh Avengers' },
      { name: 'ImpactIon', score: 5900, guild: 'Crash Guardians' },
    ],
    worldBoss: { joined: false, progress: 0 },
  };
  let state = loadState();
  function loadState(){
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    } catch (e){
      console.warn('Failed to load state', e);
      return { ...defaultState };
    }
  }
  function saveState(){
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }
  function resetState(){
    state = { ...defaultState };
    saveState();
    renderAll();
  }

  // ---------- DOM Helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ---------- Navigation ----------
  const screens = {
    command: $('#screen-command'),
    legacy: $('#screen-legacy'),
    community: $('#screen-community'),
    inventory: $('#screen-inventory'),
  };
  const navButtons = {
    command: $('#btn-command'),
    legacy: $('#btn-legacy'),
    community: $('#btn-community'),
    inventory: $('#btn-inventory'),
  };

  Object.entries(navButtons).forEach(([key, btn]) => {
    btn.addEventListener('click', () => {
      Object.values(screens).forEach(s => s.classList.remove('active'));
      Object.values(navButtons).forEach(b => b.classList.remove('active'));
      screens[key].classList.add('active');
      btn.classList.add('active');
      if (key === 'legacy') renderLegacy();
      if (key === 'community') renderCommunity();
      if (key === 'inventory') renderInventory();
    });
  });

  $('#btn-reset').addEventListener('click', () => {
    if (confirm('Reset your CAE Multiverse progress?')) resetState();
  });

  // ---------- Galaxy Map ----------
  const galaxy = $('#galaxy');
  const tooltip = $('#tooltip');
  let ctx, W, H, nodes = [];

  function resizeCanvas(){
    const rect = galaxy.getBoundingClientRect();
    galaxy.width = Math.floor(rect.width * devicePixelRatio);
    galaxy.height = Math.floor(rect.height * devicePixelRatio);
    W = galaxy.width; H = galaxy.height;
    ctx = galaxy.getContext('2d');
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    layoutNodes();
    drawGalaxy();
  }

  function layoutNodes(){
    nodes = [];
    const cx = W / devicePixelRatio / 2;
    const cy = H / devicePixelRatio / 2;
    const R = Math.min(cx, cy) - 60;
    const N = DATA.paths.length;
    for (let i=0;i<N;i++){
      const a = (i / N) * Math.PI * 2 - Math.PI/2;
      const x = cx + R * Math.cos(a);
      const y = cy + R * Math.sin(a);
      nodes.push({
        id: DATA.paths[i].id,
        name: DATA.paths[i].name,
        color: DATA.paths[i].color,
        x, y,
        r: 22,
      });
    }
  }

  function drawGalaxy(){
    if (!ctx) return;
    const w = galaxy.width / devicePixelRatio;
    const h = galaxy.height / devicePixelRatio;
    ctx.clearRect(0,0,w,h);

    // stars background
    for (let i=0;i<70;i++){
      const x = Math.random()*w, y = Math.random()*h;
      const a = Math.random()*0.6 + 0.2;
      ctx.fillStyle = `rgba(200,240,255,${a})`;
      ctx.fillRect(x,y,1,1);
    }

    // center hub
    ctx.beginPath();
    ctx.arc(w/2, h/2, 34, 0, Math.PI*2);
    ctx.fillStyle = '#0a1729';
    ctx.fill();
    ctx.strokeStyle = '#145d66';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '600 12px Rajdhani';
    ctx.fillStyle = '#aef';
    ctx.textAlign = 'center';
    ctx.fillText('Command Hub', w/2, h/2 + 48);

    // orbit lines
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.moveTo(w/2, h/2);
      ctx.lineTo(n.x, n.y);
      ctx.strokeStyle = 'rgba(0,229,255,.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = '#0b1029';
      ctx.fill();
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '700 12px Rajdhani';
      ctx.fillStyle = '#cfe7ff';
      ctx.textAlign = 'center';
      ctx.fillText(shorten(n.name, 22), n.x, n.y + 34);
      if (state.artifacts[n.id]){
        // glow ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,0,212,.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  function shorten(s, max){
    return s.length > max ? s.slice(0, max-1) + '…' : s;
  }

  function nodeAt(x, y){
    return nodes.find(n => Math.hypot(n.x - x, n.y - y) <= n.r + 6);
  }

  galaxy.addEventListener('mousemove', (e) => {
    const rect = galaxy.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = nodeAt(x, y);
    if (hit){
      tooltip.style.display = 'block';
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      const p = DATA.paths.find(p => p.id === hit.id);
      tooltip.innerHTML = `<div><strong>${p.name}</strong></div><div class="sub">Mentor: ${p.mentor}</div>`;
      galaxy.style.cursor = 'pointer';
    } else {
      tooltip.style.display = 'none';
      galaxy.style.cursor = 'default';
    }
  });

  galaxy.addEventListener('click', (e) => {
    const rect = galaxy.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = nodeAt(x, y);
    if (hit){
      openPathModal(hit.id);
      window.CAE_AUDIO && window.CAE_AUDIO.sfx('open');
    }
  });

  window.addEventListener('resize', resizeCanvas);

  // ---------- Path Modal ----------
  const pathModal = $('#path-modal');
  const closePath = $('#close-path');
  const elPathName = $('#path-name');
  const elPathMentor = $('#path-mentor');
  const elPathArtifact = $('#path-artifact');
  const elPathVillain = $('#path-villain');
  const elPathBrief = $('#path-brief');
  const elPathLinks = $('#path-links');
  const elPathProgress = $('#path-progress');
  const btnQuiz = $('#btn-quiz');
  const btnChat = $('#btn-chat');

  let currentPath = null;

  function openPathModal(pathId){
    const p = DATA.paths.find(x => x.id === pathId);
    currentPath = p;
    elPathName.textContent = p.name;
    elPathMentor.textContent = `Mentor: ${p.mentor}`;
    elPathArtifact.textContent = `Artifact: ${p.artifact.name}`;
    elPathVillain.textContent = `Villain: ${p.villain}`;
    elPathBrief.textContent = p.brief;
    elPathLinks.innerHTML = '';
    p.links.forEach(l => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = l.url; a.target = '_blank'; a.rel='noopener noreferrer';
      a.textContent = l.label; a.style.color = p.color;
      li.appendChild(a);
      elPathLinks.appendChild(li);
    });
    renderPathProgress();
    showModal(pathModal);
  }

  function renderPathProgress(){
    const score = state.scores[currentPath.id] ?? 0;
    const got = !!state.artifacts[currentPath.id];
    elPathProgress.innerHTML = `
      <div><strong>Quiz score:</strong> ${score}%</div>
      <div><strong>Artifact:</strong> ${got ? 'Collected' : 'Locked'}</div>
      <div class="bar" style="margin-top:8px; height:12px; border:1px solid #123; border-radius:999px; overflow:hidden">
        <div style="width:${score}%; height:100%; background:linear-gradient(90deg, ${currentPath.color}, #9d4edd)"></div>
      </div>
    `;
  }

  closePath.addEventListener('click', () => hideModal(pathModal));
  btnQuiz.addEventListener('click', () => openQuiz());
  btnChat.addEventListener('click', () => openChat());

  // ---------- Quiz Modal ----------
  const quizModal = $('#quiz-modal');
  const quizBody = $('#quiz-body');
  const quizTitle = $('#quiz-title');
  const btnSubmitQuiz = $('#submit-quiz');
  const quizResult = $('#quiz-result');
  const closeQuiz = $('#close-quiz');

  function openQuiz(){
    quizResult.textContent = '';
    quizBody.innerHTML = '';
    quizTitle.textContent = `Boss Battle: ${currentPath.villain}`;
    currentPath.quiz.forEach((q, qi) => {
      const div = document.createElement('div');
      div.className = 'q';
      const p = document.createElement('p');
      p.textContent = `${qi+1}. ${q.q}`;
      div.appendChild(p);
      q.options.forEach((opt, oi) => {
        const id = `q_${qi}_${oi}`;
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio'; radio.name = `q_${qi}`; radio.value = String(oi); radio.id = id;
        label.htmlFor = id; label.textContent = opt;
        label.prepend(radio);
        div.appendChild(label);
      });
      quizBody.appendChild(div);
    });
    showModal(quizModal);
  }

  btnSubmitQuiz.addEventListener('click', () => {
    const answers = currentPath.quiz.map((q, qi) => {
      const sel = $(`input[name="q_${qi}"]:checked`, quizBody);
      return sel ? Number(sel.value) : -1;
    });
    let correct = 0;
    answers.forEach((a, i) => { if (a === currentPath.quiz[i].answer) correct++; });
    const pct = Math.round((correct / currentPath.quiz.length) * 100);
    state.scores[currentPath.id] = pct;
    if (pct >= 70) {
      state.artifacts[currentPath.id] = true;
      quizResult.style.color = '#12ef82';
      quizResult.textContent = `Victory! ${currentPath.mentor} congratulates you. Artifact unlocked: ${currentPath.artifact.name}.`;
      window.CAE_AUDIO && window.CAE_AUDIO.sfx('win');
    } else {
      quizResult.style.color = '#ff4d4f';
      quizResult.textContent = `${currentPath.villain} overwhelms you. Study the links and try again.`;
      window.CAE_AUDIO && window.CAE_AUDIO.sfx('fail');
    }
    saveState();
    renderPathProgress();
    renderInventory();
    renderLegacy();
    drawGalaxy();
  });

  $('#close-quiz').addEventListener('click', () => hideModal(quizModal));

  // ---------- Chat Modal (Mentor AI) ----------
  const chatModal = $('#chat-modal');
  const closeChatBtn = $('#close-chat');
  const chatTitle = $('#chat-title');
  const chatSub = $('#chat-mentor-sub');
  const chatLog = $('#chat-log');
  const chatText = $('#chat-text');
  const chatSend = $('#chat-send');

  function openChat(){
    chatLog.innerHTML = '';
    chatTitle.textContent = 'AI Mentor';
    chatSub.textContent = currentPath.mentor;
    showModal(chatModal);
    pushBot(`Welcome, Rookie Engineer. I am ${currentPath.mentor}. Ask me anything about ${currentPath.name}.`);
  }

  function pushUser(text){
    const div = document.createElement('div');
    div.className = 'msg user';
    div.innerHTML = `<div class="bubble"><div class="role">You</div><div>${escapeHtml(text)}</div></div>`;
    chatLog.appendChild(div); chatLog.scrollTop = chatLog.scrollHeight;
  }
  function pushBot(text){
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = `<div class="bubble"><div class="role">${currentPath.mentor}</div><div>${text}</div></div>`;
    chatLog.appendChild(div); chatLog.scrollTop = chatLog.scrollHeight;
  }
  function escapeHtml(s){
    return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  chatSend.addEventListener('click', sendChat);
  chatText.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
  function sendChat(){
    const text = chatText.value.trim();
    if (!text) return;
    pushUser(text);
    chatText.value='';
    // Simple local rule-based response via chatbot module
    const reply = window.CAE_CHATBOT ? window.CAE_CHATBOT.respond(currentPath.id, text) : "I'm thinking...";
    setTimeout(() => { pushBot(reply); window.CAE_AUDIO && window.CAE_AUDIO.sfx('chat'); }, 250);
  }

  closeChatBtn.addEventListener('click', () => hideModal(chatModal));

  // ---------- Inventory (Artifacts) ----------
  function renderInventory(){
    const gauntlet = $('#artifact-gauntlet');
    const list = $('#artifact-list');
    gauntlet.innerHTML = '';
    list.innerHTML = '';

    const order = ['mesh','endurance','impact','harmony','flow','energy','optim'];
    order.forEach(id => {
      const path = DATA.paths.find(p => p.id===id);
      const slot = document.createElement('div');
      slot.className = 'gem-slot' + (state.artifacts[id] ? ' active' : '');
      const gem = document.createElement('div');
      gem.className = `gem ${path.artifact.class}`;
      gem.title = path.artifact.name;
      slot.appendChild(gem);
      gauntlet.appendChild(slot);

      const row = document.createElement('div');
      row.className = 'panel';
      row.innerHTML = `<strong>${path.artifact.name}</strong> — ${state.artifacts[id] ? 'Collected' : 'Locked'} <span style="float:right;color:${path.color}">${path.name}</span>`;
      list.appendChild(row);
    });

    if (order.every(id => state.artifacts[id])){
      const banner = document.createElement('div');
      banner.className = 'panel';
      banner.style.borderColor = '#ff00d4';
      banner.innerHTML = `<strong>CAE Infinity Gauntlet Unlocked!</strong> — You have achieved Multiverse Mastery. (${DATA.WORLD_BOSS.name})`;
      list.prepend(banner);
      window.CAE_AUDIO && window.CAE_AUDIO.sfx('mastery');
    }
  }

  // ---------- Legacy Hall ----------
  function renderLegacy(){
    const grid = $('#legacy-grid');
    grid.innerHTML = '';

    // Player statue based on progress
    const collected = Object.keys(state.artifacts).length;
    const mastery = collected >= 7 ? 'Artifact Master' : collected >= 3 ? 'Rising Engineer' : 'Rookie Engineer';

    grid.appendChild(makeStatue('You', mastery));

    // Top guilds and legends (samples + dynamic from leaderboard)
    grid.appendChild(makeStatue('Mesh Avengers', 'Top Guild'));
    grid.appendChild(makeStatue('Crash Guardians', 'Top Guild'));
    state.leaderboard.slice(0,3).forEach(lb => {
      grid.appendChild(makeStatue(lb.name, `Legend (${lb.guild})`));
    });
  }

  function makeStatue(name, title){
    const tpl = $('#tpl-statue');
    const node = tpl.content.cloneNode(true);
    node.querySelector('.name').textContent = name;
    node.querySelector('.title').textContent = title;
    return node;
  }

  // ---------- Community ----------
  function renderCommunity(){
    const guilds = $('#guilds');
    const board = $('#leaderboard');
    const raidBtn = $('#btn-world-boss');
    const raidStatus = $('#raid-status');

    guilds.innerHTML = '';
    DATA.paths.forEach(p => {
      const g = document.createElement('span');
      const gname = guildName(p.id);
      g.className = 'guild';
      g.textContent = `${gname}`;
      g.style.color = p.color;
      guilds.appendChild(g);
    });

    board.innerHTML = '';
    state.leaderboard
      .slice()
      .sort((a,b) => b.score - a.score)
      .forEach(l => {
        const li = document.createElement('li');
        li.textContent = `${l.name} — ${l.score.toLocaleString()} pts — ${l.guild}`;
        board.appendChild(li);
      });

    raidBtn.onclick = () => {
      state.worldBoss.joined = true;
      state.worldBoss.progress = Math.min(100, (state.worldBoss.progress||0) + 10);
      raidStatus.textContent = `Raid joined! Coalition progress: ${state.worldBoss.progress}% — Boss: ${DATA.WORLD_BOSS.villain}`;
      saveState();
      window.CAE_AUDIO && window.CAE_AUDIO.sfx('raid');
    };
    raidStatus.textContent = state.worldBoss.joined ? `Coalition progress: ${state.worldBoss.progress}% — Boss: ${DATA.WORLD_BOSS.villain}` : 'Not joined yet.';
  }

  function guildName(id){
    switch(id){
      case 'mesh': return 'Mesh Avengers';
      case 'endurance': return 'Endurance Sentinels';
      case 'impact': return 'Crash Guardians';
      case 'harmony': return 'Harmony Order';
      case 'flow': return 'Flow Knights';
      case 'energy': return 'Energy Wardens';
      case 'optim': return 'Future Forge';
      default: return 'Guild';
    }
  }

  // ---------- Modal helpers ----------
  function showModal(el){ el.classList.add('show'); el.setAttribute('aria-hidden','false'); }
  function hideModal(el){ el.classList.remove('show'); el.setAttribute('aria-hidden','true'); }

  // ---------- Audio toggle ----------
  const audioToggle = $('#audioToggle');
  audioToggle.addEventListener('change', () => {
    if (window.CAE_AUDIO){
      window.CAE_AUDIO.setEnabled(audioToggle.checked);
    }
  });

  // ---------- Initial Render ----------
  function renderAll(){
    renderInventory();
    renderLegacy();
    renderCommunity();
    resizeCanvas();
  }

  // boot
  window.addEventListener('load', () => {
    renderAll();
    // Start with sound off by default
    audioToggle.checked = false;
    if (window.CAE_AUDIO) window.CAE_AUDIO.setEnabled(false);
    // Hide loading overlay after first render
    const loading = document.getElementById('loading');
    if (loading){
      setTimeout(() => loading.classList.add('hidden'), 400);
      // fully remove from DOM after transition
      setTimeout(() => loading.parentNode && loading.parentNode.removeChild(loading), 1200);
    }
  });

})();
