import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Building2, ShieldAlert, AlertTriangle, Zap, Cpu, Activity, 
  Info, Sparkles, ShieldCheck, Clock, Layers, ArrowUpRight
} from 'lucide-react';

export interface ThreatVector {
  id: string;
  name: string;
  percentage: number;
  color: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  impactDesc: string;
  mitigation: string;
  sndlHorizonYears: string;
}

export interface OrgRiskProfile {
  id: string;
  label: string;
  iconName: string;
  description: string;
  threatVectors: ThreatVector[];
}

export const ORG_RISK_PROFILES: OrgRiskProfile[] = [
  {
    id: 'defense',
    label: 'Defense & Government',
    iconName: 'ShieldAlert',
    description: 'High-target sovereign communications, diplomatic cables, and classified military telemetry facing immediate foreign SNDL archiving.',
    threatVectors: [
      {
        id: 'def_1',
        name: 'SNDL Interception of Tactical Telecom',
        percentage: 35,
        color: '#f43f5e', // rose-500
        severity: 'CRITICAL',
        impactDesc: 'Hostile state actors harvest encrypted satellite & field radio data to decrypt when CRQCs arrive.',
        mitigation: 'Deploy NIST FIPS 203 ML-KEM-1024 with hardware enclave seed generation.',
        sndlHorizonYears: '15+ Years Retention'
      },
      {
        id: 'def_2',
        name: 'Foreign Sovereign Brute-Force Attacks',
        percentage: 30,
        color: '#f97316', // orange-500
        severity: 'CRITICAL',
        impactDesc: 'Quantum algorithms (Shor & Grover) breaking RSA-4096 & ECC certificates across defense networks.',
        mitigation: 'Transition PKI infrastructure to ML-DSA-87 digital signatures (FIPS 204).',
        sndlHorizonYears: 'Immediate Target'
      },
      {
        id: 'def_3',
        name: 'Firmware & Supply Chain Tampering',
        percentage: 20,
        color: '#eab308', // yellow-500
        severity: 'HIGH',
        impactDesc: 'Infiltrated root-of-trust chips lacking constant-time lattice polynomial verification.',
        mitigation: 'Enforce hardware-bound Titan M2 / Knox secure enclave key zeroization.',
        sndlHorizonYears: '5-10 Years'
      },
      {
        id: 'def_4',
        name: 'Diplomatic & Intelligence Leaks',
        percentage: 15,
        color: '#06b6d4', // cyan-500
        severity: 'MODERATE',
        impactDesc: 'Long-term archived diplomatic cables exposed via post-quantum quantum supremacy.',
        mitigation: 'Apply ephemeral hybrid ML-KEM session keys with zero disk persistence.',
        sndlHorizonYears: '20+ Years'
      }
    ]
  },
  {
    id: 'finance',
    label: 'Financial Services & Banking',
    iconName: 'Building2',
    description: 'SWIFT wire transfers, high-frequency trading tunnels, and core banking ledgers vulnerable to identity spoofing and traffic archiving.',
    threatVectors: [
      {
        id: 'fin_1',
        name: 'SWIFT Wire & Payment Tunnel Interception',
        percentage: 40,
        color: '#f43f5e',
        severity: 'CRITICAL',
        impactDesc: 'Interbank settlement channels intercepted; encrypted payloads stored for future quantum decryption.',
        mitigation: 'Enforce dual-layer ML-KEM-1024 + AES-256-GCM hardware tunnel encryption.',
        sndlHorizonYears: '7-10 Years'
      },
      {
        id: 'fin_2',
        name: 'Cryptographic Identity & OAuth Spoofing',
        percentage: 25,
        color: '#3b82f6', // blue-500
        severity: 'HIGH',
        impactDesc: 'ECDSA signature forgery allowing rogue state entities to impersonate banking nodes.',
        mitigation: 'Migrate API Gateway authentication to ML-DSA (FIPS 204) signatures.',
        sndlHorizonYears: 'Immediate Risk'
      },
      {
        id: 'fin_3',
        name: 'High-Frequency Trading Tunnel Exploits',
        percentage: 20,
        color: '#a855f7', // purple-500
        severity: 'HIGH',
        impactDesc: 'Latency-optimized market feeds with weak legacy TLS cipher suites compromised.',
        mitigation: 'Implement hardware-accelerated C assembly PQC lattice handshakes.',
        sndlHorizonYears: '1-3 Years'
      },
      {
        id: 'fin_4',
        name: 'Historical Customer Ledger SNDL',
        percentage: 15,
        color: '#10b981', // emerald-500
        severity: 'MODERATE',
        impactDesc: 'Long-term audit archives stored in cloud backups exposed to retroactive decryption.',
        mitigation: 'Re-encrypt legacy backups with post-quantum key encapsulation mechanisms.',
        sndlHorizonYears: '10+ Years'
      }
    ]
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Pharma',
    iconName: 'Activity',
    description: 'Proprietary drug research, genomic databases, and patient health records subject to strict HIPAA and long-term SNDL exposure.',
    threatVectors: [
      {
        id: 'hea_1',
        name: 'Genomic & Drug IP Research Theft',
        percentage: 45,
        color: '#ec4899', // pink-500
        severity: 'CRITICAL',
        impactDesc: 'Billion-dollar pharmaceutical molecular patents intercepted during cloud synchronization.',
        mitigation: 'Shield genomic database pipelines with ML-KEM-1024 quantum safes.',
        sndlHorizonYears: '20+ Years'
      },
      {
        id: 'hea_2',
        name: 'Medical Device & IoT Firmware Hijacking',
        percentage: 25,
        color: '#f97316',
        severity: 'HIGH',
        impactDesc: 'Hospital IoT telemetry signed with legacy RSA-2048 forged by quantum capabilities.',
        mitigation: 'Mandate ML-DSA hardware firmware signature verification on all devices.',
        sndlHorizonYears: '3-5 Years'
      },
      {
        id: 'hea_3',
        name: 'Patient PHI / EHR Permanent Storage Exposure',
        percentage: 20,
        color: '#06b6d4',
        severity: 'HIGH',
        impactDesc: 'Lifetime electronic health records harvested today decrypted during patient lifespan.',
        mitigation: 'Zero-trust PQC encryption layer on all cloud health databases.',
        sndlHorizonYears: 'Lifetime Retention'
      },
      {
        id: 'hea_4',
        name: 'Hospital Network Auth & Session Hijacking',
        percentage: 10,
        color: '#64748b', // slate-500
        severity: 'MODERATE',
        impactDesc: 'Staff VPN and single-sign-on tokens decrypted to gain internal network access.',
        mitigation: 'Deploy PQC-enabled WebAuthn hardware security keys.',
        sndlHorizonYears: '1-2 Years'
      }
    ]
  },
  {
    id: 'critical_infra',
    label: 'Critical Infrastructure & Energy',
    iconName: 'Zap',
    description: 'SCADA power grids, nuclear facility telemetry, and industrial IoT control systems vulnerable to state-sponsored sabotage.',
    threatVectors: [
      {
        id: 'infra_1',
        name: 'SCADA & Industrial Control Tunnel Spoofing',
        percentage: 40,
        color: '#ef4444', // red-500
        severity: 'CRITICAL',
        impactDesc: 'Power grid and pipeline command packets forged via broken RSA/ECC signatures.',
        mitigation: 'Hardened ML-DSA-87 signatures embedded directly into SCADA controllers.',
        sndlHorizonYears: 'Immediate Threat'
      },
      {
        id: 'infra_2',
        name: 'Grid Telemetry SNDL Archiving',
        percentage: 30,
        color: '#f59e0b', // amber-500
        severity: 'HIGH',
        impactDesc: 'Sensors transmitting energy grid topology intercepted for strategic reconnaissance.',
        mitigation: 'Hybrid post-quantum TLS 1.3 encapsulation across grid relays.',
        sndlHorizonYears: '5-10 Years'
      },
      {
        id: 'infra_3',
        name: 'Hardware Root of Trust Key Extraction',
        percentage: 20,
        color: '#10b981',
        severity: 'HIGH',
        impactDesc: 'Legacy HSMs and smart meters lacking side-channel lattice protections.',
        mitigation: 'Upgrade to FIPS 140-3 Level 4 HSMs with explicit RAM zeroization.',
        sndlHorizonYears: '5 Years'
      },
      {
        id: 'infra_4',
        name: 'State-Sponsored Cyber Warfare Interception',
        percentage: 10,
        color: '#8b5cf6',
        severity: 'MODERATE',
        impactDesc: 'High-altitude satellite telemetry harvested by peer nation intelligence agencies.',
        mitigation: 'Quantum-resistant space-to-ground lattice key exchange.',
        sndlHorizonYears: '10+ Years'
      }
    ]
  },
  {
    id: 'tech_saas',
    label: 'Technology & SaaS Enterprise',
    iconName: 'Cpu',
    description: 'API gateways, proprietary AI models, source code repositories, and customer OAuth sessions exposed to automated decryption.',
    threatVectors: [
      {
        id: 'tech_1',
        name: 'API Gateway OAuth & Session Token Exposure',
        percentage: 35,
        color: '#06b6d4',
        severity: 'CRITICAL',
        impactDesc: 'Millions of live user session tokens harvested from HTTPS streams and decrypted.',
        mitigation: 'Implement ML-KEM-1024 ephemeral key encapsulation on API proxies.',
        sndlHorizonYears: 'Immediate Risk'
      },
      {
        id: 'tech_2',
        name: 'Proprietary AI Model & Source Code IP Theft',
        percentage: 30,
        color: '#a855f7',
        severity: 'CRITICAL',
        impactDesc: 'Internal Git repositories and AI model weights intercepted in transit between data centers.',
        mitigation: 'Quantum-safe SSH & TLS backbones utilizing lattice-based cryptography.',
        sndlHorizonYears: '5 Years'
      },
      {
        id: 'tech_3',
        name: 'Cloud KMS Asymmetric Key Vulnerability',
        percentage: 20,
        color: '#f43f5e',
        severity: 'HIGH',
        impactDesc: 'Master cloud KMS RSA keys rendered obsolete by CRQC prime factorization.',
        mitigation: 'Migrate AWS KMS / Azure Key Vault to native post-quantum key specs.',
        sndlHorizonYears: '3-5 Years'
      },
      {
        id: 'tech_4',
        name: 'Customer PII SNDL Harvesting',
        percentage: 15,
        color: '#10b981',
        severity: 'MODERATE',
        impactDesc: 'User identity databases recorded by rogue traffic nodes for future blackmail/exposure.',
        mitigation: 'Field-level PQC envelope encryption on sensitive database columns.',
        sndlHorizonYears: '7+ Years'
      }
    ]
  }
];

