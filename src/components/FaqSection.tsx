import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  FileText, 
  Sparkles, 
  Zap, 
  Smartphone,
  Flame,
  KeyRound,
  EyeOff
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FaqSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'hsm-vs-software' | 'quantum-threats' | 'architecture'>('all');

  const faqs = [
    // HSM vs Software Storage Dedicated Section Items
    {
      category: 'HSM vs Software Storage',
      q: 'What is the difference between Hardware Security Modules (HSM) and Software-based key storage?',
      a: 'Hardware Security Modules (HSM / Google Titan M2 / Samsung Knox StrongBox / Apple Secure Enclave) isolate private keys inside a dedicated, physical silicon die with active micro-wire tamper meshes and independent power/clock circuitry. Software-based storage (such as default OS Keystore, application sandbox files, or OpenSSL key files) stores keys in shared application memory or encrypted filesystem blocks. In software storage, any root exploit, kernel privilege escalation, memory scraping tool, or debugging bridge can dump keys in plaintext. With hardware enclaves, keys are marked NEVER_EXTRACTABLE and cryptographic operations occur strictly inside the isolated silicon boundary.'
    },
    {
      category: 'HSM vs Software Storage',
      q: 'Why is software-based key storage vulnerable to cold-boot attacks and root escalation?',
      a: 'When an app performs cryptographic operations using software storage, decrypted key material temporarily resides in device RAM (Random Access Memory). Attackers with root access, physical memory bus sniffers, or cold-boot liquid-nitrogen techniques can dump physical RAM and recover classical RSA, ECC, and lattice session keys. In contrast, an HSM has dedicated battery-backed SRAM with instantaneous 2.4-microsecond zeroization circuitry that shreds memory upon physical intrusion or unauthorized memory access.'
    },
    {
      category: 'HSM vs Software Storage',
      q: 'How does Q-CRYPT protect against side-channel and laser fault injection attacks?',
      a: 'FIPS 140-3 Level 3 & Level 4 certified HSMs integrate physical Differential Power Analysis (DPA) shielding, clock jitter randomization, optical laser sensors, and thermal panic shutdown triggers (75°C). If an adversary decapsulates the chip or attempts laser glitching to induce cryptographic bit flips, the hardware enclave interlocks instantly trigger an irreversible key wipe.'
    },
    {
      category: 'End-User Recommendations',
      q: 'What are the recommended device configurations for end-users deploying Q-CRYPT?',
      a: 'For maximum security, we recommend: (1) Ensure your smartphone contains a dedicated hardware enclave (e.g., Google Pixel 6+ with Titan M2, Samsung Galaxy S21+ with Knox Vault, or modern flagship devices); (2) Disable Android Developer Options and USB Debugging (ADB) to eliminate host side-channel access; (3) Set Biometric Authentication Lockout to 3–5 attempts; (4) Enable strict ARMv9 Memory Tagging Extension (MTE) in device settings; (5) Configure Q-CRYPT’s Duress PIN to safeguard data under physical coercion.'
    },
    {
      category: 'End-User Recommendations',
      q: 'Can I use Q-CRYPT if my phone does not have a dedicated StrongBox chip?',
      a: 'Yes. Q-CRYPT automatically falls back to ARM TrustZone TEE (Trusted Execution Environment) hardware isolation. While StrongBox offers Level 4 physical tamper mesh protection, ARM TrustZone TEE provides robust hardware isolation that prevents OS-level malware and standard userland root exploits from accessing your post-quantum lattice keys.'
    },
    {
      category: 'PoC Technology',
      q: 'What is Push-to-Talk over Cellular (PoC) and how does Q-CRYPT make it Post-Quantum Secure?',
      a: 'PoC (Push-to-Talk over Cellular) is an intelligent trunked communication service based on 4G/5G cellular networks that overcomes distance limits of traditional two-way radios, enabling "one-touch" instant voice, video, dispatch, and track playback globally. Q-CRYPT makes PoC post-quantum secure (PQ-PoC) by encapsulating all IP voice bursts and telemetry data with NIST FIPS 203 (ML-KEM-1024) lattice cryptography and hardware enclave keys, providing complete immunity against quantum "Harvest Now, Decrypt Later" eavesdropping.'
    },
    {
      category: 'Quantum Threats',
      q: t('faq.q1') || 'What is Post-Quantum Cryptography (PQC), and why do I need it today?',
      a: t('faq.a1') || 'Post-Quantum Cryptography uses advanced lattice-based mathematical algorithms (like NIST FIPS 203 ML-KEM) that quantum computers cannot solve. You need it today because state-sponsored adversaries actively practice "Harvest Now, Decrypt Later" (HNDL)—intercepting and storing encrypted communications now to decrypt them once quantum computers mature.'
    },
    {
      category: 'NIST Standards',
      q: t('faq.q2') || 'What is NIST FIPS 203 (ML-KEM-1024) and FIPS 204 (ML-DSA-87)?',
      a: t('faq.a2') || 'These are the official post-quantum standards published by NIST in August 2024. ML-KEM-1024 (formerly Kyber) handles key encapsulation with Category 5 (256-bit quantum) security, while ML-DSA-87 (formerly Dilithium) provides quantum-safe digital signatures for identity authentication.'
    },
    {
      category: 'Architecture',
      q: t('faq.q3') || 'Does Q-CRYPT rely on central servers to route or process messages?',
      a: t('faq.a3') || 'No. The Free Community Edition operates 100% serverless using direct peer-to-peer (P2P) connections and local mesh relays. In the Enterprise Edition, organizations can run private sovereign relays with full zero-knowledge end-to-end key isolation.'
    },
    {
      category: 'Hardware Security',
      q: t('faq.q4') || 'How are my encryption keys protected on my smartphone?',
      a: t('faq.a4') || 'Private keys are generated and bound inside your phone\'s isolated Hardware Security Module (HSM)—such as Google Titan M2, Samsung Knox, or ARM TrustZone TEE. Keys never leave the hardware enclave in plaintext and cannot be extracted even if root access is gained.'
    },
    {
      category: 'Performance',
      q: t('faq.q5') || 'Does post-quantum encryption slow down messaging or drain battery?',
      a: t('faq.a5') || 'No. Q-CRYPT uses C/C++ native ARMv8/v9 SIMD assembly acceleration for lattice operations. Encapsulating a post-quantum session key takes under 2 milliseconds, resulting in instantaneous transmission with zero noticeable impact on battery life.'
    },
    {
      category: 'Privacy & Coercion',
      q: t('faq.q6') || 'What happens under coercion or if someone forces me to unlock my phone?',
      a: t('faq.a6') || 'Q-CRYPT includes Steganographic Camouflage and a Stealth Duress PIN. Entering your configured Duress PIN unlocks a convincing decoy environment while instantly zeroizing and wiping the real hardware keys from memory.'
    },
    {
      category: 'Contact Discovery',
      q: t('faq.q7') || 'How does Q-CRYPT protect my contact book from metadata harvesting?',
      a: t('faq.a7') || 'Q-CRYPT uses Private Information Retrieval (PIR) and zero-knowledge mathematical proofs to discover peers. Your phone book is never uploaded to any server or shared with external parties.'
    },
    {
      category: 'Editions & Licensing',
      q: t('faq.q8') || 'How does the Enterprise Edition differ from the Free Community Edition?',
      a: t('faq.a8') || 'Both editions feature the identical NIST FIPS 203 quantum encryption engine. The Enterprise Edition adds central Mobile Device Management (MDM) fleet integration (Intune/Knox), remote wipe capabilities, automated KMS key rotation schedules, and private cloud deployment options.'
    }
  ];

  const filteredFaqs = faqs.filter(item => {
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'hsm-vs-software') {
      return matchesSearch && (item.category === 'HSM vs Software Storage' || item.category === 'End-User Recommendations');
    }
    if (activeTab === 'quantum-threats') {
      return matchesSearch && (item.category === 'Quantum Threats' || item.category === 'NIST Standards');
    }
    if (activeTab === 'architecture') {
      return matchesSearch && (item.category === 'Architecture' || item.category === 'Performance' || item.category === 'PoC Technology');
    }
    return matchesSearch;
  });

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('faq.tag') || 'Frequently Asked Questions & Technical Reference'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('faq.title') || 'Post-Quantum Security & Hardware FAQ'}
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            {t('faq.subtitle') || 'Comprehensive technical answers comparing dedicated Hardware Security Modules (HSM) vs software-based storage, quantum threat mitigation, and end-user best practices.'}
          </p>
        </div>

        {/* FEATURED COMPARISON SECTION: Hardware Security Module (HSM) vs. Software-Based Storage */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-8 backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 text-[11px] font-mono font-bold">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>ARCHITECTURAL DEEP-DIVE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                Hardware Security Modules (HSM) vs. Software-Based Key Storage
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Why cryptographic algorithms are only as strong as the physical substrate safeguarding their private keys.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0 font-mono text-xs">
              <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>NIST FIPS 140-3 Level 3/4 Verified</span>
              </span>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* HSM Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-950 border border-cyan-500/40 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-sans text-base">
                      Hardware Security Module (HSM / Enclave)
                    </h4>
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                      Titan M2 • Knox StrongBox • ARM TrustZone
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  RECOMMENDED
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Keys are generated in isolated physical silicon die circuitry. Cryptographic operations (ML-KEM decapsulation, ML-DSA signing) occur inside the enclave. Private keys are mathematically locked and marked <code className="text-cyan-300 font-mono">NEVER_EXTRACTABLE</code>.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Physical micro-wire tamper mesh active</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Immune to OS root / kernel memory dumping</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant 2.4µs crowbar anti-tamper zeroization</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DPA & laser fault injection interlocks</span>
                </div>
              </div>
            </div>

            {/* Software Storage Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-red-950/20 to-slate-950 border border-red-900/40 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-sans text-base">
                      Software-Based Storage
                    </h4>
                    <span className="text-[11px] font-mono text-red-400 font-semibold">
                      App Sandbox • SQLite DB • File Keystore
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                  HIGH RISK
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Keys reside in filesystem storage blocks or shared system RAM during computation. Susceptible to privilege escalation, debug bridge exploitation, background spyware memory reading, and cold-boot physical DRAM extraction.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
                <div className="flex items-center space-x-2 text-red-300">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>No physical tamper detection or micro-wire mesh</span>
                </div>
                <div className="flex items-center space-x-2 text-red-300">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Exposed to root privilege escalation & ADB dumps</span>
                </div>
                <div className="flex items-center space-x-2 text-red-300">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Cannot survive liquid nitrogen cold-boot memory reading</span>
                </div>
                <div className="flex items-center space-x-2 text-red-300">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Vulnerable to differential power analysis (DPA)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Side-by-Side Comparison Matrix Table */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-2">
              <span className="text-sm font-sans flex items-center space-x-2 text-white">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Feature Comparison Matrix: HSM vs Software Storage</span>
              </span>
              <span className="text-[11px] text-cyan-400">NIST SP 800-133 Compliance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Security Metric</th>
                    <th className="py-2.5 px-3 text-cyan-400">Hardware Security Module (HSM)</th>
                    <th className="py-2.5 px-3 text-slate-400">Software Keystore / App Sandbox</th>
                    <th className="py-2.5 px-3 text-right">Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  <tr>
                    <td className="py-2.5 px-3 text-white font-semibold">Key Extractability</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">NEVER EXTRACTABLE (Silicon Fused)</td>
                    <td className="py-2.5 px-3 text-red-400">Extractable via root memory / /proc</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">HSM +100%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-white font-semibold">Root / Jailbreak Immunity</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">100% Immune (Enclave Boundary)</td>
                    <td className="py-2.5 px-3 text-red-400">Vulnerable (Zero Isolation)</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">HSM +100%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-white font-semibold">Cold Boot RAM Attacks</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">Protected (Dedicated SRAM)</td>
                    <td className="py-2.5 px-3 text-red-400">Vulnerable (Resides in Host DRAM)</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">HSM +100%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-white font-semibold">Anti-Tamper Zeroization</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">2.4 µs Hardware Discharge Flush</td>
                    <td className="py-2.5 px-3 text-slate-500">None (Passive File Deletion)</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">HSM +100%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-white font-semibold">True Random Number Generation</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">Zener Avalanche Noise TRNG (7.998 bits/byte)</td>
                    <td className="py-2.5 px-3 text-amber-400">Software Pseudo-RNG (/dev/urandom)</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">HSM +100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CLEAR END-USER RECOMMENDATIONS ACTION BOX */}
          <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-700/60 space-y-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm font-sans">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Clear End-User Recommendations & Action Checklist</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold flex items-center space-x-1.5 font-sans">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. Use HSM-Equipped Devices</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  Prefer Google Pixel (Titan M2), Samsung Galaxy (Knox Vault StrongBox), or modern flagship devices certified for FIPS 140-3 enclaves.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold flex items-center space-x-1.5 font-sans">
                  <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                  <span>2. Disable USB Debugging</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  Disable Android Developer Options and ADB to close host-level side-channel access vectors and hardware interception attempts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold flex items-center space-x-1.5 font-sans">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. Enforce Lockout & PIN</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  Configure biometric lockout to ≤3 attempts and activate Q-CRYPT's Stealth Duress PIN for instantaneous zeroization under coercion.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Filter Category Tabs & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                All Topics ({faqs.length})
              </button>
              <button
                onClick={() => setActiveTab('hsm-vs-software')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'hsm-vs-software'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-900 text-cyan-400 border-cyan-900 hover:bg-slate-800'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>HSM vs Software ({faqs.filter(f => f.category === 'HSM vs Software Storage' || f.category === 'End-User Recommendations').length})</span>
              </button>
              <button
                onClick={() => setActiveTab('quantum-threats')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'quantum-threats'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Quantum Threats & NIST
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Architecture & Performance
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQ questions..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs font-mono">
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 sm:p-6 flex justify-between items-center space-x-4 hover:bg-slate-900/90 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border mr-2 ${
                        faq.category === 'HSM vs Software Storage' || faq.category === 'End-User Recommendations'
                          ? 'text-cyan-300 bg-cyan-950 border-cyan-700'
                          : 'text-slate-300 bg-slate-800 border-slate-700'
                      }`}>
                        {faq.category}
                      </span>
                      <span className="font-bold text-sm sm:text-base text-white block">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 font-sans space-y-2">
                      <p>{faq.a}</p>
                      <div className="pt-2 flex items-center space-x-2 text-[10px] font-mono text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>NIST FIPS 140-3 &amp; Post-Quantum Verified Specification</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

