import React from 'react';
import { 
  Shield, Lock, Radio, Cpu, Smartphone, Sparkles, KeyRound, 
  HardDrive, CheckCircle2, Server, ArrowRight, Zap, Download, Building2, XCircle,
  Volume2, Globe, Users, MapPin, Truck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AppFeatureShowcase: React.FC = () => {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const comparisonMatrix = [
    {
      feature: 'Post-Quantum Encryption (ML-KEM-1024)',
      free: true,
      enterprise: true,
      desc: 'NIST FIPS 203 approved post-quantum lattice cryptography for every message.',
    },
    {
      feature: 'Hardware Enclave Key Isolation',
      free: true,
      enterprise: true,
      desc: 'Keys stay physically locked inside phone chipsets (Titan M2 / Knox / TEE).',
    },
    {
      feature: 'Zero-Knowledge Contact Matching',
      free: true,
      enterprise: true,
      desc: 'Look up peers via Private Information Retrieval without revealing address books.',
    },
    {
      feature: 'Direct P2P & Mesh Communications',
      free: true,
      enterprise: true,
      desc: 'Direct device-to-device transport without central server interception.',
    },
    {
      feature: 'Steganographic Camouflage & Stealth PIN',
      free: true,
      enterprise: true,
      desc: 'Disguise mobile icon as a standard utility widget with decoy vault unlock.',
    },
    {
      feature: 'Server-Side MDM Controller Integration',
      free: false,
      enterprise: true,
      desc: 'Central management via Microsoft Intune, Samsung Knox, or Workspace ONE.',
    },
    {
      feature: 'Fleet-Wide Remote Zeroize & Policy Enforcement',
      free: false,
      enterprise: true,
      desc: 'Instantly wipe compromised fleet devices remotely from central admin panel.',
    },
    {
      feature: 'Automated KMS Key Rotation Schedules',
      free: false,
      enterprise: true,
      desc: 'Automated policy-driven encryption key rotation across organization seats.',
    },
    {
      feature: 'Private Sovereign Cloud / On-Prem Deployment',
      free: false,
      enterprise: true,
      desc: 'Host relays and KMS completely within your organization’s private infrastructure.',
    },
    {
      feature: '24/7 Dedicated SLA & Engineering Support',
      free: false,
      enterprise: true,
      desc: 'Dedicated technical team, custom onboarding, and enterprise compliance support.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Push-to-Talk over Cellular (PoC) Technology Architecture Spotlight */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Badge & Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Next-Gen Enterprise Communications</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Push-to-Talk over Cellular (PoC) Architecture
              </h3>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center space-x-2 shrink-0">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Secured by NIST FIPS 203 (ML-KEM-1024)</span>
            </div>
          </div>

          {/* Core Definition Quote Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 relative space-y-4">
            <div className="flex items-start space-x-3">
              <Volume2 className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                  Core Industry Definition: What is PoC?
                </span>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  <strong className="text-white">PoC (Push-to-Talk over Cellular)</strong> is an intelligent trunked communication service based on <span className="text-cyan-300 font-semibold">4G/5G cellular networks</span>. It overcomes the distance limitations of traditional two-way radios, enabling <span className="text-emerald-300 font-semibold">"one-touch" instant communication nationwide and globally</span>. It transmits voice, data, and location information via IP networks, supports multiple terminal access (phones, professional terminals, vehicle devices, etc.), and includes features like group calls, multimedia dispatch, and track playback. It is a next-generation, high-efficiency collaborative communication solution for enterprises.
                </p>
              </div>
            </div>

            {/* Post-Quantum Security Upgrade Callout */}
            <div className="pt-3 border-t border-slate-800/80 flex items-start space-x-3 text-xs sm:text-sm text-emerald-300 bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-800/50">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-white font-bold block mb-0.5">Post-Quantum Security (PQ-PoC) Implementation:</strong>
                To protect mission-critical dispatch and field communications against <em className="text-emerald-200 not-italic font-semibold">"Harvest Now, Decrypt Later"</em> quantum threats, Q-CRYPT upgrades standard PoC cellular traffic with <strong className="text-white font-mono">NIST FIPS 203 (ML-KEM-1024)</strong> lattice-based key encapsulation and <strong className="text-white font-mono">FIPS 204 (ML-DSA-87)</strong> post-quantum signatures. Every push-to-talk audio burst, group dispatch message, and GPS track playback packet is hardware-isolated inside device Secure Enclaves (StrongBox/TEE), ensuring long-term quantum immunity across public and private 4G/5G networks.
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Global 4G/5G Coverage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eliminates traditional RF repeater distance limits. Operates seamlessly over standard cellular 4G/5G carriers, Wi-Fi, and satellite backhaul.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Multi-Terminal Flexibility</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supports standard Android smartphones, ruggedized enterprise PTT handhelds, vehicle-mounted consoles, and desktop dispatch workstations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Multimedia & Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enables instant one-touch voice group calls, live video feeds, broadcast alerts, GPS track playback, and dynamic channel assignment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-800">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Q-CRYPT Quantum Armor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every PoC voice burst and telemetry packet is wrapped in NIST FIPS 203 ML-KEM-1024 post-quantum lattice encryption with hardware enclave keys.
              </p>
            </div>

          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Community vs. Enterprise Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Deployment Model
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From 100% serverless peer-to-peer personal privacy to centralized enterprise fleet control, Q-CRYPT delivers post-quantum security tailored to your operational needs.
          </p>
        </div>

        {/* Side-by-Side Edition Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Free / Community Edition */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl border-l border-b border-emerald-500/30">
              100% FREE & OPEN ACCESS
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-sans pt-2">
                  Free / Community Edition
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Designed for individuals, privacy advocates, and sovereign teams who need uncompromised, serverless peer-to-peer security.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono">
                <span className="font-bold">Cost:</span> $0 Forever • No Registration • 100% Peer-to-Peer
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Included Capabilities:</h4>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>NIST ML-KEM-1024 Post-Quantum Encryption</strong> for all messages & keys.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Direct Peer-to-Peer Routing</strong> with zero central server relays.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Hardware Vault Key Isolation</strong> in phone Titan M2 / Knox chip.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zero-Knowledge Contact PIR</strong> directory lookup without metadata exposure.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Stealth Launcher Disguise & Duress PIN</strong> for emergency data zeroization.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Configurable De-Googled OS Support</strong> running independently on sovereign Android & GrapheneOS.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-800/80">
              <button
                onClick={() => scrollToSection('apk-portal')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50"
              >
                <Download className="w-4 h-4" />
                <span>Download Free P2P App (v2.4.0)</span>
              </button>
            </div>
          </div>

          {/* Card 2: Enterprise / Organization Edition */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl border-l border-b border-amber-500/30">
              ENTERPRISE & FLEET MANAGED
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-sans pt-2">
                  Enterprise / Organization Edition
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Built for businesses, government agencies, and organizations requiring fleet policy management, remote wipe, and compliance auditing.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-mono">
                <span className="font-bold">Deployment:</span> Managed MDM Fleet • Private Relay Tenant • SLA Support
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Everything in Free P2P, Plus:</h4>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Centralized MDM Integration</strong> (Microsoft Intune, Knox, Workspace ONE).</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Remote Fleet Wipe & Zeroization</strong> for lost or compromised mobile devices.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Automated KMS Key Rotation Schedules</strong> with centralized policy enforcement.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Private Sovereign Cloud Deployment</strong> hosted entirely on your private infrastructure.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Central Admin Portal & Audit Logs</strong> for organization compliance officers.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>24/7 Priority SLA & Dedicated Engineering</strong> onboarding assistance.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-800/80">
              <button
                onClick={() => scrollToSection('enterprise-portal')}
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950/50"
              >
                <Server className="w-4 h-4" />
                <span>Request Enterprise Trial & SLA</span>
              </button>
            </div>
          </div>

        </div>

        {/* Detailed Feature Comparison Table */}
        <div className="pt-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">
              Feature-by-Feature Matrix
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Detailed technical specification comparison
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-mono text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Capabilities & Security Specs</th>
                  <th className="py-3.5 px-4 font-bold text-center text-emerald-400 w-44">Free Community (P2P)</th>
                  <th className="py-3.5 px-4 font-bold text-center text-amber-400 min-w-[220px]">Enterprise / Organization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {comparisonMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-xs">{item.feature}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.free ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Included</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-950 text-slate-500 border border-slate-800 text-[10px] font-mono">
                          <XCircle className="w-3 h-3 text-slate-600" />
                          <span>N/A</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.enterprise ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 text-amber-400" />
                          <span>Managed/On-Premise/AirGapped</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-950 text-slate-500 border border-slate-800 text-[10px] font-mono">
                          <XCircle className="w-3 h-3 text-slate-600" />
                          <span>N/A</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};

