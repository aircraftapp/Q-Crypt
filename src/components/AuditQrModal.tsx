import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, Smartphone, Copy, Check, ExternalLink, Download, 
  ShieldCheck, Sparkles, X, Share2, RefreshCw, Lock, ArrowUpRight
} from 'lucide-react';
import { AuditCertification } from './SecurityAuditStatus';
import { useToast } from './Toast';

interface AuditQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  certifications: AuditCertification[];
  activeCert: AuditCertification;
}

export const AuditQrModal: React.FC<AuditQrModalProps> = ({
  isOpen,
  onClose,
  certifications,
  activeCert
}) => {
  const { showToast } = useToast();
  const [selectedCertId, setSelectedCertId] = useState<string>(activeCert.id);
  const [includeHashParam, setIncludeHashParam] = useState<boolean>(true);
  const [includeTimestamp, setIncludeTimestamp] = useState<boolean>(true);
  const [qrSize, setQrSize] = useState<number>(200);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const qrRef = useRef<SVGSVGElement | null>(null);

  if (!isOpen) return null;

  const currentCert = certifications.find(c => c.id === selectedCertId) || activeCert;

  // Build the cryptographic verification deep link
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin + window.location.pathname;
    }
    return 'https://ais-dev-bbldqg56tduko2sprkltl6-1005525931747.europe-west2.run.app';
  };

  const buildVerificationUrl = () => {
    const base = getBaseUrl();
    const url = new URL(base);
    url.hash = 'security-audit-status';
    url.searchParams.set('verify', 'audit-summary');
    url.searchParams.set('cert', currentCert.id);
    url.searchParams.set('status', currentCert.status);
    url.searchParams.set('ref', currentCert.documentRef);

    if (includeHashParam) {
      url.searchParams.set('hash', currentCert.sha256Hash.slice(0, 16));
    }
    if (includeTimestamp) {
      url.searchParams.set('ts', Math.floor(Date.now() / 1000).toString());
    }
    return url.toString();
  };

  const verificationUrl = buildVerificationUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    showToast('Verification Link Copied', 'Mobile audit URL copied to clipboard.', 'success');
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleDownloadQr = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        // Draw crisp background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw QR in center
        ctx.drawImage(img, 50, 50, 500, 500);

        // Convert to PNG download
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `Q-CRYPT-Audit-QR-${currentCert.id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        downloadLink.remove();
        showToast('QR Code Exported', 'High-res QR Code PNG downloaded.', 'success');
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 relative overflow-hidden font-sans space-y-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Top Glow Ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 rounded-2xl text-cyan-400 shadow-inner">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-bold text-white font-sans tracking-tight">
                  Mobile Audit Verification QR
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold uppercase">
                  FIPS 203 Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Scan with any smartphone or enterprise scanner for cryptographic attestation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            aria-label="Close QR Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: QR & Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* QR Code Container */}
          <div className="md:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-xl space-y-4">
            <div className="relative p-3 bg-white rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.25)] border-4 border-cyan-400/30">
              <QRCodeSVG
                ref={qrRef}
                value={verificationUrl}
                size={qrSize}
                level={errorLevel}
                includeMargin={true}
                fgColor="#090d16"
                bgColor="#ffffff"
                imageSettings={{
                  src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%230284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
                  x: undefined,
                  y: undefined,
                  height: 28,
                  width: 28,
                  opacity: 1,
                  excavate: true,
                }}
              />
            </div>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Attestation Link</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Payload Size: {verificationUrl.length} chars • Level {errorLevel}
              </p>
            </div>

            {/* Quick Actions for QR */}
            <div className="flex items-center gap-2 w-full pt-1">
              <button
                onClick={handleDownloadQr}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs font-mono flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                title="Download High-Resolution PNG"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs font-mono flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                title="Copy verification deep link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Right Parameters & Customizer */}
          <div className="md:col-span-6 space-y-4 font-mono text-xs">
            
            {/* Standard / Certificate Selection */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold block text-[11px] uppercase flex items-center justify-between">
                <span>Select Target Certification:</span>
                <Lock className="w-3 h-3 text-cyan-400" />
              </label>
              <select
                value={selectedCertId}
                onChange={(e) => setSelectedCertId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                {certifications.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.auditor.split('(')[0].trim()})
                  </option>
                ))}
              </select>
            </div>

            {/* Verification Link Preview */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Encoded Deep-Link</span>
              <div className="p-2 rounded-lg bg-slate-900 text-[10px] text-cyan-300 font-mono break-all leading-tight max-h-16 overflow-y-auto select-all border border-slate-800">
                {verificationUrl}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <span className="text-slate-300 text-[11px]">Include SHA-256 Fingerprint Token</span>
                <input
                  type="checkbox"
                  checked={includeHashParam}
                  onChange={(e) => setIncludeHashParam(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                <span className="text-slate-300 text-[11px]">Include Ephemeral Timestamp Proof</span>
                <input
                  type="checkbox"
                  checked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Error Correction & Dimension Controls */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Error Tolerance</span>
                <div className="grid grid-cols-4 gap-1">
                  {(['L', 'M', 'Q', 'H'] as ('L' | 'M' | 'Q' | 'H')[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setErrorLevel(lvl)}
                      className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                        errorLevel === lvl
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Render Scale</span>
                <div className="grid grid-cols-3 gap-1">
                  {[160, 200, 240].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setQrSize(sz)}
                      className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                        qrSize === sz
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono relative z-10">
          <div className="flex items-center space-x-2 text-slate-400">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Compatible with iOS Camera, Google Lens & Android Barcode API</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center space-x-1.5 transition-all text-xs"
            >
              <span>Test Link</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold hover:from-cyan-400 hover:to-emerald-400 transition-all cursor-pointer text-xs"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
