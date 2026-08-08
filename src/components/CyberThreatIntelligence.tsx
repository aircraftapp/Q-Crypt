import React, { useState } from 'react';
import { ShieldAlert, Radio, AlertTriangle, FileJson, CheckCircle2, Copy, Filter, ExternalLink, Activity, Server, Eye, Database, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';

interface AptThreatCampaign {
  id: string;
  name: string;
  origin: string;
  targetSector: string;
  tactic: string;
  mitreCode: string;
  hndlRiskScore: number;
  status: 'BLOCKED' | 'MONITORED' | 'NEUTRALIZED';
  lastSeen: string;
  summary: string;
}

interface IndicatorOfCompromise {
  id: string;
  type: 'IP Address' | 'Domain Relay' | 'Cipher Hash' | 'Malware Signature';
  value: string;
  threatActor: string;
  actionTaken: string;
  timestamp: string;
}

export const CyberThreatIntelligence: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'DEFENSE' | 'GOVERNMENT' | 'BANKING'>('ALL');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'iocs' | 'mitre'>('campaigns');

  const aptCampaigns: AptThreatCampaign[] = [
    {
      id: 'apt-28-qharvest',
      name: 'APT28 (Fancy Bear) - Quantum-Harvest Campaign',
      origin: 'Eastern Europe / State-Sponsored',
      targetSector: 'Defense & Government Contractors',
      tactic: 'Passive BGP Hijacking & Harvest-Now-Decrypt-Later Tapping',
      mitreCode: 'T1402.001',
      hndlRiskScore: 98,
      status: 'NEUTRALIZED',
      lastSeen: '12 mins ago',
      summary: 'Interception of cellular voice and data pipelines targeting defense personnel. Neutralized by Q-CRYPT ML-KEM-1024 lattice key encapsulation.',
    },
    {
      id: 'volt-typhoon-relay',
      name: 'Volt Typhoon - Telecom Relay Tapping',
      origin: 'Asia-Pacific / State-Sponsored',
      targetSector: 'Critical Infrastructure & Telecoms',
      tactic: 'Router Mesh Infiltration & Mobile Cipher Downgrade',
      mitreCode: 'T1612',
      hndlRiskScore: 92,
      status: 'BLOCKED',
      lastSeen: '4 mins ago',
      summary: 'Attempted forced TLS cipher fallback to legacy RSA-2048. Rejected by Q-CRYPT strict post-quantum handshake policies.',
    },
    {
      id: 'lazarus-vault-intercept',
      name: 'Lazarus Group - HNDL Vault Exfiltration',
      origin: 'East Asia / State-Sponsored',
      targetSector: 'Banking & Financial SWIFT Operators',
      tactic: 'Cell Tower IMSI Catcher & Bulk Encrypted Storage',
      mitreCode: 'T1437',
      hndlRiskScore: 95,
      status: 'NEUTRALIZED',
      lastSeen: '1 hour ago',
      summary: 'Passive IMSI Catcher logging mobile packet payloads. Recorded ciphertexts are rendered permanently uncrackable due to Kyber lattice noise.',
    },
    {
      id: 'apt41-double-dragon',
      name: 'APT41 (Double Dragon) - Mobile Memory Extraction',
      origin: 'Asia-Pacific / State-Sponsored',
      targetSector: 'Government & Diplomatic Missions',
      tactic: 'Android Kernel Exploit & RAM Memory Dumping',
      mitreCode: 'T1404',
      hndlRiskScore: 89,
      status: 'BLOCKED',
      lastSeen: '35 mins ago',
      summary: 'Attempted RAM memory dump to extract key pairs. Blocked by Google Titan M2 Hardware Security Enclave isolation.',
    },
  ];

  const iocFeed: IndicatorOfCompromise[] = [
    {
      id: 'ioc-1',
      type: 'IP Address',
      value: '185.220.101.45 (BGP Hijack Interceptor)',
      threatActor: 'APT28',
      actionTaken: 'Blacklisted across all Sovereign Relay Nodes',
      timestamp: '2026-07-25 21:18:02 UTC',
    },
    {
      id: 'ioc-2',
      type: 'Domain Relay',
      value: 'telecom-cell-relay-node.net',
      threatActor: 'Volt Typhoon',
      actionTaken: 'Cipher Downgrade Handshake Terminated',
      timestamp: '2026-07-25 21:10:44 UTC',
    },
    {
      id: 'ioc-3',
      type: 'Cipher Hash',
      value: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      threatActor: 'Lazarus Group',
      actionTaken: 'Signature Rejected via ML-DSA-87',
      timestamp: '2026-07-25 20:45:19 UTC',
    },
    {
      id: 'ioc-4',
      type: 'Malware Signature',
      value: 'Android.PQC.Downgrade.Agent.v4',
      threatActor: 'APT41',
      actionTaken: 'Isolated in Titan M2 StrongBox',
      timestamp: '2026-07-25 20:12:00 UTC',
    },
  ];

  const filteredCampaigns = aptCampaigns.filter((c) => {
    if (selectedFilter === 'DEFENSE') return c.targetSector.toLowerCase().includes('defense');
    if (selectedFilter === 'GOVERNMENT') return c.targetSector.toLowerCase().includes('government');
    if (selectedFilter === 'BANKING') return c.targetSector.toLowerCase().includes('banking');
    return true;
  });

  const exportStixJson = () => {
    const stixPayload = {
      type: 'bundle',
      id: 'bundle--qcrypt-cti-' + Date.now(),
      spec_version: '2.1',
      objects: [
        {
          type: 'report',
          id: 'report--qcrypt-pqc-cti-threat-intel',
          created: new Date().toISOString(),
          name: 'Q-CRYPT Post-Quantum Threat Intelligence & HNDL Report',
          description: 'State-sponsored adversary quantum harvesting monitoring telemetry',
          published: new Date().toISOString(),
          object_refs: filteredCampaigns.map((c) => `threat-actor--${c.id}`),
        },
        ...filteredCampaigns.map((c) => ({
          type: 'threat-actor',
          id: `threat-actor--${c.id}`,
          name: c.name,
          goals: ['Harvest-Now-Decrypt-Later (HNDL)', c.tactic],
          sophistication: 'strategic / state-sponsored',
          resource_level: 'government',
          primary_motivation: 'espionage',
          pqc_mitigation: 'Q-CRYPT ML-KEM-1024 & ML-DSA-87 Protected',
        })),
        ...iocFeed.map((ioc) => ({
          type: 'indicator',
          id: `indicator--${ioc.id}`,
          pattern: `[${ioc.type.toLowerCase().replace(' ', '-')} = '${ioc.value}']`,
          valid_from: ioc.timestamp,
          labels: ['pqc-threat', 'quantum-harvesting', ioc.threatActor],
        })),
      ],
    };

    const blob = new Blob([JSON.stringify(stixPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Q-CRYPT-CTI-STIX-2.1-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Exported STIX 2.1 CTI Threat Intel JSON Payload', 'success');
  };

  return (
    <section id="cti-hub" className="py-12 bg-[#080D1A] text-slate-100 relative overflow-hidden border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Alert Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>{t('cti.tag')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('cti.title')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              {t('cti.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={exportStixJson}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-950 transition-all hover:scale-[1.02]"
            >
              <FileJson className="w-4 h-4" />
              <span>{t('cti.stixExport')}</span>
            </button>
          </div>
        </div>

        {/* Live CTI Status Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t('cti.aptMonitored')}</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{t('cti.active4')}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> {t('cti.pqcMitigated')}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t('cti.hndlRiskIndex')}</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-300 font-mono">{t('cti.critical96')}</div>
            <div className="text-[10px] text-slate-400 font-mono">{t('cti.forLegacyApps')}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t('cti.defenseImmunity')}</span>
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">{t('cti.immune100')}</div>
            <div className="text-[10px] text-emerald-400 font-mono">{t('cti.mlkemEnforced')}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t('cti.iocBlockRate')}</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{t('cti.perDay')}</div>
            <div className="text-[10px] text-cyan-400 font-mono">{t('cti.zeroFailures')}</div>
          </div>
        </div>

        {/* CTI Hub Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                activeTab === 'campaigns'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('cti.tabCampaigns')} ({filteredCampaigns.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('iocs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                activeTab === 'iocs'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('cti.tabIocs')}</span>
            </button>

            <button
              onClick={() => setActiveTab('mitre')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                activeTab === 'mitre'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('cti.tabMitre')}</span>
            </button>
          </div>

          {activeTab === 'campaigns' && (
            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('cti.filterSector')}</span>
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  selectedFilter === 'ALL' ? 'bg-cyan-900 text-cyan-200 font-bold' : 'hover:bg-slate-800'
                }`}
              >
                {t('cti.filterAll')}
              </button>
              <button
                onClick={() => setSelectedFilter('DEFENSE')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  selectedFilter === 'DEFENSE' ? 'bg-cyan-900 text-cyan-200 font-bold' : 'hover:bg-slate-800'
                }`}
              >
                {t('cti.filterDefense')}
              </button>
              <button
                onClick={() => setSelectedFilter('GOVERNMENT')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  selectedFilter === 'GOVERNMENT' ? 'bg-cyan-900 text-cyan-200 font-bold' : 'hover:bg-slate-800'
                }`}
              >
                {t('cti.filterGovernment')}
              </button>
              <button
                onClick={() => setSelectedFilter('BANKING')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  selectedFilter === 'BANKING' ? 'bg-cyan-900 text-cyan-200 font-bold' : 'hover:bg-slate-800'
                }`}
              >
                {t('cti.filterBanking')}
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: APT Campaign Tracker */}
        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {filteredCampaigns.map((apt) => (
              <div key={apt.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 space-y-4 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {apt.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{apt.origin}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                    {apt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Target Sector</span>
                    <span className="text-slate-200 font-medium">{apt.targetSector}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MITRE Code</span>
                    <span className="text-cyan-400 font-bold">{apt.mitreCode}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800/80 flex justify-between items-center">
                    <span className="text-slate-500 text-[10px]">Harvest-Now-Decrypt-Later Risk:</span>
                    <span className="text-rose-400 font-bold">{apt.hndlRiskScore}/100</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {apt.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                  <span className="font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Q-CRYPT Post-Quantum Immune
                  </span>
                  <span className="font-mono text-slate-500">Last Telemetry: {apt.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Live Indicators of Compromise (IoCs) */}
        {activeTab === 'iocs' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden animate-fadeIn">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
              <span className="font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Active Cyber Threat Intelligence IoC Stream
              </span>
              <span>Updated Real-Time</span>
            </div>

            <div className="divide-y divide-slate-800 font-mono text-xs">
              {iocFeed.map((ioc) => (
                <div key={ioc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-800">
                        {ioc.type}
                      </span>
                      <span className="text-white font-bold">{ioc.value}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Actor: <span className="text-rose-400 font-semibold">{ioc.threatActor}</span> • Action: <span className="text-emerald-400">{ioc.actionTaken}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 text-right shrink-0">
                    {ioc.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: MITRE ATT&CK Mobile Matrix */}
        {activeTab === 'mitre' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn font-mono text-xs">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">T1402.001</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">PQC Protected</span>
              </div>
              <h4 className="text-white font-bold text-sm">Network Traffic Interception (HNDL)</h4>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                Adversary passively records cell tower & trunk cable traffic to decrypt in the quantum era.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-[11px]">
                Mitigated by: <strong className="text-white">ML-KEM-1024 Lattice Encapsulation</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">T1612</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">PQC Protected</span>
              </div>
              <h4 className="text-white font-bold text-sm">TLS Cipher Downgrade Attack</h4>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                Mitm interceptor attempts to downgrade session encryption to classical RSA-2048.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-[11px]">
                Mitigated by: <strong className="text-white">ML-DSA-87 Signed Handshake Enforcement</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">T1437</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">PQC Protected</span>
              </div>
              <h4 className="text-white font-bold text-sm">OS Kernel Memory Extraction</h4>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                Malicious spyware probes device system RAM to extract active private keys.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-[11px]">
                Mitigated by: <strong className="text-white">Google Titan M2 / StrongBox Hardware Enclave</strong>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
