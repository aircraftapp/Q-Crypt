import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, Cpu, Globe, BookOpen, Layers, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Sparkles, Binary } from 'lucide-react';

export const PqcTerminologySection: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [activeTab, setActiveTab] = useState<'fips203' | 'fips204' | 'hardware'>('fips203');

  const content = {
    en: {
      badge: 'Interactive Knowledge Base',
      title: 'PQC Terminology & Standards Guide',
      subtitle: 'Clear, transparent explanation of NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) post-quantum standards and device hardware integration.',
      langToggle: 'Language:',
      tabs: {
        fips203: 'FIPS 203 (ML-KEM)',
        fips204: 'FIPS 204 (ML-DSA)',
        hardware: 'Device & Hardware Reality'
      },
      fips203Card: {
        title: 'FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM)',
        analogyTitle: 'Analogy: The Post-Quantum Key Safe',
        analogyText: 'Imagine sending a locked steel safe through the mail. Even if a future quantum supercomputer intercepts the box, the mathematical lock (based on complex high-dimensional geometric lattices) cannot be picked.',
        purpose: 'Primary Purpose:',
        purposeText: 'Secure Key Exchange & Session Establishment. Replaces classical RSA, Diffie-Hellman, and Elliptic Curve Diffie-Hellman (ECDH).',
        howItWorksTitle: 'How ML-KEM Works:',
        howItWorksSteps: [
          'Derived from the CRYSTALS-Kyber algorithm, standardized by NIST in August 2024 as FIPS 203.',
          'Used to securely agree on a shared secret key over an untrusted public network.',
          'ML-KEM-1024 provides Category 5 security (equivalent to AES-256 brute-force resistance).',
          'Prevents "Harvest Now, Decrypt Later" attacks where adversaries record current encrypted traffic to decrypt in the quantum era.'
        ]
      },
      fips204Card: {
        title: 'FIPS 204: Module-Lattice-Based Digital Signature Standard (ML-DSA)',
        analogyTitle: 'Analogy: The Unforgeable Quantum Wax Seal',
        analogyText: 'Imagine stamping an official document with a unique microscopic wax seal. ML-DSA proves beyond doubt that a message really came from you and was not tampered with.',
        purpose: 'Primary Purpose:',
        purposeText: 'Authentication & Data Integrity. Replaces classical RSA and ECDSA (Elliptic Curve Digital Signature Algorithm).',
        howItWorksTitle: 'How ML-DSA Works:',
        howItWorksSteps: [
          'Derived from the CRYSTALS-Dilithium algorithm, standardized by NIST in August 2024 as FIPS 204.',
          'Generates a digital signature for messages, software updates, and cryptographic handshakes.',
          'ML-DSA-87 provides maximum NIST Category 5 security against quantum forgery.',
          'Ensures non-repudiation: guarantees that sender identity cannot be spoofed by quantum computers.'
        ]
      },
      hardwareCard: {
        title: 'Fact-Based Device & Hardware Enclave Reality',
        badge: 'Strict Technical Transparency',
        intro: 'To maintain strict truth and technical accuracy, it is vital to understand how current mobile devices and hardware enclaves interact with Post-Quantum Cryptography:',
        points: [
          {
            heading: 'Current Hardware Chips (Titan M2, Knox, Apple Secure Enclave):',
            desc: 'Legacy hardware security elements (HSMs/Secure Enclaves) built before 2024 contain fixed hardware accelerators specifically for RSA and ECC (P-256, Ed25519). They do NOT contain native silicon circuits for lattice polynomial math.'
          },
          {
            heading: 'How PQC Runs on Modern Devices:',
            desc: 'FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) run via highly optimized C/C++ and ARM NEON assembly software libraries inside trusted software layers or firmware.'
          },
          {
            heading: 'The Hybrid Architecture Model:',
            desc: 'Devices combine hardware enclave seed generation (TRNG) with software-based lattice encapsulation. The hardware enclave holds the master seed, while post-quantum math executes in protected memory.'
          },
          {
            heading: 'Future Silicon Roadmap:',
            desc: 'Next-generation mobile SoCs and server HSMs (2026+) are actively integrating dedicated post-quantum coprocessors.'
          }
        ]
      },
      tableTitle: 'Quick Side-by-Side Comparison',
      tableHeaders: ['Feature', 'FIPS 203 (ML-KEM)', 'FIPS 204 (ML-DSA)'],
      tableRows: [
        ['Origin Algorithm', 'CRYSTALS-Kyber', 'CRYSTALS-Dilithium'],
        ['Primary Function', 'Key Encapsulation / Agreement', 'Digital Signature / Authentication'],
        ['Classical Replacement', 'RSA-3096, ECDH (P-256/Curve25519)', 'RSA Signatures, ECDSA'],
        ['Max NIST Security Level', 'ML-KEM-1024 (Category 5)', 'ML-DSA-87 (Category 5)'],
        ['Quantum Resistance Basis', 'Module Learning With Errors (M-LWE)', 'Module Learning With Errors / Short Vectors']
      ]
    },
    fr: {
      badge: 'Base de Connaissances Interactive',
      title: 'Guide de Terminology et Normes PQC',
      subtitle: 'Explication claire et transparente des normes post-quantiques NIST FIPS 203 (ML-KEM) et FIPS 204 (ML-DSA) et de leur intégration matérielle réelle.',
      langToggle: 'Langue :',
      tabs: {
        fips203: 'FIPS 203 (ML-KEM)',
        fips204: 'FIPS 204 (ML-DSA)',
        hardware: 'Réalité des Équipements'
      },
      fips203Card: {
        title: 'FIPS 203 : Mécanisme d\'Encapsulation de Clé Basé sur les Réseaux (ML-KEM)',
        analogyTitle: 'Analogie : Le Coffre-Fort Post-Quantique',
        analogyText: 'Imaginez envoyer un coffre-fort en acier verrouillé par la poste. Même si un superordinateur quantique futur le pirate, la serrure mathématique (fondée sur des réseaux géométriques complexes) reste impossible à crocheter.',
        purpose: 'Objectif Principal :',
        purposeText: 'Échange de clés sécurisé et établissement de session. Remplace RSA, Diffie-Hellman et ECDH classiques.',
        howItWorksTitle: 'Comment Fonctionne ML-KEM :',
        howItWorksSteps: [
          'Issu de l\'algorithme CRYSTALS-Kyber, normalisé par le NIST en août 2024 sous le nom FIPS 203.',
          'Utilisé pour convenir en toute sécurité d\'une clé secrète partagée sur un réseau public non sécurisé.',
          'ML-KEM-1024 offre la sécurité de Catégorie 5 (équivalent à la résistance brute d\'AES-256).',
          'Empêche les attaques "Récolter maintenant, Décrypter plus tard" où les adversaires enregistrent le trafic chiffré aujourd\'hui pour le décoder à l\'ère quantique.'
        ]
      },
      fips204Card: {
        title: 'FIPS 204 : Norme de Signature Numérique Basée sur les Réseaux (ML-DSA)',
        analogyTitle: 'Analogie : Le Sceau de Cire Quantique Infalsifiable',
        analogyText: 'Imaginez apposer sur un document officiel un sceau de cire microscopique unique. ML-DSA prouve sans aucun doute qu\'un message provient bien de vous et n\'a pas été altéré.',
        purpose: 'Objectif Principal :',
        purposeText: 'Authentification et Intégrité des Données. Remplace les signatures classiques RSA et ECDSA.',
        howItWorksTitle: 'Comment Fonctionne ML-DSA :',
        howItWorksSteps: [
          'Issu de l\'algorithme CRYSTALS-Dilithium, normalisé par le NIST en août 2024 sous la norme FIPS 204.',
          'Génère une signature numérique pour les messages, mises à jour logicielles et poignées de main cryptographiques.',
          'ML-DSA-87 garantit le niveau maximal de sécurité Catégorie 5 contre les falsifications quantiques.',
          'Garantit la non-répudiation : empêche les ordinateurs quantiques d\'usurper l\'identité de l\'expéditeur.'
        ]
      },
      hardwareCard: {
        title: 'Transparence Technique : Réalité Matérielle des Puces et Enclaves',
        badge: 'Transparence Rigoireuse',
        intro: 'Afin d\'assurer une vérité technique absolue, il est essentiel de comprendre comment les puces mobiles actuelles et les enclaves matérielles interagissent avec la cryptographie post-quantique :',
        points: [
          {
            heading: 'Puces Matérielles Actuelles (Titan M2, Knox, Apple Secure Enclave) :',
            desc: 'Les puces de sécurité matérielles conçues avant 2024 intègrent des accélérateurs gravés dédiés à RSA et ECC (P-256, Ed25519). Elles ne possèdent pas de circuits physiques dédiés aux polynômes de réseaux.'
          },
          {
            heading: 'Exécution du PQC sur les Appareils :',
            desc: 'FIPS 203 (ML-KEM) et FIPS 204 (ML-DSA) s\'exécutent via des bibliothèques logicielles optimisées en C/C++ et assembleur ARM NEON au sein de couches logicielles sécurisées.'
          },
          {
            heading: 'Le Modèle d\'Architecture Hybride :',
            desc: 'Les appareils combinent la génération de graines aléatoires par l\'enclave matérielle (TRNG) avec l\'encapsulation réseau logicielle. L\'enclave protège la graine, tandis que les calculs post-quantiques s\'exécutent en mémoire sécurisée.'
          },
          {
            heading: 'Feuille de Route Matérielle Future :',
            desc: 'Les processeurs mobiles de nouvelle génération et les HSMs de serveurs (2026+) intègrent progressivement des coprocesseurs dédiés au post-quantique.'
          }
        ]
      },
      tableTitle: 'Comparaison Rapide Côte à Côte',
      tableHeaders: ['Caractéristique', 'FIPS 203 (ML-KEM)', 'FIPS 204 (ML-DSA)'],
      tableRows: [
        ['Algorithme d\'Origine', 'CRYSTALS-Kyber', 'CRYSTALS-Dilithium'],
        ['Fonction Principale', 'Encapsulation de Clé / Échange', 'Signature Numérique / Authentification'],
        ['Remplacement Classique', 'RSA-3096, ECDH (P-256/Curve25519)', 'Signatures RSA, ECDSA'],
        ['Niveau Max Sécurité NIST', 'ML-KEM-1024 (Catégorie 5)', 'ML-DSA-87 (Catégorie 5)'],
        ['Principe Post-Quantique', 'Module Learning With Errors (M-LWE)', 'Module Learning With Errors / Vecteurs Courts']
      ]
    }
  };

  const current = content[lang];

  return (
    <section id="pqc-terminology" className="py-12 bg-slate-950 text-slate-100 border-b border-slate-900 font-sans relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute -top-10 left-1/3 w-[600px] h-[300px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
        
        {/* Header Bar with Language Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
              <BookOpen className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{current.badge}</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                {current.title}
              </h2>
            </div>
          </div>

          {/* Language Switcher Buttons */}
          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl shrink-0">
            <span className="text-xs font-mono text-slate-400 pl-2 hidden sm:inline">{current.langToggle}</span>
            <button
              onClick={() => setLang('en')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇺🇸 English</span>
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                lang === 'fr'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇫🇷 Français</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          {current.subtitle}
        </p>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab('fips203')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'fips203'
                ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-cyan-400" />
            <span>{current.tabs.fips203}</span>
          </button>

          <button
            onClick={() => setActiveTab('fips204')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'fips204'
                ? 'bg-purple-950 border border-purple-500/50 text-purple-300 shadow-lg shadow-purple-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>{current.tabs.fips204}</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'hardware'
                ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>{current.tabs.hardware}</span>
          </button>
        </div>

        {/* Tab 1: FIPS 203 ML-KEM */}
        {activeTab === 'fips203' && (
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                NIST FIPS 203
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {current.fips203Card.title}
              </h3>
            </div>

            {/* Analogy Box */}
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{current.fips203Card.analogyTitle}</span>
              </h4>
              <p className="text-xs md:text-sm text-cyan-100/90 leading-relaxed">
                {current.fips203Card.analogyText}
              </p>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                {current.fips203Card.purpose}
              </h4>
              <p className="text-sm text-slate-200 font-medium">
                {current.fips203Card.purposeText}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                {current.fips203Card.howItWorksTitle}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
                {current.fips203Card.howItWorksSteps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: FIPS 204 ML-DSA */}
        {activeTab === 'fips204' && (
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
                NIST FIPS 204
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {current.fips204Card.title}
              </h3>
            </div>

            {/* Analogy Box */}
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
              <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{current.fips204Card.analogyTitle}</span>
              </h4>
              <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed">
                {current.fips204Card.analogyText}
              </p>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                {current.fips204Card.purpose}
              </h4>
              <p className="text-sm text-slate-200 font-medium">
                {current.fips204Card.purposeText}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                {current.fips204Card.howItWorksTitle}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
                {current.fips204Card.howItWorksSteps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Fact-Based Device Hardware Reality */}
        {activeTab === 'hardware' && (
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                {current.hardwareCard.badge}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {current.hardwareCard.title}
              </h3>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {current.hardwareCard.intro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {current.hardwareCard.points.map((pt, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span>{pt.heading}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Binary className="w-5 h-5 text-cyan-400" />
            <span>{current.tableTitle}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  {current.tableHeaders.map((h, idx) => (
                    <th key={idx} className="p-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {current.tableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50 transition-colors">
                    <td className="p-3 font-bold text-slate-300 font-mono">{row[0]}</td>
                    <td className="p-3 text-cyan-300">{row[1]}</td>
                    <td className="p-3 text-purple-300">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
