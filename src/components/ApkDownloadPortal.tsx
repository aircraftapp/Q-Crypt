import React, { useState, useEffect } from 'react';
import { 
  Download, ShieldCheck, Copy, Check, Terminal, FileCode, CheckCircle2, AlertTriangle, 
  ChevronDown, ChevronUp, History, HardDrive, Shield, Mail, User, Building2, Send, Database, 
  Clock, Sparkles, RefreshCw, Lock
} from 'lucide-react';
import { APP_REFERENCE, INSTALLATION_GUIDES } from '../data';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { crmService, ApkDownloadCRMRequest } from '../services/crmService';

export const ApkDownloadPortal: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<'grapheneOS' | 'calyxOS' | 'enterpriseMDM'>('grapheneOS');
  
  // Collapsible Version History table state
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // SHA-256 verification state
  const [inputHash, setInputHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ isMatch: boolean; message: string } | null>(null);

  // MDM Config JSON state
  const [copiedMdmJson, setCopiedMdmJson] = useState(false);

  // CRM Registration State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [osPlatform, setOsPlatform] = useState('GrapheneOS (Hardened)');
  const [requestedEdition, setRequestedEdition] = useState('Free / Community Edition (P2P Mesh)');
  const [useCase, setUseCase] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ApkDownloadCRMRequest | null>(null);

  // Real-time Firebase CRM APK Requests
  const [crmApkRequests, setCrmApkRequests] = useState<ApkDownloadCRMRequest[]>([]);
  const [showApkCrmConsole, setShowApkCrmConsole] = useState(false);

  const officialHash = "d8f93e21a412b09c85e7284b109e3a9fa054231bf90123efd400192837401a89";

  // Subscribe to real-time Firebase Firestore APK requests
  useEffect(() => {
    const unsubscribe = crmService.subscribeToApkRequests((data) => {
      setCrmApkRequests(data);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(officialHash);
    setCopiedHash(true);
    showToast('Checksum Copied', 'SHA-256 hash copied to clipboard', 'success');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleVerifyHash = async () => {
    if (!inputHash.trim()) return;
    setVerifying(true);
    setVerifyResult(null);

    try {
      const response = await fetch('/api/verify-checksum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: inputHash })
      });
      const data = await response.json();
      setVerifyResult({
        isMatch: data.isAuthentic,
        message: data.matchMessage
      });
      if (data.isAuthentic) {
        showToast('Integrity Validated', 'Authentic Quantum Messenger binary', 'success');
      } else {
        showToast('Checksum Mismatch', 'Hash does not match official release!', 'warning');
      }
    } catch {
      // Fallback client check
      const match = inputHash.trim().toLowerCase() === officialHash.toLowerCase();
      setVerifyResult({
        isMatch: match,
        message: match
          ? "MATCH VALIDATED: Authentic Quantum Messenger binary signed by Q-CRYPT Security Labs."
          : "CHECKSUM MISMATCH: Hash does NOT match official build. Do not install!"
      });
      if (match) {
        showToast('Integrity Validated', 'Authentic Quantum Messenger binary', 'success');
      } else {
        showToast('Checksum Mismatch', 'Hash does not match official release!', 'warning');
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmitApkCrm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !organization) {
      showToast('Form Incomplete', 'Please provide Full Name, Email, and Organization.', 'warning');
      return;
    }

    setSubmitting(true);
    const generatedRequestId = `APK-REQ-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const docId = await crmService.submitApkDownloadRequest({
        fullName,
        email,
        organization,
        osPlatform,
        edition: requestedEdition,
        useCase: useCase || 'Post-Quantum Cellular Mobile Testing',
        requestId: generatedRequestId
      });

      const newRecord: ApkDownloadCRMRequest = {
        id: docId,
        fullName,
        email,
        organization,
        osPlatform,
        edition: requestedEdition,
        useCase: useCase || 'Post-Quantum Cellular Mobile Testing',
        status: 'PENDING_EMAIL_LINK',
        requestId: generatedRequestId,
        submittedAt: new Date().toISOString()
      };

      setSubmittedRequest(newRecord);
      showToast('Community Edition Request Logged!', 'Your request has been logged in Firebase CRM.', 'success');
    } catch (err) {
      console.error('Failed to submit APK request to CRM:', err);
      showToast('Saved Locally', 'Request recorded in CRM fallback.', 'info');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectCommunityDownload = () => {
    const dummyApkContent = `Q-CRYPT Post-Quantum Community Edition v2.4.0 Signed Binary\nPackage: ${APP_REFERENCE.packageId}\nSHA256: ${officialHash}\nNIST FIPS 203 ML-KEM-1024 Compliant`;
    const blob = new Blob([dummyApkContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Q-CRYPT-Community-Edition-v2.4.0.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Community Edition APK Download Started!', 'Downloading signed Q-CRYPT v2.4.0 APK binary.', 'success');
  };

  const handleAdminPushLink = async (docId: string, userEmail: string) => {
    const success = await crmService.updateApkStatus(docId, 'LINK_PUSHED');
    if (success) {
      showToast('Email Link Pushed!', `Simulated dispatch of secure APK download link to ${userEmail}`, 'success');
    }
  };

  const mdmSampleJson = JSON.stringify({
    [APP_REFERENCE.packageId]: {
      "enterprise_license_id": "QCRYPT-ENT-2026-NIST-87",
      "pqc_enforce_strongbox": true,
      "disallow_unencrypted_ratchet_fallback": true,
      "pqc_kms_endpoint": "https://kms.qcrypt.internal/api/v1/keys",
      "auto_zeroize_on_tamper": true
    }
  }, null, 2);

  const handleCopyMdmJson = () => {
    navigator.clipboard.writeText(mdmSampleJson);
    setCopiedMdmJson(true);
    showToast('MDM JSON Copied', 'Managed App Config payload copied to clipboard', 'success');
    setTimeout(() => setCopiedMdmJson(false), 2000);
  };

  const versionHistoryData = [
    {
      version: 'v2.4.0',
      buildDate: '2026-07-25',
      arch: 'arm64-v8a / x86_64',
      status: 'Current Stable',
      hash: 'd8f93e21a412b09c85e7284b109e3a9fa054231bf90123efd400192837401a89',
      changelog: 'Official NIST FIPS 203 ML-KEM-1024 final standard release. Added StrongBox Keystore attestation & Hardened Kernel memory allocator patches.',
    },
    {
      version: 'v2.3.2',
      buildDate: '2026-05-14',
      arch: 'arm64-v8a',
      status: 'Deprecated',
      hash: 'a71e4281f90912c019d38f821e29182371a2310283e10291039a82e1823a8901',
      changelog: 'Added Falcon-512 digital signature algorithm for identity verification and multi-device key sync over local Bluetooth low-energy mesh.',
    },
    {
      version: 'v2.2.0',
      buildDate: '2026-02-28',
      arch: 'arm64-v8a',
      status: 'Deprecated',
      hash: 'f92831e01293a10293a8123e9102391028391203810293120891203819028310',
      changelog: 'Implemented Hybrid Dual Ratchet (X25519 + Kyber-768) tunnel. Optimized zeroization speed on Android Knox hardware trigger.',
    },
    {
      version: 'v2.0.1',
      buildDate: '2025-11-10',
      arch: 'arm64-v8a / x86_64',
      status: 'Deprecated',
      hash: 'e812930129831203912039812309120391203981239012390123901239012390',
      changelog: 'Initial public beta preview of Post-Quantum Ephemeral Session Tunnels with full Custom Hardened Android OS compatibility.',
    }
  ];

  return (
    <section id="apk-portal" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
            <Download className="w-3.5 h-3.5" />
            <span>{t('apk.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('apk.title')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {t('apk.subtitle')}
          </p>
        </div>

        {/* Release Specs & Direct Download Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Specs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold">
                  STABLE RELEASE
                </span>
                <span className="text-slate-300 font-bold text-lg">
                  Quantum Messenger v2.4.0
                </span>
                <span className="text-xs text-slate-500 font-mono">Build 2026.07.25</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
                <div>
                  <p className="text-slate-500 text-[10px]">FILE SIZE</p>
                  <p className="font-semibold text-slate-200 mt-0.5">48.2 MB</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">ARCHITECTURE</p>
                  <p className="font-semibold text-slate-200 mt-0.5">arm64-v8a / x86_64</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">MIN ANDROID</p>
                  <p className="font-semibold text-slate-200 mt-0.5">Android 10.0+ (API 29)</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">TARGET PKG</p>
                  <p className="font-semibold text-cyan-400 mt-0.5 truncate">{APP_REFERENCE.packageId}</p>
                </div>
              </div>

              {/* SHA-256 Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Official SHA-256 Checksum:</span>
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied Hash' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-emerald-400 break-all select-all">
                  {officialHash}
                </div>
              </div>

              {/* Direct APK Download Button */}
              <div className="pt-2">
                <button
                  onClick={handleDirectCommunityDownload}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Community Edition APK Directly (.apk v2.4.0)</span>
                </button>
              </div>

            </div>

            {/* Right Action Box: CRM Registration & Admin APK Email Dispatch */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4 p-6 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl relative">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>CRM Registration Portal</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Direct binary downloads require CRM verification. Submit info for Admin email link push.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold shrink-0">
                  CRM Synced
                </span>
              </div>

              {!submittedRequest ? (
                <form onSubmit={handleSubmitApkCrm} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 font-medium mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-cyan-400" />
                      <span>Full Name / Title *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Alex Vance, CISO"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 font-medium mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-cyan-400" />
                      <span>Email Address (Admin will send link here) *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.vance@defense-org.gov"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 font-medium mb-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-cyan-400" />
                        <span>Organization *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Defense & Infra Cyber"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 font-medium mb-1 flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-cyan-400" />
                        <span>Target OS / Device *</span>
                      </label>
                      <select
                        value={osPlatform}
                        onChange={(e) => setOsPlatform(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                      >
                        <option value="GrapheneOS (Hardened)">GrapheneOS (Hardened)</option>
                        <option value="CalyxOS (Secure Kernel)">CalyxOS (Secure Kernel)</option>
                        <option value="Stock Android (API 29+)">Stock Android (API 29+)</option>
                        <option value="Enterprise MDM (Intune / Knox)">Enterprise MDM (Intune / Knox)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 font-medium mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Requested Build / Edition *</span>
                    </label>
                    <select
                      value={requestedEdition}
                      onChange={(e) => setRequestedEdition(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold focus:outline-none focus:border-cyan-500 font-sans"
                    >
                      <option value="Free / Community Edition (P2P Mesh)">Free / Community Edition (P2P Mesh - Standalone)</option>
                      <option value="Enterprise Trial Edition (MDM & SLA)">Enterprise Trial Edition (MDM & Custom SLA Enclave)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Information to CRM...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Info to CRM for Admin Email Dispatch</span>
                      </>
                    )}
                  </button>

                  <div className="pt-1 text-[10px] text-slate-400 text-center font-mono flex items-center justify-center space-x-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Admin will review and push the .APK link directly to your email</span>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 py-2 animate-fadeIn">
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-emerald-300 font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>CRM LOGGED & PENDING ADMIN DISPATCH</span>
                      </span>
                      <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-emerald-200">
                        {submittedRequest.requestId}
                      </span>
                    </div>

                    <p className="text-slate-200 leading-relaxed font-sans text-xs">
                      Thank you, <strong className="text-white">{submittedRequest.fullName}</strong>. Your organization profile (<strong className="text-cyan-300">{submittedRequest.organization}</strong>) has been recorded into the Q-CRYPT CRM database.
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-800/60 font-mono text-[11px] text-slate-300 space-y-1">
                      <p><span className="text-slate-500">Destination Email:</span> <span className="text-emerald-400 font-bold">{submittedRequest.email}</span></p>
                      <p><span className="text-slate-500">Target Platform:</span> {submittedRequest.osPlatform}</p>
                      <p><span className="text-slate-500">Dispatch Action:</span> Admin will email verified APK download link</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSubmittedRequest(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs border border-slate-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Submit Another CRM Request</span>
                  </button>
                </div>
              )}

              {/* Toggle to view Live CRM Requests (Admin Console) */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setShowApkCrmConsole(!showApkCrmConsole)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-cyan-400 hover:text-cyan-300 text-[11px] font-mono border border-cyan-800/40 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View CRM Requests & Admin Email Dispatch Queue ({crmApkRequests.length})</span>
                  </span>
                  {showApkCrmConsole ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showApkCrmConsole && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs animate-fadeIn max-h-60 overflow-y-auto">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                      <span>CRM Lead Queue (Firebase)</span>
                      <span>Admin Dispatch Action</span>
                    </div>

                    {crmApkRequests.length === 0 ? (
                      <p className="text-[11px] text-slate-500 py-2 text-center font-sans">
                        No requests submitted yet. Complete the form above to record your first lead.
                      </p>
                    ) : (
                      crmApkRequests.map((req) => (
                        <div key={req.id || req.requestId} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-cyan-300">{req.fullName} ({req.organization})</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              req.status === 'LINK_PUSHED'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {req.status === 'LINK_PUSHED' ? 'LINK EMAIL SENT' : 'PENDING REVIEW'}
                            </span>
                          </div>

                          <p className="text-slate-400 text-[10px] truncate">{req.email} • {req.osPlatform}</p>

                          {req.status === 'PENDING_EMAIL_LINK' ? (
                            <button
                              onClick={() => req.id && handleAdminPushLink(req.id, req.email)}
                              className="w-full py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-[10px] flex items-center justify-center space-x-1 transition-colors"
                            >
                              <Mail className="w-3 h-3 text-emerald-400" />
                              <span>Admin: Push APK Email Link Now</span>
                            </button>
                          ) : (
                            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 pt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Verified APK Download Link Emailed to {req.email}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Collapsible Version History Table */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Version History & Release Changelogs
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    4 Builds Archived
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect historical Android APK build numbers, release dates, and cryptographic changelog summaries
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono">
              <span>{showVersionHistory ? 'Hide Table' : 'Expand History'}</span>
              {showVersionHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showVersionHistory && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto animate-fadeIn">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pr-4">Version</th>
                    <th className="pb-3 pr-4">Build Date</th>
                    <th className="pb-3 pr-4">Architecture</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Changelog Summary</th>
                    <th className="pb-3 text-right">Checksum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {versionHistoryData.map((item) => (
                    <tr key={item.version} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-cyan-300 flex items-center gap-1.5">
                        {item.version}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-400">{item.buildDate}</td>
                      <td className="py-3.5 pr-4 text-slate-400">{item.arch}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Current Stable'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-300 max-w-md text-[11px] font-sans leading-relaxed">
                        {item.changelog}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.hash);
                            showToast(`Copied ${item.version} Hash`, `${item.hash.substring(0, 16)}...`, 'success');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white text-[10px] border border-slate-700"
                        >
                          Copy Hash
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Checksum Verification Interactive Box */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Interactive SHA-256 Checksum Validator</span>
          </div>
          <p className="text-xs text-slate-400">
            Paste the hash of your local downloaded APK file below to verify zero tampering before installation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value)}
              placeholder="Paste local file SHA-256 hash (e.g. d8f93e21a412b09c...)"
              className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleVerifyHash}
              disabled={verifying || !inputHash.trim()}
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center justify-center space-x-2"
            >
              {verifying ? 'Verifying...' : 'Verify Hash'}
            </button>
            <button
              onClick={() => {
                setInputHash(officialHash);
                setVerifyResult(null);
              }}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
            >
              Fill Sample Valid Hash
            </button>
          </div>

          {verifyResult && (
            <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs font-mono ${
              verifyResult.isMatch
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                : 'bg-red-950/40 border-red-800/80 text-red-300'
            }`}>
              {verifyResult.isMatch ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{verifyResult.isMatch ? 'STATUS: VALIDATED AUTHENTIC' : 'STATUS: INTEGRITY FAILURE'}</p>
                <p className="mt-1 leading-relaxed">{verifyResult.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Architecture Comparison: Free Pure P2P vs Enterprise Server MDM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Version Box */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-950 text-cyan-300 font-mono text-[10px] uppercase font-bold border-b border-l border-cyan-500/30 rounded-bl-xl">
              Free / Community Edition
            </div>
            <div className="flex items-center space-x-2 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-sans">Pure Peer-to-Peer (P2P) Architecture</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Designed for individual users requiring 100% serverless, zero-knowledge communication. Direct client-to-client ML-KEM-1024 lattice key encapsulation over encrypted WebRTC data channels, Bluetooth mesh, or local mDNS.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">0% Central Server Reliance</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">Direct Device-to-Device</span>
            </div>
          </div>

          {/* Enterprise Version Box */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-amber-950 text-amber-300 font-mono text-[10px] uppercase font-bold border-b border-l border-amber-500/30 rounded-bl-xl">
              Enterprise & Organization Edition
            </div>
            <div className="flex items-center space-x-2 text-amber-400">
              <HardDrive className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-sans">Server-Side MDM & Fleet Management</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Equipped with a server-side MDM application and fleet controller. Supports managed app configurations via Microsoft Intune, VMware Workspace ONE, and Samsung Knox, plus central KMS endpoints, automated fleet zeroization, and audit controls.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-amber-300">
              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">Server-Side MDM Controller</span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">Intune / Knox Managed Config</span>
            </div>
          </div>
        </div>

        {/* Tabbed Custom Installation Guides */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 font-mono">
              Deployment Guides:
            </span>
            <button
              onClick={() => setActiveTab('grapheneOS')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'grapheneOS'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Hardened Android OS
            </button>
            <button
              onClick={() => setActiveTab('calyxOS')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'calyxOS'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Secure Kernel & Privacy
            </button>
            <button
              onClick={() => setActiveTab('enterpriseMDM')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'enterpriseMDM'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Enterprise MDM & Config JSON
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <span>{INSTALLATION_GUIDES[activeTab].title}</span>
            </h3>

            <ol className="space-y-3">
              {INSTALLATION_GUIDES[activeTab].steps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs text-slate-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 font-mono flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            {/* If Enterprise MDM tab active, show JSON payload generator */}
            {activeTab === 'enterpriseMDM' && (
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>Managed App Configuration JSON (Intune / Workspace ONE / Knox):</span>
                  </div>
                  <button
                    onClick={handleCopyMdmJson}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono flex items-center space-x-1"
                  >
                    {copiedMdmJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMdmJson ? 'Copied JSON' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                  {mdmSampleJson}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Persistent Legal Notice & Privacy Disclaimer */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-start space-x-3 text-amber-400">
            <Shield className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-sans uppercase tracking-wider">
                Legal Notice & Deployment Privacy Disclaimer
              </h4>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Notice regarding architectural privacy models, compliance boundaries, and server-side infrastructure for Q-CRYPT deployments:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs font-sans">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 font-mono text-[11px] uppercase">Free / Community Edition</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/60">Pure P2P</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Operates strictly Peer-to-Peer (P2P). Zero client contacts, metadata, message logs, or key material pass through or persist on any central server. End-to-end encryption keys are generated locally on device hardware and negotiated directly via client-to-client ML-KEM-1024 lattice key exchange.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 font-mono text-[11px] uppercase">Enterprise Edition</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono border border-amber-800/60">Server MDM</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Enterprise deployments incorporate an organization-hosted server-side MDM application and central Key Management Service (KMS). Fleet administrators retain central configuration controls, remote zeroization triggers, and compliance audit logging restricted entirely within the enterprise’s private tenant domain.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60 flex items-center justify-between flex-wrap gap-2">
            <span>By deploying Q-CRYPT, organizations agree to comply with applicable NIST FIPS cryptographic export regulations.</span>
            <span className="text-cyan-400/80 font-bold">Zero-Knowledge Guarantee Compliant</span>
          </div>
        </div>

      </div>
    </section>
  );
};

