import React, { useState, useEffect } from 'react';
import { 
  Binary, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  RotateCw, 
  Sliders, 
  TrendingDown, 
  Activity, 
  CheckCircle2, 
  Bell, 
  BellRing, 
  Radio, 
  Cpu, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { HsmDevice } from '../services/hsmService';

interface HsmEntropyHealthMonitorProps {
  device: HsmDevice;
  onShowToast?: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export const HsmEntropyHealthMonitor: React.FC<HsmEntropyHealthMonitorProps> = ({ device, onShowToast }) => {
  // Configurable security thresholds
  const [minThroughputThresholdMBps, setMinThroughputThresholdMBps] = useState<number>(48.0);
  const [minShannonEntropyBits, setMinShannonEntropyBits] = useState<number>(7.990);

  // Live sampled metrics
  const [liveThroughputMBps, setLiveThroughputMBps] = useState<number>(device.entropyRateMBps || 64.0);
  const [liveShannonEntropy, setLiveShannonEntropy] = useState<number>(7.9954);
  const [isSimulatedUnderflow, setIsSimulatedUnderflow] = useState<boolean>(false);
  const [autoFailoverTriggered, setAutoFailoverTriggered] = useState<boolean>(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState<boolean>(false);

  // Determine if underflow hazard exists
  const isThroughputBelowThreshold = liveThroughputMBps < minThroughputThresholdMBps;
  const isEntropyBelowThreshold = liveShannonEntropy < minShannonEntropyBits;
  const isHazardActive = isThroughputBelowThreshold || isEntropyBelowThreshold;

  // Live sampling interval
  useEffect(() => {
    if (isSimulatedUnderflow) return;

    const interval = setInterval(() => {
      const baseThroughput = device.entropyRateMBps || 64.0;
      const throughputJitter = (Math.random() - 0.5) * 4.0;
      const newThroughput = parseFloat(Math.max(10.0, baseThroughput + throughputJitter).toFixed(1));

      const entropyJitter = (Math.random() - 0.5) * 0.003;
      const newEntropy = parseFloat(Math.min(8.000, Math.max(7.980, 7.995 + entropyJitter)).toFixed(4));

      setLiveThroughputMBps(newThroughput);
      setLiveShannonEntropy(newEntropy);
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulatedUnderflow, device]);

  // Handle Trigger Simulation of Low Entropy Hazard
  const handleSimulateLowEntropy = () => {
    setIsSimulatedUnderflow(true);
    setAlertAcknowledged(false);
    setAutoFailoverTriggered(false);

    // Drop throughput and entropy below thresholds
    setLiveThroughputMBps(24.5);
    setLiveShannonEntropy(7.9120);

    if (onShowToast) {
      onShowToast(
        'CRITICAL: QRNG Throughput Hazard Triggered',
        `Quantum throughput dropped to 24.5 MB/s (Below ${minThroughputThresholdMBps} MB/s security threshold).`,
        'error'
      );
    }
  };

  // Handle Inject Quantum Vacuum Re-seed & Restore
  const handleRestoreEntropy = () => {
    setIsSimulatedUnderflow(false);
    setAutoFailoverTriggered(true);

    setTimeout(() => {
      const base = device.entropyRateMBps || 64.0;
      setLiveThroughputMBps(base);
      setLiveShannonEntropy(7.9972);
      setAutoFailoverTriggered(false);
      setAlertAcknowledged(true);

      if (onShowToast) {
        onShowToast(
          'Quantum TRNG Re-seeded & Restored',
          `Secondary optical quantum vacuum generator engaged. Throughput restored to ${base} MB/s (Shannon Entropy: 7.9972 bits/byte).`,
          'success'
        );
      }
    }, 600);
  };

  return (
    <div id="hsm-entropy-health-monitor" className="space-y-6 animate-fadeIn">
      
      {/* REAL-TIME PULSATING NOTIFICATION BANNER IF BELOW THRESHOLD */}
      {isHazardActive && !alertAcknowledged && (
        <div className="relative rounded-3xl bg-gradient-to-r from-red-950 via-rose-900 to-amber-950 border-2 border-red-500/80 p-5 sm:p-6 shadow-2xl shadow-red-950/90 animate-pulse overflow-hidden">
          {/* Pulsating background beacon glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-500/20 rounded-full blur-2xl animate-ping pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 font-mono">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 rounded-2xl bg-red-900 border border-red-400 text-white shadow-lg animate-bounce shrink-0">
                <BellRing className="w-6 h-6 text-red-200" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500 text-red-300 text-[10px] font-bold tracking-wider">
                  <ShieldAlert className="w-3 h-3 text-red-400 animate-pulse" />
                  <span>CRITICAL FIPS 140-3 §4.9 CONTINUOUS HEALTH TRIGGER</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white font-sans">
                  Quantum Random Number Generator Throughput Sub-Threshold Hazard
                </h4>
                <p className="text-xs text-red-200/90 leading-relaxed">
                  QRNG throughput measured at <strong className="text-white underline">{liveThroughputMBps} MB/s</strong> (Security Limit: &gt;={minThroughputThresholdMBps} MB/s) • Shannon Entropy: <strong className="text-white underline">{liveShannonEntropy}</strong> (Limit: &gt;={minShannonEntropyBits}). Hardware key generation automatically suspended to prevent deterministic key synthesis.
                </p>
              </div>
            </div>

            {/* Action buttons inside alert */}
            <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0">
              <button
                onClick={handleRestoreEntropy}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-red-950 font-bold text-xs transition-all shadow-lg shadow-black/50 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-red-600" />
                <span>Inject Quantum Re-seed</span>
              </button>

              <button
                onClick={() => setAlertAcknowledged(true)}
                className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/80 text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Acknowledge Warning</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Monitoring & Threshold Configuration Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
              <Binary className="w-3.5 h-3.5 animate-pulse" />
              <span>NIST SP 800-90B & FIPS 140-3 ENTROPY HEALTH MONITOR</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
              Real-Time Entropy Health Monitoring Trigger
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Live entropy source validation from <strong className="text-cyan-300">{device.name}</strong> with continuous health test triggers that enforce automated failover if quantum throughput degrades.
            </p>
          </div>

          {/* Trigger Simulation Controls */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            {isHazardActive ? (
              <button
                onClick={handleRestoreEntropy}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Recover & Re-seed QRNG</span>
              </button>
            ) : (
              <button
                onClick={handleSimulateLowEntropy}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-red-950/50"
                title="Simulates quantum avalanche noise drop below threshold to trigger real-time pulsating notification"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Simulate Low Entropy Hazard</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Health Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {/* Throughput */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isThroughputBelowThreshold 
              ? 'bg-red-950/50 border-red-500 text-red-300 shadow-lg shadow-red-950' 
              : 'bg-slate-950/80 border-slate-800/80 text-white'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">
              <span>QRNG Throughput</span>
              <span className={isThroughputBelowThreshold ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-400'}>
                {isThroughputBelowThreshold ? 'SUB-THRESHOLD' : 'OPTIMAL'}
              </span>
            </div>
            <div className="text-2xl font-bold flex items-baseline space-x-1.5">
              <span>{liveThroughputMBps}</span>
              <span className="text-xs text-cyan-400 font-normal">MB/s</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Threshold: &gt;={minThroughputThresholdMBps} MB/s
            </div>
          </div>

          {/* Shannon Entropy */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isEntropyBelowThreshold 
              ? 'bg-red-950/50 border-red-500 text-red-300 shadow-lg shadow-red-950' 
              : 'bg-slate-950/80 border-slate-800/80 text-white'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">
              <span>Shannon Entropy</span>
              <span className={isEntropyBelowThreshold ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-400'}>
                {isEntropyBelowThreshold ? 'CRITICAL' : '8.0000 MAX'}
              </span>
            </div>
            <div className="text-2xl font-bold flex items-baseline space-x-1.5">
              <span>{liveShannonEntropy}</span>
              <span className="text-xs text-purple-400 font-normal">bits/byte</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Threshold: &gt;={minShannonEntropyBits} bits
            </div>
          </div>

          {/* Repetition Count Test (RCT) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-white space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider font-bold">
              <span>NIST SP 800-90B RCT</span>
              <span className="text-emerald-400">PASSED</span>
            </div>
            <div className="text-xl font-bold text-emerald-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-5 h-5" />
              <span>0 Repeats (Pass)</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Cutoff C = 16 consecutive samples
            </div>
          </div>

          {/* Adaptive Proportion Test (APT) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-white space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider font-bold">
              <span>Adaptive Proportion Test</span>
              <span className="text-emerald-400">PASSED</span>
            </div>
            <div className="text-xl font-bold text-cyan-300 flex items-center space-x-1.5">
              <Activity className="w-5 h-5" />
              <span>W = 1024 / C = 512</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Window sample variance: 0.0001
            </div>
          </div>
        </div>

        {/* Interactive Threshold Calibration Sliders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2 font-bold text-white">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>FIPS 140-3 Continuous Health Threshold Calibration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Throughput Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold">Minimum Throughput Alarm Trigger:</span>
                <span className="text-cyan-300 font-bold">{minThroughputThresholdMBps} MB/s</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="2"
                value={minThroughputThresholdMBps}
                onChange={(e) => setMinThroughputThresholdMBps(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>20 MB/s (Permissive)</span>
                <span>48 MB/s (Standard)</span>
                <span>100 MB/s (Ultra-Strict)</span>
              </div>
            </div>

            {/* Shannon Entropy Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold">Minimum Shannon Entropy Alarm Trigger:</span>
                <span className="text-purple-300 font-bold">{minShannonEntropyBits} bits/byte</span>
              </div>
              <input
                type="range"
                min="7.950"
                max="7.998"
                step="0.002"
                value={minShannonEntropyBits}
                onChange={(e) => setMinShannonEntropyBits(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>7.950 (Relaxed)</span>
                <span>7.990 (FIPS Baseline)</span>
                <span>7.998 (Maximum PQC)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
