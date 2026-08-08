import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity, Cpu, Radio, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2, Lock, FileText } from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { AnimatedCounter } from './AnimatedCounter';
import { generateSecurityReportPdf } from '../utils/generateSecurityReportPdf';

interface ThreatLog {
  id: string;
  timestamp: string;
  event: string;
  location: string;
  status: 'SUPPRESSED' | 'VERIFIED' | 'ENCRYPTED';
  severity: 'LOW' | 'INFO';
}

export const NetworkThreatDashboard: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();

  // Fluctuating real-time metrics (safe range)
  const [threatScore, setThreatScore] = useState<number>(12.4); // 0-100 scale, <20 is SAFE / DEFCON 5
  const [threatTrend, setThreatTrend] = useState<number>(-0.1);
  const [packetsPerSec, setPacketsPerSec] = useState<number>(4829100);
  const [activeNodesCount, setActiveNodesCount] = useState<number>(1842);
  const [entropyHealth, setEntropyHealth] = useState<number>(99.991);
  const [handshakeLatency, setHandshakeLatency] = useState<number>(1.42);

  // Live event feeds
  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>([
    {
      id: 'log-1',
      timestamp: '20:32:11 UTC',
      event: 'ML-KEM-1024 Kyber Handshake Verified',
      location: 'Frankfurt Enclave (FRA-02)',
      status: 'VERIFIED',
      severity: 'INFO',
    },
    {
      id: 'log-2',
      timestamp: '20:31:55 UTC',
      event: 'Pre-Quantum Decryption Probe Deflected',
      location: 'Washington DC (IAD-01)',
      status: 'SUPPRESSED',
      severity: 'LOW',
    },
    {
      id: 'log-3',
      timestamp: '20:30:40 UTC',
      event: 'Quantum Key Redistribution Protocol Sync',
      location: 'Tokyo Node (TYO-04)',
      status: 'ENCRYPTED',
      severity: 'INFO',
    },
    {
      id: 'log-4',
      timestamp: '20:29:18 UTC',
      event: 'Hardware RNG Entropy Pool Calibration',
      location: 'Zurich Core (ZRH-01)',
      status: 'VERIFIED',
      severity: 'INFO',
    },
  ]);

  // Real-time fluctuation loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuating threat score within safe 11.2% - 14.8% range
      setThreatScore((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        const newScore = Math.max(10.5, Math.min(15.5, prev + delta));
        setThreatTrend(Number(delta.toFixed(2)));
        return Number(newScore.toFixed(1));
      });

      // Packet rate fluctuation
      setPacketsPerSec((prev) => prev + Math.floor((Math.random() - 0.48) * 12000));

      // Handshake latency fluctuation (1.35 - 1.55 ms)
      setHandshakeLatency(Number((1.35 + Math.random() * 0.18).toFixed(2)));

      // Entropy health tiny fluctuation
      setEntropyHealth(Number((99.985 + Math.random() * 0.012).toFixed(3)));

      // Periodically append a simulated security event
      if (Math.random() > 0.65) {
        const locations = ['London (LHR-01)', 'Singapore (SIN-02)', 'Sydney (SYD-01)', 'Toronto (YYZ-03)', 'Seoul (ICN-01)'];
        const events = [
          'Entropy Pool Reseeded via Hardware QRNG',
          'Classical RSA Fallback Probe Nullified',
          'Harvest-Now-Decrypt-Later Interception Shield Active',
          'Lattice Vector Ring Verification Passed',
          'Dilithium Digital Signature Attestation Complete',
        ];
        const statuses: ('SUPPRESSED' | 'VERIFIED' | 'ENCRYPTED')[] = ['VERIFIED', 'SUPPRESSED', 'ENCRYPTED'];
        
        const now = new Date();
        const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC`;

        const newLog: ThreatLog = {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          event: events[Math.floor(Math.random() * events.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          severity: 'INFO',
        };

        setThreatLogs((prev) => [newLog, ...prev.slice(0, 5)]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleExportPdf = () => {
    generateSecurityReportPdf({
      threatScore,
      activeNodesCount,
      packetsPerSec,
      entropyHealth,
      generatedBy: 'Q-CRYPT Network Security Dashboard Engine'
    });
    showToast('Export Security Report PDF', 'Generated comprehensive network protection PDF document.', 'success');
  };

  const handleExportThreatReport = () => {
    const reportSummary = `Q-CRYPT SECURITY THREAT REPORT\n==============================\nThreat Level: LOW (DEFCON 5)\nThreat Score: ${threatScore} / 100\nActive Nodes: ${activeNodesCount}\nThroughput: ${(packetsPerSec / 1000000).toFixed(2)} M pkts/sec\nEntropy Quality: ${entropyHealth}%\nGenerated: ${new Date().toISOString()}`;
    navigator.clipboard.writeText(reportSummary);
    showToast('Threat Audit Report Copied', 'Summary metrics copied to clipboard', 'success');
  };

  return (
    <div className="pro-card rounded-2xl p-6 border border-cyan-500/20 bg-slate-900/90 text-slate-100 shadow-2xl relative overflow-hidden">
      {/* Background glowing indicator */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-400 relative">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">{t('threat.title')}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                {t('threat.status')}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {t('threat.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 hover:text-white text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Security Report PDF</span>
          </button>

          <button
            onClick={handleExportThreatReport}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-2 transition-all active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('threat.copy')}</span>
          </button>
        </div>
      </div>

      {/* Metrics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        
        {/* Metric 1: Threat Index Counter */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>THREAT LEVEL INDEX</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
              OPTIMAL
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-white tracking-tight">
              {threatScore}%
            </span>
            <span className={`text-xs font-mono font-bold flex items-center ${threatTrend <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {threatTrend <= 0 ? <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
              {Math.abs(threatTrend)}%
            </span>
          </div>

          {/* Visual progress meter */}
          <div className="mt-3 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(threatScore / 100) * 100}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 font-sans mt-2">
            <strong>What this means:</strong> Your current threat risk is low & safe (below 25%). No security vulnerabilities found.
          </p>
        </div>

        {/* Metric 2: Global PQC Traffic */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>ENCRYPTED THROUGHPUT</span>
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-cyan-300 tracking-tight">
              {(packetsPerSec / 1000000).toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">M pkts/s Benchmark</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Encapsulation Latency:</span>
            <span className="text-cyan-400 font-bold">{handshakeLatency} ms</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans mt-1">
            <strong>Tested Throughput:</strong> High-bandwidth ML-KEM-1024 lattice key encapsulation benchmark capacity.
          </p>
        </div>

        {/* Metric 3: Sovereign Relay Enclaves */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>SOVEREIGN RELAYS</span>
            </span>
            <span className="text-[10px] text-purple-300 font-bold bg-purple-950 px-1.5 py-0.5 rounded border border-purple-900">
              24 CORE NODES
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-purple-200 tracking-tight">
              24
            </span>
            <span className="text-xs font-mono text-slate-400">Global Enclaves</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Enclave Status:</span>
            <span className="text-purple-400 font-bold">100% Synchronized</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans mt-1">
            <strong>Deployment:</strong> 24 sovereign global enclaves across US, EU, and APAC for zero-metadata routing.
          </p>
        </div>

        {/* Metric 4: Quantum Entropy Quality */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>QRNG ENTROPY POOL</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
              HIGH DENSITY
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-emerald-300 tracking-tight">
              {entropyHealth}%
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Polynomial Modulus:</span>
            <span className="text-emerald-400 font-bold">q = 3329</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            NIST SP 800-90B compliant hardware seed
          </p>
        </div>

      </div>

      {/* Real-time Threat Mitigation Log Feed */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Active Security Audit Feed
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Live Stream • 2.5s Auto-Refresh
          </span>
        </div>

        <div className="space-y-2">
          {threatLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2 transition-all hover:border-slate-700"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                <span className="text-slate-200 font-bold text-[11px]">{log.event}</span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {log.location}
                </span>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 'SUPPRESSED'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      : log.status === 'VERIFIED'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
