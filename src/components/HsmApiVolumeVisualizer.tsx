import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Filter, 
  Download, 
  Cpu, 
  Key, 
  Lock, 
  Sparkles, 
  Clock,
  Terminal,
  Zap
} from 'lucide-react';
import { HsmDevice } from '../services/hsmService';

export interface DailyApiVolumePoint {
  date: string;
  dayLabel: string;
  signatures: number;        // ML-DSA-87 / Dilithium signing calls
  decryptions: number;       // ML-KEM-1024 / AES enclave decryptions
  keyExchanges: number;      // Key Encapsulation Mechanism exchanges
  entropySeeds: number;      // TRNG hardware seed requests
  attestations: number;      // Device posture attestation challenges
  backgroundPids: number;    // Calls originating from background daemons
  anomalyScore: number;      // 0 - 100 anomaly scale
  isAnomaly: boolean;
}

const generateInitialDailyData = (daysCount: number): DailyApiVolumePoint[] => {
  const data: DailyApiVolumePoint[] = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    
    // Base volume factors
    const baseMult = isWeekend ? 0.65 : 1.0;
    const isSpikeDay = i === 3; // Simulated background anomaly 3 days ago

    const signatures = Math.round((2800 + Math.random() * 800) * baseMult);
    const decryptions = isSpikeDay 
      ? Math.round(7200 + Math.random() * 1500) 
      : Math.round((3400 + Math.random() * 900) * baseMult);
    const keyExchanges = Math.round((1900 + Math.random() * 500) * baseMult);
    const entropySeeds = Math.round((850 + Math.random() * 250) * baseMult);
    const attestations = Math.round((420 + Math.random() * 120) * baseMult);
    const backgroundPids = isSpikeDay ? Math.round(decryptions * 0.75) : Math.round(decryptions * 0.12);
    
    const anomalyScore = isSpikeDay ? 88 : Math.round(5 + Math.random() * 12);
    const isAnomaly = anomalyScore > 60;

    data.push({
      date: d.toISOString().slice(0, 10),
      dayLabel: dayStr,
      signatures,
      decryptions,
      keyExchanges,
      entropySeeds,
      attestations,
      backgroundPids,
      anomalyScore,
      isAnomaly
    });
  }

  return data;
};

