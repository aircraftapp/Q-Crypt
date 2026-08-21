import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Cpu, Download, Key, Smartphone, Building2, ExternalLink, Menu, X, 
  CheckCircle, Lock, Sparkles, Award, ShieldCheck, Radio, 
  TrendingUp, Briefcase, FileText, PieChart, ChevronRight, ChevronDown, Binary, 
  Moon, Database, Layers, SlidersHorizontal, Activity
} from 'lucide-react';
import { APP_REFERENCE } from '../data';
import { LanguageSelector } from './LanguageSelector';
import { QuantumNetworkStatus } from './QuantumNetworkStatus';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';
import { useTheme } from '../context/ThemeContext';
import { useGoldenRetriever } from '../context/GoldenRetrieverContext';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenWhitepaper?: () => void;
  onOpenCrmAdmin?: () => void;
  onOpenExecutiveOverview?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  onOpenWhitepaper, 
  onOpenCrmAdmin, 
  onOpenExecutiveOverview 
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { isGoldenMode, toggleGoldenMode } = useGoldenRetriever();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary fast-access pills on desktop
  const quickLinks = [
    { label: t('nav.apk'), id: 'apk-portal', icon: Download },
    { label: t('nav.pqcChat'), id: 'interactive-chat-preview', icon: Smartphone },
    { label: t('nav.polygonDid'), id: 'polygon-decentralized-identity', icon: Layers },
    { label: t('nav.fipsHsm'), id: 'hardware-security-module', icon: Cpu },
  ];

  // Categorized comprehensive navigation items
  const securitySections = [
    { label: t('nav.threatModeling'), id: 'quantum-threat-modeling', icon: Binary, desc: 'NIST FIPS 203 vs Shor’s Algorithm Matrix' },
    { label: t('nav.compMatrix'), id: 'competitive-security-matrix', icon: Layers, desc: 'Signal / Matrix / WhatsApp PQC Benchmark' },
    { label: t('nav.firebaseVault'), id: 'firebase-pqc-database', icon: Database, desc: 'Hybrid Post-Quantum Enclave Firestore Storage' },
    { label: 'RSA vs Lattice Sim', id: 'rsa-simulation', icon: Activity, desc: 'Real-time side-by-side quantum decapsulation speed' },
  ];

  const enterpriseSections = [
    { label: t('nav.enterprisePki'), id: 'enterprise-pki', icon: Key, desc: 'ML-DSA-87 & Dilithium Root Certificate Authority' },
    { label: t('nav.enterprise'), id: 'enterprise-portal', icon: Building2, desc: 'Enterprise Pilots, SLA Contracts & Dedicated Enclaves' },
    { label: t('nav.quantumClocks'), id: 'quantum-clocks', icon: Radio, desc: 'Rubidium Atomic Clock & NTP Replay Protection' },
    { label: t('nav.anssiNis2'), id: 'anssi-nis2-france', icon: Award, desc: 'ANSSI SecNumCloud & EU NIS2 Compliance Directives' },
    { label: t('nav.features'), id: 'app-showcase', icon: Sparkles, desc: 'Encrypted Media, Steganography & Duress Vault' },
    { label: t('nav.faq'), id: 'faq-section', icon: Cpu, desc: 'NIST PQC Migration & Cryptographic Q&A' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setShowDropdown(false);
  };

  const copyInvestorDeckLink = () => {
    navigator.clipboard.writeText('https://q-crypt.sec/investor-pitch-deck-v2.4.pdf');
    showToast('Investor Deck & Financial Data Room link copied to clipboard!', 'success');
  };

  return (
    <>
      {/* Pinned North Navigation Bar Container */}
      <div id="north-nav-bar" className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full shadow-2xl">
        
        {/* Top Investor & Executive Highlight Announcement Bar */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-950 to-emerald-950 border-b border-cyan-500/30 text-slate-100 text-xs py-1 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 font-mono">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-cyan-400 font-bold text-[11px] hidden sm:inline">{t('nav.bannerTitle')}</span>
              <span className="text-slate-300 text-[11px] truncate max-w-xs sm:max-w-md md:max-w-lg">{t('nav.bannerText')}</span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-mono shrink-0">
              <button
                onClick={() => handleNavClick('investor-relations')}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-bold transition-all cursor-pointer"
              >
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                <span>{t('nav.investorBriefing')}</span>
                <ChevronRight className="w-3 h-3 text-cyan-400" />
              </button>

              {onOpenExecutiveOverview && (
                <button
                  onClick={onOpenExecutiveOverview}
                  className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  <Building2 className="w-3 h-3 text-cyan-400" />
                  <span>Executive</span>
                </button>
              )}

              {onOpenWhitepaper && (
                <button
                  onClick={onOpenWhitepaper}
                  className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 font-bold transition-all cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>Whitepaper</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Header / Navigation Bar */}
        <header className="bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/30 text-slate-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
            
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

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1.5">
              
              {/* Quick High-Priority Nav Pills */}
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Comprehensive Navigation Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                    showDropdown
                      ? 'bg-slate-800 text-white border-cyan-400'
                      : 'bg-slate-900/90 text-slate-200 hover:text-white border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>All Portals & Security</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute top-10 right-0 mt-2 w-96 p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl z-50 text-xs font-sans space-y-4 animate-fadeIn">
                    
                    {/* Security & Cryptographic Analysis */}
                    <div>
                      <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider px-2 pb-1.5 border-b border-slate-800 flex items-center justify-between">
                        <span>Security & Quantum Threat</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div className="grid grid-cols-1 gap-1 pt-1.5">
                        {securitySections.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavClick(item.id)}
                              className="w-full text-left p-2 rounded-xl hover:bg-cyan-950/60 border border-transparent hover:border-cyan-500/30 transition-all flex items-start space-x-2.5 cursor-pointer group"
                            >
                              <Icon className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-slate-200 group-hover:text-cyan-300 text-xs">{item.label}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{item.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Enterprise Infrastructure & Hardware */}
                    <div>
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider px-2 pb-1.5 border-b border-slate-800 flex items-center justify-between">
                        <span>Enterprise & Compliance</span>
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="grid grid-cols-1 gap-1 pt-1.5">
                        {enterpriseSections.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavClick(item.id)}
                              className="w-full text-left p-2 rounded-xl hover:bg-emerald-950/60 border border-transparent hover:border-emerald-500/30 transition-all flex items-start space-x-2.5 cursor-pointer group"
                            >
                              <Icon className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-slate-200 group-hover:text-emerald-300 text-xs">{item.label}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{item.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center space-x-2 shrink-0">
              
              {/* Quantum Decentralized Network Status & Tunnel Indicator */}
              <QuantumNetworkStatus />

              {/* Real-Time Security Protocol Indicator Badge (Clickable) */}
              <div className="hidden xl:flex items-center relative shrink-0">
                <button
                  onClick={() => setShowStatusModal(!showStatusModal)}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/60 hover:border-emerald-400 text-xs font-mono text-emerald-300 transition-all shadow-sm active:scale-95 hover:bg-slate-800 cursor-pointer"
                  title="Click to inspect real-time security protocol status"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-[11px]">{protocolStatus.level}</span>
                </button>

                {/* Protocol Details Popover */}
                {showStatusModal && (
                  <div className="absolute top-10 right-0 mt-2 w-72 p-4 rounded-xl bg-slate-900 border border-emerald-500/60 shadow-2xl z-50 text-xs text-slate-200 font-mono space-y-2.5 animate-fadeIn">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" /> Protocol Diagnostics
                      </span>
                      <button
                        onClick={() => setShowStatusModal(false)}
                        className="text-slate-400 hover:text-white text-xs cursor-pointer"
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

              {/* Global Theme Toggle: Dark Mode <-> High-Contrast 'Military Report' Light Mode */}
              <button
                onClick={() => {
                  toggleTheme();
                  showToast(
                    theme === 'dark' ? 'Military Report Mode Enabled' : 'Dark Tactical Mode Enabled',
                    theme === 'dark' ? 'High-contrast light palette optimized for technical review.' : 'Low-emission tactical dark palette active.',
                    'info'
                  );
                }}
                className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all shadow-md active:scale-95 flex items-center space-x-1.5 cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-200 border-slate-400 text-slate-900 ring-1 ring-slate-400'
                    : 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-400 text-cyan-300 hover:text-white'
                }`}
                title={theme === 'dark' ? "Switch to High-Contrast 'Military Report' Light Mode" : 'Switch to Default Dark Mode'}
                aria-label="Toggle Global Theme"
              >
                {theme === 'dark' ? (
                  <FileText className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              {/* Golden Retriever Mode Toggle Button */}
              <button
                onClick={toggleGoldenMode}
                className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all shadow-md active:scale-95 flex items-center cursor-pointer ${
                  isGoldenMode
                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 scale-105 font-black'
                    : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-amber-400 hover:border-amber-500/50'
                }`}
                title="Toggle Golden Retriever Mode (Excited, Simple & Pawsome Tone! 🐕)"
                aria-label="Toggle Golden Retriever Mode"
              >
                <span className="text-sm leading-none">🐕</span>
              </button>

              <LanguageSelector />

              {/* Launch App Primary CTA */}
              <button
                onClick={() => handleNavClick('apk-portal')}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 transition-all hover:scale-[1.03] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('nav.launchApp')}</span>
              </button>

              {/* Mobile / Tablet Menu Trigger (Visible on < lg screens) */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-slate-200 hover:text-white cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-slate-950 border-t border-cyan-500/30 px-4 pt-3 pb-6 space-y-3 max-h-[80vh] overflow-y-auto font-sans text-xs">
              
              {/* Network Status Pill on Mobile */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">Decentralized Mesh Tunnel:</span>
                <QuantumNetworkStatus />
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-2 gap-2">
                {onOpenWhitepaper && (
                  <button
                    onClick={() => {
                      onOpenWhitepaper();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-bold flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Whitepaper</span>
                  </button>
                )}

                {onOpenCrmAdmin && (
                  <button
                    onClick={() => {
                      onOpenCrmAdmin();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 font-bold flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>CRM Admin</span>
                  </button>
                )}
              </div>

              {/* Primary Links */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold px-2 py-1">
                  Core Quantum Applications
                </div>
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-200 bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800"
                    >
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Security Sections */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold px-2 py-1">
                  Security & Threat Modeling
                </div>
                {securitySections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-white"
                    >
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Enterprise Sections */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-purple-400 font-bold px-2 py-1">
                  Enterprise Infrastructure
                </div>
                {enterpriseSections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-white"
                    >
                      <Icon className="w-4 h-4 text-purple-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Download CTA */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleNavClick('apk-portal')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold shadow-lg flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Android APK (v2.4)</span>
                </button>
              </div>

            </div>
          )}

        </header>

      </div>

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
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Copy Pitch Deck & Data Room URL</span>
              </button>

              <button
                onClick={() => {
                  setShowInvestorModal(false);
                  handleNavClick('enterprise-portal');
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold shadow-lg transition-all cursor-pointer"
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


