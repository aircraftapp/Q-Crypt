import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FaqSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
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

  const filteredFaqs = faqs.filter(
    item => item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('faq.tag') || 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('faq.title') || 'Post-Quantum Security FAQ'}
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            {t('faq.subtitle') || 'Clear answers to common questions about quantum-resistant cryptography, hardware enclaves, and mobile privacy.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. NIST, hardware, P2P, battery)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
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
                      <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 mr-2">
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
                        <span>Cryptographically Verified Specification</span>
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

