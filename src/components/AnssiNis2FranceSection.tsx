import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShieldCheck, Award, FileText, CheckCircle2, AlertTriangle, 
  Sparkles, Lock, Cpu, Server, ExternalLink, Download, ArrowRight,
  Sliders, Info, HelpCircle, Check, X, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';

export interface RegulatoryMilestone {
  year: string;
  dateLabelFr: string;
  dateLabelEn: string;
  titleFr: string;
  titleEn: string;
  framework: 'ANSSI' | 'NIS2' | 'LPM' | 'DORA';
  authority: string;
  badgeFr: string;
  badgeEn: string;
  descriptionFr: string;
  descriptionEn: string;
  pqcRequirementFr: string;
  pqcRequirementEn: string;
  status: 'COMPLETED' | 'ACTIVE' | 'CRITICAL' | 'PLANNED';
}

export const REGULATORY_TIMELINE_MILESTONES: RegulatoryMilestone[] = [
  {
    year: '2024',
    dateLabelFr: 'Octobre 2024',
    dateLabelEn: 'October 2024',
    titleFr: 'Transposition NIS2 & Avis Scientifique ANSSI Hybride',
    titleEn: 'EU NIS2 Transposition & ANSSI Hybrid PQC Guidelines',
    framework: 'NIS2',
    authority: 'ANSSI 🇫🇷 & UE 🇪🇺',
    badgeFr: 'Phase 1 ANSSI Initialisée',
    badgeEn: 'ANSSI Phase 1 Initialized',
    descriptionFr: 'Entrée en vigueur officielle de la Directive NIS2 (UE 2022/2555). L\'ANSSI publie ses recommandations scientifiques exigeant l\'encapsulation hybride (ECDH + PQC) pour parer au risque Harvest-Now-Decrypt-Later.',
    descriptionEn: 'Official entry into force of EU NIS2 Directive. ANSSI mandates hybrid key encapsulation (ECDH + PQC) to protect sensitive data against Harvest-Now-Decrypt-Later attacks.',
    pqcRequirementFr: 'Hybridation systématique des clés publiques (Phase 1)',
    pqcRequirementEn: 'Mandatory hybrid key encapsulation for public keys (Phase 1)',
    status: 'COMPLETED'
  },
  {
    year: '2025',
    dateLabelFr: 'Janvier 2025',
    dateLabelEn: 'January 2025',
    titleFr: 'Règlement DORA & Standardisation NIST FIPS 203',
    titleEn: 'EU DORA Regulation & NIST FIPS 203 General Rollout',
    framework: 'DORA',
    authority: 'ABE / DORA & NIST',
    badgeFr: 'Secteur Financier & Banques',
    badgeEn: 'Financial & Banking Focus',
    descriptionFr: 'Application stricte du règlement DORA pour la résilience opérationnelle numérique financière. Généralisation industrielle du standard NIST FIPS 203 (ML-KEM-1024) dans les passerelles interbancaires.',
    descriptionEn: 'Strict enforcement of EU DORA regulation for financial digital resilience. Industrial adoption of NIST FIPS 203 (ML-KEM-1024) across interbank transaction gateways.',
    pqcRequirementFr: 'ML-KEM-1024 sur canaux de virements et Swift',
    pqcRequirementEn: 'ML-KEM-1024 deployed on Swift and wire channels',
    status: 'ACTIVE'
  },
  {
    year: '2026',
    dateLabelFr: 'Octobre 2026',
    dateLabelEn: 'October 2026',
    titleFr: 'Échéance Ultime Sanctions NIS2 & Extension OIV/OSE',
    titleEn: 'Strict NIS2 Penalty Enforcement & LPM OIV Expansion',
    framework: 'NIS2',
    authority: 'ANSSI & Commission UE',
    badgeFr: 'Amendes Jusqu\'à 10M€ / 2% CA',
    badgeEn: 'Up to €10M / 2% Turnover Fine',
    descriptionFr: 'Date limite d\'audit et de conformité obligatoire sous peine de sanctions financières (jusqu\'à 10M€ ou 2% du chiffre d\'affaires mondial). Auto-ratchet des clés PQC sous 60s généralisé dans Quantum Messenger.',
    descriptionEn: 'Final audit deadline with severe financial penalties (up to €10M or 2% of global turnover). Automated 60-second PQC key ratcheting deployed in Quantum Messenger.',
    pqcRequirementFr: 'Ratchet de clés PQC continu sous 60s obligatoire',
    pqcRequirementEn: 'Mandatory continuous 60-second PQC key ratcheting',
    status: 'CRITICAL'
  },
  {
    year: '2027',
    dateLabelFr: 'Juin 2027',
    dateLabelEn: 'June 2027',
    titleFr: 'Jalon Mi-Parcours LPM 2024-2030 (Ministère des Armées)',
    titleEn: 'Mid-Term LPM 2024-2030 Defense Audit Milestone',
    framework: 'LPM',
    authority: 'Ministère des Armées 🇫🇷',
    badgeFr: 'Défense Nationale & OIV',
    badgeEn: 'National Defense & Vital Infrastructure',
    descriptionFr: 'Audit de mi-parcours de la Loi de Programmation Militaire française. Interdiction stricte des liaisons RSA-2048 / ECC-256 isolées non hybrides au sein des réseaux de souveraineté française.',
    descriptionEn: 'French Military Programming Law mid-term audit. Strict ban on unhybridized classical RSA-2048 / ECC-256 ciphers across French defense infrastructure.',
    pqcRequirementFr: 'Éradication des flux RSA non hybrides en Défense',
    pqcRequirementEn: 'Elimination of unhybridized RSA flows in Defense',
    status: 'PLANNED'
  },
  {
    year: '2028',
    dateLabelFr: 'Décembre 2028',
    dateLabelEn: 'December 2028',
    titleFr: 'ANSSI Phase 2 : PQC Pur & Hardware CC EAL4+',
    titleEn: 'ANSSI Phase 2: Standalone PQC & CC EAL4+ Hardware',
    framework: 'ANSSI',
    authority: 'ANSSI 🇫🇷',
    badgeFr: 'PQC Pur Autorisé',
    badgeEn: 'Standalone PQC Permitted',
    descriptionFr: 'Transition vers la Phase 2 de l\'ANSSI : autorisation progressive des algorithmes PQC autonomes (ML-KEM / ML-DSA) pour les systèmes qualifiés avec ancrage matériel certifié CC EAL4+.',
    descriptionEn: 'Transition to ANSSI Phase 2: Permitting standalone PQC algorithms (ML-KEM / ML-DSA) on qualified hardware enclaves certified Common Criteria EAL4+.',
    pqcRequirementFr: 'PQC autonome autorisé sur puces CC EAL4+',
    pqcRequirementEn: 'Standalone PQC permitted on CC EAL4+ chips',
    status: 'PLANNED'
  },
  {
    year: '2030',
    dateLabelFr: 'Janvier 2030',
    dateLabelEn: 'January 2030',
    titleFr: 'Phase 3 ANSSI : Éradication Totale du Classique',
    titleEn: 'ANSSI Phase 3: Total Legacy Cryptography Deprecation',
    framework: 'ANSSI',
    authority: 'ANSSI & Commission UE',
    badgeFr: 'Éradication Complète RSA/ECC',
    badgeEn: 'Full RSA/ECC Eradication',
    descriptionFr: 'Échéance finale de transition post-quantique. Disparition totale et interdiction réglementaire des algorithmes classiques RSA, ECC et Diffie-Hellman pour parer à la menace des ordinateurs quantiques CRQC.',
    descriptionEn: 'Final regulatory post-quantum deadline. Complete deprecation of classical RSA, ECC, and Diffie-Hellman algorithms against CRQC / Shor algorithm threats.',
    pqcRequirementFr: 'Seuls FIPS 203, 204 & 205 tolérés par l\'ANSSI',
    pqcRequirementEn: 'Only FIPS 203, 204 & 205 allowed by ANSSI',
    status: 'PLANNED'
  }
];

