import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Key, Lock, Cpu, Globe, BookOpen, Layers, CheckCircle2, 
  AlertCircle, HelpCircle, ArrowRight, Sparkles, Binary, Volume2, 
  VolumeX, Play, Pause, RotateCcw, Smartphone, Server, Zap, RefreshCw, Info,
  Printer, Download, Award, XCircle, Check, Search, X, Filter, Tag, ShieldAlert,
  ExternalLink, Database
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface GlossaryTermItem {
  id: string;
  termEn: string;
  termFr: string;
  category: 'standards' | 'math' | 'threats' | 'hardware' | 'primitives';
  categoryLabelEn: string;
  categoryLabelFr: string;
  definitionEn: string;
  definitionFr: string;
  realWorldImpactEn: string;
  realWorldImpactFr: string;
  nistStandard?: string;
  quantumResistanceLevel: 'Category 5 (256-bit)' | 'Category 3 (192-bit)' | 'Category 1 (128-bit)' | 'N/A';
}

export const PQC_GLOSSARY_ITEMS: GlossaryTermItem[] = [
  {
    id: 'lattice-based-cryptography',
    termEn: 'Lattice-Based Cryptography',
    termFr: 'Cryptographie Basée sur les Réseaux',
    category: 'math',
    categoryLabelEn: 'Mathematical Foundations',
    categoryLabelFr: 'Fondations Mathématiques',
    definitionEn: 'Cryptographic algorithms constructed around high-dimensional geometric point grids (lattices). Hardness relies on finding the closest point in an n-dimensional lattice grid (SVP/CVP), a problem that remains exponentially hard for both classical and quantum supercomputers.',
    definitionFr: 'Algorithmes cryptographiques construits sur des réseaux géométriques multidimensionnels. La sécurité repose sur la difficulté de trouver le point le plus proche dans une grille à n dimensions (SVP/CVP), insoluble pour les ordinateurs quantiques.',
    realWorldImpactEn: 'Forms the foundational mathematical pillar for NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) standards, completely replacing legacy RSA/ECC.',
    realWorldImpactFr: 'Pilier mathématique fondamental des normes NIST FIPS 203 (ML-KEM) et FIPS 204 (ML-DSA), remplaçant complètement RSA et ECC.',
    nistStandard: 'FIPS 203 & FIPS 204 Basis',
    quantumResistanceLevel: 'Category 5 (256-bit)'
  },
  {
    id: 'ciphertext-indistinguishability',
    termEn: 'Ciphertext Indistinguishability (IND-CCA2)',
    termFr: 'Indistingueabilité des Textes Chiffrés (IND-CCA2)',
    category: 'primitives',
    categoryLabelEn: 'Cryptographic Guarantees',
    categoryLabelFr: 'Garanties de Sécurité',
    definitionEn: 'The gold standard of encryption security where an adversary who chooses two target messages cannot determine which message corresponds to a given ciphertext, even when granted adaptive access to an active decryption oracle.',
    definitionFr: 'Le niveau maximal de sécurité en chiffrement où un attaquant ne peut pas distinguer quel message clair correspond à un bloc chiffré, même avec un accès adaptatif à un oracle de déchiffrement.',
    realWorldImpactEn: 'FIPS 203 (ML-KEM) rigorously achieves IND-CCA2 security using the Fujisaki-Okamoto transform, rendering key encapsulation immune to chosen-ciphertext attacks.',
    realWorldImpactFr: 'FIPS 203 (ML-KEM) garantit une sécurité IND-CCA2 grâce à la transformation Fujisaki-Okamoto, protégeant l\'encapsulation contre les attaques à texte chiffré choisi.',
    nistStandard: 'FIPS 203 Obligatory Property',
    quantumResistanceLevel: 'Category 5 (256-bit)'
  },
  {
    id: 'module-learning-with-errors',
    termEn: 'Module Learning With Errors (M-LWE)',
    termFr: 'Module Learning With Errors (M-LWE)',
    category: 'math',
    categoryLabelEn: 'Mathematical Foundations',
    categoryLabelFr: 'Fondations Mathématiques',
    definitionEn: 'An algebraic variant of Learning With Errors (LWE) operating over polynomial module rings. It introduces small random error vectors to linear matrix equations, balancing compact key sizes with high algebraic security.',
    definitionFr: 'Une variante algébrique du problème LWE opérant sur des anneaux de polynômes modulaires. Elle injecte un bruit aléatoire contrôlé pour combiner compacité des clés et sécurité.',
    realWorldImpactEn: 'Directly powers CRYSTALS-Kyber and CRYSTALS-Dilithium, optimizing vector polynomial multiplication for ARM NEON and AVX2 hardware processors.',
    realWorldImpactFr: 'Alimente directement CRYSTALS-Kyber et Dilithium, optimisant la multiplication polynomiale sur processeurs ARM NEON et AVX2.',
    nistStandard: 'FIPS 203 & FIPS 204 Core Math',
    quantumResistanceLevel: 'Category 5 (256-bit)'
  },
  {
    id: 'shors-algorithm',
    termEn: "Shor's Algorithm",
    termFr: "Algorithme de Shor",
    category: 'threats',
    categoryLabelEn: 'Quantum Threat Vectors',
    categoryLabelFr: 'Vecteurs de Menaces Quantiques',
    definitionEn: 'A quantum computing algorithm invented by Peter Shor in 1994 that finds prime factors of integers and solves discrete logarithms in polynomial time, completely destroying RSA, ECC, and Diffie-Hellman ciphers.',
    definitionFr: 'Un algorithme quantique créé par Peter Shor en 1994 capable de factoriser les nombres entiers et de résoudre le logarithme discret en temps polynomial, brisant RSA et ECC.',
    realWorldImpactEn: 'Requires all global enterprise communications to migrate to lattice-based post-quantum cryptography prior to the emergence of fault-tolerant CRQCs.',
    realWorldImpactFr: 'Exige la migration globale vers la cryptographie post-quantique avant l\'arrivée des ordinateurs quantiques tolérants aux pannes.',
    nistStandard: 'Renders RSA/ECC Defunct',
    quantumResistanceLevel: 'N/A'
  },
  {
    id: 'grovers-algorithm',
    termEn: "Grover's Algorithm",
    termFr: "Algorithme de Grover",
    category: 'threats',
    categoryLabelEn: 'Quantum Threat Vectors',
    categoryLabelFr: 'Vecteurs de Menaces Quantiques',
    definitionEn: 'A quantum search algorithm providing a quadratic speedup for searching unstructured databases or brute-forcing symmetric key spaces. It reduces effective bit security by half.',
    definitionFr: 'Un algorithme quantique de recherche offrant une vitesse quadratique sur les bases de données non structurées, réduisant de moitié la sécurité des clés symétriques.',
    realWorldImpactEn: 'AES-128 is reduced to 64 bits of quantum security (vulnerable), whereas AES-256 retains 128 bits of quantum security (secure).',
    realWorldImpactFr: 'AES-128 est réduit à 64 bits de sécurité quantique (vulnérable), tandis qu\'AES-256 conserve 128 bits (sécurisé).',
    nistStandard: 'Dictates AES-256 Minimum',
    quantumResistanceLevel: 'N/A'
  },
  {
    id: 'harvest-now-decrypt-later',
    termEn: 'Harvest Now, Decrypt Later (HNDL / SNDL)',
    termFr: 'Récolter Maintenant, Décrypter Plus Tard (HNDL)',
    category: 'threats',
    categoryLabelEn: 'Quantum Threat Vectors',
    categoryLabelFr: 'Vecteurs de Menaces Quantiques',
    definitionEn: 'An active adversarial surveillance strategy where encrypted network traffic (VPNs, TLS sessions, banking wire transfers) is recorded today and archived until quantum computers can retroactively decrypt it.',
    definitionFr: 'Une stratégie d\'espionnage où le trafic chiffré actuel est intercepté et stocké dans l\'attente d\'ordinateurs quantiques capables de le décoder rétroactivement.',
    realWorldImpactEn: 'Presents an immediate crisis for long-life data (government secrets, healthcare records, financial ledgers) requiring instant deployment of ML-KEM.',
    realWorldImpactFr: 'Pose une menace urgente pour les données confidentielles à longue durée de vie, nécessitant le déploiement immédiat de ML-KEM.',
    nistStandard: 'Primary Target of FIPS 203',
    quantumResistanceLevel: 'N/A'
  },
  {
    id: 'slh-dsa-sphincs',
    termEn: 'SLH-DSA (SPHINCS+)',
    termFr: 'SLH-DSA (SPHINCS+)',
    category: 'standards',
    categoryLabelEn: 'NIST Standards & Backups',
    categoryLabelFr: 'Normes NIST & Secours',
    definitionEn: 'NIST FIPS 205 standard for stateless hash-based digital signatures. It relies solely on the security of collision-resistant hash functions (SHAKE-256 / SHA-2), serving as a lattice-independent failsafe.',
    definitionFr: 'Norme NIST FIPS 205 pour les signatures numériques sans état basées sur les fonctions de hachage (SHAKE-256). Sert de secours indépendant des réseaux mathématiques.',
    realWorldImpactEn: 'Used as an alternative signature backup in case unanticipated mathematical vulnerabilities are ever discovered in lattice-based cryptography.',
    realWorldImpactFr: 'Utilisé comme alternative de secours au cas où des vulnérabilités imprévues affecteraient la cryptographie sur réseaux.',
    nistStandard: 'FIPS 205 Standard',
    quantumResistanceLevel: 'Category 5 (256-bit)'
  },
  {
    id: 'stateful-hash-signatures',
    termEn: 'Stateful Hash Signatures (LMS & XMSS)',
    termFr: 'Signatures Basées sur le Hachage avec État (LMS/XMSS)',
    category: 'standards',
    categoryLabelEn: 'NIST Standards & Backups',
    categoryLabelFr: 'Normes NIST & Secours',
    definitionEn: 'Post-quantum signature schemes (NIST SP 800-208) utilizing Merkle hash trees where key pairs maintain a strict internal counter state. Generating two signatures with the same state index destroys security.',
    definitionFr: 'Schémas de signature post-quantiques utilisant des arbres de hachage de Merkle où la clé conserve un compteur d\'état strict pour éviter la réutilisation d\'index.',
    realWorldImpactEn: 'Ideal for immutable firmware code signing and secure bootloaders in aerospace, satellite, and telecom hardware.',
    realWorldImpactFr: 'Idéal pour la signature de firmware et les démarreurs sécurisés dans l\'aéronautique, les satellites et le matériel télécom.',
    nistStandard: 'NIST SP 800-208',
    quantumResistanceLevel: 'Category 5 (256-bit)'
  },
  {
    id: 'constant-time-execution',
    termEn: 'Constant-Time Execution',
    termFr: 'Exécution en Temps Constant',
    category: 'hardware',
    categoryLabelEn: 'Hardware & Implementation',
    categoryLabelFr: 'Matériel & Exécution',
    definitionEn: 'Software execution design ensuring that algorithmic loops and conditional branches take identical CPU clock cycles regardless of secret key bit values, preventing timing side-channel attacks.',
    definitionFr: 'Conception logicielle garantissant que l\'exécution dure le même nombre de cycles d\'horloge quelles que soient les clés, empêchant les attaques par canaux cachés temporels.',
    realWorldImpactEn: 'Mandatory requirement for FIPS 203/204 software libraries to prevent side-channel key extraction during lattice polynomial reduction.',
    realWorldImpactFr: 'Exigence obligatoire pour les bibliothèques PQC afin d\'éviter l\'extraction de clés par analyse temporelle.',
    nistStandard: 'FIPS 140-3 Requirement',
    quantumResistanceLevel: 'Category 5 (256-bit)'
  },
  {
    id: 'crqc',
    termEn: 'Cryptographically Relevant Quantum Computer (CRQC)',
    termFr: 'Ordinateur Quantique Cryptographiquement Pertinent (CRQC)',
    category: 'hardware',
    categoryLabelEn: 'Hardware & Implementation',
    categoryLabelFr: 'Matériel & Exécution',
    definitionEn: 'A fault-tolerant quantum computer equipped with ~10,000+ stable logical qubits capable of running error-corrected Shor\'s algorithm to factor 4096-bit RSA keys within hours.',
    definitionFr: 'Un ordinateur quantique tolérant aux pannes doté de plus de 10 000 qubits logiques capables d\'exécuter l\'algorithme de Shor pour casser des clés RSA-4096 en quelques heures.',
    realWorldImpactEn: 'The ultimate target threshold that dictates global migration timelines (Mosca\'s Theorem: x + y > z).',
    realWorldImpactFr: 'Le seuil d\'alerte ultime qui dicte le calendrier de migration post-quantique mondiale.',
    nistStandard: 'CRQC Horizon Threshold',
    quantumResistanceLevel: 'N/A'
  },
  {
    id: 'quantum-kem',
    termEn: 'Key Encapsulation Mechanism (KEM)',
    termFr: 'Mécanisme d\'Encapsulation de Clé (KEM)',
    category: 'primitives',
    categoryLabelEn: 'Cryptographic Guarantees',
    categoryLabelFr: 'Garanties de Sécurité',
    definitionEn: 'A post-quantum key exchange protocol where a sender uses the receiver\'s public key to wrap a random symmetric key into a ciphertext. The receiver decapsulates it using their private key.',
    definitionFr: 'Un protocole d\'échange de clés post-quantique où l\'émetteur utilise la clé publique du destinataire pour chiffrer une clé symétrique aléatoire sous forme de bloc chiffré.',
    realWorldImpactEn: 'Replaces classical Diffie-Hellman (DH) and ECDH in TLS 1.3, SSH, and signal protocol messaging.',
    realWorldImpactFr: 'Remplace Diffie-Hellman (DH) et ECDH classiques dans TLS 1.3, SSH et la messagerie sécurisée.',
    nistStandard: 'FIPS 203 Standard',
    quantumResistanceLevel: 'Category 5 (256-bit)'
  },
  {
    id: 'post-quantum-hybrid',
    termEn: 'Post-Quantum Hybrid Key Exchange',
    termFr: 'Échange de Clés Hybride Post-Quantique',
    category: 'primitives',
    categoryLabelEn: 'Cryptographic Guarantees',
    categoryLabelFr: 'Garanties de Sécurité',
    definitionEn: 'A transition mechanism that combines a classical key exchange (e.g., ECDH P-256) with a post-quantum KEM (ML-KEM-1024) in a single TLS handshake. The connection remains secure even if one algorithm fails.',
    definitionFr: 'Un mécanisme de transition combinant un échange classique (ECDH) et un KEM post-quantique (ML-KEM) dans une même poignée de main TLS.',
    realWorldImpactEn: 'Currently deployed by Google Chrome, Cloudflare, and Apple iMessage (PQ3) to ensure backwards compliance during PQC migration.',
    realWorldImpactFr: 'Déployé par Google Chrome, Cloudflare et Apple iMessage (PQ3) pour garantir la sécurité pendant la transition.',
    nistStandard: 'IETF Draft Hybrid Standard',
    quantumResistanceLevel: 'Category 5 (256-bit)'
  }
];

