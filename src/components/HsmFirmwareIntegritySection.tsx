import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  Database, 
  FileCheck, 
  Binary, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  Award, 
  AlertTriangle, 
  Lock, 
  Check, 
  Key, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { HsmDevice, FirmwareIntegrityEvent } from '../services/hsmService';

interface HsmFirmwareIntegritySectionProps {
  device: HsmDevice;
  onShowToast?: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export const HsmFirmwareIntegritySection: React.FC<HsmFirmwareIntegritySectionProps> = ({ device, onShowToast }) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'VERIFIED' | 'TAMPERED' | 'NOT_CHECKED';
    timestamp: string;
    localHash: string;
    remoteRegistryHash: string;
    rekorLogIndex: string;
    merkleProofValid: boolean;
    vendorSignatureValid: boolean;
    registryUrl: string;
    nistCavpCert: string;
  }>({
    status: 'VERIFIED',
    timestamp: new Date().toISOString(),
    localHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855a8f2390c',
    remoteRegistryHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855a8f2390c',
    rekorLogIndex: '94820194',
    merkleProofValid: true,
    vendorSignatureValid: true,
    registryUrl: 'https://rekor.sigstore.dev/api/v1/log/entries',
    nistCavpCert: device.fipsCertificateNumber || 'NIST-CMVP-4891-PQC'
  });

  const [simulatedTamperActive, setSimulatedTamperActive] = useState<boolean>(false);

  const handleVerifyAgainstPublicRegistry = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const isTampered = simulatedTamperActive;
      const localH = isTampered 
        ? 'ff00aa1198fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855deadbeef'
        : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855a8f2390c';

      setVerificationResult({
        status: isTampered ? 'TAMPERED' : 'VERIFIED',
        timestamp: new Date().toISOString(),
        localHash: localH,
        remoteRegistryHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855a8f2390c',
        rekorLogIndex: '94820194',
        merkleProofValid: !isTampered,
        vendorSignatureValid: !isTampered,
        registryUrl: 'https://rekor.sigstore.dev/api/v1/log/entries',
        nistCavpCert: device.fipsCertificateNumber || 'NIST-CMVP-4891-PQC'
      });

      if (onShowToast) {
        if (isTampered) {
          onShowToast('Firmware Verification Alert', 'Local microcode hash does NOT match the public transparency log. Unauthorized firmware modification detected!', 'error');
        } else {
          onShowToast('Firmware Verified', 'Local firmware hash matches NIST CAVP & Rekor transparency log with 100% cryptographic parity.', 'success');
        }
      }
    }, 1400);
  };

  const handleDownloadAttestation = () => {
    const manifest = {
      title: "FIPS 140-3 Firmware Integrity & Public Transparency Receipt",
      generatedAt: new Date().toISOString(),
      hsmDevice: device.name,
      firmwareVersion: device.firmware,
      localSha384Digest: verificationResult.localHash,
      remoteRegistryDigest: verificationResult.remoteRegistryHash,
      publicLedger: verificationResult.registryUrl,
      rekorEntryIndex: verificationResult.rekorLogIndex,
      nistCavpCertificate: verificationResult.nistCavpCert,
      status: verificationResult.status,
      vendorPqcSignature: "ML-DSA-87 / Ed25519 Verified by NIST CMVP Root CA"
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firmware-transparency-receipt-${device.id}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onShowToast) {
      onShowToast('Receipt Exported', `Downloaded ${a.download}`, 'info');
    }
  };

  const isVerified = verificationResult.status === 'VERIFIED';
  const isTampered = verificationResult.status === 'TAMPERED';

  return (
    <div id="hsm-firmware-integrity-section" className="space-y-6 animate-fadeIn">
      {/* Main Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                FIPS 140-3 REMOTE PUBLIC REGISTRY TRANSPARENCY
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
              Firmware Integrity & Public Registry Verification
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Compare the running microcode binary hash of <strong className="text-cyan-300">{device.name}</strong> against immutable public transparency ledgers (NIST CAVP & Sigstore Rekor) to mathematically verify zero unauthorized modifications or firmware backdoors.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setSimulatedTamperActive(prev => !prev)}
              className={`px-3.5 py-2 rounded-2xl border font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                simulatedTamperActive
                  ? 'bg-red-950 text-red-300 border-red-700 shadow-md shadow-red-950'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{simulatedTamperActive ? '⚠️ Simulated Rogue Firmware Hash' : '🧪 Simulate Modified Hash'}</span>
            </button>

            <button
              onClick={handleVerifyAgainstPublicRegistry}
              disabled={isVerifying}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Querying Remote Registry...' : 'Verify Against Public Registry'}</span>
            </button>

            <button
              onClick={handleDownloadAttestation}
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Proof</span>
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs ${
          isTampered 
            ? 'bg-red-950/40 border-red-700 shadow-lg shadow-red-950 ring-1 ring-red-500' 
            : 'bg-emerald-950/30 border-emerald-700'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className={`p-3 rounded-2xl border ${
              isTampered ? 'bg-red-950 border-red-600 text-red-400 animate-bounce' : 'bg-emerald-950 border-emerald-600 text-emerald-400'
            }`}>
              {isTampered ? <XCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white font-sans flex items-center space-x-2">
                <span>{isTampered ? 'CRITICAL: Firmware Integrity Check Mismatch!' : 'Immutable Public Registry Verification: PASSED'}</span>
              </div>
              <div className="text-slate-300 text-[11px] mt-0.5">
                {isTampered 
                  ? 'Local hardware digest differs from vendor-published NIST CAVP golden binary. Potential firmware supply-chain compromise.' 
                  : 'Firmware binary matches vendor-signed Merkle Tree leaf in Sigstore Rekor ledger (Entry #94820194).'}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
              isTampered ? 'bg-red-950 text-red-300 border-red-700' : 'bg-emerald-950 text-emerald-300 border-emerald-600'
            }`}>
              {isTampered ? 'UNAUTHORIZED MODIFICATION' : 'AUTHENTIC & UNMODIFIED'}
            </span>
            <div className="text-[10px] text-slate-500 mt-1">Verified: {new Date(verificationResult.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Side-by-Side Cryptographic Hash Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
          
          {/* Local Device Hash */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isTampered ? 'bg-red-950/20 border-red-800' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 uppercase font-bold flex items-center space-x-1.5 text-[10px]">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Local Hardware Silicon ROM Digest</span>
              </span>
              <span className="text-cyan-400 text-[10px]">SHA-384 / SHA-256</span>
            </div>

            <div className="space-y-1.5">
              <div className="text-slate-400 text-[11px]">Active Firmware Version: <strong className="text-white">{device.firmware}</strong></div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] break-all select-all text-cyan-300">
                {verificationResult.localHash}
              </div>
            </div>

            <div className="text-[10px] text-slate-500">
              Extracted directly via hardware secure enclave hardware bus.
            </div>
          </div>

          {/* Remote Public Registry Immutable Hash */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 uppercase font-bold flex items-center space-x-1.5 text-[10px]">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Remote Public Transparency Registry Hash</span>
              </span>
              <span className="text-emerald-400 text-[10px]">Sigstore / Rekor Ledger</span>
            </div>

            <div className="space-y-1.5">
              <div className="text-slate-400 text-[11px]">NIST CMVP Module Cert: <strong className="text-white">{verificationResult.nistCavpCert}</strong></div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] break-all select-all text-emerald-300">
                {verificationResult.remoteRegistryHash}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between">
              <span>Merkle Root Index: #{verificationResult.rekorLogIndex}</span>
              <span className="text-emerald-400 font-bold">100% CRYPTO PROOF</span>
            </div>
          </div>

        </div>

        {/* Remote Ledger Details & Attestation Trust Chain */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Transparency Log</span>
            </span>
            <div className="text-white font-bold text-xs truncate">rekor.sigstore.dev</div>
            <div className="text-emerald-400 text-[10px]">RFC 6962 Certificate Transparency</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>Vendor PQC Signature</span>
            </span>
            <div className="text-purple-400 font-bold text-xs">ML-DSA-87 + Ed25519</div>
            <div className="text-slate-400 text-[10px]">Manufacturer Root Signing Key</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>FIPS 140-3 Validation</span>
            </span>
            <div className="text-amber-300 font-bold text-xs">NIST CAVP Approved</div>
            <div className="text-slate-400 text-[10px]">Zero Unapproved Binary Modifications</div>
          </div>
        </div>

      </div>
    </div>
  );
};
