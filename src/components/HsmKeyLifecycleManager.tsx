import React, { useState } from 'react';
import { 
  Key, RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle, Layers, 
  RotateCw, Clock, Sliders, Check, Lock, Sparkles, Terminal, ArrowRight,
  Shield, Zap, Radio, FileText, CheckCircle
} from 'lucide-react';
import { HsmKeyObject, HsmDevice } from '../services/hsmService';
import { useToast } from './Toast';

interface RotationStage {
  id: number;
  label: string;
  subtext: string;
  standard: string;
  durationMs: number;
}

const ROTATION_STAGES: RotationStage[] = [
  {
    id: 1,
    label: 'Quantum Vacuum Entropy Gathering',
    subtext: 'Ingesting 4,096 bits of physical quantum noise from balanced homodyne optical detector',
    standard: 'NIST SP 800-90B / RCT Verified',
    durationMs: 700
  },
  {
    id: 2,
    label: 'High-Dimensional Lattice Keygen',
    subtext: 'Generating Module-LWE polynomial matrix A ∈ R_q^(k×k) and discrete Gaussian error vectors',
    standard: 'FIPS 203 (ML-KEM) / FIPS 204 (ML-DSA)',
    durationMs: 900
  },
  {
    id: 3,
    label: 'Dual-Control M-of-N Quorum Sign-Off',
    subtext: 'Verifying 2-of-3 Crypto-Officer physical smartcard PKCS#11 authorization tokens',
    standard: 'FIPS 140-3 §4.3 Dual Custody',
    durationMs: 800
  },
  {
    id: 4,
    label: 'Cryptographic Key Re-wrapping & Broadcast',
    subtext: 'Re-encrypting active session KEKs under new master key & broadcasting public certs',
    standard: 'AES-256-KW (NIST SP 800-38F)',
    durationMs: 850
  },
  {
    id: 5,
    label: 'Anti-Forensic SRAM Zeroization of Retired Key',
    subtext: 'Executing DoD 5220.22-M 3-pass cryptographic wipe on decommissioned memory addresses',
    standard: 'FIPS 140-3 §4.10 Zeroization',
    durationMs: 650
  },
  {
    id: 6,
    label: 'Enclave Activation & Attestation Sync',
    subtext: 'New PQC master key promoted to ACTIVE state; TPM/RoT hardware attestation signed',
    standard: 'Active Enclave State Confirmed',
    durationMs: 500
  }
];

interface Props {
  selectedDevice: HsmDevice;
  keys: HsmKeyObject[];
  onKeyRotated: (rotatedKeyId: string, newLabel: string, algorithm: string) => void;
}

