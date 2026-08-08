import React, { useState } from 'react';
import { ShieldCheck, Award, TrendingUp, DollarSign, Users, Building2, CheckCircle2, ArrowRight, FileText, Lock, Cpu, Clock, Sparkles } from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export const TrustAndBuyerValue: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();

  // ROI Calculator state
  const [userCount, setUserCount] = useState<number>(250);
  const [industry, setIndustry] = useState<'defense' | 'finance' | 'healthcare' | 'tech'>('defense');

  // Industry cost multiplier heuristics
  const industryRiskMultiplier = {
    defense: 480,
    finance: 420,
    healthcare: 380,
    tech: 290,
  };

  const estimatedRiskExposure = userCount * industryRiskMultiplier[industry] * 12; // annualized risk mitigation value
  const estimatedMdmSetupTimeMinutes = Math.min(30, Math.max(10, Math.round(userCount * 0.05)));

  const handleDownloadWhitepaper = () => {
    const whitepaperContent = `Q-CRYPT ENTERPRISE WHITE PAPER (2026 EDITION)
=============================================
Title: Preparing Enterprise Mobile Communications for Post-Quantum Migration
Standards: NIST FIPS 203 (ML-KEM-1024) & NIST FIPS 204 (ML-DSA-87)
Key Findings:
1. "Harvest Now, Decrypt Later" adversaries are actively archiving encrypted mobile traffic.
2. Legacy RSA-4096 & ECC P-384 algorithms will be rendered vulnerable by quantum hardware.
3. Q-CRYPT provides zero-touch Knox/Hardened Android OS provisioning with < 1.5ms latency.

Certified by Q-CRYPT Security Labs.`;
    
    navigator.clipboard.writeText(whitepaperContent);
    showToast('White Paper Downloaded', 'Post-Quantum Enterprise Strategy Guide copied to clipboard', 'success');
  };

  return (
    <section id="buyer-value" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative">
        
        {/* 0. Dynamic Trust & Usage Counter Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Badge 1: Client Hardware Isolation */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 shadow-xl relative overflow-hidden group hover:border-cyan-500/60 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>HARDWARE BOUND</span>
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight block">
              100% Enclave
            </span>
            <span className="text-xs font-bold text-cyan-300 font-sans block mt-1">
              Titan M2 / Knox Isolation
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Private encryption keys generated & locked inside physical hardware enclaves. Zero central server key storage.
            </p>
          </div>

          {/* Badge 2: NIST FIPS 203 Lattice Standard */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/30 shadow-xl relative overflow-hidden group hover:border-emerald-500/60 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>NIST STANDARD</span>
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight block">
              ML-KEM-1024
            </span>
            <span className="text-xs font-bold text-emerald-300 font-sans block mt-1">
              FIPS 203 Post-Quantum Encryption
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Module-Lattice key encapsulation protects all handshakes against "Store Now, Decrypt Later" quantum attacks.
            </p>
          </div>

          {/* Badge 3: Zero Breach Track Record */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-purple-500/30 shadow-xl relative overflow-hidden group hover:border-purple-500/60 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-[10px] font-mono text-purple-300 font-bold">
                <span>100% SNTD Immunity</span>
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-purple-300 font-mono tracking-tight block">
              0 Breaches
            </span>
            <span className="text-xs font-bold text-purple-200 font-sans block mt-1">
              Quantum Intercept Resistance
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Zero metadata logged. Immune to Harvest Now, Decrypt Later quantum attacks.
            </p>
          </div>

          {/* Badge 4: Sovereign Global Reach */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 shadow-xl relative overflow-hidden group hover:border-amber-500/60 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
                <span>42 Nations</span>
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight block">
              24/24 Relays
            </span>
            <span className="text-xs font-bold text-amber-200 font-sans block mt-1">
              Active Sovereign Enclaves
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Deployable across private sovereign clouds, Knox MDM, and air-gapped fleets.
            </p>
          </div>

        </div>

        {/* 1. Interactive ROI & Post-Quantum Breach Risk Calculator */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">Interactive Security ROI & Savings Calculator</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Calculate how much money and liability Q-CRYPT saves your enterprise
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold self-start md:self-auto">
              NIST FIPS 203 Quantified
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* User Seat Selector */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                  <span>Protected Mobile Seats / Devices:</span>
                  <span className="text-cyan-400 font-bold text-sm">{userCount.toLocaleString()} Users</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={userCount}
                  onChange={(e) => setUserCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>50 Seats</span>
                  <span>1,000 Seats</span>
                  <span>5,000+ Seats</span>
                </div>
              </div>

              {/* Industry Sector Selector */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2">
                  Industry & Threat Profile:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { key: 'defense', label: 'Defense & GovCloud', sub: 'Class-4 High Impact' },
                    { key: 'finance', label: 'Banking & FinTech', sub: 'SEC / FINRA / SWIFT' },
                    { key: 'healthcare', label: 'Healthcare & Pharma', sub: 'HIPAA & IP Data' },
                    { key: 'tech', label: 'Enterprise Tech', sub: 'SOC2 & Trade Secrets' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setIndustry(item.key as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        industry === item.key
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Calculated Output Card */}
            <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 text-center lg:text-left">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Calculated Risk Exposure Mitigation
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight mt-1 block">
                  ${(estimatedRiskExposure / 1000000).toFixed(2)}M <span className="text-sm font-normal text-slate-400">/ year</span>
                </span>
                <p className="text-xs text-slate-400 mt-2">
                  Estimated liability savings against Store-Now-Decrypt-Later state surveillance and regulatory non-compliance fines.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-left font-mono">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">MDM Deployment</span>
                  <span className="text-sm font-bold text-cyan-300">{estimatedMdmSetupTimeMinutes} Mins Total</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Key Latency Impact</span>
                  <span className="text-sm font-bold text-emerald-400">&lt; 1.5ms Overhead</span>
                </div>
              </div>

              <button
                onClick={handleDownloadWhitepaper}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs font-mono shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Download Executive CISO White Paper</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Enterprise Buyer Compliance & Standards Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Full Compliance & Accreditation Matrix</h3>
            <p className="text-xs text-slate-400 font-mono">
              Designed for integration into strict regulatory and privacy-focused enterprise environments
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'NIST FIPS 203', desc: 'U.S. Post-Quantum Standard' },
              { name: 'NIST FIPS 204', desc: 'Quantum Identity Verification' },
              { name: 'SOC 2 Type II', desc: 'Audited Cloud Security' },
              { name: 'ISO 27001', desc: 'Global Security Standard' },
              { name: 'CMMC Level 3', desc: 'Enterprise Readiness' },
              { name: 'HIPAA & GDPR', desc: '100% Mobile Privacy Safeguard' },
            ].map((cert, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center hover:border-cyan-500/40 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-white font-mono block">{cert.name}</span>
                <span className="text-[10px] text-slate-400 block mt-1">{cert.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
