import React, { useState, useEffect } from 'react';
import { 
  Play, RotateCcw, ShieldCheck, ShieldAlert, Cpu, Lock, Unlock, AlertTriangle, 
  Zap, ArrowRight, CheckCircle2, XCircle, Sparkles, Activity, Key
} from 'lucide-react';
import { useToast } from './Toast';

export const RsaVsPqcSimulation: React.FC = () => {
  const { showToast } = useToast();
  const [simStep, setSimStep] = useState<number>(0); // 0: Idle, 1: Transmitting, 2: Quantum Attack Executing, 3: Completed
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'both' | 'rsa' | 'pqc'>('both');

  const startSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => {
      setSimStep(2);
      setTimeout(() => {
        setSimStep(3);
        setIsSimulating(false);
        showToast('Quantum Interception Simulation Completed', 'RSA key cracked in 0.04ms via Shor’s algorithm; NIST ML-KEM-1024 resisted quantum attack.', 'warning');
      }, 2000);
    }, 1500);
  };

  const resetSimulation = () => {
    setSimStep(0);
    setIsSimulating(false);
  };

  return (
    <div id="rsa-vs-pqc-simulation" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold mb-1">
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            <span>INTERACTIVE CRQC ATTACK SIMULATOR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
            Classical RSA-2048 vs. NIST ML-KEM-1024 Lattice Interception
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={resetSimulation}
            disabled={simStep === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-xs font-mono font-black flex items-center space-x-2 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            {isSimulating ? (
              <>
                <Zap className="w-4 h-4 text-slate-950 animate-bounce" />
                <span>Intercepting Traffic...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Run CRQC Interception Test</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Simulation Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* LEFT COLUMN: CLASSICAL RSA-2048 */}
        <div className={`p-6 rounded-2xl border transition-all space-y-5 relative overflow-hidden ${
          simStep === 3
            ? 'bg-rose-950/30 border-rose-500/80 shadow-rose-900/20 shadow-xl'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h4 className="text-sm font-bold text-white font-sans">Classical RSA-2048 / ECC</h4>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              VULNERABLE
            </span>
          </div>

          {/* RSA Mathematical Formula Card */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
            <span className="text-slate-400 block font-sans font-bold">Mathematical Foundation:</span>
            <span className="text-rose-300 block font-bold">Integer Factorization: N = p · q</span>
            <span className="text-slate-500 block text-[10px]">Shor’s Quantum Period Finding Algorithm reduces factoring to O(n³) polynomial complexity.</span>
          </div>

          {/* Visual Channel Animation */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-bold">Alice (Sender)</span>
              <div className="flex items-center space-x-1 text-rose-400">
                <Lock className="w-3 h-3" />
                <span>RSA-2048 PKCS#1 v1.5</span>
              </div>
              <span className="text-slate-300 font-bold">Bob (Receiver)</span>
            </div>

            {/* Interception Pulse Animation */}
            <div className="relative h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between px-4 overflow-hidden">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />

              {/* Quantum Eavesdropper Node */}
              <div className={`absolute left-1/2 -translate-x-1/2 p-1.5 rounded-full border transition-all ${
                simStep >= 2 ? 'bg-rose-950 border-rose-500 text-rose-300 scale-125 animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <Cpu className="w-4 h-4" />
              </div>

              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Quantum Interception Result Card */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Quantum Attack Outcome:</span>

            {simStep === 0 && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[11px] text-center">
                Click "Run CRQC Interception Test" above to simulate quantum computer attack.
              </div>
            )}

            {simStep === 1 && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-[11px] flex items-center space-x-2">
                <Activity className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                <span>Transmitting RSA-2048 public key & encrypted payload across untrusted network link...</span>
              </div>
            )}

            {simStep === 2 && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-600 text-rose-200 text-[11px] flex items-center space-x-2 animate-pulse">
                <Zap className="w-4 h-4 text-rose-400 shrink-0" />
                <span>CRQC Quantum Computer running Shor’s Algorithm QFT period finding circuit...</span>
              </div>
            )}

            {simStep === 3 && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 space-y-2 text-[11px]">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center space-x-1.5 text-rose-400">
                    <XCircle className="w-4 h-4" />
                    <span>RSA KEY BROKEN IN 0.04 MS</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900 text-rose-200">Factored: N = 4096-bit</span>
                </div>
                <p className="text-slate-300 font-sans">
                  The quantum computer computed discrete logarithms & factored primes instantly. Raw confidential payload intercepted & decrypted ("Store Now, Decrypt Later" exploit successful).
                </p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: NIST ML-KEM-1024 PQC LATTICE */}
        <div className={`p-6 rounded-2xl border transition-all space-y-5 relative overflow-hidden ${
          simStep === 3
            ? 'bg-emerald-950/30 border-emerald-500/80 shadow-emerald-900/20 shadow-xl'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-sm font-bold text-white font-sans">Q-CRYPT ML-KEM-1024 (PQC)</h4>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
              QUANTUM RESISTANT
            </span>
          </div>

          {/* PQC Lattice Formula Card */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
            <span className="text-slate-400 block font-sans font-bold">Mathematical Foundation:</span>
            <span className="text-emerald-300 block font-bold">Module-LWE Polynomial Ring: R_q = ℤ_q[X]/(X¹⁰²⁴ + 1)</span>
            <span className="text-slate-500 block text-[10px]">Shortest Vector Problem (SVP) in 1024 dimensions requires &gt; 2²⁵⁶ operations on CRQC.</span>
          </div>

          {/* Visual Channel Animation */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-bold">Alice (Sender)</span>
              <div className="flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>ML-KEM-1024 + Titan M2</span>
              </div>
              <span className="text-slate-300 font-bold">Bob (Receiver)</span>
            </div>

            {/* Interception Pulse Animation */}
            <div className="relative h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between px-4 overflow-hidden">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />

              {/* Quantum Eavesdropper Node (Blocked) */}
              <div className={`absolute left-1/2 -translate-x-1/2 p-1.5 rounded-full border transition-all ${
                simStep >= 2 ? 'bg-emerald-950 border-emerald-500 text-emerald-300 scale-125' : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <Lock className="w-4 h-4" />
              </div>

              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Quantum Interception Result Card */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Quantum Attack Outcome:</span>

            {simStep === 0 && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[11px] text-center">
                Click "Run CRQC Interception Test" above to simulate quantum computer attack.
              </div>
            )}

            {simStep === 1 && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-[11px] flex items-center space-x-2">
                <Activity className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                <span>Transmitting ML-KEM-1024 lattice vector (q=3329) & hardware attestation...</span>
              </div>
            )}

            {simStep === 2 && (
              <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-600 text-cyan-200 text-[11px] flex items-center space-x-2 animate-pulse">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>CRQC attempting high-dimensional lattice vector reduction (SVP)...</span>
              </div>
            )}

            {simStep === 3 && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 space-y-2 text-[11px]">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>QUANTUM ATTACK REPELLED (&gt; 2²⁵⁶ OPS)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-200">Zero Leak</span>
                </div>
                <p className="text-slate-300 font-sans">
                  The high-dimensional noise error vector noise binomial distribution successfully concealed the secret key. The quantum computer failed to derive secret coefficients. Data remains 100% confidential.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
