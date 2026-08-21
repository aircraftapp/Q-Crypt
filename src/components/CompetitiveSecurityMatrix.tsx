import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Lock, 
  Cpu, 
  Check, 
  X, 
  AlertTriangle, 
  Layers, 
  FileText, 
  Download, 
  Eye, 
  Key, 
  Server, 
  Binary, 
  Sparkles, 
  ChevronRight, 
  Info, 
  HelpCircle, 
  Radio, 
  Zap, 
  ShieldX,
  Database,
  Smartphone,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';

type MessengerId = 'qcrypt' | 'signal' | 'telegram' | 'whatsapp';
type ComparisonCategory = 'ALL' | 'PRIMITIVES' | 'METADATA' | 'FIPS_HARDWARE' | 'COMPLIANCE';
type EvaluationGrade = 'PQC_LEVEL_5' | 'OPTIMAL' | 'SECURE' | 'HYBRID' | 'PARTIAL' | 'CLASSICAL' | 'VULNERABLE' | 'PROPRIETARY' | 'SERVER_PLAINTEXT' | 'META_TELEMETRY';

interface MatrixRow {
  id: string;
  category: 'PRIMITIVES' | 'METADATA' | 'FIPS_HARDWARE' | 'COMPLIANCE';
  title: string;
  description: string;
  qcrypt: {
    value: string;
    grade: EvaluationGrade;
    detail: string;
    fipsStandard?: string;
  };
  signal: {
    value: string;
    grade: EvaluationGrade;
    detail: string;
  };
  telegram: {
    value: string;
    grade: EvaluationGrade;
    detail: string;
  };
  whatsapp: {
    value: string;
    grade: EvaluationGrade;
    detail: string;
  };
}

