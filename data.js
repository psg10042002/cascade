// CAE Multiverse - Game Data
// Paths (guilds), mentors, villains, artifacts, quiz questions, and real-world links

window.CAE_DATA = (() => {
  const paths = [
    {
      id: 'mesh',
      name: 'Meshing Realm — The Forge of Precision',
      mentor: 'Iron Mentor (inspired by Iron Man)',
      villain: 'Loki — Trickster Mesh',
      artifact: { id: 'mesh', name: 'Mesh Stone', class: 'mesh' },
      color: '#00e5ff',
      brief: 'Craft high-quality meshes that balance accuracy and performance. Beware distorted elements and poor aspect ratios.',
      links: [
        { label: 'SpaceX rocket meshing (article)', url: 'https://www.spacex.com/' },
        { label: 'Meshing best practices', url: 'https://en.wikipedia.org/wiki/Mesh_generation' },
      ],
      quiz: [
        {
          q: 'Which metric best indicates element distortion in a tetrahedral mesh?',
          options: ['Skewness', 'Thickness', 'Porosity', 'Viscosity'],
          answer: 0,
        },
        {
          q: 'For boundary layers, which property is most critical?',
          options: ['Orthogonality and y+', 'Color of elements', 'Number of nodes only', 'Random seeding'],
          answer: 0,
        },
      ],
    },
    {
      id: 'endurance',
      name: 'Durability & Fatigue — Path of Endurance',
      mentor: 'Shield Captain (inspired by Captain America)',
      villain: 'Bane — Breaker of Structures',
      artifact: { id: 'endurance', name: 'Endurance Core', class: 'endurance' },
      color: '#ffd166',
      brief: 'Predict life under cyclic loading using S-N curves and damage accumulation. Avoid stress concentrators.',
      links: [
        { label: 'Tesla chassis fatigue (case study)', url: 'https://www.tesla.com/' },
        { label: 'Fatigue basics', url: 'https://en.wikipedia.org/wiki/Fatigue_(material)' },
      ],
      quiz: [
        {
          q: 'High-cycle fatigue typically involves:',
          options: ['Low stresses, many cycles', 'High stresses, few cycles', 'Creep only', 'Thermal only'],
          answer: 0,
        },
        {
          q: 'Which feature commonly reduces fatigue life?',
          options: ['Fillets', 'Polishing', 'Sharp notches', 'Compressive residual stress'],
          answer: 2,
        },
      ],
    },
    {
      id: 'impact',
      name: 'Crash & Safety — Path of Impact',
      mentor: 'Prime Hulk (inspired by Optimus + Hulk)',
      villain: 'Ultron — Ruthless Impact',
      artifact: { id: 'impact', name: 'Impact Prism', class: 'impact' },
      color: '#ff4d4f',
      brief: 'Simulate high-rate deformations with proper material models, contacts, and energy balance.',
      links: [
        { label: 'Euro NCAP crash tests', url: 'https://www.euroncap.com/' },
        { label: 'Explicit dynamics overview', url: 'https://en.wikipedia.org/wiki/Finite_element_method' },
      ],
      quiz: [
        {
          q: 'In explicit crash simulations, stable time step is mainly controlled by:',
          options: ['Largest element size', 'Smallest element size', 'Solver RAM', 'Number of CPUs'],
          answer: 1,
        },
        {
          q: 'An energy balance check should show:',
          options: ['Internal + Kinetic ≈ Total Work', 'Only Kinetic rises', 'Only Hourglass energy matters', 'Mass is irrelevant'],
          answer: 0,
        },
      ],
    },
    {
      id: 'harmony',
      name: 'NVH & Acoustics — Path of Harmony',
      mentor: 'Arcane Doctor (inspired by Doctor Strange)',
      villain: 'Screech — Master of Chaos Noise',
      artifact: { id: 'harmony', name: 'Resonance Crystal', class: 'harmony' },
      color: '#60a5fa',
      brief: 'Control vibrations and sound using modes, damping, and acoustic coupling. Avoid resonance amplification.',
      links: [
        { label: 'Bose noise cancellation in EVs', url: 'https://www.bose.com/' },
        { label: 'Modal analysis basics', url: 'https://en.wikipedia.org/wiki/Modal_analysis' },
      ],
      quiz: [
        {
          q: 'Resonance occurs when:',
          options: ['Excitation frequency ≈ natural frequency', 'Mass = 0', 'Damping = 0 always', 'All modes are rigid'],
          answer: 0,
        },
        {
          q: 'Adding damping typically:',
          options: ['Reduces peak response', 'Increases resonance frequency', 'Creates more modes', 'Eliminates stiffness'],
          answer: 0,
        },
      ],
    },
    {
      id: 'flow',
      name: 'CFD & Thermal — Path of Flow',
      mentor: 'Aqua Torch (inspired by Aquaman + Human Torch)',
      villain: 'Hydro-Man — Lord of Turbulence',
      artifact: { id: 'flow', name: 'Flow Stone', class: 'flow' },
      color: '#00bbf9',
      brief: 'Master turbulence modeling, boundary conditions, and conjugate heat transfer for cooling and aero.',
      links: [
        { label: 'Formula 1 aerodynamics', url: 'https://www.formula1.com/' },
        { label: 'Battery cooling design', url: 'https://en.wikipedia.org/wiki/Lithium-ion_battery_thermal_management' },
      ],
      quiz: [
        {
          q: 'k-ε and k-ω are:',
          options: ['Turbulence models', 'Meshing tools', 'Equation of state', 'Thermocouple types'],
          answer: 0,
        },
        {
          q: 'CFD stability and accuracy benefit most from:',
          options: ['Proper BCs and y+', 'Random initial conditions only', 'No mesh near walls', 'Ignoring heat sources'],
          answer: 0,
        },
      ],
    },
    {
      id: 'energy',
      name: 'Multiphysics & EM — Path of Energy',
      mentor: 'Storm Hammer (inspired by Thor + Tesla)',
      villain: 'Electro — Instability of Power',
      artifact: { id: 'energy', name: 'Thermal Flame', class: 'energy' },
      color: '#7bdff2',
      brief: 'Couple thermal, structural, and electromagnetic physics. Ensure stable co-simulation and correct couplings.',
      links: [
        { label: 'EV motor multiphysics', url: 'https://www.tesla.com/' },
        { label: 'Satellite thermal/EM', url: 'https://www.nasa.gov/' },
      ],
      quiz: [
        {
          q: 'Joule heating is proportional to:',
          options: ['I^2 R', 'V/I', 'k * grad(T)', 'Cp * dT'],
          answer: 0,
        },
        {
          q: 'Electromagnetic-thermal coupling affects:',
          options: ['Resistance and losses', 'Only mesh size', 'Only color maps', 'Only user interface'],
          answer: 0,
        },
      ],
    },
    {
      id: 'optim',
      name: 'Optimization & AI — Path of the Future',
      mentor: 'Panther Shuri + Visionary Core (inspired by Shuri + Vision)',
      villain: 'Brainiac — Complexity Overlord',
      artifact: { id: 'optim', name: 'Optimization Crown', class: 'optim' },
      color: '#ff00d4',
      brief: 'Use design-space exploration, topology optimization, and ML to find lighter, stronger designs.',
      links: [
        { label: 'Airbus generative design', url: 'https://www.airbus.com/' },
        { label: 'Topology optimization', url: 'https://en.wikipedia.org/wiki/Topology_optimization' },
      ],
      quiz: [
        {
          q: 'Topology optimization commonly minimizes:',
          options: ['Compliance (maximize stiffness)', 'Color', 'Mesh count only', 'Number of clicks'],
          answer: 0,
        },
        {
          q: 'Surrogate models help by:',
          options: ['Reducing expensive evaluations', 'Increasing mesh skew', 'Hiding constraints', 'Eliminating physics'],
          answer: 0,
        },
      ],
    },
  ];

  const WORLD_BOSS = {
    id: 'cosmic',
    name: 'Space & Defense Sim — The Cosmic Path',
    mentor: 'Star Ranger + Mech Pilots (inspired by Buzz Lightyear + Gundam)',
    villain: 'Thanos — Titan of Failure',
    artifact: { id: 'gauntlet', name: 'CAE Infinity Gauntlet' },
    links: [
      { label: 'NASA re-entry', url: 'https://www.nasa.gov/' },
      { label: 'Hypersonics overview', url: 'https://en.wikipedia.org/wiki/Hypersonic_speed' },
    ],
  };

  return { paths, WORLD_BOSS };
})();
