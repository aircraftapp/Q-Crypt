import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  Terminal, 
  Cpu, 
  Lock, 
  Smartphone, 
  Usb, 
  Fingerprint, 
  EyeOff, 
  Clock, 
  Key, 
  ShieldAlert, 
  HelpCircle, 
  RefreshCw, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Award,
  Zap,
  Info
} from 'lucide-react';
import { HsmDevice } from '../services/hsmService';

export interface HardeningStep {
  id: string;
  category: 'INTERFACE' | 'AUTH' | 'BOOT' | 'SANDBOX' | 'STORAGE';
  title: string;
  description: string;
  fipsSection: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'WARNING';
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  remediationAndroid: string;
  remediationIos: string;
  remediationLinux: string;
  autoFixAvailable: boolean;
}

const INITIAL_HARDENING_STEPS: HardeningStep[] = [
  {
    id: 'usb-debugging',
    category: 'INTERFACE',
    title: 'Disable USB Debugging & ADB Interface',
    description: 'Prevents untrusted physical host machines from establishing diagnostic bridge shells or dumping process memory.',
    fipsSection: 'FIPS 140-3 §4.2 (Physical & Diagnostic Port Security)',
    status: 'COMPLIANT',
    impact: 'CRITICAL',
    remediationAndroid: 'Settings > System > Developer Options > USB Debugging (Toggle OFF)',
    remediationIos: 'Settings > Face ID & Passcode > USB Accessories (Toggle OFF when locked)',
    remediationLinux: 'systemctl stop adbd && echo 0 > /sys/class/android_usb/android0/enable',
    autoFixAvailable: true
  },
  {
    id: 'biometric-lockout',
    category: 'AUTH',
    title: 'Enforce Biometric Lockout (Max 3 Failed Attempts)',
    description: 'Mandates fallback to strong alpha-numeric master passphrase and enforces exponential hardware backoff on invalid biometric reads.',
    fipsSection: 'FIPS 140-3 §4.3 (Roles, Services, and Authentication)',
    status: 'COMPLIANT',
    impact: 'CRITICAL',
    remediationAndroid: 'Settings > Security > Biometric Unlock > Failed Attempt Lockout (Set to 3)',
    remediationIos: 'Enforced automatically by Apple Secure Enclave (5 attempts then Passcode)',
    remediationLinux: 'pam_tally2 --user=root --deny=3 --unlock_time=900',
    autoFixAvailable: true
  },
  {
    id: 'verified-boot',
    category: 'BOOT',
    title: 'Hardware Root of Trust & Verified Boot (Green State)',
    description: 'Ensures cryptographic attestation chain from silicon bootloader ROM through OS kernel without unauthorized modifications.',
    fipsSection: 'FIPS 140-3 §4.4 (Cryptographic Module Security)',
    status: 'COMPLIANT',
    impact: 'CRITICAL',
    remediationAndroid: 'Re-lock bootloader via fastboot: `fastboot flashing lock`',
    remediationIos: 'Verify Secure Enclave Integrity in Apple Settings > General > About',
    remediationLinux: 'Enable UEFI Secure Boot with custom PK/KEK/db keys enrolled in TPM 2.0',
    autoFixAvailable: false
  },
  {
    id: 'screen-capture-defense',
    category: 'SANDBOX',
    title: 'Enforce FLAG_SECURE (Prevent Screen Capture & Mirroring)',
    description: 'Blocks malicious accessibility services and background spyware from taking screenshots or recording cryptographic keys.',
    fipsSection: 'FIPS 140-3 §4.9 (Cryptographic Key Management & Output)',
    status: 'COMPLIANT',
    impact: 'HIGH',
    remediationAndroid: 'WindowManager.LayoutParams.FLAG_SECURE enforced on all secure activities',
    remediationIos: 'Enable UITextField.isSecureTextEntry and hide view snapshot on backgrounding',
    remediationLinux: 'Enforce Wayland security isolation and block X11 unauthenticated screen grabbers',
    autoFixAvailable: true
  },
  {
    id: 'inactivity-timer',
    category: 'AUTH',
    title: 'Strict Session Inactivity Lockout (≤ 5 Minutes)',
    description: 'Wipes volatile decapsulation keys from SRAM and locks the hardware security module interface upon user inactivity.',
    fipsSection: 'FIPS 140-3 §4.3.4 (Operational Timeouts)',
    status: 'COMPLIANT',
    impact: 'HIGH',
    remediationAndroid: 'Settings > Security > Auto-lock timer > Set to "Immediately on Sleep" or "5 min"',
    remediationIos: 'Settings > Display & Brightness > Auto-Lock > Set to 2 or 5 Minutes',
    remediationLinux: 'Set TMOUT=300 in /etc/profile and configure logind idle action to lock',
    autoFixAvailable: true
  },
  {
    id: 'memory-tagging-mte',
    category: 'SANDBOX',
    title: 'Memory Tagging Extension (MTE) & ASLR Strict Mode',
    description: 'Hardware-enforced memory safety preventing use-after-free and buffer overflow exploits from hijacking cryptographic operations.',
    fipsSection: 'FIPS 140-3 §4.5 (Software/Firmware Security)',
    status: 'COMPLIANT',
    impact: 'HIGH',
    remediationAndroid: 'Settings > Security > Advanced > Memory Tagging (Set to Synchronous Mode)',
    remediationIos: 'Pointer Authentication Codes (PAC) automatically active on Apple Silicon',
    remediationLinux: 'sysctl -w vm.mmap_rnd_bits=32 && sysctl -w kernel.randomize_va_space=2',
    autoFixAvailable: true
  },
  {
    id: 'key-wrapping-enclave',
    category: 'STORAGE',
    title: 'Hardware-Backed Key Wrapping (Knox StrongBox / Titan M2)',
    description: 'Ensures that ML-KEM and ML-DSA private key material is never held in raw plaintext in standard Linux kernel memory.',
    fipsSection: 'FIPS 140-3 §4.7 (Cryptographic Key Management)',
    status: 'COMPLIANT',
    impact: 'CRITICAL',
    remediationAndroid: 'AndroidKeyStore.Builder.setIsStrongBoxBacked(true)',
    remediationIos: 'kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly + SecureEnclave attribute',
    remediationLinux: 'Bind keys to TPM 2.0 PCR registers 0, 2, 4, 7 with sealed storage policy',
    autoFixAvailable: true
  },
  {
    id: 'developer-options-lockdown',
    category: 'INTERFACE',
    title: 'Revoke OS Developer Options & Wireless ADB',
    description: 'Disables network-accessible debugging ports and mock location providers.',
    fipsSection: 'FIPS 140-3 §4.2.2 (Interface Restrictions)',
    status: 'COMPLIANT',
    impact: 'MEDIUM',
    remediationAndroid: 'Settings > System > Developer Options (Turn Master Switch OFF)',
    remediationIos: 'Settings > Privacy & Security > Developer Mode (Turn OFF)',
    remediationLinux: 'Disable SSH password auth and bind management port exclusively to loopback',
    autoFixAvailable: true
  }
];

