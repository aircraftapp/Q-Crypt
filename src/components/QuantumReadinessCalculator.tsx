import React, { useState } from 'react';
import { 
  Calculator, Shield, ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, 
  CheckCircle2, Download, Copy, RefreshCcw, Building2, Cpu, HardDrive, Lock, FileText
} from 'lucide-react';
import { useToast } from './Toast';

interface QuestionOption {
  label: string;
  sublabel?: string;
  points: number; // Higher points = higher quantum risk vulnerability
  riskTag: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  options: QuestionOption[];
}

export const QuantumReadinessCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const questions: Question[] = [
    {
      id: 'crypto_algo',
      title: '1. What primary asymmetric encryption algorithms are deployed in your current stack?',
      description: 'Public-key algorithms used for TLS session handshakes, SSH access, or internal API auth.',
      options: [
        { label: 'RSA-2048 or RSA-4096', sublabel: 'Highly vulnerable to Shor’s algorithm on CRQCs', points: 30, riskTag: 'CRITICAL_RISK' },
        { label: 'ECDH / ECDSA (P-256 / P-384 / Ed25519)', sublabel: 'Elliptic curves breakable in polynomial time', points: 25, riskTag: 'HIGH_RISK' },
        { label: 'Hybrid Classical + Experimental PQC', sublabel: 'Early migration phase underway', points: 10, riskTag: 'MODERATE_RISK' },
        { label: 'Pure NIST FIPS 203 (ML-KEM-1024 / Kyber)', sublabel: 'Full post-quantum lattice protection', points: 0, riskTag: 'QUANTUM_SAFE' },
      ]
    },
    {
      id: 'data_retention',
      title: '2. What is the required confidentiality retention window for your sensitive data?',
      description: 'Determines exposure to "Store Now, Decrypt Later" (SNDL) harvested traffic.',
      options: [
        { label: '10+ Years / Permanent (Defense, Medical, Financial)', sublabel: 'Primary target for immediate enemy traffic archiving', points: 30, riskTag: 'EXTREME_SNDL_TARGET' },
        { label: '3 to 10 Years (Corporate Secrets, IP, PII)', sublabel: 'At risk when CRQCs achieve quantum supremacy', points: 20, riskTag: 'HIGH_SNDL_TARGET' },
        { label: '1 to 3 Years (Operational Communications)', sublabel: 'Moderate exposure duration window', points: 10, riskTag: 'MODERATE_EXPOSURE' },
        { label: 'Transient / Ephemeral (< 30 days)', sublabel: 'Short confidentiality shelf life', points: 5, riskTag: 'LOW_SNDL_RISK' },
      ]
    },
    {
      id: 'hardware_enclave',
      title: '3. Are encryption keys isolated inside hardware secure enclaves?',
      description: 'Hardware roots of trust prevent memory dump leaks and software extraction.',
      options: [
        { label: 'No Hardware Enclaves (Keys stored in software / disk / RAM)', sublabel: 'Keys vulnerable to memory extraction & root exploits', points: 25, riskTag: 'NO_HARDWARE_ROOT' },
        { label: 'Basic Cloud KMS (AWS KMS, Azure Key Vault)', sublabel: 'Software abstraction without hardware device binding', points: 15, riskTag: 'PARTIAL_HARDWARE' },
        { label: 'Mobile Enclaves (Android Titan M2, Knox, Apple SE)', sublabel: 'Hardware-isolated key generation & zeroization', points: 5, riskTag: 'HARDWARE_BOUND' },
        { label: 'FIPS 140-3 Level 4 HSM + Mobile Hardware Enclaves', sublabel: 'Maximum physical & cryptographic isolation', points: 0, riskTag: 'MAX_ISOLATION' },
      ]
    },
    {
      id: 'compliance_req',
      title: '4. What regulatory or sovereign compliance mandates apply to your operations?',
      description: 'Standards setting deadlines for PQC algorithm adoption.',
      options: [
        { label: 'Germany BSI TR-02102-4 / IT-Grundschutz / Luxembourg CSSF PSF', sublabel: 'EU sovereign PQC encryption & financial data isolation mandates', points: 20, riskTag: 'SOVEREIGN_EU_MANDATE' },
        { label: 'India NASSCOM DeepTech Framework & CERT-In 6-Hour Directive', sublabel: 'Critical infrastructure & defense PQC ratcheting mandate', points: 15, riskTag: 'INDIA_CERTIN_MANDATE' },
        { label: 'US DoD / NSA CNSA 2.0 / NATO Security Mandates', sublabel: 'PQC mandatory transition required by 2026-2030', points: 15, riskTag: 'STRICT_DEADLINE' },
        { label: 'EU NIS2 / GDPR / Swiss Federal Data Protection', sublabel: 'Sovereign data protection & zero-trust compliance', points: 10, riskTag: 'REGULATORY_PRESSURE' },
        { label: 'HIPAA / PCI-DSS v4.0 / SOC 2 Type II', sublabel: 'Industry security audit compliance', points: 10, riskTag: 'STANDARD_COMPLIANCE' },
      ]
    }
  ];

  const handleSelectOption = (questionId: string, points: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: points }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCalculated(true);
      showToast('Quantum Readiness Report Generated', 'Review your organization score & PQC migration strategy.', 'success');
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCalculated(false);
  };

  // Calculate total risk score (0 to 100)
  const calculateTotalPoints = (): number => {
    return (Object.values(selectedAnswers) as number[]).reduce((sum: number, pts: number) => sum + pts, 0);
  };

  const totalPoints = calculateTotalPoints();
  const getRiskCategory = (score: number) => {
    if (score >= 70) return { label: 'CRITICAL VULNERABILITY', color: 'text-rose-400 bg-rose-950/80 border-rose-500', desc: 'Immediate target for Store Now Decrypt Later. Transition to Q-CRYPT ML-KEM-1024 required immediately.' };
    if (score >= 40) return { label: 'HIGH QUANTUM EXPOSURE', color: 'text-amber-400 bg-amber-950/80 border-amber-500', desc: 'SNDL harvested traffic will be decrypted upon CRQC activation. Hybrid PQC recommended.' };
    if (score >= 20) return { label: 'MODERATE EXPOSURE', color: 'text-cyan-400 bg-cyan-950/80 border-cyan-500', desc: 'Partial protection in place. Upgrade remaining endpoints to hardware enclave PQC.' };
    return { label: 'QUANTUM READY / HIGH POSTURE', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500', desc: 'Strong post-quantum posture utilizing NIST FIPS 203 lattice key exchange.' };
  };

  const riskCategory = getRiskCategory(totalPoints);

  const copyReportSummary = () => {
    const reportText = `Q-CRYPT QUANTUM READINESS AUDIT REPORT
--------------------------------------------------
Overall Risk Score: ${totalPoints}/100
Posture Classification: ${riskCategory.label}
Assessment Summary: ${riskCategory.desc}

RECOMMENDED ACTION PLAN:
1. Deploy Q-CRYPT ML-KEM-1024 Post-Quantum Key Encapsulation across all TLS & message tunnels.
2. Enforce Hardware Enclave key isolation (Android Titan M2 / Knox / Apple SE).
3. Enable constant-time memory zeroization (explicit_bzero) to block volatile RAM dumps.
4. Integrate Q-CRYPT MDM Enterprise Controller for fleet zeroization & remote key rotation.
--------------------------------------------------
Generated via Q-CRYPT Security Architecture Portal`;

    navigator.clipboard.writeText(reportText);
    showToast('Report Copied to Clipboard', 'You can now paste this summary into your executive briefing or audit log.', 'success');
  };

  return (
    <section id="quantum-readiness-calculator" className="py-16 bg-slate-950 text-slate-100 border-b border-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>ORGANIZATIONAL ASSESSMENT TOOL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Post-Quantum Readiness Calculator
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Evaluate your infrastructure's exposure to <strong className="text-rose-400">Store Now, Decrypt Later (SNDL)</strong> threat vectors and receive a tailored Q-CRYPT migration strategy.
          </p>
        </div>

        {/* Calculator Interface Container */}
        <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          {!isCalculated ? (
            <div className="space-y-8">
              {/* Progress Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>QUESTION {currentStep + 1} OF {questions.length}</span>
                  <span className="text-cyan-400 font-bold">{Math.round(((currentStep + 1) / questions.length) * 100)}% COMPLETE</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question Block */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white font-sans">
                    {questions[currentStep].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans">
                    {questions[currentStep].description}
                  </p>
                </div>

                {/* Options Cards */}
                <div className="grid grid-cols-1 gap-3 font-sans">
                  {questions[currentStep].options.map((opt, idx) => {
                    const isSelected = selectedAnswers[questions[currentStep].id] === opt.points;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(questions[currentStep].id, opt.points)}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between space-x-4 ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500/50'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-sm font-bold block">{opt.label}</span>
                          {opt.sublabel && (
                            <span className="text-xs text-slate-400 block font-mono">{opt.sublabel}</span>
                          )}
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 font-bold" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    currentStep === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white bg-slate-950 border border-slate-800'
                  }`}
                >
                  Previous
                </button>

                <button
                  disabled={selectedAnswers[questions[currentStep].id] === undefined}
                  onClick={handleNext}
                  className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
                    selectedAnswers[questions[currentStep].id] !== undefined
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:scale-105 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>{currentStep === questions.length - 1 ? 'Calculate Score' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Results & Executive Report Panel */
            <div className="space-y-8 font-sans">
              <div className="text-center space-y-3 border-b border-slate-800 pb-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AUDIT ASSESSMENT GENERATED</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Quantum Readiness Posture
                </h3>
              </div>

              {/* Score Gauge & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase font-bold block">Quantum Risk Score</span>
                  <div className="text-5xl font-black text-white font-mono tracking-tight">
                    {totalPoints}<span className="text-sm text-slate-500 font-normal">/100</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">Higher = Increased CRQC Vulnerability</span>
                </div>

                <div className={`p-6 rounded-2xl border md:col-span-2 space-y-2 ${riskCategory.color}`}>
                  <div className="flex items-center space-x-2 font-mono text-xs font-bold uppercase">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{riskCategory.label}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-200">
                    {riskCategory.desc}
                  </p>
                </div>
              </div>

              {/* Tailored Q-CRYPT Migration Action Plan */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Recommended Q-CRYPT Post-Quantum Strategy</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-300 block">1. ML-KEM-1024 Hybrid Key Exchange</span>
                    <p className="text-slate-400 text-[11px]">Deploy NIST FIPS 203 lattice encryption alongside classical X25519 to immediately defeat Store-Now-Decrypt-Later interception.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-300 block">2. Hardware Enclave Isolation</span>
                    <p className="text-slate-400 text-[11px]">Bind key generation to physical silicon enclaves (Titan M2 / Knox / Apple SE) so private keys never exist in untrusted flash storage.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-purple-300 block">3. Compiler RAM Zeroization</span>
                    <p className="text-slate-400 text-[11px]">Utilize C11/C++20 explicit_bzero routines to scrub secret memory registers immediately post-handshake.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 block">4. MDM Remote Fleet Control</span>
                    <p className="text-slate-400 text-[11px]">Enforce remote zeroize policies across enterprise mobile fleets via central Microsoft Intune / Knox controllers.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold flex items-center space-x-2 transition-all"
                >
                  <RefreshCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recalculate Readiness</span>
                </button>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={copyReportSummary}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Copy Executive Summary</span>
                  </button>

                  <a
                    href="#enterprise-portal"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold flex items-center justify-center space-x-2 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Request Enterprise Migration</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
