import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Cpu, Lock, AlertTriangle, Play, RefreshCw, 
  CheckCircle2, XCircle, ArrowRight, Zap, Copy, Download, Layers, Server, Activity, FileText,
  Sliders, Gauge, Clock, Shield, Sparkles, Terminal
} from 'lucide-react';
import { useToast } from './Toast';

export interface UserInfrastructure {
  asymmetricAlgo: 'rsa2048' | 'rsa4096' | 'ecc256' | 'hybrid' | 'mlkem1024';
  symmetricAlgo: 'des3' | 'aes128' | 'aes256' | 'chacha20';
  keyStorage: 'software' | 'cloudKms' | 'mobileEnclave' | 'fipsHsm';
  networkTunnel: 'tls12' | 'tls13classical' | 'hybridPqc' | 'qcryptMesh';
}

export type QuantumCapacity = '1024_nisq' | '4096_logical' | '10000_cluster';
export type InterceptTimeline = 'near_term' | 'q_day_horizon' | 'scaled_crqc';

export interface AttackScenario {
  id: string;
  name: string;
  threatActor: string;
  mechanism: string;
  quantumTool: string;
  quantumQubits: string;
  vulnerabilityEvaluation: (infra: UserInfrastructure, capacity: QuantumCapacity) => {
    isVulnerable: boolean;
    severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'IMMUNE';
    breachProbability: number; // 0 - 100%
    timeToCompromise: string;
    impactDescription: string;
    mitigationStep: string;
  };
}

