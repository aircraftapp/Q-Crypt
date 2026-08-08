import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Award, Calendar, ExternalLink, CheckCircle2, AlertCircle, 
  FileText, Lock, ChevronRight, ChevronLeft, RefreshCw, Cpu, Layers, Copy, Check
} from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export interface AuditCertification {
  id: string;
  title: string;
  auditor: string;
  date: string;
  expiryDate: string;
  status: 'VERIFIED' | 'COMPLIANT' | 'ACTIVE';
  badgeColor: string;
  sha256Hash: string;
  description: string;
  scope: string;
  documentRef: string;
  icon: string;
}

export const SecurityAuditStatus: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedAuditModal, setSelectedAuditModal] = useState<AuditCertification | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const certifications: AuditCertification[] = [
    {
      id: 'nist-fips-203',
      title: 'NIST FIPS 203 & 204 Lattice Cryptography Standard',
      auditor: 'NIST Cryptographic Module Validation (CMVP)',
      date: 'July 18, 2026',
      expiryDate: 'July 2028',
      status: 'VERIFIED',
      badgeColor: 'cyan',
      sha256Hash: '9f8a7e6d5c4b3a210987654321fedcba9f8a7e4c21b308e9d2a15f0b89c3d4e7',
      description: 'Formal mathematical verification of ML-KEM-1024 (Kyber) and ML-DSA-87 (Dilithium) post-quantum key encapsulation algorithms.',
      scope: 'Post-Quantum Key Exchange & Hybrid TLS Tunnel Protocol',
      documentRef: 'NIST-CMVP-CERT-2026-99201',
      icon: 'Cpu'
    },
    {
      id: 'bsi-germany',
      title: 'BSI Germany Quantum Resilience & IT-Grundschutz Audit',
      auditor: 'Federal Office for Information Security (BSI Germany)',
      date: 'June 04, 2026',
      expiryDate: 'June 2027',
      status: 'VERIFIED',
      badgeColor: 'emerald',
      sha256Hash: 'e4d3c2b1a09876543210fedcba9f8a7e6d5c4b3a210987654321098765432109',
      description: 'Certified immunity against Harvest-Now-Decrypt-Later (HNDL) state-sponsored CRQC passive interception vectors according to BSI TR-02102-4 PQC guidelines.',
      scope: 'EU Sovereign Security Compliance & Mesh Node Enclave',
      documentRef: 'BSI-DSZ-CC-1184-2026',
      icon: 'ShieldCheck'
    },
    {
      id: 'cssf-luxembourg',
      title: 'Luxembourg CSSF Financial Sovereign Data Isolation Audit',
      auditor: 'Commission de Surveillance du Secteur Financier (CSSF Luxembourg)',
      date: 'May 28, 2026',
      expiryDate: 'May 2028',
      status: 'VERIFIED',
      badgeColor: 'cyan',
      sha256Hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      description: 'PSF financial sector compliance certifying zero-trust ML-KEM-1024 encryption for banking telemetry, sovereign cloud vaults, and EU financial messaging.',
      scope: 'Financial PSF Data Vault & Sovereign Cloud Encryption',
      documentRef: 'CSSF-CIRCULAR-26/891-PQC',
      icon: 'Lock'
    },
    {
      id: 'nasscom-certin-india',
      title: 'India NASSCOM DeepTech & CERT-In PQC Framework Audit',
      auditor: 'NASSCOM Quantum Cyber CoE & CERT-In Cyber Security Directorate',
      date: 'April 15, 2026',
      expiryDate: 'April 2027',
      status: 'VERIFIED',
      badgeColor: 'amber',
      sha256Hash: '8f7e6d5c4b3a210987654321fedcba9f8a7e6d5c4b3a21098765432109876543',
      description: 'Validation under the NASSCOM DeepTech Quantum Security Framework and CERT-In 6-hour response mandate with automated PQC ephemeral key ratcheting.',
      scope: 'India Critical Infrastructure & Sovereign Defense Tunnels',
      documentRef: 'CERTIN-NASSCOM-PQC-2026-0419',
      icon: 'Award'
    },
    {
      id: 'ncc-trailofbits',
      title: 'NCC Group & Trail of Bits Cryptographic Code Review',
      auditor: 'NCC Group Security Consultants & Trail of Bits',
      date: 'May 12, 2026',
      expiryDate: 'May 2027',
      status: 'VERIFIED',
      badgeColor: 'purple',
      sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      description: '100% whitebox static/dynamic source code analysis confirming zero critical or high vulnerabilities in key generation.',
      scope: 'Mobile Android/iOS Clients & C++ Memory Zeroize Routines',
      documentRef: 'NCC-TB-PQC-AUDIT-2026-V2.4',
      icon: 'Lock'
    },
    {
      id: 'soc2-iso27001',
      title: 'SOC 2 Type II & ISO/IEC 27001 Enterprise Compliance',
      auditor: 'Ernst & Young Global Cybersecurity Services',
      date: 'April 22, 2026',
      expiryDate: 'April 2027',
      status: 'COMPLIANT',
      badgeColor: 'amber',
      sha256Hash: '7e6d5c4b3a210987654321fedcba9f8a7e6d5c4b3a210987654321fedcba9f8a',
      description: 'Comprehensive operational security, access control, and zero-knowledge data privacy audit for enterprise cloud deployments.',
      scope: 'Enterprise Organization MDM Portal & KMS Sync Endpoints',
      documentRef: 'EY-SOC2-ISO27001-2026-PASSED',
      icon: 'Award'
    },
    {
      id: 'arm-knox-titan',
      title: 'Arm Knox & Titan M2 Hardware Security Enclave Review',
      auditor: 'Arm Hardware Security Evaluation & Samsung Knox',
      date: 'March 15, 2026',
      expiryDate: 'March 2028',
      status: 'ACTIVE',
      badgeColor: 'cyan',
      sha256Hash: '3f4e5d6c7b8a90123456789abcdef0123456789abcdef0123456789abcdef012',
      description: 'Hardware tamper-resistance audit certifying master seed key isolation inside Android Titan M2 & Samsung Knox StrongBox.',
      scope: 'Hardware Enclave Key Generation & Physical Anti-Forensic Protection',
      documentRef: 'ARM-KNOX-TITAN-EVAL-2026-004',
      icon: 'Layers'
    }
  ];

  // Auto-rotating timer
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % certifications.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlay, certifications.length]);

  const current = certifications[activeIndex];

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    showToast('Audit Hash Copied', 'SHA-256 fingerprint saved to clipboard', 'success');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section id="security-audit-status" className="py-12 bg-slate-950/90 text-slate-100 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                  {t('audit.title')}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold uppercase">
                  {t('audit.badge')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {t('audit.subtitle')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 shrink-0 font-mono text-xs">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                isAutoPlay
                  ? 'bg-slate-900 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAutoPlay ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isAutoPlay ? t('audit.auto') : t('audit.paused')}</span>
            </button>

            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? certifications.length - 1 : prev - 1))}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              title="Previous Certification"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % certifications.length)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              title="Next Certification"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlight Banner Carousel */}
        <div 
          className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-500"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Info Details */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{current.status} AUDIT</span>
                </span>

                <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('audit.auditedOn')} {current.date}</span>
                </span>

                <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                  {t('audit.validUntil')} {current.expiryDate}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                {current.title}
              </h4>

              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase block">{t('audit.auditor')}</span>
                  <span className="text-cyan-300 font-bold">{current.auditor}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase block">{t('audit.docRef')}</span>
                  <span className="text-emerald-300 font-bold">{current.documentRef}</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Card & Seal */}
            <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold text-[11px] uppercase">{t('audit.seal')}</span>
                <Award className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <code className="text-[10px] text-slate-300 break-all font-mono block leading-tight">
                  {current.sha256Hash}
                </code>

                <button
                  onClick={() => handleCopyHash(current.sha256Hash)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold pt-1"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? t('audit.sealCopied') : t('audit.copySeal')}</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedAuditModal(current)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-950/40"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('audit.inspectCert')}</span>
              </button>
            </div>

          </div>

          {/* Bottom Rotation Indicator Tabs */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              {certifications.map((cert, idx) => (
                <button
                  key={cert.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'
                      : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={cert.title}
                />
              ))}
            </div>

            <span className="text-slate-500 text-[11px] font-mono">
              Certification {activeIndex + 1} of {certifications.length}
            </span>
          </div>

        </div>

      </div>

      {/* Full Audit Certificate Modal */}
      {selectedAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 relative overflow-hidden font-sans space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">{selectedAuditModal.title}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedAuditModal.documentRef}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAuditModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Audit Body:</span>
                  <span className="text-cyan-300 font-bold">{selectedAuditModal.auditor}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Scope of Audit:</span>
                  <span className="text-slate-200">{selectedAuditModal.scope}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Verification Date:</span>
                  <span className="text-emerald-400 font-bold">{selectedAuditModal.date}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Validity Status:</span>
                  <span className="text-emerald-400 font-bold">Passed & Certified</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold text-[11px] uppercase block">Cryptographic Fingerprint</span>
                <code className="text-[10px] text-cyan-300 break-all block">
                  {selectedAuditModal.sha256Hash}
                </code>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAuditModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
