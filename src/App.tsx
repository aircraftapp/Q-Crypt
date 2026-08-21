import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Hero } from './components/Hero';
import { FirebaseVerifiedSummary } from './components/FirebaseVerifiedSummary';
import { FirebasePqcDatabasePortal } from './components/FirebasePqcDatabasePortal';
import { ApkDownloadPortal } from './components/ApkDownloadPortal';
import { AppFeatureShowcase } from './components/AppFeatureShowcase';
import { SecurityComparisonTable } from './components/SecurityComparisonTable';
import { HardwareCompatibility } from './components/HardwareCompatibility';
import { TrustAndBuyerValue } from './components/TrustAndBuyerValue';
import { SecurityAuditStatus } from './components/SecurityAuditStatus';
import { AcademicAffiliations } from './components/AcademicAffiliations';
import { PqcCodeAndDeveloperResources } from './components/PqcCodeAndDeveloperResources';
import { QuantumReadinessCalculator } from './components/QuantumReadinessCalculator';
import { GlobalNetworkMap } from './components/GlobalNetworkMap';
import { EnterpriseTrialPortal } from './components/EnterpriseTrialPortal';
import { InvestorRelations } from './components/InvestorRelations';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/Toast';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { GoldenRetrieverProvider } from './context/GoldenRetrieverContext';
import { WhitepaperModal } from './components/WhitepaperModal';
import { CrmAdminPortal } from './components/CrmAdminPortal';
import { RealtimeTransparencyDashboard } from './components/RealtimeTransparencyDashboard';
import { PublicVerificationPortal } from './components/PublicVerificationPortal';
import { RealTimeTransparencyLedger } from './components/RealTimeTransparencyLedger';
import { AuditTrail } from './components/AuditTrail';
import { PqcTerminologySection } from './components/PqcTerminologySection';
import { QuantumClocksDashboard } from './components/QuantumClocksDashboard';
import { AnssiNis2FranceSection } from './components/AnssiNis2FranceSection';
import { EnterprisePkiSection } from './components/EnterprisePkiSection';
import { HardwareSecurityModule } from './components/HardwareSecurityModule';
import { QuantumMessengerChatPreview } from './components/QuantumMessengerChatPreview';
import { AnonymizedRouting } from './components/AnonymizedRouting';
import { HsmHardwareAttestation } from './components/HsmHardwareAttestation';
import { LatticeVsClassicalSection } from './components/LatticeVsClassicalSection';
import { CompetitiveSecurityMatrix } from './components/CompetitiveSecurityMatrix';
import { QuantumThreatModeling } from './components/QuantumThreatModeling';

const sectionVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function App() {
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
  const [isCrmAdminOpen, setIsCrmAdminOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      if (isCmdOrCtrl && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCrmAdminOpen((prev) => !prev);
      } else if (isCmdOrCtrl && (e.key === 'w' || e.key === 'W')) {
        e.preventDefault();
        setIsWhitepaperOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsWhitepaperOpen(false);
        setIsCrmAdminOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <GoldenRetrieverProvider>
            <ScrollProgressBar />
          <div className="min-h-screen bg-[#0A0F1B] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
            <Navbar 
              onNavigate={handleNavigate} 
              onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
              onOpenCrmAdmin={() => setIsCrmAdminOpen(true)}
            />
            <main>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <Hero 
                  onNavigate={handleNavigate} 
                  onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
                />
              </motion.div>

              {/* Verified Firebase Real-Time Transparency Summary Counters */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <FirebaseVerifiedSummary
                  onNavigateToEnterprise={() => handleNavigate('enterprise-portal')}
                  onNavigateToApk={() => handleNavigate('apk-portal')}
                />
              </motion.div>

              {/* Real-Time D3 Telemetry Dashboard: Active Protected Devices & Enclave Health */}
              <motion.div
                className="py-6 bg-slate-950 border-b border-slate-900"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <RealtimeTransparencyDashboard />
                </div>
              </motion.div>

              {/* Firebase Firestore PQC Security Database Portal */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <FirebasePqcDatabasePortal />
              </motion.div>

              {/* Public Verification Portal (Session Protection Verification & Proof) */}
              <motion.div
                className="py-6 bg-slate-950 border-b border-slate-900"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <PublicVerificationPortal />
                </div>
              </motion.div>

              {/* Real-Time Immutable Transparency Ledger (Encrypted Sessions & Handshakes) */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <RealTimeTransparencyLedger />
              </motion.div>

              {/* Free P2P Community Edition Download Portal */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <ApkDownloadPortal />
              </motion.div>

              {/* Interactive Quantum Messenger Mobile Chat: Drag-and-Drop File Sharing & Anti-Forensics */}
              <motion.div
                id="interactive-chat-preview"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <QuantumMessengerChatPreview />
                </div>
              </motion.div>

              {/* Feature Showcase (Free P2P vs Enterprise MDM) */}
              <motion.div 
                id="app-showcase"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <AppFeatureShowcase />
              </motion.div>

              {/* Competitive Security Matrix: Q-CRYPT vs Signal vs Telegram vs WhatsApp */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <CompetitiveSecurityMatrix />
              </motion.div>

              {/* Security Comparison Table */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <SecurityComparisonTable />
              </motion.div>

              {/* Quantum Threat Modeling: Real-Time Time-to-Crack Estimation & Lattice Hardness */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <QuantumThreatModeling />
              </motion.div>

              {/* Lattice-Based Cryptography (NIST FIPS 203/204) vs. Classical RSA/ECC */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <LatticeVsClassicalSection />
              </motion.div>

              {/* Real-time Quantum Security Threat Map & Active Encrypted Tunnels */}
              <motion.div 
                id="threat-map" 
                className="py-12 bg-slate-950 border-b border-slate-900"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <GlobalNetworkMap />
                </div>
              </motion.div>

              {/* Anonymized Multi-Hop Quantum Mixnet Routing */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <AnonymizedRouting />
              </motion.div>

              {/* High-Precision Quantum Clocks, Mosca's Law Countdown & Multi-Timezone Command Nodes */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <QuantumClocksDashboard />
              </motion.div>

              {/* ANSSI, Loi de Programmation Militaire (LPM 2024-2030) & Directive NIS2 European Compliance Section */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <AnssiNis2FranceSection />
              </motion.div>

              {/* Third-Party Security Audit & Certification Status */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <SecurityAuditStatus />
              </motion.div>

              {/* Enterprise Post-Quantum PKI & Certificate Lifecycle Manager */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <EnterprisePkiSection />
              </motion.div>

              {/* FIPS 140-3 Hardware Security Module & Real-Time Enclave Telemetry */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <HardwareSecurityModule />
              </motion.div>

              {/* FIPS 140-3 HSM Hardware Attestation & Remote Verification */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <HsmHardwareAttestation />
              </motion.div>

              {/* 10 Security Audits Trail & Technical Verification Reports */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <AuditTrail />
              </motion.div>

              {/* Academic Affiliations & Security Expert Perspectives */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <AcademicAffiliations />
              </motion.div>

              {/* Low-Level C/C++, Assembly & PQC Developer Resources Engine */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <PqcCodeAndDeveloperResources />
              </motion.div>

              {/* Interactive PQC Terminology (FIPS 203 & 204) Section in English & French */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <PqcTerminologySection />
              </motion.div>

              {/* Value Props & Hardware Enclave Support */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <TrustAndBuyerValue />
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <HardwareCompatibility />
              </motion.div>

              {/* Organizational Quantum Readiness Calculator */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <QuantumReadinessCalculator />
              </motion.div>

              {/* Enterprise & Organization Inquiry Portal */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <EnterpriseTrialPortal />
              </motion.div>

              {/* Investor Relations & FAQ */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <InvestorRelations />
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={sectionVariants}
              >
                <FaqSection />
              </motion.div>
            </main>
            <Footer 
              onNavigate={handleNavigate} 
              onOpenCrmAdmin={() => setIsCrmAdminOpen(true)}
            />

            {/* Post-Quantum Security Whitepaper Modal */}
            <WhitepaperModal
              isOpen={isWhitepaperOpen}
              onClose={() => setIsWhitepaperOpen(false)}
            />

            {/* Firestore CRM Admin Lead Portal */}
            <CrmAdminPortal
              isOpen={isCrmAdminOpen}
              onClose={() => setIsCrmAdminOpen(false)}
            />
          </div>
        </GoldenRetrieverProvider>
      </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}


