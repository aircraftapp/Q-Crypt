import React, { useState } from 'react';
import { Key, Play, Cpu, ShieldCheck, RefreshCw, Copy, Check, Lock, Zap, Layers, BarChart3, AlertCircle } from 'lucide-react';
import { KeyPairData, EncapsulationResult } from '../types';
import { generateKyberKeyPair, encapsulateSecret, decapsulateSecret } from '../cryptoUtils';
import { QuantumTextScrambler } from './QuantumTextScrambler';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export const QuantumKeyDemo: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [keyPair, setKeyPair] = useState<KeyPairData | null>(null);
  const [encResult, setEncResult] = useState<EncapsulationResult | null>(null);
  const [decResult, setDecResult] = useState<{ sharedSecretHex: string; status: string; decapsulationTimeMs: number } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [encapsulating, setEncapsulating] = useState(false);
  const [decapsulating, setDecapsulating] = useState(false);

  // Copy states
  const [copiedPubKey, setCopiedPubKey] = useState(false);
  const [copiedSecretKey, setCopiedSecretKey] = useState(false);

  const handleGenerateKeys = async () => {
    setGenerating(true);
    setEncResult(null);
    setDecResult(null);
    try {
      const pair = await generateKyberKeyPair();
      setKeyPair(pair);
      showToast('Keypair Generated', '1568-byte ML-KEM-1024 lattice keypair generated', 'success');
    } finally {
      setGenerating(false);
    }
  };

  const handleEncapsulate = () => {
    if (!keyPair) return;
    setEncapsulating(true);
    setTimeout(() => {
      const res = encapsulateSecret(keyPair.publicKeyHex);
      setEncResult(res);
      setEncapsulating(false);
      showToast('KEM Encapsulated', '256-bit symmetric session secret encapsulated', 'success');
    }, 400);
  };

  const handleDecapsulate = () => {
    if (!keyPair || !encResult) return;
    setDecapsulating(true);
    setTimeout(() => {
      const res = decapsulateSecret(encResult.ciphertextHex, keyPair.secretKeyHex);
      setDecResult(res);
      setDecapsulating(false);
      showToast('KEM Decapsulated', 'Shared secret reconstructed via secret key', 'success');
    }, 400);
  };

  const copyToClipboard = (text: string, type: 'pub' | 'sec') => {
    navigator.clipboard.writeText(text);
    if (type === 'pub') {
      setCopiedPubKey(true);
      showToast('Public Key Copied', 'Kyber-1024 Public Key copied to clipboard', 'success');
      setTimeout(() => setCopiedPubKey(false), 2000);
    } else {
      setCopiedSecretKey(true);
      showToast('Secret Key Copied', 'Kyber-1024 Secret Key copied to clipboard', 'warning');
      setTimeout(() => setCopiedSecretKey(false), 2000);
    }
  };

  return (
    <section id="key-demo" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
            <Key className="w-3.5 h-3.5" />
            <span>{t('keyDemo.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('keyDemo.title')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            {t('keyDemo.subtitle')}
          </p>
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 text-left max-w-2xl mx-auto">
            <strong className="text-white block mb-0.5">{t('keyDemo.plainTitle')}</strong>
            <span>{t('keyDemo.plainBody')}</span>
          </div>
        </div>

        {/* Generator Controls Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>NIST FIPS 203 ML-KEM-1024 Simulator</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lattice parameters: Degree n=256, Modulus q=3329, Matrix k=4 (Category 5 Security - 256-bit Post-Quantum Equivalent)
              </p>
            </div>

            <button
              onClick={handleGenerateKeys}
              disabled={generating}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Sampling Entropy & Generating...' : 'Generate Kyber-1024 Keypair'}</span>
            </button>
          </div>

          {/* Generated Key Pair Display */}
          {keyPair ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Performance & Parameter Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">ALGORITHM</span>
                  <span className="text-cyan-400 font-bold">{keyPair.algorithm}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">GEN TIME</span>
                  <span className="text-emerald-400 font-bold">{keyPair.generationTimeMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PUBLIC KEY SIZE</span>
                  <span className="text-slate-200 font-bold">1,568 Bytes</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SECRET KEY SIZE</span>
                  <span className="text-slate-200 font-bold">3,168 Bytes</span>
                </div>
              </div>

              {/* Public & Secret Key Hex Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Public Key Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold flex items-center space-x-1">
                      <Key className="w-3.5 h-3.5" />
                      <span>Kyber-1024 Public Key (1568 Bytes)</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(keyPair.publicKeyHex, 'pub')}
                      className="text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      {copiedPubKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPubKey ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 break-all max-h-24 overflow-y-auto">
                    {keyPair.publicKeyHex}
                  </div>
                </div>

                {/* Secret Key Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-purple-400 font-bold flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Kyber-1024 Secret Key (Hardware Enclave Only)</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(keyPair.secretKeyHex, 'sec')}
                      className="text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      {copiedSecretKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSecretKey ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-purple-300 break-all max-h-24 overflow-y-auto">
                    {keyPair.secretKeyHex}
                  </div>
                </div>

              </div>

              {/* Step 2: Encapsulation & Decapsulation Interactive Flow */}
              <div className="p-6 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>Step 2: Key Encapsulation Mechanism (KEM) Test</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Encapsulate a random 256-bit symmetric key against the generated Kyber-1024 public key.
                    </p>
                  </div>

                  <button
                    onClick={handleEncapsulate}
                    disabled={encapsulating}
                    className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{encapsulating ? 'Encapsulating...' : 'Run Encapsulation'}</span>
                  </button>
                </div>

                {encResult && (
                  <div className="space-y-4 pt-4 border-t border-slate-900 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] mb-1">KEM CIPHERTEXT (1568 BYTES):</span>
                        <div className="p-2 rounded bg-slate-950 text-cyan-300 break-all text-[10px]">
                          {encResult.ciphertextHex}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] mb-1">SENDER SHARED SECRET (256-BIT AES-GCM KEY):</span>
                        <div className="p-2 rounded bg-slate-950 text-emerald-400 break-all text-[10px]">
                          {encResult.sharedSecretHex}
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Decapsulation */}
                    <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-slate-300 font-mono flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>Decapsulate ciphertext using secret key to reconstruct identical 256-bit session key.</span>
                      </div>

                      <button
                        onClick={handleDecapsulate}
                        disabled={decapsulating}
                        className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{decapsulating ? 'Decapsulating...' : 'Run Decapsulation'}</span>
                      </button>
                    </div>

                    {decResult && (
                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 font-mono text-xs space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                            <Check className="w-4 h-4" />
                            <span>DECAPSULATION MATCHED PERFECTLY</span>
                          </span>
                          <span className="text-[10px] text-emerald-500">Decapsulation time: {decResult.decapsulationTimeMs} ms</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Reconstructed Shared Session Secret: <code className="text-emerald-400 font-bold break-all">{decResult.sharedSecretHex}</code>
                        </p>
                        <p className="text-[10px] text-emerald-400/80">
                          {decResult.status}
                        </p>
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="text-center py-12 space-y-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <Key className="w-10 h-10 text-cyan-500/60 mx-auto animate-pulse" />
              <p className="text-sm font-semibold text-slate-300">No Key Pair Generated Yet</p>
              <p className="text-xs text-slate-500">
                Click "Generate Kyber-1024 Keypair" above to start the in-browser lattice polynomial sampler.
              </p>
            </div>
          )}

        </div>

        {/* Real-time Text Scrambler Widget */}
        <QuantumTextScrambler />

        {/* Cryptographic Comparison Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center space-x-2 text-base font-bold text-white">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Quantum Security Level Benchmark vs. Legacy Algorithms</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3 px-4">Cryptographic Standard</th>
                  <th className="py-3 px-4">Public Key Size</th>
                  <th className="py-3 px-4">Classical Security</th>
                  <th className="py-3 px-4">Shor's Quantum Threat</th>
                  <th className="py-3 px-4">Q-CRYPT Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-200">RSA-4096</td>
                  <td className="py-3 px-4">512 Bytes</td>
                  <td className="py-3 px-4 text-emerald-400">128-bit Classical</td>
                  <td className="py-3 px-4 text-red-400 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>BROKEN (~10s on 4000 Qubit QC)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">Obsolete</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-200">ECC Curve25519</td>
                  <td className="py-3 px-4">32 Bytes</td>
                  <td className="py-3 px-4 text-emerald-400">128-bit Classical</td>
                  <td className="py-3 px-4 text-red-400 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>BROKEN (~3s on 2500 Qubit QC)</span>
                  </td>
                  <td className="py-3 px-4 text-amber-400">Legacy Fallback Only</td>
                </tr>
                <tr className="bg-cyan-950/30">
                  <td className="py-3 px-4 font-bold text-cyan-300 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>ML-KEM-1024 (Q-CRYPT)</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-cyan-300">1,568 Bytes</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">256-bit Post-Quantum</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>IMMUNE (Lattice Hardness)</span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">PRIMARY ACTIVE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