interface QuantumRiskD3DashboardProps {
  selectedOrgId: string;
  onSelectOrgId: (id: string) => void;
  calculatedScore?: number;
}

export const QuantumRiskD3Dashboard: React.FC<QuantumRiskD3DashboardProps> = ({
  selectedOrgId,
  onSelectOrgId,
  calculatedScore
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredVector, setHoveredVector] = useState<ThreatVector | null>(null);
  const [selectedVector, setSelectedVector] = useState<ThreatVector | null>(null);

  // Get active profile
  const activeProfile = ORG_RISK_PROFILES.find(p => p.id === selectedOrgId) || ORG_RISK_PROFILES[0];

  // Set default selected vector when profile changes
  useEffect(() => {
    if (activeProfile.threatVectors.length > 0) {
      setSelectedVector(activeProfile.threatVectors[0]);
    }
  }, [selectedOrgId]);

  // Render D3 Pie / Donut Chart
  useEffect(() => {
    if (!svgRef.current) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove(); // Clear previous drawing

    const width = 280;
    const height = 280;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.58; // Donut chart hole

    const g = svgElement
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // D3 Pie Generator
    const pie = d3.pie<ThreatVector>()
      .value(d => d.percentage)
      .sort(null);

    // D3 Arc Generator
    const arc = d3.arc<d3.PieArcDatum<ThreatVector>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 12)
      .cornerRadius(6)
      .padAngle(0.03);

    // Hover Arc Generator (Expanded slice)
    const hoverArc = d3.arc<d3.PieArcDatum<ThreatVector>>()
      .innerRadius(innerRadius - 4)
      .outerRadius(radius - 2)
      .cornerRadius(8)
      .padAngle(0.03);

    const arcsData = pie(activeProfile.threatVectors);

    // Draw Slices
    const path = g.selectAll('.slice')
      .data(arcsData)
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('fill', d => d.data.color)
      .attr('stroke', '#0f172a') // slate-900 border between slices
      .attr('stroke-width', '2px')
      .style('cursor', 'pointer')
      .style('filter', d => (selectedVector?.id === d.data.id || hoveredVector?.id === d.data.id) ? 'drop-shadow(0px 0px 10px ' + d.data.color + '88)' : 'none');

    // Initial entrance animation
    path.transition()
      .duration(750)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Set active slice appearance
    path.attr('d', d => {
      const isHighlighted = (hoveredVector?.id === d.data.id) || (selectedVector?.id === d.data.id);
      return isHighlighted ? hoverArc(d) : arc(d);
    });

    // Mouse events
    path
      .on('mouseenter', (event, d) => {
        setHoveredVector(d.data);
        d3.select(event.currentTarget)
          .transition()
          .duration(150)
          .attr('d', hoverArc as any)
          .style('filter', `drop-shadow(0px 0px 12px ${d.data.color})`);
      })
      .on('mouseleave', (event, d) => {
        setHoveredVector(null);
        d3.select(event.currentTarget)
          .transition()
          .duration(150)
          .attr('d', (selectedVector?.id === d.data.id ? hoverArc : arc) as any)
          .style('filter', selectedVector?.id === d.data.id ? `drop-shadow(0px 0px 10px ${d.data.color}88)` : 'none');
      })
      .on('click', (event, d) => {
        setSelectedVector(d.data);
      });

  }, [selectedOrgId, hoveredVector?.id, selectedVector?.id]);

  const activeVector = hoveredVector || selectedVector || activeProfile.threatVectors[0];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Org Type Switcher */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-cyan-950 border border-cyan-500/40 rounded-xl text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>QUANTUM RISK ASSESSMENT DASHBOARD</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  D3.js ENGINE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Threat vector breakdown based on organizational target profile
              </p>
            </div>
          </div>

          {calculatedScore !== undefined && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Calculated Risk Index</span>
              <span className="text-sm font-black font-mono text-cyan-400">{calculatedScore} / 100</span>
            </div>
          )}
        </div>

        {/* Organization Type Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1 font-mono text-xs">
          {ORG_RISK_PROFILES.map((profile) => {
            const isSelected = profile.id === selectedOrgId;
            return (
              <button
                key={profile.id}
                onClick={() => onSelectOrgId(profile.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950 to-slate-900 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/60 font-bold ring-1 ring-cyan-500/40 scale-102'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px]">
                  <span>{profile.id.toUpperCase()}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
                <div className="text-xs font-bold truncate leading-tight">{profile.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main D3 Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: D3 Donut Chart Visualizer */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative shadow-inner">
          <div className="relative w-64 h-64 flex items-center justify-center">
            
            {/* SVG Canvas for D3 */}
            <svg 
              ref={svgRef} 
              className="w-full h-full overflow-visible drop-shadow-2xl"
            />

            {/* Donut Center Label Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                {activeVector ? activeVector.severity + ' RISK' : 'RISK VECTOR'}
              </span>
              <span 
                className="text-2xl font-black font-mono tracking-tight my-0.5"
                style={{ color: activeVector ? activeVector.color : '#06b6d4' }}
              >
                {activeVector ? `${activeVector.percentage}%` : '100%'}
              </span>
              <span className="text-[10px] text-slate-300 font-sans line-clamp-2 max-w-[120px] font-medium leading-tight">
                {activeVector ? activeVector.name : activeProfile.label}
              </span>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-400 font-mono text-center flex items-center justify-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hover or click pie slices for threat vector deep dive</span>
          </div>
        </div>

        {/* Right Column: Active Threat Vector Details Card & Legend */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Slice Inspection Card */}
          <div 
            className="p-5 rounded-2xl border transition-all space-y-3 bg-slate-950 shadow-xl"
            style={{ borderColor: `${activeVector.color}66` }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span 
                  className="w-3 h-3 rounded-full shrink-0 animate-ping"
                  style={{ backgroundColor: activeVector.color }}
                />
                <h4 className="text-sm font-bold text-white font-sans">
                  {activeVector.name}
                </h4>
              </div>

              <span 
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border"
                style={{ 
                  color: activeVector.color, 
                  borderColor: `${activeVector.color}88`,
                  backgroundColor: `${activeVector.color}15` 
                }}
              >
                {activeVector.severity} THREAT
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeVector.impactDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>SNDL Exposure Horizon</span>
                </div>
                <span className="font-bold text-white block text-xs font-mono">
                  {activeVector.sndlHorizonYears}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>NIST PQC Mitigation</span>
                </div>
                <span className="font-semibold text-emerald-300 block text-[11px] leading-tight">
                  {activeVector.mitigation}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-2">
              Threat Vector Distribution ({activeProfile.label})
            </span>

            <div className="space-y-2">
              {activeProfile.threatVectors.map((tv) => {
                const isSelected = selectedVector?.id === tv.id || hoveredVector?.id === tv.id;
                return (
                  <button
                    key={tv.id}
                    onClick={() => setSelectedVector(tv)}
                    onMouseEnter={() => setHoveredVector(tv)}
                    onMouseLeave={() => setHoveredVector(null)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-sans transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-600 text-white shadow-md'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: tv.color }}
                      />
                      <span className="font-medium truncate">{tv.name}</span>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 font-mono text-[11px]">
                      <span className="font-bold text-white">{tv.percentage}%</span>
                      <span 
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{ 
                          color: tv.color, 
                          backgroundColor: `${tv.color}20` 
                        }}
                      >
                        {tv.severity}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