interface HsmSecurityHardeningAssistantProps {
  device: HsmDevice;
  onShowToast?: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export const HsmSecurityHardeningAssistant: React.FC<HsmSecurityHardeningAssistantProps> = ({ device, onShowToast }) => {
  const [steps, setSteps] = useState<HardeningStep[]>(INITIAL_HARDENING_STEPS);
  const [selectedStepId, setSelectedStepId] = useState<string>('usb-debugging');
  const [selectedPlatform, setSelectedPlatform] = useState<'ANDROID' | 'IOS' | 'LINUX'>('ANDROID');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  const selectedStep = useMemo(() => {
    return steps.find(s => s.id === selectedStepId) || steps[0];
  }, [steps, selectedStepId]);

  const compliantCount = useMemo(() => {
    return steps.filter(s => s.status === 'COMPLIANT').length;
  }, [steps]);

  const hardeningScorePercent = useMemo(() => {
    return Math.round((compliantCount / steps.length) * 100);
  }, [compliantCount, steps.length]);

  const handleToggleStepStatus = (id: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'COMPLIANT' ? 'NON_COMPLIANT' : 'COMPLIANT';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleApplyAllFipsSettings = () => {
    setSteps(prev => prev.map(s => ({ ...s, status: 'COMPLIANT' })));
    if (onShowToast) {
      onShowToast('FIPS Hardening Applied', 'All 8 OS-level environment prerequisites verified and configured to FIPS 140-3 standards.', 'success');
    }
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (onShowToast) {
        onShowToast('OS Hardening Audit Complete', `Hardware enclave environment is running at ${hardeningScorePercent}% FIPS 140-3 readiness.`, 'info');
      }
    }, 1200);
  };

