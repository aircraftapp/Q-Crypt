import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, Cpu, Mic, CheckCheck, Clock, Sparkles, RefreshCw, 
  Send, Smartphone, Zap, ShieldAlert, KeyRound, Terminal, Upload, 
  Image as ImageIcon, FileText, Eye, EyeOff, Trash2, CheckCircle2, 
  AlertTriangle, Flame, Shield, ArrowRight, X, Play, Pause, ZoomIn, 
  FileCheck, HardDrive, Share2, Layers, Download
} from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export interface ChatMediaAttachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  name: string;
  size: string;
  originalUrl: string;
  previewUrl: string;
  sanitizedExifTags: {
    gpsLocation: string;
    cameraSerial: string;
    creationDate: string;
    deviceModel: string;
    iccProfile: string;
  };
  pqcEnvelope: {
    kemAlgorithm: string;
    kemCiphertextHash: string;
    dekAlgorithm: string;
    authTag: string;
    ciphertextSizeBytes: number;
  };
  burnTimerSeconds: number | null; // null for persistent, 0 for view-once (destroy on close)
  isDecrypted: boolean;
  isZeroized: boolean;
  timeRemaining?: number;
  revealedAt?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'peer' | 'self';
  name: string;
  role: string;
  time: string;
  text: string;
  hasAudio?: boolean;
  audioDuration?: string;
  securityMeta?: string;
  attachment?: ChatMediaAttachment;
  selfDestructIn?: number;
}

const PRESET_FILES = [
  {
    name: 'Defense_Sat_Recon_Sector_7.webp',
    type: 'image' as const,
    size: '3.4 MB',
    previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    gps: '48.8584° N, 2.2945° E (Eiffel Perimeter)',
    camera: 'Pleiades-Neo High-Res Sensor #9941',
    device: 'Thales Alenia Space Recon Pod v4'
  },
  {
    name: 'Executive_Q3_Liquidity_Ledger.pdf',
    type: 'document' as const,
    size: '1.2 MB',
    previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    gps: '50.1109° N, 8.6821° E (Frankfurt Vault)',
    camera: 'N/A (Enterprise ERP PDF Export)',
    device: 'Lenovo ThinkPad X1 Carbon Gen 12'
  },
  {
    name: 'Titan_M2_Hardware_Attestation.pqc',
    type: 'document' as const,
    size: '480 KB',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    gps: '37.4220° N, 122.0841° W (Silicon Enclave)',
    camera: 'Titan M2 Hardware Micro-Probe',
    device: 'Google Titan M2 RoT Enclave'
  }
];

