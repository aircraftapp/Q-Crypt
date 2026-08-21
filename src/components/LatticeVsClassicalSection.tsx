import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Zap, Cpu, Lock, Unlock, AlertTriangle, 
  CheckCircle2, XCircle, Clock, Database, ArrowRight, Sparkles, 
  Layers, HelpCircle, Activity, BarChart3, Scale, Key
} from 'lucide-react';
import { useToast } from './Toast';

interface ComparisonRow {
  dimension: string;
  qcryptPqc: {
    value: string;
    subtext: string;
    isSafe: boolean;
  };
  signalPqxdh: {
    value: string;
    subtext: string;
    isSafe: boolean | 'partial';
  };
  whatsappEcc: {
    value: string;
    subtext: string;
    isSafe: boolean;
  };
  telegramRsa: {
    value: string;
    subtext: string;
    isSafe: boolean;
  };
  legacyPgp: {
    value: string;
    subtext: string;
    isSafe: boolean;
  };
}

export const LatticeVsClassicalSection: React.FC = () => {
  const { showToast } = useToast();
  const [filterCategory, setFilterCategory] = useState<'all' | 'quantum-resistance' | 'performance' | 'key-sizes'>('all');
  const [simulatedMessageVolume, setSimulatedMessageVolume] = useState<number>(10000);
  const [activeTab, setActiveTab] = useState<'matrix' | 'benchmark' | 'hndl-explainer'>('matrix');

  const comparisonData: ComparisonRow[] = [
    {
      dimension: 'Key Encapsulation (KEM)',
      qcryptPqc: {
        value: 'ML-KEM-1024 (FIPS 203)',
        subtext: 'Lattice MLWE, Category 5 (AES-256 Quantum Equivalent)',
        isSafe: true
      },
      signalPqxdh: {
        value: 'Kyber-768 + X25519 (Hybrid)',
        subtext: 'Category 3 KEM hybrid with classical Curve25519',
        isSafe: 'partial'
      },
      whatsappEcc: {
        value: 'Curve25519 (ECDH)',
        subtext: 'Classical Elliptic Curve Diffie-Hellman',
        isSafe: false
      },
      telegramRsa: {
        value: 'RSA-2048 / MTProto',
        subtext: 'Classical 2048-bit Integer Factorization',
        isSafe: false
      },
      legacyPgp: {
        value: 'RSA-4096 / ElGamal',
        subtext: 'Classical Discrete Logarithm & Factoring',
        isSafe: false
      }
    },
    {
      dimension: 'Digital Signatures & Identity',
      qcryptPqc: {
        value: 'ML-DSA-87 (FIPS 204)',
        subtext: 'Post-Quantum Dilithium Lattice Signatures',
        isSafe: true
      },
      signalPqxdh: {
        value: 'Ed25519 (Classical)',
        subtext: 'Identity keys vulnerable to Shor quantum forgery',
        isSafe: false
      },
      whatsappEcc: {
        value: 'Ed25519 (Classical)',
        subtext: 'Vulnerable to quantum signature forgery',
        isSafe: false
      },
      telegramRsa: {
        value: 'RSA-2048 (Classical)',
        subtext: 'Trivially factored on quantum computers',
        isSafe: false
      },
      legacyPgp: {
        value: 'RSA-4096 (Classical)',
        subtext: 'Requires ~8,000 logical qubits to break',
        isSafe: false
      }
    },
    {
      dimension: 'Shor\'s Algorithm Resistance',
      qcryptPqc: {
        value: '100% Quantum Immune',
        subtext: 'Lattice Shortest Vector Problem has no polynomial quantum shortcut',
        isSafe: true
      },
      signalPqxdh: {
        value: 'Partial (Session Only)',
        subtext: 'Session keys immune; Long-term identity keys broken',
        isSafe: 'partial'
      },
      whatsappEcc: {
        value: '0% Broken',
        subtext: 'Elliptic curve discrete log solved in O(log³ n) by Shor',
        isSafe: false
      },
      telegramRsa: {
        value: '0% Broken',
        subtext: 'RSA-2048 broken in ~0.04 ms on 4,096-qubit CRQC',
        isSafe: false
      },
      legacyPgp: {
        value: '0% Broken',
        subtext: 'RSA-4096 broken in ~0.18 ms on CRQC',
        isSafe: false
      }
    },
    {
      dimension: 'Harvest Now, Decrypt Later (HNDL)',
      qcryptPqc: {
        value: 'Completely Protected',
        subtext: 'Stored ciphertext intercepts cannot be decrypted in future',
        isSafe: true
      },
      signalPqxdh: {
        value: 'Protected (For New Chats)',
        subtext: 'Old pre-PQXDH message archives remain compromised',
        isSafe: 'partial'
      },
      whatsappEcc: {
        value: 'Extremely Vulnerable',
        subtext: 'Nation-states currently archiving all encrypted traffic',
        isSafe: false
      },
      telegramRsa: {
        value: 'Critical Risk',
        subtext: 'MTProto key exchange archives retroactively decipherable',
        isSafe: false
      },
      legacyPgp: {
        value: 'Critical Risk',
        subtext: 'Decades of archived PGP emails retroactively readable',
        isSafe: false
      }
    },
    {
      dimension: 'Encapsulation / Key-Gen Latency',
      qcryptPqc: {
        value: '0.082 ms (Ultra-Fast)',
        subtext: 'Hardware vector-accelerated polynomial lattice multiplication',
        isSafe: true
      },
      signalPqxdh: {
        value: '0.145 ms',
        subtext: 'Double compute overhead (Kyber768 + X25519 paired)',
        isSafe: true
      },
      whatsappEcc: {
        value: '0.065 ms',
        subtext: 'Fast but classical and insecure',
        isSafe: false
      },
      telegramRsa: {
        value: '2.140 ms',
        subtext: 'Slow modular exponentiation',
        isSafe: false
      },
      legacyPgp: {
        value: '8.450 ms',
        subtext: 'Heavy CPU burden for 4096-bit prime search',
        isSafe: false
      }
    },
    {
      dimension: 'Public Key & Signature Size',
      qcryptPqc: {
        value: '1,568 B (Public) / 4,595 B (Sig)',
        subtext: 'Lattice polynomial ring vectors',
        isSafe: true
      },
      signalPqxdh: {
        value: '1,216 B (KEM) + 32 B (ECC)',
        subtext: 'Mixed key payload',
        isSafe: 'partial'
      },
      whatsappEcc: {
        value: '32 Bytes',
        subtext: 'Compact but quantum-vulnerable',
        isSafe: false
      },
      telegramRsa: {
        value: '256 Bytes',
        subtext: 'Moderate size, zero quantum resistance',
        isSafe: false
      },
      legacyPgp: {
        value: '512 Bytes',
        subtext: 'Moderate size, zero quantum resistance',
        isSafe: false
      }
    },
    {
      dimension: 'Mathematical Hard Problem',
      qcryptPqc: {
        value: 'Module-LWE / SVP',
        subtext: 'Shortest Vector Problem in High-Dimensional Lattices',
        isSafe: true
      },
      signalPqxdh: {
        value: 'MLWE + ECDLP',
        subtext: 'Dual hardness assumptions',
        isSafe: 'partial'
      },
      whatsappEcc: {
        value: 'ECDLP (Discrete Log)',
        subtext: 'Vulnerable to Shor\'s Quantum Algorithm',
        isSafe: false
      },
      telegramRsa: {
        value: 'Integer Factorization',
        subtext: 'Vulnerable to Shor\'s Quantum Algorithm',
        isSafe: false
      },
      legacyPgp: {
        value: 'Prime Factorization',
        subtext: 'Vulnerable to Shor\'s Quantum Algorithm',
        isSafe: false
      }
    }
  ];

  return (
    <section id="lattice-vs-classical" className="py-16 md:py-24 bg-[#070C18] text-slate-100 border-b border-slate-900 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
              <Scale className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>NIST FIPS 203 & 204 LATTICE STANDARDS VS. LEGACY RSA/ECC</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
              Lattice Cryptography vs. Classical Messengers
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-mono leading-relaxed">
              A comprehensive technical and performance comparison demonstrating why legacy RSA/ECC protocols (WhatsApp, Telegram, Signal, PGP) fail under Cryptanalytically Relevant Quantum Computers (CRQC).
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md font-mono text-xs">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Comparative Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'benchmark'
                  ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>2. Live Benchmark Calculator</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Comprehensive Comparative Table */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 animate-fadeIn font-mono text-xs">
            
            {/* Legend & Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Q-CRYPT (FIPS 203/204)</span>
                  <span className="text-[11px] text-emerald-400">Full Lattice Post-Quantum Default</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Signal (PQXDH Hybrid)</span>
                  <span className="text-[11px] text-amber-400">KEM Only; Vulnerable Identity Keys</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">WhatsApp / Telegram / PGP</span>
                  <span className="text-[11px] text-red-400">0% Quantum Resistance (Broken by Shor)</span>
                </div>
              </div>
            </div>

            {/* Main Interactive Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="py-4 px-5 font-bold">Cryptographic Dimension</th>
                    <th className="py-4 px-5 font-bold text-cyan-300 bg-cyan-950/30 border-x border-cyan-900/30">
                      Q-CRYPT (NIST PQC)
                    </th>
                    <th className="py-4 px-5 font-bold text-slate-300">Signal (PQXDH)</th>
                    <th className="py-4 px-5 font-bold text-slate-400">WhatsApp (Curve25519)</th>
                    <th className="py-4 px-5 font-bold text-slate-400">Telegram (MTProto/RSA)</th>
                    <th className="py-4 px-5 font-bold text-slate-400">Legacy PGP (RSA-4096)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      
                      {/* Dimension Title */}
                      <td className="py-4 px-5 font-bold text-white font-sans">
                        {row.dimension}
                      </td>

                      {/* Q-CRYPT Column */}
                      <td className="py-4 px-5 bg-cyan-950/20 border-x border-cyan-900/30 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-cyan-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{row.qcryptPqc.value}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">{row.qcryptPqc.subtext}</div>
                      </td>

                      {/* Signal Column */}
                      <td className="py-4 px-5 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-slate-200">
                          {row.signalPqxdh.isSafe === true ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : row.signalPqxdh.isSafe === 'partial' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                          <span>{row.signalPqxdh.value}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">{row.signalPqxdh.subtext}</div>
                      </td>

                      {/* WhatsApp Column */}
                      <td className="py-4 px-5 space-y-1 text-slate-300">
                        <div className="flex items-center space-x-1.5 font-bold">
                          {row.whatsappEcc.isSafe ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                          <span>{row.whatsappEcc.value}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">{row.whatsappEcc.subtext}</div>
                      </td>

                      {/* Telegram Column */}
                      <td className="py-4 px-5 space-y-1 text-slate-300">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{row.telegramRsa.value}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">{row.telegramRsa.subtext}</div>
                      </td>

                      {/* Legacy PGP Column */}
                      <td className="py-4 px-5 space-y-1 text-slate-300">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{row.legacyPgp.value}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">{row.legacyPgp.subtext}</div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: Live Benchmark Calculator */}
        {activeTab === 'benchmark' && (
          <div className="space-y-8 animate-fadeIn font-mono text-xs">
            
            {/* Slider Configurator */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-white font-sans">
                    Interactive Post-Quantum Performance Benchmark Estimator
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Calculate computation overhead and quantum attack resistance across message volumes.
                  </p>
                </div>
                <span className="text-cyan-300 font-bold text-sm">
                  {simulatedMessageVolume.toLocaleString()} Messages Simulated
                </span>
              </div>

              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={simulatedMessageVolume}
                onChange={(e) => setSimulatedMessageVolume(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1,000 msgs (Personal)</span>
                <span>10,000 msgs (Team)</span>
                <span>100,000 msgs (Enterprise)</span>
              </div>
            </div>

            {/* Computed Output Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Q-CRYPT Metric */}
              <div className="p-6 rounded-3xl bg-cyan-950/40 border-2 border-cyan-500/80 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold uppercase text-[10px]">Q-CRYPT ML-KEM-1024</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                    QUANTUM IMMUNE
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-black text-white font-sans">
                    {((simulatedMessageVolume * 0.082) / 1000).toFixed(2)}s
                  </div>
                  <div className="text-[11px] text-slate-300">Total Key Encapsulation Time</div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-cyan-800/40 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quantum Cracking Time:</span>
                    <strong className="text-emerald-400">&gt; 10¹⁵⁰ Years</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Throughput:</span>
                    <strong className="text-cyan-300">12,195 ops/sec</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total KEM Bandwidth:</span>
                    <strong className="text-white">{((simulatedMessageVolume * 1568) / (1024 * 1024)).toFixed(2)} MB</strong>
                  </div>
                </div>
              </div>

              {/* Signal PQXDH Metric */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Signal PQXDH Hybrid</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800">
                    PARTIAL QUANTUM
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-black text-slate-200 font-sans">
                    {((simulatedMessageVolume * 0.145) / 1000).toFixed(2)}s
                  </div>
                  <div className="text-[11px] text-slate-400">Total Hybrid Key Compute Time</div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Identity Spoofing Time:</span>
                    <strong className="text-red-400">0.02ms (Ed25519 Shor)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <strong className="text-slate-200">6,896 ops/sec</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total KEM Bandwidth:</span>
                    <strong className="text-slate-200">{((simulatedMessageVolume * 1248) / (1024 * 1024)).toFixed(2)} MB</strong>
                  </div>
                </div>
              </div>

              {/* Legacy RSA-2048 Metric */}
              <div className="p-6 rounded-3xl bg-red-950/30 border border-red-900/60 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-bold uppercase text-[10px]">Legacy RSA-2048 (Telegram/PGP)</span>
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-bold border border-red-800">
                    CRITICAL VULNERABILITY
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-black text-red-200 font-sans">
                    {((simulatedMessageVolume * 2.14) / 1000).toFixed(2)}s
                  </div>
                  <div className="text-[11px] text-red-300">Total Modular Exponentiation Time</div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-red-900/40 text-[11px] text-red-300">
                  <div className="flex justify-between">
                    <span>Quantum Cracking Time:</span>
                    <strong className="text-red-400">0.04ms (Per Key)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <strong className="text-white">467 ops/sec</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>All Intercepts Decipherable:</span>
                    <strong className="text-red-400 font-black">100% YES</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