interface HsmApiVolumeVisualizerProps {
  device: HsmDevice;
  onShowToast?: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export const HsmApiVolumeVisualizer: React.FC<HsmApiVolumeVisualizerProps> = ({ device, onShowToast }) => {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(14);
  const [chartType, setChartType] = useState<'AREA' | 'BAR' | 'LINE'>('AREA');
  const [activeMetricFilter, setActiveMetricFilter] = useState<'ALL' | 'SIGNATURES' | 'DECRYPTIONS' | 'KEY_EXCHANGES' | 'BACKGROUND_PIDS'>('ALL');
  const [anomalyThreshold, setAnomalyThreshold] = useState<number>(60);
  const [isSimulatingSpike, setIsSimulatingSpike] = useState<boolean>(false);

  const data = useMemo(() => {
    const raw = generateInitialDailyData(timeRange);
    if (isSimulatingSpike && raw.length > 0) {
      const lastIndex = raw.length - 1;
      raw[lastIndex] = {
        ...raw[lastIndex],
        decryptions: 8900,
        backgroundPids: 6800,
        anomalyScore: 94,
        isAnomaly: true
      };
    }
    return raw;
  }, [timeRange, isSimulatingSpike]);

  const summaryStats = useMemo(() => {
    const totalCalls = data.reduce((acc, p) => acc + p.signatures + p.decryptions + p.keyExchanges + p.entropySeeds + p.attestations, 0);
    const totalDecryptions = data.reduce((acc, p) => acc + p.decryptions, 0);
    const totalSignatures = data.reduce((acc, p) => acc + p.signatures, 0);
    const totalBgCalls = data.reduce((acc, p) => acc + p.backgroundPids, 0);
    const anomalyCount = data.filter(p => p.anomalyScore >= anomalyThreshold).length;
    const avgDaily = Math.round(totalCalls / data.length);

    return {
      totalCalls,
      totalDecryptions,
      totalSignatures,
      totalBgCalls,
      anomalyCount,
      avgDaily
    };
  }, [data, anomalyThreshold]);

  const handleExportTelemetry = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Date,Signatures,Decryptions,KeyExchanges,EntropySeeds,Attestations,BackgroundPids,AnomalyScore"]
      .concat(data.map(d => `${d.date},${d.signatures},${d.decryptions},${d.keyExchanges},${d.entropySeeds},${d.attestations},${d.backgroundPids},${d.anomalyScore}`))
      .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fips-api-volume-telemetry-${device.id}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) {
      onShowToast('Telemetry Exported', `Downloaded ${link.getAttribute('download')} for SOC SIEM correlation.`, 'success');
    }
  };

  return (
    <div id="hsm-api-volume-visualizer" className="space-y-6 animate-fadeIn">
      {/* Primary Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                FIPS ENCLAVE API TELEMETRY & ACCESS PATTERN MONITOR
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
              Daily Programmatic API Call Volume
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Monitor signing, decapsulation, and decryption invocation frequency directed at <strong className="text-cyan-300">{device.name}</strong> to catch anomalous background scraping or side-channel oracle queries.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setIsSimulatingSpike(prev => !prev)}
              className={`px-3.5 py-2 rounded-2xl border font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                isSimulatingSpike 
                  ? 'bg-red-950 text-red-300 border-red-700 shadow-md shadow-red-950 animate-pulse' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isSimulatingSpike ? '⚠️ Simulated Attack Spike Active' : '🧪 Simulate Background Access Spike'}</span>
            </button>

            <button
              onClick={handleExportTelemetry}
              className="px-3.5 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Telemetry</span>
            </button>
          </div>
        </div>

        {/* Aggregated KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total API Invocations ({timeRange}D)</span>
            </span>
            <div className="text-cyan-300 font-bold text-lg">{summaryStats.totalCalls.toLocaleString()}</div>
            <div className="text-slate-400 text-[11px]">~{summaryStats.avgDaily.toLocaleString()} calls / day avg</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>ML-DSA Signatures</span>
            </span>
            <div className="text-purple-400 font-bold text-lg">{summaryStats.totalSignatures.toLocaleString()}</div>
            <div className="text-slate-400 text-[11px]">NIST FIPS 204 Lattice Signing</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enclave Decryptions</span>
            </span>
            <div className="text-emerald-400 font-bold text-lg">{summaryStats.totalDecryptions.toLocaleString()}</div>
            <div className="text-slate-400 text-[11px]">ML-KEM-1024 & AES-GCM</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Background Daemon Anomaly</span>
            </span>
            <div className={`font-bold text-lg ${summaryStats.anomalyCount > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {summaryStats.anomalyCount > 0 ? `${summaryStats.anomalyCount} Anomaly Flags` : 'Nominal (0 Flags)'}
            </div>
            <div className="text-slate-400 text-[11px]">{summaryStats.totalBgCalls.toLocaleString()} nocturnal calls</div>
          </div>
        </div>

        {/* Chart Configuration Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {([7, 14, 30] as const).map(days => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  timeRange === days
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Last {days} Days
              </button>
            ))}
          </div>

          {/* Chart Display Mode */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['AREA', 'BAR', 'LINE'] as const).map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  chartType === type
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'AREA' ? 'Stacked Area' : type === 'BAR' ? 'Grouped Bar' : 'Trend Line'}
              </button>
            ))}
          </div>

          {/* Operation Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'ALL', label: 'All Calls' },
              { id: 'SIGNATURES', label: 'Signatures' },
              { id: 'DECRYPTIONS', label: 'Decryptions' },
              { id: 'BACKGROUND_PIDS', label: 'Background PID' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveMetricFilter(tab.id as any)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  activeMetricFilter === tab.id
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Recharts Visualization Canvas */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Enclave Invocation Volume Over Time (Requests / 24h)</span>
            </span>
            <div className="flex items-center space-x-4 text-[11px]">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span className="text-slate-300">Signatures</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-slate-300">Decryptions</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
                <span className="text-slate-300">Key Exchanges</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-300">Background PIDs</span>
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'AREA' ? (
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sigGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="decGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="kemGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  {(activeMetricFilter === 'ALL' || activeMetricFilter === 'SIGNATURES') && (
                    <Area type="monotone" dataKey="signatures" stroke="#22d3ee" fillOpacity={1} fill="url(#sigGrad)" stackId="1" name="Signatures (ML-DSA)" />
                  )}
                  {(activeMetricFilter === 'ALL' || activeMetricFilter === 'DECRYPTIONS') && (
                    <Area type="monotone" dataKey="decryptions" stroke="#34d399" fillOpacity={1} fill="url(#decGrad)" stackId="1" name="Decryptions" />
                  )}
                  {(activeMetricFilter === 'ALL' || activeMetricFilter === 'KEY_EXCHANGES') && (
                    <Area type="monotone" dataKey="keyExchanges" stroke="#c084fc" fillOpacity={1} fill="url(#kemGrad)" stackId="1" name="Key Exchanges (ML-KEM)" />
                  )}
                  {(activeMetricFilter === 'ALL' || activeMetricFilter === 'BACKGROUND_PIDS') && (
                    <Area type="monotone" dataKey="backgroundPids" stroke="#fbbf24" fillOpacity={1} fill="url(#bgGrad)" stackId="1" name="Background Daemon PIDs" />
                  )}
                </AreaChart>
              ) : chartType === 'BAR' ? (
                <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Bar dataKey="signatures" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Signatures" />
                  <Bar dataKey="decryptions" fill="#34d399" radius={[4, 4, 0, 0]} name="Decryptions" />
                  <Bar dataKey="backgroundPids" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Background PIDs" />
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Line type="monotone" dataKey="signatures" stroke="#22d3ee" strokeWidth={2} dot={false} name="Signatures" />
                  <Line type="monotone" dataKey="decryptions" stroke="#34d399" strokeWidth={2} dot={false} name="Decryptions" />
                  <Line type="monotone" dataKey="backgroundPids" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4 }} name="Background PIDs" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Process Attribution Breakdown Table */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-300 font-bold flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Recent Enclave Invocation Process Attribution</span>
            </span>
            <span className="text-[10px] text-slate-500">Live IPC Port /dev/hsm_enclave0</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase border-b border-slate-800/80">
                  <th className="py-2 px-3">Process Name (PID)</th>
                  <th className="py-2 px-3">Target Endpoint</th>
                  <th className="py-2 px-3">Operation Type</th>
                  <th className="py-2 px-3">Avg Latency</th>
                  <th className="py-2 px-3 text-right">Access Posture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">q-crypt-core-daemon (PID 1420)</td>
                  <td className="py-2.5 px-3 text-slate-300">/api/v1/pqc/sign</td>
                  <td className="py-2.5 px-3 text-slate-400">ML-DSA-87 Digital Signature</td>
                  <td className="py-2.5 px-3 text-emerald-400">1.18 ms</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">AUTHORIZED_FOREGROUND</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">signal-mesh-worker (PID 1892)</td>
                  <td className="py-2.5 px-3 text-slate-300">/api/v1/pqc/decapsulate</td>
                  <td className="py-2.5 px-3 text-slate-400">ML-KEM-1024 Ephemeral Shared Secret</td>
                  <td className="py-2.5 px-3 text-emerald-400">1.42 ms</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">AUTHORIZED_FOREGROUND</td>
                </tr>
                <tr className={isSimulatingSpike ? 'bg-red-950/20' : ''}>
                  <td className={`py-2.5 px-3 font-bold ${isSimulatingSpike ? 'text-red-400' : 'text-slate-300'}`}>
                    {isSimulatingSpike ? 'unauthorized-bg-scanner (PID 9981)' : 'audit-sync-agent (PID 2048)'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">/api/v1/enclave/decrypt_batch</td>
                  <td className="py-2.5 px-3 text-slate-400">AES-256-GCM Bulk Decrypt</td>
                  <td className="py-2.5 px-3 text-amber-400">4.85 ms</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${isSimulatingSpike ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                    {isSimulatingSpike ? 'ANOMALOUS BACKGROUND SPIKE' : 'SCHEDULED_BATCH'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
