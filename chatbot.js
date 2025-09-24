// CAE Multiverse - Mentor Chatbot (local, rule-based)
// Provides playful, motivational banter tailored to each path

window.CAE_CHATBOT = (() => {
  const personas = {
    mesh: {
      name: 'Iron Mentor',
      style: [
        "That's a weak mesh, rookie. Aim for orthogonality above 0.2 and keep skewness low.",
        "Precision beats brute force. A million bad elements won’t save a sloppy boundary layer.",
      ],
      rules: [
        { k: /skew|quality|aspect|orth/i, r: 'Golden rules: minimize skewness, maximize orthogonality, tame aspect ratio. Mesh smart, not dense.' },
        { k: /boundary|y\+|wall/i, r: 'For wall modeling, target appropriate y+. Resolve the boundary layer with smooth growth (1.2–1.3).'},
      ],
    },
    endurance: {
      name: 'Shield Captain',
      style: [
        'Every cycle builds character—and cracks. Respect the S-N curve.',
        'A notch today is a failure tomorrow. Smooth the load path.'
      ],
      rules: [
        { k: /s[- ]?n|w\-?ohler|fatigue/i, r: 'Use the S–N curve and Miner’s rule for damage. Watch mean stress with Goodman or Gerber.' },
        { k: /notch|fillet|stress/i, r: 'Add fillets, remove sharp corners, polish surfaces. Compressive residual stress helps.' },
      ],
    },
    impact: {
      name: 'Prime Hulk',
      style: [
        'Every crash you simulate saves a life.',
        'Smash ignorance, not the solver stability.'
      ],
      rules: [
        { k: /time step|dt|stable/i, r: 'Stable time step scales with smallest element and wave speed. Refine carefully.' },
        { k: /energy|hourglass|balance/i, r: 'Check energies: Internal + Kinetic ≈ External work. Keep hourglass energy low.' },
      ],
    },
    harmony: {
      name: 'Arcane Doctor',
      style: [
        'Resonance is like magic—control it, or it consumes you.',
        'Silence the chaos; tune the modes.'
      ],
      rules: [
        { k: /resonance|mode|freq/i, r: 'Avoid excitation near natural frequencies. Use damping and design shifts to dodge resonance.' },
        { k: /acoustic|noise|nvs|nvh/i, r: 'Couple structure and acoustics for cabin noise. Treat seals, mounts, and absorbers wisely.' },
      ],
    },
    flow: {
      name: 'Aqua Torch',
      style: [
        'Flow like water, compute like fire.',
        'Stability starts at the boundary conditions.'
      ],
      rules: [
        { k: /turbulence|k-|reynolds|r[eE]/i, r: 'Pick turbulence model per regime: k-ε, k-ω SST, or LES. Watch Reynolds and y+.' },
        { k: /thermal|cool|heat|cht/i, r: 'For CHT, match mesh at interfaces and apply correct heat sources and material props.' },
      ],
    },
    energy: {
      name: 'Storm Hammer',
      style: [
        'Power without stability is chaos.',
        'Bind heat, stress, and fields into one disciplined strike.'
      ],
      rules: [
        { k: /joule|i\^?2\s*r|ohm/i, r: 'Joule heating ~ I^2 R. Resistive losses grow with temperature—update properties.' },
        { k: /coupl|em|electro|magnet/i, r: 'Electromagnetic-thermal coupling changes resistance and force densities; iterate to convergence.' },
      ],
    },
    optim: {
      name: 'Visionary Forge',
      style: [
        'Let data guide the blade; shape the future.',
        'Constrain smartly. Optimize wisely.'
      ],
      rules: [
        { k: /topolog|compliance|densit/i, r: 'Topology optimization: minimize compliance with volume and manufacturing constraints.' },
        { k: /surrogate|ml|ai|bayes/i, r: 'Surrogates speed exploration—validate against high-fidelity sims and track uncertainty.' },
      ],
    },
  };

  const generic = [
    'Clarify your objective and constraints first—then choose tools.',
    'Small experiments beat big assumptions. Iterate fast, learn faster.',
    'Document decisions. Future you will thank you.'
  ];

  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function respond(pathId, text){
    const p = personas[pathId] || { name: 'Mentor', style: [], rules: [] };
    for (const r of p.rules){
      if (r.k.test(text)) return withFlavor(p, r.r);
    }
    // fun banter triggers
    if (/hello|hi|hey/i.test(text)) return withFlavor(p, 'Welcome, Rookie. The multiverse awaits. What challenge do you face?');
    if (/tip|help|advice/i.test(text)) return withFlavor(p, pick(generic));
    if (/artifact|stone|crown|crystal/i.test(text)) return withFlavor(p, 'Artifacts mark milestones of mastery. Earn them by defeating bad practices.');
    return withFlavor(p, pick(p.style.concat(generic)));
  }

  function withFlavor(p, msg){
    return `${msg}`;
  }

  return { respond };
})();
