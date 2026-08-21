import React, { useState, useEffect } from 'react';
import { 
  Network, Shield, ShieldCheck, Lock, Unlock, Zap, Shuffle, 
  Activity, ArrowRight, RefreshCw, Send, Radio, Server, Eye, EyeOff,
  Clock, AlertTriangle, Layers, Database, Cpu, CheckCircle2, CornerDownRight,
  Terminal, Copy, Download
} from 'lucide-react';
import { useToast } from './Toast';

interface MixnetHop {
  id: string;
  name: string;
  location: string;
  role: 'ENTRY' | 'MIXNET_1' | 'MIXNET_DELAY' | 'EXIT' | 'DESTINATION';
  ipMask: string;
  latencyMs: number;
  circuitId: string;
  layerPeeled: string;
  status: 'ACTIVE' | 'PROCESSING' | 'ROUTED';
}

export const AnonymizedRouting: React.FC = () => {
  const { showToast } = useToast();
  
  // Mixnet Circuit Configuration
  const [hops, setHops] = useState<MixnetHop[]>([
    {
      id: 'hop-0',
      name: 'Client Enclave (Source)',
      location: 'Zurich, Switzerland',
      role: 'ENTRY',
      ipMask: '192.0.2.44 [Obfuscated]',
      latencyMs: 1.2,
      circuitId: 'Q-CIRC-8891-ZH',
      layerPeeled: 'Outer 4-Layer Quantum Sphinx Envelope Encapsulated',
      status: 'ACTIVE'
    },
    {
      id: 'hop-1',
      name: 'Entry Guard Relay #09',
      location: 'Frankfurt, Germany',
      role: 'ENTRY',
      ipMask: '198.51.100.12',
      latencyMs: 14.8,
      circuitId: 'Q-EPHEM-9021',
      layerPeeled: 'Layer 1 Peeled: Entry Verification Token Verified',
      status: 'ACTIVE'
    },
    {
      id: 'hop-2',
      name: 'Quantum Mixnet Relay #44',
      location: 'Reykjavik, Iceland',
      role: 'MIXNET_1',
      ipMask: '203.0.113.89',
      latencyMs: 38.4,
      circuitId: 'Q-EPHEM-4192',
      layerPeeled: 'Layer 2 Peeled: ChaCha20-Poly1305 Forwarding Header',
      status: 'ACTIVE'
    },
    {
      id: 'hop-3',
      name: 'Poisson Delay & Decoy Mixer',
      location: 'Tokyo, Japan',
      role: 'MIXNET_DELAY',
      ipMask: '198.18.0.72',
      latencyMs: 86.1,
      circuitId: 'Q-EPHEM-7714',
      layerPeeled: 'Layer 3 Peeled: Loopix Poisson Jitter Added (Timing Blinding)',
      status: 'ACTIVE'
    },
    {
      id: 'hop-4',
      name: 'Exit Guard Gateway #03',
      location: 'Singapore',
      role: 'EXIT',
      ipMask: '192.88.99.201',
      latencyMs: 142.5,
      circuitId: 'Q-EPHEM-3309',
      layerPeeled: 'Layer 4 Peeled: Final ML-KEM-1024 Recipient Envelope Delivered',
      status: 'ACTIVE'
    },
    {
      id: 'hop-5',
      name: 'Recipient Enclave (Destination)',
      location: 'Singapore Datacenter',
      role: 'DESTINATION',
      ipMask: '198.51.100.250 [Isolated]',
      latencyMs: 148.2,
      circuitId: 'Q-FINAL-ENCLAVE',
      layerPeeled: 'Payload Decapsulated via Hardware ML-KEM-1024 Secret Key',
      status: 'ACTIVE'
    }
  ]);

  // Simulation State
  const [activeHopIndex, setActiveHopIndex] = useState<number>(-1);
  const [isRoutingActive, setIsRoutingActive] = useState<boolean>(false);
  const [selectedPayloadType, setSelectedPayloadType] = useState<'TEXT' | 'PQC_KEY' | 'VOICE_FRAME'>('TEXT');
  const [jitterMs, setJitterMs] = useState<number>(35);
  const [isCoverTrafficEnabled, setIsCoverTrafficEnabled] = useState<boolean>(true);
  const [ephemeralRotationSec, setEphemeralRotationSec] = useState<number>(15);
  const [timeToNextRotation, setTimeToNextRotation] = useState<number>(12);
  const [packetsRoutedCount, setPacketsRoutedCount] = useState<number>(14892);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'onion-peeler' | 'threat-mitigation'>('visualizer');

  // Rotate Ephemeral Circuit IDs every N seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeToNextRotation((prev) => {
        if (prev <= 1) {
          // Regenerate circuit IDs
          setHops((prevHops) => 
            prevHops.map((h, i) => i === 0 || i === 5 ? h : ({
              ...h,
              circuitId: `Q-EPHEM-${Math.floor(1000 + Math.random() * 9000)}`
            }))
          );
          return ephemeralRotationSec;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ephemeralRotationSec]);

  // Handle Manual Dispatch of Anonymized Packet
  const handleDispatchPacket = () => {
    if (isRoutingActive) return;
    setIsRoutingActive(true);
    setActiveHopIndex(0);

    const stepInterval = 650;
    
    // Step through each hop in sequence
    hops.forEach((_, index) => {
      setTimeout(() => {
        setActiveHopIndex(index);
        if (index === hops.length - 1) {
          setTimeout(() => {
            setIsRoutingActive(false);
            setPacketsRoutedCount((c) => c + 1);
            showToast(
              'Anonymized Packet Delivered',
              `Routed via 4 non-persistent quantum hops in ${(hops[hops.length - 1].latencyMs + jitterMs).toFixed(1)}ms with zero metadata leakage.`,
              'success'
            );
          }, stepInterval);
        }
      }, index * stepInterval);
    });
  };

  return (
    <section id="anonymized-routing" className="py-16 md:py-24 bg-[#080D1A] text-slate-100 border-b border-slate-900 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
              <Network className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>POST-QUANTUM SPHINX ONION ROUTING & MIXNET</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
              Anonymized Multi-Hop Quantum Tunnels
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-mono leading-relaxed">
              Eliminating traffic pattern analysis, ISP timing correlation, and metadata harvesting through non-persistent ephemeral quantum circuits and Poisson delay mixing.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <RefreshCw className={`w-4 h-4 ${timeToNextRotation <= 3 ? 'animate-spin text-cyan-300' : ''}`} />
              </div>
              <div className="font-mono text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Ephemeral Circuit TTL</span>
                <span className="text-cyan-300 font-bold">{timeToNextRotation}s to re-key</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div className="font-mono text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Packets Routed</span>
                <span className="text-emerald-400 font-bold">{packetsRoutedCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs & Dispatch Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'visualizer', label: 'Multi-Hop Mesh Visualizer', icon: Network },
              { id: 'onion-peeler', label: 'Quantum Sphinx Onion Peeler', icon: Layers },
              { id: 'threat-mitigation', label: 'Traffic Analysis Defense Matrix', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-950'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDispatchPacket}
              disabled={isRoutingActive}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-black flex items-center space-x-2 cursor-pointer shadow-lg shadow-cyan-950/80 disabled:opacity-50 transition-all"
            >
              <Send className={`w-4 h-4 ${isRoutingActive ? 'animate-bounce' : ''}`} />
              <span>{isRoutingActive ? 'Routing Packet Across Mixnet...' : 'Dispatch Anonymized Packet'}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Multi-Hop Mesh Visualizer */}
        {activeTab === 'visualizer' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Interactive Control Configuration Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-3xl font-mono text-xs">
              
              {/* Payload Selection */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold block text-[11px] uppercase">
                  Select Packet Payload Type:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'TEXT', label: 'Chat Msg' },
                    { id: 'PQC_KEY', label: 'ML-KEM Key' },
                    { id: 'VOICE_FRAME', label: 'Voice Frame' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPayloadType(p.id as any)}
                      className={`py-2 px-1 rounded-lg text-center font-bold text-[10px] border transition-all cursor-pointer ${
                        selectedPayloadType === p.id
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Poisson Delay Jitter Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase">Loopix Poisson Delay Jitter:</span>
                  <span className="text-cyan-300 font-bold">+{jitterMs} ms</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={jitterMs}
                  onChange={(e) => setJitterMs(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>5ms (Real-time)</span>
                  <span>Defeats Timing Attacks</span>
                  <span>120ms (Max Anonymity)</span>
                </div>
              </div>

              {/* Cover Traffic Generator Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-white font-bold block text-xs">Constant Decoy Cover Traffic</span>
                  <span className="text-slate-500 text-[10px] block">Masks bursty transmission profiles</span>
                </div>
                <button
                  onClick={() => {
                    setIsCoverTrafficEnabled(!isCoverTrafficEnabled);
                    showToast(
                      isCoverTrafficEnabled ? 'Decoy Traffic Suspended' : 'Decoy Cover Traffic Active',
                      isCoverTrafficEnabled ? 'Mixnet running in plain bandwidth mode.' : 'Constant 64kbps dummy packet streams injected.',
                      'info'
                    );
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    isCoverTrafficEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isCoverTrafficEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>

            {/* Active Quantum Hop Pipeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs px-2">
                <span className="text-slate-400 font-bold">Active Mixnet Pipeline (Ephemeral Quantum Circuit)</span>
                <span className="text-cyan-400">Total Route Latency: <strong>{(hops[5].latencyMs + jitterMs).toFixed(1)}ms</strong></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                {hops.map((hop, index) => {
                  const isCurrent = activeHopIndex === index;
                  const isPast = activeHopIndex > index;
                  
                  return (
                    <div
                      key={hop.id}
                      className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 font-mono ${
                        isCurrent
                          ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/50 shadow-xl shadow-cyan-950 transform -translate-y-1'
                          : isPast
                          ? 'bg-slate-900/90 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-950/70 border-slate-800 opacity-80'
                      }`}
                    >
                      {/* Hop Badge & Status */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          index === 0
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            : index === 5
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-900 text-cyan-300 border border-slate-800'
                        }`}>
                          Hop #{index}
                        </span>

                        <span className={`w-2.5 h-2.5 rounded-full ${
                          isCurrent
                            ? 'bg-cyan-400 animate-ping'
                            : isPast
                            ? 'bg-emerald-400'
                            : 'bg-slate-700'
                        }`} />
                      </div>

                      {/* Hop Name & Location */}
                      <div>
                        <h4 className="font-bold text-xs text-white font-sans truncate">{hop.name}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">{hop.location}</span>
                      </div>

                      {/* Technical Circuit IDs */}
                      <div className="space-y-1 text-[10px] pt-2 border-t border-slate-800/80">
                        <div className="text-slate-500">Circuit ID:</div>
                        <div className="text-cyan-300 font-bold truncate">{hop.circuitId}</div>
                        <div className="text-slate-400 text-[9px] truncate">Latency: +{hop.latencyMs}ms</div>
                      </div>

                      {/* IP Obfuscation */}
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80 text-[9px] text-slate-400 truncate">
                        IP: <span className="text-slate-300">{hop.ipMask}</span>
                      </div>

                      {/* Connecting Arrow for Desktop */}
                      {index < 5 && (
                        <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none text-slate-600">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Packet Processing Log Terminal */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>Real-Time Mixnet Tunnel Diagnostics</span>
                </div>
                <span className="text-[10px] text-slate-500">Protocol: Sphinx-PQC v4.2 / Loopix Mixnet</span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>[0.0ms] Packet encapsulated with 4 ephemeral ML-KEM-1024 shared secrets (NIST FIPS 203).</span>
                </div>
                <div className="flex items-center space-x-2 text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>[14.8ms] Frankfurt Entry Guard stripped Hop 1 MAC tag; next destination header revealed as Reykjavik (Node 44).</span>
                </div>
                <div className="flex items-center space-x-2 text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>[38.4ms] Reykjavik Relay peeled Layer 2; forwarded under non-persistent tunnel Q-EPHEM-4192.</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>[86.1ms] Tokyo Poisson buffer held packet for {jitterMs}ms to destroy timing autocorrelation with sender transmission spike.</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>[142.5ms] Singapore Exit Gateway delivered final blinded payload to Destination Enclave. No node knows both source and destination IP.</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Quantum Sphinx Onion Peeler */}
        {activeTab === 'onion-peeler' && (
          <div className="space-y-6 animate-fadeIn font-mono text-xs">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-sans">
                  Quantum Sphinx Onion Layer Decapsulation Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Each mixnet hop only possesses the private key necessary to peel its own layer, revealing only the next immediate hop IP without ever learning the source, destination, or total path length.
                </p>
              </div>

              {/* 4-Layer Onion Visual Stack */}
              <div className="space-y-3">
                {[
                  {
                    layer: 4,
                    name: 'Outer Layer 4: Entry Guard Envelope',
                    crypto: 'ML-KEM-1024 Ephemeral Key + ChaCha20-Poly1305',
                    payload: 'Contains: Next Hop IP (Reykjavik) + Encrypted Payload for Hop 2 + MacTag_1',
                    peeledAt: 'Frankfurt Entry Node',
                    color: 'border-cyan-500/80 bg-cyan-950/30'
                  },
                  {
                    layer: 3,
                    name: 'Layer 3: Intermediate Quantum Mixnet Envelope',
                    crypto: 'ML-KEM-1024 Ephemeral Key + ChaCha20-Poly1305',
                    payload: 'Contains: Next Hop IP (Tokyo Mixer) + Encrypted Payload for Hop 3 + MacTag_2',
                    peeledAt: 'Reykjavik Mix Relay',
                    color: 'border-blue-500/80 bg-blue-950/30'
                  },
                  {
                    layer: 2,
                    name: 'Layer 2: Poisson Delay & Decoy Mixing Header',
                    crypto: 'Loopix Poisson Token + ChaCha20-Poly1305',
                    payload: 'Contains: Next Hop IP (Singapore Exit) + Delay Timer Token + MacTag_3',
                    peeledAt: 'Tokyo Delay Node',
                    color: 'border-indigo-500/80 bg-indigo-950/30'
                  },
                  {
                    layer: 1,
                    name: 'Inner Core Layer 1: Recipient Post-Quantum Payload',
                    crypto: 'Recipient Public Key ML-KEM-1024 + AES-256-GCM',
                    payload: 'Contains: Pure End-to-End Encrypted Message / Cryptographic Master Token',
                    peeledAt: 'Recipient Hardware Enclave Only',
                    color: 'border-emerald-500/80 bg-emerald-950/30'
                  }
                ].map((item) => (
                  <div key={item.layer} className={`p-4 rounded-2xl border ${item.color} space-y-2`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-bold text-sm text-white font-sans">{item.name}</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-slate-950 text-cyan-300 text-[10px] font-bold border border-slate-800">
                        Peeled at: {item.peeledAt}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Cryptographic Primitive:</span>
                        <span className="text-slate-300 font-bold">{item.crypto}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Encapsulated Content:</span>
                        <span className="text-slate-400">{item.payload}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Traffic Analysis Defense Matrix */}
        {activeTab === 'threat-mitigation' && (
          <div className="space-y-6 animate-fadeIn font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  threat: 'Global Passive Adversary (NSA/GCHQ Fiber Tap)',
                  legacyRisk: 'Monitors ingress and egress packet timestamps to correlate sender with recipient in milliseconds.',
                  qcryptDefense: 'Loopix Poisson delay mixing & continuous dummy decoy packet injection breaks all temporal statistical correlation.'
                },
                {
                  threat: 'Compromised Relay Node (Sybil Attack)',
                  legacyRisk: 'A rogue relay in single-proxy systems logs source and destination IPs simultaneously.',
                  qcryptDefense: 'Sphinx onion encapsulation guarantees that no single node knows both the origin and final destination.'
                },
                {
                  threat: 'Quantum Packet Capture (Harvest Now, Decrypt Later)',
                  legacyRisk: 'Classical Diffie-Hellman / Curve25519 onion headers can be decrypted retroactively by quantum computers.',
                  qcryptDefense: 'Every single hop generates ephemeral NIST FIPS 203 (ML-KEM-1024) keys, guaranteeing forward secrecy against CRQCs.'
                },
                {
                  threat: 'Packet Size Fingerprinting',
                  legacyRisk: 'Adversaries infer message types (voice, image, text) by observing exact packet byte sizes.',
                  qcryptDefense: 'All Sphinx packets are strictly padded to a fixed uniform size (2,048 bytes), eliminating size-based entropy.'
                },
                {
                  threat: 'ISP Connection Metadata Logging',
                  legacyRisk: 'Telecom providers log who you connect to and when, maintaining permanent connection logs.',
                  qcryptDefense: 'The ISP only sees connection to a generic entry guard relay. Ephemeral circuit IDs rotate every 15 seconds.'
                },
                {
                  threat: 'Replay & Message Alteration',
                  legacyRisk: 'Adversaries replay or alter transit packets to elicit diagnostic error responses.',
                  qcryptDefense: 'Cryptographic MAC tags at each layer are validated before forwarding. Any corrupted bit triggers silent drop.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-red-400 font-bold block text-xs flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{item.threat}</span>
                    </span>
                    <div className="mt-2 p-2.5 rounded-xl bg-red-950/30 border border-red-900/50 text-[11px] text-red-200 leading-relaxed">
                      <strong>Legacy Vulnerability:</strong> {item.legacyRisk}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 leading-relaxed">
                    <strong>Q-CRYPT Solution:</strong> {item.qcryptDefense}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
