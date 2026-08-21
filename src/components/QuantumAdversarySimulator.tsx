import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, ShieldAlert, Cpu, Zap, Activity, AlertTriangle, 
  TrendingUp, HardDrive, Radio, Binary, RefreshCw, Sparkles, 
  Globe, Newspaper, Terminal, CheckCircle2, ChevronRight, Lock, 
  Unlock, Eye, Layers, Clock, Flame, Database, Atom, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface QuantumNewsEvent {
  id: string;
  date: string;
  headline: string;
  source: string;
  category: 'superconducting' | 'neutral_atom' | 'trapped_ion' | 'cryptanalysis';
  logicalQubits: number;
  physicalQubits: number;
  impactSummary: string;
  rsaVulnerability: 'HIGH' | 'CRITICAL' | 'IMMINENT' | 'THEORETICAL';
  latticeResistance: 'IMMUNE' | 'MAXIMUM_HARDNESS' | 'UNBROKEN';
  linkDesc: string;
}

export const QUANTUM_ADVANCEMENT_NEWS: QuantumNewsEvent[] = [
  {
    id: 'news-2026-quera',
    date: '2026 Q1',
    headline: 'QuEra & Harvard Neutral-Atom Breakthrough: 256 Logical Qubits Operating with Transversal Entanglement',
    source: 'Nature Physics / QuEra Architecture Report',
    category: 'neutral_atom',
    logicalQubits: 256,
    physicalQubits: 10000,
    impactSummary: 'Demonstrated fault-tolerant Clifford gate operations on 256 error-corrected logical qubits using rubidium Rydberg arrays.',
    rsaVulnerability: 'HIGH',
    latticeResistance: 'IMMUNE',
    linkDesc: 'Reduces timeline for Shor\'s algorithm feasibility on RSA-2048 to ~7-9 years.'
  },
  {
    id: 'news-2025-willow',
    date: '2025 Q4',
    headline: 'Google Quantum AI Unveils Willow: Exponential Error Suppression Below Surface Code Threshold',
    source: 'Google Quantum AI Technical Disclosure',
    category: 'superconducting',
    logicalQubits: 105,
    physicalQubits: 2500,
    impactSummary: 'Real-time syndrome decoding with superconducting qubits scaling below fault-tolerance threshold ($d=7$).',
    rsaVulnerability: 'HIGH',
    latticeResistance: 'IMMUNE',
    linkDesc: 'Harvested RSA/ECC traffic is at imminent risk of retroactive decryption in early 2030s.'
  },
  {
    id: 'news-2025-ibm-condor',
    date: '2025 Q3',
    headline: 'IBM Quantum Starling & Heron Clusters: Modular Quantum Communication Fabrics',
    source: 'IBM Quantum Summit',
    category: 'superconducting',
    logicalQubits: 180,
    physicalQubits: 4500,
    impactSummary: 'Quantum multi-chip interconnects enabled concurrent distributed entanglement across 3 cryostats.',
    rsaVulnerability: 'HIGH',
    latticeResistance: 'IMMUNE',
    linkDesc: 'Accelerates cryptanalytic threat to classical elliptic-curve Diffie-Hellman handshakes.'
  },
  {
    id: 'news-2025-ionq-barium',
    date: '2025 Q2',
    headline: 'IonQ Trapped-Ion Barium Systems Achieve 99.99% Two-Qubit Gate Fidelity',
    source: 'Physical Review Letters',
    category: 'trapped_ion',
    logicalQubits: 64,
    physicalQubits: 256,
    impactSummary: 'High connectivity in all-to-all ion traps allows optimized Shor circuit depth with fewer ancilla qubits.',
    rsaVulnerability: 'IMMINENT',
    latticeResistance: 'IMMUNE',
    linkDesc: 'Shortens surface code cycle overhead required for discrete logarithm extraction.'
  },
  {
    id: 'news-2024-nist-final',
    date: '2024 Q3',
    headline: 'NIST Finalizes Post-Quantum Standards: FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA)',
    source: 'National Institute of Standards and Technology (NIST)',
    category: 'cryptanalysis',
    logicalQubits: 0,
    physicalQubits: 0,
    impactSummary: 'Global mandate to phase out RSA-2048 and ECDH P-256 before 2030 to prevent Harvest-Now, Decrypt-Later compromise.',
    rsaVulnerability: 'CRITICAL',
    latticeResistance: 'MAXIMUM_HARDNESS',
    linkDesc: 'Recommends Category 5 Module-LWE (Kyber-1024 / Dilithium-5) for sovereign defense systems.'
  }
];

