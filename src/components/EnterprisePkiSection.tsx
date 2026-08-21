import React, { useState, useMemo } from 'react';
import { 
  Key, ShieldCheck, Lock, Server, Cpu, RefreshCw, Plus, CheckCircle2, 
  AlertTriangle, Copy, Check, Download, FileText, ExternalLink, Search, 
  Filter, Layers, Sparkles, Terminal, Globe, ChevronRight, X, ArrowRight,
  Shield, Eye, Trash2, Sliders, Smartphone, AlertCircle, Settings,
  SlidersHorizontal, CheckSquare, Square, ToggleLeft, ToggleRight, Bookmark,
  Calendar, Clock, BarChart3, AlertOctagon, RotateCcw, ShieldAlert, Zap,
  TrendingUp, Activity, CheckCheck
} from 'lucide-react';
import { 
  PqcCertificate, 
  PkiOidConstraint,
  PkiPolicyConfig,
  INITIAL_PKI_CERTIFICATES, 
  INITIAL_OID_CONSTRAINTS,
  DEFAULT_PKI_POLICY,
  generatePqcCertificate, 
  NewCertificateParams,
  generateOpenSslConfig,
  generateNginxPqcConfig,
  generateKubernetesCertManagerYaml,
  generateRootCaFromPolicy,
  generateOpensslPolicyConfig
} from '../services/enterprisePkiService';
import { useToast } from './Toast';

