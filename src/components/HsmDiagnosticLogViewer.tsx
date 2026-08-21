import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  Info, 
  AlertOctagon, 
  Terminal, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Eye,
  Radio,
  SlidersHorizontal,
  Lock,
  Cpu
} from 'lucide-react';
import { 
  HsmDevice, 
  HsmDiagnosticLog, 
  DiagnosticLogLevel, 
  DiagnosticSubsystem, 
  INITIAL_HSM_DIAGNOSTIC_LOGS 
} from '../services/hsmService';

interface HsmDiagnosticLogViewerProps {
  device: HsmDevice;
  onShowToast?: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

const COMMON_ERROR_CODES: { [code: string]: { description: string; resolution: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' } } = {
  'CKR_PIN_INCORRECT_WARNING': {
    description: 'PKCS#11 authentication failed due to invalid User or Security Officer PIN token format.',
    resolution: 'Verify token credentials and SO quorum smartcard status. Avoid exceeding 5 failed attempts.',
    severity: 'MEDIUM'
  },
  'CKR_DEVICE_BUSY': {
    description: 'Hardware crypto accelerator queue is currently saturated by concurrent batch requests.',
    resolution: 'Enclave pipeline load balancing will automatically throttle non-critical background jobs.',
    severity: 'LOW'
  },
  'CKR_TEMPLATE_INCONSISTENT': {
    description: 'Cryptoki object creation rejected because CKA_EXTRACTABLE was set to true.',
    resolution: 'FIPS 140-3 policy forbids private key extraction. Ensure CKA_EXTRACTABLE=CK_FALSE.',
    severity: 'HIGH'
  },
  'TRNG_JITTER_COMPENSATE': {
    description: 'Avalanche noise diode dynamic compensation engaged due to thermal variation.',
    resolution: 'Nominal self-calibration routine. No administrative action required.',
    severity: 'LOW'
  },
  'MTLS_CERT_EXPIRING_SOON': {
    description: 'mTLS client identity certificate expires in under 48 hours.',
    resolution: 'Rotate client certificate using post-quantum ML-DSA-87 root CA authority.',
    severity: 'MEDIUM'
  }
};

export const HsmDiagnosticLogViewer: React.FC<HsmDiagnosticLogViewerProps> = ({ device, onShowToast }) => {
  const [logs, setLogs] = useState<HsmDiagnosticLog[]>(INITIAL_HSM_DIAGNOSTIC_LOGS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<DiagnosticLogLevel | 'ALL'>('ALL');
  const [selectedSubsystem, setSelectedSubsystem] = useState<DiagnosticSubsystem | 'ALL'>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>('diag-002');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeErrorCodeModal, setActiveErrorCodeModal] = useState<string | null>(null);

  // Filter logs based on current device, search query, level, subsystem
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchDevice = log.hsmId === device.id || log.hsmId === 'nitrokey-nethsm'; // fallback for demo rich data
      const matchLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
      const matchSubsystem = selectedSubsystem === 'ALL' || log.subsystem === selectedSubsystem;
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        log.eventCode.toLowerCase().includes(q) ||
        log.message.toLowerCase().includes(q) ||
        log.subsystem.toLowerCase().includes(q) ||
        log.anonymizedClient.toLowerCase().includes(q) ||
        log.sanitizedPayload.toLowerCase().includes(q);

      return matchLevel && matchSubsystem && matchSearch;
    });
  }, [logs, device.id, selectedLevel, selectedSubsystem, searchQuery]);

  // Live incoming diagnostic log generator simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const subsystems: DiagnosticSubsystem[] = ['PKCS11_CORE', 'TRNG_ENTROPY', 'MTLS_BRIDGE', 'LATTICE_ACCELERATOR', 'SESSION_MANAGER'];
        const sub = subsystems[Math.floor(Math.random() * subsystems.length)];
        const rtt = parseFloat((0.8 + Math.random() * 1.5).toFixed(2));
        
        let level: DiagnosticLogLevel = 'INFO';
        let code = 'CRYPTO_OP_NOMINAL';
        let msg = `Hardware operation executed within FIPS 140-3 enclave boundary (${rtt}ms RTT).`;
        let payload = `{"subsystem": "${sub}", "cycle_count": ${Math.floor(Math.random() * 50000 + 100000)}, "rtt_ms": ${rtt}}`;
        let tip: string | undefined = undefined;

        if (sub === 'LATTICE_ACCELERATOR') {
          code = 'CRYPTO_ML_DSA_SIGN_OK';
          msg = 'Enclave completed deterministic FIPS 204 ML-DSA-87 signature generation.';
          payload = `{"algorithm": "ML-DSA-87", "matrix_k": 8, "matrix_l": 7, "cycles": 184000, "rtt_ms": ${rtt}}`;
          tip = 'Lattice NTT arithmetic coprocessor verified with zero soft errors.';
        } else if (sub === 'TRNG_ENTROPY') {
          code = 'TRNG_NIST_APT_PASS';
          msg = 'Adaptive Proportion Test (NIST SP 800-90B) continuous health check passed.';
          payload = `{"shannon_entropy": ${(7.994 + Math.random() * 0.005).toFixed(4)}, "rct_result": "PASS", "apt_result": "PASS"}`;
          tip = 'TRNG noise quality nominal with maximum Shannon entropy.';
        } else if (sub === 'MTLS_BRIDGE') {
          code = 'NET_TLS13_SESSION_KEEP_ALIVE';
          msg = 'mTLS TLS 1.3 heartbeat acknowledged with pinned post-quantum root certificate.';
          payload = `{"protocol": "TLS 1.3", "pqc_kem": "ML-KEM-768", "latency_ms": ${rtt}}`;
        }

        const newLog: HsmDiagnosticLog = {
          id: `diag-live-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
          hsmId: device.id,
          hsmName: device.name.split(' ')[0],
          level,
          subsystem: sub,
          eventCode: code,
          message: msg,
          sanitizedPayload: payload,
          anonymizedClient: `10.180.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 250)} (Mesh Node)`,
          durationMs: rtt,
          troubleshootingTip: tip
        };

        setLogs(prev => [newLog, ...prev.slice(0, 59)]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, device]);

  const handleCopyLog = (log: HsmDiagnosticLog) => {
    const text = `[${log.timestamp}] [${log.level}] [${log.subsystem}] [${log.eventCode}]
