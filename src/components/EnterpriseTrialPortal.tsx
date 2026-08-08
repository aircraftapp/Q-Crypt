import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, Download, Check, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, 
  Database, RefreshCw, Clock, Tag, ExternalLink, ShieldAlert, FileText, ChevronRight
} from 'lucide-react';
import { EnterpriseLicense } from '../types';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { crmService, EnterpriseTrialCRMRequest } from '../services/crmService';

export const EnterpriseTrialPortal: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [enterpriseName, setEnterpriseName] = useState('');
  const [email, setEmail] = useState('');
  const [seats, setSeats] = useState(100);
  const [complianceNeeds, setComplianceNeeds] = useState<string[]>(['NIST-FIPS-203', 'SOC2-TYPE-II']);
  const [slaTier, setSlaTier] = useState<'24/7 Priority SLA' | 'Standard Enterprise SLA' | 'Sovereignty Custom SLA'>('24/7 Priority SLA');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [license, setLicense] = useState<EnterpriseLicense | null>(null);

  // Firebase CRM Leads State
  const [crmRequests, setCrmRequests] = useState<EnterpriseTrialCRMRequest[]>([]);
  const [showCrmDashboard, setShowCrmDashboard] = useState(false);
  const [firebaseDocId, setFirebaseDocId] = useState<string | null>(null);

  // Subscribe to real-time Firebase Firestore CRM leads
  useEffect(() => {
    const unsubscribe = crmService.subscribeToTrialRequests((data) => {
      setCrmRequests(data);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const complianceOptions = [
    { id: 'NIST-FIPS-203', label: 'NIST FIPS 203 (ML-KEM-1024)' },
    { id: 'LUX-CSSF-PSF', label: 'Luxembourg CSSF / Financial PSF Sovereign' },
    { id: 'DE-BSI-TR02102', label: 'Germany BSI TR-02102-4 / IT-Grundschutz' },
    { id: 'IN-NASSCOM-CERTIN', label: 'India NASSCOM & CERT-In PQC Directive' },
    { id: 'HIPAA', label: 'HIPAA Health Security' },
    { id: 'FedRAMP', label: 'FedRAMP High Baseline' },
    { id: 'DEFENSE-CLASS4', label: 'Class-4 Defense Standard' },
    { id: 'SOC2-TYPE-II', label: 'SOC 2 Type II' },
  ];

  const slaOptions: Array<{ id: '24/7 Priority SLA' | 'Standard Enterprise SLA' | 'Sovereignty Custom SLA'; title: string; desc: string }> = [
    { 
      id: '24/7 Priority SLA', 
      title: '24/7 Priority Quantum SLA', 
      desc: '15-min emergency response, 99.999% uptime guarantee & dedicated CISO hotline.' 
    },
    { 
      id: 'Standard Enterprise SLA', 
      title: 'Standard Enterprise SLA', 
      desc: '4-hour response window, business-hours technical support & standard KMS updates.' 
    },
    { 
      id: 'Sovereignty Custom SLA', 
      title: 'Air-Gapped Sovereign SLA', 
      desc: 'On-premise hardware dispatch, custom HSM integration & zero-cloud deployment guarantees.' 
    }
  ];

  const toggleCompliance = (id: string) => {
    if (complianceNeeds.includes(id)) {
      setComplianceNeeds(complianceNeeds.filter(c => c !== id));
    } else {
      setComplianceNeeds([...complianceNeeds, id]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!enterpriseName || !email) {
        showToast('Required Fields Missing', 'Please fill in Organization Name and Email', 'warning');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enterpriseName || !email) return;

    setSubmitting(true);
    let generatedLicenseId = `QCRYPT-ENT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
    let generatedPocKey = `kyber1024_poc_${Math.random().toString(36).substring(2, 16)}`;

    try {
      // 1. Submit request to Backend API
      const response = await fetch('/api/enterprise-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enterpriseName,
          email,
          seats,
          complianceNeeds,
          slaTier,
          notes
        })
      });
      const data = await response.json();
      if (data.success && data.license) {
        generatedLicenseId = data.license.licenseId;
        generatedPocKey = data.license.pocKey;
      }
    } catch (err) {
      console.warn('API submission fallback to client direct:', err);
    }

    // 2. Persist directly into Firebase Firestore CRM database
    try {
      const docId = await crmService.submitTrialRequest({
        enterpriseName,
        contactEmail: email,
        seats,
        complianceNeeds,
        notes,
        requestedSla: `${slaTier} (${seats} Seats)`,
        slaTier,
        licenseId: generatedLicenseId,
        pocKey: generatedPocKey
      });

      setFirebaseDocId(docId);

      setLicense({
        licenseId: generatedLicenseId,
        enterpriseName,
        contactEmail: email,
        provisionedSeats: seats,
        complianceScope: complianceNeeds,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        pocKey: generatedPocKey,
        status: "ACTIVE_PROOFOFCONCEPT",
        downloadUrl: "#"
      });

      setStep(3);
      showToast('Firebase CRM Recorded', 'Trial Request & Security SLA saved in Firestore database', 'success');
    } catch (firebaseErr) {
      console.error('Firebase CRM save error:', firebaseErr);
      showToast('Trial Created', 'Enterprise PoC License Generated', 'info');
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: EnterpriseTrialCRMRequest['status']) => {
    const success = await crmService.updateStatus(id, newStatus);
    if (success) {
      showToast('Status Updated', `CRM Lead status changed to ${newStatus}`, 'success');
    }
  };


  const handleDownloadLicenseFile = () => {
    if (!license) return;
    const jsonStr = JSON.stringify(license, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${license.enterpriseName.replace(/\s+/g, '_')}_QCRYPT_PoC_License.qcrypt-license`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded License', '.qcrypt-license saved to disk', 'success');
  };

  const totalSteps = 3;
  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <section id="enterprise-portal" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('enterprise.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('enterprise.title')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {t('enterprise.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            
            {/* Visual Step Progress Bar */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold uppercase tracking-wider">
                  Step {step} of {totalSteps}: {step === 1 ? 'Organization Details' : step === 2 ? 'Compliance & Architecture' : 'Provisioning'}
                </span>
                <span className="text-slate-400">{progressPercent}% Complete</span>
              </div>

              {/* Progress bar line */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Step indicator nodes */}
              <div className="flex justify-between items-center text-[11px] font-mono pt-1 text-slate-400">
                <div className={`flex items-center space-x-1 ${step >= 1 ? 'text-cyan-400 font-bold' : ''}`}>
                  {step > 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">1</span>}
                  <span>Organization</span>
                </div>
                <div className={`flex items-center space-x-1 ${step >= 2 ? 'text-cyan-400 font-bold' : ''}`}>
                  {step > 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">2</span>}
                  <span>Compliance</span>
                </div>
                <div className={`flex items-center space-x-1 ${step >= 3 ? 'text-emerald-400 font-bold' : ''}`}>
                  <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">3</span>
                  <span>Provision Keys</span>
                </div>
              </div>
            </div>

            {!license ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* STEP 1: Organization Details */}
                {step === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-bold mb-1">
                        ENTERPRISE OR ORGANIZATIONAL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={enterpriseName}
                        onChange={(e) => setEnterpriseName(e.target.value)}
                        placeholder="e.g. Apex Global Security / Enterprise Defense Operations"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 font-bold mb-1">
                          CISO / SECURITY CONTACT EMAIL *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ciso@organization.gov"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 font-bold mb-1">
                          PROVISIONED FLEET SEATS
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={10000}
                          value={seats}
                          onChange={(e) => setSeats(parseInt(e.target.value) || 50)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
                      >
                        <span>Continue to Step 2: Compliance</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Compliance & Architecture & Security SLA */}
                {step === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    
                    {/* Security SLA Tier Selection */}
                    <div>
                      <label className="block text-xs font-mono text-cyan-400 font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>SELECT REQUESTED SECURITY SLA TIER *</span>
                      </label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {slaOptions.map((option) => {
                          const isSelected = slaTier === option.id;
                          return (
                            <button
                              type="button"
                              key={option.id}
                              onClick={() => setSlaTier(option.id)}
                              className={`p-3.5 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                  {option.title}
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                    SELECTED SLA
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                                {option.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-bold mb-2">
                        REQUIRED COMPLIANCE STANDARDS:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {complianceOptions.map((comp) => {
                          const isChecked = complianceNeeds.includes(comp.id);
                          return (
                            <button
                              type="button"
                              key={comp.id}
                              onClick={() => toggleCompliance(comp.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                                isChecked
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                              }`}
                            >
                              {isChecked ? '✓ ' : '+ '} {comp.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 font-bold mb-1">
                        SPECIAL KMS / ARCHITECTURE REQUIREMENTS (OPTIONAL)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Specify custom HSM hardware (Thales / SafeNet / Titan), air-gapped KMS endpoint, or custom Android MDM requirements..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-mono flex items-center space-x-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Step 1</span>
                      </button>

                      <button
                        type="submit"
                        disabled={submitting || !enterpriseName || !email}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Database className="w-4 h-4" />
                        <span>{submitting ? 'Saving to Firebase & Provisioning...' : 'Submit SLA Request & Provision Keys'}</span>
                      </button>
                    </div>
                  </div>
                )}

              </form>
            ) : (
              /* Success / Provisioned License Box (Step 3) */
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 space-y-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <h3 className="font-bold text-base text-white">
                      Enterprise Sandbox License Successfully Provisioned!
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    Your 30-day proof-of-concept keys for <strong>{license.enterpriseName}</strong> have been generated and cryptographically signed.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>LICENSE ID:</span>
                    <span className="font-bold text-cyan-400">{license.licenseId}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>SEATS PROVISIONED:</span>
                    <span className="font-bold text-slate-200">{license.provisionedSeats} Seats</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>VALIDITY PERIOD:</span>
                    <span className="font-bold text-emerald-400">{license.issueDate} → {license.expiryDate}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 block">KMS AUTHORIZATION KEY:</span>
                    <code className="text-cyan-300 text-[11px] font-bold break-all">{license.pocKey}</code>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadLicenseFile}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .qcrypt-license File</span>
                  </button>

                  <button
                    onClick={() => {
                      setLicense(null);
                      setStep(1);
                    }}
                    className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
                  >
                    Request Another
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Enterprise Evaluation SLA</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Zero Cloud Dependency:</strong> Host Q-CRYPT Key Management Server (KMS) on-premises or inside air-gapped government enclaves.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>NIST FIPS 203 & 204 Validation:</strong> Verified implementation of ML-KEM-1024 and ML-DSA-87 algorithms.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Dedicated Security Audit Report:</strong> Access our third-party cryptographic audit artifacts, source code proofs, and threat modeling documentation.
                </p>
              </div>
            </div>

            {/* Firebase Database CRM Persistence Status Console */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">FIREBASE CRM PERSISTENCE</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE FIRESTORE
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                All Enterprise Trial and Security SLA requests are securely synced to the Google Firebase Firestore database (<code className="text-cyan-300 font-mono text-[10px]">enterprise_trial_requests</code>) for real-time CRM workflow tracking.
              </p>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Total CRM Leads: <strong className="text-white">{crmRequests.length} Requests</strong></span>
                <button
                  type="button"
                  onClick={() => setShowCrmDashboard(!showCrmDashboard)}
                  className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-mono text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3 h-3 text-cyan-400" />
                  <span>{showCrmDashboard ? 'Hide CRM Console' : 'View CRM Database'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Real-time Firebase CRM Database Leads Drawer */}
        {showCrmDashboard && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-400 text-[11px] font-mono">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Firebase Firestore Collection: enterprise_trial_requests</span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Enterprise Trial & Security SLA CRM Console</span>
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-slate-400">
                  Real-time sync active ({crmRequests.length} records)
                </span>
                <button
                  onClick={() => setShowCrmDashboard(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  Close Console
                </button>
              </div>
            </div>

            {crmRequests.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <Clock className="w-8 h-8 text-cyan-400 mx-auto animate-spin" />
                <p className="text-sm font-bold text-white">No CRM Requests Found Yet</p>
                <p className="text-xs text-slate-400">Submit a request above to see it appear live in the Firebase Firestore database!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-cyan-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Enterprise / CISO</th>
                      <th className="p-3">Seats</th>
                      <th className="p-3">Security SLA Tier</th>
                      <th className="p-3">Compliance Scope</th>
                      <th className="p-3">Submitted At</th>
                      <th className="p-3">CRM Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                    {crmRequests.map((req) => (
                      <tr key={req.id || req.licenseId} className="hover:bg-slate-900/80 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white font-sans text-sm">{req.enterpriseName}</div>
                          <div className="text-[11px] text-cyan-400">{req.contactEmail}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {req.licenseId}</div>
                        </td>
                        <td className="p-3 text-slate-200 font-bold">
                          {req.seats} Seats
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold inline-block">
                            {req.slaTier || req.requestedSla}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {(req.complianceNeeds || []).map((c) => (
                              <span key={c} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[9px]">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {req.submittedAt ? new Date(req.submittedAt).toLocaleString() : 'Just now'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            req.status === 'SLA_APPROVED' || req.status === 'PROVISIONED'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : req.status === 'PENDING_REVIEW'
                              ? 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                              : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                          }`}>
                            {req.status || 'PENDING_REVIEW'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {req.id && (
                            <button
                              onClick={() => handleUpdateLeadStatus(req.id!, 'SLA_APPROVED')}
                              className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px]"
                            >
                              Approve SLA
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