export const QuantumThreatAssessment: React.FC = () => {
  const { showToast } = useToast();

  const [infra, setInfra] = useState<UserInfrastructure>({
    asymmetricAlgo: 'rsa2048',
    symmetricAlgo: 'aes128',
    keyStorage: 'software',
    networkTunnel: 'tls13classical'
  });

  const [quantumCapacity, setQuantumCapacity] = useState<QuantumCapacity>('4096_logical');
  const [interceptTimeline, setInterceptTimeline] = useState<InterceptTimeline>('q_day_horizon');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [hasRunSimulation, setHasRunSimulation] = useState<boolean>(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('shor-factorization');

  // Preset Architecture Templates
  const applyPreset = (type: 'legacy' | 'standard' | 'hybrid' | 'fortified') => {
    if (type === 'legacy') {
      setInfra({
        asymmetricAlgo: 'rsa2048',
        symmetricAlgo: 'des3',
        keyStorage: 'software',
        networkTunnel: 'tls12'
      });
      showToast('Preset Loaded: Legacy Banking', 'RSA-2048 + 3DES + Software RAM keys configured.', 'info');
    } else if (type === 'standard') {
      setInfra({
        asymmetricAlgo: 'ecc256',
        symmetricAlgo: 'aes128',
        keyStorage: 'cloudKms',
        networkTunnel: 'tls13classical'
      });
      showToast('Preset Loaded: Standard SaaS', 'ECC P-256 + AES-128 + Cloud KMS configured.', 'info');
    } else if (type === 'hybrid') {
      setInfra({
        asymmetricAlgo: 'hybrid',
        symmetricAlgo: 'aes256',
        keyStorage: 'cloudKms',
        networkTunnel: 'hybridPqc'
      });
      showToast('Preset Loaded: Transitional Hybrid', 'Hybrid PQC + AES-256 + Cloud KMS configured.', 'info');
    } else {
      setInfra({
        asymmetricAlgo: 'mlkem1024',
        symmetricAlgo: 'aes256',
        keyStorage: 'mobileEnclave',
        networkTunnel: 'qcryptMesh'
      });
      showToast('Preset Loaded: Q-CRYPT Fortress', 'Pure ML-KEM-1024 + AES-256 + Titan M2 Enclave configured.', 'success');
    }
  };

  const attackScenarios: AttackScenario[] = [
    {
      id: 'shor-factorization',
      name: "Shor's Algorithm CRQC Polynomial Factorization",
      threatActor: 'State-Sponsored Quantum Cyber Directorate',
      quantumTool: "Shor's Period-Finding Algorithm",
      quantumQubits: quantumCapacity === '10000_cluster' ? '10,000+ Logical Qubits' : quantumCapacity === '4096_logical' ? '4,096 Logical Qubits' : '1,024 NISQ Qubits',
      mechanism: 'Solves integer factorization and discrete logarithms in polynomial time O((log N)^3), instantly breaking classical RSA and ECC private keys.',
      vulnerabilityEvaluation: (currentInfra, capacity) => {
        if (currentInfra.asymmetricAlgo === 'mlkem1024') {
          return {
            isVulnerable: false,
            severity: 'IMMUNE',
            breachProbability: 0,
            timeToCompromise: 'Immune (> 10^38 Years)',
            impactDescription: 'ML-KEM-1024 module lattice hardness is immune to Shor’s algorithm period-finding.',
            mitigationStep: 'Infrastructure is already mathematically shielded with NIST FIPS 203 lattice encryption.'
          };
        }
        if (currentInfra.asymmetricAlgo === 'hybrid') {
          return {
            isVulnerable: false,
            severity: 'MODERATE',
            breachProbability: capacity === '10000_cluster' ? 20 : 12,
            timeToCompromise: 'Resistant (Hybrid PQC Shield)',
            impactDescription: 'Classical layer falls, but ML-KEM layer prevents ciphertext decryption.',
            mitigationStep: 'Upgrade remaining endpoints from hybrid to full pure ML-KEM-1024 lattice tunnels.'
          };
        }
        const isRsa2048 = currentInfra.asymmetricAlgo === 'rsa2048';
        const isEcc = currentInfra.asymmetricAlgo === 'ecc256';
        let breachProb = isRsa2048 ? 99 : isEcc ? 97 : 93;
        if (capacity === '1024_nisq') breachProb = Math.max(breachProb - 30, 45);
        if (capacity === '10000_cluster') breachProb = 100;

        let timeEst = '< 18 seconds on 4K Qubit CRQC';
        if (capacity === '10000_cluster') timeEst = '< 1.4 seconds on 10K Qubit Super-CRQC';
        if (capacity === '1024_nisq') timeEst = '~ 4-6 hours with quantum error mitigation';

        return {
          isVulnerable: true,
          severity: breachProb > 80 ? 'CRITICAL' : 'HIGH',
          breachProbability: breachProb,
          timeToCompromise: timeEst,
          impactDescription: 'Complete private key derivation. All TLS session handshakes and digital signatures decrypted in real-time.',
          mitigationStep: 'Replace RSA/ECC key pairs immediately with Q-CRYPT ML-KEM-1024 lattice key encapsulation.'
        };
      }
    },
    {
      id: 'sndl-harvest',
      name: 'Store Now, Decrypt Later (SNDL) Sovereign Interception',
      threatActor: 'Foreign Intelligence Signals Intercept (SIGINT)',
      quantumTool: 'Mass Passive Optical Fiber Tapping + Post-Quantum Replay',
      quantumQubits: 'Archival Vaults awaiting Quantum Supremacy',
      mechanism: 'Encrypted communication streams are captured from public internet backbones today and stored until a CRQC is operational.',
      vulnerabilityEvaluation: (currentInfra, capacity) => {
        if (currentInfra.networkTunnel === 'qcryptMesh' || currentInfra.asymmetricAlgo === 'mlkem1024') {
          return {
            isVulnerable: false,
            severity: 'IMMUNE',
            breachProbability: 0,
            timeToCompromise: 'Immune to Retrospective Decryption',
            impactDescription: 'Captured ciphertext remains uncrackable lattice noise with category 5 security.',
            mitigationStep: 'Maintain continuous ephemeral key rotation across all mesh nodes.'
          };
        }
        if (currentInfra.networkTunnel === 'hybridPqc') {
          return {
            isVulnerable: false,
            severity: 'MODERATE',
            breachProbability: 10,
            timeToCompromise: 'High Resistance (SNDL Shielded)',
            impactDescription: 'Recorded packets contain PQC hybrid encapsulation that resists future batch decryption.',
            mitigationStep: 'Deprecate legacy fallback cipher suites to eliminate downgrade exposure.'
          };
        }
        const prob = capacity === '10000_cluster' ? 99 : 95;
        return {
          isVulnerable: true,
          severity: 'CRITICAL',
          breachProbability: prob,
          timeToCompromise: 'Compromised upon CRQC activation (2028-2030)',
          impactDescription: 'All recorded executive messages, trade secrets, and sovereign intelligence will be decrypted in bulk.',
          mitigationStep: 'Deploy Q-CRYPT ML-KEM-1024 ephemeral tunnels to render harvested wiretaps permanently indecipherable.'
        };
      }
    },
    {
      id: 'grover-keysearch',
      name: "Grover's Algorithm Symmetric Entropy Degradation",
      threatActor: 'Adversary Supercomputing Cluster',
      quantumTool: "Grover's Quantum Search Algorithm",
      quantumQubits: '2,048 Logical Qubits',
      mechanism: 'Applies quadratic quantum speedup O(sqrt(2^N)), cutting the effective cryptographic strength of symmetric ciphers in half.',
      vulnerabilityEvaluation: (currentInfra, capacity) => {
        if (currentInfra.symmetricAlgo === 'des3') {
          return {
            isVulnerable: true,
            severity: 'CRITICAL',
            breachProbability: 100,
            timeToCompromise: 'Instant (< 1 second)',
            impactDescription: '3DES effective entropy drops to 28-56 bits, trivial to brute-force with minimal quantum resources.',
            mitigationStep: 'Eliminate 3DES entirely. Migrate to AES-256-GCM or ChaCha20-Poly1305.'
          };
        }
        if (currentInfra.symmetricAlgo === 'aes128') {
          const prob = capacity === '10000_cluster' ? 88 : capacity === '4096_logical' ? 76 : 55;
          return {
            isVulnerable: true,
            severity: 'HIGH',
            breachProbability: prob,
            timeToCompromise: 'Feasible on moderate CRQC (Effective 64-bit entropy)',
            impactDescription: 'AES-128 security is halved to 64-bit work factor, within state-sponsored quantum search budgets.',
            mitigationStep: 'Upgrade all symmetric sessions to AES-256-GCM (which retains 128-bit quantum immunity under Grover).'
          };
        }
        return {
          isVulnerable: false,
          severity: 'IMMUNE',
          breachProbability: 0,
          timeToCompromise: 'Immune (> 10^22 Years under Grover)',
          impactDescription: '256-bit keys maintain a post-Grover effective security level of 128 bits, exceeding NSA CNSA 2.0 standards.',
          mitigationStep: 'Standard is fully compliant with post-quantum symmetric requirements.'
        };
      }
    },
    {
      id: 'side-channel-dump',
      name: 'Memory Dump & Enclave Cold-Boot Extraction',
      threatActor: 'Physical Tampering & Advanced Persistent Threat (APT)',
      quantumTool: 'Volatile RAM Scraper + DMA Bus Tap',
      quantumQubits: 'Hardware Probe Analysis',
      mechanism: 'Extracts session keys or master lattice seeds from volatile RAM dumps or unshielded application memory.',
      vulnerabilityEvaluation: (currentInfra) => {
        if (currentInfra.keyStorage === 'mobileEnclave' || currentInfra.keyStorage === 'fipsHsm') {
          return {
            isVulnerable: false,
            severity: 'IMMUNE',
            breachProbability: 2,
            timeToCompromise: 'Hardware Tamper-Proof',
            impactDescription: 'Master keys never enter application RAM; operations occur within Android Titan M2 / Knox / HSM silicon.',
            mitigationStep: 'Hardware root of trust verified. Continue automated zeroization (explicit_bzero) in C++ layers.'
          };
        }
        if (currentInfra.keyStorage === 'cloudKms') {
          return {
            isVulnerable: true,
            severity: 'MODERATE',
            breachProbability: 35,
            timeToCompromise: 'Possible via Cloud Host / IAM Compromise',
            impactDescription: 'Keys isolated in KMS but plaintext exposed in application RAM during active runtime decryption.',
            mitigationStep: 'Bind cloud endpoints to hardware client enclaves with end-to-end device attestation.'
          };
        }
        return {
          isVulnerable: true,
          severity: 'CRITICAL',
          breachProbability: 88,
          timeToCompromise: '< 3 minutes via memory dump or root exploit',
          impactDescription: 'Plaintext private keys extracted directly from memory heap or disk swap partitions.',
          mitigationStep: 'Deploy Q-CRYPT Android Titan M2 & Apple Secure Enclave hardware binding with auto-zeroization.'
        };
      }
    },
    {
      id: 'quantum-mitm',
      name: 'Quantum Man-in-the-Middle & Protocol Downgrade Attack',
      threatActor: 'Active Network Interceptor / Rogue Gateway',
      quantumTool: 'Real-Time Quantum Signature Forger + Extension Stripper',
      quantumQubits: '2,500 Logical Qubits',
      mechanism: 'Adversary strips post-quantum TLS negotiation flags in transit to force client and server to fall back to vulnerable classical cipher suites.',
      vulnerabilityEvaluation: (currentInfra) => {
        if (currentInfra.networkTunnel === 'qcryptMesh') {
          return {
            isVulnerable: false,
            severity: 'IMMUNE',
            breachProbability: 0,
            timeToCompromise: 'Immune (PQC Mandatory Enforcement)',
            impactDescription: 'Q-CRYPT protocol hard-fails connections that attempt classical fallback or lack valid ML-DSA signatures.',
            mitigationStep: 'Zero-trust strict mode active.'
          };
        }
        if (currentInfra.networkTunnel === 'hybridPqc') {
          return {
            isVulnerable: false,
            severity: 'MODERATE',
            breachProbability: 18,
            timeToCompromise: 'Low Risk (Fallback Warning Configured)',
            impactDescription: 'Hybrid negotiation resists downgrade unless client configuration permits unauthenticated fallback.',
            mitigationStep: 'Enable "Disable Classical Fallback" setting in enterprise TLS profiles.'
          };
        }
        return {
          isVulnerable: true,
          severity: 'HIGH',
          breachProbability: 82,
          timeToCompromise: 'Real-Time During Handshake Negotiation',
          impactDescription: 'Active interceptor forces RSA-2048 fallback, enabling real-time session key interception.',
          mitigationStep: 'Enforce Q-CRYPT strict lattice handshake with zero-tolerance classical fallback rejection.'
        };
      }
    }
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);

    const stepInterval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setIsSimulating(false);
          setHasRunSimulation(true);
          showToast('Threat Assessment Completed', 'All 5 post-quantum attack scenarios evaluated against your stack.', 'success');
          return 5;
        }
        return prev + 1;
      });
    }, 220);
  };

  const currentScenario = attackScenarios.find(s => s.id === selectedScenarioId) || attackScenarios[0];
  const currentEvaluation = currentScenario.vulnerabilityEvaluation(infra, quantumCapacity);

  // Overall calculations
  const totalBreachProb = Math.round(
    attackScenarios.reduce((acc, s) => acc + s.vulnerabilityEvaluation(infra, quantumCapacity).breachProbability, 0) / attackScenarios.length
  );

  const resilienceScore = Math.max(0, 100 - totalBreachProb);

  const getOverallRiskBadge = (prob: number) => {
    if (prob >= 70) return { label: 'CRITICAL QUANTUM EXPOSURE', color: 'bg-rose-950/80 border-rose-500 text-rose-300', bgGlow: 'from-rose-500/20' };
    if (prob >= 40) return { label: 'ELEVATED QUANTUM RISK', color: 'bg-amber-950/80 border-amber-500 text-amber-300', bgGlow: 'from-amber-500/20' };
    if (prob >= 15) return { label: 'MODERATE HYBRID SHIELDING', color: 'bg-cyan-950/80 border-cyan-500 text-cyan-300', bgGlow: 'from-cyan-500/20' };
    return { label: 'POST-QUANTUM RESILIENT (FIPS 203)', color: 'bg-emerald-950/80 border-emerald-500 text-emerald-300', bgGlow: 'from-emerald-500/20' };
  };

  const overallBadge = getOverallRiskBadge(totalBreachProb);

  const copyThreatReport = () => {
    const lines = [
      '==================================================',
      'Q-CRYPT QUANTUM THREAT ASSESSMENT & SELF-AUDIT',
      '==================================================',
      `Overall Quantum Resilience Score: ${resilienceScore}/100`,
      `Estimated Breach Probability: ${totalBreachProb}%`,
      `Posture Assessment: ${overallBadge.label}`,
      `Simulated Attacker Scale: ${quantumCapacity.toUpperCase()}`,
      `Interception Window: ${interceptTimeline.toUpperCase()}`,
      '',
      'CONFIGURED INFRASTRUCTURE:',
      `- Asymmetric Standard: ${infra.asymmetricAlgo.toUpperCase()}`,
      `- Symmetric Standard: ${infra.symmetricAlgo.toUpperCase()}`,
      `- Key Storage: ${infra.keyStorage.toUpperCase()}`,
      `- Network Protocol: ${infra.networkTunnel.toUpperCase()}`,
      '',
      'ATTACK VECTOR EVALUATIONS:',
      ...attackScenarios.map((s, idx) => {
        const ev = s.vulnerabilityEvaluation(infra, quantumCapacity);
        return `${idx + 1}. ${s.name}\n   Status: ${ev.severity} (${ev.breachProbability}% Breach Probability)\n   Time to Compromise: ${ev.timeToCompromise}\n   Mitigation: ${ev.mitigationStep}\n`;
      }),
      '==================================================',
      'Generated via Q-CRYPT Quantum Cyber Defense Portal'
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    showToast('Threat Assessment Copied', 'Summary copied to clipboard for executive review.', 'success');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Module Header & Execution Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                  Quantum Threat Assessment Module
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold uppercase">
                  SIMULATION ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Self-audit your existing cryptographic architecture against hypothetical post-quantum attack vectors and CRQC breach scenarios.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono text-xs">
            {/* Run Simulation Action Button */}
            <button
              id="run-simulation-btn"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500 hover:from-rose-400 hover:to-cyan-400 text-slate-950 font-black flex items-center space-x-2 shadow-lg shadow-rose-950/40 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? `Evaluating Vector ${simulationStep}/5...` : 'Run Simulation'}</span>
            </button>

            <button
              onClick={copyThreatReport}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer font-bold flex items-center space-x-1.5"
              title="Copy Machine-Readable Threat Audit Briefing"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Brief</span>
            </button>
          </div>
        </div>

        {/* Quick Archetype Preset Switcher */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Quick Infrastructure Archetype:</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <button
              onClick={() => applyPreset('legacy')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-rose-900/50 text-rose-300 font-bold text-left transition-all hover:border-rose-500"
            >
              ⚠️ Legacy Banking
            </button>
            <button
              onClick={() => applyPreset('standard')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-900/50 text-amber-300 font-bold text-left transition-all hover:border-amber-500"
            >
              ⚡ Standard SaaS
            </button>
            <button
              onClick={() => applyPreset('hybrid')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-900/50 text-cyan-300 font-bold text-left transition-all hover:border-cyan-500"
            >
              🛡️ Hybrid Transition
            </button>
            <button
              onClick={() => applyPreset('fortified')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-900/50 text-emerald-300 font-bold text-left transition-all hover:border-emerald-500"
            >
              🔒 Q-CRYPT Fortress
            </button>
          </div>
        </div>

        {/* Configuration Matrix: 4 Infrastructure Vectors & Attacker Capabilities */}
        <div className="space-y-4 pt-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step 1: Toggle & Configure Your Infrastructure Parameters</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Vector 1: Asymmetric Algorithm */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-slate-400 font-bold block text-[11px] uppercase flex items-center justify-between">
                <span>Asymmetric Standard</span>
                <Lock className="w-3 h-3 text-cyan-400" />
              </label>
              <select
                value={infra.asymmetricAlgo}
                onChange={(e) => setInfra({ ...infra, asymmetricAlgo: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="rsa2048">RSA-2048 (Legacy PKI / TLS)</option>
                <option value="rsa4096">RSA-4096 (Enterprise PKI)</option>
                <option value="ecc256">ECC P-256 / Ed25519 (Modern)</option>
                <option value="hybrid">Hybrid Classical + PQC Draft</option>
                <option value="mlkem1024">Pure NIST FIPS 203 (ML-KEM-1024)</option>
              </select>
            </div>

            {/* Vector 2: Symmetric Standard */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-slate-400 font-bold block text-[11px] uppercase flex items-center justify-between">
                <span>Symmetric Block Cipher</span>
                <Cpu className="w-3 h-3 text-emerald-400" />
              </label>
              <select
                value={infra.symmetricAlgo}
                onChange={(e) => setInfra({ ...infra, symmetricAlgo: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="des3">3DES / Legacy Triple-DES</option>
                <option value="aes128">AES-128-CBC / GCM</option>
                <option value="aes256">AES-256-GCM (Grover Immune)</option>
                <option value="chacha20">ChaCha20-Poly1305 (256-bit)</option>
              </select>
            </div>

            {/* Vector 3: Key Storage & Roots of Trust */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-slate-400 font-bold block text-[11px] uppercase flex items-center justify-between">
                <span>Key Storage Root of Trust</span>
                <Server className="w-3 h-3 text-amber-400" />
              </label>
              <select
                value={infra.keyStorage}
                onChange={(e) => setInfra({ ...infra, keyStorage: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="software">Software / Memory Heap</option>
                <option value="cloudKms">Cloud KMS (AWS / GCP / Azure)</option>
                <option value="mobileEnclave">Titan M2 / Apple Secure Enclave</option>
                <option value="fipsHsm">FIPS 140-3 Level 4 Dedicated HSM</option>
              </select>
            </div>

            {/* Vector 4: Network Tunnel Protocol */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-slate-400 font-bold block text-[11px] uppercase flex items-center justify-between">
                <span>Network Protocol</span>
                <Zap className="w-3 h-3 text-teal-400" />
              </label>
              <select
                value={infra.networkTunnel}
                onChange={(e) => setInfra({ ...infra, networkTunnel: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="tls12">Legacy TLS 1.2 (Classical)</option>
                <option value="tls13classical">Standard TLS 1.3 (Classical ECDH)</option>
                <option value="hybridPqc">Hybrid TLS 1.3 with PQC</option>
                <option value="qcryptMesh">Q-CRYPT Zero-Trust ML-KEM Mesh</option>
              </select>
            </div>
          </div>

          {/* Secondary Simulation Modifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Attacker Quantum Scale:</span>
              </span>
              <div className="flex space-x-1">
                {(['1024_nisq', '4096_logical', '10000_cluster'] as QuantumCapacity[]).map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setQuantumCapacity(cap)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      quantumCapacity === cap
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cap === '1024_nisq' ? '1K Qubits' : cap === '4096_logical' ? '4K Qubits' : '10K Qubits'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>SNDL Harvest Intercept Window:</span>
              </span>
              <div className="flex space-x-1">
                {(['near_term', 'q_day_horizon', 'scaled_crqc'] as InterceptTimeline[]).map((tl) => (
                  <button
                    key={tl}
                    onClick={() => setInterceptTimeline(tl)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      interceptTimeline === tl
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tl === 'near_term' ? '2026-27' : tl === 'q_day_horizon' ? '2028-30' : '2030+'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Posture Summary Banner */}
        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs ${overallBadge.color} transition-all duration-500`}>
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-sm tracking-wide block">{overallBadge.label}</span>
              <span className="text-[11px] opacity-90 block">
                Calculated Post-Quantum Breach Probability: {totalBreachProb}% across 5 attack vectors
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 shrink-0 self-end md:self-auto">
            <div className="text-right">
              <span className="text-[10px] opacity-80 block uppercase">Resilience Score</span>
              <span className="text-2xl font-black">{resilienceScore}/100</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] opacity-80 block uppercase">Breach Risk</span>
              <span className="text-2xl font-black">{totalBreachProb}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Step 2: Interactive Scenario Simulation Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of 5 Attack Scenarios */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block flex items-center justify-between">
            <span>Step 2: Evaluated Post-Quantum Threat Scenarios</span>
            <span className="text-cyan-400 font-bold">5 Scenarios</span>
          </span>

          <div className="space-y-2">
            {attackScenarios.map((scenario) => {
              const evalResult = scenario.vulnerabilityEvaluation(infra, quantumCapacity);
              const isSelected = selectedScenarioId === scenario.id;

              return (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white block font-sans">{scenario.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{scenario.threatActor}</span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                    evalResult.severity === 'IMMUNE'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : evalResult.severity === 'MODERATE'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                      : evalResult.severity === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    {evalResult.severity}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Scenario Simulation Analysis Card */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Threat Simulation Analysis</span>
              <h4 className="text-lg font-black text-white font-sans">{currentScenario.name}</h4>
            </div>

            <div className={`px-3 py-1 rounded-xl border font-mono text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto ${
              currentEvaluation.severity === 'IMMUNE'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : currentEvaluation.severity === 'MODERATE'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                : currentEvaluation.severity === 'HIGH'
                ? 'bg-amber-950 text-amber-300 border-amber-500'
                : 'bg-rose-950 text-rose-300 border-rose-500'
            }`}>
              {currentEvaluation.severity === 'IMMUNE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              <span>{currentEvaluation.severity} RISK ({currentEvaluation.breachProbability}% PROBABILITY)</span>
            </div>
          </div>

          {/* Scenario Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">Quantum Tool / Algorithm</span>
              <span className="text-white font-bold">{currentScenario.quantumTool}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">Required Quantum Scale</span>
              <span className="text-cyan-300 font-bold">{currentScenario.quantumQubits}</span>
            </div>
          </div>

          {/* Attack Mechanism */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">Attack Vector Mechanism</span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
              {currentScenario.mechanism}
            </p>
          </div>

          {/* Simulated Impact on User's Stack */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">Simulated Impact on Your Current Stack</span>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-400">Estimated Time-to-Compromise:</span>
                <span className="font-bold text-white">{currentEvaluation.timeToCompromise}</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {currentEvaluation.impactDescription}
              </p>
            </div>
          </div>

          {/* Prescribed Mitigation */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs font-sans">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Prescribed Q-CRYPT Mitigation</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              {currentEvaluation.mitigationStep}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
