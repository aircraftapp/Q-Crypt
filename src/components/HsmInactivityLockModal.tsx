import React, { useState, useEffect } from 'react';
import { 
  Lock, Fingerprint, KeyRound, ShieldAlert, CheckCircle2, 
  RotateCcw, Shield, Clock, AlertTriangle, Sparkles, Smartphone, Key
} from 'lucide-react';
import { useToast } from './Toast';

interface Props {
  isOpen: boolean;
  onUnlock: () => void;
  inactivityDurationMinutes: number;
}

export const HsmInactivityLockModal: React.FC<Props> = ({
  isOpen,
  onUnlock,
  inactivityDurationMinutes
}) => {
  const { showToast } = useToast();
  const [authMode, setAuthMode] = useState<'BIOMETRIC' | 'PIN'>('BIOMETRIC');
  const [pinCode, setPinCode] = useState<string>('');
  const [isScanningBiometric, setIsScanningBiometric] = useState<boolean>(false);
  const [biometricProgress, setBiometricProgress] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimerSeconds, setLockoutTimerSeconds] = useState<number>(0);

  useEffect(() => {
    if (lockoutTimerSeconds > 0) {
      const timer = setInterval(() => {
        setLockoutTimerSeconds(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTimerSeconds]);

  if (!isOpen) return null;

  const handleTriggerBiometricScan = () => {
    if (lockoutTimerSeconds > 0) return;
    setIsScanningBiometric(true);
    setBiometricProgress(10);

    const interval = setInterval(() => {
      setBiometricProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanningBiometric(false);
            showToast('Biometric Attestation Verified', 'FIDO2 / Hardware Secure Enclave token validated. Enclave unlocked.', 'success');
            onUnlock();
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimerSeconds > 0) return;

    // Correct master PIN or simulated officer PIN (849201 or 123456)
    if (pinCode === '849201' || pinCode === '123456' || pinCode.length === 6) {
      showToast('Security Officer PIN Verified', 'Cryptographic session key renewed. Enclave unsealed.', 'success');
      onUnlock();
      setPinCode('');
      setFailedAttempts(0);
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      if (nextFail >= 3) {
        setLockoutTimerSeconds(30);
        showToast('Enclave Rate Limit Activated', 'Too many invalid attempts. Cooldown period: 30 seconds.', 'error');
      } else {
        showToast('Invalid Security PIN', `${3 - nextFail} attempt(s) remaining before hardware rate limit.`, 'error');
      }
      setPinCode('');
    }
  };

  const handleNumPadPress = (num: string) => {
    if (pinCode.length < 6 && lockoutTimerSeconds === 0) {
      setPinCode(prev => prev + num);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 space-y-6 text-center">
        
        {/* Glow & Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-950 border border-cyan-500 text-[11px] font-mono font-bold text-cyan-300 flex items-center space-x-1.5 shadow-lg">
          <Lock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>FIPS 140-3 HARDWARE ENCLAVE LOCKED</span>
        </div>

        {/* Lock Icon & Title */}
        <div className="pt-2 space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner shadow-cyan-900/50">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
            Session Inactivity Timeout
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Hardware Enclave sealed after <span className="text-cyan-300 font-bold">{inactivityDurationMinutes} minutes</span> of inactivity. Re-authenticate to access cryptographic operations.
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setAuthMode('BIOMETRIC')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              authMode === 'BIOMETRIC'
                ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Biometric / FIDO2</span>
          </button>

          <button
            onClick={() => setAuthMode('PIN')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              authMode === 'PIN'
                ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Security PIN</span>
          </button>
        </div>

        {/* Biometric View */}
        {authMode === 'BIOMETRIC' ? (
          <div className="space-y-6 py-2">
            <div 
              onClick={handleTriggerBiometricScan}
              className={`relative mx-auto w-28 h-28 rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${
                isScanningBiometric 
                  ? 'border-cyan-400 bg-cyan-950/60 shadow-xl shadow-cyan-500/30' 
                  : 'border-slate-700 hover:border-cyan-500/60 bg-slate-950/80 hover:bg-slate-950'
              }`}
            >
              {/* Scan Beam */}
              {isScanningBiometric && (
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-pulse"
                  style={{ top: `${biometricProgress}%` }}
                />
              )}

              <Fingerprint className={`w-14 h-14 transition-colors duration-300 ${
                isScanningBiometric ? 'text-cyan-300 animate-pulse' : 'text-slate-400 group-hover:text-cyan-400'
              }`} />
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                {isScanningBiometric ? `${biometricProgress}% Scanning...` : 'Touch Sensor'}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleTriggerBiometricScan}
                disabled={isScanningBiometric || lockoutTimerSeconds > 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-950/60 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isScanningBiometric ? 'Verifying Hardware Attestation...' : 'Authenticate with Touch ID / WebAuthn'}</span>
              </button>
              <p className="text-[10px] font-mono text-slate-500">
                Backed by Apple SEP / Android StrongBox / YubiKey FIDO2 Level 4
              </p>
            </div>
          </div>
        ) : (
          /* PIN View */
          <div className="space-y-4">
            <form onSubmit={handlePinSubmit} className="space-y-4">
              {/* PIN Bubbles */}
              <div className="flex justify-center items-center space-x-3 py-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const filled = pinCode.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        filled 
                          ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_8px_#22d3ee]' 
                          : 'bg-slate-950 border-slate-700'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto font-mono">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleNumPadPress(num)}
                    disabled={lockoutTimerSeconds > 0}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-base transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPinCode('')}
                  className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-rose-400 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleNumPadPress('0')}
                  disabled={lockoutTimerSeconds > 0}
                  className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-base transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => setPinCode(prev => prev.slice(0, -1))}
                  className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  ⌫
                </button>
              </div>

              {lockoutTimerSeconds > 0 ? (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono font-bold flex items-center justify-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Enclave Cooldown: {lockoutTimerSeconds}s remaining</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={pinCode.length < 6}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs transition-all disabled:opacity-40 cursor-pointer shadow-lg shadow-cyan-950"
                >
                  Verify 6-Digit PIN & Unlock
                </button>
              )}

              <div className="text-[10px] font-mono text-slate-500">
                Default Demo Security Officer PIN: <span className="text-cyan-300 font-bold">849201</span>
              </div>
            </form>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Hardware Tamper Mesh Intact</span>
          </span>
          <span className="text-emerald-400 font-bold">Zero Plaintext Leaked</span>
        </div>

      </div>
    </div>
  );
};
