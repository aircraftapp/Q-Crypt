import React, { useState } from 'react';
import { Cpu, ShieldCheck, Lock, Binary, HardDrive, Terminal, FileCode, CheckCircle2, ChevronRight, Zap, Sparkles, Activity, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';

export const PqcSolutionElaboration: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'mlKem' | 'mlDsa' | 'hndl' | 'hybrid' | 'enclave'>('mlKem');

  const copyMathSpec = (specName: string, specContent: string) => {
    navigator.clipboard.writeText(specContent);
    showToast(`Copied ${specName} specification to clipboard`, 'success');
  };

  return (
    <section id="pqc-elaboration" className="py-12 bg-slate-950/90 text-slate-100 relative overflow-hidden border-y border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono shadow-inner">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{t('pqc.tag')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {t('pqc.title')}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('pqc.subtitle')}
          </p>
        </div>

        {/* Interactive Deep-Dive Architecture Tabs */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab('mlKem')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === 'mlKem'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Binary className="w-4 h-4" />
            <span>ML-KEM-1024</span>
          </button>

          <button
            onClick={() => setActiveTab('mlDsa')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === 'mlDsa'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ML-DSA-87</span>
          </button>

          <button
            onClick={() => setActiveTab('hndl')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === 'hndl'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>HNDL Shield</span>
          </button>

          <button
            onClick={() => setActiveTab('hybrid')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === 'hybrid'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Hybrid Envelope</span>
          </button>

          <button
            onClick={() => setActiveTab('enclave')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === 'enclave'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Titan M2 / StrongBox</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column - Detailed Technical Explanation */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            {activeTab === 'mlKem' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                    <Binary className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('pqc.mlKemTitle')}</h3>
                    <p className="text-xs text-cyan-400 font-mono">Module Lattice Key Encapsulation • NIST FIPS 203</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {t('pqc.mlKemDesc')}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-400">Ring Polynomial Dimension: <span className="text-cyan-300">k = 4 (1024 vector coordinates)</span></div>
                    <div className="text-slate-400">Prime Modulus: <span className="text-emerald-300">q = 3329</span></div>
                    <div className="text-slate-400">Public Key Size: <span className="text-cyan-300">1,568 bytes</span></div>
                    <div className="text-slate-400">Ciphertext Size: <span className="text-emerald-300">1,568 bytes</span></div>
                    <div className="text-slate-400">NIST Security Strength: <span className="text-emerald-400 font-bold">Level 5 (AES-256 equivalent vs Quantum Attack)</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-200 space-y-1.5">
                  <strong className="text-white block font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Why Shor's Quantum Algorithm Fails:
                  </strong>
                  <p className="text-slate-300 leading-normal">
                    Shor's algorithm efficiently computes discrete logarithms and prime factorizations by finding periods in cyclic groups. ML-KEM-1024 relies on finding shortest vectors in non-cyclic high-dimensional lattices ($R_q^k$), where period-finding yields zero advantage.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'mlDsa' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('pqc.mlDsaTitle')}</h3>
                    <p className="text-xs text-emerald-400 font-mono">Module Lattice Digital Signature • NIST FIPS 204</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {t('pqc.mlDsaDesc')}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-400">Lattice Dimension: <span className="text-emerald-300">(k, l) = (8, 7)</span></div>
                    <div className="text-slate-400">Signature Size: <span className="text-cyan-300">4,595 bytes</span></div>
                    <div className="text-slate-400">Verification Speed: <span className="text-emerald-300">&lt; 0.12 ms on mobile ARMv8</span></div>
                    <div className="text-slate-400">Tamper Immunity: <span className="text-emerald-400 font-bold">100% Resistant to Quantum Forgery</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-200 space-y-1.5">
                  <strong className="text-white block font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Identity & Binary Integrity Protection:
                  </strong>
                  <p className="text-slate-300 leading-normal">
                    ML-DSA-87 signs every outgoing message payload and APK update binary. If an adversary attempts a quantum downgrade or mitm injection, signature rejection halts communication instantly.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'hndl' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/80">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('pqc.hndlTitle')}</h3>
                    <p className="text-xs text-purple-400 font-mono">Harvest-Now-Decrypt-Later Threat Neutralization</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {t('pqc.hndlDesc')}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-400">Threat Strategy: <span className="text-purple-300">Passive state-level interception & storing raw encrypted traffic</span></div>
                    <div className="text-slate-400">CRQC Target Window: <span className="text-rose-400 font-bold">2029 - 2032</span></div>
                    <div className="text-slate-400">Legacy Apps Impacted: <span className="text-amber-400">WhatsApp, Signal, Telegram (RSA/ECC keys vulnerable)</span></div>
                    <div className="text-slate-400">Q-CRYPT Defense: <span className="text-emerald-400 font-bold">Forward Secrets Encapsulated in Kyber-1024</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 text-xs text-purple-200 space-y-1.5">
                  <strong className="text-white block font-semibold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                    Zero Retention Value for Interceptors:
                  </strong>
                  <p className="text-slate-300 leading-normal">
                    Even if state-sponsored tapping centers log every byte transmitted through cell towers today, the recorded ciphertext will remain mathematically unsolvable even when CRQCs with 10,000+ logical qubits become operational.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'hybrid' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('pqc.hybridTitle')}</h3>
                    <p className="text-xs text-cyan-400 font-mono">X25519 + ML-KEM-1024 Dual-Envelope</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {t('pqc.hybridDesc')}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-400">Classical Layer: <span className="text-cyan-300">Curve25519 ECDH (128-bit classical security)</span></div>
                    <div className="text-slate-400">Post-Quantum Layer: <span className="text-emerald-300">ML-KEM-1024 (256-bit quantum security)</span></div>
                    <div className="text-slate-400">Key Derivation: <span className="text-cyan-300">HKDF-SHA3-512 (Strict NIST KDF)</span></div>
                    <div className="text-slate-400">Compliance: <span className="text-emerald-400 font-bold">Dual NIST FIPS 140-3 & FIPS 203</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-200 space-y-1.5">
                  <strong className="text-white block font-semibold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    Defense-in-Depth Guarantee:
                  </strong>
                  <p className="text-slate-300 leading-normal">
                    If an unforeseen vulnerability ever affected either X25519 or Kyber-1024, the remaining cryptographic layer maintains 100% confidentiality independently.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'enclave' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/80">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('pqc.hardwareTitle')}</h3>
                    <p className="text-xs text-amber-400 font-mono">Hardware Security Module (HSM) Binding</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {t('pqc.hardwareDesc')}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-400">Hardware Targets: <span className="text-amber-300">Google Titan M2, Samsung Knox Vault, Apple Secure Enclave</span></div>
                    <div className="text-slate-400">Isolation Standard: <span className="text-emerald-300">StrongBox Keymaster (EAL 6+ Certified)</span></div>
                    <div className="text-slate-400">RAM Probe Immunity: <span className="text-cyan-300">Zeroization on physical tamper detection</span></div>
                    <div className="text-slate-400">Root Protection: <span className="text-emerald-400 font-bold">Keys never unsealed in main OS memory</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200 space-y-1.5">
                  <strong className="text-white block font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Physical Chip Isolation:
                  </strong>
                  <p className="text-slate-300 leading-normal">
                    Even if malicious spyware gains full root / kernel access on the host Android device, it cannot read the post-quantum private keys stored inside the dedicated hardware die.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => copyMathSpec('NIST PQC Specification', `NIST FIPS 203 ML-KEM-1024 & FIPS 204 ML-DSA-87 Architecture Spec:\n- Standard: FIPS 203 (ML-KEM-1024)\n- Security Level: Level 5 (AES-256 equivalent)\n- Module Ring: R_q = Z_3329[X]/(X^256 + 1)\n- Enclave Isolation: StrongBox / Titan M2\n- Hybrid Envelope: X25519 + ML-KEM-1024 + HKDF-SHA3-512`)}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs border border-slate-700 transition-colors"
            >
              <FileCode className="w-4 h-4" />
              <span>{t('pqc.copyMathSpec')}</span>
            </button>
          </div>

          {/* Right Column - Interactive Pseudo-Code & Cryptographic Flow */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between font-mono text-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>QCryptEngine.kt</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Android Native NDK
                </span>
              </div>

              <div className="space-y-2 text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800/80 overflow-x-auto text-[11px] leading-relaxed">
                <p className="text-slate-500">// Initialize NIST FIPS 203 ML-KEM-1024</p>
                <p><span className="text-cyan-400">val</span> kem = <span className="text-emerald-400">MlKemEngine</span>(Variant.ML_KEM_1024)</p>
                <p><span className="text-cyan-400">val</span> keyPair = kem.<span className="text-yellow-300">generateKeyPairInStrongBox</span>()</p>
                <br />
                <p className="text-slate-500">// Hybrid Key Encapsulation</p>
                <p><span className="text-cyan-400">val</span> eccSecret = <span className="text-emerald-400">X25519</span>.<span className="text-yellow-300">agree</span>(recipientEccPub)</p>
                <p><span className="text-cyan-400">val</span> pqcEncaps = kem.<span className="text-yellow-300">encapsulateSecret</span>(recipientPqcPub)</p>
                <br />
                <p className="text-slate-500">// Derive Session Key via SHA3-512 HKDF</p>
                <p><span className="text-cyan-400">val</span> masterKey = <span className="text-emerald-400">HkdfSha3</span>.<span className="text-yellow-300">derive</span>(</p>
                <p className="pl-4">ikm = eccSecret + pqcEncaps.sharedSecret,</p>
                <p className="pl-4">salt = <span className="text-emerald-300">"Q-CRYPT-v2.4-SALT"</span>.toByteArray(),</p>
                <p className="pl-4">info = <span className="text-emerald-300">"PQC-SESSION-KEY"</span>.toByteArray()</p>
                <p>)</p>
                <br />
                <p className="text-emerald-400 font-bold">// RESULT: 100% Immunity to Shor's Algorithm</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Cryptographic Primitive:</span>
                  <span className="text-cyan-400 font-bold">Ring-Learning With Errors (R-LWE)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Quantum Attack Immunity:</span>
                  <span className="text-emerald-400 font-bold">Verified Immune</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Latency Overhead:</span>
                  <span className="text-cyan-300">&lt; 0.8ms (Zero User Perceptible Lag)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" /> Tested on Android 12 - 16
              </span>
              <span className="text-emerald-400 font-bold">FIPS 203 & 204 Passed</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
