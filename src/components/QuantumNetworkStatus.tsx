import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Wifi, 
  WifiOff, 
  Radio, 
  Server, 
  RefreshCw, 
  Globe, 
  Lock, 
  CheckCircle2, 
  ChevronDown, 
  Zap, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Clock,
  X
} from 'lucide-react';

export interface QuantumNode {
  id: string;
  name: string;
  location: string;
  countryCode: string;
  ipMasked: string;
  latencyMs: number;
  cipher: string;
  status: 'ONLINE' | 'SYNCHRONIZED' | 'RE_KEYING';
  zkProofVerified: boolean;
  hopRole: 'GUARD_HOP' | 'MIXNET_RELAY' | 'EXIT_HOP' | 'SOVEREIGN_CORE';
  uptime: string;
}

const INITIAL_NODES: QuantumNode[] = [
  {
    id: 'FRA-PQC-01',
    name: 'Frankfurt Sovereign Enclave',
    location: 'Frankfurt, Germany',
    countryCode: 'DE',
    ipMasked: '185.220.***.14',
    latencyMs: 14,
    cipher: 'ML-KEM-1024 / AES-256-GCM',
    status: 'ONLINE',
    zkProofVerified: true,
    hopRole: 'GUARD_HOP',
    uptime: '99.998%'
  },
  {
    id: 'ZRH-CORE-02',
    name: 'Zurich Post-Quantum Vault',
    location: 'Zurich, Switzerland',
    countryCode: 'CH',
    ipMasked: '194.126.***.88',
    latencyMs: 18,
    cipher: 'ML-KEM-1024 / ML-DSA-87',
    status: 'ONLINE',
    zkProofVerified: true,
    hopRole: 'SOVEREIGN_CORE',
    uptime: '100.000%'
  },
  {
    id: 'PAR-ANSSI-04',
    name: 'Paris SecNumCloud Core',
    location: 'Paris, France',
    countryCode: 'FR',
    ipMasked: '51.159.***.210',
    latencyMs: 22,
    cipher: 'ML-KEM-1024 / AES-256-GCM',
    status: 'ONLINE',
    zkProofVerified: true,
    hopRole: 'MIXNET_RELAY',
    uptime: '99.994%'
  },
  {
    id: 'STO-NORTH-03',
    name: 'Stockholm Nordic Relay',
    location: 'Stockholm, Sweden',
    countryCode: 'SE',
    ipMasked: '193.180.***.55',
    latencyMs: 27,
    cipher: 'ML-KEM-1024 / ChaCha20-Poly1305',
    status: 'ONLINE',
    zkProofVerified: true,
    hopRole: 'MIXNET_RELAY',
    uptime: '99.991%'
  },
  {
    id: 'RVK-ZERO-01',
    name: 'Reykjavik Arctic Isolation Node',
    location: 'Reykjavik, Iceland',
    countryCode: 'IS',
    ipMasked: '185.112.***.09',
    latencyMs: 34,
    cipher: 'ML-KEM-1024 / NIST FIPS 203',
    status: 'ONLINE',
    zkProofVerified: true,
    hopRole: 'EXIT_HOP',
    uptime: '99.999%'
  },
  {
    id: 'TYO-LATTICE-01',
    name: 'Tokyo Quantum Edge Relay',
    location: 'Tokyo, Japan',
    countryCode: 'JP',
    ipMasked: '103.20.***.44',
    latencyMs: 112,
    cipher: 'ML-KEM-1024 / AES-256-GCM',
    status: 'ONLINE',
    zkProofVerified: true,
    hopRole: 'EXIT_HOP',
    uptime: '99.989%'
  }
];

