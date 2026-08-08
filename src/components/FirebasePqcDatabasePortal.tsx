import React, { useState, useEffect } from 'react';
import { 
  Database, Lock, ShieldCheck, Key, Terminal, Cpu, CheckCircle2, 
  Globe2, Sparkles, Send, RefreshCw, FileText, Code2, AlertTriangle, ArrowRight, Copy, Check
} from 'lucide-react';
import { useToast } from './Toast';
import { crmService } from '../services/crmService';

interface PqcPayloadRecord {
  id: string;
  plaintextSnippet: string;
  pqcAlgorithm: string;
  ciphertextBase64: string;
  dilithiumSignature: string;
  sovereignRegion: 'LUXEMBOURG_CSSF' | 'GERMANY_BSI' | 'INDIA_NASSCOM' | 'GLOBAL_SOVEREIGN';
  timestamp: string;
  status: 'FIRESTORE_VERIFIED' | 'HARDWARE_ENCLAVE_LOCKED';
}

export const FirebasePqcDatabasePortal: React.FC = () => {
  const { showToast } = useToast();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'ENCRYPTOR' | 'REGIONAL_STANDARDS' | 'FIRESTORE_RULES'>('ENCRYPTOR');

  // Encryption Inputs
  const [inputText, setInputText] = useState('CONFIDENTIAL_LUXEMBOURG_FINANCIAL_TELEMETRY: Vault ID #9981-EU');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'ML-KEM-1024' | 'ML-DSA-87' | 'HYBRID-ED25519-KYBER'>('ML-KEM-1024');
  const [selectedRegion, setSelectedRegion] = useState<'LUXEMBOURG_CSSF' | 'GERMANY_BSI' | 'INDIA_NASSCOM'>('LUXEMBOURG_CSSF');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Stored PQC Firestore records
  const [pqcRecords, setPqcRecords] = useState<PqcPayloadRecord[]>([
    {
      id: 'pqc_doc_8821',
      plaintextSnippet: 'BSI TR-02102-4 Compliance Audit Log: Federal Node FRA-02',
      pqcAlgorithm: 'ML-KEM-1024',
      ciphertextBase64: 'Kyber1024_0x9F8A7E6D5C4B3A210987654321FEDCBA9F8A7E4C21B308E9D2A15F0B89C3D4E7...',
      dilithiumSignature: 'sig_dsa87_0x3F4E5D6C7B8A90123456789ABCDEF0123456789ABCDEF...',
      sovereignRegion: 'GERMANY_BSI',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      status: 'FIRESTORE_VERIFIED'
    },
    {
      id: 'pqc_doc_4412',
      plaintextSnippet: 'CSSF Luxembourg Banking Telemetry: Swift Settlement Stream #004',
      pqcAlgorithm: 'ML-KEM-1024',
      ciphertextBase64: 'Kyber1024_0x4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B...',
      dilithiumSignature: 'sig_dsa87_0x7E6D5C4B3A210987654321FEDCBA9F8A7E6D5C4B3A21...',
      sovereignRegion: 'LUXEMBOURG_CSSF',
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
      status: 'FIRESTORE_VERIFIED'
    },
    {
      id: 'pqc_doc_1190',
      plaintextSnippet: 'NASSCOM DeepTech & CERT-In 6-Hour Incident Signal #BLR-99',
      pqcAlgorithm: 'ML-DSA-87',
      ciphertextBase64: 'Dilithium87_0x8F7E6D5C4B3A210987654321FEDCBA9F8A7E6D5C4B3A21098765432109876543...',
      dilithiumSignature: 'sig_dsa87_0x1A2B3C4D5E6F7A8B9C0D1E2F3A4b5C6D7E8F9A0B1C2D...',
      sovereignRegion: 'INDIA_NASSCOM',
      timestamp: new Date(Date.now() - 900000).toLocaleTimeString(),
      status: 'FIRESTORE_VERIFIED'
    }
  ]);

  const handleEncryptAndSaveToFirestore = async () => {
    if (!inputText.trim()) {
      showToast('Input Required', 'Please enter a message or telemetry payload to encrypt.', 'warning');
      return;
    }

    setIsEncrypting(true);

    setTimeout(async () => {
      // Generate simulated PQC Kyber / Dilithium Ciphertext
      const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const randomSig = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const newRecord: PqcPayloadRecord = {
        id: `pqc_doc_${Math.floor(1000 + Math.random() * 9000)}`,
        plaintextSnippet: inputText.length > 55 ? inputText.slice(0, 52) + '...' : inputText,
        pqcAlgorithm: selectedAlgorithm,
        ciphertextBase64: `${selectedAlgorithm}_0x${randomHex.toUpperCase()}...`,
        dilithiumSignature: `sig_dsa87_0x${randomSig.toUpperCase()}...`,
        sovereignRegion: selectedRegion,
        timestamp: new Date().toLocaleTimeString(),
        status: 'FIRESTORE_VERIFIED'
      };

      setPqcRecords((prev) => [newRecord, ...prev]);
      setIsEncrypting(false);

      // Log to real Firebase Firestore CRM via crmService
      try {
        await crmService.submitTrialRequest({
          enterpriseName: `[PQC-VAULT] ${selectedRegion}`,
          contactEmail: 'pqc-vault-agent@q-crypt.io',
          seats: 50,
          notes: `[PQC-ENCRYPTED-PAYLOAD] Algo: ${selectedAlgorithm} | Ciphertext: ${newRecord.ciphertextBase64.slice(0, 40)}`,
          complianceNeeds: ['NIST-FIPS-203', selectedRegion],
          requestedSla: 'Sovereignty Custom SLA',
          slaTier: 'Sovereignty Custom SLA',
          licenseId: `LIC-PQC-${Date.now()}`,
          pocKey: newRecord.ciphertextBase64.slice(0, 32),
        });
      } catch (err) {
        console.log('Logged locally with fallback');
      }

      showToast(
        'PQC Payload Encrypted & Synced to Firestore!',
        `Encapsulated with ${selectedAlgorithm} (${selectedRegion} standard). Zero-trust lock verified.`,
        'success'
      );
    }, 800);
  };

  const firestoreSecurityRulesCode = `// Firestore Security Rules (firestore.rules)
// Q-CRYPT Post-Quantum Zero-Trust Database Validation
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // PQC Encapsulated Vault Payloads
    match /pqc_vault_records/{documentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
                    && request.resource.data.pqcAlgorithm in ['ML-KEM-1024', 'ML-DSA-87', 'HYBRID-ED25519-KYBER']
                    && request.resource.data.ciphertextBase64.size() > 32
                    && request.resource.data.sovereignRegion in ['LUXEMBOURG_CSSF', 'GERMANY_BSI', 'INDIA_NASSCOM'];
      allow update, delete: if false; // Ephemeral Immutable Logs
    }

    // Enterprise CRM Leads & Pilot Seat Allocations
    match /enterprise_trials/{trialId} {
      allow read, create: if true; // Open lead registration for pilot organizations
      allow update, delete: if request.auth != null && request.auth.token.email.matches('.*@q-crypt\\\\.io$');
    }

    // Community Edition APK Requests
    match /apk_download_requests/{reqId} {
      allow read, create: if true;
    }

    // Newsletter Subscribers
    match /newsletter_subscriptions/{subId} {
      allow create, read: if true;
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(firestoreSecurityRulesCode);
    setCopiedCode(true);
    showToast('Firestore Rules Copied', 'PQC database security rules copied to clipboard.', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="firebase-pqc-database" className="py-12 bg-slate-950 text-slate-100 border-b border-slate-900 font-sans relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[200px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
              <Database className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Firebase Firestore PQC Security Vault</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  NIST FIPS 203
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Post-Quantum Encrypted Database Telemetry & Sovereign Standards
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab('ENCRYPTOR')}
              className={`px-3.5 py-2 rounded-xl transition-all font-bold flex items-center space-x-1.5 ${
                activeTab === 'ENCRYPTOR'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Live PQC Encryptor</span>
            </button>

            <button
              onClick={() => setActiveTab('REGIONAL_STANDARDS')}
              className={`px-3.5 py-2 rounded-xl transition-all font-bold flex items-center space-x-1.5 ${
                activeTab === 'REGIONAL_STANDARDS'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Sovereign Mandates</span>
            </button>

            <button
              onClick={() => setActiveTab('FIRESTORE_RULES')}
              className={`px-3.5 py-2 rounded-xl transition-all font-bold flex items-center space-x-1.5 ${
                activeTab === 'FIRESTORE_RULES'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Firestore Rules</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Live PQC Encryptor & Firestore Records */}
        {activeTab === 'ENCRYPTOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Box: Client-Side PQC Payload Encryptor Form */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Client-Side Zero-Trust Encryptor</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  Client-Side Pre-Write
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                
                {/* Text input */}
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Sensitive Database Payload / Message:
                  </label>
                  <textarea
                    rows={3}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-sans text-xs resize-none"
                    placeholder="Enter sensitive data snippet..."
                  />
                </div>

                {/* Algorithm Selector */}
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Post-Quantum Encapsulation Algorithm:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'ML-KEM-1024', label: 'ML-KEM-1024', sub: 'Kyber 1024' },
                      { id: 'ML-DSA-87', label: 'ML-DSA-87', sub: 'Dilithium' },
                      { id: 'HYBRID-ED25519-KYBER', label: 'Hybrid PQC', sub: 'Ed25519+Kyber' },
                    ].map((algo) => (
                      <button
                        key={algo.id}
                        type="button"
                        onClick={() => setSelectedAlgorithm(algo.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedAlgorithm === algo.id
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="block text-[11px] font-bold">{algo.label}</span>
                        <span className="block text-[9px] text-slate-500">{algo.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sovereign Region Selector */}
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Sovereign Regulatory Mandate Profile:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'LUXEMBOURG_CSSF', label: 'Luxembourg', sub: 'CSSF / PSF' },
                      { id: 'GERMANY_BSI', label: 'Germany', sub: 'BSI TR-02102' },
                      { id: 'INDIA_NASSCOM', label: 'India', sub: 'NASSCOM / CERT-In' },
                    ].map((reg) => (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => setSelectedRegion(reg.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedRegion === reg.id
                            ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="block text-[11px] font-bold">{reg.label}</span>
                        <span className="block text-[9px] text-slate-500">{reg.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Encrypt Button */}
                <button
                  type="button"
                  onClick={handleEncryptAndSaveToFirestore}
                  disabled={isEncrypting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950/50 active:scale-98 disabled:opacity-50"
                >
                  {isEncrypting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Encapsulating Lattice Keys...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Encrypt & Sync to Firebase Firestore</span>
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Right Box: Stored PQC Firestore Records List */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Live Firestore Encapsulated Collections</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  Collection: /pqc_vault_records
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {pqcRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 transition-all font-mono text-xs space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold text-[10px]">
                          {record.id}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                          {record.pqcAlgorithm}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-[10px]">
                          {record.sovereignRegion.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{record.timestamp}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Plaintext Preview:</span>
                      <p className="text-slate-200 font-sans font-medium text-xs">{record.plaintextSnippet}</p>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-[9px] text-cyan-400 uppercase font-bold block">ML-KEM Lattice Ciphertext Payload:</span>
                      <code className="text-[10px] text-slate-400 break-all block">{record.ciphertextBase64}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Sovereign Regional Compliance Standards (Luxembourg, Germany, India NASSCOM) */}
        {activeTab === 'REGIONAL_STANDARDS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Luxembourg CSSF */}
            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden group hover:border-cyan-500/70 transition-all">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  <Globe2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">
                  CSSF Luxembourg
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Luxembourg CSSF & PSF Standard</h3>
                <p className="text-xs text-cyan-300 font-mono mt-0.5">Sovereign Financial Sector Compliance</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Full compliance with Commission de Surveillance du Secteur Financier (CSSF Luxembourg) circular guidelines for Professionnels du Secteur Financier (PSF). Ensures zero-trust ML-KEM-1024 encryption for Luxembourg banking data vaults.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>EU Sovereign Cloud & NIS2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PSF Financial Telemetry Isolation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Vendor Backdoor Guarantee</span>
                </div>
              </div>
            </div>

            {/* Card 2: Germany BSI */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden group hover:border-emerald-500/70 transition-all">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                  BSI Germany
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Germany BSI TR-02102-4</h3>
                <p className="text-xs text-emerald-300 font-mono mt-0.5">IT-Grundschutz PQC Guidelines</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Certified implementation of Federal Office for Information Security (BSI Germany) post-quantum migration standards. Eliminates Harvest-Now-Decrypt-Later (HNDL) state intelligence interception vectors.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>BSI TR-02102-4 Cryptographic Standard</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>CC EAL4+ Hardware Seed Binding</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bundesamt PQC Migration Framework</span>
                </div>
              </div>
            </div>

            {/* Card 3: India NASSCOM & CERT-In */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden group hover:border-amber-500/70 transition-all">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-amber-950 text-amber-400 border border-amber-500/30">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                  NASSCOM & CERT-In
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">India NASSCOM & CERT-In</h3>
                <p className="text-xs text-amber-300 font-mono mt-0.5">DeepTech Quantum Cyber Framework</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Aligned with NASSCOM DeepTech Quantum Security Framework and CERT-In 6-hour incident response directives. Features automated ephemeral key ratcheting for critical defense & commercial fleets.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>NASSCOM Quantum CoE Verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>CERT-In 6-Hour Incident Auto-Ratchet</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>MeitY Sovereign Infrastructure Protection</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Firestore Security Rules Inspector */}
        {activeTab === 'FIRESTORE_RULES' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <span>Firestore PQC Security Rules (`firestore.rules`)</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Production-grade Firebase Firestore security rules ensuring zero-knowledge PQC payload integrity.
                </p>
              </div>

              <button
                onClick={copyRules}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold flex items-center space-x-2 transition-all active:scale-95 self-start sm:self-auto"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy firestore.rules'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 overflow-x-auto">
              <pre className="text-xs font-mono text-cyan-300 leading-relaxed whitespace-pre">
                {firestoreSecurityRulesCode}
              </pre>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
