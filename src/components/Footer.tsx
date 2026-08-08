import React, { useState, useEffect } from 'react';
import { Shield, Lock, ExternalLink, CheckCircle2, Cpu, Key, FileText, Smartphone, Radio, Sparkles, Server, ShieldCheck, Activity, Terminal, RefreshCw, Share2, GraduationCap, Award, Building2 } from 'lucide-react';
import { APP_REFERENCE } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { NewsletterSignup } from './NewsletterSignup';
import { useToast } from './Toast';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenCrmAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCrmAdmin }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  // Simulated Live Data Stream State for Quantum Encryption Nodes
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [pingLatency, setPingLatency] = useState(0.82);

  const simulatedNodeStream = [
    { region: 'US-EAST-1', ping: '0.8ms', status: 'LATTICE_SYNC_OK', algo: 'ML-KEM-1024' },
    { region: 'EU-CENTRAL-1', ping: '1.1ms', status: 'KMS_ENCLAVE_ACTIVE', algo: 'ML-DSA-87' },
    { region: 'AP-SOUTHEAST-1', ping: '1.4ms', status: 'P2P_MESH_RELAYED', algo: 'KYBER_HARDENED' },
    { region: 'US-WEST-2', ping: '0.7ms', status: 'KNOX_STRONG_BOX_OK', algo: 'ML-KEM-1024' },
  ];

  useEffect(() => {
    const streamInterval = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % simulatedNodeStream.length);
      setPingLatency((0.6 + Math.random() * 0.5));
    }, 2800);

    return () => clearInterval(streamInterval);
  }, []);

  const currentStream = simulatedNodeStream[activeLogIndex];

  const handleShare = async () => {
    const shareData = {
      title: 'Q-CRYPT - Quantum-Safe Mobile Messaging Platform',
      text: 'Check out Q-CRYPT, the NIST FIPS 203 post-quantum lattice encrypted mobile messaging platform for enterprise & defense.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Page Shared Successfully!', 'Thank you for sharing Q-CRYPT across your platforms.', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          showToast('Link Copied to Clipboard!', 'Web Share fallback triggered. URL copied to clipboard.', 'info');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied to Clipboard!', 'Q-CRYPT landing page URL copied to clipboard.', 'success');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-16 font-sans relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Post-Quantum Security Newsletter Signup */}
        <NewsletterSignup />

        {/* Top Section - Brand, Live Status & Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-900">
          
          {/* Brand Info & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-950/50">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight block">
                  Quantum Messenger (Q-CRYPT)
                </span>
                <span className="text-[11px] font-mono text-cyan-400 block">
                  NIST FIPS 203 / 204 Lattice Encryption Engine
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t('footer.description')}
            </p>

            {/* Live System Status Widget with Simulated Live Stream */}
            <div id="system-status" className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 font-mono text-xs text-slate-300 space-y-3 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                    SYSTEM STATUS: 99.999% SLA UPTIME
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  24/24 RELAYS ONLINE
                </span>
              </div>

              {/* Simulated Live Stream Node Pulse */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                    <Terminal className="w-3 h-3" />
                    <span>QUANTUM NODE LIVE STREAM</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{pingLatency.toFixed(2)}ms LATENCY</span>
                </div>

                <div className="flex items-center justify-between text-slate-200 pt-0.5 font-mono">
                  <span className="text-cyan-300 font-bold">{currentStream.region}</span>
                  <span className="text-slate-400">{currentStream.algo}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-pulse text-emerald-400" />
                    {currentStream.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                <div>
                  <span className="text-slate-500 block">Package Identifier:</span>
                  <code className="text-cyan-300 font-semibold">{APP_REFERENCE.packageId}</code>
                </div>
                <div>
                  <span className="text-slate-500 block">Hardware Vault:</span>
                  <span className="text-emerald-300 font-semibold">Titan M2 / Knox Isolated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Modules Nav */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <p className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('footer.portalSections')}</span>
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('apk-portal')} className="hover:text-cyan-400 transition-colors flex items-center space-x-2">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t('footer.apkDownload')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('key-demo')} className="hover:text-cyan-400 transition-colors flex items-center space-x-2">
                  <Key className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t('footer.kyberDemo')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hardware-checker')} className="hover:text-cyan-400 transition-colors flex items-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t('footer.hwEnclave')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('enterprise-portal')} className="hover:text-cyan-400 transition-colors flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t('footer.enterpriseTrial')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cti-feed')} className="hover:text-cyan-400 transition-colors flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t('footer.ctiFeed')}</span>
                </button>
              </li>
              {onOpenCrmAdmin && (
                <li>
                  <button onClick={onOpenCrmAdmin} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CRM Lead Admin Console</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Security & Compliance Highlights */}
          <div className="md:col-span-4 space-y-3 font-mono text-xs">
            <p className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('footer.complianceTitle')}</span>
            </p>

            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('footer.nistSpec')}</span>
              </li>
              <li className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('footer.cat5')}</span>
              </li>
              <li className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('footer.hardwareEnclave')}</span>
              </li>
              <li className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('footer.zeroMetadata')}</span>
              </li>
            </ul>

            {/* Quick Actions & Share */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => onNavigate('apk-portal')}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-all hover:scale-[1.02]"
              >
                <Smartphone className="w-4 h-4" />
                <span>Download Android APK</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-95 hover:bg-slate-800"
                title="Share Q-CRYPT via Web Share API or copy link"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share Q-CRYPT Platform</span>
              </button>
            </div>

          </div>

        </div>

        {/* Research Partners & Academic Collaborators Section */}
        <div className="pt-8 border-t border-slate-900 font-mono text-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold uppercase tracking-wider text-[11px]">
                Research Partners & Academic Collaborators
              </span>
            </div>
            <button
              onClick={() => onNavigate('academic-affiliations')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Academic Endorsements & Peer Reviews</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Academic Partner 1: École Hexagone Versailles */}
            <button
              onClick={() => onNavigate('academic-affiliations')}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 flex items-center space-x-3 text-left transition-all hover:bg-slate-900 group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow">
                EH
              </div>
              <div className="overflow-hidden">
                <span className="text-white font-bold block text-xs group-hover:text-blue-300 transition-colors">
                  École Hexagone (Versailles)
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  European Sovereign Cyber Institute 🇫🇷
                </span>
              </div>
            </button>

            {/* Academic Partner 2: Thunderbird School of Management */}
            <button
              onClick={() => onNavigate('academic-affiliations')}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 flex items-center space-x-3 text-left transition-all hover:bg-slate-900 group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs shadow">
                TB
              </div>
              <div className="overflow-hidden">
                <span className="text-white font-bold block text-xs group-hover:text-amber-300 transition-colors">
                  Thunderbird School of Management
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  Global Executive Tech Leadership 🇺🇸
                </span>
              </div>
            </button>

            {/* Academic Partner 3: NIST NCCoE PQC Consortium */}
            <button
              onClick={() => onNavigate('academic-affiliations')}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 flex items-center space-x-3 text-left transition-all hover:bg-slate-900 group sm:col-span-2 lg:col-span-1"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow">
                NIST
              </div>
              <div className="overflow-hidden">
                <span className="text-white font-bold block text-xs group-hover:text-emerald-300 transition-colors">
                  NIST PQC Industry Consortium
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  FIPS 203 & 204 Migration Working Group
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Legal & Security Guarantee */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-slate-500 gap-4 pt-2">
          <p>© 2026 Q-CRYPT Security Labs. {t('footer.rights')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center space-x-1 text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>NIST FIPS 203 Standardized</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">Zero-Trust Mobile Security Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