export const QuantumNetworkStatus: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nodes, setNodes] = useState<QuantumNode[]>(INITIAL_NODES);
  const [isTunnelActive, setIsTunnelActive] = useState<boolean>(true);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [isRekeying, setIsRekeying] = useState<boolean>(false);
  const [rekeySuccessTime, setRekeySuccessTime] = useState<string | null>(null);
  const [totalPacketsShielded, setTotalPacketsShielded] = useState<number>(4829120);
  const [avgLatency, setAvgLatency] = useState<number>(18.4);

  // Periodic heartbeat jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalPacketsShielded(prev => prev + Math.floor(Math.random() * 45) + 12);
      setAvgLatency(prev => +(17.8 + Math.random() * 1.6).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Ping all mesh nodes
  const handlePingMesh = () => {
    setIsPinging(true);
    setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        latencyMs: Math.max(8, Math.round(node.latencyMs + (Math.random() * 6 - 3)))
      })));
      setIsPinging(false);
    }, 600);
  };

  // Trigger quantum tunnel re-keying
  const handleRekeyTunnel = () => {
    setIsRekeying(true);
    setNodes(prev => prev.map(node => ({ ...node, status: 'RE_KEYING' })));

    setTimeout(() => {
      setNodes(prev => prev.map(node => ({ ...node, status: 'SYNCHRONIZED' })));
      setIsRekeying(false);
      setRekeySuccessTime(new Date().toLocaleTimeString());
    }, 850);
  };

  return (
    <div className="relative inline-block text-left font-mono">
      {/* Navbar Status Pill Trigger */}
      <button
        id="network-status-nav-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 text-xs text-white transition-all cursor-pointer shadow-sm hover:border-emerald-400 group"
        title="Decentralized Quantum-Resistant Network & Encrypted Tunnel Status"
      >
        {/* Animated Beacon Indicator */}
        <span className="flex h-2 w-2 relative shrink-0">
          {isTunnelActive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            isTunnelActive ? 'bg-emerald-400' : 'bg-red-500'
          }`} />
        </span>

        <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">TUNNEL:</span>
          <span>ACTIVE</span>
        </span>

        <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-1.5 hidden md:inline">
          {nodes.length} Nodes ({avgLatency}ms)
        </span>

        <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-emerald-300 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Popover Flyout Menu */}
      {isOpen && (
        <>
          {/* Backdrop click dismiss */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />

          <div className="absolute right-0 mt-2 w-80 sm:w-96 md:w-[440px] rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl shadow-black/80 z-50 p-5 space-y-4 backdrop-blur-xl animate-fadeIn text-slate-100">
            
            {/* Popover Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>DECENTRALIZED QUANTUM MESH TUNNEL</span>
                </div>
                <h4 className="text-sm font-bold text-white font-sans">
                  Quantum-Resistant Node Connectivity
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  Continuous zero-knowledge tunnel verified via NIST FIPS 203 (ML-KEM-1024)
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tunnel Health Snapshot Cards */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Encrypted Tunnel</span>
                <span className="text-emerald-400 font-bold text-xs flex items-center justify-center space-x-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>ACTIVE (PQC)</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Average Ping</span>
                <span className="text-cyan-300 font-bold text-xs">
                  {avgLatency} ms
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Active Mesh</span>
                <span className="text-white font-bold text-xs">
                  {nodes.length} Nodes Online
                </span>
              </div>
            </div>

            {/* Active Nodes List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Connected Decentralized Nodes ({nodes.length})</span>
                <span className="text-emerald-400">Zero Metadata Leakage</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="font-bold text-white text-[11px] font-sans">
                          {node.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {node.countryCode}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-2 pl-4">
                        <span>{node.ipMasked}</span>
                        <span>•</span>
                        <span className="text-cyan-400">{node.cipher.split('/')[0]}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-emerald-400 text-xs font-bold">
                        {node.latencyMs} ms
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {node.hopRole.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sphinx 3-Hop Mixnet Path Visualizer */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/50 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sphinx Onion Routing Route</span>
                </span>
                <span className="text-emerald-400 text-[10px]">3-Hop Shielding</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-white font-bold">Client</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">FRA-01 (Guard)</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">PAR-04 (Relay)</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">RVK-01 (Exit)</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={handlePingMesh}
                disabled={isPinging}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Pinging...' : 'Ping Nodes'}</span>
              </button>

              <button
                onClick={handleRekeyTunnel}
                disabled={isRekeying}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-950 disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isRekeying ? 'animate-bounce' : ''}`} />
                <span>{isRekeying ? 'Re-Keying ML-KEM...' : 'Re-Key Quantum Tunnel'}</span>
              </button>
            </div>

            {rekeySuccessTime && (
              <div className="text-[10px] text-center text-emerald-400 font-mono bg-emerald-950/40 py-1 rounded-lg border border-emerald-800/40">
                ✓ Ephemeral session keys re-encapsulated at {rekeySuccessTime} (Zero Exposure)
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};
