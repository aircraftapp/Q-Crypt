import React, { useState, useEffect } from 'react';
import { Lock, Cpu, Sparkles, Copy, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export const QuantumTextScrambler: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [inputText, setInputText] = useState<string>('Quantum Guard PQC v2.4');
  const [algorithm, setAlgorithm] = useState<'ML-KEM-1024' | 'Falcon-512' | 'SLH-DSA-Sphincs'>('ML-KEM-1024');
  const [scrambledState, setScrambledState] = useState<string>('');
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const [latticeMatrix, setLatticeMatrix] = useState<number[][]>([]);
  const [noiseLevel, setNoiseLevel] = useState<number>(85);

  // Helper to generate pseudorandom PQC scrambled representation
  const generateCiphertext = (text: string, alg: string, noise: number) => {
    if (!text) return '0x0000000000000000';
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    const hexChars = '0123456789ABCDEFabcdefµ§¶LATTICE_KEM_994';
    let output = `0x[${alg.substring(0, 4)}]-`;
    for (let i = 0; i < text.length * 3 + 12; i++) {
      const idx = Math.abs((hash * (i + 1) + Math.floor(Math.random() * noise)) % hexChars.length);
      output += hexChars[idx];
      if (i % 8 === 7 && i < text.length * 3 + 11) output += '-';
    }
    return output;
  };

  // Generate 4x4 matrix for lattice visual
  useEffect(() => {
    const matrix: number[][] = [];
    for (let r = 0; r < 4; r++) {
      const row: number[] = [];
      for (let c = 0; c < 4; c++) {
        row.push(Math.floor(Math.random() * 3329)); // Kyber q=3329 modulo
      }
      matrix.push(row);
    }
    setLatticeMatrix(matrix);
  }, [inputText, algorithm]);

  useEffect(() => {
    setIsScrambling(true);
    let frames = 0;
    const interval = setInterval(() => {
      frames++;
      setScrambledState(generateCiphertext(inputText, algorithm, noiseLevel));
      if (frames > 4) {
        setIsScrambling(false);
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [inputText, algorithm, noiseLevel]);

  const handleCopy = () => {
    navigator.clipboard.writeText(scrambledState);
    showToast(t('scrambler.copyBtn'), t('scrambler.copySuccess'), 'success');
  };

  return (
    <div className="pro-card pro-card-hover rounded-2xl p-6 border border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl text-slate-200 my-8 shadow-2xl relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {t('scrambler.title')}
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {t('scrambler.live')}
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              {t('scrambler.sub')}
            </p>
          </div>
        </div>

        {/* Algorithm pills */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(['ML-KEM-1024', 'Falcon-512', 'SLH-DSA-Sphincs'] as const).map((alg) => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                algorithm === alg
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {alg}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Live Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Input Field & Noise Control */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div>
            <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>{t('scrambler.inputLabel')}</span>
              <span className="text-[10px] text-slate-500">{inputText.length} chars</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('scrambler.placeholder')}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Zap className={`w-4 h-4 ${isScrambling ? 'text-cyan-400 animate-bounce' : ''}`} />
              </div>
            </div>
          </div>

          {/* Noise Slider */}
          <div className="bg-slate-950/50 border border-slate-800/80 p-3.5 rounded-xl">
            <div className="flex justify-between items-center text-xs font-mono mb-2 text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {t('scrambler.strength')}
              </span>
              <span className="text-cyan-400 font-bold">{noiseLevel}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer bg-slate-800 rounded-lg h-1.5"
            />
            <p className="text-[10px] text-slate-400 mt-1.5 font-sans">
              {t('scrambler.plainExplained')}
            </p>
          </div>

          {/* Simulated Modular Polynomial Vector Matrix */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
              {t('scrambler.matrixLabel')}
            </span>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px] text-center">
              {latticeMatrix.flatMap((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="bg-slate-900 border border-slate-800/80 py-1 px-0.5 rounded text-cyan-300 font-semibold transition-all hover:border-cyan-500/50"
                  >
                    {isScrambling ? Math.floor(Math.random() * 3329) : val}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Encrypted Output Visualization */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/90 border border-slate-800 rounded-xl p-4 relative">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  {t('scrambler.outputTitle')}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3" /> NIST Level 5
              </span>
            </div>

            {/* Ciphertext view block */}
            <div className="min-h-[110px] bg-slate-900/90 border border-slate-800 rounded-lg p-3 font-mono text-xs text-cyan-300 break-all leading-relaxed relative overflow-hidden">
              {isScrambling && (
                <div className="absolute inset-0 bg-cyan-950/30 backdrop-blur-[1px] flex items-center justify-center space-x-2 text-cyan-300 text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>{t('scrambler.computing')}</span>
                </div>
              )}
              {scrambledState}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 italic">
              {t('scrambler.note')}
            </p>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{t('scrambler.copyBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