Message: ${log.message}
Client: ${log.anonymizedClient}
Duration: ${log.durationMs}ms
Payload: ${log.sanitizedPayload}
${log.troubleshootingTip ? `Troubleshooting: ${log.troubleshootingTip}` : ''}`;

    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    if (onShowToast) {
      onShowToast('Log Copied', `Anonymized diagnostic entry [${log.eventCode}] copied to clipboard.`, 'info');
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportDiagnosticBundle = () => {
    const bundle = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        standard: 'FIPS 140-3 Section 4.11 & RFC 5424 Anonymized Enclave Diagnostic Log Standard',
        sanitizationPolicy: 'Zero Private Key Exposure / All IP Addresses Subnet-Masked',
        hsmId: device.id,
        hsmName: device.name,
        fipsCertificate: device.fipsCertificateNumber,
        firmware: device.firmware
      },
      diagnosticLogs: filteredLogs
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hsm-diagnostic-bundle-${device.id}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('Diagnostics Exported', `Downloaded sanitized diagnostic bundle (${filteredLogs.length} entries).`, 'success');
    }
  };

  const getLevelBadge = (level: DiagnosticLogLevel) => {
    switch (level) {
      case 'ERROR':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800"><AlertOctagon className="w-3 h-3" /><span>ERROR</span></span>;
      case 'WARN':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800"><AlertTriangle className="w-3 h-3" /><span>WARN</span></span>;
      case 'INFO':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800"><Info className="w-3 h-3" /><span>INFO</span></span>;
      case 'DEBUG':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-700"><Terminal className="w-3 h-3" /><span>DEBUG</span></span>;
    }
  };

  return (
    <div id="hsm-diagnostic-log-viewer" className="space-y-6 animate-fadeIn">
      {/* Header & Anonymization Security Seal */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
              <Terminal className="w-3.5 h-3.5 animate-pulse" />
              <span>FIPS 140-3 HARDWARE ENCLAVE OPERATIONAL DIAGNOSTICS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
              Internal HSM Diagnostic Log Viewer
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Anonymized, non-sensitive operational telemetry from <strong className="text-cyan-300">{device.name}</strong> to inspect hardware coprocessor routines, PKCS#11 sessions, and connection issues.
            </p>
          </div>

          {/* Anonymization Compliance Badge & Live Feed Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-[11px] uppercase tracking-wider">Sanitization Verified</div>
                <div className="text-[10px] text-emerald-400/80">0 Key Leakage • RFC 5424 Sanitized</div>
              </div>
            </div>

            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3.5 py-2 rounded-2xl font-mono text-xs font-bold transition-all border flex items-center space-x-2 cursor-pointer ${
                isLiveStreaming
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Toggle real-time incoming diagnostic log stream"
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              <span>{isLiveStreaming ? 'Live Stream Active' : 'Stream Paused'}</span>
            </button>

            <button
              onClick={handleExportDiagnosticBundle}
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer"
              title="Export complete sanitized diagnostic bundle JSON for support triage"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Bundle</span>
            </button>
          </div>
        </div>

        {/* Filters Bar: Search, Severity, Subsystem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event code, message, payload, or client..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-cyan-300 focus:outline-none focus:border-cyan-500 text-xs"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">INFO (Nominal)</option>
              <option value="WARN">WARN (Warning)</option>
              <option value="ERROR">ERROR (Fault)</option>
              <option value="DEBUG">DEBUG (Detailed)</option>
            </select>
          </div>

          {/* Subsystem Filter */}
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedSubsystem}
              onChange={(e) => setSelectedSubsystem(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-cyan-300 focus:outline-none focus:border-cyan-500 text-xs"
            >
              <option value="ALL">All Subsystems</option>
              <option value="LATTICE_ACCELERATOR">Lattice NTT Coprocessor</option>
              <option value="PKCS11_CORE">PKCS#11 Core Engine</option>
              <option value="TRNG_ENTROPY">TRNG Noise Enclave</option>
              <option value="MTLS_BRIDGE">mTLS Network Bridge</option>
              <option value="BOOT_ROM">Immutable Boot ROM</option>
              <option value="TAMPER_MESH">Physical Tamper Mesh</option>
              <option value="QUORUM_AUTH">Quorum Auth (M-of-N)</option>
              <option value="SESSION_MANAGER">Session Manager</option>
            </select>
          </div>
        </div>

        {/* Quick Error Code Diagnostic Lookup Helper Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
          <span className="text-slate-500 text-[11px] flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Common Enclave Codes:</span>
          </span>
          {Object.keys(COMMON_ERROR_CODES).map((code) => (
            <button
              key={code}
              onClick={() => {
                setSearchQuery(code);
                setActiveErrorCodeModal(code);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 transition-colors text-[10px] cursor-pointer"
            >
              <code>{code}</code>
            </button>
          ))}
        </div>
      </div>

      {/* Code Knowledge Modal when clicked */}
      {activeErrorCodeModal && COMMON_ERROR_CODES[activeErrorCodeModal] && (
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-cyan-300">
              <Info className="w-4 h-4" />
              <span>Enclave Event Resolution Guide: <code>{activeErrorCodeModal}</code></span>
            </div>
            <button
              onClick={() => setActiveErrorCodeModal(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300">
            <strong>Description:</strong> {COMMON_ERROR_CODES[activeErrorCodeModal].description}
          </p>
          <p className="text-cyan-400">
            <strong>Recommended Resolution:</strong> {COMMON_ERROR_CODES[activeErrorCodeModal].resolution}
          </p>
        </div>
      )}

      {/* Diagnostic Logs Table / Stream List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold">{filteredLogs.length}</span>
            <span>Sanitized Enclave Events</span>
            {isLiveStreaming && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500">
            Showing logs for {device.name}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs space-y-2">
            <AlertOctagon className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No operational diagnostic logs match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('ALL');
                setSelectedSubsystem('ALL');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 font-mono text-xs">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div
                  key={log.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded 
                      ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-black/40' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Summary Row */}
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center space-x-3">
                      <button className="text-slate-500 hover:text-white mt-0.5 sm:mt-0">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      {getLevelBadge(log.level)}

                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="text-xs font-bold text-white font-mono">{log.eventCode}</code>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400">
                            {log.subsystem}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs line-clamp-1">
                          {log.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {log.durationMs}ms
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLog(log);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                        title="Copy log entry"
                      >
                        {copiedId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3 bg-slate-950/90 rounded-b-2xl animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <span className="text-slate-500 block mb-0.5 font-bold">Client / Originator (Anonymized):</span>
                          <div className="flex items-center space-x-2 text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                            <Lock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{log.anonymizedClient}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-500 block mb-0.5 font-bold">Timestamp & Subsystem ID:</span>
                          <div className="text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                            {log.timestamp} • {log.subsystem}
                          </div>
                        </div>
                      </div>

                      {/* Sanitized JSON Payload */}
                      <div>
                        <span className="text-slate-500 text-[11px] block mb-1 font-bold">
                          Sanitized Hardware Enclave Payload (RFC 5424):
                        </span>
                        <pre className="p-3 bg-black rounded-xl border border-slate-800/80 text-cyan-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {log.sanitizedPayload}
                        </pre>
                      </div>

                      {/* Troubleshooting Guideline */}
                      {log.troubleshootingTip && (
                        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start space-x-2.5 text-[11px] text-cyan-200">
                          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-cyan-300 block">Troubleshooting Analysis:</span>
                            <span>{log.troubleshootingTip}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
