import React, { useState } from 'react';
import { 
  ShieldCheck, Check, X, AlertTriangle, ShieldAlert, Sparkles, Smartphone, Lock, 
  Info, HelpCircle, Building2, MessageSquare, Database, Key, Server, Cpu, FileText, 
  Layers, Zap, AlertCircle, ChevronDown, ChevronUp, Terminal, Shield
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ComparisonFeature {
  id: string;
  feature: string;
  plainEnglish: string;
  qcrypt: {
    status: boolean | 'partial';
    label: string;
    detail: string;
  };
  standardApps: {
    status: boolean | 'partial';
    label: string;
    detail: string;
  };
  corporateChat: {
    status: boolean | 'partial';
    label: string;
    detail: string;
  };
}

export const SecurityComparisonTable: React.FC = () => {
  const { t } = useLanguage();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [viewFilter, setViewFilter] = useState<'all' | 'corporate' | 'standard'>('all');
  const [showCorpElaboration, setShowCorpElaboration] = useState<boolean>(true);
  
  // Risk Estimator State
  const [teamSize, setTeamSize] = useState<number>(250);
  const [sensitivityDomain, setSensitivityDomain] = useState<'csuite' | 'ip' | 'legal' | 'finances'>('csuite');

  const features: ComparisonFeature[] = [
    {
      id: 'r1',
      feature: t('comp.r1.feature'),
      plainEnglish: t('comp.r1.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r1.qcLabel'),
        detail: t('comp.r1.qcDetail'),
      },
      standardApps: {
        status: false,
        label: t('comp.r1.stdLabel'),
        detail: t('comp.r1.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r1.corpLabel'),
        detail: t('comp.r1.corpDetail'),
      },
    },
    {
      id: 'r2',
      feature: t('comp.r2.feature'),
      plainEnglish: t('comp.r2.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r2.qcLabel'),
        detail: t('comp.r2.qcDetail'),
      },
      standardApps: {
        status: 'partial',
        label: t('comp.r2.stdLabel'),
        detail: t('comp.r2.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r2.corpLabel'),
        detail: t('comp.r2.corpDetail'),
      },
    },
    {
      id: 'r3',
      feature: t('comp.r3.feature'),
      plainEnglish: t('comp.r3.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r3.qcLabel'),
        detail: t('comp.r3.qcDetail'),
      },
      standardApps: {
        status: false,
        label: t('comp.r3.stdLabel'),
        detail: t('comp.r3.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r3.corpLabel'),
        detail: t('comp.r3.corpDetail'),
      },
    },
    {
      id: 'r4',
      feature: t('comp.r4.feature'),
      plainEnglish: t('comp.r4.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r4.qcLabel'),
        detail: t('comp.r4.qcDetail'),
      },
      standardApps: {
        status: 'partial',
        label: t('comp.r4.stdLabel'),
        detail: t('comp.r4.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r4.corpLabel'),
        detail: t('comp.r4.corpDetail'),
      },
    },
    {
      id: 'r5',
      feature: t('comp.r5.feature'),
      plainEnglish: t('comp.r5.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r5.qcLabel'),
        detail: t('comp.r5.qcDetail'),
      },
      standardApps: {
        status: 'partial',
        label: t('comp.r5.stdLabel'),
        detail: t('comp.r5.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r5.corpLabel'),
        detail: t('comp.r5.corpDetail'),
      },
    },
    {
      id: 'r6',
      feature: t('comp.r6.feature'),
      plainEnglish: t('comp.r6.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r6.qcLabel'),
        detail: t('comp.r6.qcDetail'),
      },
      standardApps: {
        status: 'partial',
        label: t('comp.r6.stdLabel'),
        detail: t('comp.r6.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r6.corpLabel'),
        detail: t('comp.r6.corpDetail'),
      },
    },
    {
      id: 'r7',
      feature: t('comp.r7.feature'),
      plainEnglish: t('comp.r7.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r7.qcLabel'),
        detail: t('comp.r7.qcDetail'),
      },
      standardApps: {
        status: false,
        label: t('comp.r7.stdLabel'),
        detail: t('comp.r7.stdDetail'),
      },
      corporateChat: {
        status: 'partial',
        label: t('comp.r7.corpLabel'),
        detail: t('comp.r7.corpDetail'),
      },
    },
    {
      id: 'r8',
      feature: t('comp.r8.feature'),
      plainEnglish: t('comp.r8.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r8.qcLabel'),
        detail: t('comp.r8.qcDetail'),
      },
      standardApps: {
        status: 'partial',
        label: t('comp.r8.stdLabel'),
        detail: t('comp.r8.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r8.corpLabel'),
        detail: t('comp.r8.corpDetail'),
      },
    },
    {
      id: 'r9',
      feature: t('comp.r9.feature'),
      plainEnglish: t('comp.r9.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r9.qcLabel'),
        detail: t('comp.r9.qcDetail'),
      },
      standardApps: {
        status: 'partial',
        label: t('comp.r9.stdLabel'),
        detail: t('comp.r9.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r9.corpLabel'),
        detail: t('comp.r9.corpDetail'),
      },
    },
    {
      id: 'r10',
      feature: t('comp.r10.feature'),
      plainEnglish: t('comp.r10.plain'),
      qcrypt: {
        status: true,
        label: t('comp.r10.qcLabel'),
        detail: t('comp.r10.qcDetail'),
      },
      standardApps: {
        status: 'partial',
        label: t('comp.r10.stdLabel'),
        detail: t('comp.r10.stdDetail'),
      },
      corporateChat: {
        status: false,
        label: t('comp.r10.corpLabel'),
        detail: t('comp.r10.corpDetail'),
      },
    },
  ];

  // Risk Score Calculation
  const calculateSlackRiskScore = () => {
    let base = 85;
    if (teamSize > 100) base += 5;
    if (teamSize > 1000) base += 4;
    if (sensitivityDomain === 'csuite' || sensitivityDomain === 'ip') base += 5;
    return Math.min(base, 99);
  };

  return (
    <section id="security-comparison" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{t('comparison.tag')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {t('comparison.title')}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('comparison.subtitle')}
          </p>

          {/* View Filter Switcher */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            <span className="text-slate-500 mr-1 hidden sm:inline">Compare Mode:</span>
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all ${
                viewFilter === 'all'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-950/50'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Platforms (Full Matrix)
            </button>

            <button
              onClick={() => setViewFilter('corporate')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                viewFilter === 'corporate'
                  ? 'bg-rose-950 border-rose-500/80 text-rose-300 font-bold shadow-md shadow-rose-950/50'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-rose-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-rose-400" />
              <span>vs. Corporate Chat (Slack / Teams)</span>
            </button>

            <button
              onClick={() => setViewFilter('standard')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                viewFilter === 'standard'
                  ? 'bg-amber-950 border-amber-500/80 text-amber-300 font-bold shadow-md shadow-amber-950/50'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-amber-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>vs. Standard Apps (WhatsApp / Signal)</span>
            </button>
          </div>
        </div>

        {/* FEATURED: Corporate Chat (Slack / Teams) Vulnerability Elaboration Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500/50 text-rose-300 text-[11px] font-mono font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>EXECUTIVE SECURITY BRIEFING: SLACK & TEAMS RISK VECTOR</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Why Corporate Chat <span className="text-rose-400 font-mono">(Slack / Teams)</span> Leaves Executive Communications Vulnerable
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Corporate workspaces store plain-text searchable logs on vendor cloud servers (AWS/Azure). They lack hardware enclave key isolation, remain exposed to infostealer malware session hijacking, and accumulate massive permanent cloud retention databases vulnerable to future quantum decryption (HNDL).
              </p>
            </div>

            <button
              onClick={() => setShowCorpElaboration(!showCorpElaboration)}
              className="px-5 py-3 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-500/60 text-xs font-mono font-bold flex items-center space-x-2 shrink-0 transition-all shadow-lg shadow-rose-950/50"
            >
              <Building2 className="w-4 h-4 text-rose-400" />
              <span>{showCorpElaboration ? 'Hide Corporate Chat Risk Elaboration' : 'Elaborate Corporate Chat (Slack / Teams) Risks'}</span>
              {showCorpElaboration ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expanded Corporate Chat Deep-Dive Breakdown */}
          {showCorpElaboration && (
            <div className="mt-8 pt-8 border-t border-slate-800/80 space-y-8 animate-fadeIn">
              
              {/* 4 Core Vulnerability Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Vector 1 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-sans">1. Cloud Server Retention & eDiscovery</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Slack and Teams retain full chat histories in cloud databases for indexing and search. Vendor administrators or legal subpoenas can export entire workspace dumps without client consent.
                  </p>
                </div>

                {/* Vector 2 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-sans">2. Quantum HNDL Vulnerability</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Communications rely on standard TLS (RSA/ECDSA) in transit. State-sponsored adversaries passively harvest stored cloud archives today to decrypt board discussions when quantum computers scale.
                  </p>
                </div>

                {/* Vector 3 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-sans">3. Infostealer Session Hijacking</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Modern desktop malware (Lumma / RedLine) steals Slack session tokens and Teams <code className="text-rose-300">.ldb</code> databases directly from local disk, granting attackers persistent channel access without 2FA.
                  </p>
                </div>

                {/* Vector 4 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-sans">4. Unencrypted Bot & Webhook Leaks</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Slack & Teams apps connected to GitHub, Jira, or CI/CD pipelines frequently index and post unencrypted API keys, secrets, and code snippets into public employee channels.
                  </p>
                </div>

              </div>

              {/* Interactive Risk Calculator */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider block">CISO Interactive Assessment</span>
                    <h4 className="text-base font-bold text-white font-sans">Corporate Chat Communication Risk Calculator</h4>
                  </div>
                  
                  <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 font-mono text-xs font-bold">
                    <span>Slack / Teams Exposure Index:</span>
                    <span className="text-base font-extrabold text-rose-400">{calculateSlackRiskScore()}% High Risk</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Selector 1: Team Size */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-slate-300">
                      Organization Workplace Size (Seats):
                    </label>
                    <div className="flex items-center space-x-2">
                      {[50, 250, 1000, 5000].map(size => (
                        <button
                          key={size}
                          onClick={() => setTeamSize(size)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                            teamSize === size
                              ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {size}+ Seats
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selector 2: Domain Sensitivity */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-slate-300">
                      Communication Domain Sensitivity:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'csuite', label: 'C-Suite / M&A Deals' },
                        { id: 'ip', label: 'Source Code & IP' },
                        { id: 'legal', label: 'Legal & HR Matters' },
                        { id: 'finances', label: 'Financial Records' }
                      ].map(domain => (
                        <button
                          key={domain.id}
                          onClick={() => setSensitivityDomain(domain.id as any)}
                          className={`p-2 rounded-lg border text-left text-xs font-mono transition-all ${
                            sensitivityDomain === domain.id
                              ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {domain.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mitigation Recommendation */}
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-start space-x-3 text-xs font-mono">
                  <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-cyan-200 font-bold">
                      Recommended CISO Protocol: Out-of-Band Executive Security Deployment
                    </p>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      Keep everyday operational chats in Slack/Teams, but route confidential executive strategy, M&A discussions, board minutes, and security incident response through <strong className="text-cyan-400">Q-CRYPT hardware-enforced post-quantum channels</strong>.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* Main Security Comparison Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
          
          {/* Table Header Bar */}
          <div className="grid grid-cols-12 bg-slate-950/90 p-4 sm:p-6 border-b border-slate-800 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 items-center">
            
            <div className="col-span-12 md:col-span-4 text-slate-200 mb-2 md:mb-0">
              {t('comp.secCap') || 'Security Capability / Vector'}
            </div>

            <div className={`col-span-12 md:col-span-3 text-cyan-400 flex items-center justify-start gap-1.5 ${viewFilter === 'standard' || viewFilter === 'corporate' ? 'md:col-span-4' : ''}`}>
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{t('comparison.qcrypt')}</span>
            </div>

            {(viewFilter === 'all' || viewFilter === 'standard') && (
              <div className={`col-span-12 md:col-span-3 text-amber-400 flex items-center justify-start gap-1.5 ${viewFilter === 'standard' ? 'md:col-span-4' : ''}`}>
                <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{t('comparison.standard')}</span>
              </div>
            )}

            {(viewFilter === 'all' || viewFilter === 'corporate') && (
              <div className={`col-span-12 md:col-span-2 text-rose-400 flex items-center justify-start gap-1.5 ${viewFilter === 'corporate' ? 'md:col-span-4' : ''}`}>
                <Building2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">{t('comp.corpChat')}</span>
              </div>
            )}

          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-800/80">
            {features.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 p-4 sm:p-6 hover:bg-slate-800/40 transition-colors items-start gap-4 md:gap-0">
                
                {/* Capability & Plain English Explanation */}
                <div className="col-span-12 md:col-span-4 space-y-1 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white font-sans">{item.feature}</span>
                    <button
                      onClick={() => setActiveTooltip(activeTooltip === index ? null : index)}
                      className="text-slate-500 hover:text-cyan-400 md:hidden"
                      title="Explain in plain English"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {item.plainEnglish}
                  </p>

                  {/* Mobile Tooltip toggleable */}
                  {activeTooltip === index && (
                    <div className="p-2.5 rounded-lg bg-cyan-950/90 border border-cyan-800 text-[11px] text-cyan-200 mt-2 md:hidden">
                      <strong className="block text-white mb-0.5">Plain English Summary:</strong>
                      {item.plainEnglish}
                    </div>
                  )}
                </div>

                {/* Q-CRYPT Column */}
                <div className={`col-span-12 md:col-span-3 bg-cyan-950/20 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-cyan-500/20 ${viewFilter === 'standard' || viewFilter === 'corporate' ? 'md:col-span-4' : ''}`}>
                  <div className="flex items-start space-x-2">
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block font-mono">{item.qcrypt.label}</span>
                      <span className="text-[11px] text-slate-300 block font-sans mt-0.5 leading-snug">{item.qcrypt.detail}</span>
                    </div>
                  </div>
                </div>

                {/* Standard Apps Column */}
                {(viewFilter === 'all' || viewFilter === 'standard') && (
                  <div className={`col-span-12 md:col-span-3 bg-slate-950/50 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-slate-800 ${viewFilter === 'standard' ? 'md:col-span-4' : ''}`}>
                    <div className="flex items-start space-x-2">
                      <div className={`p-1 rounded-full shrink-0 mt-0.5 ${
                        item.standardApps.status === true
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.standardApps.status === 'partial'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {item.standardApps.status === true ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : item.standardApps.status === 'partial' ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className={`text-xs font-bold block font-mono ${
                          item.standardApps.status === true ? 'text-emerald-400' : item.standardApps.status === 'partial' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {item.standardApps.label}
                        </span>
                        <span className="text-[11px] text-slate-400 block font-sans mt-0.5 leading-snug">{item.standardApps.detail}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Corporate Chat Column (Slack / Teams Focus) */}
                {(viewFilter === 'all' || viewFilter === 'corporate') && (
                  <div className={`col-span-12 md:col-span-2 bg-rose-950/20 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-rose-500/30 ${viewFilter === 'corporate' ? 'md:col-span-4' : ''}`}>
                    <div className="flex items-start space-x-2">
                      <div className={`p-1 rounded-full shrink-0 mt-0.5 ${
                        item.corporateChat.status === true
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.corporateChat.status === 'partial'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {item.corporateChat.status === true ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : item.corporateChat.status === 'partial' ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className={`text-xs font-bold block font-mono ${
                          item.corporateChat.status === true ? 'text-emerald-400' : item.corporateChat.status === 'partial' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {item.corporateChat.label}
                        </span>
                        <span className="text-[11px] text-slate-400 block font-sans mt-0.5 leading-snug">{item.corporateChat.detail}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Footer Callout inside Table */}
          <div className="p-5 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-white mr-1 block sm:inline font-bold">
                  {t('comp.bottomLine') || 'The Bottom Line for Security Leaders:'}
                </strong> 
                <span className="text-slate-300">
                  {t('comp.bottomLineDesc') || 'Standard end-to-end encryption (RSA/ECC) and legacy corporate chat platforms (Slack/Teams) leave enterprise communications vulnerable to "Harvest Now, Decrypt Later" quantum attacks and session hijacking. Q-CRYPT provides certified NIST FIPS 203 (ML-KEM-1024) post-quantum lattice security paired with hardware enclave isolation, delivering long-term immunity for enterprise and defense teams.'}
                </span>
              </div>
            </div>

            <a
              href="#apk-portal"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono text-xs font-extrabold whitespace-nowrap transition-all shrink-0 shadow-lg shadow-cyan-950/50 hover:scale-[1.02]"
            >
              {t('comp.getProtectedBtn') || 'Deploy Post-Quantum Protection'}
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