// Interactive Glossary Modal Component
export const PqcGlossaryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'fr';
}> = ({ isOpen, onClose, lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTerms = PQC_GLOSSARY_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.termEn.toLowerCase().includes(q) || 
      item.termFr.toLowerCase().includes(q) ||
      item.definitionEn.toLowerCase().includes(q) ||
      item.definitionFr.toLowerCase().includes(q) ||
      (item.nistStandard && item.nistStandard.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', labelEn: 'All Terms', labelFr: 'Tous les Termes' },
    { id: 'math', labelEn: 'Math Foundations', labelFr: 'Mathématiques' },
    { id: 'primitives', labelEn: 'Guarantees & Properties', labelFr: 'Garanties & Propriétés' },
    { id: 'standards', labelEn: 'NIST Standards', labelFr: 'Normes NIST' },
    { id: 'threats', labelEn: 'Threat Vectors', labelFr: 'Menaces Quantiques' },
    { id: 'hardware', labelEn: 'Hardware & Execution', labelFr: 'Matériel & Exécution' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden font-sans"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  EDUCATIONAL ENCYCLOPEDIA
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                {lang === 'fr' ? 'Glossaire Interactif de Cryptographie Post-Quantique' : 'Interactive Post-Quantum Cryptography Glossary'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search & Filters Toolbar */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'fr' ? 'Rechercher un terme (ex: Lattice-based, Ciphertext Indistinguishability, Shor...)' : 'Search niche PQC term (e.g. Lattice-based cryptography, Ciphertext Indistinguishability, Shor...)'}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'fr' ? cat.labelFr : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body - Term Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[55vh] custom-scrollbar">
          {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map((term) => {
                const isSelected = selectedTermId === term.id;
                return (
                  <div
                    key={term.id}
                    onClick={() => setSelectedTermId(isSelected ? null : term.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/90 to-slate-900 border-cyan-400 shadow-xl shadow-cyan-950/60 ring-1 ring-cyan-500/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                          <span>{lang === 'fr' ? term.termFr : term.termEn}</span>
                        </h4>

                        {term.nistStandard && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300 shrink-0">
                            {term.nistStandard}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                        <Tag className="w-3 h-3 text-cyan-400" />
                        <span>{lang === 'fr' ? term.categoryLabelFr : term.categoryLabelEn}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{term.quantumResistanceLevel}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                        {lang === 'fr' ? term.definitionFr : term.definitionEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                        {lang === 'fr' ? 'Impact Post-Quantique Réel :' : 'Real-World PQC Impact:'}
                      </span>
                      <p className="text-[11px] text-slate-300 font-sans italic">
                        {lang === 'fr' ? term.realWorldImpactFr : term.realWorldImpactEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Info className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-400 font-mono">
                {lang === 'fr' ? 'Aucun terme trouvé pour votre recherche.' : 'No terms matched your search query.'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 hover:text-white"
              >
                {lang === 'fr' ? 'Réinitialiser les filtres' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Showing {filteredTerms.length} of {PQC_GLOSSARY_ITEMS.length} cryptographic terms</span>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer"
          >
            {lang === 'fr' ? 'Fermer le Glossaire' : 'Close Glossary'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Dictionary for cryptographic terms explanations
const cryptographicTerms: Record<string, { en: string; fr: string }> = {
  'ML-KEM': {
    en: 'Module-Lattice-Based Key-Encapsulation Mechanism (FIPS 203). Establishes a shared secret key using high-dimensional geometric lattice math that quantum computers cannot pick.',
    fr: 'Mécanisme d\'encapsulation de clé basé sur des réseaux modulaires (FIPS 203). Établit une clé secrète partagée grâce à la géométrie de réseaux multidimensionnels.'
  },
  'ML-DSA': {
    en: 'Module-Lattice-Based Digital Signature Algorithm (FIPS 204). Generates unforgeable digital signatures to verify identity and message integrity against quantum spoofing.',
    fr: 'Algorithme de signature numérique basé sur des réseaux modulaires (FIPS 204). Génère des signatures infalsifiables pour garantir l\'authenticité face aux ordinateurs quantiques.'
  },
  'M-LWE': {
    en: 'Module Learning With Errors: A mathematical hardness assumption based on high-dimensional vector grids that remains exponentially hard even for quantum algorithms.',
    fr: 'Module Learning With Errors : Un problème mathématique difficile basé sur des grilles vectorielles multidimensionnelles, insoluble par les ordinateurs quantiques.'
  },
  'Lattice-Based': {
    en: 'Cryptography built upon complex multi-dimensional geometric grids (lattices), replacing traditional prime factorization and discrete logarithms.',
    fr: 'Cryptographie reposant sur des réseaux géométriques multidimensionnels complexes, remplaçant la factorisation première classique.'
  },
  'TRNG': {
    en: 'True Random Number Generator: Physical silicon hardware circuit in mobile chipsets (Titan M2 / Apple SE) that generates quantum-grade random seed entropy.',
    fr: 'Générateur physique de nombres aléatoires matériel présent dans les puces sécurisées pour produire de l\'entropie pure.'
  },
  'Category 5': {
    en: 'NIST\'s highest quantum security level. Requires as much computational work to break as brute-forcing a full 256-bit symmetric AES key.',
    fr: 'Niveau de sécurité quantique maximal du NIST. Exige autant d\'effort de calcul que l\'attaque par force brute d\'une clé AES-256.'
  },
  'Non-Repudiation': {
    en: 'A mathematical guarantee ensuring that a sender cannot deny having created and signed a specific packet or handshake.',
    fr: 'Garantie mathématique empêchant l\'expéditeur de nier avoir créé et signé un message ou une transaction.'
  },
  'Encapsulation': {
    en: 'Taking a public key, producing a fresh shared secret and wrapping it into an encrypted ciphertext payload.',
    fr: 'Processus consistant à produire un secret partagé et à l\'emballer sous forme de bloc chiffré grâce à une clé publique.'
  },
  'Ephemeral Key': {
    en: 'A short-lived cryptographic key generated for a single handshake session and immediately destroyed after use.',
    fr: 'Une clé temporaire créée pour une seule session de communication et immédiatement détruite après usage.'
  }
};

// Interactive Hover Tooltip Component
const CryptographicTerm: React.FC<{ termKey: string; displayText?: string; lang: 'en' | 'fr' }> = ({ termKey, displayText, lang }) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = cryptographicTerms[termKey];
  if (!info) return <span>{displayText || termKey}</span>;

  return (
    <span 
      className="relative inline-block cursor-help border-b border-dashed border-cyan-400 text-cyan-300 font-semibold px-1 py-0.5 rounded bg-cyan-950/40 hover:bg-cyan-900/60 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      {displayText || termKey}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/60 shadow-2xl shadow-cyan-950/80 text-xs text-slate-200 leading-relaxed font-sans pointer-events-none"
          >
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold mb-1 font-mono text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{termKey} Terminology</span>
            </div>
            <p className="text-slate-200">{info[lang]}</p>
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-cyan-500/60 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export interface PqcAlgorithmBenchmark {
  id: string;
  name: string;
  family: 'KEM' | 'DSA' | 'CLASSICAL';
  nistStandard: string;
  mathFoundation: string;
  publicKeySizeB: number;
  secretKeySizeB: number;
  sigOrCiphertextSizeB: number;
  opsPerSec: number;
  handshakeLatencyMs: number;
  quantumCategory: string;
  quantumResistant: boolean;
  notesEn: string;
  notesFr: string;
}

export const PQC_BENCHMARK_DATA: PqcAlgorithmBenchmark[] = [
  {
    id: 'kyber-1024',
    name: 'ML-KEM-1024 (Kyber)',
    family: 'KEM',
    nistStandard: 'FIPS 203',
    mathFoundation: 'Module Learning With Errors (M-LWE)',
    publicKeySizeB: 1568,
    secretKeySizeB: 3168,
    sigOrCiphertextSizeB: 1568,
    opsPerSec: 185000,
    handshakeLatencyMs: 0.12,
    quantumCategory: 'Category 5 (256-bit)',
    quantumResistant: true,
    notesEn: 'NIST primary key encapsulation. Optimal speed, medium key sizes, IND-CCA2 security.',
    notesFr: 'Norme principale NIST pour l\'encapsulation. Vitesse optimale, clés de taille moyenne, sécurité IND-CCA2.'
  },
  {
    id: 'dilithium-5',
    name: 'ML-DSA-87 (Dilithium)',
    family: 'DSA',
    nistStandard: 'FIPS 204',
    mathFoundation: 'Module Learning With Errors (M-LWE)',
    publicKeySizeB: 2592,
    secretKeySizeB: 4896,
    sigOrCiphertextSizeB: 4595,
    opsPerSec: 72000,
    handshakeLatencyMs: 0.32,
    quantumCategory: 'Category 5 (256-bit)',
    quantumResistant: true,
    notesEn: 'NIST primary digital signature. Fast integer vector arithmetic without floating-point side-channels.',
    notesFr: 'Norme de signature numérique principale. Arithmétique entière rapide sans canaux cachés.'
  },
  {
    id: 'falcon-1024',
    name: 'FN-DSA-1024 (Falcon)',
    family: 'DSA',
    nistStandard: 'NIST Round 3 (FN-DSA)',
    mathFoundation: 'NTRU Lattice & Fast Fourier Sampling',
    publicKeySizeB: 1793,
    secretKeySizeB: 2305,
    sigOrCiphertextSizeB: 1280,
    opsPerSec: 115000,
    handshakeLatencyMs: 0.22,
    quantumCategory: 'Category 5 (256-bit)',
    quantumResistant: true,
    notesEn: 'Ultra-compact signatures (1,280 B) with fast verification. Requires hardware floating-point support.',
    notesFr: 'Signatures ultra-compactes (1 280 octets) avec vérification rapide. Nécessite support flottant matériel.'
  },
  {
    id: 'sphincs-256f',
    name: 'SLH-DSA-256f (SPHINCS+)',
    family: 'DSA',
    nistStandard: 'FIPS 205',
    mathFoundation: 'SHAKE-256 Hash Trees (No Lattices)',
    publicKeySizeB: 64,
    secretKeySizeB: 128,
    sigOrCiphertextSizeB: 49856,
    opsPerSec: 8500,
    handshakeLatencyMs: 2.15,
    quantumCategory: 'Category 5 (256-bit)',
    quantumResistant: true,
    notesEn: 'Failsafe hash signature scheme (0 lattice assumption). Tiny public key, but large signature payload (49.8 KB).',
    notesFr: 'Schéma de signature basé sur le hachage sans réseau. Petite clé publique, mais signature volumineuse (49,8 Ko).'
  },
  {
    id: 'rsa-4096',
    name: 'RSA-4096 (Classical)',
    family: 'CLASSICAL',
    nistStandard: 'Disallowed Post-2030',
    mathFoundation: 'Integer Prime Factorization',
    publicKeySizeB: 512,
    secretKeySizeB: 2048,
    sigOrCiphertextSizeB: 512,
    opsPerSec: 1200,
    handshakeLatencyMs: 1.85,
    quantumCategory: 'Vulnerable (0 Bits)',
    quantumResistant: false,
    notesEn: 'Classical legacy cipher. Factorable in polynomial time by Shor\'s algorithm on quantum hardware.',
    notesFr: 'Chiffre classique. Factorisable en temps polynomial par l\'algorithme de Shor.'
  },
  {
    id: 'ecdsa-p256',
    name: 'ECDH / ECDSA P-256',
    family: 'CLASSICAL',
    nistStandard: 'Disallowed Post-2030',
    mathFoundation: 'Elliptic Curve Discrete Logarithm',
    publicKeySizeB: 64,
    secretKeySizeB: 32,
    sigOrCiphertextSizeB: 64,
    opsPerSec: 42000,
    handshakeLatencyMs: 0.18,
    quantumCategory: 'Vulnerable (0 Bits)',
    quantumResistant: false,
    notesEn: 'Ultra-fast classical ECC. Discrete logarithm broken in seconds by quantum period-finding circuits.',
    notesFr: 'ECC classique très rapide. Logarithme discret brisé en quelques secondes par circuit quantique.'
  }
];

export const PqcPerformanceComparisonTool: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const [activeMetric, setActiveMetric] = useState<'opsPerSec' | 'sigOrCiphertextSizeB' | 'publicKeySizeB' | 'handshakeLatencyMs'>('opsPerSec');
  const [familyFilter, setFamilyFilter] = useState<'ALL' | 'KEM' | 'DSA' | 'CLASSICAL'>('ALL');
  const [algAId, setAlgAId] = useState<string>('kyber-1024');
  const [algBId, setAlgBId] = useState<string>('falcon-1024');

  const filteredData = PQC_BENCHMARK_DATA.filter((item) => {
    if (familyFilter === 'ALL') return true;
    return item.family === familyFilter;
  });

  const algA = PQC_BENCHMARK_DATA.find((a) => a.id === algAId) || PQC_BENCHMARK_DATA[0];
  const algB = PQC_BENCHMARK_DATA.find((a) => a.id === algBId) || PQC_BENCHMARK_DATA[2];

  const maxVal = Math.max(...filteredData.map((d) => d[activeMetric]));

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden print:hidden">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{lang === 'fr' ? 'Comparateur Interactif de Performances PQC' : 'Interactive PQC Performance Benchmarking Tool'}</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                NIST FIPS 203 / 204 / 205
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {lang === 'fr'
                ? 'Visualisez les compromis vitesse vs taille de clé / signature entre Kyber, Dilithium, Falcon, SPHINCS+ et RSA/ECC.'
                : 'Visualize speed vs key & signature payload trade-offs across Kyber, Dilithium, Falcon, SPHINCS+, and legacy RSA/ECC.'}
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'KEM', 'DSA', 'CLASSICAL'] as const).map((fam) => (
            <button
              key={fam}
              onClick={() => setFamilyFilter(fam)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                familyFilter === fam
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {fam === 'ALL' ? (lang === 'fr' ? 'Tous' : 'All') : fam}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'opsPerSec', labelEn: 'Speed (Ops/sec)', labelFr: 'Vitesse (Ops/sec)', unit: 'ops/s', icon: Zap },
          { key: 'sigOrCiphertextSizeB', labelEn: 'Signature / Ciphertext Payload', labelFr: 'Taille Signature / Ciphertext', unit: 'Bytes', icon: Lock },
          { key: 'publicKeySizeB', labelEn: 'Public Key Size', labelFr: 'Taille Clé Publique', unit: 'Bytes', icon: Key },
          { key: 'handshakeLatencyMs', labelEn: 'Handshake Latency', labelFr: 'Latence Handshake', unit: 'ms', icon: Cpu },
        ].map((m) => {
          const IconComponent = m.icon;
          const isActive = activeMetric === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key as any)}
              className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all cursor-pointer space-y-1 ${
                isActive
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-xl shadow-cyan-950/50 scale-102'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase opacity-80">
                  {lang === 'fr' ? m.labelFr : m.labelEn}
                </span>
                <IconComponent className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-xs font-bold text-white">
                {m.unit}
              </p>
            </button>
          );
        })}
      </div>

      {/* VISUAL COMPARATIVE BAR CHART */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
          <span>ALGORITHM & NIST STANDARD</span>
          <span>
            {activeMetric === 'opsPerSec' && (lang === 'fr' ? 'Plus Élevé est Meilleur ⚡' : 'Higher is Better ⚡')}
            {activeMetric === 'sigOrCiphertextSizeB' && (lang === 'fr' ? 'Charge Utile Plus Réduite 📦' : 'Lower Payload is Better 📦')}
            {activeMetric === 'publicKeySizeB' && (lang === 'fr' ? 'Clé Plus Compacte 🔑' : 'Lower is Compact 🔑')}
            {activeMetric === 'handshakeLatencyMs' && (lang === 'fr' ? 'Latence Plus Faible ⏱️' : 'Lower Latency is Faster ⏱️')}
          </span>
        </div>

        <div className="space-y-3.5">
          {filteredData.map((item) => {
            const val = item[activeMetric];
            const pct = Math.max(Math.min((val / maxVal) * 100, 100), 5);
            const isPqc = item.quantumResistant;

            return (
              <div key={item.id} className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      isPqc 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                    }`}>
                      {isPqc ? 'PQC SAFE' : 'SHOR VULNERABLE'}
                    </span>
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-500">({item.nistStandard})</span>
                  </div>

                  <span className={`font-bold ${isPqc ? 'text-cyan-400' : 'text-red-400'}`}>
                    {val.toLocaleString()} {activeMetric === 'handshakeLatencyMs' ? 'ms' : activeMetric === 'opsPerSec' ? 'ops/s' : 'B'}
                  </span>
                </div>

                {/* Animated Horizontal Bar */}
                <div className="w-full h-3.5 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-lg ${
                      !isPqc
                        ? 'bg-gradient-to-r from-red-600 to-amber-600'
                        : item.id.includes('kyber')
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                          : item.id.includes('falcon')
                            ? 'bg-gradient-to-r from-purple-500 to-cyan-400'
                            : item.id.includes('sphincs')
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HEAD-TO-HEAD ALGORITHM COMPARATOR SELECTOR */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              {lang === 'fr' ? 'Comparateur Face-à-Face (Duel Algorithmique)' : 'Head-to-Head Algorithm Comparator'}
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Select any 2 algorithms to compare</span>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 font-mono text-xs">
            <label className="text-slate-400 text-[10px] uppercase">Algorithm A:</label>
            <select
              value={algAId}
              onChange={(e) => setAlgAId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:border-cyan-400"
            >
              {PQC_BENCHMARK_DATA.map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({a.family})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 font-mono text-xs">
            <label className="text-slate-400 text-[10px] uppercase">Algorithm B:</label>
            <select
              value={algBId}
              onChange={(e) => setAlgBId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:border-cyan-400"
            >
              {PQC_BENCHMARK_DATA.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.family})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[algA, algB].map((alg, i) => {
            const otherAlg = i === 0 ? algB : algA;
            const winsSpeed = alg.opsPerSec > otherAlg.opsPerSec;
            const winsPayload = alg.sigOrCiphertextSizeB < otherAlg.sigOrCiphertextSizeB;

            return (
              <div key={alg.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    alg.quantumResistant 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {alg.nistStandard}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{alg.family}</span>
                </div>

                <h5 className="text-sm font-bold text-white font-mono">{alg.name}</h5>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {lang === 'fr' ? alg.notesFr : alg.notesEn}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Speed:</span>
                    <span className={`font-bold ${winsSpeed ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {alg.opsPerSec.toLocaleString()} ops/s {winsSpeed ? '⚡ (Fastest)' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span>Payload / Signature:</span>
                    <span className={`font-bold ${winsPayload ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {alg.sigOrCiphertextSizeB.toLocaleString()} Bytes {winsPayload ? '📦 (Compact)' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span>Public Key:</span>
                    <span className="font-bold text-cyan-300">{alg.publicKeySizeB.toLocaleString()} Bytes</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span>Quantum Category:</span>
                    <span className={`font-bold ${alg.quantumResistant ? 'text-emerald-400' : 'text-red-400'}`}>
                      {alg.quantumCategory}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export const PqcTerminologySection: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const lang: 'en' | 'fr' = language === 'fr' ? 'fr' : 'en';
  const setLang = (newLang: 'en' | 'fr') => setLanguage(newLang);
  const [activeTab, setActiveTab] = useState<'fips203' | 'fips204' | 'hardware'>('fips203');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Animated Handshake Diagram State
  const [handshakeStep, setHandshakeStep] = useState<number>(0);
  const [isPlayingDiagram, setIsPlayingDiagram] = useState<boolean>(true);
  const [diagramType, setDiagramType] = useState<'ML-KEM' | 'ML-DSA'>('ML-KEM');

  // Interactive Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // Auto-advance diagram step
  useEffect(() => {
    let timer: any;
    if (isPlayingDiagram) {
      timer = setInterval(() => {
        setHandshakeStep((prev) => (prev + 1) % 4);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlayingDiagram]);

  // Clean up speech synthesis on unmount or tab change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToRead = '';
    if (activeTab === 'fips203') {
      textToRead = lang === 'en' 
        ? "FIPS 203 Module-Lattice Key Encapsulation Mechanism. Imagine sending a locked steel safe through the mail. Even if a future quantum supercomputer intercepts the box, the lattice lock cannot be picked. It replaces classical RSA and Diffie-Hellman."
        : "FIPS 203 Mécanisme d'Encapsulation de Clé Basé sur les Réseaux. Imaginez envoyer un coffre-fort en acier verrouillé. Même si un superordinateur quantique l'intercepte, la serrure mathématique est impossible à crocheter.";
    } else if (activeTab === 'fips204') {
      textToRead = lang === 'en'
        ? "FIPS 204 Module-Lattice Digital Signature Standard. Imagine stamping an official document with a unique microscopic wax seal. ML-DSA proves beyond doubt that a message really came from you and was not tampered with."
        : "FIPS 204 Norme de Signature Numérique Basée sur les Réseaux. Imaginez apposer un sceau de cire microscopique. ML-DSA prouve sans aucun doute qu'un message provient bien de vous.";
    } else {
      textToRead = lang === 'en'
        ? "Fact-Based Device and Hardware Reality. Legacy hardware chips contain fixed accelerators for RSA and ECC. Post-quantum algorithms run via optimized C assembly inside protected memory."
        : "Réalité Matérielle des Équipements. Les puces d'ancienne génération contiennent des accélérateurs RSA et ECC. Le post-quantique s'exécute par logiciel sécurisé.";
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const quizQuestions = [
    {
      questionEn: "What is the primary function of NIST FIPS 203 (ML-KEM)?",
      questionFr: "Quelle est la fonction principale de la norme NIST FIPS 203 (ML-KEM) ?",
      optionsEn: [
        "Digital signature generation for non-repudiation",
        "Key encapsulation & session key agreement",
        "Symmetric file compression",
        "Hardware GPS encryption"
      ],
      optionsFr: [
        "Génération de signatures numériques pour la non-répudiation",
        "Encapsulation de clés & accord de clé de session",
        "Compression de fichiers symétrique",
        "Chiffrement GPS matériel"
      ],
      correctIndex: 1,
      explanationEn: "FIPS 203 (ML-KEM) is designed specifically for Key Encapsulation Mechanisms (KEM) to agree on session secrets over untrusted networks.",
      explanationFr: "FIPS 203 (ML-KEM) est conçu spécifiquement pour l'encapsulation de clés afin d'établir des secrets de session sécurisés."
    },
    {
      questionEn: "Which post-quantum standard establishes unforgeable digital signatures (FIPS 204)?",
      questionFr: "Quelle norme post-quantique établit des signatures numériques infalsifiables (FIPS 204) ?",
      optionsEn: [
        "ML-DSA (CRYSTALS-Dilithium)",
        "ML-KEM (CRYSTALS-Kyber)",
        "AES-256 GCM",
        "RSA-2048 PKCS"
      ],
      optionsFr: [
        "ML-DSA (CRYSTALS-Dilithium)",
        "ML-KEM (CRYSTALS-Kyber)",
        "AES-256 GCM",
        "RSA-2048 PKCS"
      ],
      correctIndex: 0,
      explanationEn: "FIPS 204 standardizes ML-DSA (CRYSTALS-Dilithium) for digital signatures and authentication.",
      explanationFr: "FIPS 204 normalise ML-DSA (CRYSTALS-Dilithium) pour les signatures numériques et l'authentification."
    },
    {
      questionEn: "How do current mobile devices (Titan M2, Knox, Apple SE) process FIPS 203 / 204?",
      questionFr: "Comment les appareils mobiles actuels (Titan M2, Knox, Apple SE) traitent-ils FIPS 203 / 204 ?",
      optionsEn: [
        "Through legacy hardware silicon circuits hardwired in 2018",
        "Via software assembly libraries inside protected memory + hardware TRNG seeds",
        "By forwarding raw text to cloud servers without device math",
        "Using classical RSA coprocessors without changes"
      ],
      optionsFr: [
        "Par des circuits matériels gravés en 2018",
        "Via des bibliothèques logicielles en mémoire sécurisée + graines TRNG matérielles",
        "En envoyant le texte brut sur des serveurs distants",
        "En utilisant des coprocesseurs RSA classiques sans modification"
      ],
      correctIndex: 1,
      explanationEn: "Current chips rely on software assembly implementations inside protected memory while leveraging hardware TRNG for seed entropy.",
      explanationFr: "Les puces actuelles utilisent des implémentations logicielles sécurisées tout en exploitant le TRNG matériel pour l'entropie."
    },
    {
      questionEn: "What specific quantum threat does ML-KEM defeat?",
      questionFr: "À quelle menace quantique spécifique ML-KEM fait-il face ?",
      optionsEn: [
        "Harvest Now, Decrypt Later (HNDL) attacks",
        "Wi-Fi Password Sniffing",
        "Physical SIM cloning",
        "DDoS Network Flooding"
      ],
      optionsFr: [
        "Attaques 'Récolter maintenant, Décrypter plus tard'",
        "Capture de mot de passe Wi-Fi",
        "Clonage physique de carte SIM",
        "Inondation de réseau DDoS"
      ],
      correctIndex: 0,
      explanationEn: "ML-KEM prevents adversaries from recording current encrypted traffic to decrypt when quantum computers arrive.",
      explanationFr: "ML-KEM empêche les pirates d'enregistrer le trafic chiffré aujourd'hui pour le décoder plus tard avec un ordinateur quantique."
    }
  ];

  const handleAnswerSelect = (optionIdx: number) => {
    setSelectedAnswer(optionIdx);
  };

  const handleNextQuizQuestion = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...quizAnswers, selectedAnswer];
    setQuizAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setShowQuizResults(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizAnswers([]);
    setShowQuizResults(false);
  };

  const calculateScore = () => {
    return quizAnswers.reduce((score, ansIdx, qIdx) => {
      return ansIdx === quizQuestions[qIdx].correctIndex ? score + 1 : score;
    }, 0);
  };

  const content = {
    en: {
      badge: 'Interactive Knowledge Base',
      title: 'PQC Terminology & Standards Guide',
      subtitle: 'Clear, transparent explanation of NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) post-quantum standards and device hardware integration.',
      langToggle: 'Language:',
      ttsRead: 'Read Aloud (TTS)',
      ttsStop: 'Stop Audio',
      exportPdf: 'Export PDF / Print',
      tabs: {
        fips203: 'FIPS 203 (ML-KEM)',
        fips204: 'FIPS 204 (ML-DSA)',
        hardware: 'Device & Hardware Reality'
      },
      quizTitle: 'Check Your Quantum Knowledge',
      quizSubtitle: 'Test your understanding of FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) standards.',
      diagramTitle: 'Interactive Post-Quantum Handshake Flow',
      diagramSubtitle: 'Watch how quantum-resistant mathematical payloads move between Client Enclave and Server Node.',
      diagramSteps: {
        'ML-KEM': [
          { step: 1, title: 'Lattice KeyGen', desc: 'Device A generates ML-KEM-1024 public encapsulation key (ek) and private decapsulation key (dk).' },
          { step: 2, title: 'Transmit Public Key', desc: 'Device A transmits encapsulation key (ek) over untrusted channel to Device B.' },
          { step: 3, title: 'Encapsulation & Ciphertext', desc: 'Device B encapsulates random seed into Ciphertext (c) and derives Shared Secret K.' },
          { step: 4, title: 'Decapsulation & Session Seal', desc: 'Device A decapsulates Ciphertext (c) using dk to derive identical Shared Secret K. Session Sealed!' }
        ],
        'ML-DSA': [
          { step: 1, title: 'Signing KeyGen', desc: 'Device A generates ML-DSA-87 Signing Key (sk) and Verification Key (vk).' },
          { step: 2, title: 'Lattice Sign Generation', desc: 'Device A signs payload hash with sk using Module Lattice polynomial math.' },
          { step: 3, title: 'Transmit Signature Payload', desc: 'Message payload and Lattice Signature (σ) transmitted to Device B.' },
          { step: 4, title: 'Quantum Identity Verification', desc: 'Device B validates signature (σ) against Verification Key (vk). Non-repudiation guaranteed!' }
        ]
      },
      fips203Card: {
        title: 'FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM)',
        analogyTitle: 'Analogy: The Post-Quantum Key Safe',
        analogyText: 'Imagine sending a locked steel safe through the mail. Even if a future quantum supercomputer intercepts the box, the mathematical lock (based on complex high-dimensional geometric lattices) cannot be picked.',
        purpose: 'Primary Purpose:',
        purposeText: 'Secure Key Exchange & Session Establishment. Replaces classical RSA, Diffie-Hellman, and Elliptic Curve Diffie-Hellman (ECDH).'
      },
      fips204Card: {
        title: 'FIPS 204: Module-Lattice-Based Digital Signature Standard (ML-DSA)',
        analogyTitle: 'Analogy: The Unforgeable Quantum Wax Seal',
        analogyText: 'Imagine stamping an official document with a unique microscopic wax seal. ML-DSA proves beyond doubt that a message really came from you and was not tampered with.',
        purpose: 'Primary Purpose:',
        purposeText: 'Authentication & Data Integrity. Replaces classical RSA and ECDSA (Elliptic Curve Digital Signature Algorithm).'
      },
      hardwareCard: {
        title: 'Fact-Based Device & Hardware Enclave Reality',
        badge: 'Strict Technical Transparency',
        intro: 'To maintain strict truth and technical accuracy, it is vital to understand how current mobile devices and hardware enclaves interact with Post-Quantum Cryptography:',
        points: [
          {
            heading: 'Current Hardware Chips (Titan M2, Knox, Apple Secure Enclave):',
            desc: 'Legacy hardware security elements built before 2024 contain fixed accelerators for RSA and ECC (P-256, Ed25519). They do NOT contain native silicon circuits for lattice polynomial math.'
          },
          {
            heading: 'How PQC Runs on Modern Devices:',
            desc: 'FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) run via highly optimized C/C++ and ARM NEON assembly software libraries inside protected memory.'
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
      ttsRead: 'Lecture Vocale (TTS)',
      ttsStop: 'Arrêter Audio',
      exportPdf: 'Exporter PDF / Imprimer',
      tabs: {
        fips203: 'FIPS 203 (ML-KEM)',
        fips204: 'FIPS 204 (ML-DSA)',
        hardware: 'Réalité des Équipements'
      },
      quizTitle: 'Testez Vos Connaissances Quantiques',
      quizSubtitle: 'Évaluez votre compréhension des normes FIPS 203 (ML-KEM) et FIPS 204 (ML-DSA).',
      diagramTitle: 'Schéma Animé de la Poignée de Main Post-Quantique',
      diagramSubtitle: 'Visualisez les paquets mathématiques post-quantiques s\'échangeant entre le Client et le Serveur.',
      diagramSteps: {
        'ML-KEM': [
          { step: 1, title: 'Génération de Clé Réseau', desc: 'L\'Appareil A génère la clé publique d\'encapsulation ML-KEM-1024 (ek) et la clé privée (dk).' },
          { step: 2, title: 'Transmission Clé Publique', desc: 'L\'Appareil A transmet la clé d\'encapsulation (ek) au réseau public.' },
          { step: 3, title: 'Encapsulation & Chiffrement', desc: 'L\'Appareil B encapsule la graine secrète dans le Bloc Chiffré (c) et dérive le Secret Partagé K.' },
          { step: 4, title: 'Décapsulation & Sceau', desc: 'L\'Appareil A décapsule le Bloc (c) avec dk. Secret Partagé K établi !' }
        ],
        'ML-DSA': [
          { step: 1, title: 'Génération Clé Signature', desc: 'L\'Appareil A génère la clé de signature ML-DSA-87 (sk) et la clé de vérification (vk).' },
          { step: 2, title: 'Signature Réseau Matérielle', desc: 'L\'Appareil A signe l\'empreinte du message avec sk en utilisant les polynômes de réseaux.' },
          { step: 3, title: 'Envoi du Paquet Signé', desc: 'Le message et sa signature post-quantique (σ) sont envoyés à l\'Appareil B.' },
          { step: 4, title: 'Authentification Quantique', desc: 'L\'Appareil B vérifie la signature (σ) avec la clé (vk). Non-répudiation garantie !' }
        ]
      },
      fips203Card: {
        title: 'FIPS 203 : Mécanisme d\'Encapsulation de Clé Basé sur les Réseaux (ML-KEM)',
        analogyTitle: 'Analogie : Le Coffre-Fort Post-Quantique',
        analogyText: 'Imaginez envoyer un coffre-fort en acier verrouillé par la poste. Même si un superordinateur quantique futur le pirate, la serrure mathématique (fondée sur des réseaux géométriques complexes) reste impossible à crocheter.',
        purpose: 'Objectif Principal :',
        purposeText: 'Échange de clés sécurisé et établissement de session. Remplace RSA, Diffie-Hellman et ECDH classiques.'
      },
      fips204Card: {
        title: 'FIPS 204 : Norme de Signature Numérique Basée sur les Réseaux (ML-DSA)',
        analogyTitle: 'Analogie : Le Sceau de Cire Quantique Infalsifiable',
        analogyText: 'Imaginez apposer sur un document officiel un sceau de cire microscopique unique. ML-DSA prouve sans aucun doute qu\'un message provient bien de vous et n\'a pas été altéré.',
        purpose: 'Objectif Principal :',
        purposeText: 'Authentification et Intégrité des Données. Remplace les signatures classiques RSA et ECDSA.'
      },
      hardwareCard: {
        title: 'Transparence Technique : Réalité Matérielle des Puces et Enclaves',
        badge: 'Transparence Rigoureuse',
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
  const activeSteps = current.diagramSteps[diagramType];

  return (
    <section id="pqc-terminology" className="py-12 bg-slate-950 text-slate-100 border-b border-slate-900 font-sans relative overflow-hidden print:bg-white print:text-black">
      {/* Print-Friendly Styling Block */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          #pqc-terminology { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:border-black { border-color: #000 !important; }
          .print\\:text-black { color: #000 !important; }
          .print\\:bg-white { background: white !important; }
        }
      `}</style>

      {/* Background Lighting */}
      <div className="absolute -top-10 left-1/3 w-[600px] h-[300px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none print:hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
        
        {/* Header Bar with Language, TTS & Print PDF Switchers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-cyan-500/30 backdrop-blur-md shadow-2xl print:bg-white print:border-black">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400 print:bg-gray-100 print:border-black print:text-black">
              <BookOpen className="w-7 h-7 animate-pulse print:animate-none" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{current.badge}</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 print:text-black">
                {current.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
            {/* Interactive Glossary Modal Trigger Button */}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="px-3.5 py-2 rounded-2xl text-xs font-mono font-bold flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/40 border border-cyan-400/40 active:scale-95 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-200" />
              <span>{lang === 'fr' ? 'Glossaire PQC' : 'PQC Glossary'}</span>
            </button>

            {/* Export PDF / Print Button */}
            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 rounded-2xl text-xs font-mono font-bold flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40 active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-200" />
              <span>{current.exportPdf}</span>
            </button>

            {/* Text-To-Speech (TTS) Accessibility Toggle */}
            <button
              onClick={handleToggleSpeech}
              className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold flex items-center space-x-2 transition-all border shadow-lg cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20 animate-pulse'
                  : 'bg-slate-950 text-cyan-300 border-cyan-500/40 hover:bg-cyan-950'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span>{isSpeaking ? current.ttsStop : current.ttsRead}</span>
            </button>

            {/* Language Switcher Buttons */}
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇺🇸 EN
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  lang === 'fr'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇫🇷 FR
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed print:text-black">
          {current.subtitle}
        </p>

        {/* Interactive Glossary Banner Callout */}
        <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 border border-cyan-500/40 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl print:hidden">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-cyan-900/60 border border-cyan-400/30 rounded-xl text-cyan-300 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white font-sans flex items-center gap-2">
                <span>{lang === 'fr' ? 'Besoin de Définitions Cryptographiques Approfondies ?' : 'Need Deep Cryptographic Definitions?'}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-900 border border-cyan-400/40 text-cyan-300 uppercase">
                  PQC ENCYCLOPEDIA
                </span>
              </h4>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {lang === 'fr' 
                  ? 'Explorez notre glossaire interactif définissant la cryptographie basée sur les réseaux, l\'indistingueabilité des textes chiffrés (IND-CCA2), M-LWE et l\'algorithme de Shor.' 
                  : 'Explore our interactive educational modal defining Lattice-based cryptography, Ciphertext Indistinguishability (IND-CCA2), M-LWE, and Shor\'s Algorithm.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGlossaryOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'fr' ? 'Ouvrir le Glossaire' : 'Open Glossary Modal'}</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 font-mono text-xs print:hidden">
          <button
            onClick={() => { setActiveTab('fips203'); setDiagramType('ML-KEM'); }}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'fips203'
                ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-cyan-400" />
            <span>{current.tabs.fips203}</span>
          </button>

          <button
            onClick={() => { setActiveTab('fips204'); setDiagramType('ML-DSA'); }}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
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
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hardware'
                ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>{current.tabs.hardware}</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* ANIMATED FRAMER-MOTION HANDSHAKE FLOW DIAGRAM */}
        {/* ========================================================= */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                <Zap className="w-4 h-4" />
                <span>{diagramType} Interactive Protocol Diagram</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mt-0.5">
                {current.diagramTitle}
              </h3>
            </div>

            {/* Diagram Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDiagramType(diagramType === 'ML-KEM' ? 'ML-DSA' : 'ML-KEM')}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Switch to {diagramType === 'ML-KEM' ? 'ML-DSA' : 'ML-KEM'}</span>
              </button>

              <button
                onClick={() => setIsPlayingDiagram(!isPlayingDiagram)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isPlayingDiagram
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {isPlayingDiagram ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingDiagram ? 'Pause Flow' : 'Play Flow'}</span>
              </button>
            </div>
          </div>

          {/* Visual Canvas with Device A, Packet, and Device B */}
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative space-y-8 overflow-hidden">
            
            {/* Devices Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
              
              {/* Device A: Client Enclave */}
              <div className="bg-slate-900/90 border border-cyan-500/40 p-5 rounded-2xl flex items-center space-x-4 shadow-xl">
                <div className="p-3.5 bg-cyan-950 border border-cyan-500/50 rounded-2xl text-cyan-400 shrink-0">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Device A (Client)</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">Mobile Hardware Enclave</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    TRNG Seed + <CryptographicTerm termKey="M-LWE" lang={lang} /> Math
                  </div>
                </div>
              </div>

              {/* Device B: Quantum Server Node */}
              <div className="bg-slate-900/90 border border-purple-500/40 p-5 rounded-2xl flex items-center space-x-4 shadow-xl">
                <div className="p-3.5 bg-purple-950 border border-purple-500/50 rounded-2xl text-purple-400 shrink-0">
                  <Server className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>Device B (Server)</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">Sovereign PQC Vault Node</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    <CryptographicTerm termKey="Category 5" lang={lang} /> Verification
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting Particle Line & Packet Animation */}
            <div className="relative py-2 hidden md:block">
              <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 w-full opacity-30" />
              </div>

              {/* Animated Motion Packet */}
              <motion.div
                key={`${diagramType}-${handshakeStep}`}
                initial={{ x: handshakeStep % 2 === 0 ? '5%' : '85%' }}
                animate={{ x: handshakeStep % 2 === 0 ? '85%' : '5%' }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                className="absolute top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/50 border-2 border-white flex items-center justify-center font-mono text-[10px] font-black z-20"
              >
                <Zap className="w-4 h-4 fill-slate-950 animate-bounce" />
              </motion.div>
            </div>

            {/* Step Stepper Progress Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {activeSteps.map((stepObj, idx) => {
                const isActive = handshakeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => { setHandshakeStep(idx); setIsPlayingDiagram(false); }}
                    className={`p-3 rounded-xl text-left border font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-950/60 scale-102'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span>STEP 0{stepObj.step}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                    </div>
                    <div className="text-xs font-bold text-white mt-1 truncate">{stepObj.title}</div>
                  </button>
                );
              })}
            </div>

            {/* Current Active Step Details Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={handshakeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1"
              >
                <div className="text-cyan-400 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Phase {activeSteps[handshakeStep].step}: {activeSteps[handshakeStep].title}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {activeSteps[handshakeStep].desc}
                </p>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Tab 1: FIPS 203 ML-KEM Card with Scroll-Trigger Pulse */}
        {activeTab === 'fips203' && (
          <motion.div
            initial={{ opacity: 0.85, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: [0.96, 1.015, 1] }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-cyan-950/50 relative overflow-hidden print:bg-white print:border-black"
          >
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold print:bg-gray-100 print:text-black print:border-black">
                NIST FIPS 203
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white print:text-black">
                {current.fips203Card.title}
              </h3>
            </div>

            {/* Analogy Box */}
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2 print:bg-gray-50 print:border-black">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 print:text-black">
                <Sparkles className="w-4 h-4" />
                <span>{current.fips203Card.analogyTitle}</span>
              </h4>
              <p className="text-xs md:text-sm text-cyan-100/90 leading-relaxed print:text-black">
                {current.fips203Card.analogyText}
              </p>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase print:text-black">
                {current.fips203Card.purpose}
              </h4>
              <p className="text-sm text-slate-200 font-medium print:text-black">
                {current.fips203Card.purposeText}
              </p>
            </div>

            {/* Steps & Key terms */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase print:text-black">
                How <CryptographicTerm termKey="ML-KEM" lang={lang} /> Works:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 print:bg-gray-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-slate-300 leading-relaxed print:text-black">
                    Derived from CRYSTALS-Kyber, standardized as FIPS 203 using <CryptographicTerm termKey="Lattice-Based" lang={lang} /> math.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 print:bg-gray-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-slate-300 leading-relaxed print:text-black">
                    Generates an <CryptographicTerm termKey="Ephemeral Key" lang={lang} /> pair for single-session key exchange over untrusted networks.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 print:bg-gray-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-slate-300 leading-relaxed print:text-black">
                    ML-KEM-1024 provides <CryptographicTerm termKey="Category 5" lang={lang} /> security equivalent to AES-256 resistance.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 print:bg-gray-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-slate-300 leading-relaxed print:text-black">
                    Uses key <CryptographicTerm termKey="Encapsulation" lang={lang} /> to defeat "Harvest Now, Decrypt Later" quantum attacks.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: FIPS 204 ML-DSA Card with Scroll-Trigger Pulse */}
        {activeTab === 'fips204' && (
          <motion.div
            initial={{ opacity: 0.85, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: [0.96, 1.015, 1] }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-purple-950/50 relative overflow-hidden print:bg-white print:border-black"
          >
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold print:bg-gray-100 print:text-black print:border-black">
                NIST FIPS 204
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white print:text-black">
                {current.fips204Card.title}
              </h3>
            </div>

            {/* Analogy Box */}
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2 print:bg-gray-50 print:border-black">
              <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2 print:text-black">
                <Sparkles className="w-4 h-4" />
                <span>{current.fips204Card.analogyTitle}</span>
              </h4>
              <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed print:text-black">
                {current.fips204Card.analogyText}
              </p>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase print:text-black">
                {current.fips204Card.purpose}
              </h4>
              <p className="text-sm text-slate-200 font-medium print:text-black">
                {current.fips204Card.purposeText}
              </p>
            </div>

            {/* Steps & Key terms */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase print:text-black">
                How <CryptographicTerm termKey="ML-DSA" lang={lang} /> Works:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 print:bg-gray-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-slate-300 leading-relaxed print:text-black">
                    Derived from CRYSTALS-Dilithium, standardized as FIPS 204 using <CryptographicTerm termKey="Lattice-Based" lang={lang} /> vector grids.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 print:bg-gray-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-slate-300 leading-relaxed print:text-black">
                    Generates unforgeable digital signatures for audit logs and real-time transaction handshakes.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 print:bg-gray-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-slate-300 leading-relaxed print:text-black">
                    ML-DSA-87 guarantees maximum <CryptographicTerm termKey="Category 5" lang={lang} /> protection against quantum forgery.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 print:bg-gray-50 print:border-black">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-slate-300 leading-relaxed print:text-black">
                    Ensures strict <CryptographicTerm termKey="Non-Repudiation" lang={lang} /> so sender identities cannot be spoofed by quantum algorithms.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Fact-Based Device Hardware Reality */}
        {activeTab === 'hardware' && (
          <motion.div
            initial={{ opacity: 0.85, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: [0.96, 1.015, 1] }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-emerald-950/50 print:bg-white print:border-black"
          >
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold print:bg-gray-100 print:text-black print:border-black">
                {current.hardwareCard.badge}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white print:text-black">
                {current.hardwareCard.title}
              </h3>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed print:text-black">
              {current.hardwareCard.intro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {current.hardwareCard.points.map((pt, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 print:bg-gray-50 print:border-black">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs print:text-black">
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span>{pt.heading}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed print:text-black">
                    {pt.desc.includes('TRNG') ? (
                      <>
                        Devices combine hardware enclave seed generation (<CryptographicTerm termKey="TRNG" lang={lang} />) with software-based lattice encapsulation.
                      </>
                    ) : (
                      pt.desc
                    )}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interactive PQC Performance Comparison Tool (Speed vs Key Size vs NIST Standard) */}
        <PqcPerformanceComparisonTool lang={lang} />

        {/* Side-by-Side Comparison Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl print:bg-white print:border-black">
          <h3 className="text-base font-bold text-white flex items-center gap-2 print:text-black">
            <Binary className="w-5 h-5 text-cyan-400 print:text-black" />
            <span>{current.tableTitle}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono print:text-black print:border-black">
                  {current.tableHeaders.map((h, idx) => (
                    <th key={idx} className="p-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-black">
                {current.tableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50 transition-colors">
                    <td className="p-3 font-bold text-slate-300 font-mono print:text-black">{row[0]}</td>
                    <td className="p-3 text-cyan-300 print:text-black">
                      {row[1].includes('M-LWE') ? <CryptographicTerm termKey="M-LWE" displayText={row[1]} lang={lang} /> : row[1]}
                    </td>
                    <td className="p-3 text-purple-300 print:text-black">
                      {row[2].includes('M-LWE') ? <CryptographicTerm termKey="M-LWE" displayText={row[2]} lang={lang} /> : row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE 'CHECK YOUR QUANTUM KNOWLEDGE' QUIZ */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 border border-indigo-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden print:hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-950 border border-indigo-500/50 rounded-2xl text-indigo-400">
                <Award className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{current.quizTitle}</span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700 rounded-lg">
                    FIPS KNOWLEDGE QUIZ
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {current.quizSubtitle}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-indigo-300 font-bold bg-indigo-950/80 px-3.5 py-1.5 rounded-xl border border-indigo-500/30">
              Question {currentQuizIndex + 1} of {quizQuestions.length}
            </div>
          </div>

          {!showQuizResults ? (
            <div className="space-y-6 font-sans">
              
              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                  Question {currentQuizIndex + 1}
                </span>
                <h4 className="text-base md:text-lg font-bold text-slate-100">
                  {lang === 'fr' ? quizQuestions[currentQuizIndex].questionFr : quizQuestions[currentQuizIndex].questionEn}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {(lang === 'fr' ? quizQuestions[currentQuizIndex].optionsFr : quizQuestions[currentQuizIndex].optionsEn).map((optText, optIdx) => {
                  const isSelected = selectedAnswer === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerSelect(optIdx)}
                      className={`p-4 rounded-2xl border text-left font-sans text-xs md:text-sm transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-400 text-white shadow-xl shadow-indigo-950/60 scale-101'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-medium">{optText}</span>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-indigo-400 bg-indigo-500 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuizQuestion}
                  disabled={selectedAnswer === null}
                  className={`px-6 py-3 rounded-2xl font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    selectedAnswer !== null
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-slate-950 shadow-xl shadow-indigo-900/50 active:scale-95'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <span>{currentQuizIndex + 1 === quizQuestions.length ? (lang === 'fr' ? 'Voir le Résultat 🏆' : 'Submit Quiz 🏆') : (lang === 'fr' ? 'Question Suivante ➡️' : 'Next Question ➡️')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Quiz Score Results Card */
            <div className="text-center py-6 space-y-6 font-sans animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-950 border-2 border-indigo-500/60 p-4 flex items-center justify-center text-indigo-400 shadow-2xl">
                <Award className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-white">
                  {calculateScore() === quizQuestions.length 
                    ? (lang === 'fr' ? 'Score Parfait ! Expert Post-Quantique 🛡️' : 'Perfect Score! Quantum Master 🛡️')
                    : (lang === 'fr' ? 'Quiz Terminé !' : 'Quiz Complete!')}
                </h4>
                <p className="text-sm font-mono text-indigo-300">
                  {lang === 'fr' 
                    ? `Vous avez obtenu ${calculateScore()} sur ${quizQuestions.length} réponses correctes.`
                    : `You scored ${calculateScore()} out of ${quizQuestions.length} correct responses.`}
                </p>
              </div>

              {/* Explanations Recap */}
              <div className="space-y-3 text-left max-w-2xl mx-auto font-sans text-xs">
                {quizQuestions.map((q, idx) => {
                  const userAns = quizAnswers[idx];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div key={idx} className={`p-4 rounded-2xl border ${
                      isCorrect ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-red-950/40 border-red-500/40 text-red-200'
                    }`}>
                      <div className="flex items-center space-x-2 font-bold mb-1">
                        {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        <span>Q{idx + 1}: {lang === 'fr' ? q.questionFr : q.questionEn}</span>
                      </div>
                      <p className="text-[11px] opacity-90 pl-6 leading-relaxed">
                        {lang === 'fr' ? q.explanationFr : q.explanationEn}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-3 rounded-2xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 font-mono text-xs font-bold inline-flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Recommencer le Quiz' : 'Retake Quiz'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Interactive Glossary Modal */}
      <AnimatePresence>
        {isGlossaryOpen && (
          <PqcGlossaryModal
            isOpen={isGlossaryOpen}
            onClose={() => setIsGlossaryOpen(false)}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
