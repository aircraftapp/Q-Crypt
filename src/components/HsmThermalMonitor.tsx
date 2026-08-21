import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Flame, 
  Thermometer, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Trash2, 
  Zap, 
  Sliders, 
  Clock, 
  Cpu, 
  Lock, 
  Sparkles,
  Info,
  PowerOff
} from 'lucide-react';
import { HsmDevice } from '../services/hsmService';

export interface ThermalDataPoint {
  time: string;
  temperatureC: number;
  panicThresholdC: number;
  safeLimitC: number;
  loadPercent: number;
}

interface HsmThermalMonitorProps {
  device: HsmDevice;
  onShowToast?: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
  onVolatileShred?: () => void;
}

export const HsmThermalMonitor: React.FC<HsmThermalMonitorProps> = ({ 
  device, 
  onShowToast,
  onVolatileShred
}) => {
  const [currentTemp, setCurrentTemp] = useState<number>(38.4);
  const [panicThreshold, setPanicThreshold] = useState<number>(75);
  const [isArmed, setIsArmed] = useState<boolean>(true);
  const [isPanicTriggered, setIsPanicTriggered] = useState<boolean>(false);
  const [isSimulatingGlitchAttack, setIsSimulatingGlitchAttack] = useState<boolean>(false);
  const [shreddedKeysLog, setShreddedKeysLog] = useState<string[]>([]);

  // Time-series thermal buffer
  const [thermalHistory, setThermalHistory] = useState<ThermalDataPoint[]>(() => {
    const initial: ThermalDataPoint[] = [];
    const now = Date.now();
    for (let i = 15; i >= 0; i--) {
      const d = new Date(now - i * 2000);
      const timeStr = d.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
      initial.push({
        time: timeStr,
        temperatureC: 38.0 + (Math.random() * 1.5),
        panicThresholdC: 75,
        safeLimitC: 55,
        loadPercent: 24 + Math.round(Math.random() * 10)
      });
    }
    return initial;
  });

  // Real-time thermal tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });

      setCurrentTemp(prev => {
        let nextTemp: number;
        if (isSimulatingGlitchAttack) {
          // Rapid laser glitch thermal spike
          nextTemp = parseFloat((prev + (Math.random() * 8.5 + 4.0)).toFixed(1));
        } else if (isPanicTriggered) {
          // Cooling down post panic scram
          nextTemp = Math.max(38.0, parseFloat((prev - 2.5).toFixed(1)));
        } else {
          // Normal thermal fluctuations around 38.5C
          const drift = (Math.random() - 0.5) * 0.8;
          nextTemp = parseFloat(Math.min(52.0, Math.max(36.0, prev + drift)).toFixed(1));
        }

        // Automatic Panic Shutdown Trigger Check
        if (isArmed && !isPanicTriggered && nextTemp >= panicThreshold) {
          triggerPanicShutdown(nextTemp);
        }

        setThermalHistory(hist => {
          const updated = [...hist.slice(1), {
            time: timeStr,
            temperatureC: nextTemp,
            panicThresholdC: panicThreshold,
            safeLimitC: 55,
            loadPercent: isSimulatingGlitchAttack ? 98 : 25 + Math.round(Math.random() * 8)
          }];
          return updated;
        });

        return nextTemp;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulatingGlitchAttack, isPanicTriggered, isArmed, panicThreshold]);

  const triggerPanicShutdown = (tempTriggered: number) => {
    setIsPanicTriggered(true);
    setIsSimulatingGlitchAttack(false);

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] 🚨 PANIC SHUTDOWN TRIGGERED: Silicon Enclave Die Temp (${tempTriggered}°C) breached safety threshold (${panicThreshold}°C). Volatile SRAM keys zeroized in <2.4µs.`;
    setShreddedKeysLog(prev => [logEntry, ...prev]);

    if (onVolatileShred) {
      onVolatileShred();
    }

    if (onShowToast) {
      onShowToast('Panic Shutdown Executed', `Enclave temperature exceeded ${panicThreshold}°C. All volatile secrets zeroized.`, 'error');
    }
  };

  const handleResetEnclave = () => {
    setIsPanicTriggered(false);
    setIsSimulatingGlitchAttack(false);
    setCurrentTemp(38.4);
    if (onShowToast) {
      onShowToast('Enclave Re-Armed', 'Thermal interlock armed and cryptographic volatile registers re-initialized.', 'success');
    }
  };

  const thermalStatus = useMemo(() => {
    if (currentTemp >= panicThreshold) return { label: 'CRITICAL OVERHEAT / ATTACK', color: 'text-red-400', bg: 'bg-red-950 border-red-700' };
    if (currentTemp >= 55) return { label: 'ELEVATED THERMAL LOAD', color: 'text-amber-400', bg: 'bg-amber-950 border-amber-700' };
    return { label: 'NOMINAL FIPS OPERATING ZONE', color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-700' };
  }, [currentTemp, panicThreshold]);

  return (
    <div id="hsm-thermal-monitor" className="space-y-6 animate-fadeIn">
      {/* Primary Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Thermometer className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                FIPS 140-3 HARDWARE ENCLAVE THERMAL & SIDE-CHANNEL INTERLOCK
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
              Operational Thermal Monitoring & Panic Shutdown
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Track the real-time silicon junction temperature of <strong className="text-cyan-300">{device.name}</strong>. If operational thermal thresholds are exceeded (indicating Laser Fault Injection or physical decapsulation), the Panic Shutdown engine instantly shreds volatile keys in &lt;2.4 microseconds.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            {isPanicTriggered ? (
              <button
                onClick={handleResetEnclave}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-Arm Enclave & Clear Tamper</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSimulatingGlitchAttack(true)}
                className="px-4 py-2.5 rounded-2xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-700 font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-red-950/50"
                title="Simulates a rapid laser heating spike to test the automatic panic zeroization trigger"
              >
                <Flame className="w-4 h-4 text-red-400" />
                <span>Simulate Laser Glitch Attack (+45°C)</span>
              </button>
            )}

            <button
              onClick={() => triggerPanicShutdown(currentTemp)}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-800/80 font-bold transition-all flex items-center space-x-2 cursor-pointer"
            >
              <PowerOff className="w-4 h-4" />
              <span>Manual Panic Scram</span>
            </button>
          </div>
        </div>

        {/* Live Thermal Gauges & Threshold Controller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          
          {/* Current Temperature Gauge */}
          <div className={`p-4 rounded-2xl border space-y-1.5 transition-all ${
            isPanicTriggered ? 'bg-red-950/60 border-red-600 animate-pulse' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Current Enclave Temp</span>
            </span>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-black ${isPanicTriggered ? 'text-red-400' : currentTemp >= 55 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentTemp.toFixed(1)}°C
              </span>
              <span className="text-slate-500 text-xs">({((currentTemp * 9/5) + 32).toFixed(1)}°F)</span>
            </div>
            <div className={`text-[10px] font-bold uppercase ${thermalStatus.color}`}>
              {thermalStatus.label}
            </div>
          </div>

          {/* Panic Trigger Threshold Controller */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 uppercase font-bold flex items-center space-x-1">
                <Sliders className="w-3 h-3 text-red-400" />
                <span>Panic Scram Limit</span>
              </span>
              <span className="text-red-400 font-bold">{panicThreshold}°C</span>
            </div>
            <input
              type="range"
              min="60"
              max="90"
              step="1"
              value={panicThreshold}
              onChange={(e) => setPanicThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>60°C (Strict)</span>
              <span>90°C (Relaxed)</span>
            </div>
          </div>

          {/* Volatile Memory Register State */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Volatile SRAM Keys</span>
            </span>
            <div className={`text-base font-bold ${isPanicTriggered ? 'text-red-400' : 'text-emerald-400'}`}>
              {isPanicTriggered ? 'ZEROIZED / PURGED' : '4 ACTIVE EPHEMERAL SLOTS'}
            </div>
            <div className="text-[10px] text-slate-400">
              {isPanicTriggered ? 'Tamper latch locked' : 'ML-KEM Shared Secrets Protected'}
            </div>
          </div>

          {/* Side-Channel Guard Interlock */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Laser Interlock Circuit</span>
            </span>
            <div className="text-white font-bold text-base flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isArmed ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>{isArmed ? 'ARMED & ACTIVE' : 'DISARMED'}</span>
            </div>
            <div className="text-[10px] text-slate-400">Fast-path capacitor discharge ready</div>
          </div>

        </div>

        {/* Real-Time Thermal History Chart (Recharts) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>Enclave Silicon Die Temperature Time-Series (°C)</span>
            </span>
            <div className="flex items-center space-x-4 text-[11px]">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span className="text-slate-300">Live Temperature</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                <span className="text-slate-300">Panic Threshold ({panicThreshold}°C)</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={thermalHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentTemp >= panicThreshold ? '#f87171' : '#22d3ee'} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={currentTemp >= panicThreshold ? '#f87171' : '#22d3ee'} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" domain={[20, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temperatureC" 
                  stroke={currentTemp >= panicThreshold ? '#f87171' : '#22d3ee'} 
                  fillOpacity={1} 
                  fill="url(#tempGrad)" 
                  name="Temp (°C)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="panicThresholdC" 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  strokeWidth={2} 
                  dot={false} 
                  name="Panic Threshold" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Shred & Thermal Incident Log */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span className="flex items-center space-x-1.5 text-slate-300 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Thermal Incident & Zeroization Fast-Path Log</span>
            </span>
            <span>FIPS 140-3 §4.10 Interlock</span>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {shreddedKeysLog.length > 0 ? (
              shreddedKeysLog.map((log, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-[11px]">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-[11px] italic py-2">
                No thermal breach incidents detected. Silicon junction operating within nominal NIST parameters.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
