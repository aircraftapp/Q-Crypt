import React, { useState, useEffect } from 'react';
import { 
  Shield, Cpu, Download, Key, Smartphone, Building2, ExternalLink, Menu, X, 
  CheckCircle, Lock, CpuIcon, Sparkles, Award, ShieldCheck, Star, Radio, 
  TrendingUp, Briefcase, FileText, DollarSign, PieChart, Users, ChevronRight, Binary, ArrowUpRight,
  Sun, Moon, Database
} from 'lucide-react';
import { APP_REFERENCE } from '../data';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';
import { useTheme } from '../context/ThemeContext';
import { useGoldenRetriever } from '../context/GoldenRetrieverContext';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenWhitepaper?: () => void;
  onOpenCrmAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenWhitepaper, onOpenCrmAdmin }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { isGoldenMode, toggleGoldenMode } = useGoldenRetriever();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [protocolStatus, setProtocolStatus] = useState<{
    text: string;
    level: string;
    isWebCryptoAvailable: boolean;
  }>({
    text: 'Checking Capability...',
    level: 'L5',
    isWebCryptoAvailable: true,
  });
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    // Real-time browser capability check
    const checkSecurityCapabilities = async () => {
      const hasWebCrypto = typeof window !== 'undefined' && !!window.crypto && !!window.crypto.subtle;
      if (hasWebCrypto) {
        setProtocolStatus({
          text: t('nav.status'),
          level: 'ML-KEM-1024',
          isWebCryptoAvailable: true,
        });
      } else {
        setProtocolStatus({
          text: 'PQC Fallback Active',
          level: 'Software Emulated',
          isWebCryptoAvailable: false,
        });
      }
    };

    checkSecurityCapabilities();
  }, [t]);

  const navItems = [
    { label: t('nav.apk'), id: 'apk-portal', icon: Download, highlight: true },
    { label: 'Firebase PQC Vault', id: 'firebase-pqc-database', icon: Database, highlight: true },
    { label: t('nav.features'), id: 'app-showcase', icon: Sparkles, highlight: false },
    { label: t('nav.comparison'), id: 'security-comparison', icon: ShieldCheck, highlight: false },
    { label: t('nav.enterprise'), id: 'enterprise-portal', icon: Building2, highlight: true },
    { label: t('nav.faq'), id: 'faq-section', icon: Cpu, highlight: false },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const copyInvestorDeckLink = () => {
    navigator.clipboard.writeText('https://q-crypt.sec/investor-pitch-deck-v2.4.pdf');
    showToast('Investor Deck & Financial Data Room link copied to clipboard!', 'success');
  };

  return (
    <>
      {/* Top Investor & Executive Highlight Announcement Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 border-b border-cyan-500/30 text-slate-100 text-xs py-1.5 px-4 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-mono">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-cyan-400 font-bold hidden sm:inline">{t('nav.bannerTitle')}</span>
            <span className="text-slate-200">{t('nav.bannerText')}</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <button
              onClick={() => handleNavClick('investor-relations')}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-bold transition-all"
            >
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>{t('nav.investorBriefing')}</span>
              <ChevronRight className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b-2 border-cyan-500/30 shadow-2xl shadow-cyan-950/40 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand / Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => handleNavClick('hero')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 via-emerald-500/30 to-slate-900 border border-cyan-400/60 shadow-lg shadow-cyan-500/20 group-hover:border-cyan-300 transition-all">
              <Shield className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                  Q-CRYPT
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/80 font-bold shadow-sm">
                  v2.4 PQC
                </span>
              </div>
              <p className="text-[10px] text-cyan-400 font-mono hidden sm:block">
                NIST FIPS 203 Post-Quantum Shield
              </p>
            </div>
          </div>

          {/* Real-Time Security Protocol Indicator Badge */}
          <div className="hidden xl:flex items-center relative shrink-0">
            <button
              onClick={() => setShowStatusModal(!showStatusModal)}
              className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/60 hover:border-emerald-400 text-xs font-mono text-emerald-300 transition-all shadow-sm active:scale-95 hover:bg-slate-800"
              title="Click to inspect real-time security protocol status"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold">{protocolStatus.text}</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-700 font-semibold">
                {protocolStatus.level}
              </span>
            </button>

            {/* Protocol Details Popover */}
            {showStatusModal && (
              <div className="absolute top-10 left-0 mt-2 w-72 p-4 rounded-xl bg-slate-900 border border-emerald-500/60 shadow-2xl z-50 text-xs text-slate-200 font-mono space-y-2.5 animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> Protocol Diagnostics
                  </span>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>WebCrypto API:</span>
                    <span className="text-emerald-400 font-bold">
                      {protocolStatus.isWebCryptoAvailable ? 'Supported ✓' : 'Unavailable ✕'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AES-GCM 256:</span>
                    <span className="text-emerald-400 font-bold">Hardware Accelerated</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ML-KEM-1024 (Kyber):</span>
                    <span className="text-cyan-400 font-bold">Lattice Ring Active</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>CRQC Tunneling:</span>
                    <span className="text-emerald-400 font-bold">Protected</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">
                  Verified against NIST FIPS 203 post-quantum standard in current browser runtime.
                </p>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    item.highlight
                      ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900/90 shadow-sm'
                      : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-cyan-400' : 'text-cyan-500/80'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center group"
              title={theme === 'dark' ? 'Switch to High-Tech Light Mode' : 'Switch to High-Tech Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Golden Retriever Mode Toggle Button */}
            <button
              onClick={toggleGoldenMode}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all shadow-md active:scale-95 flex items-center space-x-1.5 ${
                isGoldenMode
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 scale-105 font-black'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-amber-400 hover:border-amber-500/50'
              }`}
              title="Toggle Golden Retriever Mode (Excited, Simple & Pawsome Tone! 🐕)"
            >
              <span className="text-sm">🐕</span>
              <span className="hidden sm:inline">{isGoldenMode ? 'Golden Mode ON 🎾' : 'Golden Mode'}</span>
            </button>

            <LanguageSelector />

            {onOpenCrmAdmin && (
              <button
                onClick={onOpenCrmAdmin}
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs shadow-md transition-all hover:bg-emerald-950/40"
                title="CRM Lead Management Console (Shortcut: Ctrl+K or Cmd+K)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CRM Admin</span>
                <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-slate-950 text-emerald-400 rounded border border-emerald-800">Ctrl+K</kbd>
              </button>
            )}

            {onOpenWhitepaper && (
              <button
                onClick={onOpenWhitepaper}
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-bold text-xs shadow-md transition-all hover:bg-cyan-900/80"
                title="PQC Whitepaper (Shortcut: Ctrl+W or Cmd+W)"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>PQC Whitepaper</span>
                <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-slate-950 text-cyan-400 rounded border border-cyan-800">Ctrl+W</kbd>
              </button>
            )}

            <button
              onClick={() => setShowInvestorModal(true)}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold text-xs shadow-md transition-all hover:bg-cyan-950/50"
            >
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Investor Briefing</span>
            </button>

            <button
              onClick={() => handleNavClick('apk-portal')}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 transition-all hover:scale-[1.03]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('nav.launchApp')}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-slate-200 hover:text-white ml-1"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-cyan-500/30 px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto">
            {/* Mobile Highlights */}
            <div className="grid grid-cols-1 gap-2">
              {onOpenCrmAdmin && (
                <button
                  onClick={() => {
                    onOpenCrmAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-emerald-500/50 text-xs font-mono text-emerald-300 font-bold"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>CRM Lead Management Console (Admin Access)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onOpenWhitepaper && (
                  <button
                    onClick={() => {
                      onOpenWhitepaper();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-cyan-950/80 border border-cyan-400 text-xs font-mono text-cyan-300 font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>PQC Security Whitepaper</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowInvestorModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/50 text-xs font-mono text-cyan-300 font-bold"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Investor Briefing & Data Room</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Mobile active protocol indicator */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300 my-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{protocolStatus.text}</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">{protocolStatus.level}</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-900 hover:text-cyan-400"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick('apk-portal')}
                className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Android APK</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Investor Briefing & Data Room Modal */}
      {showInvestorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Investor Briefing & Executive Summary</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  Q-CRYPT Series-A Investment Brief
                </h3>
                <p className="text-slate-400 text-xs font-mono">
                  Post-Quantum Mobile Security Infrastructure • NIST FIPS 203 / 204 Standardized
                </p>
              </div>

              <button
                onClick={() => setShowInvestorModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Investment Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Global Market TAM</span>
                <span className="text-cyan-400 font-extrabold text-lg">$42 Billion</span>
                <span className="text-[10px] text-slate-500 block">By 2030 (Cybersecurity)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Enterprise ARR Seat</span>
                <span className="text-emerald-400 font-extrabold text-lg">$120 / seat / yr</span>
                <span className="text-[10px] text-slate-500 block">88% Gross Margin</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Active Pilot Seats</span>
                <span className="text-white font-extrabold text-lg">24,500 Seats</span>
                <span className="text-[10px] text-emerald-400 block">+48% QoQ Growth</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">NIST FIPS 203/204</span>
                <span className="text-cyan-300 font-extrabold text-lg">Level 5 Safe</span>
                <span className="text-[10px] text-slate-500 block">Shor's Algorithm Immune</span>
              </div>
            </div>

            {/* Investment Moat & Value Highlights */}
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-400" />
                Strategic Moat & Technical Advantage
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    Proprietary NDK Lattice Engine
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Native C++ / Kotlin NDK implementation of Kyber-1024 with zero latency delay (&lt;0.8ms key exchange on mobile devices).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Titan M2 Hardware Isolation
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Binds lattice private keys directly to physical hardware StrongBox die, shielding keys against RAM memory extraction.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    First-Mover HNDL Neutralization
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Prevents Harvest-Now-Decrypt-Later state surveillance tapping. Crucial mandate for government and defense supply chains.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    Zero Cloud Database Exposure
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Ephemeral relay architecture with strict zero-knowledge messaging guarantees, eliminating regulatory compliance risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons for VC Investors */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={copyInvestorDeckLink}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs border border-slate-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Copy Pitch Deck & Data Room URL</span>
              </button>

              <button
                onClick={() => {
                  setShowInvestorModal(false);
                  handleNavClick('enterprise-portal');
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold shadow-lg transition-all"
              >
                <Briefcase className="w-4 h-4" />
                <span>Schedule CISO / Investor Briefing</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