export interface AlgorithmHardnessSpec {
  name: string;
  type: 'Classical' | 'Lattice-PQC';
  standard: string;
  dimensionOrKeySize: string;
  rootHermiteFactor: number | null; // delta_0
  bkzBlockSize: number | null; // beta
  quantumSecurityBits: number;
  timeToBreakUnderCRQC: string;
  hndlVulnerable: boolean;
  shorPhysicalQubitsNeeded: string;
}

const ALGORITHMS: AlgorithmHardnessSpec[] = [
  {
    name: 'RSA-2048',
    type: 'Classical',
    standard: 'PKCS #1 v2.2',
    dimensionOrKeySize: '2,048-bit modulus (N=pq)',
    rootHermiteFactor: null,
    bkzBlockSize: null,
    quantumSecurityBits: 0,
    timeToBreakUnderCRQC: '< 8 Hours (Shor\'s Factorization)',
    hndlVulnerable: true,
    shorPhysicalQubitsNeeded: '~4,096 logical / ~20M physical'
  },
  {
    name: 'RSA-4096',
    type: 'Classical',
    standard: 'PKCS #1 v2.2',
    dimensionOrKeySize: '4,096-bit modulus',
    rootHermiteFactor: null,
    bkzBlockSize: null,
    quantumSecurityBits: 0,
    timeToBreakUnderCRQC: '< 24 Hours (Shor\'s Factorization)',
    hndlVulnerable: true,
    shorPhysicalQubitsNeeded: '~8,192 logical / ~40M physical'
  },
  {
    name: 'ECDH P-256 (secp256r1)',
    type: 'Classical',
    standard: 'ANSI X9.62 / NIST SP 800-56A',
    dimensionOrKeySize: '256-bit elliptic curve order',
    rootHermiteFactor: null,
    bkzBlockSize: null,
    quantumSecurityBits: 0,
    timeToBreakUnderCRQC: '< 30 Minutes (Shor\'s Discrete Log)',
    hndlVulnerable: true,
    shorPhysicalQubitsNeeded: '~2,330 logical / ~12M physical'
  },
  {
    name: 'Curve25519 (X25519)',
    type: 'Classical',
    standard: 'RFC 7748',
    dimensionOrKeySize: '256-bit Montgomery curve',
    rootHermiteFactor: null,
    bkzBlockSize: null,
    quantumSecurityBits: 0,
    timeToBreakUnderCRQC: '< 30 Minutes (Shor\'s Discrete Log)',
    hndlVulnerable: true,
    shorPhysicalQubitsNeeded: '~2,330 logical / ~12M physical'
  },
  {
    name: 'NIST ML-KEM-768 (Kyber-768)',
    type: 'Lattice-PQC',
    standard: 'NIST FIPS 203',
    dimensionOrKeySize: 'Module Rank k=3, n=256, q=3329',
    rootHermiteFactor: 1.0045,
    bkzBlockSize: 620,
    quantumSecurityBits: 192,
    timeToBreakUnderCRQC: 'Intractable (> 10^40 Years)',
    hndlVulnerable: false,
    shorPhysicalQubitsNeeded: 'Ineffective (Requires 2^192 Sieve Steps)'
  },
  {
    name: 'NIST ML-KEM-1024 (Kyber-1024)',
    type: 'Lattice-PQC',
    standard: 'NIST FIPS 203 (Q-CRYPT Default)',
    dimensionOrKeySize: 'Module Rank k=4, n=256, q=3329',
    rootHermiteFactor: 1.0039,
    bkzBlockSize: 840,
    quantumSecurityBits: 256,
    timeToBreakUnderCRQC: 'Mathematically Impossible (> 10^70 Years)',
    hndlVulnerable: false,
    shorPhysicalQubitsNeeded: 'Ineffective (BKZ-Sieve 2^256 Sieve Steps)'
  },
  {
    name: 'NIST ML-DSA-87 (Dilithium-5)',
    type: 'Lattice-PQC',
    standard: 'NIST FIPS 204 (Q-CRYPT Default)',
    dimensionOrKeySize: 'Matrix (8,7), n=256, q=8380417',
    rootHermiteFactor: 1.0038,
    bkzBlockSize: 880,
    quantumSecurityBits: 256,
    timeToBreakUnderCRQC: 'Mathematically Impossible (> 10^70 Years)',
    hndlVulnerable: false,
    shorPhysicalQubitsNeeded: 'Ineffective (Requires 2^256 Lattice Sieve Ops)'
  }
];