export const HsmKeyLifecycleManager: React.FC<Props> = ({
  selectedDevice,
  keys,
  onKeyRotated
}) => {
  const { showToast } = useToast();

  const [selectedKeyToRotate, setSelectedKeyToRotate] = useState<string>(keys[0]?.id || 'key-pqc-root-01');
  const [rotationPolicy, setRotationPolicy] = useState<'30_DAYS' | '90_DAYS' | 'MANUAL_ONLY'>('90_DAYS');
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(-1);
  const [rotationProgress, setRotationProgress] = useState<number>(0);
  const [rotationLogs, setRotationLogs] = useState<string[]>([]);
  const [lastRotatedTimestamp, setLastRotatedTimestamp] = useState<string>('2026-08-21 03:00 UTC (18m ago)');
  const [activeAuditHash, setActiveAuditHash] = useState<string>('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

  const targetKey = keys.find(k => k.id === selectedKeyToRotate) || keys[0];

  const handleStartManualRotation = () => {
    if (!targetKey) return;
    setIsRotating(true);
    setCurrentStageIndex(0);
    setRotationProgress(0);
    setRotationLogs([
      `[000ms] INITIATED: Manual re-keying triggered for ${targetKey.label} (${targetKey.algorithm})`,
      `[050ms] ENCLAVE SECURITY: Dual-officer quorum verification bypass armed in sandbox mode`
    ]);

    showToast('Key Rotation Initiated', `Executing 6-stage post-quantum re-keying ceremony for ${targetKey.label}...`, 'info');

    let stageIdx = 0;

    const executeNextStage = () => {
      if (stageIdx >= ROTATION_STAGES.length) {
        setIsRotating(false);
        setRotationProgress(100);
        setCurrentStageIndex(ROTATION_STAGES.length);
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        setLastRotatedTimestamp(now);
        const newHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setActiveAuditHash(newHash);

        setRotationLogs(prev => [
          ...prev,
          `[TOTAL] ROTATION CEREMONY COMPLETE: Key ${targetKey.label} rotated to generation v${Math.floor(Date.now() / 1000000)}. Active Hash: ${newHash.slice(0, 16)}...`
        ]);

        onKeyRotated(targetKey.id, `${targetKey.label} (Rotated v2)`, targetKey.algorithm);

        showToast(
          'Re-Keying Complete',
          `${targetKey.label} successfully rotated with new quantum lattice seed.`,
          'success'
        );
        return;
      }

      const stage = ROTATION_STAGES[stageIdx];
      setCurrentStageIndex(stageIdx);
      const calculatedProgress = Math.round(((stageIdx + 1) / ROTATION_STAGES.length) * 100);
      setRotationProgress(calculatedProgress);

      setRotationLogs(prev => [
        ...prev,
        `[STAGE ${stage.id}] ${stage.label}: ${stage.subtext} (${stage.standard})`
      ]);

      setTimeout(() => {
        stageIdx++;
        executeNextStage();
      }, stage.durationMs);
    };

    executeNextStage();
  };

  return (
    <div id="hsm-key-lifecycle-manager" className="space-y-6 animate-fadeIn">
      
      {/* Header & Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
              <Key className="w-3.5 h-3.5 animate-pulse" />
              <span>FIPS 140-3 §4.7 CRYPTOGRAPHIC KEY LIFECYCLE & ZEROIZATION MANAGEMENT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
              Post-Quantum Key Lifecycle & Master Rotation
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Manage automatic and manual rotation schedules for internal ML-KEM-1024 master wrap keys and ML-DSA-87 root attestation credentials.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="trigger-manual-key-rotation-btn"
              onClick={handleStartManualRotation}
              disabled={isRotating || selectedDevice.status === 'ZEROIZED'}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-mono text-xs font-black transition-all shadow-lg shadow-cyan-950/60 flex items-center space-x-2 cursor-pointer disabled:opacity-40"
            >
              <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{isRotating ? 'Executing Re-Keying...' : 'Trigger Master Re-Keying'}</span>
            </button>
          </div>
        </div>

        {/* Master Key Selection & Rotation Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
              Target Key For Rotation
            </label>
            <select
              value={selectedKeyToRotate}
              disabled={isRotating}
              onChange={(e) => setSelectedKeyToRotate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono text-xs font-bold focus:outline-none focus:border-cyan-500"
            >
              {keys.map(k => (
                <option key={k.id} value={k.id}>
                  {k.label} ({k.algorithm})
                </option>
              ))}
            </select>
            <div className="text-[10px] text-slate-400 font-mono">
              Slot: <strong className="text-white">{targetKey?.slotId}</strong> • State: <strong className="text-emerald-400">ACTIVE</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
              Automated Rotation Policy
            </label>
            <select
              value={rotationPolicy}
              disabled={isRotating}
              onChange={(e) => {
                setRotationPolicy(e.target.value as any);
                showToast('Rotation Policy Updated', `Scheduled rotation set to ${e.target.value.replace('_', ' ')}`, 'info');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs font-bold focus:outline-none focus:border-cyan-500"
            >
              <option value="30_DAYS">Every 30 Days (High Security Military)</option>
              <option value="90_DAYS">Every 90 Days (NIST Recommended)</option>
              <option value="MANUAL_ONLY">Manual Officer Quorum Only</option>
            </select>
            <div className="text-[10px] text-emerald-400 font-mono">
              Next scheduled rotation: in 72 days
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
              Last Master Re-Keying
            </label>
            <div className="text-xs font-mono font-bold text-cyan-300">
              {lastRotatedTimestamp}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              Audit Hash: <span className="text-slate-300 font-mono">{activeAuditHash.slice(0, 16)}...</span>
            </div>
          </div>

        </div>

        {/* Multi-Stage Re-Keying Progress Status Bar */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white font-sans">
                Master Re-Keying Ceremony Progress ({rotationProgress}%)
              </h4>
            </div>
            <span className="text-xs font-mono text-cyan-300">
              {isRotating ? (
                <span className="flex items-center gap-1.5 animate-pulse text-amber-400">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Stage {Math.min(6, currentStageIndex + 1)} of 6 In Progress...</span>
                </span>
              ) : rotationProgress === 100 ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ceremony Complete (Enclave Active)</span>
                </span>
              ) : (
                <span className="text-slate-400">Ready to execute</span>
              )}
            </span>
          </div>

          {/* Graphical Progress Bar */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500 rounded-full shadow-lg shadow-cyan-500/50"
                style={{ width: `${rotationProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Entropy Gather</span>
              <span>Lattice Gen</span>
              <span>Dual Custody</span>
              <span>Re-wrapping</span>
              <span>Zeroization</span>
              <span>Sync Active</span>
            </div>
          </div>

          {/* 6 Stage Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {ROTATION_STAGES.map((stage, idx) => {
              const isPast = currentStageIndex > idx || rotationProgress === 100;
              const isCurrent = isRotating && currentStageIndex === idx;
              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/70 border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-cyan-950'
                      : isPast
                      ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold">
                      STAGE 0{stage.id}
                    </span>
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <div className="font-bold text-xs text-white font-sans truncate">
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-2">
                    {stage.subtext}
                  </div>
                  <div className="text-[9px] text-cyan-400 font-mono mt-1 border-t border-slate-800/60 pt-1">
                    {stage.standard}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Re-Keying Protocol Execution Log Terminal */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Re-Keying Cryptographic Protocol Stream</span>
            </span>
            <span className="text-[10px] text-slate-500">M-of-N Quorum Ceremony</span>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1 text-slate-300">
            {rotationLogs.length === 0 ? (
              <div className="text-slate-500 italic">
                Press "Trigger Master Re-Keying" to execute the quantum lattice rotation sequence.
              </div>
            ) : (
              rotationLogs.map((log, i) => (
                <div key={i} className="text-cyan-300">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
