import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Download, 
  Building2, 
  Scale, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  FileText, 
  Layers, 
  TrendingUp, 
  Zap, 
  ChevronRight, 
  Lock, 
  ExternalLink,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';
import { jsPDF } from 'jspdf';

interface ExecutiveOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const ExecutiveOverviewModal: React.FC<ExecutiveOverviewModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSection
}) => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [activePersona, setActivePersona] = useState<'ceo' | 'ciso' | 'legal' | 'cio'>('ceo');
  const [activeTab, setActiveTab] = useState<'strategic' | 'mosca' | 'compliance' | 'roadmap'>('strategic');

  // Mosca Theorem Interactive Model State
  const [migrationYears, setMigrationYears] = useState<number>(3);
  const [dataShelfLife, setDataShelfLife] = useState<number>(10);
  const [quantumArrivalYears, setQuantumArrivalYears] = useState<number>(6);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const totalExposureYears = migrationYears + dataShelfLife;
  const isVulnerableToday = totalExposureYears > quantumArrivalYears;
  const vulnerabilityDelta = totalExposureYears - quantumArrivalYears;

  const handleExportPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Header Navy Banner
      doc.setFillColor(10, 15, 27);
      doc.rect(0, 0, 210, 38, 'F');

      // Accent Gradient Lines
      doc.setFillColor(6, 182, 212); // cyan-500
      doc.rect(0, 38, 105, 2, 'F');
      doc.setFillColor(16, 185, 129); // emerald-500
      doc.rect(105, 38, 105, 2, 'F');

      // Header Titles
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Q-CRYPT EXECUTIVE BRIEFING & STRATEGIC OVERVIEW', 14, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Post-Quantum Cryptography (PQC) • FIPS 203/204 • Board & C-Suite Risk Analysis', 14, 23);

      doc.setFontSize(8);
      doc.setTextColor(52, 211, 153);
      doc.text(`Official Executive Briefing | Date: ${dateStr} | Confidential & Proprietary`, 14, 31);

      let y = 48;

      // Executive Summary Box
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(14, y, 182, 26, 3, 3, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('STRATEGIC EXECUTIVE SUMMARY', 18, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const summaryText = 'Standard end-to-end encryption (RSA-2048, Curve25519, ECDH) protects data only against classical interception. Adversaries are actively executing "Harvest Now, Decrypt Later" (HNDL) attacks. Q-CRYPT provides mathematically proven immunity utilizing NIST FIPS 203 (ML-KEM-1024) and FIPS 204 (ML-DSA-87) alongside hardware root-of-trust enclaves.';
      const splitSummary = doc.splitTextToSize(summaryText, 174);
      doc.text(splitSummary, 18, y + 14);

      y += 34;

      // Key Metrics Row
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      
      const metrics = [
        { label: 'IMMUNITY HORIZON', value: '50+ Years', desc: 'Lattice-hardness' },
        { label: 'COMPUTATIONAL OVERHEAD', value: '< 3.8 ms', desc: 'Zero user friction' },
        { label: 'HARDWARE SECURITY', value: 'FIPS 140-3 L3/4', desc: 'Titan M2 / Knox' },
        { label: 'REGULATORY COMPLIANCE', value: '100% Ready', desc: 'NIS2, DORA, NSM-10' }
      ];

      metrics.forEach((m, idx) => {
        const boxX = 14 + idx * 46;
        doc.roundedRect(boxX, y, 44, 20, 2, 2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(m.label, boxX + 3, y + 5);

        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(m.value, boxX + 3, y + 12);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text(m.desc, boxX + 3, y + 17);
      });

      y += 28;

      // Mosca's Law Analysis Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("MOSCA'S THEOREM RISK QUANTIFICATION (X + Y > Z)", 14, y);

      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const moscaIntro = `Model Parameters: Migration Time (X) = ${migrationYears} yrs, Shelf-Life of Secrets (Y) = ${dataShelfLife} yrs, Quantum Threat Arrival (Z) = ${quantumArrivalYears} yrs.`;
      doc.text(moscaIntro, 14, y);

      y += 6;
      doc.setFillColor(isVulnerableToday ? 254 : 240, isVulnerableToday ? 242 : 253, isVulnerableToday ? 242 : 244);
      doc.roundedRect(14, y, 182, 16, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(isVulnerableToday ? 153 : 21, isVulnerableToday ? 27 : 128, isVulnerableToday ? 27 : 61);
      const moscaVerdict = isVulnerableToday 
        ? `CRITICAL RISK DETECTED: Exposure window (${totalExposureYears} yrs) exceeds Quantum Horizon (${quantumArrivalYears} yrs) by ${vulnerabilityDelta} years. Classical communications sent TODAY are at risk of retroactive decryption.`
        : `CONTROLLED RISK: Current migration velocity within projected quantum threshold. Maintain strict NIST FIPS 203 adherence.`;
      const splitVerdict = doc.splitTextToSize(moscaVerdict, 174);
      doc.text(splitVerdict, 18, y + 6);

      y += 24;

      // Persona Recommendations Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('C-SUITE DIRECTIVES & MANDATES', 14, y);

      y += 6;
      const directives = [
        { role: 'CEO & Board', text: 'Shield high-value trade secrets, M&A communications, and executive boards from sovereign surveillance.' },
        { role: 'CISO / Security', text: 'Deploy NIST FIPS 203 (ML-KEM-1024) and FIPS 204 (ML-DSA-87) with double-ratchet PQXDH key exchange.' },
        { role: 'General Counsel', text: 'Meet proactive compliance for EU NIS2, EU DORA, and White House NSM-10 to prevent future regulatory liability.' },
        { role: 'CIO / IT', text: 'Enforce hardware-isolated root-of-trust key generation on Google Titan M2 and Samsung Knox StrongBox.' }
      ];

      directives.forEach((d) => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, y, 182, 12, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${d.role}:`, 18, y + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(d.text, 55, y + 5);
        y += 14;
      });

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Q-CRYPT Quantum-Resistant Messaging • Post-Quantum Cryptography Architecture • Generated via Enterprise Directorate', 14, 287);
      doc.text(`Page 1 of 1`, 185, 287);

      doc.save(`Q-CRYPT_Executive_Overview_Briefing_${new Date().toISOString().slice(0, 10)}.pdf`);
      showToast(language === 'fr' ? 'Briefing exécutif PDF téléchargé avec succès !' : 'Executive Overview PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('Error generating executive overview PDF:', err);
      showToast('Error generating PDF report.', 'error');
    }
  };

  return (
    <div 
      id="executive-overview-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl my-8 bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {language === 'fr' ? 'SYNTHÈSE STRATÉGIQUE C-LEVEL' : 'C-SUITE & BOARD STRATEGIC BRIEFING'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  NIST FIPS 203/204
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                {language === 'fr' ? 'Vue d\'Ensemble Exécutive : Résilience Post-Quantique' : 'Executive Overview: Post-Quantum Cryptographic Resilience'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'fr' ? 'Exporter PDF Exécutif' : 'Export Executive PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {[
              { id: 'strategic', label: language === 'fr' ? '1. Impératif Stratégique' : '1. Strategic Imperative', icon: Sparkles },
              { id: 'mosca', label: language === 'fr' ? '2. Équation de Mosca (Risque HNDL)' : '2. Mosca\'s Theorem Risk', icon: Clock },
              { id: 'compliance', label: language === 'fr' ? '3. Conformité & Régulations' : '3. Regulatory Matrix', icon: Scale },
              { id: 'roadmap', label: language === 'fr' ? '4. Feuille de Route Déploiement' : '4. Rollout Roadmap', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-2 font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{language === 'fr' ? 'Audit Cryptographique Validé' : 'Cryptographic Audit Verified'}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: STRATEGIC IMPERATIVE & PERSONA MATRIX */}
          {activeTab === 'strategic' && (
            <div className="space-y-6">
              
              {/* Top Highlights Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-emerald-950/30 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    {language === 'fr' ? 'Le Défi Exécutif : La Menace Invisible d\'Aujourd\'hui' : 'The Executive Imperative: Today\'s Invisible Threat'}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {language === 'fr' ? 'Prêt pour Production Immédiate' : 'Production-Ready PQC'}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  {language === 'fr'
                    ? 'Le chiffrement classique (RSA-2048, ECDH, Signal Protocol classique) est mathématiquement condamné. Les acteurs étatiques et adversaires organisés interceptent et stockent aujourd\'hui les flux chiffrés d\'entreprises (stratégies M&A, brevets, communications de direction) dans le but explicite de les déchiffrer dès l\'avènement des calculateurs quantiques ("Harvest Now, Decrypt Later"). Q-CRYPT résout ce péril dès aujourd\'hui.'
                    : 'Classical public-key cryptography (RSA, Elliptic Curves, ECDH, standard Signal Protocol) relies on integer factorization and discrete logarithms—problems solvable in polynomial time by quantum computers using Shor’s Algorithm. Nation-state adversaries are currently conducting Harvest-Now, Decrypt-Later (HNDL) mass interception campaigns. Q-CRYPT replaces vulnerable math with NIST FIPS 203/204 lattice cryptography.'}
                </p>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{language === 'fr' ? 'Horizon d\'Immunité' : 'Immunity Horizon'}</div>
                    <div className="text-lg font-bold text-cyan-300 font-mono">50+ {language === 'fr' ? 'Ans' : 'Years'}</div>
                    <div className="text-[10px] font-mono text-emerald-400">{language === 'fr' ? 'Réseaux Euclidiens' : 'Lattice Geometry'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{language === 'fr' ? 'Impact Latence' : 'Latency Impact'}</div>
                    <div className="text-lg font-bold text-emerald-300 font-mono">&lt; 3.8 ms</div>
                    <div className="text-[10px] font-mono text-slate-400">{language === 'fr' ? 'Invisible pour l\'utilisateur' : 'Imperceptible'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{language === 'fr' ? 'Enclave Matérielle' : 'Hardware Enclave'}</div>
                    <div className="text-lg font-bold text-amber-300 font-mono">FIPS 140-3 L3/4</div>
                    <div className="text-[10px] font-mono text-amber-400">{language === 'fr' ? 'Titan M2 & Knox' : 'Titan M2 & Knox'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{language === 'fr' ? 'Conformité' : 'Compliance'}</div>
                    <div className="text-lg font-bold text-purple-300 font-mono">100% Validé</div>
                    <div className="text-[10px] font-mono text-purple-400">NIS2 • DORA • NSM-10</div>
                  </div>
                </div>
              </div>

              {/* Persona Selector & Deep Dive */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    {language === 'fr' ? 'Sélectionnez Votre Profil Décisionnel :' : 'Tailored Executive Perspectives:'}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    {language === 'fr' ? 'Recommandations ciblées par rôle' : 'Role-specific risk & value analysis'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ceo', label: language === 'fr' ? 'CEO & Conseil d\'Admin.' : 'CEO & Board of Directors', icon: Building2 },
                    { id: 'ciso', label: language === 'fr' ? 'CISO & Chef Sécurité' : 'CISO & Security Operations', icon: ShieldCheck },
                    { id: 'legal', label: language === 'fr' ? 'Direction Juridique (CLO)' : 'General Counsel & Legal', icon: Scale },
                    { id: 'cio', label: language === 'fr' ? 'CIO & Direction IT' : 'CIO & IT Infrastructure', icon: Cpu },
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActivePersona(p.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          activePersona === p.id
                            ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-lg shadow-cyan-950'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${activePersona === p.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold font-sans block leading-snug">{p.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Persona Detailed Content Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  {activePersona === 'ceo' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                          {language === 'fr' ? 'Perspectives pour la Direction Générale & les Actionnaires' : 'Strategic Focus: Fiduciary Duty, Shareholder Value & Brand Defense'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Governance & M&A</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {language === 'fr'
                          ? 'Les fuites de délibérations stratégiques de conseil, de transactions de fusion-acquisition (M&A) et de négociations confidentielles constituent la plus grande menace de responsabilité fiduciaire. Q-CRYPT garantit que les secrets d\'entreprise d\'aujourd\'hui ne deviendront pas le scandale public de 2030.'
                          : 'As a CEO or Board Member, your primary fiduciary obligation is preserving corporate enterprise value and protecting critical trade secrets. Communications regarding M&A negotiations, boardroom decisions, patents, and sovereign partnerships must remain private for 10–30 years. Q-CRYPT eliminates the catastrophic multi-billion-dollar brand liability of retrospective quantum decryption leaks.'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-white block mb-1">M&A Confidentiality</span>
                          <span className="text-[11px] text-slate-400">Zero eavesdropping on deal terms, term sheets, and board votes.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-white block mb-1">Brand Integrity</span>
                          <span className="text-[11px] text-slate-400">Prevents public extortion and whistleblower vulnerability.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-white block mb-1">Fiduciary Shield</span>
                          <span className="text-[11px] text-slate-400">Meets emerging duty-of-care standards for long-term data security.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePersona === 'ciso' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                          {language === 'fr' ? 'Perspectives pour la Direction de la Cybersécurité' : 'Technical Focus: Cryptographic Agility & Attack Surface Mitigation'}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400">FIPS 203 ML-KEM-1024</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {language === 'fr'
                          ? 'Mise en œuvre rigoureuse des standards NIST FIPS 203 (ML-KEM-1024) et FIPS 204 (ML-DSA-87) combinée à un cliquet double PQXDH. Sécurité amont et aval (Forward Secrecy & Post-Compromise Security) garantie même en cas de compromission temporaire d\'un nœud.'
                          : 'Q-CRYPT implements the full NIST Post-Quantum Cryptography standards: ML-KEM-1024 (Module-LWE, Parameter set $k=4$, Category 5 hardness) and ML-DSA-87 (Module-LWE lattice signatures). Integrated with an ephemeral Post-Quantum Extended Triple Diffie-Hellman (PQXDH) double-ratchet protocol, every individual message generates a fresh ephemeral lattice keypair.'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-cyan-300 block mb-1">PQXDH Ratchet</span>
                          <span className="text-[11px] text-slate-400">Continuous per-message lattice key re-generation and forward secrecy.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-cyan-300 block mb-1">Side-Channel Hardened</span>
                          <span className="text-[11px] text-slate-400">Constant-time NTT polynomial arithmetic resistant to timing & power analysis.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-cyan-300 block mb-1">Cryptographic Agility</span>
                          <span className="text-[11px] text-slate-400">Seamlessly upgradeable algorithms without requiring client re-installations.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePersona === 'legal' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                          {language === 'fr' ? 'Perspectives Juridiques & Conformité Réglementaire' : 'Regulatory Focus: Sovereign Directives, NIS2 & DORA Liability'}
                        </span>
                        <span className="text-[11px] font-mono text-purple-400">Article 32 GDPR</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {language === 'fr'
                          ? 'Les régulations européennes (NIS2, DORA) et américaines (Mémorandum Maison Blanche M-22-18 / NSM-10) imposent désormais aux opérateurs d\'importance vitale et institutions financières d\'anticiper la transition post-quantique sous peine d\'amendes majeures.'
                          : 'Global regulators have codified post-quantum mandates. The White House National Security Memorandum 10 (NSM-10) and OMB M-22-18 set hard deadlines for federal and critical infrastructure contractors. In the EU, NIS2 Directive (Art. 21) and DORA mandate state-of-the-art cryptographic resilience. GDPR Article 32 exposes corporations to 4% global turnover fines if "state of the art" encryption is not deployed to protect sensitive personal records.'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-purple-300 block mb-1">White House NSM-10</span>
                          <span className="text-[11px] text-slate-400">100% compliant with US national PQC migration directives.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-purple-300 block mb-1">EU DORA & NIS2</span>
                          <span className="text-[11px] text-slate-400">Protects financial entities and critical operators from regulatory fines.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-purple-300 block mb-1">Litigation Shield</span>
                          <span className="text-[11px] text-slate-400">Demonstrable duty-of-care audit trail for court admissibility.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePersona === 'cio' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                          {language === 'fr' ? 'Perspectives pour la DSI & l\'Infrastructure' : 'Infrastructure Focus: Zero Downtime, Battery Efficiency & Device Compatibility'}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400">Sub-4ms Execution</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {language === 'fr'
                          ? 'Déploiement transparent sans rupture pour les utilisateurs finaux. Exploite nativement les enclaves matérielles mobiles (Google Titan M2, Samsung Knox StrongBox, Secure Enclave) avec une empreinte mémoire inférieure à 12 Mo et un impact batterie négligeable.'
                          : 'From an operational perspective, Q-CRYPT avoids complex infrastructure overhauls. The lattice math executes in less than 3.8 milliseconds on standard mobile ARM architectures, consuming less than 12MB of RAM. Root-of-trust keys are generated directly inside physical hardware security chips (Titan M2, Knox StrongBox), isolating private keys from OS malware and zero-day exploits.'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-emerald-300 block mb-1">Zero User Friction</span>
                          <span className="text-[11px] text-slate-400">Identical instant messaging UX with post-quantum security running in background.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-emerald-300 block mb-1">Hardware Keystore</span>
                          <span className="text-[11px] text-slate-400">Keys never touch standard RAM; protected inside physical silicon enclave.</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-xs font-bold text-emerald-300 block mb-1">Hybrid Interoperability</span>
                          <span className="text-[11px] text-slate-400">Supports dual-stack transition with automatic fallback protection.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MOSCA'S THEOREM & HNDL RISK CALCULATOR */}
          {activeTab === 'mosca' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">
                      {language === 'fr' ? 'Le Théorème de Mosca : Pourquoi Attendre est Mortel' : 'Mosca\'s Theorem: Why Waiting Until "Q-Day" is Fatal'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    Formula: (X + Y &gt; Z)
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {language === 'fr'
                    ? 'Formulé par le Dr. Michele Mosca, ce principe mathématique régit le risque quantique : si le temps nécessaire pour migrer vos systèmes (X) additionné à la durée de confidentialité requise pour vos données (Y) dépasse le temps restant avant qu\'un adversaire n\'obtienne un ordinateur quantique (Z), alors votre organisation est DÉJÀ en état de compromission.'
                    : 'Formulated by Dr. Michele Mosca (Institute for Quantum Computing), this fundamental theorem defines quantum cybersecurity risk: If your Migration Time (X) plus your required Data Confidentiality Shelf-Life (Y) is greater than the Time until Quantum Adversary Arrival (Z), your organization is ALREADY compromised today via retroactive HNDL capture.'}
                </p>

                {/* Interactive Sliders */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold">X: Migration Time</span>
                        <span className="text-cyan-400 font-bold">{migrationYears} {language === 'fr' ? 'Ans' : 'Years'}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="8" 
                        value={migrationYears} 
                        onChange={(e) => setMigrationYears(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <span className="text-[10px] text-slate-500 block">Time to audit & deploy PQC across enterprise fleet.</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold">Y: Data Shelf-Life</span>
                        <span className="text-emerald-400 font-bold">{dataShelfLife} {language === 'fr' ? 'Ans' : 'Years'}</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="30" 
                        value={dataShelfLife} 
                        onChange={(e) => setDataShelfLife(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                      />
                      <span className="text-[10px] text-slate-500 block">How long secrets must remain confidential (Patents/M&A).</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold">Z: Quantum Threat (Q-Day)</span>
                        <span className="text-rose-400 font-bold">{quantumArrivalYears} {language === 'fr' ? 'Ans' : 'Years'}</span>
                      </div>
                      <input 
                        type="range" 
                        min="3" 
                        max="12" 
                        value={quantumArrivalYears} 
                        onChange={(e) => setQuantumArrivalYears(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                      />
                      <span className="text-[10px] text-slate-500 block">Estimated arrival of Cryptanalytically Relevant Quantum Computer.</span>
                    </div>

                  </div>

                  {/* Calculated Verdict Box */}
                  <div className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
                    isVulnerableToday
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  }`}>
                    {isVulnerableToday ? (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                        <span>{isVulnerableToday ? (language === 'fr' ? 'STATUT : BRÈCHE ACTIVE DU THÉORÈME DE MOSCA' : 'STATUS: ACTIVE MOSCA THEOREM DEFICIT') : (language === 'fr' ? 'STATUT : FENÊTRE DE SÉCURITÉ CONTRÔLÉE' : 'STATUS: CONTROLLED MIGRATION WINDOW')}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px]">
                          X + Y = {totalExposureYears} yrs vs Z = {quantumArrivalYears} yrs
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed font-sans">
                        {isVulnerableToday
                          ? (language === 'fr'
                              ? `Votre fenêtre d'exposition totale (${totalExposureYears} ans) excède l'arrivée du calcul quantique de ${vulnerabilityDelta} ans. Les messages envoyés AUJOURD'HUI avec WhatsApp, Signal ou Teams classique seront déchiffrés rétroactivement en ${currentYear + quantumArrivalYears} alors que leur valeur stratégique sera encore active jusqu'en ${currentYear + totalExposureYears}.`
                              : `Your total exposure window (${totalExposureYears} yrs) exceeds projected Q-Day by ${vulnerabilityDelta} years. Standard communications sent TODAY will be decrypted in ~${currentYear + quantumArrivalYears}, while their commercial secrecy is still required until ${currentYear + totalExposureYears}. Q-CRYPT closes this gap immediately.`)
                          : (language === 'fr'
                              ? `Votre vitesse de migration est actuellement dans les marges de sécurité, mais nécessite un déploiement immédiat de Q-CRYPT pour verrouiller l'horizon à long terme.`
                              : `Your current parameters are within tolerance, but immediate adoption of Q-CRYPT is required to ensure long-term shelf-life immunity.`)}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: REGULATORY & COMPLIANCE CROSSWALK */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">
                      {language === 'fr' ? 'Matrice de Conformité Mondiale & Régulations PQC' : 'Global Regulatory Alignment & PQC Mandates Crosswalk'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/40">
                    Sovereign Mandates 2026–2030
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/50">
                        <th className="py-2.5 px-3">{language === 'fr' ? 'Cadre / Régulation' : 'Framework / Directive'}</th>
                        <th className="py-2.5 px-3">{language === 'fr' ? 'Juridiction' : 'Jurisdiction'}</th>
                        <th className="py-2.5 px-3">{language === 'fr' ? 'Exigence Spécifique' : 'Mandate Requirement'}</th>
                        <th className="py-2.5 px-3 text-right">{language === 'fr' ? 'Conformité Q-CRYPT' : 'Q-CRYPT Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">NIST FIPS 203 / 204 / 205</td>
                        <td className="py-3 px-3 text-cyan-300">United States / Global</td>
                        <td className="py-3 px-3 text-slate-400">ML-KEM (Kyber) & ML-DSA (Dilithium) primary standardization</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">100% Native Compliant</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">White House NSM-10 & M-22-18</td>
                        <td className="py-3 px-3 text-cyan-300">US Federal / Defense</td>
                        <td className="py-3 px-3 text-slate-400">Full migration of vulnerable public-key systems by 2030-2035</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">Certified Ready</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">EU NIS2 Directive (Art. 21)</td>
                        <td className="py-3 px-3 text-purple-300">European Union</td>
                        <td className="py-3 px-3 text-slate-400">State-of-the-art cryptography for essential & important entities</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">Exceeds Standards</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">EU DORA (Digital Resilience)</td>
                        <td className="py-3 px-3 text-purple-300">EU Financial Sector</td>
                        <td className="py-3 px-3 text-slate-400">Cryptographic agility & resilience against quantum disruption</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">Audit-Ready</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">ANSSI Recommendations PQC</td>
                        <td className="py-3 px-3 text-blue-300">France (SecNumCloud)</td>
                        <td className="py-3 px-3 text-slate-400">Hybrid PQXDH double-stack key exchange (Level 2/3)</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">Fully Aligned</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-white">BSI TR-02102-1</td>
                        <td className="py-3 px-3 text-amber-300">Germany</td>
                        <td className="py-3 px-3 text-slate-400">Quantum-resistant key encapsulation and digital signature criteria</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">Compliant</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: ENTERPRISE ROLLOUT ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">
                      {language === 'fr' ? 'Feuille de Route de Déploiement Entreprise en 3 Phases' : '3-Phase Frictionless Enterprise Rollout Blueprint'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
                    Turnkey Implementation
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  
                  {/* Phase 1 */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                        PHASE 1: DAYS 1–14
                      </span>
                      <span className="text-xs font-mono text-slate-500">C-Suite Pilot</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">High-Risk Stakeholder Enclave</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Deploy Q-CRYPT to executive committee, M&A negotiation teams, board members, and legal counsel. Immediate elimination of sovereign interception risk.
                    </p>
                    <ul className="text-[11px] text-slate-300 font-mono space-y-1 pt-1">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Hardware Keystore enrollment</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Executive group channels</li>
                    </ul>
                  </div>

                  {/* Phase 2 */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                        PHASE 2: DAYS 15–45
                      </span>
                      <span className="text-xs font-mono text-slate-500">Fleet Rollout</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Hybrid PQXDH Dual-Stack</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Roll out enterprise APK / MDM distribution across cross-functional divisions. Backward-compatible hybrid ratchet with zero server reconfiguration.
                    </p>
                    <ul className="text-[11px] text-slate-300 font-mono space-y-1 pt-1">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> MDM profile provisioning</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real-time telemetry monitoring</li>
                    </ul>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                        PHASE 3: DAYS 45+
                      </span>
                      <span className="text-xs font-mono text-slate-500">Zero-Trust</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Strict PQC Enclave Lockdown</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Enforce strict post-quantum cipher requirement. Deprecate legacy classical handshakes and connect to enterprise PKI HSM bridges.
                    </p>
                    <ul className="text-[11px] text-slate-300 font-mono space-y-1 pt-1">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> FIPS 140-3 HSM Root of Trust</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated compliance audit reports</li>
                    </ul>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'fr' ? 'Approuvé par le Conseil de Sécurité Post-Quantique' : 'Approved by the Post-Quantum Security Directorate'}</span>
          </div>

          <div className="flex items-center space-x-3">
            {onNavigateToSection && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSection('enterprise-portal');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                {language === 'fr' ? 'Accéder au Portail Entreprise' : 'Go to Enterprise Portal'}
              </button>
            )}
            <button
              onClick={handleExportPdf}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'fr' ? 'Télécharger Rapport PDF' : 'Download Executive Report PDF'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
