import React, { useState } from 'react';
import { 
  History, Key, Cpu, ShieldCheck, Lock, AlertTriangle, Sparkles, ChevronDown, ChevronUp, Milestone
} from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  algorithm: string;
  quantumStatus: 'VULNERABLE' | 'PARTIAL' | 'QUANTUM_SAFE';
  statusColor: string;
  summary: string;
  impact: string;
}

export const EncryptionHistoryTimeline: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const timelineEvents: TimelineEvent[] = [
    {
      year: '1977',
      title: 'RSA Standardized',
      algorithm: 'RSA-1024 / RSA-2048',
      quantumStatus: 'VULNERABLE',
      statusColor: 'bg-rose-950 text-rose-300 border-rose-700',
      summary: 'Public key cryptography based on integer factorization of prime products N = p·q.',
      impact: 'CRQCs with ~4,000 logical qubits solve integer factorization via Shor’s algorithm in under 1 second.'
    },
    {
      year: '1985',
      title: 'Elliptic Curve Cryptography (ECC)',
      algorithm: 'ECDH P-256 / Ed25519',
      quantumStatus: 'VULNERABLE',
      statusColor: 'bg-rose-950 text-rose-300 border-rose-700',
      summary: 'Offers shorter key sizes using discrete logarithms over elliptic curve groups.',
      impact: 'Shor’s quantum algorithm solves discrete logarithms in polynomial time, breaking all classical ECC.'
    },
    {
      year: '1994',
      title: 'Shor’s Quantum Algorithm Published',
      algorithm: 'Theoretical CRQC Threat Model',
      quantumStatus: 'VULNERABLE',
      statusColor: 'bg-amber-950 text-amber-300 border-amber-700',
      summary: 'Peter Shor demonstrates quantum computers solve integer factoring & discrete logs in polynomial O(n³) time.',
      impact: 'Proves mathematically that all classical asymmetric ciphers will collapse when quantum hardware matures.'
    },
    {
      year: '2001',
      title: 'AES Symmetric Cipher Standardized',
      algorithm: 'AES-128 / AES-256-GCM',
      quantumStatus: 'PARTIAL',
      statusColor: 'bg-cyan-950 text-cyan-300 border-cyan-700',
      summary: 'Symmetric key encryption standard adopted worldwide by governments & enterprises.',
      impact: 'Grover’s algorithm reduces effective key search to square root. AES-256 retains 128-bit quantum resistance.'
    },
    {
      year: '2016',
      title: 'NIST PQC Competition Initiated',
      algorithm: 'Lattice & Code-Based Candidates',
      quantumStatus: 'PARTIAL',
      statusColor: 'bg-purple-950 text-purple-300 border-purple-700',
      summary: 'NIST launches global multi-round evaluation of quantum-resistant cryptographic algorithms.',
      impact: 'Over 300 international submissions tested against mathematical, side-channel, and hardware benchmarks.'
    },
    {
      year: '2024',
      title: 'NIST Releases FIPS 203 / 204 Standards',
      algorithm: 'ML-KEM (Kyber) & ML-DSA (Dilithium)',
      quantumStatus: 'QUANTUM_SAFE',
      statusColor: 'bg-emerald-950 text-emerald-300 border-emerald-700',
      summary: 'Official standardization of Module-Lattice-Based Key Encapsulation (FIPS 203) & Digital Signatures (FIPS 204).',
      impact: 'Establishes the global mandatory benchmark for post-quantum key exchange across federal and commercial networks.'
    },
    {
      year: '2026+',
      title: 'Q-CRYPT Production Engine Deployed',
      algorithm: 'ML-KEM-1024 + Hardware Enclave Isolation',
      quantumStatus: 'QUANTUM_SAFE',
      statusColor: 'bg-emerald-950 text-emerald-300 border-emerald-700',
      summary: 'Hardware-bound lattice key exchange with SIMD vector acceleration and explicit RAM zeroization.',
      impact: 'Eliminates Store Now Decrypt Later (SNDL) threats with zero-latency overhead across enterprise mobile endpoints.'
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Evolution of Cryptography
            </h3>
            <span className="text-[10px] text-slate-400 font-mono block">From RSA to NIST Post-Quantum Standards</span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-cyan-400 font-bold px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800">
          1977 – 2026+
        </span>
      </div>

      {/* Vertical Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timelineEvents.map((evt, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div key={idx} className="relative group">
              {/* Timeline Bullet Node */}
              <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 bg-slate-950 transition-all ${
                evt.quantumStatus === 'QUANTUM_SAFE'
                  ? 'border-emerald-400 group-hover:scale-125 group-hover:bg-emerald-400'
                  : evt.quantumStatus === 'PARTIAL'
                  ? 'border-cyan-400 group-hover:scale-125 group-hover:bg-cyan-400'
                  : 'border-rose-400 group-hover:scale-125 group-hover:bg-rose-400'
              }`} />

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-xs font-black text-cyan-400">{evt.year}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-bold text-white">{evt.title}</span>
                  </div>

                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${evt.statusColor}`}>
                    {evt.quantumStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-sans font-medium flex justify-between items-center">
                  <span>{evt.algorithm}</span>
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center space-x-1"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'Read Impact'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-slate-900 space-y-2 text-xs font-sans text-slate-300 animate-fadeIn">
                    <p>{evt.summary}</p>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
                      <span className="text-amber-400 font-mono font-bold block text-[10px] uppercase">Quantum Security Impact:</span>
                      <p className="text-slate-300">{evt.impact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