export const EnterprisePkiSection: React.FC = () => {
  const { showToast } = useToast();
  const [certificates, setCertificates] = useState<PqcCertificate[]>(INITIAL_PKI_CERTIFICATES);
  const [activeTab, setActiveTab] = useState<'inventory' | 'timeline' | 'crl' | 'issue' | 'trust-chain' | 'ocsp' | 'automation' | 'policy-editor'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedCert, setSelectedCert] = useState<PqcCertificate | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [ocspSerialQuery, setOcspSerialQuery] = useState('');
  const [ocspResult, setOcspResult] = useState<{
    status: 'GOOD' | 'REVOKED' | 'UNKNOWN';
    cert?: PqcCertificate;
    checkedAt: string;
    signature: string;
    responder: string;
  } | null>(null);
  const [isCheckingOcsp, setIsCheckingOcsp] = useState(false);

  // Timeline Gantt View State
  const [timelineFilter, setTimelineFilter] = useState<'ALL' | 'ROOT_INTERMEDIATE' | 'END_ENTITY'>('ALL');
  const [timelineHoveredCert, setTimelineHoveredCert] = useState<PqcCertificate | null>(null);

  // CRL Management State
  const [crlSearchQuery, setCrlSearchQuery] = useState('');
  const [crlFilter, setCrlFilter] = useState<'ALL' | 'REVOKED' | 'ACTIVE'>('ALL');
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [certToRevoke, setCertToRevoke] = useState<PqcCertificate | null>(null);
  const [revocationReasonCode, setRevocationReasonCode] = useState<string>('keyCompromise');
  const [revocationComment, setRevocationComment] = useState<string>('');
  const [crlVersion] = useState<string>('X.509 CRL v2 (RFC 5280)');
  const [crlNumber, setCrlNumber] = useState<number>(75);
  const [crlLastUpdate, setCrlLastUpdate] = useState<string>(new Date().toISOString());

  // Enterprise PKI Policy Editor State
  const [policyConfig, setPolicyConfig] = useState<PkiPolicyConfig>(DEFAULT_PKI_POLICY);
  const [oidSearchQuery, setOidSearchQuery] = useState('');
  const [selectedOidCategory, setSelectedOidCategory] = useState<string>('ALL');
  const [isGeneratingRootCa, setIsGeneratingRootCa] = useState(false);
  const [newSubtreeDomain, setNewSubtreeDomain] = useState('');

  // Root CA Generation Parameters linked with Policy
  const [rootCaForm, setRootCaForm] = useState({
    commonName: 'Q-CRYPT Global Sovereign Post-Quantum Root CA G2',
    organization: 'Q-CRYPT Sovereign Trust Network Inc.',
    organizationalUnit: 'Sovereign PQC Directorate (FIPS 204 Root)',
    algorithm: 'ML-DSA-87 (FIPS 204)' as 'ML-DSA-87 (FIPS 204)' | 'ML-DSA-65' | 'Falcon-1024' | 'Hybrid (Ed25519 + ML-DSA-87)' | 'SLH-DSA (SPHINCS+)',
    hsmRootOfTrust: 'Nitrokey NetHSM' as 'Nitrokey NetHSM' | 'Thales Luna PCIe HSM' | 'AWS CloudHSM' | 'Utimaco CryptoServer' | 'Titan M2 / Knox StrongBox' | 'Software Air-Gapped Key'
  });

  // New Certificate Form State
  const [newCertForm, setNewCertForm] = useState<NewCertificateParams>({
    commonName: 'gateway-frankfurt-01.q-crypt.sec',
    organization: 'Enterprise Defense & Financial Grid',
    organizationalUnit: 'Sovereign PQC Tunnel Division',
    subjectAltNames: 'gateway-frankfurt-01.q-crypt.sec, 10.180.20.12, mesh-de.pqc.internal',
    algorithm: 'ML-DSA-87 (FIPS 204)',
    type: 'GATEWAY',
    validityDays: 365,
    hsmRootOfTrust: 'Thales Luna PCIe HSM',
    keyUsage: ['Digital Signature', 'Key Encipherment', 'Server Authentication']
  });

  const handleCopy = (text: string, keyName: string, message: string = 'Copied to clipboard') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast('Copied', message, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertForm.commonName.trim()) {
      showToast('Validation Error', 'Common Name is required.', 'error');
      return;
    }

    try {
      const issued = generatePqcCertificate(newCertForm);
      setCertificates(prev => [issued, ...prev]);
      setSelectedCert(issued);
      showToast('PQC Certificate Issued', `Certificate for ${issued.commonName} signed successfully.`, 'success');
      setActiveTab('inventory');
    } catch (err) {
      console.error('Failed to issue certificate', err);
      showToast('Issuance Error', 'Failed to generate cryptographic certificate.', 'error');
    }
  };

  const handleOpenRevokeModal = (cert: PqcCertificate) => {
    setCertToRevoke(cert);
    setRevocationReasonCode('keyCompromise');
    setRevocationComment('');
    setIsRevokeModalOpen(true);
  };

  const handleConfirmRevocation = () => {
    if (!certToRevoke) return;

    const formattedReason = `${revocationReasonCode}${revocationComment ? ` - ${revocationComment}` : ''}`;
    
    setCertificates(prev => prev.map(c => {
      if (c.id === certToRevoke.id) {
        return {
          ...c,
          status: 'REVOKED',
          revocationReason: formattedReason,
          revocationDate: new Date().toISOString().slice(0, 10)
        };
      }
      return c;
    }));

    // Increment CRL number and update timestamp
    setCrlNumber(prev => prev + 1);
    setCrlLastUpdate(new Date().toISOString());
    setIsRevokeModalOpen(false);
    
    showToast(
      'Certificate Revoked', 
      `${certToRevoke.commonName} revoked. CRL #${crlNumber + 1} signed and distributed to trust boundaries.`, 
      'error'
    );
    setCertToRevoke(null);
  };

  const handleReinstateCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        const { revocationReason, revocationDate, ...rest } = c;
        return {
          ...rest,
          status: 'ACTIVE'
        };
      }
      return c;
    }));
    setCrlNumber(prev => prev + 1);
    setCrlLastUpdate(new Date().toISOString());
    showToast('Certificate Reinstated', 'Removed from active CRL blacklist.', 'success');
  };

  const handleExportCrl = (format: 'pem' | 'der') => {
    const revokedList = certificates.filter(c => c.status === 'REVOKED');
    const crlContent = `-----BEGIN X509 CRL-----
Version: 2 (0x1)
Signature Algorithm: ML-DSA-87 (FIPS 204 Dilithium Level 5)
Issuer: CN=Q-CRYPT Global Sovereign Post-Quantum Root CA G1, O=Q-CRYPT Sovereign Trust Network Inc.
Last Update: ${crlLastUpdate}
Next Update: ${new Date(Date.now() + 86400000).toISOString()}
CRL Number: 0x${crlNumber.toString(16).toUpperCase().padStart(4, '0')}
Revoked Certificates Count: ${revokedList.length}
${revokedList.map((c, i) => `[${i + 1}] Serial: ${c.serialNumber} | Date: ${c.revocationDate || '2026-08-20'} | Reason: ${c.revocationReason || 'keyCompromise'}`).join('\n')}
-----END X509 CRL-----`;

    const blob = new Blob([crlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pqc-sovereign-crl-v2.${format === 'pem' ? 'crl' : 'der'}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CRL Exported', `Downloaded X.509 CRL v2 signed with ML-DSA-87 (${format.toUpperCase()}).`, 'success');
  };

  const handleRevokeCertificate = (certId: string, reason: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status: 'REVOKED',
          revocationReason: reason,
          revocationDate: new Date().toISOString().slice(0, 10)
        };
      }
      return c;
    }));
    setCrlNumber(prev => prev + 1);
    setCrlLastUpdate(new Date().toISOString());
    showToast('Certificate Revoked', 'Revocation pushed to real-time CRL and OCSP responder.', 'error');
  };

  const handleCheckOcsp = (serialOrId?: string) => {
    const query = (serialOrId || ocspSerialQuery).trim().toLowerCase();
    if (!query) {
      showToast('OCSP Query', 'Please enter a serial number or common name.', 'error');
      return;
    }

    setIsCheckingOcsp(true);
    setTimeout(() => {
      setIsCheckingOcsp(false);
      const found = certificates.find(c => 
        c.serialNumber.toLowerCase().includes(query) || 
        c.commonName.toLowerCase().includes(query) ||
        c.id.toLowerCase() === query
      );

      if (found) {
        setOcspResult({
          status: found.status === 'REVOKED' ? 'REVOKED' : 'GOOD',
          cert: found,
          checkedAt: new Date().toISOString(),
          signature: 'ML-DSA-87: 9f8a7e6d5c4b3a210987654321fedcba' + Math.random().toString(36).substring(2, 10),
          responder: 'ocsp-va-root.pqc.q-crypt.sec (Hardware Enclave HSM)'
        });
      } else {
        setOcspResult({
          status: 'UNKNOWN',
          checkedAt: new Date().toISOString(),
          signature: 'ML-DSA-87: 9f8a7e6d5c4b3a210987654321fedcba' + Math.random().toString(36).substring(2, 10),
          responder: 'ocsp-va-root.pqc.q-crypt.sec (Hardware Enclave HSM)'
        });
        showToast('OCSP Notice', 'No certificate matched query.', 'info');
      }
    }, 400);
  };

  // Enterprise PKI Policy Editor Handlers
  const handleToggleOid = (oidId: string) => {
    setPolicyConfig(prev => ({
      ...prev,
      oids: prev.oids.map(o => o.id === oidId ? { ...o, enabled: !o.enabled } : o)
    }));
  };

  const handleToggleOidCritical = (oidId: string) => {
    setPolicyConfig(prev => ({
      ...prev,
      oids: prev.oids.map(o => o.id === oidId ? { ...o, critical: !o.critical } : o)
    }));
  };

  const handleValidityPresetChange = (preset: '10_YEARS' | '20_YEARS' | '25_YEARS' | '30_YEARS' | 'CUSTOM', customDays?: number) => {
    let days = 9125;
    if (preset === '10_YEARS') days = 3650;
    else if (preset === '20_YEARS') days = 7300;
    else if (preset === '25_YEARS') days = 9125;
    else if (preset === '30_YEARS') days = 10950;
    else if (preset === 'CUSTOM' && customDays !== undefined) days = customDays;

    setPolicyConfig(prev => ({
      ...prev,
      validityPreset: preset,
      validityDays: days
    }));
  };

  const handleAddPermittedSubtree = () => {
    const domain = newSubtreeDomain.trim();
    if (!domain) return;
    const formatted = domain.startsWith('.') ? domain : `.${domain}`;
    if (policyConfig.permittedDnsDomains.includes(formatted)) {
      showToast('Domain Exists', 'Subtree constraint already present.', 'info');
      return;
    }
    setPolicyConfig(prev => ({
      ...prev,
      permittedDnsDomains: [...prev.permittedDnsDomains, formatted]
    }));
    setNewSubtreeDomain('');
    showToast('Subtree Constraint Added', `Added ${formatted} to permitted namespace.`, 'success');
  };

  const handleRemovePermittedSubtree = (domain: string) => {
    setPolicyConfig(prev => ({
      ...prev,
      permittedDnsDomains: prev.permittedDnsDomains.filter(d => d !== domain)
    }));
  };

  const handleGenerateRootCaFromPolicy = () => {
    if (!rootCaForm.commonName.trim()) {
      showToast('Validation Error', 'Root CA Common Name is required.', 'error');
      return;
    }

    setIsGeneratingRootCa(true);
    showToast('Root CA Generation Initialized', 'Synthesizing FIPS 204 sovereign root key inside HSM enclave...', 'info');

    setTimeout(() => {
      try {
        const rootCert = generateRootCaFromPolicy(policyConfig, {
          commonName: rootCaForm.commonName,
          organization: rootCaForm.organization,
          organizationalUnit: rootCaForm.organizationalUnit,
          algorithm: rootCaForm.algorithm,
          hsmRootOfTrust: rootCaForm.hsmRootOfTrust,
          validityDays: policyConfig.validityDays
        });

        setCertificates(prev => [rootCert, ...prev]);
        setSelectedCert(rootCert);
        setIsGeneratingRootCa(false);
        showToast(
          'Post-Quantum Root CA Generated',
          `Created ${rootCert.commonName} with ${policyConfig.oids.filter(o => o.enabled).length} active OID constraints.`,
          'success'
        );
      } catch (err) {
        console.error('Failed to generate root CA', err);
        setIsGeneratingRootCa(false);
        showToast('Generation Failed', 'Could not generate Root CA.', 'error');
      }
    }, 650);
  };

  const handleExportOpensslPolicyConfig = () => {
    const cnf = generateOpensslPolicyConfig(policyConfig, rootCaForm);
    const blob = new Blob([cnf], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pqc-root-ca-policy-${policyConfig.validityDays}d.cnf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Policy Exported', 'Downloaded OpenSSL 3.3+ policy configuration (.cnf).', 'success');
  };

  // Filtered OID list for policy editor
  const filteredOids = useMemo(() => {
    return policyConfig.oids.filter(oid => {
      const matchCat = selectedOidCategory === 'ALL' || oid.category === selectedOidCategory;
      const q = oidSearchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        oid.name.toLowerCase().includes(q) || 
        oid.oid.toLowerCase().includes(q) ||
        oid.description.toLowerCase().includes(q) ||
        oid.standard.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [policyConfig.oids, selectedOidCategory, oidSearchQuery]);

  const activeOidCount = useMemo(() => {
    return policyConfig.oids.filter(o => o.enabled).length;
  }, [policyConfig.oids]);

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = 
      c.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.algorithm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL' || c.type === filterType || (filterType === 'REVOKED' && c.status === 'REVOKED');
    return matchesSearch && matchesFilter;
  });

  const activeCount = certificates.filter(c => c.status === 'ACTIVE').length;
  const revokedCount = certificates.filter(c => c.status === 'REVOKED').length;
  const rootCaCount = certificates.filter(c => c.type === 'ROOT_CA' || c.type === 'INTERMEDIATE_CA').length;

  return (
    <section id="enterprise-pki" className="py-16 bg-slate-950 text-slate-100 border-b border-slate-900 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-inner">
                <Key className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                  Enterprise Post-Quantum PKI
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold uppercase">
                  FIPS 204 ML-DSA-87
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl font-sans leading-relaxed">
              Sovereign Root Certificate Authority (CA), dual-algorithm X.509 v3 issuance engine, Hardware Security Module (HSM) root of trust, and automated mesh endpoint enrollment.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs shrink-0">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Active Certs</span>
              <span className="text-emerald-400 text-lg font-black">{activeCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Trust Roots</span>
              <span className="text-cyan-400 text-lg font-black">{rootCaCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold">OCSP Latency</span>
              <span className="text-slate-200 text-lg font-black">&lt;1.8ms</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Certificate Inventory ({certificates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Renewal Timeline (Gantt)</span>
            </button>

            <button
              onClick={() => setActiveTab('crl')}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'crl'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Revocation List (CRL)</span>
            </button>

            <button
              onClick={() => setActiveTab('trust-chain')}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'trust-chain'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Trust Hierarchy & HSM</span>
            </button>

            <button
              onClick={() => setActiveTab('policy-editor')}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'policy-editor'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>PKI Policy Editor ({activeOidCount} OIDs)</span>
            </button>

            <button
              onClick={() => setActiveTab('ocsp')}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'ocsp'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>OCSP Responder</span>
            </button>

            <button
              onClick={() => setActiveTab('issue')}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'issue'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue PQC Cert</span>
            </button>

            <button
              onClick={() => setActiveTab('automation')}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'automation'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>DevOps & SDKs</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>EST / SCEP RFC 7030 Online</span>
          </div>
        </div>

        {/* TAB 1: CERTIFICATE INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filtering Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search CN, serial, algorithm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
                {['ALL', 'ROOT_CA', 'GATEWAY', 'MESH_NODE', 'EXECUTIVE_ENDPOINT', 'REVOKED'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                      filterType === type
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Certificates Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Subject Common Name</th>
                      <th className="py-3.5 px-4">Type / Scope</th>
                      <th className="py-3.5 px-4">Algorithm Standard</th>
                      <th className="py-3.5 px-4">Root of Trust</th>
                      <th className="py-3.5 px-4">Valid Until</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredCerts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                          No certificates matched the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredCerts.map((cert) => (
                        <tr key={cert.id} className="hover:bg-slate-800/40 transition-colors group">
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="flex items-center space-x-2">
                              <span className="text-cyan-400">{cert.commonName}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate max-w-xs">{cert.serialNumber}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-300 text-[10px]">
                              {cert.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-emerald-300 font-bold">
                            {cert.algorithm}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            <div className="flex items-center space-x-1.5">
                              <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{cert.hsmRootOfTrust}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {cert.expiryDate}
                          </td>
                          <td className="py-3.5 px-4">
                            {cert.status === 'ACTIVE' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 font-bold text-[10px] flex items-center space-x-1 w-fit">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>ACTIVE</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-700 font-bold text-[10px] flex items-center space-x-1 w-fit">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>REVOKED</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setSelectedCert(cert)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition-all cursor-pointer font-bold"
                                title="Inspect Certificate Details & PEM"
                              >
                                Inspect
                              </button>

                              {cert.status === 'ACTIVE' && cert.type !== 'ROOT_CA' ? (
                                <button
                                  onClick={() => handleOpenRevokeModal(cert)}
                                  className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-800/60 transition-all cursor-pointer font-bold"
                                  title="Revoke Certificate and Publish to CRL"
                                >
                                  Revoke
                                </button>
                              ) : cert.status === 'REVOKED' ? (
                                <button
                                  onClick={() => handleReinstateCertificate(cert.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 hover:text-white border border-emerald-800/60 transition-all cursor-pointer font-bold"
                                  title="Reinstate Certificate"
                                >
                                  Reinstate
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATE RENEWAL TIMELINE (HORIZONTAL GANTT CHART) */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Timeline Summary & Controls */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      Certificate Lifecycle & Expiry Horizon
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-sans">
                    Post-Quantum Trust Horizon & Renewal Gantt Chart
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Horizontal lifecycle timeline visualizing root, intermediate, and gateway certificate validity windows spanning 2025 to 2056
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500 font-bold uppercase text-[10px] mr-1">Scope:</span>
                  {[
                    { id: 'ALL', label: 'All Certificates' },
                    { id: 'ROOT_INTERMEDIATE', label: 'CAs Only (10-30 Yrs)' },
                    { id: 'END_ENTITY', label: 'Gateways / Endpoints (1-2 Yrs)' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setTimelineFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        timelineFilter === f.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm shadow-cyan-950'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Sovereign Trust Horizon</span>
                  <span className="text-cyan-400 text-xl font-black block">30+ Years</span>
                  <span className="text-slate-400 text-[10px]">Active Root CA valid until 2046</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Renewal Windows</span>
                  <span className="text-emerald-400 text-xl font-black block">
                    {certificates.filter(c => {
                      const days = Math.ceil((new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return days > 0 && days <= 180;
                    }).length} Active
                  </span>
                  <span className="text-slate-400 text-[10px]">Certs requiring renewal in &lt;180 days</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Trust Roots</span>
                  <span className="text-purple-400 text-xl font-black block">{rootCaCount} Authorities</span>
                  <span className="text-slate-400 text-[10px]">FIPS 204 ML-DSA-87 HSM anchored</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Current Base Year</span>
                  <span className="text-white text-xl font-black block">2026 (Live)</span>
                  <span className="text-slate-400 text-[10px]">RFC 5280 / NIST SP 800-208</span>
                </div>
              </div>

              {/* HORIZONTAL GANTT CHART CONTAINER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 overflow-x-auto">
                
                {/* Timeline Header Scale (2025 to 2056) */}
                <div className="min-w-[700px] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-b border-slate-800 pb-2 relative">
                    {/* Year Markers */}
                    {[2025, 2028, 2031, 2035, 2040, 2045, 2050, 2056].map(year => {
                      const startHorizon = new Date('2025-01-01T00:00:00Z').getTime();
                      const endHorizon = new Date('2056-01-01T00:00:00Z').getTime();
                      const yrTime = new Date(`${year}-01-01T00:00:00Z`).getTime();
                      const pct = Math.max(0, Math.min(100, ((yrTime - startHorizon) / (endHorizon - startHorizon)) * 100));

                      return (
                        <div 
                          key={year} 
                          className="absolute text-center -translate-x-1/2 flex flex-col items-center"
                          style={{ left: `${pct}%` }}
                        >
                          <span className={`font-bold ${year === 2025 ? 'text-cyan-400' : 'text-slate-400'}`}>{year}</span>
                          <span className="w-0.5 h-1.5 bg-slate-800 mt-1" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Spacer for tick labels */}
                  <div className="h-4" />

                  {/* Certificate Gantt Bars */}
                  <div className="space-y-4 pt-2 relative">
                    {/* Live 'TODAY' vertical guide line */}
                    {(() => {
                      const startHorizon = new Date('2025-01-01T00:00:00Z').getTime();
                      const endHorizon = new Date('2056-01-01T00:00:00Z').getTime();
                      const nowPct = Math.max(0, Math.min(100, ((Date.now() - startHorizon) / (endHorizon - startHorizon)) * 100));
                      return (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-20 pointer-events-none shadow-[0_0_8px_#22d3ee]"
                          style={{ left: `${nowPct}%` }}
                        >
                          <span className="absolute -top-5 -translate-x-1/2 px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500 font-mono text-[9px] font-bold whitespace-nowrap">
                            TODAY (2026)
                          </span>
                        </div>
                      );
                    })()}

                    {/* Filter certificates for Gantt */}
                    {certificates
                      .filter(cert => {
                        if (timelineFilter === 'ROOT_INTERMEDIATE') {
                          return cert.type === 'ROOT_CA' || cert.type === 'INTERMEDIATE_CA';
                        }
                        if (timelineFilter === 'END_ENTITY') {
                          return cert.type !== 'ROOT_CA' && cert.type !== 'INTERMEDIATE_CA';
                        }
                        return true;
                      })
                      .map((cert) => {
                        const startHorizon = new Date('2025-01-01T00:00:00Z').getTime();
                        const endHorizon = new Date('2056-01-01T00:00:00Z').getTime();
                        const totalHorizon = endHorizon - startHorizon;

                        const certStart = new Date(cert.issuedDate).getTime();
                        const certEnd = new Date(cert.expiryDate).getTime();

                        const leftPct = Math.max(0, Math.min(100, ((certStart - startHorizon) / totalHorizon) * 100));
                        const rightPct = Math.max(0, Math.min(100, ((certEnd - startHorizon) / totalHorizon) * 100));
                        const widthPct = Math.max(2.5, rightPct - leftPct);

                        const now = Date.now();
                        const daysRemaining = Math.ceil((certEnd - now) / (1000 * 60 * 60 * 24));
                        const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 180;
                        const isRevoked = cert.status === 'REVOKED';

                        return (
                          <div 
                            key={cert.id}
                            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group cursor-pointer"
                            onClick={() => setSelectedCert(cert)}
                            onMouseEnter={() => setTimelineHoveredCert(cert)}
                            onMouseLeave={() => setTimelineHoveredCert(null)}
                          >
                            <div className="flex items-center justify-between font-mono text-xs">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  cert.type === 'ROOT_CA' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                                  cert.type === 'INTERMEDIATE_CA' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                                  'bg-slate-800 text-slate-300'
                                }`}>
                                  {cert.type.replace('_', ' ')}
                                </span>
                                <span className="font-bold text-white font-sans group-hover:text-cyan-300 transition-colors">
                                  {cert.commonName}
                                </span>
                                <span className="text-[11px] text-emerald-400 font-bold">
                                  {cert.algorithm}
                                </span>
                              </div>

                              <div className="flex items-center space-x-3 text-[11px]">
                                {isRevoked ? (
                                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                                    REVOKED ({cert.revocationReason || 'Blacklisted'})
                                  </span>
                                ) : isExpiringSoon ? (
                                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold flex items-center gap-1 animate-pulse">
                                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                                    <span>Renewal Window Open ({daysRemaining} days left)</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400">
                                    {daysRemaining > 365 ? `${Math.floor(daysRemaining / 365)}y ${daysRemaining % 365}d remaining` : `${daysRemaining} days remaining`}
                                  </span>
                                )}
                                <span className="text-slate-500 font-mono">{cert.issuedDate} &rarr; {cert.expiryDate}</span>
                              </div>
                            </div>

                            {/* Gantt Bar Track */}
                            <div className="relative w-full h-4 bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80">
                              {/* Background grid vertical lines */}
                              {[2025, 2028, 2031, 2035, 2040, 2045, 2050, 2056].map(year => {
                                const yrTime = new Date(`${year}-01-01T00:00:00Z`).getTime();
                                const pct = Math.max(0, Math.min(100, ((yrTime - startHorizon) / totalHorizon) * 100));
                                return (
                                  <div
                                    key={year}
                                    className="absolute top-0 bottom-0 w-px bg-slate-800/40"
                                    style={{ left: `${pct}%` }}
                                  />
                                );
                              })}

                              {/* Active Gantt Bar */}
                              <div
                                className={`absolute top-0 bottom-0 rounded-md transition-all duration-300 shadow-sm flex items-center justify-between px-2 ${
                                  isRevoked
                                    ? 'bg-gradient-to-r from-red-900 to-red-600 border border-red-500 opacity-70'
                                    : cert.type === 'ROOT_CA'
                                    ? 'bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 border border-purple-400/60 shadow-purple-950'
                                    : cert.type === 'INTERMEDIATE_CA'
                                    ? 'bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 border border-cyan-400/60 shadow-cyan-950'
                                    : 'bg-gradient-to-r from-teal-600 to-emerald-500 border border-emerald-400/60'
                                }`}
                                style={{
                                  left: `${leftPct}%`,
                                  width: `${widthPct}%`
                                }}
                              >
                                {widthPct > 8 && (
                                  <span className="text-[9px] font-mono font-bold text-white truncate drop-shadow">
                                    {cert.type === 'ROOT_CA' ? '20-Year Sovereign Root' : cert.type === 'INTERMEDIATE_CA' ? '10-Year CA' : '1-Year Mesh'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATE REVOCATION LIST (CRL) MANAGEMENT */}
        {activeTab === 'crl' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* CRL Distribution Point Header */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-800">
                      <ShieldAlert className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                      RFC 5280 X.509 CRL v2 Engine
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-sans">
                    Certificate Revocation List (CRL) Distribution Point
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Real-time signed certificate revocation blacklist cryptographically signed with Sovereign Root ML-DSA-87 (FIPS 204)
                  </p>
                </div>

                {/* CRL Export and Sync Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <button
                    onClick={() => handleExportCrl('pem')}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download CRL (.crl)</span>
                  </button>

                  <button
                    onClick={() => {
                      setCrlLastUpdate(new Date().toISOString());
                      setCrlNumber(prev => prev + 1);
                      showToast('CRL Cache Flushed', `CRL #${crlNumber + 1} re-signed and pushed to CDN distribution points.`, 'success');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-red-950/40 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Force Re-Sign & Push CRL</span>
                  </button>
                </div>
              </div>

              {/* CRL Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">CRL Format</span>
                  <span className="text-white text-base font-bold block">{crlVersion}</span>
                  <span className="text-emerald-400 text-[10px]">Signature: ML-DSA-87 (Level 5)</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">CRL Serial Sequence</span>
                  <span className="text-cyan-400 text-base font-bold block">0x{crlNumber.toString(16).toUpperCase().padStart(4, '0')} (#{crlNumber})</span>
                  <span className="text-slate-400 text-[10px]">Distribution: cdn.q-crypt.sec/crl</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Revoked Certificates</span>
                  <span className="text-red-400 text-base font-black block">
                    {certificates.filter(c => c.status === 'REVOKED').length} Blacklisted
                  </span>
                  <span className="text-slate-400 text-[10px]">Active Blacklist Entries</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Last CRL Update</span>
                  <span className="text-slate-200 text-xs font-bold block truncate">{crlLastUpdate.slice(0, 19).replace('T', ' ')}</span>
                  <span className="text-slate-400 text-[10px]">Next Update in 24 Hours</span>
                </div>
              </div>

              {/* CRL Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search CRL serial, CN, reason..."
                    value={crlSearchQuery}
                    onChange={(e) => setCrlSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:border-red-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  {['ALL', 'REVOKED', 'ACTIVE'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setCrlFilter(filter as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        crlFilter === filter
                          ? 'bg-red-950 text-red-300 border border-red-700 shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* CRL Interactive Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-bold">
                      <tr>
                        <th className="py-3.5 px-4">Subject Common Name</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Serial Number (Hex)</th>
                        <th className="py-3.5 px-4">PQC Algorithm</th>
                        <th className="py-3.5 px-4">CRL Status</th>
                        <th className="py-3.5 px-4">Revocation Reason</th>
                        <th className="py-3.5 px-4 text-right">CRL Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {certificates
                        .filter(cert => {
                          const matchesSearch = 
                            cert.commonName.toLowerCase().includes(crlSearchQuery.toLowerCase()) ||
                            cert.serialNumber.toLowerCase().includes(crlSearchQuery.toLowerCase()) ||
                            (cert.revocationReason || '').toLowerCase().includes(crlSearchQuery.toLowerCase());
                          const matchesFilter = 
                            crlFilter === 'ALL' || 
                            (crlFilter === 'REVOKED' && cert.status === 'REVOKED') ||
                            (crlFilter === 'ACTIVE' && cert.status === 'ACTIVE');
                          return matchesSearch && matchesFilter;
                        })
                        .map((cert) => {
                          const isRevoked = cert.status === 'REVOKED';
                          return (
                            <tr 
                              key={cert.id}
                              className={`transition-colors ${isRevoked ? 'bg-red-950/20 hover:bg-red-950/30' : 'hover:bg-slate-900/40'}`}
                            >
                              <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                                <Key className={`w-3.5 h-3.5 ${isRevoked ? 'text-red-400' : 'text-cyan-400'} shrink-0`} />
                                <span>{cert.commonName}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  cert.type === 'ROOT_CA' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                                  cert.type === 'INTERMEDIATE_CA' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                                  'bg-slate-800 text-slate-300'
                                }`}>
                                  {cert.type.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-300">
                                {cert.serialNumber}
                              </td>
                              <td className="py-3.5 px-4 text-emerald-400 font-bold">
                                {cert.algorithm}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isRevoked 
                                    ? 'bg-red-950 text-red-300 border border-red-800' 
                                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                }`}>
                                  {isRevoked ? 'REVOKED (IN CRL)' : 'ACTIVE (GOOD)'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-[11px] text-slate-400">
                                {isRevoked ? (
                                  <span className="text-red-300 font-bold">
                                    {cert.revocationReason || 'keyCompromise'} ({cert.revocationDate})
                                  </span>
                                ) : (
                                  <span className="text-slate-600">&mdash;</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {isRevoked ? (
                                  <button
                                    onClick={() => handleReinstateCertificate(cert.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-bold transition-all cursor-pointer text-[10px]"
                                    title="Remove from CRL and reinstate certificate"
                                  >
                                    Reinstate
                                  </button>
                                ) : cert.type !== 'ROOT_CA' ? (
                                  <button
                                    onClick={() => handleOpenRevokeModal(cert)}
                                    className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-bold transition-all cursor-pointer text-[10px]"
                                    title="Revoke certificate and add to CRL"
                                  >
                                    Revoke
                                  </button>
                                ) : (
                                  <span className="text-slate-600 text-[10px]">Root Protected</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ISSUE NEW POST-QUANTUM CERTIFICATE */}
        {activeTab === 'issue' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            {/* Form */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white font-sans flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Issue Post-Quantum X.509 Certificate</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Signs an authentic post-quantum certificate with the Sovereign Issuing CA (FIPS 204)
                </p>
              </div>

              <form onSubmit={handleIssueCertificate} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                    Subject Common Name (CN):
                  </label>
                  <input
                    type="text"
                    required
                    value={newCertForm.commonName}
                    onChange={(e) => setNewCertForm({ ...newCertForm, commonName: e.target.value })}
                    placeholder="e.g. gateway-node-01.mesh.sec"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                      Organization (O):
                    </label>
                    <input
                      type="text"
                      required
                      value={newCertForm.organization}
                      onChange={(e) => setNewCertForm({ ...newCertForm, organization: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                      Organizational Unit (OU):
                    </label>
                    <input
                      type="text"
                      value={newCertForm.organizationalUnit}
                      onChange={(e) => setNewCertForm({ ...newCertForm, organizationalUnit: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                    Subject Alternative Names (SANs - comma separated):
                  </label>
                  <input
                    type="text"
                    value={newCertForm.subjectAltNames}
                    onChange={(e) => setNewCertForm({ ...newCertForm, subjectAltNames: e.target.value })}
                    placeholder="e.g. node.sec, 192.168.1.100, cluster.local"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                      PQC Signature Algorithm:
                    </label>
                    <select
                      value={newCertForm.algorithm}
                      onChange={(e) => setNewCertForm({ ...newCertForm, algorithm: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                    >
                      <option value="ML-DSA-87 (FIPS 204)">ML-DSA-87 (Dilithium Level 5 - FIPS 204)</option>
                      <option value="ML-DSA-65">ML-DSA-65 (Dilithium Level 3 - High Throughput)</option>
                      <option value="Falcon-1024">Falcon-1024 (Compact Signature Envelope)</option>
                      <option value="Hybrid (Ed25519 + ML-DSA-87)">Hybrid (Ed25519 + ML-DSA-87 Dual)</option>
                      <option value="SLH-DSA (SPHINCS+)">SLH-DSA (SPHINCS+ Stateless Hash-Based)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                      Certificate Role:
                    </label>
                    <select
                      value={newCertForm.type}
                      onChange={(e) => setNewCertForm({ ...newCertForm, type: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                    >
                      <option value="GATEWAY">Enterprise Gateway / Reverse Proxy</option>
                      <option value="MESH_NODE">Sovereign Mesh Communication Node</option>
                      <option value="EXECUTIVE_ENDPOINT">Executive Enclave Device (Titan M2)</option>
                      <option value="API_SERVICE">Enterprise Microservice / API Key Vault</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                      Hardware Root of Trust:
                    </label>
                    <select
                      value={newCertForm.hsmRootOfTrust}
                      onChange={(e) => setNewCertForm({ ...newCertForm, hsmRootOfTrust: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                    >
                      <option value="Thales Luna PCIe HSM">Thales Luna PCIe HSM (FIPS 140-3 L3)</option>
                      <option value="AWS CloudHSM">AWS CloudHSM Dedicated Cluster</option>
                      <option value="Utimaco CryptoServer">Utimaco CryptoServer PQC Module</option>
                      <option value="Titan M2 / Knox StrongBox">Titan M2 / Knox StrongBox Hardware</option>
                      <option value="Software Air-Gapped Key">Software Air-Gapped Key (Testing)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                      Validity Duration:
                    </label>
                    <select
                      value={newCertForm.validityDays}
                      onChange={(e) => setNewCertForm({ ...newCertForm, validityDays: parseInt(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                    >
                      <option value="90">90 Days (Automated ACME Rotation)</option>
                      <option value="180">180 Days (Semi-Annual Audit Window)</option>
                      <option value="365">1 Year (Enterprise Standard)</option>
                      <option value="730">2 Years (High-Security Gateway)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black flex items-center space-x-2 shadow-xl shadow-cyan-950/50 cursor-pointer active:scale-95 transition-all"
                  >
                    <Key className="w-4 h-4" />
                    <span>Generate & Sign Post-Quantum Certificate</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Real-time Preview Panel */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold uppercase text-[11px]">Attestation & Spec Preview</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="space-y-2.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Signing CA:</span>
                    <span className="text-cyan-300 font-bold truncate max-w-[200px]">Q-CRYPT EU Issuing CA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Signature Standard:</span>
                    <span className="text-emerald-400 font-bold">{newCertForm.algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hardware Vault:</span>
                    <span className="text-slate-200">{newCertForm.hsmRootOfTrust}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subject:</span>
                    <span className="text-slate-200 truncate max-w-[200px]">CN={newCertForm.commonName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certificate Ext.:</span>
                    <span className="text-slate-200">X.509 v3 Post-Quantum</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 space-y-1">
                  <span className="text-slate-500 uppercase font-bold block">Cryptographic Assurance</span>
                  <p className="text-slate-400 leading-tight">
                    Immune against Shor’s algorithm and state-sponsored harvest attacks. Verified under NIST SP 800-208 & BSI TR-02102-4.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CA TRUST CHAIN & HSM HIERARCHY */}
        {activeTab === 'trust-chain' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white font-sans flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>Sovereign Post-Quantum CA Hierarchy & Root of Trust</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Three-tier isolated trust chain backed by FIPS 140-3 Level 3 Hardware Security Modules
                </p>
              </div>

              {/* Hierarchy Tree Visualizer */}
              <div className="space-y-6 font-mono text-xs">
                
                {/* Level 1: Root CA */}
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/60 shadow-xl space-y-3 relative">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/40">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black text-white">Tier 1: Q-CRYPT Global Sovereign PQC Root CA G1</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-[10px] font-bold">
                            OFFLINE AIR-GAPPED ROOT
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">ML-DSA-87 (Level 5) • Thales Luna PCIe HSM • 20-Year Horizon (2026–2046)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(INITIAL_PKI_CERTIFICATES[0].sha256Fingerprint, 'root-fp', 'Root CA Fingerprint Copied')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === 'root-fp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Root Fingerprint</span>
                    </button>
                  </div>
                </div>

                {/* Connecting Line */}
                <div className="flex justify-center -my-2">
                  <div className="w-0.5 h-6 bg-cyan-500/40" />
                </div>

                {/* Level 2: Intermediate Issuing CA */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 shadow-xl space-y-3 ml-0 sm:ml-8">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black text-white">Tier 2: Q-CRYPT EU Banking & Critical Infrastructure Issuing CA</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                            ONLINE ISSUING CA
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">ML-DSA-87 • AWS CloudHSM Multi-Region • Cross-Signed Trust Anchor</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                        CRL / OCSP Synced
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connecting Lines */}
                <div className="flex justify-center -my-2">
                  <div className="w-0.5 h-6 bg-emerald-500/40" />
                </div>

                {/* Level 3: Leaf Certificates / Endpoints */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-0 sm:ml-16">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                      <Globe className="w-4 h-4" />
                      <span>Mesh Gateways (NIS2)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Hybrid TLS 1.3 tunnels with ML-KEM-1024 key exchange and Dilithium authentication.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                      <Smartphone className="w-4 h-4" />
                      <span>Titan M2 Enclaves</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Mobile StrongBox hardware isolation for executive leadership communication keys.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
                      <Terminal className="w-4 h-4" />
                      <span>Kubernetes cert-manager</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Auto-provisioned PQC ClusterIssuer pods with 90-day automated rolling renewals.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OCSP RESPONDER & CRL */}
        {activeTab === 'ocsp' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            {/* OCSP Validator */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white font-sans flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  <span>Real-Time OCSP & CRL Attestation Engine</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Query cryptographic revocation status directly against the hardware OCSP validation authority
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1.5 uppercase text-[11px]">
                    Enter Certificate Serial Number, Common Name, or ID:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 5F:9B:3A... or lux-financial-mesh-gateway-01"
                      value={ocspSerialQuery}
                      onChange={(e) => setOcspSerialQuery(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      onClick={() => handleCheckOcsp()}
                      disabled={isCheckingOcsp}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center space-x-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isCheckingOcsp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      <span>Verify Status</span>
                    </button>
                  </div>
                </div>

                {/* Quick Selection Buttons */}
                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Quick Test Queries:</span>
                  <div className="flex flex-wrap gap-2">
                    {certificates.slice(0, 4).map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setOcspSerialQuery(c.serialNumber);
                          handleCheckOcsp(c.serialNumber);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                      >
                        {c.commonName.split('.')[0]} ({c.status})
                      </button>
                    ))}
                  </div>
                </div>

                {/* OCSP Result Box */}
                {ocspResult && (
                  <div className={`p-5 rounded-2xl border ${
                    ocspResult.status === 'GOOD'
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : ocspResult.status === 'REVOKED'
                      ? 'bg-red-950/40 border-red-500/50 text-red-200'
                      : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  } space-y-3 mt-4`}>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center space-x-2 font-bold text-sm">
                        {ocspResult.status === 'GOOD' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                        <span>OCSP STATUS: {ocspResult.status}</span>
                      </div>
                      <span className="text-[10px] opacity-80">{ocspResult.checkedAt}</span>
                    </div>

                    {ocspResult.cert && (
                      <div className="space-y-1.5 text-xs">
                        <div><span className="opacity-70">Target CN:</span> <strong className="text-white">{ocspResult.cert.commonName}</strong></div>
                        <div><span className="opacity-70">Serial:</span> <code>{ocspResult.cert.serialNumber}</code></div>
                        {ocspResult.cert.revocationReason && (
                          <div className="text-red-300 font-bold">
                            Revocation Reason: {ocspResult.cert.revocationReason} ({ocspResult.cert.revocationDate})
                          </div>
                        )}
                        <div><span className="opacity-70">Responder Signature:</span> <code className="break-all text-[10px]">{ocspResult.signature}</code></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CRL Distribution Points Info */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold uppercase text-[11px]">Distribution Endpoints</span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">OCSP Responder URL</span>
                    <code className="text-cyan-300 text-[11px]">http://ocsp.pqc.q-crypt.sec:8880</code>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">CRL Master Distribution Point</span>
                    <code className="text-emerald-300 text-[11px]">http://crl.pqc.q-crypt.sec/g1-root.crl</code>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Automated Protocol</span>
                    <span className="text-slate-200">RFC 6960 + Post-Quantum Dilithium Extension</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DEVOPS & AUTOMATION CONFIGS */}
        {activeTab === 'automation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            <div className="lg:col-span-12 space-y-6 font-mono text-xs">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">Enterprise Infrastructure & DevOps Deployment Hub</h3>
                    <p className="text-xs text-slate-400">Ready-to-use configuration files for OpenSSL 3.3+, Nginx, Envoy, and Kubernetes</p>
                  </div>
                  <Terminal className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  
                  {/* OpenSSL 3.3 Config Card */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                        <Terminal className="w-4 h-4" />
                        <span>OpenSSL 3.3+ OQS Config</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        `openssl.cnf` with oqsprovider activation for ML-DSA-87 and ML-KEM-1024 CSR generation.
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(generateOpenSslConfig(certificates[0]), 'openssl-cfg', 'OpenSSL 3.3 Configuration Copied')}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all"
                    >
                      {copiedKey === 'openssl-cfg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy openssl.cnf</span>
                    </button>
                  </div>

                  {/* Nginx PQC Reverse Proxy Card */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                        <Globe className="w-4 h-4" />
                        <span>Nginx / Envoy PQC Proxy</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Hybrid TLS 1.3 configuration with post-quantum curves and OCSP stapling directives.
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(generateNginxPqcConfig(certificates[0]), 'nginx-cfg', 'Nginx Configuration Copied')}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all"
                    >
                      {copiedKey === 'nginx-cfg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy nginx.conf</span>
                    </button>
                  </div>

                  {/* Kubernetes cert-manager Card */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                        <Layers className="w-4 h-4" />
                        <span>Kubernetes cert-manager</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        PQC ClusterIssuer and Certificate custom resource definitions for cloud mesh clusters.
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(generateKubernetesCertManagerYaml(certificates[0]), 'k8s-cfg', 'Kubernetes Manifest Copied')}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all"
                    >
                      {copiedKey === 'k8s-cfg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy cert-manager.yaml</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ENTERPRISE PKI POLICY EDITOR */}
        {activeTab === 'policy-editor' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Policy Editor Banner & Stats */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                      <Settings className="w-5 h-5 animate-pulse" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                      Enterprise PKI Policy Editor
                    </h3>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold uppercase">
                      X.509 v3 + FIPS 204 POLICY ENGINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono max-w-3xl">
                    Configure granular Object Identifier (OID) constraints, extended key usages, certificate validity periods, and namespace subtree boundaries for synthesizing sovereign Post-Quantum Root CAs.
                  </p>
                </div>

                {/* Quick Policy Metric Counters */}
                <div className="grid grid-cols-3 gap-3 font-mono text-xs shrink-0">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Active OIDs</span>
                    <span className="text-cyan-300 text-lg font-black">{activeOidCount} / {policyConfig.oids.length}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Root Validity</span>
                    <span className="text-emerald-400 text-lg font-black">{(policyConfig.validityDays / 365.25).toFixed(0)} Yrs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Path Limit</span>
                    <span className="text-purple-300 text-xs font-bold block mt-1">{policyConfig.maxPathLength}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: Root CA Validity Periods & Structural Constraints */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  <span>1. Root CA Certificate Validity & Hierarchy Rules</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  
                  {/* Validity Period Preset Selector */}
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <label className="text-xs font-mono text-slate-300 font-bold block mb-1">
                        Certificate Validity Period Preset:
                      </label>
                      <p className="text-[11px] text-slate-400 font-mono mb-3">
                        Select standard post-quantum root authority lifespan or custom duration.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                      {[
                        { id: '10_YEARS', label: '10 Years', days: 3650 },
                        { id: '20_YEARS', label: '20 Years', days: 7300 },
                        { id: '25_YEARS', label: '25 Years', days: 9125 },
                        { id: '30_YEARS', label: '30 Years', days: 10950 },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleValidityPresetChange(preset.id as any)}
                          className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                            policyConfig.validityPreset === preset.id
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950'
                              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span className="block text-sm text-white">{preset.label}</span>
                          <span className="text-[10px] text-slate-500 font-normal">{preset.days.toLocaleString()} days</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Days Input */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Custom Duration:</span>
                        <span className="text-cyan-300 font-bold">{policyConfig.validityDays} days (~{(policyConfig.validityDays / 365.25).toFixed(1)} years)</span>
                      </div>
                      <input
                        type="range"
                        min="365"
                        max="18250"
                        step="365"
                        value={policyConfig.validityDays}
                        onChange={(e) => handleValidityPresetChange('CUSTOM', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Basic Constraints & Path Length */}
                  <div className="lg:col-span-6 space-y-4 font-mono text-xs border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                    
                    <div className="space-y-2">
                      <label className="text-slate-300 font-bold block">
                        Basic Constraints (X.509 v3):
                      </label>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <label className="flex items-center space-x-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyConfig.enforceCriticalBasicConstraints}
                            onChange={(e) => setPolicyConfig(prev => ({ ...prev, enforceCriticalBasicConstraints: e.target.checked }))}
                            className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
                          />
                          <span className="text-slate-200">Enforce <code className="text-cyan-300">critical, CA:TRUE</code></span>
                        </label>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Rejects any certificate signing operations by subordinate leaf entities that do not hold authorized CA flags.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Max Path Length:
                        </label>
                        <select
                          value={policyConfig.maxPathLength}
                          onChange={(e) => setPolicyConfig(prev => ({ ...prev, maxPathLength: e.target.value as any }))}
                          className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                        >
                          <option value="UNLIMITED">Unlimited (Default)</option>
                          <option value="0">pathlen: 0 (Direct leaf only)</option>
                          <option value="1">pathlen: 1 (1 Intermediate CA)</option>
                          <option value="2">pathlen: 2 (2 Intermediates)</option>
                          <option value="3">pathlen: 3 (3 Intermediates)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Backdate Offset:
                        </label>
                        <select
                          value={policyConfig.backdateOffsetMinutes}
                          onChange={(e) => setPolicyConfig(prev => ({ ...prev, backdateOffsetMinutes: parseInt(e.target.value) }))}
                          className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                        >
                          <option value="0">0 minutes (Exact UTC)</option>
                          <option value="5">5 minutes (Clock Skew Tolerance)</option>
                          <option value="10">10 minutes (Recommended)</option>
                          <option value="30">30 minutes (Broad Enclave Mesh)</option>
                        </select>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Subtree Name Constraints */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Permitted Subtree Name Constraints (DNS Domains):</span>
                  </span>
                  <span className="text-slate-500 text-[10px]">Restricts issuing scope strictly to sovereign infrastructure</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {policyConfig.permittedDnsDomains.map((domain) => (
                      <span
                        key={domain}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 text-[11px] font-bold font-mono"
                      >
                        <span>permitted;DNS:{domain}</span>
                        <button
                          onClick={() => handleRemovePermittedSubtree(domain)}
                          className="text-cyan-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Remove domain restriction"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-900">
                    <input
                      type="text"
                      placeholder="Add permitted DNS domain (e.g., .sovereign.sec)"
                      value={newSubtreeDomain}
                      onChange={(e) => setNewSubtreeDomain(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPermittedSubtree()}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      onClick={handleAddPermittedSubtree}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold font-mono text-xs transition-colors cursor-pointer"
                    >
                      Add Subtree
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Interactive OID (Object Identifier) Constraint Matrix */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <Bookmark className="w-4 h-4" />
                      <span>2. Object Identifier (OID) Extension Constraints Matrix</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Toggle specific standard and custom Post-Quantum OIDs to embed into the X.509 v3 root extension catalog.
                    </p>
                  </div>

                  {/* Search & Category Filter */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search OID name or standard..."
                        value={oidSearchQuery}
                        onChange={(e) => setOidSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {[
                        { id: 'ALL', label: 'All' },
                        { id: 'EXTENDED_KEY_USAGE', label: 'EKU' },
                        { id: 'PQC_CUSTOM', label: 'PQC Custom' },
                        { id: 'CERTIFICATE_POLICIES', label: 'Policies' },
                        { id: 'BASIC_CONSTRAINTS', label: 'Core' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedOidCategory(cat.id)}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            selectedOidCategory === cat.id
                              ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* OID Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOids.map((oid) => (
                    <div
                      key={oid.id}
                      className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                        oid.enabled
                          ? 'bg-slate-950 border-cyan-500/50 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/50 border-slate-800/80 opacity-70 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              oid.category === 'PQC_CUSTOM' 
                                ? 'bg-purple-950 text-purple-300 border-purple-800'
                                : oid.category === 'EXTENDED_KEY_USAGE'
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}>
                              {oid.category.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {oid.standard}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white font-sans">
                            {oid.name}
                          </h4>
                        </div>

                        {/* Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleOid(oid.id)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                            oid.enabled
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                          }`}
                          title={oid.enabled ? 'Disable OID Constraint' : 'Enable OID Constraint'}
                        >
                          {oid.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                        </button>
                      </div>

                      {/* Numeric OID with Copy */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs">
                        <span className="text-cyan-300 font-bold text-[11px] truncate">
                          OID: {oid.oid}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(oid.oid, oid.id, `Copied OID ${oid.oid}`)}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer transition-colors ml-2 shrink-0"
                          title="Copy OID numerical string"
                        >
                          {copiedKey === oid.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {oid.description}
                      </p>

                      {/* Critical Toggle Footer */}
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono">
                        <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={oid.critical}
                            disabled={!oid.enabled}
                            onChange={() => handleToggleOidCritical(oid.id)}
                            className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer disabled:opacity-40"
                          />
                          <span>Mark as Critical Constraint</span>
                        </label>
                        <span className={`text-[10px] font-bold ${oid.enabled ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {oid.enabled ? 'ACTIVE IN POLICY' : 'DISABLED'}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: Post-Quantum Root CA Generator from Active Policy */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Synthesize Sovereign Root CA from Active Policy</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800">
                  
                  {/* CA Parameters Form */}
                  <div className="lg:col-span-6 space-y-4 font-mono text-xs">
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">
                        Root CA Common Name (CN):
                      </label>
                      <input
                        type="text"
                        value={rootCaForm.commonName}
                        onChange={(e) => setRootCaForm(prev => ({ ...prev, commonName: e.target.value }))}
                        placeholder="e.g. Q-CRYPT Global Sovereign Post-Quantum Root CA G2"
                        className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-bold block">
                          Organization (O):
                        </label>
                        <input
                          type="text"
                          value={rootCaForm.organization}
                          onChange={(e) => setRootCaForm(prev => ({ ...prev, organization: e.target.value }))}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-bold block">
                          Organizational Unit (OU):
                        </label>
                        <input
                          type="text"
                          value={rootCaForm.organizationalUnit}
                          onChange={(e) => setRootCaForm(prev => ({ ...prev, organizationalUnit: e.target.value }))}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-bold block">
                          PQC Signature Algorithm:
                        </label>
                        <select
                          value={rootCaForm.algorithm}
                          onChange={(e) => setRootCaForm(prev => ({ ...prev, algorithm: e.target.value as any }))}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                        >
                          <option value="ML-DSA-87 (FIPS 204)">ML-DSA-87 (FIPS 204 Level-5 Root)</option>
                          <option value="ML-DSA-65">ML-DSA-65 (FIPS 204 Level-3 Root)</option>
                          <option value="Falcon-1024">Falcon-1024 (Compact Fast Verification)</option>
                          <option value="Hybrid (Ed25519 + ML-DSA-87)">Hybrid (Ed25519 + ML-DSA-87 Composite)</option>
                          <option value="SLH-DSA (SPHINCS+)">SLH-DSA SPHINCS+ (State-Free Hash Root)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-300 font-bold block">
                          Hardware Root of Trust (HSM):
                        </label>
                        <select
                          value={rootCaForm.hsmRootOfTrust}
                          onChange={(e) => setRootCaForm(prev => ({ ...prev, hsmRootOfTrust: e.target.value as any }))}
                          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                        >
                          <option value="Nitrokey NetHSM">Nitrokey NetHSM (Open-Source FIPS Slot)</option>
                          <option value="Thales Luna PCIe HSM">Thales Luna PCIe HSM (FIPS 140-3 Level 3)</option>
                          <option value="AWS CloudHSM">AWS CloudHSM (Dedicated Enclave)</option>
                          <option value="Utimaco CryptoServer">Utimaco CryptoServer (Banking Grade)</option>
                          <option value="Titan M2 / Knox StrongBox">Titan M2 / Knox StrongBox (Silicon Root)</option>
                          <option value="Software Air-Gapped Key">Software Air-Gapped Key (Cold Ceremony)</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        disabled={isGeneratingRootCa}
                        onClick={handleGenerateRootCaFromPolicy}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                      >
                        <Key className={`w-4 h-4 ${isGeneratingRootCa ? 'animate-spin' : ''}`} />
                        <span>{isGeneratingRootCa ? 'Synthesizing HSM Key...' : 'Generate Post-Quantum Root CA'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportOpensslPolicyConfig}
                        className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-cyan-400" />
                        <span>Export OpenSSL .cnf</span>
                      </button>
                    </div>

                  </div>

                  {/* Live OpenSSL Policy Configuration Preview */}
                  <div className="lg:col-span-6 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-white flex items-center space-x-1.5">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Generated OpenSSL 3.3+ Policy Specification:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(generateOpensslPolicyConfig(policyConfig, rootCaForm), 'openssl-policy-cnf', 'OpenSSL Policy Copied')}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedKey === 'openssl-policy-cnf' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy .cnf</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-mono overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed select-all">
                      {generateOpensslPolicyConfig(policyConfig, rootCaForm)}
                    </pre>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* CERTIFICATE INSPECTION MODAL */}

      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 relative overflow-hidden font-sans space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">{selectedCert.commonName}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Serial: {selectedCert.serialNumber}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Algorithm</span>
                  <span className="text-emerald-400 font-bold">{selectedCert.algorithm}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Status</span>
                  <span className={`font-bold ${selectedCert.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedCert.status}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Issued By</span>
                  <span className="text-cyan-300 font-bold truncate block">{selectedCert.issuerName}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Hardware Root of Trust</span>
                  <span className="text-slate-200 font-bold">{selectedCert.hsmRootOfTrust}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">SHA-256 Fingerprint</span>
                <code className="text-[10px] text-cyan-300 break-all">{selectedCert.sha256Fingerprint}</code>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">X.509 Post-Quantum PEM Certificate</span>
                  <button
                    onClick={() => handleCopy(selectedCert.pemCertificate, 'cert-pem', 'Certificate PEM copied')}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold cursor-pointer"
                  >
                    {copiedKey === 'cert-pem' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy PEM</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-[10px] text-slate-300 font-mono overflow-x-auto max-h-36 select-all border border-slate-800">
                  {selectedCert.pemCertificate}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const blob = new Blob([selectedCert.pemCertificate], { type: 'application/x-pem-file' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedCert.id}.crt`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast('Downloaded', `Exported ${selectedCert.id}.crt`, 'success');
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .CRT</span>
              </button>

              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CERTIFICATE REVOCATION CONFIRMATION MODAL */}
      {isRevokeModalOpen && certToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-red-500/50 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 relative overflow-hidden font-sans space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">Revoke PQC Certificate</h3>
                  <p className="text-xs text-red-300 font-mono mt-0.5">Publish to Signed CRL (RFC 5280 / FIPS 204)</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsRevokeModalOpen(false);
                  setCertToRevoke(null);
                }}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Subject:</span>
                <span className="text-white font-bold">{certToRevoke.commonName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Serial:</span>
                <span className="text-cyan-300 font-bold">{certToRevoke.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Algorithm:</span>
                <span className="text-emerald-400 font-bold">{certToRevoke.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Root of Trust:</span>
                <span className="text-slate-300">{certToRevoke.hsmRootOfTrust}</span>
              </div>
            </div>

            {/* RFC 5280 Reason Code Selection */}
            <div className="space-y-3 font-mono text-xs">
              <label className="text-slate-300 font-bold block uppercase text-[11px]">
                RFC 5280 Revocation Reason Code:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { code: 'keyCompromise', label: 'keyCompromise', desc: 'Private key compromised' },
                  { code: 'cACompromise', label: 'cACompromise', desc: 'Issuing CA key compromised' },
                  { code: 'affiliationChanged', label: 'affiliationChanged', desc: 'Subject role/org changed' },
                  { code: 'superseded', label: 'superseded', desc: 'Replaced by rotated key' },
                  { code: 'cessationOfOperation', label: 'cessationOfOperation', desc: 'Service decommissioned' },
                  { code: 'certificateHold', label: 'certificateHold', desc: 'Temporary security suspension' }
                ].map((reason) => (
                  <button
                    type="button"
                    key={reason.code}
                    onClick={() => setRevocationReasonCode(reason.code)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      revocationReasonCode === reason.code
                        ? 'bg-red-950/60 border-red-500 text-white shadow-sm shadow-red-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{reason.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{reason.desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1 uppercase text-[11px]">
                  Incident Reference Note / Audit Ticket:
                </label>
                <input
                  type="text"
                  value={revocationComment}
                  onChange={(e) => setRevocationComment(e.target.value)}
                  placeholder="e.g. SEC-INCIDENT-8921 / Emergency automated containment"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-red-500 focus:outline-none text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsRevokeModalOpen(false);
                  setCertToRevoke(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRevocation}
                className="px-5 py-2.5 rounded-xl text-xs font-mono bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black flex items-center space-x-1.5 shadow-lg shadow-red-950/50 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Confirm Revocation &amp; Sign CRL</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
