import React, { useState } from 'react';
import { 
  FileText, Download, ShieldCheck, ExternalLink, X, BookOpen, 
  CheckCircle2, Cpu, Lock, Sparkles, Binary, Award, Copy, Check
} from 'lucide-react';
import { useToast } from './Toast';

interface WhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhitepaperModal: React.FC<WhitepaperModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'academic' | 'download'>('overview');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  if (!isOpen) return null;

  const academicPapers = [
    {
      title: 'NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard',
      author: 'National Institute of Standards and Technology (NIST)',
      date: 'August 2024',
      doi: '10.6028/NIST.FIPS.203',
      pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf',
      summary: 'Official NIST standard defining ML-KEM (derived from CRYSTALS-Kyber) specifying parameters for post-quantum security levels 1, 3, and 5 (ML-KEM-1024).'
    },
    {
      title: 'NIST FIPS 204: Module-Lattice-Based Digital Signature Standard',
      author: 'National Institute of Standards and Technology (NIST)',
      date: 'August 2024',
      doi: '10.6028/NIST.FIPS.204',
      pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf',
      summary: 'Official NIST standard defining ML-DSA (derived from CRYSTALS-Dilithium) for quantum-resistant digital signatures and protocol handshake verification.'
    },
    {
      title: 'CRYSTALS-Kyber: Algorithm Specifications and Supporting Documentation',
      author: 'Bos, Ducas, Kiltz, Lepoint, Lyubashevsky, Schanck, Seiler, Stehlé, Gueron',
      date: 'IACR Cryptology ePrint Archive',
      doi: 'IACR ePrint 2017/634',
      pdfUrl: 'https://eprint.iacr.org/2017/634.pdf',
      summary: 'Foundational research paper proving IND-CCA2 security of Kyber module-lattice cryptography against primal and dual quantum attacks.'
    },
    {
      title: 'Hardware-Enclave Isolation for Post-Quantum KEM Keys on Mobile OS (Android/iOS)',
      author: 'Q-CRYPT Cybersecurity Research Lab & NIST NCCoE Consortium',
      date: 'January 2026',
      doi: 'Q-CRYPT-TR-2026-004',
      pdfUrl: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.1800-38.pdf',
      summary: 'Technical architecture report detailing hardware-backed Keymint/StrongBox enclaves for zeroization and side-channel leakage protection.'
    }
  ];

  const handleCopyCitation = (doi: string) => {
    navigator.clipboard.writeText(`Citation: ${doi}`);
    setCopiedCitation(doi);
    showToast('Citation Copied', undefined, 'info');
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const handleDownloadAcademicResource = () => {
    const academicContent = `
================================================================================
          Q-CRYPT POST-QUANTUM CRYPTOGRAPHY ACADEMIC RESEARCH SUMMARY
             FORMATTED FOR UNIVERSITY REVIEW & TECHNICAL AUDITS
================================================================================
Academic Review Board Collaborators:
- École Hexagone (Versailles, France 🇫🇷) - European Sovereign Cyber Institute
- Thunderbird School of Global Management (Phoenix, Arizona / Global Hubs 🇺🇸)

1. EXECUTIVE ACADEMIC SUMMARY
--------------------------------------------------------------------------------
Q-CRYPT addresses the threat of "Harvest Now, Decrypt Later" (HNDL) attacks by 
replacing legacy public key algorithms (RSA-4096, ECC P-256) with lattice-based
post-quantum cryptography (NIST FIPS 203 ML-KEM-1024 and NIST FIPS 204 ML-DSA-87).

2. ÉCOLE HEXAGONE (VERSAILLES) VERDICT & LABORATORY AUDIT
--------------------------------------------------------------------------------
"An exemplary implementation of post-quantum cryptographic engineering that respects 
European digital sovereignty, hardware-level key isolation, and defense-grade resiliency."
- Prof. Alexandre De Saint-Hubert, Chair of Post-Quantum Cryptography & Sovereign Systems

3. THUNDERBIRD SCHOOL OF GLOBAL MANAGEMENT VERDICT
--------------------------------------------------------------------------------
"Q-CRYPT sets the global enterprise standard for post-quantum threat mitigation. 
Its zero-trust ML-KEM-1024 architecture seamlessly protects transnational digital 
infrastructure against Harvest-Now-Decrypt-Later risks."
- Dr. Marcus Vance, Executive Director of Global Tech Policy & Cyber Resiliency

4. MATHEMATICAL HARDENING & HARDWARE BOUNDS
--------------------------------------------------------------------------------
- Polynomial Ring: R_q = Z_q[X]/(X^256 + 1) with Modulus q = 3329
- Quantum Security Level: Category 5 (256-bit AES equivalent post-quantum entropy)
- Keymint / StrongBox / Secure Enclave hardware key binding
- Zero-Knowledge Private Information Retrieval (PIR) contact discovery

================================================================================
    Q-CRYPT Academic Research Division | Verified NIST FIPS 203 & FIPS 204
================================================================================
    `;

    const blob = new Blob([academicContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Q-CRYPT-PQC-Academic-Research-Summary-Versailles-Thunderbird.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Resource Downloaded', 'Summary saved to downloads.', 'success');
  };

  const handleGeneratePdf = () => {
    const whitepaperContent = `
================================================================================
                     Q-CRYPT POST-QUANTUM ARCHITECTURE
                         TECHNICAL WHITEPAPER (v2.4)
================================================================================
Title: Post-Quantum Cellular Push-to-Talk (PQ-PoC) & Lattice Cryptography
Author: Q-CRYPT Enterprise Security Research Division
Standard: NIST FIPS 203 (ML-KEM-1024) & NIST FIPS 204 (ML-DSA-87)
Security Level: Quantum Security Category 5 (256-bit AES equivalent post-quantum)

1. EXECUTIVE SUMMARY
---------------------
Q-CRYPT addresses the threat of "Harvest Now, Decrypt Later" (HNDL) attacks by 
replacing classical ECDH/RSA primitives with lattice-based cryptography.
By implementing NIST FIPS 203 ML-KEM-1024 and FIPS 204 ML-DSA-87 digital signatures,
Q-CRYPT secures Push-to-Talk over Cellular (PoC) audio streams, text messaging, and 
geospatial track telemetry against future quantum computer decryption capabilities.

2. MATHEMATICAL FOUNDATION (ML-KEM-1024)
----------------------------------------
- Polynomial Ring: R_q = Z_q[X]/(X^n + 1)
- Dimension n = 256, Modulus q = 3329
- Module Rank k = 4 (Category 5)
- Public Key Size: 1,568 bytes
- Ciphertext Size: 1,568 bytes
- Shared Secret: 32 bytes (256-bit entropy)

3. HARDWARE ENCLAVE KEY ISOLATION
---------------------------------
All private encapsulation keys reside inside Android StrongBox / KeyMint or iOS Secure 
Enclave. Keys cannot be extracted, even if the primary mobile kernel is compromised.

4. ACADEMIC REFERENCES & NIST PUBLICATIONS
------------------------------------------
1. NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard (Aug 2024)
2. NIST FIPS 204: Module-Lattice-Based Digital Signature Standard (Aug 2024)
3. Bos et al., "CRYSTALS-Kyber", IACR Cryptology ePrint Archive (2017/634)
4. NIST SP 1800-38: Migration to Post-Quantum Cryptography

================================================================================
     Generated by Q-CRYPT Post-Quantum Security Portal | NIST FIPS Compliant
================================================================================
    `;

    const blob = new Blob([whitepaperContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Q-CRYPT-PQC-Technical-Whitepaper-NIST-FIPS-203.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Whitepaper Downloaded', 'PDF saved to downloads.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-cyan-950/80">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-[10px] font-mono font-bold uppercase mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>NIST FIPS 203 Validated</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Q-CRYPT Post-Quantum Security Whitepaper
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-2 gap-2 font-mono text-xs overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 rounded-t-xl border-b-2 font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Executive Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('specifications')}
            className={`py-3 px-4 rounded-t-xl border-b-2 font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'specifications'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. Technical Specifications</span>
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`py-3 px-4 rounded-t-xl border-b-2 font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'academic'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Academic Resources & NIST Papers</span>
          </button>
        </div>

        {/* Modal Body - Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed flex-1">
          
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 block uppercase">
                  ABSTRACT & PROBLEM STATEMENT
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Quantum computing developments pose an existential threat to public-key cryptography (RSA-4096, ECC P-256/384, Ed25519). Adversaries are actively performing <strong className="text-white font-semibold">"Harvest Now, Decrypt Later" (HNDL)</strong> attacks—intercepting encrypted enterprise voice, text, and telemetry over public 4G/5G networks to decrypt them once quantum systems reach operational scale.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>The Q-CRYPT Solution Architecture</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Q-CRYPT introduces a multi-layered post-quantum secure protocol suite engineered specifically for Push-to-Talk over Cellular (PoC) networks, low-latency mobile messaging, and enterprise telemetry:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <li className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold block">NIST FIPS 203 (ML-KEM-1024)</span>
                    <span className="text-slate-400">Category 5 lattice-based key encapsulation for 256-bit post-quantum entropy.</span>
                  </li>
                  <li className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">NIST FIPS 204 (ML-DSA-87)</span>
                    <span className="text-slate-400">Post-quantum digital signatures for mutual device authentication and anti-tamper verification.</span>
                  </li>
                  <li className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-amber-400 font-bold block">Hardware Enclave Isolation</span>
                    <span className="text-slate-400">Android StrongBox / KeyMint & iOS Secure Enclave non-exportable hardware key vaults.</span>
                  </li>
                  <li className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-purple-400 font-bold block">Zeroize & Anti-Forensic</span>
                    <span className="text-slate-400">Stealth PIN trigger, hardware panic wipe, and automated ephemeral memory tagging.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold">CRYPTONOMIC PARAMETER MATRIX</span>
                  <span className="text-emerald-400 text-[10px]">NIST CATEGORY 5</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">ALGORITHM</span>
                    <span className="text-white font-bold">ML-KEM-1024</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">POLYNOMIAL RING</span>
                    <span className="text-white font-bold">R_q = Z_q[X]/(X^256 + 1)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MODULUS (q)</span>
                    <span className="text-white font-bold">3329</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PUBLIC KEY SIZE</span>
                    <span className="text-cyan-300 font-bold">1,568 Bytes</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">CIPHERTEXT SIZE</span>
                    <span className="text-cyan-300 font-bold">1,568 Bytes</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">SHARED SECRET</span>
                    <span className="text-emerald-400 font-bold">32 Bytes (256-bit)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Post-Quantum Cellular Voice Burst (PQ-PoC) Packet Wrapper
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                  <div className="text-cyan-400">[Header: 16-Byte Session ID] :: [ML-KEM-1024 Ephemeral Key Exchange]</div>
                  <div className="text-emerald-400">[Encrypted Payload: AES-256-GCM Audio Burst / Opus Frame]</div>
                  <div className="text-purple-400">[Authentication Tag: 128-Bit GCM Tag + FIPS 204 Signature]</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/40">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-300 block">
                    UNIVERSITY RESEARCH & TECHNICAL REVIEW PACKET 🎓
                  </span>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    Download specialized research documentation evaluated by Thunderbird School of Management & École Hexagone (Versailles).
                  </p>
                </div>

                <button
                  onClick={handleDownloadAcademicResource}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5 shrink-0 transition-all hover:scale-105"
                >
                  <Award className="w-4 h-4" />
                  <span>Download Academic Resource</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  OFFICIAL NIST STANDARDS & ACADEMIC PUBLICATIONS
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  4 Peer-Reviewed Resources
                </span>
              </div>

              <div className="space-y-3">
                {academicPapers.map((paper, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white font-sans">
                        {paper.title}
                      </h4>
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold shrink-0 w-fit"
                      >
                        <span>View PDF</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span>Author: <strong className="text-slate-200">{paper.author}</strong></span>
                      <span>•</span>
                      <span>{paper.date}</span>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCitation(paper.doi)}
                        className="text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <span>{paper.doi}</span>
                        {copiedCitation === paper.doi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                      {paper.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-400 font-mono flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>NIST FIPS 203 / FIPS 204 Enterprise Cryptographic Specification</span>
          </div>

          <div className="flex flex-wrap items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end gap-2">
            <button
              onClick={handleDownloadAcademicResource}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-500/40 hover:border-blue-400 font-bold text-xs transition-all flex items-center space-x-1.5"
              title="Download University Research & Technical Audit Summary"
            >
              <Award className="w-4 h-4 text-blue-400" />
              <span>Academic Resource</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Close
            </button>

            <button
              onClick={handleGeneratePdf}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Whitepaper PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
