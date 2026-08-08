import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, Cpu, Mic, CheckCheck, Clock, Sparkles, RefreshCw, 
  Send, UserCheck, Smartphone, Zap, ShieldAlert, KeyRound, Terminal
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'peer' | 'self';
  name: string;
  role: string;
  time: string;
  text: string;
  hasAudio?: boolean;
  audioDuration?: string;
  securityMeta?: string;
  selfDestructIn?: number;
}

export const QuantumMessengerChatPreview: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'lattice'>('chat');
  const sectionRef = useRef<HTMLDivElement>(null);

  const messages: ChatMessage[] = [
    {
      id: 'm1',
      sender: 'peer',
      name: 'Field Operative Alpha',
      role: 'Defense Sector Lead',
      time: '10:42 AM',
      text: 'Initiating ML-KEM-1024 post-quantum key exchange from Knox StrongBox hardware enclave.',
      securityMeta: 'NIST FIPS 203 Verified • Shared Secret: 0x8F92...B31A'
    },
    {
      id: 'm2',
      sender: 'self',
      name: 'CISO Command HQ',
      role: 'Enterprise Security Director',
      time: '10:42 AM',
      text: 'Handshake accepted. Lattice tunnel established (< 1.2ms latency). Transmit field strategic briefing.',
      securityMeta: 'FIPS 204 Signature Validated • Air-Gapped Key'
    },
    {
      id: 'm3',
      sender: 'peer',
      name: 'Field Operative Alpha',
      role: 'Defense Sector Lead',
      time: '10:43 AM',
      text: 'Push-To-Talk Voice Burst Encrypted (NIST Kyber-1024):',
      hasAudio: true,
      audioDuration: '0:18',
      securityMeta: 'Encrypted Audio Payload • Zero Metadata Record'
    },
    {
      id: 'm4',
      sender: 'self',
      name: 'CISO Command HQ',
      role: 'Enterprise Security Director',
      time: '10:43 AM',
      text: 'Received & decrypted in Titan M2 memory. Ephemeral auto-zeroize timer engaged (30s remaining).',
      selfDestructIn: 28,
      securityMeta: 'Physical RAM Overwrite • Non-Recoverable'
    }
  ];

  // Scroll Triggered Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Stagger message bubble sliding animation when visible
  useEffect(() => {
    if (!isVisible) return;

    setVisibleMessages(0);
    const timers: NodeJS.Timeout[] = [];

    messages.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setVisibleMessages(idx + 1);
      }, (idx + 1) * 450);
      timers.push(timer);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [isVisible]);

  const handleReplay = () => {
    setVisibleMessages(0);
    setTimeout(() => {
      messages.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleMessages(idx + 1);
        }, (idx + 1) * 450);
      });
    }, 150);
  };

  return (
    <div ref={sectionRef} className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden my-12">
      {/* Background glow lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>INTERACTIVE QUANTUM MESSENGER INTERFACE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Post-Quantum Mobile Chat in Action
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
            Scroll down to watch messages slide into view with real-time post-quantum key handshakes, hardware vault isolation, and zero-trust auto-wipe.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleReplay}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Replay Scroll Animation</span>
          </button>
        </div>
      </div>

      {/* Main Interface Mockup Canvas */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Phone Screen Mockup */}
        <div className="lg:col-span-7 bg-slate-950 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          
          {/* Phone Top Notch Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-bold text-xs">CHANNEL: #DEFENSE-STRATEGY</span>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>NIST ML-KEM-1024</span>
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="space-y-4 min-h-[380px] flex flex-col justify-end p-2">
            {messages.map((msg, index) => {
              const isRendered = index < visibleMessages;
              const isSelf = msg.sender === 'self';

              return (
                <div
                  key={msg.id}
                  className={`transition-all duration-700 ease-out transform ${
                    isRendered
                      ? 'opacity-100 translate-x-0 translate-y-0 scale-100'
                      : isSelf
                      ? 'opacity-0 translate-x-12 translate-y-4 scale-95 pointer-events-none'
                      : 'opacity-0 -translate-x-12 translate-y-4 scale-95 pointer-events-none'
                  } flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 mb-1 px-1">
                    <span className="font-bold text-slate-200">{msg.name}</span>
                    <span>•</span>
                    <span className="text-slate-500">{msg.role}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  {/* Message Bubble Box */}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm font-sans space-y-2 shadow-xl border ${
                      isSelf
                        ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 text-slate-100 border-cyan-500/40 rounded-tr-none'
                        : 'bg-slate-900 text-slate-200 border-slate-800 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    {/* Audio Burst Visualizer if present */}
                    {msg.hasAudio && (
                      <div className="p-2 rounded-xl bg-slate-950/90 border border-cyan-500/30 flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-0.5 h-3">
                            {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70, 85, 40].map((h, i) => (
                              <span
                                key={i}
                                className="w-1 bg-cyan-400/80 rounded-full animate-pulse"
                                style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400">
                            <span>PQ Audio Stream</span>
                            <span className="text-cyan-300 font-bold">{msg.audioDuration}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ephemeral Timer if present */}
                    {msg.selfDestructIn && (
                      <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold">
                        <Clock className="w-3 h-3 text-rose-400 animate-spin" />
                        <span>Self-Zeroize in {msg.selfDestructIn}s</span>
                      </div>
                    )}

                    {/* Security Metadata Footer Tag */}
                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span className="flex items-center space-x-1 text-cyan-400">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        <span>{msg.securityMeta}</span>
                      </span>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2 font-mono text-xs">
            <div className="flex-1 bg-slate-900 rounded-xl px-3 py-2 text-slate-500 border border-slate-800 flex items-center justify-between">
              <span>Type post-quantum message...</span>
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <button className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Side: Real-time Cryptographic Verification Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>Quantum Tunnel Telemetry</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-[11px] text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">Algorithm Spec:</span>
                <span className="text-white font-bold block">NIST FIPS 203 (ML-KEM-1024)</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Module-Lattice-Based Key Encapsulation Mechanism with Category 5 post-quantum security margin.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">Hardware Vault Enclave:</span>
                <span className="text-emerald-300 font-bold block">Google Titan M2 / Samsung Knox Vault</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  Cryptographic keys generated and stored exclusively within dedicated physical silicon.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">Metadata & Transport:</span>
                <span className="text-purple-300 font-bold block">Zero Server Logged Relays</span>
                <p className="text-[10px] text-slate-400 font-sans">
                  IP address, phone contact books, and timestamps are stripped before P2P mesh relay.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800">
              <span>Scroll Progress Triggered</span>
              <span className="text-cyan-400 font-bold">{visibleMessages} / {messages.length} Bubbles Rendered</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
