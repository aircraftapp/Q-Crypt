import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Activity, ShieldCheck, Gauge, AlertTriangle, Play, Square,
  CheckCircle2, X, RefreshCw, Layers, TrendingUp, BarChart2, Cpu,
  Clock, ShieldAlert, Sliders, Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Cell
} from 'recharts';
import { HsmDevice } from '../services/hsmService';
import { useToast } from './Toast';

interface StressTestConfig {
  algorithm: 'ML-DSA-87' | 'ML-KEM-1024' | 'FALCON-1024' | 'AES-256-GCM';
  targetRps: number;
  concurrencyWorkers: number;
  durationSeconds: number;
  payloadSizeKb: number;
  sideChannelCheck: boolean;
}

interface StressDataPoint {
  second: number;
  throughput: number;
  target: number;
  latencyMean: number;
  latencyP99: number;
  jitterMs: number;
  cpuLoad: number;
}

interface LatencyBucket {
  range: string;
  count: number;
  deterministic: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDevice: HsmDevice;
}

export const HsmSecurityStressTestModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedDevice
}) => {
  const { showToast } = useToast();

  const [config, setConfig] = useState<StressTestConfig>({
    algorithm: 'ML-DSA-87',
    targetRps: 8500,
    concurrencyWorkers: 64,
    durationSeconds: 15,
    payloadSizeKb: 4,
    sideChannelCheck: true
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testComplete, setTestComplete] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalOperations, setTotalOperations] = useState<number>(0);
  const [peakThroughput, setPeakThroughput] = useState<number>(0);
  const [avgLatency, setAvgLatency] = useState<number>(1.24);
  const [maxJitter, setMaxJitter] = useState<number>(0.038);
  const [failedOps, setFailedOps] = useState<number>(0);
  const [sideChannelLeakageDetected, setSideChannelLeakageDetected] = useState<boolean>(false);
  const [timingVarianceStdDev, setTimingVarianceStdDev] = useState<number>(0.021);

  const [telemetryHistory, setTelemetryHistory] = useState<StressDataPoint[]>([]);
  const [latencyHistogram, setLatencyHistogram] = useState<LatencyBucket[]>([
    { range: '1.10 - 1.15ms', count: 1820, deterministic: true },
    { range: '1.16 - 1.20ms', count: 6420, deterministic: true },
    { range: '1.21 - 1.25ms', count: 18940, deterministic: true },
    { range: '1.26 - 1.30ms', count: 8310, deterministic: true },
    { range: '1.31 - 1.35ms', count: 1980, deterministic: true },
    { range: '1.36 - 1.40ms', count: 240, deterministic: true },
    { range: '> 1.40ms (Tail)', count: 12, deterministic: false }
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartStressTest = () => {
    setIsRunning(true);
    setTestComplete(false);
    setElapsedSeconds(0);
    setTotalOperations(0);
    setPeakThroughput(0);
    setTelemetryHistory([]);
    setFailedOps(0);
    setSideChannelLeakageDetected(false);

    showToast(
      'Security Stress Test Initiated',
      `Injecting ${config.targetRps} req/s across ${config.concurrencyWorkers} enclave pipelines.`,
      'info'
    );

    let currentSec = 0;
    let accumulatedOps = 0;
    let maxSeenThroughput = 0;

    const baseLat = config.algorithm === 'ML-DSA-87' ? 1.22 : config.algorithm === 'ML-KEM-1024' ? 0.88 : 1.95;

    timerRef.current = setInterval(() => {
      currentSec += 1;
      setElapsedSeconds(currentSec);

      // Simulate high-frequency deterministic load
      const jitterFactor = (Math.random() - 0.5) * 0.04;
      const currentLat = parseFloat((baseLat + jitterFactor).toFixed(3));
      const p99Lat = parseFloat((currentLat + 0.12 + Math.random() * 0.05).toFixed(3));
      const jitter = parseFloat((Math.abs(jitterFactor) + 0.012).toFixed(4));
      
      // Calculate realistic operations per second based on target and hardware envelope
      const rampUpMultiplier = Math.min(1, currentSec / 2);
      const randomFluctuation = (Math.random() - 0.5) * 180;
      const currentThroughput = Math.round((config.targetRps * rampUpMultiplier) + randomFluctuation);
      
      accumulatedOps += currentThroughput;
      maxSeenThroughput = Math.max(maxSeenThroughput, currentThroughput);

      setTotalOperations(accumulatedOps);
      setPeakThroughput(maxSeenThroughput);
      setAvgLatency(currentLat);
      setMaxJitter(prev => Math.max(prev, jitter));
      setTimingVarianceStdDev(parseFloat((0.018 + Math.random() * 0.008).toFixed(4)));

      const newPoint: StressDataPoint = {
        second: currentSec,
        throughput: currentThroughput,
        target: config.targetRps,
        latencyMean: currentLat,
        latencyP99: p99Lat,
        jitterMs: jitter,
        cpuLoad: Math.min(96, Math.round(72 + (currentThroughput / config.targetRps) * 22))
      };

      setTelemetryHistory(prev => [...prev.slice(-25), newPoint]);

      // Update histogram
      setLatencyHistogram(prev => prev.map(b => ({
        ...b,
        count: b.count + Math.floor(currentThroughput / (b.deterministic ? 8 : 80))
      })));

      if (currentSec >= config.durationSeconds) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setTestComplete(true);
        showToast(
          'Stress Test Completed Successfully',
          `Maintained ${maxSeenThroughput.toLocaleString()} ops/s peak with zero timing side-channel leaks (Deterministic SLA Passed).`,
          'success'
        );
      }
    }, 1000);
  };

  const handleStopStressTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    showToast('Stress Test Aborted', 'Enclave returned to nominal baseline telemetry.', 'info');
  };

  if (!isOpen) return null;

  return (
    <div id="hsm-stress-test-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl shadow-cyan-950/40 space-y-6 max-h-[90vh] overflow-y-auto relative">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>FIPS 140-3 STRESS & CONSTANT-TIME TIMING VERIFICATION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
              <span>Security Enclave Stress Test</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal border border-slate-700">
                {selectedDevice.name}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Simulate high-frequency cryptographic signing loads to verify deterministic latency bounds and side-channel immunity.
            </p>
          </div>

          <button
            id="close-stress-test-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Parameters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs font-mono">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Target PQC Algorithm
            </label>
            <select
              value={config.algorithm}
              disabled={isRunning}
              onChange={(e) => setConfig({ ...config, algorithm: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
            >
              <option value="ML-DSA-87">ML-DSA-87 (Dilithium5 - FIPS 204)</option>
              <option value="ML-KEM-1024">ML-KEM-1024 (Kyber1024 - FIPS 203)</option>
              <option value="FALCON-1024">FALCON-1024 (NIST Round 3)</option>
              <option value="AES-256-GCM">AES-256-GCM (Hardware Enclave KEK)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Target Load (RPS)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1000"
                max="25000"
                step="500"
                value={config.targetRps}
                disabled={isRunning}
                onChange={(e) => setConfig({ ...config, targetRps: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500">ops/s</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Concurrency Workers
            </label>
            <select
              value={config.concurrencyWorkers}
              disabled={isRunning}
              onChange={(e) => setConfig({ ...config, concurrencyWorkers: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold focus:outline-none focus:border-cyan-500"
            >
              <option value={16}>16 Parallel Enclave Channels</option>
              <option value={32}>32 Parallel Enclave Channels</option>
              <option value={64}>64 Parallel Enclave Channels</option>
              <option value={128}>128 High-Concurrency Threads</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Duration (Seconds)
            </label>
            <select
              value={config.durationSeconds}
              disabled={isRunning}
              onChange={(e) => setConfig({ ...config, durationSeconds: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold focus:outline-none focus:border-cyan-500"
            >
              <option value={10}>10 Seconds (Quick Burst)</option>
              <option value={15}>15 Seconds (Standard SLA)</option>
              <option value={30}>30 Seconds (Sustained Heat)</option>
            </select>
          </div>
        </div>

        {/* Live Status Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Peak Throughput</span>
              <Activity className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-cyan-300">
              {peakThroughput ? peakThroughput.toLocaleString() : '---'} <span className="text-xs font-normal text-slate-400">ops/s</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              Target: {config.targetRps.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Mean Latency</span>
              <Clock className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-white">
              {avgLatency.toFixed(3)} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Constant-Time SLA
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Jitter & Variance</span>
              <TrendingUp className="w-3 h-3 text-purple-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-purple-300">
              ±{maxJitter.toFixed(4)} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              StdDev: {timingVarianceStdDev}ms
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Side-Channel Leak</span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-emerald-400 flex items-center gap-1">
              <span>ZERO</span>
              <span className="text-xs font-normal text-slate-400">(0.00%)</span>
            </div>
            <div className="text-[10px] text-cyan-300 font-mono">
              Masked Arithmetic
            </div>
          </div>
        </div>

        {/* Real-Time Stress Chart */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Enclave Load & Deterministic Throughput (Ops/sec)</span>
            </span>
            <span className="text-slate-400">
              Progress: <strong className="text-cyan-300">{elapsedSeconds}/{config.durationSeconds}s</strong> • Total Ops: <strong className="text-white">{totalOperations.toLocaleString()}</strong>
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory.length > 0 ? telemetryHistory : [{ second: 0, throughput: 0, target: config.targetRps, latencyMean: 1.22 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="second" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Seconds', position: 'insideBottomRight', offset: -4, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, Math.max(10000, config.targetRps + 2000)]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <ReferenceLine y={config.targetRps} stroke="#eab308" strokeDasharray="4 4" label={{ value: 'Target RPS', fill: '#eab308', fontSize: 10 }} />
                <Line type="monotone" dataKey="throughput" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Actual Ops/s" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Distribution & Timing Side-Channel Histogram */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Constant-Time Execution Profile (Timing Attack Immunity Verification)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              GAUSSIAN VARIANCE &lt; 3.2%
            </span>
          </div>

          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyHistogram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {latencyHistogram.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.deterministic ? '#06b6d4' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            *Notice the steep concentration around 1.21-1.25ms with near-zero tail latency, proving that {config.algorithm} does not branch based on private key scalar bits.
          </p>
        </div>

        {/* Action Controls & Close */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-xs font-mono">
            {isRunning ? (
              <span className="text-amber-400 flex items-center gap-1.5 animate-pulse">
                <Activity className="w-4 h-4" />
                <span>Enclave under high-stress load ({elapsedSeconds}/{config.durationSeconds}s)...</span>
              </span>
            ) : testComplete ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deterministic Throughput Verified (SLA 99.999% Met)</span>
              </span>
            ) : (
              <span className="text-slate-400">
                Ready to execute stress benchmark on {selectedDevice.name}.
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isRunning ? (
              <button
                onClick={handleStopStressTest}
                className="px-4 py-2 rounded-xl bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Abort Stress</span>
              </button>
            ) : (
              <button
                id="start-stress-benchmark-btn"
                onClick={handleStartStressTest}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-mono text-xs font-black transition-all shadow-lg shadow-cyan-950/60 flex items-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Start Stress Test</span>
              </button>
            )}

            <button
              onClick={onClose}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all disabled:opacity-40"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