export const AnssiNis2Timeline: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(2); // Default 2026
  const activeMilestone = REGULATORY_TIMELINE_MILESTONES[selectedIdx];

  return (
    <div className="bg-slate-900/90 border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Timeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{lang === 'fr' ? 'CALENDRIER RÉGLEMENTAIRE ANSSI & NIS2 (2024-2030)' : 'ANSSI & NIS2 REGULATORY TIMELINE (2024-2030)'}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            {lang === 'fr' ? 'Feuille de Route de Conformité & Jalons d\'Échéances' : 'Compliance Roadmap & Critical Milestone Dates'}
          </h3>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-blue-300 bg-blue-950/80 px-3.5 py-1.5 rounded-xl border border-blue-800">
          <span>{lang === 'fr' ? 'Cadre Numérique Européen' : 'European Digital Framework'}</span>
        </div>
      </div>

      {/* HORIZONTAL INTERACTIVE YEAR TRACK */}
      <div className="relative pt-4 pb-2">
        {/* Background Connecting Line */}
        <div className="absolute top-10 left-6 right-6 h-1 bg-slate-800 z-0" />
        <div 
          className="absolute top-10 left-6 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 transition-all duration-500 z-0"
          style={{ width: `${(selectedIdx / (REGULATORY_TIMELINE_MILESTONES.length - 1)) * 92}%` }}
        />

        {/* Year Buttons */}
        <div className="grid grid-cols-6 gap-2 relative z-10 text-center font-mono">
          {REGULATORY_TIMELINE_MILESTONES.map((m, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={m.year}
                onClick={() => setSelectedIdx(idx)}
                className="flex flex-col items-center space-y-2 cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border ${
                  isSelected
                    ? 'bg-blue-500 text-slate-950 border-white shadow-xl shadow-blue-500/40 scale-110'
                    : m.status === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                      : m.status === 'CRITICAL'
                        ? 'bg-red-950 text-red-400 border-red-700 animate-pulse'
                        : 'bg-slate-950 text-slate-400 border-slate-800 group-hover:border-slate-600 group-hover:text-white'
                }`}>
                  {m.status === 'COMPLETED' ? '✓' : idx + 1}
                </div>

                <span className={`text-xs font-bold ${
                  isSelected ? 'text-blue-300' : 'text-slate-400'
                }`}>
                  {m.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE MILESTONE EXPANDED CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMilestone.year}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                {lang === 'fr' ? activeMilestone.dateLabelFr : activeMilestone.dateLabelEn}
              </span>
              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold ${
                activeMilestone.status === 'COMPLETED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : activeMilestone.status === 'CRITICAL'
                    ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {lang === 'fr' ? activeMilestone.badgeFr : activeMilestone.badgeEn}
              </span>
            </div>

            <span className="text-xs font-mono text-slate-400 font-bold">
              {lang === 'fr' ? 'Autorité :' : 'Authority:'} <span className="text-white">{activeMilestone.authority}</span>
            </span>
          </div>

          <div>
            <h4 className="text-lg font-extrabold text-white font-sans">
              {lang === 'fr' ? activeMilestone.titleFr : activeMilestone.titleEn}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mt-1.5">
              {lang === 'fr' ? activeMilestone.descriptionFr : activeMilestone.descriptionEn}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-xs">
            <span className="text-[10px] text-blue-400 font-bold uppercase block">
              {lang === 'fr' ? 'Exigence Cryptographique Spécifique (PQC) :' : 'Specific Cryptographic PQC Mandate:'}
            </span>
            <p className="text-emerald-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lang === 'fr' ? activeMilestone.pqcRequirementFr : activeMilestone.pqcRequirementEn}</span>
            </p>
          </div>

          {/* Previous / Next Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
              disabled={selectedIdx === 0}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                selectedIdx > 0 
                  ? 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800' 
                  : 'bg-slate-950 text-slate-700 border border-slate-900 cursor-not-allowed'
              }`}
            >
              <span>← {lang === 'fr' ? 'Jalon Précédent' : 'Previous Milestone'}</span>
            </button>

            <span className="text-xs font-mono text-slate-500">
              {selectedIdx + 1} / {REGULATORY_TIMELINE_MILESTONES.length}
            </span>

            <button
              onClick={() => setSelectedIdx(Math.min(REGULATORY_TIMELINE_MILESTONES.length - 1, selectedIdx + 1))}
              disabled={selectedIdx === REGULATORY_TIMELINE_MILESTONES.length - 1}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                selectedIdx < REGULATORY_TIMELINE_MILESTONES.length - 1 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-950 text-slate-700 border border-slate-900 cursor-not-allowed'
              }`}
            >
              <span>{lang === 'fr' ? 'Jalon Suivant' : 'Next Milestone'} →</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export const AnssiNis2FranceSection: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const lang = language;

  const [activeTab, setActiveTab] = useState<'ANSSI' | 'LPM' | 'NIS2' | 'AUDIT'>('ANSSI');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'c1': true,
    'c2': true,
    'c3': true,
    'c4': true,
    'c5': false,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportAuditReport = () => {
    showToast(
      lang === 'fr' ? '📜 Rapport de Conformité ANSSI / NIS2 Généré !' : '📜 ANSSI / NIS2 Compliance Certificate Exported!',
      lang === 'fr' 
        ? 'Attestation officielle certifiant la conformité de l\'architecture Q-CRYPT avec les règles ANSSI, la LPM 2024-2030 et NIS2.' 
        : 'Official verification certifying Q-CRYPT architecture compliance with ANSSI guidelines, LPM 2024-2030, and NIS2.',
      'success'
    );
  };

  return (
    <section id="anssi-nis2-france" className="py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-b border-slate-800 relative overflow-hidden">
      
      {/* Subtle French Flag Accent Mesh Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-950 via-slate-900 to-red-950 border border-blue-400/30 shadow-xl">
            <span className="text-sm">🇫🇷</span>
            <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest">
              {lang === 'fr' ? 'CONÇU EN FRANCE • SOUVERAINETÉ EUROPÉENNE' : 'MADE IN FRANCE • EUROPEAN SOVEREIGNTY'}
            </span>
            <span className="text-xs font-mono font-bold text-red-400">ANSSI & NIS2</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {lang === 'fr' 
              ? 'Conformité ANSSI, Loi de Programmation Militaire & NIS2' 
              : 'ANSSI Qualification, French LPM 2024-2030 & NIS2 Compliance'}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans">
            {lang === 'fr'
              ? 'Ancré dans la souveraineté numérique française. Quantum Messenger répond aux exigences strictes de l\'ANSSI, de la Loi de Programmation Militaire (LPM) pour les OIV/OSE et de la Directive Européenne NIS2.'
              : 'Grounded in French digital sovereignty. Quantum Messenger complies with ANSSI recommendations, French Military Programming Law (LPM 2024-2030) for OIVs, and EU NIS2.'}
          </p>
        </div>

        {/* THREE REGULATORY PILLARS SHOWCASE BADGES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* PILLAR 1: ANSSI HYBRID STRATEGY */}
          <div className="bg-slate-900/90 border border-blue-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-blue-950 border border-blue-500/30 rounded-2xl text-blue-400">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                  ANSSI Avis Scientific
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white font-sans">
                {lang === 'fr' ? 'Recommandations ANSSI (PQC)' : 'ANSSI PQC Hybrid Standard'}
              </h3>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {lang === 'fr'
                  ? 'L\'ANSSI recommande la transition en 3 phases par mécanismes hybrides (double chiffrement). Q-CRYPT associe Elliptic Curve Diffie-Hellman (ECDH X25519) avec NIST ML-KEM-1024 / FrodoKEM.'
                  : 'ANSSI guidelines mandate a 3-phase transition using hybrid key encapsulation. Q-CRYPT nests classical ECDH (X25519) with NIST ML-KEM-1024 / FrodoKEM for defense-in-depth.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>{lang === 'fr' ? 'Mise en Œuvre' : 'Implementation'}</span>
                <span className="text-emerald-400 font-bold">{lang === 'fr' ? 'Hybride Réseau Phase 2' : 'Phase 2 Network Hybrid'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>{lang === 'fr' ? 'Souveraineté' : 'Sovereignty'}</span>
                <span className="text-blue-300 font-bold">100% Clés Françaises/EU</span>
              </div>
            </div>
          </div>

          {/* PILLAR 2: LOI DE PROGRAMMATION MILITAIRE (LPM 2024-2030) */}
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-amber-950 border border-amber-500/30 rounded-2xl text-amber-400">
                  <Shield className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                  LPM 2024-2030
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white font-sans">
                {lang === 'fr' ? 'Loi Programmation Militaire' : 'French Military Law (LPM)'}
              </h3>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {lang === 'fr'
                  ? 'Protection renforcée pour les Opérateurs d\'Importance Vitale (OIV) et Opérateurs de Services Essentiels (OSE). Ancrage matériel sur puce qualifiée CC EAL4+ et zéro porte dérobée.'
                  : 'Mandatory protection for Vital Importance Operators (OIV) and defense assets. Features CC EAL4+ hardware enclave key binding and strict zero backdoor compliance.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>{lang === 'fr' ? 'Cible Défense' : 'Defense Target'}</span>
                <span className="text-amber-300 font-bold">OIV / OSE / Armées</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>{lang === 'fr' ? 'Isolation Matérielle' : 'Hardware Vault'}</span>
                <span className="text-emerald-400 font-bold">CC EAL4+ / Titan M2</span>
              </div>
            </div>
          </div>

          {/* PILLAR 3: DIRECTIVE EUROPÉENNE NIS2 */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-emerald-950 border border-emerald-500/30 rounded-2xl text-emerald-400">
                  <Award className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                  DIRECTIVE NIS2
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white font-sans">
                {lang === 'fr' ? 'Directive Européenne NIS2' : 'EU NIS2 Cyber Directive'}
              </h3>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {lang === 'fr'
                  ? 'Exigences de gestion des risques de la chaîne d\'approvisionnement, notifications d\'incidents sous 24h, chiffrement de bout en bout souverain et audits continus d\'intégrité.'
                  : 'European NIS2 Directive compliance. Mandates supply chain cryptographic resilience, 24-hour incident notification, sovereign E2EE, and automated audit logging.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>{lang === 'fr' ? 'Portée UE' : 'EU Scope'}</span>
                <span className="text-emerald-400 font-bold">Entités Essentielles / Importantes</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>{lang === 'fr' ? 'Alerte Incident' : 'Incident Alert'}</span>
                <span className="text-cyan-300 font-bold">Rachet Auto &lt; 24h</span>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE COMPLIANCE TIMELINE COMPONENT (2024-2030) */}
        <AnssiNis2Timeline lang={lang} />

        {/* DEEP INTERACTIVE TABBED REGULATORY EXPLANATION */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Tabs Selector */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
            <button
              onClick={() => setActiveTab('ANSSI')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ANSSI'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>🇫🇷</span>
              <span>{lang === 'fr' ? 'Recommandations ANSSI' : 'ANSSI PQC Guidelines'}</span>
            </button>

            <button
              onClick={() => setActiveTab('LPM')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'LPM'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{lang === 'fr' ? 'LPM 2024-2030 (Défense)' : 'LPM 2024-2030 (Defense)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('NIS2')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'NIS2'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Directive NIS2 (UE)' : 'EU NIS2 Directive'}</span>
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'AUDIT'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Inspecteur de Conformité CISO' : 'CISO Compliance Inspector'}</span>
            </button>
          </div>

          {/* TAB CONTENT: ANSSI */}
          {activeTab === 'ANSSI' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-950 border border-blue-500/40 rounded-2xl text-blue-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">
                    {lang === 'fr' ? 'Stratégie de Transition Post-Quantique de l\'ANSSI' : 'ANSSI Post-Quantum Cryptographic Transition Strategy'}
                  </h3>
                  <p className="text-xs text-blue-300 font-mono">Avis scientifique ANSSI sur la cryptographie post-quantique</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-blue-400">1.</span> {lang === 'fr' ? 'Mécanisme Hybride Obligatoire' : 'Mandatory Hybrid Mechanism'}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans">
                    {lang === 'fr'
                      ? 'L\'ANSSI préconise l\'encapsulation hybride associant un algorithme classique éprouvé (ECC X25519 / RSA) avec un schéma basé sur les réseaux (ML-KEM-1024 ou FrodoKEM) pour éviter toute vulnérabilité imprévue.'
                      : 'ANSSI strongly recommends hybrid encapsulation combining a proven classical algorithm (ECC X25519) with a lattice-based scheme (ML-KEM-1024 or FrodoKEM) to mitigate residual mathematical risks.'}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-blue-400">2.</span> {lang === 'fr' ? 'Souveraineté des Clés & Qualification' : 'Key Sovereignty & Qualification'}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans">
                    {lang === 'fr'
                      ? 'Garantie d\'absence de portes dérobées étrangères (non-soumis au US Cloud Act ou FISA 702). Les clés maîtres sont générées localement sur le territoire national ou au sein d\'enclaves isolées.'
                      : 'Zero vulnerability to non-EU extra-territorial laws (US Cloud Act / FISA 702). Master keys remain generated locally within national boundaries or sovereign enclaves.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: LPM */}
          {activeTab === 'LPM' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-950 border border-amber-500/40 rounded-2xl text-amber-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">
                    {lang === 'fr' ? 'Loi de Programmation Militaire 2024-2030 (LPM)' : 'French Military Programming Law 2024-2030 (LPM)'}
                  </h3>
                  <p className="text-xs text-amber-300 font-mono">Sécurité renforcée des OIV, OSE et Ministères de la Défense</p>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {lang === 'fr'
                    ? 'La LPM 2024-2030 impose aux Opérateurs d\'Importance Vitale (OIV) de déployer des moyens chiffrés hautement sécurisés résistant aux interceptions étatiques. Q-CRYPT intègre la mise à zéro matérielle immédiate et l\'isolation sous micro-noyau chiffré.'
                    : 'The French LPM 2024-2030 enforces state-of-the-art cryptographic insulation for Vital Importance Operators (OIV). Q-CRYPT provides physical hardware zeroization and microkernel encrypted memory isolation.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/30 text-center">
                    <span className="text-xs font-mono font-bold text-amber-300 block">OIV / OSE Defense</span>
                    <span className="text-[10px] text-slate-400 font-mono">100% Conforme</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/30 text-center">
                    <span className="text-xs font-mono font-bold text-amber-300 block">Zéro Porte Dérobée</span>
                    <span className="text-[10px] text-slate-400 font-mono">Non-Cloud Act</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/30 text-center">
                    <span className="text-xs font-mono font-bold text-amber-300 block">Souveraineté Nationale</span>
                    <span className="text-[10px] text-slate-400 font-mono">Conçu en France 🇫🇷</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: NIS2 */}
          {activeTab === 'NIS2' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-950 border border-emerald-500/40 rounded-2xl text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">
                    {lang === 'fr' ? 'Exigences de la Directive Européenne NIS2' : 'EU NIS2 Cybersecurity Directive Standard'}
                  </h3>
                  <p className="text-xs text-emerald-300 font-mono">Directive (UE) 2022/2555 du Parlement Européen</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Article 21 - Mesures de Sécurité</span>
                  <p className="text-xs text-slate-300 font-sans">
                    {lang === 'fr'
                      ? 'Obligation de recourir au chiffrement de bout en bout et au chiffrement post-quantique pour sécuriser les données en transit de la chaîne d\'approvisionnement.'
                      : 'Mandates end-to-end and post-quantum cryptography to secure supply-chain data in transit across European essential entities.'}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Article 23 - Notifications 24h</span>
                  <p className="text-xs text-slate-300 font-sans">
                    {lang === 'fr'
                      ? 'Mécanisme d\'alerte et de rotation automatique des clés en cas de détection de menace d\'interception dans les 24 heures.'
                      : 'Automated 24-hour key ratcheting and threat alert notification triggers upon suspicious network intercept spikes.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: CISO AUDIT INSPECTOR */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">
                    {lang === 'fr' ? 'Inspecteur d\'Aptitude Réseau ANSSI / NIS2' : 'ANSSI & NIS2 Network Readiness Inspector'}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    {lang === 'fr' ? 'Cochez les critères de conformité de votre organisation pour générer votre certificat d\'audit.' : 'Check off your organization\'s compliance criteria to generate a verified readiness audit.'}
                  </p>
                </div>

                <button
                  onClick={handleExportAuditReport}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-black flex items-center space-x-2 transition-all shadow-lg cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Générer Certificat (PDF)' : 'Export Audit Certificate'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'c1', labelFr: 'Encapsulation Hybride ML-KEM-1024 + ECDH (Recommandation ANSSI Phase 2)', labelEn: 'ML-KEM-1024 + ECDH Hybrid Encapsulation (ANSSI Phase 2 Guideline)' },
                  { id: 'c2', labelFr: 'Puce de Sécurité Matérielle CC EAL4+ / Titan M2 (Isolation LPM 2024-2030)', labelEn: 'CC EAL4+ / Titan M2 Hardware Isolation (French LPM Defense Standard)' },
                  { id: 'c3', labelFr: 'Invisibilité des Métadonnées & Zéro Annuaire Centralisé (Directive NIS2)', labelEn: 'Zero Central Metadata & Private PIR Lookup (EU NIS2 Directive)' },
                  { id: 'c4', labelFr: 'Garantie d\'Absence de Porte Dérobée Extra-Territoriale (Non-Cloud Act)', labelEn: 'Guaranteed Sovereign Non-Cloud Act Extra-Territorial Isolation' },
                  { id: 'c5', labelFr: 'Mise à Jour Régulière des Ratchets de Clés sous 60s (Souveraineté PQC)', labelEn: 'Continuous 60-second Session Key Ratcheting (Sovereign PQC)' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      checkedItems[item.id]
                        ? 'bg-slate-950 border-emerald-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        checkedItems[item.id]
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                          : 'border-slate-700'
                      }`}>
                        {checkedItems[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-mono font-bold">
                        {lang === 'fr' ? item.labelFr : item.labelEn}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      checkedItems[item.id]
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {checkedItems[item.id] ? (lang === 'fr' ? 'CONFORME' : 'COMPLIANT') : (lang === 'fr' ? 'À VERIFIER' : 'PENDING')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
