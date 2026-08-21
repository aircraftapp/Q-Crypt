import React, { useState } from 'react';
import { Shield, Download, Key, Smartphone, ExternalLink, Cpu, Check, Lock, Sparkles, Building2, FileText, Bone, ShieldCheck, Zap, AlertTriangle, Layers, Radio, Activity, Scale, Clock, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { APP_REFERENCE } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { useGoldenRetriever } from '../context/GoldenRetrieverContext';
import { ExecutiveOverviewModal } from './ExecutiveOverviewModal';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenWhitepaper?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenWhitepaper }) => {
  const { t, language } = useLanguage();
  const { isGoldenMode } = useGoldenRetriever();
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isExecutiveExpanded, setIsExecutiveExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'all' | 'ceo' | 'ciso' | 'legal' | 'cio'>('all');

  const isFr = language === 'fr';

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
            <span>{t('hero.topBadge')}</span>
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

          {/* EXPANDED & ELABORATED EXECUTIVE OVERVIEW CALLOUT */}
          <div className={`p-5 rounded-3xl text-left border shadow-2xl transition-all duration-300 max-w-4xl mx-auto ${
            isGoldenMode 
              ? 'bg-amber-950/50 border-amber-500/40 text-amber-200' 
              : 'bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 border-cyan-500/40 text-slate-200 shadow-cyan-950/40'
          }`}>
            <div className="space-y-4">
              
              {/* Header Bar */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400 shadow-md">
                    {isGoldenMode ? <Bone className="w-5 h-5 text-amber-400 animate-bounce" /> : <Building2 className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block">
                      {isGoldenMode ? "WHAT THIS MEANS IN PUPPY TALK 🐕" : "C-SUITE & BOARD STRATEGIC BRIEFING"}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                      {isGoldenMode ? "How We Keep Your Secret Bones Safe!" : t('hero.plainEnglishTitle')}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsExecutiveModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Rapport Exécutif Complet (PDF)' : 'Full Executive Briefing (PDF)'}</span>
                  </button>
                  <button
                    onClick={() => setIsExecutiveExpanded(!isExecutiveExpanded)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Toggle details"
                  >
                    {isExecutiveExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Core Plain English Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {isGoldenMode
                  ? "If a bad kitty tries to steal your phone messages 10 years in the future, our Golden Retriever PQC shield growls and bites their quantum computer! Your secret bone is 100% safe!"
                  : t('hero.plainEnglishBody')}
              </p>

              {/* High-Level Executive Value Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">{isFr ? 'Horizon de Sécurité' : 'Immunity Horizon'}</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">50+ {isFr ? 'Ans' : 'Years'}</span>
                  <span className="text-[9px] font-mono text-slate-500 block">{isFr ? 'Immunité Shor' : 'Shor Proof'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">{isFr ? 'Surcoût Calcul' : 'Overhead'}</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">&lt; 3.8 ms</span>
                  <span className="text-[9px] font-mono text-slate-500 block">{isFr ? 'Zéro friction' : 'Instant UX'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">{isFr ? 'Isolation Matérielle' : 'Hardware Enclave'}</span>
                  <span className="text-sm font-bold text-amber-300 font-mono">FIPS 140-3</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Titan M2 & Knox</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">{isFr ? 'Directives UE/US' : 'Compliance'}</span>
                  <span className="text-sm font-bold text-purple-300 font-mono">100% {isFr ? 'Conforme' : 'Ready'}</span>
                  <span className="text-[9px] font-mono text-slate-500 block">NIS2 • DORA • NSM-10</span>
                </div>
              </div>

              {/* Expandable Strategic Pillars & Persona Breakdown */}
              {isExecutiveExpanded && (
                <div className="space-y-4 pt-3 border-t border-slate-800/80 animate-in fade-in duration-200">
                  
                  {/* Persona Tabs */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                      {isFr ? 'Analyse Détaillée par Rôle Exécutif :' : 'Executive Persona Impact:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                      {[
                        { id: 'all', label: isFr ? 'Vue Générale' : 'All Roles' },
                        { id: 'ceo', label: isFr ? 'CEO & Conseil' : 'CEO / Board' },
                        { id: 'ciso', label: isFr ? 'CISO / Sécurité' : 'CISO' },
                        { id: 'legal', label: isFr ? 'Juridique' : 'General Counsel' },
                        { id: 'cio', label: isFr ? 'CIO / IT' : 'CIO' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedRole(r.id as any)}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            selectedRole === r.id
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Persona Narrative */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs leading-relaxed space-y-2">
                    {(selectedRole === 'all' || selectedRole === 'ceo') && (
                      <div className="space-y-1">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-400" />
                          {isFr ? 'Direction Générale (CEO) & Conseil d\'Administration :' : 'Board of Directors & CEO Defense:'}
                        </span>
                        <p className="text-slate-300 font-sans">
                          {isFr
                            ? 'Protège les délibérations de fusions-acquisitions, les secrets de fabrication et les stratégies de gouvernance contre le piratage rétroactif. Élimine le risque de dépréciation boursière liée à des fuites différées.'
                            : 'Guarantees that high-stakes M&A negotiations, board votes, and corporate intellectual property captured on public networks cannot be decrypted 5-10 years from now. Defends brand equity and shareholder valuation.'}
                        </p>
                      </div>
                    )}

                    {(selectedRole === 'all' || selectedRole === 'ciso') && (
                      <div className="space-y-1 pt-2 border-t border-slate-900">
                        <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          {isFr ? 'Direction de la Sécurité (CISO) :' : 'CISO & Cryptographic Operations:'}
                        </span>
                        <p className="text-slate-300 font-sans">
                          {isFr
                            ? 'Intègre la cryptographie sur réseaux euclidiens NIST FIPS 203 (ML-KEM-1024) et FIPS 204 (ML-DSA-87) avec cliquet double PQXDH et résistance aux attaques par canaux auxiliaires en temps constant.'
                            : 'Deploys Module-Lattice Key Encapsulation (ML-KEM-1024) and Digital Signatures (ML-DSA-87) with ephemeral PQXDH ratchets. Delivers out-of-order forward secrecy and post-compromise self-healing keys.'}
                        </p>
                      </div>
                    )}

                    {(selectedRole === 'all' || selectedRole === 'legal') && (
                      <div className="space-y-1 pt-2 border-t border-slate-900">
                        <span className="font-bold text-purple-300 flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5 text-purple-400" />
                          {isFr ? 'Direction Juridique & Conformité (CLO) :' : 'General Counsel & Regulatory Compliance:'}
                        </span>
                        <p className="text-slate-300 font-sans">
                          {isFr
                            ? 'Garantit la conformité proactive aux directives européennes NIS2 / DORA et au Mémorandum Maison Blanche NSM-10, protégeant l\'organisation contre les sanctions pour défaut de diligence raisonnable (RGPD Art. 32).'
                            : 'Ensures compliance with US White House NSM-10 and EU NIS2/DORA mandates for state-of-the-art cryptographic resilience. Avoids massive regulatory fines under GDPR Article 32 by adopting recognized standards.'}
                        </p>
                      </div>
                    )}

                    {(selectedRole === 'all' || selectedRole === 'cio') && (
                      <div className="space-y-1 pt-2 border-t border-slate-900">
                        <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                          {isFr ? 'Direction des Systèmes d\'Information (CIO) :' : 'CIO & Mobile Fleet Rollout:'}
                        </span>
                        <p className="text-slate-300 font-sans">
                          {isFr
                            ? 'Déploiement MDM instantané sans friction pour les utilisateurs. Les clés racines sont générées et isolées dans les puces sécurisées Titan M2 / Samsung Knox sans impacter l\'autonomie de la batterie.'
                            : 'Zero infrastructure re-architecture. Keys are safely isolated inside Google Titan M2 and Samsung Knox StrongBox physical silicon enclaves with imperceptible battery draw and sub-4ms compute latency.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mosca's Equation One-Liner Box */}
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300 font-mono">
                    <div className="flex items-center space-x-2 truncate">
                      <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="truncate">
                        <strong>{isFr ? 'Théorème de Mosca :' : 'Mosca’s Theorem:'}</strong> {isFr ? 'Si Temps de Migration (X) + Durée de Secret (Y) > Arrivée Quantique (Z) = Vulnérabilité Immédiate.' : 'If Migration Time (X) + Secret Shelf-Life (Y) > Quantum Threat (Z), you are already breached.'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsExecutiveModalOpen(true)}
                      className="px-2.5 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 text-[10px] font-bold shrink-0 cursor-pointer transition-colors"
                    >
                      {isFr ? 'Calculer Risque' : 'Simulate Risk'}
                    </button>
                  </div>

                </div>
              )}

              {/* Action Buttons inside Callout */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => setIsExecutiveExpanded(!isExecutiveExpanded)}
                  className="text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>{isExecutiveExpanded ? (isFr ? 'Masquer Détails Stratégiques' : 'Collapse Strategic Briefing') : (isFr ? 'Déplier l\'Analyse Stratégique Complète ▼' : 'Expand Full Strategic Executive Overview ▼')}</span>
                </button>

                <button
                  onClick={() => setIsExecutiveModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>{isFr ? 'Matrice & Simulateur Mosca →' : 'Launch Executive Matrix & Mosca Simulator →'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('apk-portal')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('hero.btnApk')}</span>
            </button>

            <button
              onClick={() => setIsExecutiveModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 border border-cyan-400/80 text-cyan-300 hover:bg-cyan-950/80 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/10 cursor-pointer hover:scale-[1.02]"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>{isFr ? 'Synthèse Exécutive & Audit' : 'Executive Overview & Audit'}</span>
            </button>

            <button
              onClick={() => onNavigate('enterprise-portal')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>{t('hero.btnEnterprise')}</span>
            </button>

            {onOpenWhitepaper && (
              <button
                onClick={onOpenWhitepaper}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-cyan-950/40 text-cyan-300 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{t('nav.whitepaper')}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('key-demo')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 font-medium text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
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
              {t('hero.whyTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              {t('hero.whySubtitle')}
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
                    {t('hero.pillar1Tag')}
                  </span>
                  <h4 className="text-base font-bold text-white font-sans">
                    {t('hero.pillar1Title')}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t('hero.pillar1Body')}
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-rose-300 flex items-center justify-between">
                <span>{t('hero.pillar1FooterLabel')}</span>
                <span className="font-bold text-rose-400">{t('hero.pillar1FooterValue')}</span>
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
                    {t('hero.pillar2Tag')}
                  </span>
                  <h4 className="text-base font-bold text-white font-sans">
                    {t('hero.pillar2Title')}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t('hero.pillar2Body')}
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                <span>{t('hero.pillar2FooterLabel')}</span>
                <span className="font-bold text-emerald-400">{t('hero.pillar2FooterValue')}</span>
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
                    {t('hero.pillar3Tag')}
                  </span>
                  <h4 className="text-base font-bold text-white font-sans">
                    {t('hero.pillar3Title')}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t('hero.pillar3Body')}
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
                <span>{t('hero.pillar3FooterLabel')}</span>
                <span className="font-bold text-emerald-400">{t('hero.pillar3FooterValue')}</span>
              </div>
            </div>

          </div>

          {/* Technical Specs Comparison Summary Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">{t('hero.spec1Label')}</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">{t('hero.spec1Value')}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">{t('hero.spec2Label')}</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{t('hero.spec2Value')}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">{t('hero.spec3Label')}</span>
              <span className="text-sm font-bold text-amber-300 font-mono">{t('hero.spec3Value')}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">{t('hero.spec4Label')}</span>
              <span className="text-sm font-bold text-purple-300 font-mono">{t('hero.spec4Value')}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Executive Overview Modal Component */}
      <ExecutiveOverviewModal
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSection={onNavigate}
      />

    </section>
  );
};