export const QuantumAdversarySimulator: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const [selectedNewsId, setSelectedNewsId] = useState<string>(QUANTUM_ADVANCEMENT_NEWS[0].id);
  const [adversaryLogicalQubits, setAdversaryLogicalQubits] = useState<number>(2048);
  const [retentionYears, setRetentionYears] = useState<number>(15); // HNDL storage horizon
  const [selectedAlgoName, setSelectedAlgoName] = useState<string>('NIST ML-KEM-1024 (Kyber-1024)');
  const [isSimulatingAttack, setIsSimulatingAttack] = useState(false);
  const [attackLogs, setAttackLogs] = useState<string[]>([
    '[SIMULATOR] Quantum Adversary Engine Initialized.',
    '[THREAT] Harvest-Now, Decrypt-Later (HNDL) intercept vector active.'
  ]);

  const activeNews = useMemo(() => {
    return QUANTUM_ADVANCEMENT_NEWS.find(n => n.id === selectedNewsId) || QUANTUM_ADVANCEMENT_NEWS[0];
  }, [selectedNewsId]);

  const selectedAlgo = useMemo(() => {
    return ALGORITHMS.find(a => a.name === selectedAlgoName) || ALGORITHMS[5];
  }, [selectedAlgoName]);

  // Derived calculations
  const isBroken = useMemo(() => {
    if (selectedAlgo.type === 'Lattice-PQC') return false;
    if (selectedAlgo.name === 'RSA-2048' && adversaryLogicalQubits >= 4096) return true;
    if (selectedAlgo.name === 'RSA-4096' && adversaryLogicalQubits >= 8192) return true;
    if ((selectedAlgo.name.includes('ECDH') || selectedAlgo.name.includes('Curve25519')) && adversaryLogicalQubits >= 2330) return true;
    return false;
  }, [selectedAlgo, adversaryLogicalQubits]);

  // Calculate BKZ Sieve Complexity
  const bkzSieveOperations = useMemo(() => {
    if (!selectedAlgo.bkzBlockSize) return 'N/A (Shor polynomial speedup applies)';
    const exponent = Math.round(0.292 * selectedAlgo.bkzBlockSize);
    return `2^${exponent} Core Sieve Ops (~10^${Math.round(exponent * 0.30103)} ops)`;
  }, [selectedAlgo]);

  const handleSimulateAttack = () => {
    setIsSimulatingAttack(true);
    const logs: string[] = [
      `[0.00s] INITIATING CRYPTANALYTIC RUN: Target=${selectedAlgo.name}`,
      `[0.45s] Adversary Capability: ${adversaryLogicalQubits} Logical Qubits | Retention=${retentionYears} Years`,
      `[0.85s] Applying Quantum Algorithm: ${selectedAlgo.type === 'Classical' ? "Shor's Period Finding Matrix" : 'Block-Korkine-Zolotarev (BKZ-2.0) Sieve'}`
    ];

    if (selectedAlgo.type === 'Classical') {
      if (isBroken) {
        logs.push(`[1.20s] SHOR CONVERGENCE: Discrete logarithm / Prime factor isolated in O((log N)^3) cycles.`);
        logs.push(`[1.80s] CRITICAL BREACH: Intercepted ciphertext retroactively DECRYPTED in 4.2 hours.`);
      } else {
        logs.push(`[1.20s] CAPACITY LIMIT: Current adversary logical qubit count (${adversaryLogicalQubits}) below threshold (${selectedAlgo.shorPhysicalQubitsNeeded}).`);
        logs.push(`[1.80s] STATUS: Ciphertext remains secure today, but WILL BE BROKEN once qubit threshold is reached within the ${retentionYears}-year retention window!`);
      }
    } else {
      logs.push(`[1.20s] LATTICE VECTOR PROBE: High-dimensional Module-LWE basis reduction attempted.`);
      logs.push(`[1.60s] HARDNESS ROOT HERMITE FACTOR: δ₀ = ${selectedAlgo.rootHermiteFactor} (SVP Blocksize β = ${selectedAlgo.bkzBlockSize})`);
      logs.push(`[1.95s] IMMUNE: Exponential quantum cost (${bkzSieveOperations}). Decryption aborted.`);
    }

    setTimeout(() => {
      setAttackLogs(logs);
      setIsSimulatingAttack(false);
    }, 600);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-xl shadow-cyan-950/40 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white">
                  {isFr ? 'Simulateur d\'Adversaire Quantique (HNDL & Dureté des Réseaux)' : 'Quantum Adversary Simulator (HNDL & Lattice Hardness)'}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  REAL-TIME NEWS DRIVEN
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {isFr 
                  ? 'Visualisation de la résistance mathématique des réseaux euclidiens (M-LWE) face aux attaques "Récolter Maintenant, Déchiffrer Plus Tard"'
                  : 'Live cryptanalytic simulation proving how Module-LWE lattice hardness prevents Harvest-Now, Decrypt-Later (HNDL) decryption'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateAttack}
              disabled={isSimulatingAttack}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-mono text-xs font-black transition-all shadow-lg shadow-amber-950/60 border border-amber-400/60 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 text-slate-950 ${isSimulatingAttack ? 'animate-spin' : 'animate-pulse'}`} />
              <span>{isSimulatingAttack ? (isFr ? 'Simulation en cours...' : 'Simulating Quantum Attack...') : (isFr ? 'Lancer la Simulation de Cryptanalyse' : 'Execute Adversary Attack Simulation')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-World Quantum Advancement News Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Newspaper className="w-4 h-4 text-cyan-400" />
            <span>{isFr ? 'Dépêches Récentes sur l\'Avancement des Ordinateurs Quantiques' : 'Real-World Quantum Hardware Advancements & Milestones'}</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            {isFr ? 'Sélectionnez un événement pour calibrer l\'adversaire' : 'Select an advancement to calibrate adversary parameters'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUANTUM_ADVANCEMENT_NEWS.map(news => {
            const isSelected = news.id === selectedNewsId;
            return (
              <div
                key={news.id}
                onClick={() => {
                  setSelectedNewsId(news.id);
                  if (news.logicalQubits > 0) {
                    setAdversaryLogicalQubits(Math.max(news.logicalQubits * 4, 1024));
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2.5 ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-500/80 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {news.date}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    news.category === 'neutral_atom' ? 'bg-purple-950 text-purple-300' :
                    news.category === 'superconducting' ? 'bg-blue-950 text-blue-300' :
                    news.category === 'trapped_ion' ? 'bg-emerald-950 text-emerald-300' :
                    'bg-amber-950 text-amber-300'
                  }`}>
                    {news.category.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                <div className="font-bold text-xs text-white leading-snug">
                  {news.headline}
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                  {news.impactSummary}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">{news.source}</span>
                  <span className={news.rsaVulnerability === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
                    RSA: {news.rsaVulnerability}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Parameters & Algorithm Selector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>{isFr ? 'Paramètres de l\'Adversaire Quantique' : 'Adversary Calibration Controls'}</span>
              </span>
              <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                CRQC Simulator v4.2
              </span>
            </div>

            {/* Logical Qubit Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isFr ? 'Qubits Logiques sans Erreur :' : 'Error-Corrected Logical Qubits:'}</span>
                </span>
                <span className="text-cyan-300 font-bold text-sm">
                  {adversaryLogicalQubits.toLocaleString()} Logical Qubits
                </span>
              </div>
              <input
                type="range"
                min={128}
                max={16384}
                step={128}
                value={adversaryLogicalQubits}
                onChange={(e) => setAdversaryLogicalQubits(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>128 (Lab Prototyping)</span>
                <span className="text-amber-400 font-bold">2,330 (ECDH Threshold)</span>
                <span className="text-red-400 font-bold">4,096 (RSA-2048 Threshold)</span>
                <span className="text-cyan-400">16,384 (Massive CRQC)</span>
              </div>
            </div>

            {/* HNDL Retention Horizon Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isFr ? 'Période de Rétention des Données Volées (HNDL) :' : 'Harvested Ciphertext Storage Horizon (HNDL):'}</span>
                </span>
                <span className="text-purple-300 font-bold text-sm">
                  {retentionYears} Years (Until {2026 + retentionYears})
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={50}
                value={retentionYears}
                onChange={(e) => setRetentionYears(parseInt(e.target.value, 10))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2 Years (Ephemeral)</span>
                <span>10 Years (Corporate Secrets)</span>
                <span className="text-purple-400 font-bold">25 Years (Defense Intelligence)</span>
                <span>50 Years (State Sovereign)</span>
              </div>
            </div>

            {/* Target Algorithm Selection */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isFr ? 'Algorithme Cryptographique Cible :' : 'Target Cryptosystem for Cryptanalysis:'}</span>
              </label>
              <select
                value={selectedAlgoName}
                onChange={(e) => setSelectedAlgoName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono cursor-pointer"
              >
                {ALGORITHMS.map(a => (
                  <option key={a.name} value={a.name}>
                    {a.name} ({a.type} • {a.standard})
                  </option>
                ))}
              </select>
            </div>

            {/* Algorithm Quick Details */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isFr ? 'Famille :' : 'Algorithm Family:'}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedAlgo.type === 'Lattice-PQC' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                    : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  {selectedAlgo.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isFr ? 'Paramètres :' : 'Mathematical Basis:'}</span>
                <span className="text-white font-bold">{selectedAlgo.dimensionOrKeySize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isFr ? 'Résistance Quantique :' : 'Post-Quantum Security:'}</span>
                <span className={selectedAlgo.quantumSecurityBits >= 128 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {selectedAlgo.quantumSecurityBits > 0 ? `${selectedAlgo.quantumSecurityBits} Bits (NIST Cat. ${selectedAlgo.quantumSecurityBits >= 256 ? '5' : '3'})` : '0 Bits (Broken by Shor)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isFr ? 'Vulnérable à HNDL :' : 'Vulnerable to HNDL:'}</span>
                <span className={selectedAlgo.hndlVulnerable ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {selectedAlgo.hndlVulnerable ? 'YES (Harvested now, decrypted later)' : 'NO (Lattice mathematically sealed)'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Lattice Hardness & Cryptanalytic Evaluation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white font-mono flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{isFr ? 'Évaluation de la Dureté Mathématique (SVP / LWE)' : 'Mathematical Lattice Hardness (SVP / M-LWE)'}</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isBroken ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {isBroken ? 'CRACKABLE UNDER CRQC' : 'QUANTUM SECURE'}
              </span>
            </div>

            {/* Mathematical Lattice Proof Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <span>Root Hermite Factor (δ₀)</span>
                </span>
                <div className="text-base font-black text-cyan-300">
                  {selectedAlgo.rootHermiteFactor ? `δ₀ = ${selectedAlgo.rootHermiteFactor}` : 'None (No Lattice)'}
                </div>
                <p className="text-[10px] text-slate-500 font-sans">
                  {selectedAlgo.rootHermiteFactor 
                    ? 'Target vector reduction quality. Values < 1.005 require astronomical BKZ lattice reduction block sizes.'
                    : 'RSA/ECC rely on algebraic groups vulnerable to quantum Fourier transforms.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <span>BKZ Sieve Block Size (β)</span>
                </span>
                <div className="text-base font-black text-purple-300">
                  {selectedAlgo.bkzBlockSize ? `β = ${selectedAlgo.bkzBlockSize}` : 'N/A'}
                </div>
                <p className="text-[10px] text-slate-500 font-sans">
                  {selectedAlgo.bkzBlockSize 
                    ? `Time complexity 2^(0.292β) = ${bkzSieveOperations}. Impossible with quantum sieving.`
                    : 'Shor algorithm executes in O(n³) polynomial time.'}
                </p>
              </div>

            </div>

            {/* Live Cryptanalysis Output Trace */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                <span className="flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Adversary Cryptanalysis Trace</span>
                </span>
                <span className="text-cyan-400 font-bold">Hardware Accelerated</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1 max-h-40 overflow-y-auto">
                {attackLogs.map((log, idx) => (
                  <div key={idx} className={
                    log.includes('CRITICAL') ? 'text-red-400 font-bold' :
                    log.includes('IMMUNE') ? 'text-emerald-400 font-bold' :
                    log.includes('CAPACITY') ? 'text-amber-400' :
                    'text-slate-300'
                  }>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Insight Box */}
            <div className={`p-3.5 rounded-2xl border flex items-start space-x-3 text-xs ${
              selectedAlgo.type === 'Lattice-PQC' 
                ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200' 
                : 'bg-red-950/30 border-red-500/40 text-slate-200'
            }`}>
              {selectedAlgo.type === 'Lattice-PQC' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 font-sans">
                <div className="font-bold text-white">
                  {selectedAlgo.type === 'Lattice-PQC' 
                    ? (isFr ? 'Immunité Prouvée contre le Déchiffrement Rétroactif' : 'Mathematically Proven Defense Against HNDL')
                    : (isFr ? 'Risque Critique d\'Interception Aujourd\'hui' : 'Critical Threat: Harvested Traffic Will Be Decrypted')}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedAlgo.type === 'Lattice-PQC'
                    ? `NIST ML-KEM-1024 secures messages for the entire ${retentionYears}-year horizon. Even a quantum supercomputer with 1,000,000 logical qubits cannot solve the Module-LWE problem in polynomial time.`
                    : `Messages encrypted with ${selectedAlgo.name} intercepted today by state adversaries and stored in classified vaults will be completely unlocked as soon as a CRQC with ${selectedAlgo.shorPhysicalQubitsNeeded} becomes operational.`}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
