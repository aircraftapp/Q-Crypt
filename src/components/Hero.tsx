import React from 'react';
import { Shield, Download, Key, Smartphone, ExternalLink, Cpu, Check, Lock, Sparkles, Building2, FileText, Bone, ShieldCheck, Zap, AlertTriangle, Layers, Radio, Activity } from 'lucide-react';
import { APP_REFERENCE } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { useGoldenRetriever } from '../context/GoldenRetrieverContext';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenWhitepaper?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenWhitepaper }) => {
  const { t } = useLanguage();
  const { isGoldenMode } = useGoldenRetriever();

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-slate-950 text-slate-100 border-b border-slate-900">
      {/* Abstract Glowing Grid Canvas Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Header & Subtitle Block */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NIST FIPS 203 & 204 NATIVE POST-QUANTUM MESSAGING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {isGoldenMode ? (
              <>
                WOOF WOOF! 🐕 <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 bg-clip-text text-transparent">
                  SUPER SAFE QUANTUM BALLS & TREATS! 🎾
                </span>
              </>
            ) : (
              <>
                {t('hero.title1')} <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  {t('hero.title2')}
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {isGoldenMode
              ? "BARK BARK! 🐾 Q-CRYPT hides all your secret messages inside a giant unbreakable doggy ball! Sneaky supercomputers try to fetch your secret keys, but our NIST FIPS 203 lattice shield buries them safely in the yard! Best friends forever! 🦴"
              : t('hero.subtitle')}
          </p>

          {/* Plain English summary callout */}
          <div className={`p-4 rounded-2xl text-xs sm:text-sm max-w-3xl mx-auto text-left border shadow-lg ${
            isGoldenMode ? 'bg-amber-950/50 border-amber-500/40 text-amber-200' : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
          }`}>
            <div className="flex items-start space-x-3">
              {isGoldenMode ? <Bone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" /> : <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}
              <div>
                <span className="font-bold text-white block mb-1">
                  {isGoldenMode ? "WHAT THIS MEANS IN PUPPY TALK 🐕" : t('hero.plainEnglishTitle')}
                </span>
                <span className="leading-relaxed block">
                  {isGoldenMode
                    ? "If a bad kitty tries to steal your phone messages 10 years in the future, our Golden Retriever PQC shield growls and bites their quantum computer! Your secret bone is 100% safe!"
                    : t('hero.plainEnglishBody')}
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('apk-portal')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>{t('hero.btnApk')}</span>
            </button>

            <button
              onClick={() => onNavigate('enterprise-portal')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 hover:bg-cyan-900/80 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-cyan-500/10"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>{t('hero.btnEnterprise')}</span>
            </button>

            {onOpenWhitepaper && (
              <button
                onClick={onOpenWhitepaper}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-cyan-950/40 text-cyan-300 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-md"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{t('nav.whitepaper')}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('key-demo')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 font-medium text-sm transition-all flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4 text-cyan-400" />
              <span>{t('hero.btnDemo')}</span>
            </button>
          </div>
        </div>

        {/* DETAILED EXPANDED EXPLANATION PANELS (ARCHITECTURAL PILLARS & THREAT MATRIX) */}
        <div className="pt-6 border-t border-slate-900 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
              Why Q-CRYPT? Understanding Post-Quantum Mobile Security
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              A comprehensive breakdown of quantum risks, mathematical lattice shielding, and hardware key isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PILLAR 1: THE HNDL QUANTUM THREAT */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all space-y-3 relative overflow-hidden group">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-800 text-rose-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                    THE THREAT HORIZON
                  </span>
                  <h4 className="text-base font-bold text-white font-sans">
                    Harvest-Now, Decrypt-Later (HNDL)
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Adversaries and nation-state actors are currently capturing and storing encrypted mobile traffic today. Once quantum computers running <strong className="text-white">Shor’s Algorithm</strong> reach scale, all legacy RSA-4096 and ECC P-256 keys will be instantly cracked, exposing historical archives.
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-rose-300 flex items-center justify-between">
                <span>Legacy RSA / ECC Vulnerability:</span>
                <span className="font-bold text-rose-400">100% High Risk</span>
              </div>
            </div>

            {/* PILLAR 2: NIST FIPS 203 & 204 LATTICE MATHEMATICS */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 relative overflow-hidden group">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    MATHEMATICAL DEFENSE
                  </span>
                  <h4 className="text-base font-bold text-white font-sans">
                    NIST ML-KEM-1024 Lattice Cryptography
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Q-CRYPT implements native <strong className="text-white">ML-KEM-1024 (Kyber)</strong> and <strong className="text-white">ML-DSA-87 (Dilithium)</strong>. Encryption keys are hidden inside 256-dimensional polynomial lattice noise vectors. Solving vector lattice problems is proven NP-hard, even for 10,000-qubit quantum systems.
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                <span>Quantum Security Category:</span>
                <span className="font-bold text-emerald-400">Category 5 (256-bit)</span>
              </div>
            </div>

            {/* PILLAR 3: HARDWARE ROOT-OF-TRUST ENCLAVE */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 relative overflow-hidden group">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    HARDWARE ISOLATION
                  </span>
                  <h4 className="text-base font-bold text-white font-sans">
                    Titan M2 / Knox Hardware Key Binding
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Master private keys are generated inside isolated hardware security enclaves (<strong className="text-white">Google Titan M2, Samsung Knox, iOS Secure Enclave</strong>). Keys never leave physical silicon, rendering memory scraping malware and OS root exploits completely powerless.
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
                <span>Key Storage Enclave:</span>
                <span className="font-bold text-emerald-400">FIPS 140-3 Validated</span>
              </div>
            </div>

          </div>

          {/* Technical Specs Comparison Summary Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Sub-1.5ms Latency</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">Real-Time Voice & Push-to-Talk</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Zero Metadata Retention</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">Ephemeral Peer-to-Peer Relay</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Zero-Knowledge PIR</span>
              <span className="text-sm font-bold text-amber-300 font-mono">Private Contact Lookup</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">EU Sovereign Compliance</span>
              <span className="text-sm font-bold text-purple-300 font-mono">DORA & BSI TR-02102-4</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