export const CompetitiveSecurityMatrix: React.FC = () => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const isFr = language === 'fr';

  const [selectedView, setSelectedView] = useState<'ALL' | '1V1'>('ALL');
  const [activeCompetitor, setActiveCompetitor] = useState<MessengerId>('signal');
  const [activeCategory, setActiveCategory] = useState<ComparisonCategory>('ALL');
  const [isHndlSimulationActive, setIsHndlSimulationActive] = useState<boolean>(false);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const messengerMetadata = {
    qcrypt: {
      name: 'Q-CRYPT',
      tagline: isFr ? 'Bouclier Post-Quantique sur Réseaux Euclidiens (NIST FIPS 203/204)' : 'Post-Quantum Lattice Shield (NIST FIPS 203/204)',
      badge: isFr ? 'Sécurisé NIST Niveau 5' : 'NIST Level 5 Safe',
      badgeColor: 'text-cyan-300 bg-cyan-950/90 border-cyan-500/60',
      pqcScore: 100,
      metadataScore: 100,
      hardwareScore: 98,
      overallRank: isFr ? 'Rang 0 — Grade Défense Post-Quantique' : 'Tier 0 — Post-Quantum Defense Grade'
    },
    signal: {
      name: 'Signal',
      tagline: isFr ? 'Double Ratchet Classique + PQXDH Hybride 1:1' : 'Classical Double Ratchet + PQXDH 1:1 Hybrid',
      badge: isFr ? 'Hybride (1:1 Uniquement)' : 'Hybrid (1:1 Only)',
      badgeColor: 'text-blue-300 bg-blue-950/90 border-blue-500/60',
      pqcScore: 45,
      metadataScore: 82,
      hardwareScore: 35,
      overallRank: isFr ? 'Rang 2 — Confidentialité Classique (PQC Partiel)' : 'Tier 2 — Classical Privacy (Partial PQC)'
    },
    telegram: {
      name: 'Telegram',
      tagline: isFr ? 'MTProto 2.0 (Texte en Clair dans le Cloud par Défaut)' : 'MTProto 2.0 (Cloud Plaintext by Default)',
      badge: isFr ? 'Non Chiffré par Défaut' : 'Unencrypted by Default',
      badgeColor: 'text-rose-300 bg-rose-950/90 border-rose-500/60',
      pqcScore: 0,
      metadataScore: 20,
      hardwareScore: 10,
      overallRank: isFr ? 'Rang 4 — Stockage Cloud Centralisé' : 'Tier 4 — Centralized Cloud Storage'
    },
    whatsapp: {
      name: 'WhatsApp',
      tagline: isFr ? 'Fork Protocole Signal (Télémétrie Meta & Sauvegardes Cloud)' : 'Signal Protocol Fork (Meta Telemetry & Cloud Backups)',
      badge: isFr ? 'ECC Classique + Graphe Meta' : 'Classical ECC + Meta Graph',
      badgeColor: 'text-amber-300 bg-amber-950/90 border-amber-500/60',
      pqcScore: 0,
      metadataScore: 35,
      hardwareScore: 25,
      overallRank: isFr ? 'Rang 3 — Messagerie Commerciale ECC' : 'Tier 3 — Commercial ECC Messenger'
    }
  };

  const matrixData: MatrixRow[] = [
    // 1. UNDERLYING CRYPTOGRAPHIC PRIMITIVES
    {
      id: 'kem',
      category: 'PRIMITIVES',
      title: isFr ? 'Mécanisme d\'Encapsulation de Clé (KEM)' : 'Key Encapsulation Mechanism (KEM)',
      description: isFr 
        ? 'L\'algorithme mathématique établissant les clés de session partagées entre les terminaux communicants.'
        : 'The mathematical algorithm establishing shared session keys between communicating endpoints.',
      qcrypt: {
        value: 'ML-KEM-1024 (Kyber-1024)',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Algorithme sur réseaux euclidiens normalisé NIST FIPS 203 Niveau 5 (Module-LWE). Immunité totale face à l\'algorithme de Shor.'
          : 'Standardized NIST FIPS 203 Level 5 lattice algorithm based on Module Learning With Errors (M-LWE). Infinite Shor immunity.',
        fipsStandard: 'NIST FIPS 203'
      },
      signal: {
        value: 'PQXDH (X25519 + Kyber-768 Hybrid)',
        grade: 'HYBRID',
        detail: isFr 
          ? 'Hybride Kyber-768 pour les handshakes 1:1 initiaux uniquement. Les groupes et ratchets actifs dépendent toujours de Curve25519 classique.'
          : 'Hybrid Kyber-768 for initial 1:1 handshakes only. Group chats and active ratchets still rely on classical Curve25519.'
      },
      telegram: {
        value: isFr ? 'Diffie-Hellman Classique (2048-bit)' : 'Classical Diffie-Hellman (2048-bit)',
        grade: 'VULNERABLE',
        detail: isFr 
          ? 'Exponentiation modulaire classique. Uniquement actif dans les « Échanges Secrets » optionnels. Les conversations régulières n\'ont aucun KEM de bout en bout.'
          : 'Classical modular exponentiation. Only enabled in optional "Secret Chats". Regular chats lack end-to-end KEM.'
      },
      whatsapp: {
        value: isFr ? 'Curve25519 Classique (ECDH)' : 'Classical Curve25519 (ECDH)',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'Courbes elliptiques Diffie-Hellman classiques. Totalement cassable par l\'algorithme de Shor sur un ordinateur quantique de 2 330 qubits.'
          : 'Classical Elliptic Curve Diffie-Hellman. Completely broken by Shor\'s algorithm on a 2,330-qubit quantum processor.'
      }
    },
    {
      id: 'signatures',
      category: 'PRIMITIVES',
      title: isFr ? 'Signatures Numériques & Clés d\'Identité' : 'Digital Signatures & Identity Keys',
      description: isFr 
        ? 'Schémas de signature asymétrique authentifiant les terminaux, les jetons de session et les certificats publics.'
        : 'Asymmetric signature schemes authenticating devices, session tokens, and public identity certificates.',
      qcrypt: {
        value: 'ML-DSA-87 & SLH-DSA-256',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'NIST FIPS 204 (Dilithium) & FIPS 205 (SPHINCS+ basé sur hachages sans état). Résistant à tous les vecteurs de falsification quantique.'
          : 'NIST FIPS 204 (Dilithium) & FIPS 205 (SPHINCS+ stateless hash-based signatures). Resistant against all quantum forgery vectors.',
        fipsStandard: 'NIST FIPS 204 / 205'
      },
      signal: {
        value: isFr ? 'Ed25519 Classique (Courbe Edwards)' : 'Classical Ed25519 (Edwards Curve)',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'Signatures classiques Ed25519. Un adversaire quantique peut forger les clés d\'identité et intercepter rétroactivement les communications.'
          : 'Classical Ed25519 signatures. Quantum adversaries can forge identity keys and MITM historical communication.'
      },
      telegram: {
        value: isFr ? 'RSA / SHA-256 Propriétaire' : 'Proprietary RSA / SHA-256',
        grade: 'PROPRIETARY',
        detail: isFr 
          ? 'Validation de signature serveur propriétaire. N\'implémente aucun schéma de signature post-quantique public.'
          : 'Proprietary server signature validation. Does not implement public post-quantum signature schemes.'
      },
      whatsapp: {
        value: isFr ? 'Ed25519 Classique (PKI Meta)' : 'Classical Ed25519 (Meta PKI)',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'Courbes Edwards 256-bit classiques signées par l\'autorité de certification WhatsApp centralisée. Vulnérable à la falsification CRQC.'
          : 'Classical 256-bit Edwards curves signed by centralized WhatsApp certificate authority. Vulnerable to CRQC forgery.'
      }
    },
    {
      id: 'symmetric_cipher',
      category: 'PRIMITIVES',
      title: isFr ? 'Chiffrement Symétrique des Données' : 'Symmetric Payload Encryption',
      description: isFr 
        ? 'Chiffrement en vrac pour les messages texte, pièces jointes, flux audio et vidéo en transit et au repos.'
        : 'Bulk data cipher encrypting text messages, attachments, audio, and video streams in transit and at rest.',
      qcrypt: {
        value: 'AES-256-GCM + ChaCha20-Poly1305',
        grade: 'OPTIMAL',
        detail: isFr 
          ? 'Clés symétriques 256-bit avec accélération matérielle. L\'algorithme de Grover réduit la sécurité à 128 bits — computationnellement inviolable.'
          : '256-bit symmetric keys with hardware acceleration. Grover\'s algorithm reduces security to 128 bits—still computationally unbreakable.',
        fipsStandard: 'FIPS 197'
      },
      signal: {
        value: 'AES-256-CBC / HMAC-SHA256',
        grade: 'SECURE',
        detail: isFr 
          ? 'Standard AES-256-CBC avec authentification HMAC. Bonne protection Grover, mais les clés dérivent de ratchets classiques.'
          : 'Standard AES-256-CBC with HMAC authentication. Adequate Grover protection, but payload keys derive from classical ratchets.'
      },
      telegram: {
        value: isFr ? 'AES-256-IGE (MTProto Propriétaire)' : 'AES-256-IGE (Proprietary MTProto)',
        grade: 'PROPRIETARY',
        detail: isFr 
          ? 'Mode Infinite Garble Extension (IGE), non standardisé par le NIST. Le stockage des clés côté serveur permet le déchiffrement serveur.'
          : 'Infinite Garble Extension (IGE) mode, non-standardized by NIST. Server-side key storage allows server decryption.'
      },
      whatsapp: {
        value: 'AES-256-CBC / HMAC-SHA256',
        grade: 'SECURE',
        detail: isFr 
          ? 'Standard AES-256-CBC. Cependant, les sauvegardes cloud sur Google Drive/iCloud sont déchiffrables via le séquestre des clés.'
          : 'Standard AES-256-CBC. However, cloud backups on Google Drive/iCloud can be decrypted via backup key escrow.'
      }
    },
    {
      id: 'entropy_source',
      category: 'PRIMITIVES',
      title: isFr ? 'Génération d\'Entropie Cryptographique' : 'Cryptographic Entropy Generation',
      description: isFr 
        ? 'Source physique ou mathématique de véritable aléa pour la génération de clés de session éphémères et de nonces.'
        : 'Physical or mathematical source of true randomness for generating ephemeral session keys and nonces.',
      qcrypt: {
        value: isFr ? 'QRNG / TRNG Quantique Optique du Vide' : 'Optical Quantum Vacuum QRNG / TRNG',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Couplage direct au bruit de grenaille quantique et avalanche de diodes (vérifié NIST SP 800-90B, Entropie de Shannon : 7,999 bits/octet).'
          : 'Direct hardware coupling to quantum shot noise and avalanche diode breakdown (NIST SP 800-90B verified, Shannon Entropy: 7.999 bits/byte).',
        fipsStandard: 'NIST SP 800-90B'
      },
      signal: {
        value: isFr ? 'Pseudo-Aléatoire OS (/dev/urandom)' : 'OS Pseudo-Random (/dev/urandom)',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'Dépend du CSPRNG de l\'OS et de la réserve d\'entropie du noyau Linux. Vulnérable aux réinitialisations d\'état de VM.'
          : 'Relies on OS software CSPRNG and Linux kernel entropy pool. Susceptible to VM state reset or low-entropy containers.'
      },
      telegram: {
        value: isFr ? 'PRNG Mixte Client-Serveur' : 'Client-Server Mixed PRNG',
        grade: 'PROPRIETARY',
        detail: isFr 
          ? 'Le serveur contribue à l\'entropie de session client, créant un vecteur centralisé pour des graines prédictibles.'
          : 'Server contributes entropy to client session initialization, creating a centralized vector for predictable seeds.'
      },
      whatsapp: {
        value: isFr ? 'Pseudo-Aléatoire OS (iOS/Android CSPRNG)' : 'OS Pseudo-Random (iOS/Android CSPRNG)',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'RNG cryptographique standard de l\'OS mobile. Aucune vérification d\'entropie quantique attestée par matériel.'
          : 'Standard mobile OS cryptographic RNG. No hardware-attested quantum entropy verification.'
      }
    },

    // 2. METADATA PRIVACY & ZERO-KNOWLEDGE
    {
      id: 'hndl_resilience',
      category: 'METADATA',
      title: isFr ? 'Immunité contre la Capture Quantique (HNDL)' : 'Harvest-Now-Decrypt-Later (HNDL) Immunity',
      description: isFr 
        ? 'Capacité à résister aux écoutes passives sur fibres optiques où les flux chiffrés sont stockés pour un déchiffrement quantique futur.'
        : 'Ability to withstand nation-state fiber tapping where ciphertext is stored today for decryption by future quantum computers.',
      qcrypt: {
        value: isFr ? 'Immunité Totale à 100% sur Tout le Spectre' : '100% Full Spectrum Immunity',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Tout le trafic (1:1, salons de groupe, fichiers, audio et ratchets) est chiffré sous réseaux NIST FIPS 203 Niveau 5. 0% de risque HNDL.'
          : 'All traffic (1:1, group rooms, file payloads, audio streams, and ratchets) is encrypted under NIST FIPS 203 Level 5 lattices. 0% HNDL risk.',
        fipsStandard: 'ANSSI & NIST FIPS 203'
      },
      signal: {
        value: isFr ? 'Partiel (Texte 1:1 Uniquement)' : 'Partial (1:1 Text Only)',
        grade: 'PARTIAL',
        detail: isFr 
          ? 'PQXDH protège le texte 1:1 initial. Les groupes, flux audio/vidéo WebRTC et signatures d\'identité restent vulnérables au rétro-déchiffrement.'
          : 'PQXDH protects initial 1:1 text sessions. Group chats, voice/video WebRTC streams, and identity signatures remain vulnerable to retro-decryption.'
      },
      telegram: {
        value: isFr ? '0% — Accès Immédiat pour l\'Adversaire' : '0% — Immediate Adversary Access',
        grade: 'VULNERABLE',
        detail: isFr 
          ? 'Les échanges cloud sont stockés en clair sur les serveurs Telegram. Tout adversaire ayant accès aux serveurs lit l\'intégralité des archives.'
          : 'Cloud chats are stored in plaintext on Telegram servers. Adversaries with subpoena or quantum server intrusion can read entire historical archives.'
      },
      whatsapp: {
        value: isFr ? '0% — Entièrement Vulnérable au CRQC' : '0% — Fully Vulnerable to CRQC',
        grade: 'VULNERABLE',
        detail: isFr 
          ? 'Tous les handshakes ECDH peuvent être rétroactivement factorisés par l\'algorithme de Shor. Les données de fibre optique interceptées seront déchiffrées.'
          : 'All ECDH handshakes can be retroactively factored by Shor\'s algorithm. Intercepted telecom fiber data will be decrypted completely.'
      }
    },
    {
      id: 'message_storage',
      category: 'METADATA',
      title: isFr ? 'Stockage Côté Serveur des Messages & Pièces Jointes' : 'Server-Side Message & Attachment Storage',
      description: isFr 
        ? 'Gestion des messages et fichiers partagés lorsqu\'ils transitent par les serveurs de relais intermédiaires.'
        : 'How messages and shared files are handled once routed through intermediate relay servers.',
      qcrypt: {
        value: isFr ? 'Relais RAM Éphémère Zéro-Jour Uniquement' : '0-Day Ephemeral RAM Relay Only',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Zéro écriture sur disque. Les paquets résident exclusivement dans des tampons RAM isolés pendant <500ms avant remise à zéro automatique.'
          : 'Zero disk writes. Packets exist solely in volatility-isolated RAM buffers for <500ms before auto-zeroization. No central database of messages.',
        fipsStandard: 'Zero-Knowledge SLA'
      },
      signal: {
        value: isFr ? 'File d\'Attente Éphémère Chiffrée' : 'Encrypted Ephemeral Queue',
        grade: 'OPTIMAL',
        detail: isFr 
          ? 'Messages mis en file d\'attente en RAM jusqu\'à distribution, puis purgés des serveurs. Forte posture de divulgation nulle.'
          : 'Messages queued in RAM until delivery, then purged from servers. Strong zero-knowledge server posture.'
      },
      telegram: {
        value: isFr ? 'Stockage Permanent en Base Cloud' : 'Permanent Cloud Database Storage',
        grade: 'SERVER_PLAINTEXT',
        detail: isFr 
          ? 'Tous les échanges, médias, notes vocales et historiques de groupe par défaut sont stockés en clair ou avec clés gérées par le serveur.'
          : 'All default chats, media, voice notes, and group histories are permanently stored on Telegram servers in plaintext or server-managed keys.'
      },
      whatsapp: {
        value: isFr ? 'Séquestre de Sauvegardes Cloud (iCloud/Google)' : 'Cloud Backup Escrow (iCloud/Google)',
        grade: 'META_TELEMETRY',
        detail: isFr 
          ? 'Messages en file jusqu\'à livraison. Cependant, les historiques sont régulièrement sauvegardés non chiffrés ou avec séquestre de clés chez Apple/Google.'
          : 'Messages queued until delivered. However, user chat histories are routinely backed up unencrypted or with cloud-stored escrow keys.'
      }
    },
    {
      id: 'graph_telemetry',
      category: 'METADATA',
      title: isFr ? 'Graphe Social & Télémétrie des Métadonnées' : 'Social Graph & Metadata Telemetry',
      description: isFr 
        ? 'Journalisation des contacts, horodatages, fréquences d\'échange, adresses IP et synchronisation des carnets d\'adresses.'
        : 'Logging of who talks to whom, timestamps, message frequencies, IP addresses, and contact book synchronization.',
      qcrypt: {
        value: isFr ? 'Mixnet Anonymisé + Trafic de Couverture' : 'Anonymized Mixnet + Cover Traffic',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Mixnet en oignon multi-sauts avec délais de Poisson et injection de trafic factice. Zéro liaison d\'adresse IP ou de graphe social.'
          : 'Multi-hop onion mixnet with Poisson packet timing delays and dummy cover traffic injection. Zero social graph or IP address linkage.',
        fipsStandard: 'Tor/Nym Mixnet'
      },
      signal: {
        value: isFr ? 'Expéditeur Masqué (Enclave SGX)' : 'Sealed Sender (SGX Enclave)',
        grade: 'OPTIMAL',
        detail: isFr 
          ? 'Masque l\'identité et l\'IP de l\'expéditeur au serveur via Sealed Sender. L\'enregistrement requiert cependant un numéro de téléphone vérifié.'
          : 'Hides sender IP/identity from server using Sealed Sender. However, user registration mandates a verified phone number.'
      },
      telegram: {
        value: isFr ? 'Journalisation Extensive des Métadonnées' : 'Extensive Metadata Logging',
        grade: 'SERVER_PLAINTEXT',
        detail: isFr 
          ? 'Graphe social complet, carnets de contacts, empreintes d\'appareils et IP utilisateurs sont indexés dans les bases de données centrales.'
          : 'Full social graph, contact books, device fingerprints, and user IP addresses are indexed on central server databases.'
      },
      whatsapp: {
        value: isFr ? 'Graphe Comportemental & Télémétrie Meta' : 'Meta Behavioral Graph & Telemetry',
        grade: 'META_TELEMETRY',
        detail: isFr 
          ? 'Partage la fréquence de communication, les graphes de contact, horodatages, télémétrie de l\'appareil et géolocalisation avec la régie publicitaire Meta.'
          : 'Shares communication frequency, contact graphs, timestamps, device telemetry, and location metadata with Meta enterprise ad networks.'
      }
    },

    // 3. HARDWARE SECURITY & FIPS 140-3
    {
      id: 'hsm_support',
      category: 'FIPS_HARDWARE',
      title: isFr ? 'Module de Sécurité Matérielle (HSM) FIPS 140-3' : 'FIPS 140-3 Hardware Security Module (HSM)',
      description: isFr 
        ? 'Périmètre cryptographique physique protégeant les clés maîtresses de signature et la racine de confiance contre les attaques physiques.'
        : 'Physical cryptographic boundary protecting master signing keys and root of trust against software and physical probing.',
      qcrypt: {
        value: isFr ? 'Support HSM FIPS 140-3 Niveau 3 & Niveau 4' : 'FIPS 140-3 Level 3 & Level 4 HSM Support',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Pont PKCS#11 natif vers Nitrokey NetHSM, YubiHSM2, Thales Luna et StrongBox avec enveloppe physique anti-intrusion active.'
          : 'Native PKCS#11 bridge to Nitrokey NetHSM, YubiHSM2, Thales Luna, and StrongBox with active physical wire mesh anti-tamper envelope.',
        fipsStandard: 'FIPS 140-3 Level 3/4'
      },
      signal: {
        value: isFr ? 'Keystore / Keychain Standard de l\'OS' : 'Standard OS Keystore / Keychain',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'Dépend du Keychain iOS / KeyStore Android standard. Ne supporte pas les modules matériels FIPS 140-3 dédiés d\'entreprise.'
          : 'Relies on standard iOS Keychain / Android KeyStore. Does not support enterprise dedicated FIPS 140-3 hardware modules.'
      },
      telegram: {
        value: isFr ? 'Mémoire Logicielle / Base SQLite' : 'Software Memory / SQLite DB',
        grade: 'VULNERABLE',
        detail: isFr 
          ? 'Les clients desktop et web stockent les clés directement dans des bases SQLite logicielles sans protection de barrière matérielle.'
          : 'Desktop and web clients store keys directly in software SQLite databases without dedicated hardware boundary protection.'
      },
      whatsapp: {
        value: isFr ? 'TEE Mobile Standard' : 'Standard Mobile OS TEE',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'Utilise l\'ARM TrustZone / Apple Secure Enclave de base. Aucune intégration HSM d\'entreprise ni garde de clé racine souveraine.'
          : 'Utilizes basic mobile ARM TrustZone / Apple Secure Enclave. No external enterprise HSM integration or root key custody.'
      }
    },
    {
      id: 'key_extraction',
      category: 'FIPS_HARDWARE',
      title: isFr ? 'Politique d\'Extraction des Clés Matérielles' : 'Hardware Key Extraction Policy',
      description: isFr 
        ? 'Interdiction stricte empêchant toute clé privée cryptographique d\'être exportée dans la mémoire vive ou CPU de l\'hôte.'
        : 'Enforcement preventing cryptographic private keys from ever being exported into host CPU memory or RAM.',
      qcrypt: {
        value: 'CKA_EXTRACTABLE = FALSE (Enclave Trapped)',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Non-extractibilité imposée par le silicium matériel. Les clés privées ne quittent jamais la puce physique. Signature directe dans le microcode.'
          : 'Hardware-enforced non-extractability. Private keys never leave the physical silicon die. Signs directly inside enclave microcode.',
        fipsStandard: 'PKCS#11 Strict'
      },
      signal: {
        value: isFr ? 'Accessible en Mémoire Logicielle' : 'Software Memory Accessible',
        grade: 'PARTIAL',
        detail: isFr 
          ? 'Les clés peuvent être extraites de la RAM via des exploits noyau root, spywares de type Pegasus ou extraction mémoire physique.'
          : 'Keys can be dumped from device RAM via kernel root exploits, Pegasus-style spyware, or physical memory extraction.'
      },
      telegram: {
        value: isFr ? 'Stockage sur Disque en Clair' : 'Plaintext Disk Storage',
        grade: 'VULNERABLE',
        detail: isFr 
          ? 'Les jetons de session et clés d\'échanges secrets sont lisibles sur le stockage local en cas de compromission de l\'appareil.'
          : 'Session tokens and secret chat keys are readable from device local storage upon device compromise or forensic imaging.'
      },
      whatsapp: {
        value: isFr ? 'Keystore OS (Extractible via Jailbreak/Root)' : 'OS Keystore (Extractible via Jailbreak)',
        grade: 'PARTIAL',
        detail: isFr 
          ? 'Les privilèges root sur l\'OS mobile permettent d\'extraire le magasin de clés cryptographiques et les fichiers de base de données locaux.'
          : 'Mobile OS root privileges allow extraction of the cryptographic keystore and local unencrypted database files.'
      }
    },
    {
      id: 'tamper_zeroization',
      category: 'FIPS_HARDWARE',
      title: isFr ? 'Remise à Zéro Anti-Intrusion Physique' : 'Physical Anti-Tamper Zeroization',
      description: isFr 
        ? 'Destruction automatisée des clés cryptographiques en cas d\'intrusion physique du châssis, glitch de tension ou attaque cryogénique.'
        : 'Automated destruction of cryptographic key material upon physical chassis intrusion, voltage glitching, or cryo-freeze attack.',
      qcrypt: {
        value: isFr ? 'Décharge Crowbar Active en 4 µs' : '4 µs Active Crowbar Discharge',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Les capteurs à maillage physique actif déclenchent une décharge crowbar instantanée pour effacer les clés SRAM en moins de 4 microsecondes.'
          : 'Active physical mesh sensors trigger instantaneous capacitor crowbar discharge to zeroize SRAM keys in under 4 microseconds.',
        fipsStandard: 'FIPS 140-3 Physical Mesh'
      },
      signal: {
        value: isFr ? 'Aucun Anti-Intrusion Physique' : 'No Physical Anti-Tamper',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'Application logicielle uniquement. Aucune détection d\'intrusion physique contre les attaques cold-boot ou décapsulage en laboratoire.'
          : 'Software app only. No physical anti-tamper detection against cold-boot attacks or decapping laboratory extraction.'
      },
      telegram: {
        value: isFr ? 'Aucun' : 'None',
        grade: 'VULNERABLE',
        detail: isFr ? 'Aucun mécanisme anti-intrusion côté client ou serveur.' : 'No anti-tamper mechanisms on client or server side.'
      },
      whatsapp: {
        value: isFr ? 'Aucun Anti-Intrusion Physique Dédié' : 'No Dedicated Physical Anti-Tamper',
        grade: 'CLASSICAL',
        detail: isFr 
          ? 'Dépend exclusivement du châssis smartphone grand public sans circuit de décharge crowbar dédié.'
          : 'Depends exclusively on smartphone hardware chassis without specialized zeroization crowbar circuitry.'
      }
    },

    // 4. COMPLIANCE & AUDITABILITY
    {
      id: 'eu_compliance',
      category: 'COMPLIANCE',
      title: isFr ? 'Conformité Directive NIS2 & ANSSI' : 'ANSSI & EU NIS2 Directive Compliance',
      description: isFr 
        ? 'Alignement officiel avec les exigences de l\'Union Européenne pour les infrastructures critiques et la feuille de route post-quantique ANSSI.'
        : 'Official alignment with European Union critical infrastructure mandates and French ANSSI post-quantum transition timelines.',
      qcrypt: {
        value: isFr ? 'Totalement Certifié (LPM 2024-2030 & Prêt NIS2)' : 'Fully Certified (LPM 2024-2030 & NIS2 Ready)',
        grade: 'PQC_LEVEL_5',
        detail: isFr 
          ? 'Certifié selon la Loi de Programmation Militaire (LPM) et les exigences cryptographiques des Entités Essentielles NIS2.'
          : 'Certified under French Military Programming Law (LPM) and NIS2 Essential Entity cryptographic requirements.',
        fipsStandard: 'ANSSI PQC Phase 2'
      },
      signal: {
        value: isFr ? 'Grade Grand Public Uniquement' : 'Consumer Privacy Grade Only',
        grade: 'PARTIAL',
        detail: isFr 
          ? 'Non adapté pour les réseaux classifiés de l\'UE ou la conformité réglementaire NIS2 des infrastructures d\'importance vitale.'
          : 'Not tailored for EU classified networks or NIS2 critical infrastructure regulatory compliance.'
      },
      telegram: {
        value: isFr ? 'Non-Conforme (Avertissements Réglementaires)' : 'Non-Compliant (Regulatory Warnings)',
        grade: 'VULNERABLE',
        detail: isFr 
          ? 'Fait l\'objet d\'enquêtes réglementaires européennes relatives à la protection des données et à l\'absence de chiffrement par défaut.'
          : 'Subject to EU regulatory inquiries regarding data protection, lack of encryption by default, and moderation evasion.'
      },
      whatsapp: {
        value: isFr ? 'Risque de Sanction RGPD (Partage de Données Meta)' : 'GDPR Sanction Risk (Meta Data Sharing)',
        grade: 'META_TELEMETRY',
        detail: isFr 
          ? 'Fait l\'objet de multiples enquêtes de l\'EDPB et de sanctions financières records de plusieurs millions d\'euros pour transfert de télémétrie.'
          : 'Subject to multiple European Data Protection Board (EDPB) investigations and multimillion-euro GDPR fines for telemetry transfers.'
      }
    }
  ];

  const filteredMatrix = matrixData.filter(row => {
    if (activeCategory === 'ALL') return true;
    return row.category === activeCategory;
  });

  const handleExportMatrixJson = () => {
    const exportObject = {
      exportTimestamp: new Date().toISOString(),
      reportTitle: 'Q-CRYPT Competitive Cryptographic & Hardware Security Matrix',
      authoritativeStandards: ['NIST FIPS 203', 'NIST FIPS 204', 'NIST FIPS 140-3', 'ANSSI NIS2'],
      messengers: messengerMetadata,
      matrix: matrixData
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qcrypt-competitive-security-matrix-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Competitive Security Matrix Exported', 'Downloaded comprehensive cryptographic evaluation JSON report.', 'success');
  };

  const getBadgeForGrade = (grade: string) => {
    switch (grade) {
      case 'PQC_LEVEL_5':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/50">{isFr ? 'NIST PQC Niveau 5 ✓' : 'NIST PQC Level 5 ✓'}</span>;
      case 'OPTIMAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">{isFr ? 'Optimal ✓' : 'Optimal ✓'}</span>;
      case 'SECURE':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">{isFr ? 'Standard Sécurisé' : 'Standard Secure'}</span>;
      case 'HYBRID':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-500/50">{isFr ? 'Hybride Partiel ⚠️' : 'Partial Hybrid ⚠️'}</span>;
      case 'PARTIAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50">{isFr ? 'Partiel ⚠️' : 'Partial ⚠️'}</span>;
      case 'CLASSICAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-600/50">{isFr ? 'Classique Uniquement ⚠️' : 'Classical Only ⚠️'}</span>;
      case 'META_TELEMETRY':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/50">{isFr ? 'Télémétrie Meta ⚠️' : 'Meta Telemetry ⚠️'}</span>;
      case 'PROPRIETARY':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/50">{isFr ? 'Propriétaire ✕' : 'Proprietary ✕'}</span>;
      case 'SERVER_PLAINTEXT':
      case 'VULNERABLE':
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-950/90 text-rose-400 border border-rose-500/60">{isFr ? 'Vulnérable ✕' : 'Vulnerable ✕'}</span>;
    }
  };

  return (
    <section id="competitive-security-matrix" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
              <Layers className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{isFr ? 'COMPARAISON PROTOCOLES CRYPTO & MENACES' : 'CRYPTOGRAPHIC PROTOCOL & THREAT COMPARISON'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isFr ? 'Matrice de Sécurité Concurrentielle' : 'Competitive Security Matrix'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              {isFr 
                ? 'Évaluation comparative des primitives cryptographiques, des politiques de métadonnées et de l\'intégration des modules de sécurité matérielle (FIPS 140-3) entre Q-CRYPT et les plateformes historiques.'
                : 'Side-by-side evaluation of underlying cryptographic primitives, metadata handling policies, and hardware security module (FIPS 140-3) integrations between Q-CRYPT and legacy communication platforms.'}
            </p>
          </div>

          {/* Action Bar: Export & Simulation */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={() => {
                setIsHndlSimulationActive(!isHndlSimulationActive);
                showToast(
                  isHndlSimulationActive 
                    ? (isFr ? 'Vue d\'Évaluation Standard Rétablie' : 'Standard Evaluation View Restored')
                    : (isFr ? 'Simulation Attaque HNDL Active' : 'Harvest-Now-Decrypt-Later (HNDL) Threat Simulation Active'),
                  isHndlSimulationActive 
                    ? (isFr ? 'Affichage des configurations cryptographiques de base.' : 'Showing baseline cryptographic configurations.')
                    : (isFr ? 'Simulation de l\'interception sur fibre optique déchiffrée par de futurs ordinateurs quantiques CRQC.' : 'Simulating fiber cable interception decrypted by future Cryptographically Relevant Quantum Computers (CRQC).'),
                  isHndlSimulationActive ? 'info' : 'error'
                );
              }}
              className={`px-4 py-2.5 rounded-2xl border font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95 ${
                isHndlSimulationActive
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-400 text-white shadow-red-950/80 animate-pulse'
                  : 'bg-slate-900/90 border-slate-700/80 hover:border-red-500 text-red-300 hover:text-white'
              }`}
              title={isFr ? 'Simuler l\'impact d\'une interception de flux analysée par un ordinateur quantique CRQC en 2030+' : 'Simulate nation-state fiber tap interception analyzed by a 2030+ Cryptographically Relevant Quantum Computer'}
            >
              <Flame className="w-4 h-4 text-red-400" />
              <span>{isHndlSimulationActive ? (isFr ? 'Simulation HNDL Active (CRQC 2030)' : 'HNDL Simulation Active (CRQC 2030)') : (isFr ? 'Simuler Attaque HNDL' : 'Simulate HNDL Attack Impact')}</span>
            </button>

            <button
              onClick={handleExportMatrixJson}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{isFr ? 'Exporter la Matrice (JSON)' : 'Export Matrix (JSON)'}</span>
            </button>
          </div>
        </div>

        {/* HNDL Simulation Alert Banner (when active) */}
        {isHndlSimulationActive && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border-2 border-red-500/80 shadow-2xl space-y-2 font-mono animate-fadeIn">
            <div className="flex items-center space-x-2 text-red-300 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
              <span>{isFr ? 'SIMULATION : Adversaire Équipé d\'un Ordinateur Quantique de 4 096 Qubits Logiques' : 'SIMULATION: Adversary Equipped with 4,096 Logical Qubit Quantum Computer'}</span>
            </div>
            <p className="text-xs text-red-200 leading-relaxed font-sans">
              {isFr 
                ? 'Dans ce scénario, le trafic réseau historique capturé par des écoutes étatiques est soumis à l\'algorithme de Shor. WhatsApp et Telegram sont déchiffrés à 100%. Les conversations de groupe et certificats Signal sont compromis. Seul Q-CRYPT conserve une confidentialité mathématique absolue grâce aux réseaux euclidiens.'
                : 'Under this scenario, historical network traffic recorded by state surveillance today is fed through Shor\'s algorithm. WhatsApp and Telegram communications are 100% decrypted. Signal group conversations and identity certificates are compromised. Only Q-CRYPT maintains absolute mathematical confidentiality due to high-dimensional lattice vector reduction barriers.'}
            </p>
          </div>
        )}

        {/* View Mode & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {[
              { id: 'ALL', label: isFr ? 'Toutes les Dimensions' : 'All Dimensions' },
              { id: 'PRIMITIVES', label: isFr ? 'Primitives Cryptographiques' : 'Cryptographic Primitives' },
              { id: 'METADATA', label: isFr ? 'Métadonnées & Divulgation Nulle' : 'Metadata & Zero-Knowledge' },
              { id: 'FIPS_HARDWARE', label: isFr ? 'Matériel FIPS 140-3' : 'FIPS 140-3 Hardware' },
              { id: 'COMPLIANCE', label: isFr ? 'Audit & Conformité' : 'Audit & Compliance' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ComparisonCategory)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: All-in-One Grid vs 1-on-1 Head-to-Head */}
          <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setSelectedView('ALL')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                selectedView === 'ALL'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? 'Grille Complète' : 'Full Comparison Grid'}
            </button>
            <button
              onClick={() => setSelectedView('1V1')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                selectedView === '1V1'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? 'Face-à-Face (1 vs 1)' : 'Head-to-Head (1 vs 1)'}
            </button>
          </div>
        </div>

        {/* HEAD-TO-HEAD MESSENGER SELECTOR (if 1v1 mode active) */}
        {selectedView === '1V1' && (
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                {isFr ? 'Sélectionner le concurrent à comparer à Q-CRYPT :' : 'Select Competitor to Benchmark Against Q-CRYPT:'}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {(['signal', 'telegram', 'whatsapp'] as MessengerId[]).map((mId) => {
                  const meta = messengerMetadata[mId];
                  return (
                    <button
                      key={mId}
                      onClick={() => setActiveCompetitor(mId)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                        activeCompetitor === mId
                          ? 'bg-cyan-600 text-slate-950 shadow-lg shadow-cyan-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{meta.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-200">
                        {meta.pqcScore}% PQC
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Head-to-Head Comparative Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Q-CRYPT Primary Hero Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-950 border-2 border-cyan-500/60 shadow-2xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white font-sans">Q-CRYPT</h4>
                      <span className="text-xs text-cyan-400 font-mono">{isFr ? 'Standard NIST FIPS 203/204' : 'NIST FIPS 203/204 Standard'}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold">
                    {isFr ? 'Défense Rang 0' : 'Tier 0 Defense'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFr 
                    ? 'Conçu spécifiquement pour éradiquer les menaces de capture et déchiffrement ultérieur (HNDL) grâce aux réseaux euclidiens (ML-KEM-1024 / ML-DSA-87), à l\'entropie quantique optique et aux enclaves matérielles FIPS 140-3.'
                    : 'Engineered specifically to eradicate Harvest-Now-Decrypt-Later threats via lattice mathematics (ML-KEM-1024 / ML-DSA-87), true quantum optical entropy, and FIPS 140-3 hardware enclave boundaries.'}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">{isFr ? 'Robustesse PQC' : 'PQC Hardness'}</span>
                    <span className="text-cyan-300 font-bold text-sm">{isFr ? 'Niveau 5 (Max)' : 'Level 5 (Max)'}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">{isFr ? 'Risque HNDL' : 'HNDL Risk'}</span>
                    <span className="text-emerald-400 font-bold text-sm">0.00%</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">FIPS 140-3</span>
                    <span className="text-purple-300 font-bold text-sm">{isFr ? 'Niveau 3 / 4' : 'Level 3 / 4'}</span>
                  </div>
                </div>
              </div>

              {/* Selected Competitor Comparison Hero Card */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white font-sans">{messengerMetadata[activeCompetitor].name}</h4>
                      <span className="text-xs text-slate-400 font-mono">{messengerMetadata[activeCompetitor].tagline}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${messengerMetadata[activeCompetitor].badgeColor}`}>
                    {messengerMetadata[activeCompetitor].badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeCompetitor === 'signal' && (isFr 
                    ? 'Offre une forte confidentialité classique avec support du texte 1:1 hybride PQXDH, mais laisse les groupes, les certificats d\'identité et les flux audio exposés aux attaques quantiques sur courbes elliptiques.'
                    : 'Offers strong classical privacy with hybrid PQXDH 1:1 text support, but leaves group messaging, identity certificates, and voice ratchets exposed to classical ECC attacks.')}
                  {activeCompetitor === 'telegram' && (isFr 
                    ? 'Stocke les archives en clair dans des serveurs cloud centralisés par défaut avec le chiffrement propriétaire MTProto 2.0, vulnérable aux saisies judiciaires et à la factorisation quantique.'
                    : 'Stores message archives on centralized cloud servers in plaintext by default with proprietary MTProto 2.0 ciphering, vulnerable to subpoena and future quantum factoring.')}
                  {activeCompetitor === 'whatsapp' && (isFr 
                    ? 'Repose exclusivement sur Curve25519 classique. Synchronise les sauvegardes avec les clouds publics et transmet la télémétrie du graphe social aux régies publicitaires de Meta.'
                    : 'Relies exclusively on classical Curve25519 ECC encryption. Synchronizes chat backups with cloud providers and reports user social graph telemetry to Meta ad systems.')}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">{isFr ? 'Robustesse PQC' : 'PQC Hardness'}</span>
                    <span className="text-amber-400 font-bold text-sm">{messengerMetadata[activeCompetitor].pqcScore}%</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">{isFr ? 'Risque HNDL' : 'HNDL Risk'}</span>
                    <span className={`font-bold text-sm ${activeCompetitor === 'signal' ? 'text-amber-400' : 'text-rose-400'}`}>
                      {activeCompetitor === 'signal' ? (isFr ? 'Élevé (Groupes)' : 'High (Groups)') : (isFr ? '100% Critique' : '100% Critical')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">FIPS 140-3</span>
                    <span className="text-slate-400 font-bold text-sm">{isFr ? 'Aucun' : 'None'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN COMPARATIVE MATRIX TABLE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/90 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5 w-1/4">{isFr ? 'Dimension de Sécurité / Primitive' : 'Security Dimension / Primitive'}</th>
                  <th className="p-4 sm:p-5 w-1/4 bg-cyan-950/40 border-x border-cyan-500/30 text-cyan-300">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Q-CRYPT ({isFr ? 'Post-Quantique' : 'Post-Quantum'})</span>
                    </div>
                  </th>

                  {selectedView === 'ALL' ? (
                    <>
                      <th className="p-4 sm:p-5 w-1/6 text-slate-300">Signal ({isFr ? 'Hybride PQXDH' : 'PQXDH Hybrid'})</th>
                      <th className="p-4 sm:p-5 w-1/6 text-slate-300">Telegram (MTProto 2.0)</th>
                      <th className="p-4 sm:p-5 w-1/6 text-slate-300">WhatsApp ({isFr ? 'ECC Classique' : 'Classical ECC'})</th>
                    </>
                  ) : (
                    <th className="p-4 sm:p-5 w-1/2 text-slate-300">
                      {messengerMetadata[activeCompetitor].name} ({messengerMetadata[activeCompetitor].badge})
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {filteredMatrix.map((row) => {
                  const isExpanded = expandedRowId === row.id;

                  return (
                    <React.Fragment key={row.id}>
                      <tr 
                        className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-slate-800/30' : ''
                        }`}
                        onClick={() => setExpandedRowId(isExpanded ? null : row.id)}
                      >
                        {/* Title & Category */}
                        <td className="p-4 sm:p-5 align-top space-y-1">
                          <div className="font-bold text-white text-sm flex items-center space-x-1.5">
                            <span>{row.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {isExpanded ? '▲' : '▼'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                            {row.description}
                          </p>
                        </td>

                        {/* Q-CRYPT Column */}
                        <td className="p-4 sm:p-5 align-top bg-cyan-950/20 border-x border-cyan-500/30 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-white text-xs">
                              {row.qcrypt.value}
                            </span>
                            {getBadgeForGrade(row.qcrypt.grade)}
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                            {row.qcrypt.detail}
                          </p>
                          {row.qcrypt.fipsStandard && (
                            <span className="inline-block text-[10px] font-mono text-cyan-400/90 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                              {row.qcrypt.fipsStandard}
                            </span>
                          )}
                        </td>

                        {/* Standard Grid vs 1v1 Columns */}
                        {selectedView === 'ALL' ? (
                          <>
                            {/* Signal */}
                            <td className="p-4 sm:p-5 align-top space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono font-bold text-slate-200 text-xs">
                                  {row.signal.value}
                                </span>
                                {getBadgeForGrade(row.signal.grade)}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {row.signal.detail}
                              </p>
                            </td>

                            {/* Telegram */}
                            <td className="p-4 sm:p-5 align-top space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono font-bold text-slate-200 text-xs">
                                  {row.telegram.value}
                                </span>
                                {getBadgeForGrade(row.telegram.grade)}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {row.telegram.detail}
                              </p>
                            </td>

                            {/* WhatsApp */}
                            <td className="p-4 sm:p-5 align-top space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono font-bold text-slate-200 text-xs">
                                  {row.whatsapp.value}
                                </span>
                                {getBadgeForGrade(row.whatsapp.grade)}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {row.whatsapp.detail}
                              </p>
                            </td>
                          </>
                        ) : (
                          /* 1v1 View: Single Selected Competitor */
                          <td className="p-4 sm:p-5 align-top space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono font-bold text-slate-200 text-xs">
                                {row[activeCompetitor].value}
                              </span>
                              {getBadgeForGrade(row[activeCompetitor].grade)}
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {row[activeCompetitor].detail}
                            </p>
                          </td>
                        )}
                      </tr>

                      {/* Expanded Technical Note Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90 font-mono text-xs text-slate-300">
                          <td colSpan={selectedView === 'ALL' ? 5 : 3} className="p-4 border-b border-slate-800/80">
                            <div className="flex items-start space-x-3 text-[11px]">
                              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <span className="text-white font-bold block">
                                  {isFr 
                                    ? 'Contexte de Sécurité RSSI : Pourquoi cette primitive est déterminante face aux ordinateurs quantiques CRQC' 
                                    : 'CISO Security Context: Why this primitive matters against Cryptographically Relevant Quantum Computers'}
                                </span>
                                <p className="text-slate-400 leading-relaxed font-sans">
                                  {isFr 
                                    ? 'Selon le théorème de Mosca (X + Y > Z), la migration cryptographique doit précéder la disponibilité quantique. Les chiffrements classiques (RSA, ECC, Curve25519) subiront un effondrement algébrique total sous l\'algorithme de Shor. Les primitives de Q-CRYPT sur réseaux euclidiens garantissent que le texte chiffré intercepté reste mathématiquement inviolable même si l\'adversaire dispose de portes quantiques tolérantes aux fautes.'
                                    : 'Under Mosca\'s Theorem (X + Y > Z), cryptographic migration must precede quantum availability. Classical ciphers (RSA, ECC, Curve25519) will suffer complete algebraic breakdown under Shor\'s algorithm (O((log N)^3) period finding). Q-CRYPT\'s lattice-based primitives guarantee that intercepted ciphertext remains mathematically intractable even if an adversary gains access to infinite fault-tolerant quantum gates.'}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Summary Callout Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h4 className="text-lg font-bold text-white font-sans flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>{isFr ? 'Prêt pour l\'Approvisionnement Post-Quantique d\'Entreprise ?' : 'Ready for Enterprise Post-Quantum Procurement?'}</span>
            </h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {isFr 
                ? 'Intégrez Q-CRYPT à vos flottes MDM d\'entreprise, annuaires PKI et modules matériels FIPS 140-3 pour sécuriser vos échanges exécutifs, juridiques et opérationnels face aux écoutes HNDL.'
                : 'Integrate Q-CRYPT with your enterprise MDM, PKI directory, and FIPS 140-3 hardware security modules to secure executive, legal, and operational communications against Harvest-Now-Decrypt-Later tapping.'}
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('enterprise-portal');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-mono font-bold text-xs shadow-xl shadow-cyan-950/60 transition-all hover:scale-[1.02] flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <span>{isFr ? 'Demander une Évaluation RSSI d\'Entreprise' : 'Request Enterprise CISO Evaluation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