export const QuantumMessengerChatPreview: React.FC = () => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const sectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'DEFENSE-STRATEGY' | 'EXECUTIVE-BOARD' | 'FIELD-OPS-ALPHA'>('DEFENSE-STRATEGY');
  const [inputText, setInputText] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // File Upload & Sanitization Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState<{
    name: string;
    type: 'image' | 'document';
    size: string;
    previewUrl: string;
    gps: string;
    camera: string;
    device: string;
  } | null>(null);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [sanitizeProgress, setSanitizeProgress] = useState(0);
  const [selectedBurnTimer, setSelectedBurnTimer] = useState<number | null>(10); // 10s default
  const [isDragging, setIsDragging] = useState(false);

  // Fullscreen Image Lightbox
  const [activeLightboxAttachment, setActiveLightboxAttachment] = useState<ChatMediaAttachment | null>(null);

  // Message list with initial state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'peer',
      name: isFr ? 'Opérateur Terrain Alpha' : 'Field Operative Alpha',
      role: isFr ? 'Chef Secteur Défense' : 'Defense Sector Lead',
      time: '10:42',
      text: isFr 
        ? 'Initialisation de l\'échange de clé post-quantique ML-KEM-1024 depuis l\'enclave matérielle Knox StrongBox.'
        : 'Initiating ML-KEM-1024 post-quantum key exchange from Knox StrongBox hardware enclave.',
      securityMeta: isFr ? 'Vérifié NIST FIPS 203 • Secret Partagé : 0x8F92...B31A' : 'NIST FIPS 203 Verified • Shared Secret: 0x8F92...B31A'
    },
    {
      id: 'm2',
      sender: 'self',
      name: isFr ? 'QG Commande CISO' : 'CISO Command HQ',
      role: isFr ? 'Directeur Sécurité Entreprise' : 'Enterprise Security Director',
      time: '10:42',
      text: isFr 
        ? 'Échange validé. Tunnel de réseaux euclidiens établi (latence < 1.2ms). Transmission des données de reconnaissance classifiées.'
        : 'Handshake accepted. Lattice tunnel established (< 1.2ms latency). Transmitting classified reconnaissance.',
      securityMeta: isFr ? 'Signature FIPS 204 Validée • Clé Hors-Réseau' : 'FIPS 204 Signature Validated • Air-Gapped Key'
    },
    {
      id: 'm3',
      sender: 'peer',
      name: isFr ? 'Opérateur Terrain Alpha' : 'Field Operative Alpha',
      role: isFr ? 'Chef Secteur Défense' : 'Defense Sector Lead',
      time: '10:43',
      text: isFr 
        ? 'Transmission d\'imagerie satellite assainie. Chiffrée sous enveloppe NIST Kyber-1024 avec minuterie d\'autodestruction de 10s :'
        : 'Transmitting sanitized geospatial satellite image. Encrypted under NIST Kyber-1024 envelope with 10s burn timer:',
      securityMeta: isFr ? 'EXIF Assaini • Zéro Empreinte GPS' : 'EXIF Sanitized • Zero GPS Footprint',
      attachment: {
        id: 'att-sat-01',
        type: 'image',
        name: 'Defense_Sat_Recon_Sector_7.webp',
        size: '3.4 MB',
        originalUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        sanitizedExifTags: {
          gpsLocation: isFr ? 'SUPPRIMÉ & MIS À ZÉRO (Était 48.8584° N, 2.2945° E)' : 'STRIPPED & ZEROED (Was 48.8584° N, 2.2945° E)',
          cameraSerial: isFr ? 'PURGÉ (Capteur #9941)' : 'PURGED (Sensor #9941)',
          creationDate: 'NORMALIZED TO 00:00:00 UTC',
          deviceModel: isFr ? 'IDENTIFIANT MATÉRIEL MASQUÉ' : 'REDACTED HARDWARE ID',
          iccProfile: 'SANITIZED TO STANDARD SRGB'
        },
        pqcEnvelope: {
          kemAlgorithm: 'NIST ML-KEM-1024 (Kyber)',
          kemCiphertextHash: '0x9E7A...44C1',
          dekAlgorithm: 'AES-256-GCM (Authenticated)',
          authTag: '0x5F88...D1B9',
          ciphertextSizeBytes: 1568
        },
        burnTimerSeconds: 10,
        isDecrypted: false,
        isZeroized: false,
        timeRemaining: 10
      }
    },
    {
      id: 'm4',
      sender: 'self',
      name: isFr ? 'QG Commande CISO' : 'CISO Command HQ',
      role: isFr ? 'Directeur Sécurité Entreprise' : 'Enterprise Security Director',
      time: '10:44',
      text: isFr ? 'Message Vocal Push-To-Talk Chiffré (NIST Kyber-1024) :' : 'Push-To-Talk Voice Burst Encrypted (NIST Kyber-1024):',
      hasAudio: true,
      audioDuration: '0:18',
      securityMeta: isFr ? 'Charge Audio Chiffrée • Zéro Métadonnée' : 'Encrypted Audio Payload • Zero Metadata Record'
    }
  ]);

  // Scroll Triggered Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Burn-After-Reading Active Countdown Engine
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessages) => {
        let hasChanges = false;
        const updated = prevMessages.map((msg) => {
          if (
            msg.attachment &&
            msg.attachment.isDecrypted &&
            !msg.attachment.isZeroized &&
            msg.attachment.burnTimerSeconds !== null &&
            msg.attachment.burnTimerSeconds > 0
          ) {
            hasChanges = true;
            const currentTime = msg.attachment.timeRemaining ?? msg.attachment.burnTimerSeconds;
            if (currentTime <= 1) {
              return {
                ...msg,
                attachment: {
                  ...msg.attachment,
                  isZeroized: true,
                  timeRemaining: 0
                }
              };
            } else {
              return {
                ...msg,
                attachment: {
                  ...msg.attachment,
                  timeRemaining: currentTime - 1
                }
              };
            }
          }
          return msg;
        });
        return hasChanges ? updated : prevMessages;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle Decryption of Media Attachment
  const handleDecryptAttachment = (messageId: string, attachmentId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.attachment && msg.attachment.id === attachmentId) {
          showToast(
            isFr ? 'Décapsulation en Enclave Matérielle' : 'Hardware Enclave Decapsulation',
            isFr 
              ? 'Clé ML-KEM-1024 décapsulée dans Knox StrongBox. Minuteur d\'autodestruction engagé.' 
              : 'ML-KEM-1024 key decapsulated in Knox StrongBox. Ephemeral burn timer engaged.',
            'info'
          );
          return {
            ...msg,
            attachment: {
              ...msg.attachment,
              isDecrypted: true,
              revealedAt: Date.now(),
              timeRemaining: msg.attachment.burnTimerSeconds ?? undefined
            }
          };
        }
        return msg;
      })
    );
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const isImg = file.type.startsWith('image/');
      const objectUrl = URL.createObjectURL(file);
      
      setSelectedFileForUpload({
        name: file.name,
        type: isImg ? 'image' : 'document',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        previewUrl: objectUrl,
        gps: isFr ? '48.8584° N, 2.2945° E (Extrait de l\'EXIF)' : '48.8584° N, 2.2945° E (Extracted from EXIF)',
        camera: isFr ? 'Profil d\'Objectif du Capteur' : 'Host Sensor Lens Profile',
        device: navigator.userAgent.slice(0, 32)
      });
      setIsUploadModalOpen(true);
    }
  };

  const handleFileSelectFromDisk = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImg = file.type.startsWith('image/');
      const objectUrl = URL.createObjectURL(file);
      
      setSelectedFileForUpload({
        name: file.name,
        type: isImg ? 'image' : 'document',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        previewUrl: objectUrl,
        gps: isFr ? '37.7749° N, 122.4194° O (Détecté dans l\'en-tête EXIF)' : '37.7749° N, 122.4194° W (Detected in EXIF header)',
        camera: isFr ? 'Matrice de Couleur Brute & ID Capteur #4092' : 'Raw Color Matrix & Sensor ID #4092',
        device: isFr ? 'Nœud Matériel Client' : 'Client Hardware Node'
      });
      setIsUploadModalOpen(true);
    }
  };

  const handleSelectPresetFile = (preset: typeof PRESET_FILES[0]) => {
    setSelectedFileForUpload({
      name: preset.name,
      type: preset.type,
      size: preset.size,
      previewUrl: preset.previewUrl,
      gps: preset.gps,
      camera: preset.camera,
      device: preset.device
    });
    setIsUploadModalOpen(true);
  };

  // Perform Real-Time Sanitization & Envelope Packaging
  const handleExecuteSanitizeAndSend = () => {
    if (!selectedFileForUpload) return;

    setIsSanitizing(true);
    setSanitizeProgress(10);

    const step1 = setTimeout(() => setSanitizeProgress(40), 300);
    const step2 = setTimeout(() => setSanitizeProgress(75), 650);
    const step3 = setTimeout(() => {
      setSanitizeProgress(100);
      setIsSanitizing(false);
      setIsUploadModalOpen(false);

      const randomCipher = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
      const randomTag = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();

      const newAttachment: ChatMediaAttachment = {
        id: `att-${Date.now()}`,
        type: selectedFileForUpload.type,
        name: selectedFileForUpload.name,
        size: selectedFileForUpload.size,
        originalUrl: selectedFileForUpload.previewUrl,
        previewUrl: selectedFileForUpload.previewUrl,
        sanitizedExifTags: {
          gpsLocation: isFr ? 'SUPPRIMÉ & PURGÉ (Localisation effacée)' : 'STRIPPED & ZEROED (Location Scrubbed)',
          cameraSerial: isFr ? 'PURGÉ (Empreinte Capteur Supprimée)' : 'PURGED (Sensor Fingerprint Removed)',
          creationDate: 'NORMALIZED TO 00:00:00 UTC',
          deviceModel: isFr ? 'MASQUÉ POUR ZÉRO-CRIMINALISTIQUE' : 'REDACTED FOR ZERO-FORENSICS',
          iccProfile: 'SANITIZED TO STANDARD SRGB'
        },
        pqcEnvelope: {
          kemAlgorithm: 'NIST ML-KEM-1024 (Kyber FIPS 203)',
          kemCiphertextHash: `0x${randomCipher}...${randomTag.slice(0, 4)}`,
          dekAlgorithm: 'AES-256-GCM 256-Bit Hardware Unwrapped',
          authTag: `0x${randomTag}...8F`,
          ciphertextSizeBytes: 1568
        },
        burnTimerSeconds: selectedBurnTimer,
        isDecrypted: false,
        isZeroized: false,
        timeRemaining: selectedBurnTimer ?? undefined
      };

      const newMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        sender: 'self',
        name: isFr ? 'QG Commande CISO' : 'CISO Command HQ',
        role: isFr ? 'Directeur Sécurité Entreprise' : 'Enterprise Security Director',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: inputText.trim() || (isFr 
          ? `Transmission chiffrée ${selectedFileForUpload.type === 'image' ? 'de l\'image' : 'du document'} (${selectedFileForUpload.name}) via enveloppe ML-KEM-1024.`
          : `Transmitted encrypted ${selectedFileForUpload.type} (${selectedFileForUpload.name}) via ML-KEM-1024 envelope.`),
        securityMeta: isFr 
          ? `EXIF Assaini • Chiffré ML-KEM-1024 • ${selectedBurnTimer ? `Minuteur ${selectedBurnTimer}s` : 'Persistant'}`
          : `Sanitized EXIF • ML-KEM-1024 Encrypted • ${selectedBurnTimer ? `${selectedBurnTimer}s Burn Timer` : 'Persistent'}`,
        attachment: newAttachment
      };

      setMessages((prev) => [...prev, newMsg]);
      setInputText('');
      setSelectedFileForUpload(null);

      showToast(
        isFr ? 'EXIF Purgé & Enveloppe Chiffrée' : 'EXIF Scrubbed & Envelope Encrypted',
        isFr 
          ? `Fichier ${newAttachment.name} transmis avec enveloppe réseau NIST ML-KEM-1024.`
          : `Transmitted ${newAttachment.name} with NIST ML-KEM-1024 lattice envelope.`,
        'success'
      );
    }, 1000);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'self',
      name: isFr ? 'QG Commande CISO' : 'CISO Command HQ',
      role: isFr ? 'Directeur Sécurité Entreprise' : 'Enterprise Security Director',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim(),
      securityMeta: isFr ? 'Vérifié NIST FIPS 203 • Knox StrongBox' : 'NIST FIPS 203 Verified • Knox StrongBox'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleToggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    if (!isAudioPlaying) {
      showToast(
        isFr ? 'Flux Audio Push-To-Talk' : 'Push-To-Talk Audio Stream', 
        isFr ? 'Lecture de la charge audio 18s déchiffrée depuis la RAM Titan M2.' : 'Playing decrypted 18s audio payload from Titan M2 RAM.', 
        'info'
      );
    }
  };

  return (
    <div 
      ref={sectionRef} 
      id="quantum-messenger-chat-live"
      className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden my-12"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelectFromDisk}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.pqc,.bin,.txt"
      />

      {/* Drag Over Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-cyan-950/90 backdrop-blur-md z-50 border-4 border-dashed border-cyan-400 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4 animate-in fade-in">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 animate-bounce">
            <Upload className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-white font-sans">
              {isFr ? 'Déposez le fichier pour le chiffrement post-quantique' : 'Drop File for Post-Quantum Encryption'}
            </h4>
            <p className="text-sm text-cyan-200 font-mono">
              {isFr 
                ? 'Suppression auto des métadonnées EXIF & encapsulation sous enveloppe NIST ML-KEM-1024'
                : 'Auto-strips EXIF & wraps payload in NIST ML-KEM-1024 envelope'}
            </p>
          </div>
        </div>
      )}

      {/* Background glow lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFr ? 'PROTOCOLE INTERACTIF QUANTUM MESSENGER' : 'INTERACTIVE QUANTUM MESSENGER PROTOCOL'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isFr ? 'Partage Sécurisé de Fichiers & Images en Temps Réel' : 'Secure File & Image Sharing in Real Time'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl font-sans">
            {isFr 
              ? <>Glissez-déposez des images ou documents pour tester l'<strong className="text-cyan-300">assainissement EXIF</strong> en temps réel, le <strong className="text-cyan-300">chiffrement par enveloppe NIST ML-KEM-1024</strong>, la décapsulation floutée et les <strong className="text-rose-400">minuteurs d'autodestruction</strong>.</>
              : <>Drag and drop images or documents to test real-time <strong className="text-cyan-300">EXIF sanitization</strong>, <strong className="text-cyan-300">NIST ML-KEM-1024 envelope encryption</strong>, blur-to-reveal decapsulation, and <strong className="text-rose-400">burn-after-reading timers</strong>.</>}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>{isFr ? 'Téléverser & Chiffrer un Fichier' : 'Upload & Encrypt File'}</span>
          </button>
        </div>
      </div>

      {/* Main Interface Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Interactive Quantum Phone App Screen */}
        <div className="lg:col-span-7 bg-slate-950 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col min-h-[580px]">
          
          {/* Top Notch Bar with Channel Tabs & Enclave Status */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 mb-4 font-mono text-xs gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {(['DEFENSE-STRATEGY', 'EXECUTIVE-BOARD', 'FIELD-OPS-ALPHA'] as const).map((chan) => (
                  <button
                    key={chan}
                    onClick={() => setSelectedChannel(chan)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      selectedChannel === chan 
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/60' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    #{chan.split('-')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>{isFr ? 'NIST ML-KEM-1024 ACTIF' : 'NIST ML-KEM-1024 ACTIVE'}</span>
            </div>
          </div>

          {/* Quick Preset Attachment Bar */}
          <div className="mb-3 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono">
            <span className="text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{isFr ? 'Exemple Rapide :' : 'Quick Sample File:'}</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {PRESET_FILES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPresetFile(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[10px] flex items-center space-x-1.5 transition-all"
                >
                  {preset.type === 'image' ? (
                    <ImageIcon className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <FileText className="w-3 h-3 text-amber-400" />
                  )}
                  <span className="truncate max-w-[130px]">{preset.name.split('_')[0] + ' ' + preset.name.split('_')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="space-y-4 flex-1 flex flex-col justify-end p-2 overflow-y-auto max-h-[460px]">
            {messages.map((msg) => {
              const isSelf = msg.sender === 'self';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} space-y-1`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 px-1">
                    <span className="font-bold text-slate-200">{msg.name}</span>
                    <span>•</span>
                    <span className="text-slate-500">{msg.role}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  {/* Message Bubble Box */}
                  <div
                    className={`max-w-[90%] sm:max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm font-sans space-y-2.5 shadow-xl border ${
                      isSelf
                        ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 text-slate-100 border-cyan-500/40 rounded-tr-none'
                        : 'bg-slate-900 text-slate-200 border-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                    {/* Media Attachment Rendering (Image / Document) */}
                    {msg.attachment && (
                      <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950/90 font-mono text-xs">
                        {/* If Attachment is ZEROIZED (Burn Timer reached 0) */}
                        {msg.attachment.isZeroized ? (
                          <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center space-x-3 text-rose-300">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                              <Flame className="w-4 h-4 text-rose-400" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-bold text-xs block text-white">
                                {isFr ? '[CHARGE UTILE DÉTRUITE & MISE À ZÉRO]' : '[PAYLOAD DESTROYED & ZEROIZED]'}
                              </span>
                              <p className="text-[10px] text-rose-300/80 font-sans">
                                {isFr 
                                  ? 'Minuteur éphémère expiré. L\'enclave matérielle a déchargé la clé cryptographique de la RAM Titan/Knox.'
                                  : 'Ephemeral timer expired. Hardware enclave discharged cryptographic key from Titan/Knox memory.'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* Image Preview with Blur-to-Reveal State */}
                            {msg.attachment.type === 'image' && (
                              <div className="relative group overflow-hidden bg-slate-950 aspect-video max-h-[190px] w-full flex items-center justify-center">
                                <img
                                  src={msg.attachment.previewUrl}
                                  alt={msg.attachment.name}
                                  className={`w-full h-full object-cover transition-all duration-700 ${
                                    msg.attachment.isDecrypted 
                                      ? 'filter-none' 
                                      : 'blur-xl scale-110 brightness-50 contrast-125'
                                  }`}
                                />

                                {/* Decrypt Overlay if Encrypted */}
                                {!msg.attachment.isDecrypted ? (
                                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center space-y-2">
                                    <div className="w-10 h-10 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg">
                                      <Lock className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <span className="text-white font-bold text-xs block">
                                        {isFr ? 'Chiffré NIST ML-KEM-1024' : 'NIST ML-KEM-1024 Encrypted'}
                                      </span>
                                      <span className="text-[10px] text-cyan-300 block">
                                        {isFr ? 'EXIF Assaini • Scellé en Enclave Matérielle' : 'EXIF Scrubbed • Hardware Enclave Sealed'}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleDecryptAttachment(msg.id, msg.attachment!.id)}
                                      className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-md"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>{isFr ? 'Déchiffrer dans l\'Enclave' : 'Tap to Decrypt in Enclave'}</span>
                                    </button>
                                  </div>
                                ) : (
                                  /* When Decrypted: Quick zoom action */
                                  <button
                                    onClick={() => setActiveLightboxAttachment(msg.attachment!)}
                                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] flex items-center space-x-1 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                    <span>{isFr ? 'Agrandir' : 'Expand'}</span>
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Document Preview Card if Type is Document */}
                            {msg.attachment.type === 'document' && (
                              <div className="p-3 bg-slate-950 flex items-center justify-between gap-3">
                                <div className="flex items-center space-x-2.5">
                                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-slate-200 text-xs block truncate max-w-[180px]">
                                      {msg.attachment.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                      {msg.attachment.size} • {isFr ? 'Enveloppe FIPS 203' : 'FIPS 203 Envelope'}
                                    </span>
                                  </div>
                                </div>

                                {!msg.attachment.isDecrypted ? (
                                  <button
                                    onClick={() => handleDecryptAttachment(msg.id, msg.attachment!.id)}
                                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] shrink-0 flex items-center space-x-1"
                                  >
                                    <Lock className="w-3 h-3" />
                                    <span>{isFr ? 'Déchiffrer' : 'Decrypt'}</span>
                                  </button>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                                    {isFr ? 'DÉCHIFFRÉ' : 'DECRYPTED'}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Attachment Metadata & Burn Countdown Bar */}
                            <div className="p-2.5 bg-slate-900 border-t border-slate-800/80 space-y-1.5 text-[10px]">
                              <div className="flex items-center justify-between text-slate-400">
                                <span className="flex items-center space-x-1 text-cyan-400 font-bold">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>{msg.attachment.name}</span>
                                </span>
                                <span>{msg.attachment.size}</span>
                              </div>

                              {/* Live Burn Countdown Active Indicator */}
                              {msg.attachment.isDecrypted && msg.attachment.burnTimerSeconds !== null && (
                                <div className="space-y-1 pt-1 border-t border-slate-800">
                                  <div className="flex items-center justify-between text-rose-300 font-bold text-[10px]">
                                    <span className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3 text-rose-400 animate-spin" />
                                      <span>{isFr ? 'Autodestruction Active :' : 'Burn-After-Reading Active:'}</span>
                                    </span>
                                    <span className="font-mono text-rose-400">
                                      {msg.attachment.timeRemaining}{isFr ? 's restantes' : 's remaining'}
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                                    <div 
                                      className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
                                      style={{ 
                                        width: `${((msg.attachment.timeRemaining || 0) / (msg.attachment.burnTimerSeconds || 10)) * 100}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Audio Burst Visualizer if present */}
                    {msg.hasAudio && (
                      <div className="p-2 rounded-xl bg-slate-950/90 border border-cyan-500/30 flex items-center space-x-3">
                        <button 
                          onClick={handleToggleAudio}
                          className="w-8 h-8 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 transition-colors"
                        >
                          {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-0.5 h-3">
                            {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70, 85, 40].map((h, i) => (
                              <span
                                key={i}
                                className={`w-1 rounded-full ${isAudioPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-700/60'}`}
                                style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400">
                            <span>{isFr ? 'Flux Audio PQ (NIST Kyber)' : 'PQ Audio Stream (NIST Kyber)'}</span>
                            <span className="text-cyan-300 font-bold">{msg.audioDuration}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Metadata Footer Tag */}
                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span className="flex items-center space-x-1 text-cyan-400">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        <span>{msg.securityMeta}</span>
                      </span>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Chat Input Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-cyan-300 transition-all shrink-0"
              title={isFr ? 'Joindre un fichier ou une image chiffrée' : 'Attach File or Image with ML-KEM-1024 Envelope'}
            >
              <Upload className="w-4 h-4" />
            </button>

            <div className="flex-1 bg-slate-900 rounded-xl px-3 py-2 text-slate-200 border border-slate-800 flex items-center justify-between focus-within:border-cyan-500/60">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isFr ? 'Tapez un message post-quantique ou déposez un fichier...' : 'Type post-quantum message or drop file...'}
                className="w-full bg-transparent outline-none text-xs text-white placeholder-slate-500"
              />
              <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />
            </div>

            <button 
              onClick={handleSendMessage}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Side: EXIF Sanitization & PQC Envelope Verification Suite */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                <FileCheck className="w-4 h-4" />
                <span>{isFr ? 'Anti-Criminalistique & Purge EXIF' : 'Anti-Forensics & EXIF Scrubbing'}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                {isFr ? 'ACTIF' : 'ACTIVE'}
              </span>
            </div>

            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              {isFr 
                ? 'Chaque fichier partagé via Quantum Messenger subit un nettoyage des métadonnées EXIF côté client en mémoire mobile avant son encapsulation euclidienne.'
                : 'Every file shared through Quantum Messenger undergoes client-side EXIF metadata stripping in mobile memory prior to lattice encapsulation.'}
            </p>

            {/* Sanitization Feature Breakdown */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isFr ? 'Coordonnées GPS & Géolocalisation' : 'GPS Coordinates & Geotags'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">{isFr ? 'PURGÉ' : 'PURGED'}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  {isFr ? 'Latitude, longitude, altitude et vitesse sont intégralement écrasées avec des zéros.' : 'Latitude, longitude, altitude, and velocity metadata are completely overwritten with zeros.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isFr ? 'Empreintes Matérielles & Capteurs' : 'Device & Sensor Fingerprints'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">{isFr ? 'SUPPRIMÉ' : 'STRIPPED'}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  {isFr ? 'Numéros de série des objectifs, profils ICC et identifiants OS sont effacés.' : 'Camera lens serials, ICC color profiles, maker notes, and OS build hashes are erased.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isFr ? 'Chiffrement par Enveloppe ML-KEM-1024' : 'ML-KEM-1024 Envelope Encryption'}</span>
                  </span>
                  <span className="text-[10px] text-purple-300 font-bold">FIPS 203</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  {isFr ? 'Les clés symétriques AES-256-GCM sont encapsulées dans des cryptogrammes euclidiens de 1568 octets.' : 'AES-256-GCM symmetric keys are encapsulated using 1568-byte lattice ciphertexts per file.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isFr ? 'Mise à Zéro par Autodestruction' : 'Burn-After-Reading Zeroization'}</span>
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold">{isFr ? 'NON RÉCUPÉRABLE' : 'NON-RECOVERABLE'}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  {isFr ? 'Les données en mémoire RAM sont activement écrasées par du bruit cryptographique à l\'expiration.' : 'Decrypted pixel arrays in RAM are actively overwritten with cryptographic noise upon timer expiration.'}
                </p>
              </div>
            </div>

            {/* Quick action button to trigger file modal */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isFr ? 'Tester le Téléversement & l\'Assainisseur' : 'Test File Upload & Sanitizer'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Upload, Sanitization & Burn Timer Modal */}
      {isUploadModalOpen && selectedFileForUpload && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="text-lg font-bold text-white font-sans">
                  {isFr ? 'Empaquetage Post-Quantique du Fichier' : 'Post-Quantum File Packaging'}
                </h4>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File Overview Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              {selectedFileForUpload.type === 'image' ? (
                <img
                  src={selectedFileForUpload.previewUrl}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-cyan-500/30"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
              )}
              <div className="space-y-1 flex-1 font-mono text-xs truncate">
                <span className="font-bold text-slate-200 block truncate">
                  {selectedFileForUpload.name}
                </span>
                <span className="text-slate-400 text-[10px] block">
                  {selectedFileForUpload.size} • {selectedFileForUpload.type.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Detected EXIF Metadata to Strip */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-400 font-bold block text-[11px]">
                {isFr ? 'Métadonnées Forensiques Détectées (À Supprimer) :' : 'Detected Forensic Metadata (To Be Scrubbed):'}
              </span>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-[10px]">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">{isFr ? 'Position GPS :' : 'GPS Location:'}</span>
                  <span className="text-red-400 line-through">{selectedFileForUpload.gps}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">{isFr ? 'Profil Capteur :' : 'Sensor Profile:'}</span>
                  <span className="text-red-400 line-through">{selectedFileForUpload.camera}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">{isFr ? 'Matériel Client :' : 'Device Hardware:'}</span>
                  <span className="text-red-400 line-through">{selectedFileForUpload.device}</span>
                </div>
              </div>
            </div>

            {/* Burn-After-Reading Timer Selector */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-1 text-[11px]">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>{isFr ? 'Minuteur d\'Autodestruction (Lecture Unique) :' : 'Burn-After-Reading Self-Destruct Timer:'}</span>
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '5s', value: 5 },
                  { label: '10s', value: 10 },
                  { label: '30s', value: 30 },
                  { label: isFr ? 'Désactivé' : 'Off', value: null }
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setSelectedBurnTimer(opt.value)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedBurnTimer === opt.value
                        ? 'bg-rose-950 text-rose-300 border-rose-500/60 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sanitization Progress Bar if running */}
            {isSanitizing && (
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-cyan-300">
                  <span>{isFr ? 'Assainissement & Encapsulation Réseau...' : 'Sanitizing & Lattice Encapsulating...'}</span>
                  <span>{sanitizeProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${sanitizeProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                disabled={isSanitizing}
                onClick={handleExecuteSanitizeAndSend}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isFr ? 'Assainir & Chiffrer' : 'Sanitize & Encrypt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {activeLightboxAttachment && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{activeLightboxAttachment.name}</span>
                <span className="text-slate-500 font-normal">• {isFr ? 'Décapsulé FIPS 203' : 'FIPS 203 Decapsulated'}</span>
              </div>
              <button
                onClick={() => setActiveLightboxAttachment(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center">
              <img
                src={activeLightboxAttachment.previewUrl}
                alt={activeLightboxAttachment.name}
                className="max-h-[60vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{isFr ? 'Géotags EXIF : PURGÉS (0x0000)' : 'EXIF Geotags: STRIPPED (0x0000)'}</span>
              <span className="text-cyan-300 font-bold">{isFr ? 'Enveloppe NIST ML-KEM-1024' : 'NIST ML-KEM-1024 Envelope'}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
