// CAE Multiverse - Audio (minimal, no external deps)
// Simple WebAudio wrapper for UI SFX and optional ambiance

window.CAE_AUDIO = (() => {
  let enabled = false;
  let ctx;

  function setEnabled(v){ enabled = !!v; }

  function ensureCtx(){
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  }

  function beep(freq=660, dur=0.08, type='sine', gain=0.03){
    try {
      ensureCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type; osc.frequency.value = freq;
      g.gain.value = gain; osc.connect(g); g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch(e){ /* noop */ }
  }

  function sfx(kind){
    if (!enabled) return;
    switch(kind){
      case 'open': beep(740, 0.07, 'triangle', 0.04); break;
      case 'win': beep(880, 0.09, 'sine', 0.05); setTimeout(()=>beep(1320,0.1,'sine',0.05), 100); break;
      case 'fail': beep(220, 0.12, 'sawtooth', 0.05); break;
      case 'chat': beep(520, 0.05, 'square', 0.03); break;
      case 'raid': beep(600, 0.07, 'square', 0.04); setTimeout(()=>beep(900,0.07,'square',0.04), 90); break;
      case 'mastery': beep(990,0.09,'sine',0.05); setTimeout(()=>beep(1480,0.09,'sine',0.05),100); setTimeout(()=>beep(1970,0.12,'sine',0.05),220); break;
    }
  }

  return { setEnabled, sfx };
})();