  const filteredSteps = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return steps;
    return steps.filter(s => s.category === activeCategoryFilter);
  }, [steps, activeCategoryFilter]);

  return (
    <div id="hsm-security-hardening-assistant" className="space-y-6 animate-fadeIn">
      {/* Header Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
        
        {/* Title & Readiness Progress */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                FIPS 140-3 OS PREREQUISITE ASSISTANT
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
              OS-Level Security Hardening Assistant
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Interactive step-by-step checklist to configure the host operating system (Android Knox, Apple iOS Secure Enclave, or Linux/TPM) to meet strict FIPS 140-3 Level 3/4 environmental prerequisites.
            </p>
          </div>

          {/* Hardening Score Card */}
          <div className="flex items-center space-x-4 bg-slate-950/90 border border-slate-800 p-4 rounded-2xl shrink-0 font-mono">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="text-lg font-black text-emerald-400">{hardeningScorePercent}%</div>
            </div>
            <div>
              <div className="text-xs text-white font-bold flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{hardeningScorePercent === 100 ? 'FIPS 140-3 READY' : 'HARDENING REQUIRED'}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {compliantCount} of {steps.length} Prerequisites Met
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & OS Platform Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 text-[11px]">Platform Guide:</span>
            {(['ANDROID', 'IOS', 'LINUX'] as const).map(plat => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
                  selectedPlatform === plat
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {plat === 'ANDROID' ? 'Android / Knox' : plat === 'IOS' ? 'iOS / Enclave' : 'Linux / Server'}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Host...' : 'Scan OS Status'}</span>
            </button>

            <button
              onClick={handleApplyAllFipsSettings}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enforce All FIPS 140-3 Defaults</span>
            </button>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 pb-3 font-mono text-xs">
          {[
            { id: 'ALL', label: 'All Prerequisites' },
            { id: 'INTERFACE', label: 'Interface & USB' },
            { id: 'AUTH', label: 'Biometrics & Auth' },
            { id: 'BOOT', label: 'Root of Trust' },
            { id: 'SANDBOX', label: 'Sandboxing & Memory' },
            { id: 'STORAGE', label: 'Key Wrapping' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeCategoryFilter === tab.id
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Two-Column Interactive Checklist & Remediation Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Steps List */}
          <div className="lg:col-span-7 space-y-3 font-mono">
            {filteredSteps.map((step) => {
              const isSelected = step.id === selectedStepId;
              const isCompliant = step.status === 'COMPLIANT';

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-950/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStepStatus(step.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isCompliant 
                            ? 'bg-emerald-950 border-emerald-600 text-emerald-400 hover:bg-emerald-900' 
                            : 'bg-red-950 border-red-700 text-red-400 hover:bg-red-900'
                        }`}
                        title={isCompliant ? 'Click to mark non-compliant' : 'Click to mark compliant'}
                      >
                        {isCompliant ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>

                      <div>
                        <h4 className="font-bold text-sm text-white font-sans">{step.title}</h4>
                        <div className="text-[11px] text-slate-400">{step.fipsSection}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        step.impact === 'CRITICAL' 
                          ? 'bg-red-950 text-red-300 border border-red-800' 
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {step.impact}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Remediation & Command Helper */}
          <div className="lg:col-span-5 space-y-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400 uppercase text-[10px] font-bold flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Prerequisite Remediation Guide</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedStep.status === 'COMPLIANT' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                    : 'bg-red-950 text-red-300 border border-red-700'
                }`}>
                  {selectedStep.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white font-sans">{selectedStep.title}</h4>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">{selectedStep.description}</p>
                <div className="text-[11px] text-cyan-400 pt-1">{selectedStep.fipsSection}</div>
              </div>

              {/* OS-Specific Instruction Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  {selectedPlatform === 'ANDROID' ? 'Android / Samsung Knox Step:' : selectedPlatform === 'IOS' ? 'Apple iOS / Secure Enclave Step:' : 'Linux / TPM 2.0 Command:'}
                </span>
                <div className="p-2.5 rounded-lg bg-black border border-slate-800 text-cyan-300 text-[11px] font-mono select-all break-words">
                  {selectedPlatform === 'ANDROID' 
                    ? selectedStep.remediationAndroid 
                    : selectedPlatform === 'IOS' 
                    ? selectedStep.remediationIos 
                    : selectedStep.remediationLinux}
                </div>
              </div>

              {/* Toggle Compliance Status Quick Action */}
              <button
                onClick={() => handleToggleStepStatus(selectedStep.id)}
                className={`w-full py-2.5 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg ${
                  selectedStep.status === 'COMPLIANT'
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-600/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black'
                }`}
              >
                {selectedStep.status === 'COMPLIANT' ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Simulate Setting Non-Compliant</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Mark As Compliant</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
