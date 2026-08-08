import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'fr' | 'de' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  label: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', label: 'EN - English' },
  { code: 'fr', name: 'French', label: 'FR - French' },
  { code: 'de', name: 'German', label: 'DE - German' },
  { code: 'es', name: 'Spanish', label: 'ES - Spanish' },
];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  detectedRegion: string;
  isAutoDetected: boolean;
  t: (key: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navbar & Banners
    'nav.threat': 'Threat Feed',
    'nav.cti': 'CTI Intelligence',
    'nav.pqc': 'PQC Math Spec',
    'nav.features': 'Features',
    'nav.whitepaper': 'PQC Whitepaper',
    'nav.crmAdmin': 'CRM Admin',
    'nav.apk': 'Register for APK',
    'nav.keyDemo': 'Quantum Demo',
    'nav.comparison': 'Comparison',
    'nav.buyerValue': 'CISO Value & ROI',
    'nav.ratings': 'CISO Ratings',
    'nav.hardware': 'Hardware Enclave',
    'nav.enterprise': 'Enterprise PoC',
    'nav.investor': 'Investor Pitch Deck',
    'nav.faq': 'FAQ',
    'nav.status': 'Quantum-Safe Active',
    'nav.launchApp': 'Request APK Access',
    'nav.investorBadge': 'Series-A / TAM $42B',
    'nav.bannerTitle': 'SERIES-A INVESTMENT OPPORTUNITY:',
    'nav.bannerText': 'Post-Quantum Security TAM $42B • NIST FIPS 203/204 Native',
    'nav.investorBriefing': 'Investor Briefing & Deck',
    'nav.statusChecking': 'Checking Capability...',
    'nav.statusFallback': 'PQC Fallback Active',
    'nav.statusVerified': 'Verified against NIST FIPS 203 post-quantum standard in current browser runtime.',
    'nav.copyDeckUrl': 'Copy Pitch Deck & Data Room URL',
    'nav.scheduleBriefing': 'Schedule CISO / Investor Briefing',
    'nav.strategicMoat': 'Strategic Moat & Technical Advantage',
    
    // Hero
    'hero.badge': 'NIST Certified Quantum-Safe Security',
    'hero.title1': 'Uncompromising Mobile Privacy',
    'hero.title2': 'Built for Visionary Organizations',
    'hero.subtitle': 'Quantum Messenger (Q-CRYPT) safeguards your executive communications, intellectual property, and high-value data from eavesdropping, cyber surveillance, and future supercomputer threats.',
    'hero.plainEnglishTitle': 'Executive Overview:',
    'hero.plainEnglishBody': 'Standard messaging apps like WhatsApp or Signal can be intercepted today and decrypted tomorrow. Q-CRYPT uses military-grade, NIST-approved post-quantum encryption so your organization’s conversations stay private forever.',
    'hero.btnApk': 'Request APK Access (CRM Portal)',
    'hero.btnEnterprise': 'Request Enterprise Demo & SLA',
    'hero.btnDemo': 'Try Interactive Demo',
    'hero.livePreviews': 'Live App Previews:',
    'hero.sharedApp': 'Shared App Preview',
    'hero.devBuild': 'Dev Build',
    'hero.hl1Title': 'Quantum-Safe Shield',
    'hero.hl1Sub': 'Future-Proof Encryption',
    'hero.hl1Body': 'Official NIST post-quantum standard built to withstand quantum supercomputers.',
    'hero.hl2Title': 'Hardware Vault Isolation',
    'hero.hl2Sub': 'On-Device Chip Vault',
    'hero.hl2Body': 'Encryption keys stay locked inside your phone’s physical security hardware.',
    'hero.hl3Title': 'Zero-Knowledge Directory',
    'hero.hl3Sub': 'Total Privacy Assurance',
    'hero.hl3Body': 'Connect with teams securely without uploading or exposing address book contacts.',

    // Feature Showcase
    'showcase.tag': 'Why Organizations Choose Q-CRYPT',
    'showcase.title': 'Uncompromising Digital Sovereignty & Peace of Mind',
    'showcase.subtitle': 'From peer-to-peer personal messaging to server-managed enterprise fleets, Q-CRYPT delivers total privacy and operational security.',
    'showcase.f1.title': 'Automated Self-Healing Encryption',
    'showcase.f1.desc': 'Automatically re-keys every single sent and received message using post-quantum lattice cryptography, ensuring complete forward and backward message protection.',
    'showcase.f1.tag': 'Quantum-Proof',
    'showcase.f2.title': 'Zero-Knowledge Contact Discovery',
    'showcase.f2.desc': 'Connect with team members and partners anonymously. Advanced zero-knowledge lookup ensures your address book never touches a central server.',
    'showcase.f2.tag': 'Zero-Knowledge',
    'showcase.f3.title': 'Stealth Disguise & Duress Wiping',
    'showcase.f3.desc': 'Disguise the mobile app icon as a standard utility widget and trigger emergency data zeroization instantly under duress.',
    'showcase.f3.tag': 'Stealth Protection',
    'showcase.f4.title': 'Instant Peer Identity Verification',
    'showcase.f4.desc': 'Confirm contact authenticity face-to-face or remotely via encrypted QR tokens or high-security phonetic audio verification keys.',
    'showcase.f4.tag': 'Verified Identity',
    'showcase.f5.title': 'Server-Side MDM Fleet Control',
    'showcase.f5.desc': 'Deploy enterprise fleets seamlessly via Microsoft Intune, Samsung Knox, or Workspace ONE with central compliance and instant remote wipe.',
    'showcase.f5.tag': 'Enterprise Ready',
    'showcase.f6.title': 'Independent Sovereign Architecture',
    'showcase.f6.desc': 'Operates independently without reliance on commercial cloud surveillance frameworks, ad trackers, or third-party dependencies.',
    'showcase.f6.tag': 'Total Sovereignty',

    // Preview Section
    'preview.tag': 'Active Android Project Environment',
    'preview.title': 'Live Application Access & Preview Portal',
    'preview.subtitle': 'Access the running Android application preview environments hosted in Google AI Studio.',
    'preview.appName': 'APPLICATION NAME',
    'preview.packageName': 'PACKAGE NAME (APPLICATIONID)',
    'preview.appletId': 'APPLET ID',
    'preview.postQuantumSpec': 'POST-QUANTUM SPEC',
    'preview.sharedTitle': 'Shared App Preview',
    'preview.sharedSub': 'Public Preview Endpoint',
    'preview.sharedDesc': 'Main preview environment for stakeholders, security auditors, and testers to interact with the Android application.',
    'preview.launchShared': 'Launch Shared Preview',
    'preview.devTitle': 'Development Preview',
    'preview.devSub': 'Development & Hot-Reload Target',
    'preview.devDesc': 'Direct development build container environment with live hot-reloading and debug telemetry.',
    'preview.launchDev': 'Launch Development Build',

    // Ticker
    'ticker.live': 'Live Network & Enclave Telemetry',
    'ticker.updated': 'Updated Real-Time',
    'ticker.activeDevices': 'Enterprise Pilot Seats Requested',
    'ticker.newSeats': 'Active Audit & Trial Subscriptions',
    'ticker.sessions': 'Local Enclave Channel',
    'ticker.incidents': 'Intercept Audits',
    'ticker.reach': 'Relay Enclaves',

    // Threat Dashboard
    'threat.title': 'Real-Time Threat Monitor & Security Health',
    'threat.status': 'STATUS: 100% SAFE',
    'threat.subtitle': 'Live automated monitoring of network safety, server connections, and encryption strength',
    'threat.copy': 'Copy Threat Telemetry',

    // Global Map
    'map.tag': 'Global Sovereign Mesh',
    'map.title': 'Encrypted Node Routing Map',
    'map.subtitle': 'Active sovereign nodes ensuring zero latency and zero central point of failure.',

    // APK Portal
    'apk.tag': 'Firebase CRM Registration Portal',
    'apk.title': 'Register for .APK Access (Admin Email Link Dispatch)',
    'apk.subtitle': 'Direct .APK downloads are disabled for security verification. Submit your organization information into our Firebase CRM, and our Admin team will email you the verified, signed .APK download link.',
    'apk.stable': 'STABLE RELEASE',
    'apk.build': 'Build 2026.07.25',
    'apk.btnDownload': 'Submit Info to CRM for Admin Email Link',
    'apk.copyHash': 'Copy SHA-256 Hash',

    // Key Demo
    'keyDemo.tag': 'In-Browser Live Cryptographic Demo',
    'keyDemo.title': 'Interactive Quantum Key Exchange Simulator',
    'keyDemo.subtitle': 'Test how Q-CRYPT generates and exchanges unbreakable encryption keys in real time.',
    'keyDemo.plainTitle': 'How It Works in Plain English:',
    'keyDemo.plainBody': 'Before you send a message, your phone and the recipient\'s phone agree on a secret key using quantum-proof mathematics. Step 1 creates your personal keys, Step 2 locks a secret session key inside a vault, and Step 3 unlocks the vault.',

    // Comparison Table
    'comparison.tag': 'Clear Security Comparison',
    'comparison.title': 'How Q-CRYPT Outperforms Standard Apps & Corporate Chat',
    'comparison.subtitle': 'Standard messaging apps and corporate workspace tools protect against yesterday\'s threats. Q-CRYPT is engineered for the quantum age with zero-trust privacy and hardware-grade protection.',
    'comparison.qcrypt': 'Q-CRYPT Quantum',
    'comparison.standard': 'Standard Apps (WhatsApp/Signal)',
    'comparison.corporate': 'Corporate Chat (Slack / Teams)',
    'comp.secCap': 'Security Capability / Feature',
    'comp.corpChat': 'Corporate Chat (Slack / Teams)',

    'comp.r1.feature': 'Quantum Supercomputer Immunity',
    'comp.r1.plain': 'Stops hackers from saving your encrypted messages today and unlocking them later using future supercomputers.',
    'comp.r1.qcLabel': '100% Quantum-Proof',
    'comp.r1.qcDetail': 'Uses official NIST ML-KEM-1024 encryption locks that supercomputers cannot crack.',
    'comp.r1.stdLabel': 'Vulnerable (Harvest Now, Decrypt Later)',
    'comp.r1.stdDetail': 'Uses older math (ECC / RSA) that quantum computers will easily unlock in a few years.',
    'comp.r1.corpLabel': 'No Quantum Protection',
    'comp.r1.corpDetail': 'Standard web TLS/AES-256; cloud-archived and easily decrypted by quantum computers later.',

    'comp.r2.feature': 'Hardware Key Vault Storage',
    'comp.r2.plain': 'Keeps the secret master keys physically trapped inside your phone hardware security chip (Titan M2 / Knox).',
    'comp.r2.qcLabel': 'Hardware Isolated',
    'comp.r2.qcDetail': 'Keys never touch RAM or phone storage. Even phone malware cannot extract them.',
    'comp.r2.stdLabel': 'Software Only',
    'comp.r2.stdDetail': 'Keys are stored in app memory or phone storage, vulnerable to spyware.',
    'comp.r2.corpLabel': 'Central Server Keys',
    'comp.r2.corpDetail': 'Keys stored on vendor cloud servers (AWS/Azure) or corporate KMS endpoints.',

    'comp.r3.feature': 'Contact List & Address Book Privacy',
    'comp.r3.plain': 'Finds your contacts on the app without uploading your phone address book to any central database.',
    'comp.r3.qcLabel': '100% Private (Zero Upload)',
    'comp.r3.qcDetail': 'Zero-knowledge math lets you connect without sending contact numbers to servers.',
    'comp.r3.stdLabel': 'Uploads Address Book',
    'comp.r3.stdDetail': 'Requires uploading your full address book to identify contacts.',
    'comp.r3.corpLabel': 'Central Directory Index',
    'comp.r3.corpDetail': 'All user names, emails, channels, and org charts stored permanently on cloud servers.',

    'comp.r4.feature': 'Instant Hardware Memory Wipe',
    'comp.r4.plain': 'Permanently erases messages and keys directly from physical memory if a device is stolen or tampered with.',
    'comp.r4.qcLabel': 'True Hardware Zeroization',
    'comp.r4.qcDetail': 'Overwrites memory with cryptographic noise on tamper detection or panic trigger.',
    'comp.r4.stdLabel': 'Basic App-Level Delete',
    'comp.r4.stdDetail': 'Deletes local app entries, but forensic tools can often recover deleted files.',
    'comp.r4.corpLabel': 'Retained on Cloud Archives',
    'comp.r4.corpDetail': 'Messages saved indefinitely in enterprise compliance archives & vendor databases.',

    'comp.r5.feature': 'Metadata & IP Address Protection',
    'comp.r5.plain': 'Conceals who you talk to, when you talk, and where you are located.',
    'comp.r5.qcLabel': 'Zero Metadata Logs',
    'comp.r5.qcDetail': 'Servers do not record sender/receiver pairings, timestamps, or IP addresses.',
    'comp.r5.stdLabel': 'Logs Metadata',
    'comp.r5.stdDetail': 'Records phone numbers, IP addresses, and message timestamps.',
    'comp.r5.corpLabel': 'Full Audit Telemetry',
    'comp.r5.corpDetail': 'Every click, login IP, device ID, channel, and conversation partner is logged.',

    'comp.r6.feature': 'Backdoor & Subpoena Resistance',
    'comp.r6.plain': 'Prevents third parties, cloud providers, or bad actors from demanding master backdoor access.',
    'comp.r6.qcLabel': 'Mathematically Impossible',
    'comp.r6.qcDetail': 'No central key exists. Even Q-CRYPT developers cannot read your messages.',
    'comp.r6.stdLabel': 'Cloud Backup Risk',
    'comp.r6.stdDetail': 'Unencrypted iCloud or Google Drive backups can expose your entire chat history.',
    'comp.r6.corpLabel': 'Vendor & Admin Export',
    'comp.r6.corpDetail': 'Company admins and cloud vendors can export and read all workspace chat histories.',

    'comp.r7.feature': 'Deployment Architecture (Free vs Enterprise)',
    'comp.r7.plain': 'Free edition operates as pure Peer-to-Peer (P2P); Enterprise & Organization edition features a server-side MDM application.',
    'comp.r7.qcLabel': 'Pure P2P (Free) / Server MDM (Enterprise)',
    'comp.r7.qcDetail': 'Free version: Pure P2P client-to-client with zero server dependency. Enterprise: Server-side MDM application (Intune/Knox), KMS endpoint sync & fleet zeroize.',
    'comp.r7.stdLabel': 'Proprietary Central Server',
    'comp.r7.stdDetail': 'Dependent on proprietary vendor cloud relay servers.',
    'comp.r7.corpLabel': 'Monolithic SaaS Cloud',
    'comp.r7.corpDetail': 'Requires monolithic central corporate cloud infrastructure with vendor lock-in.',

    'comp.r8.feature': 'Infostealer & Session Token Resistance',
    'comp.r8.plain': 'Protects against desktop/browser infostealer malware (Lumma/RedLine) hijacking active login session tokens.',
    'comp.r8.qcLabel': 'Hardware Token Bound',
    'comp.r8.qcDetail': 'Cryptographic session keys are bound to physical HSM hardware (Titan M2/Knox) and cannot be copied off device.',
    'comp.r8.stdLabel': 'Software Session Tokens',
    'comp.r8.stdDetail': 'Session tokens stored in local app state or browser storage; susceptible to token stealing malware.',
    'comp.r8.corpLabel': 'Critical Vulnerability',
    'comp.r8.corpDetail': 'Slack tokens & Teams .ldb databases stored in plaintext on disk; infostealers extract active session tokens instantly.',

    'comp.r9.feature': 'Unencrypted Bot & Webhook Leaks',
    'comp.r9.plain': 'Prevents third-party integrations, bots, and webhooks from reading or archiving sensitive internal conversations.',
    'comp.r9.qcLabel': 'Zero-Trust Isolated',
    'comp.r9.qcDetail': 'No third-party bots or webhooks have access to encrypted communication payload channels.',
    'comp.r9.stdLabel': 'Limited Bot Scoping',
    'comp.r9.stdDetail': 'Third-party bots frequently request broad permissions to read message content.',
    'comp.r9.corpLabel': 'High Leak Surface',
    'comp.r9.corpDetail': 'Bots and webhooks routinely index channel content, leaking API keys, credentials, and source code.',

    'comp.r10.feature': 'eDiscovery & Uncontrolled Retention Risk',
    'comp.r10.plain': 'Eliminates the risk of long-term server-side message retention leaking in cloud provider breaches or subpoena exports.',
    'comp.r10.qcLabel': 'Ephemeral Self-Healing',
    'comp.r10.qcDetail': 'Zero central cloud database storage. Messages self-heal and auto-expire from physical RAM.',
    'comp.r10.stdLabel': 'Selective Disappearing',
    'comp.r10.stdDetail': 'Disappearing messages available in some chats, but backups can persist.',
    'comp.r10.corpLabel': 'Permanent Cloud Index',
    'comp.r10.corpDetail': 'All chats, files, and channels indexed indefinitely in cloud vendor storage for eDiscovery.',

    // Security Comparison Bottom Line
    'comp.bottomLine': 'The Bottom Line for Security Leaders:',
    'comp.bottomLineDesc': 'Standard end-to-end encryption (RSA/ECC) leaves communications vulnerable to "Harvest Now, Decrypt Later" quantum attacks. Q-CRYPT provides certified NIST FIPS 203 (ML-KEM-1024) post-quantum lattice security paired with hardware enclave isolation, delivering long-term immunity for enterprise and defense teams.',
    'comp.getProtectedBtn': 'Deploy Post-Quantum Protection',

    // CISO Value & ROI
    'buyerValue.tag': 'Executive Value & Risk Mitigation',
    'buyerValue.title': 'Strategic Value for CISOs & Security Executives',
    'buyerValue.subtitle': 'Why forward-thinking security leaders replace legacy corporate messaging with post-quantum defense.',

    // Testimonials
    'testimonials.tag': 'Strict Confidentiality • Identity Protected',
    'testimonials.title': 'Trusted by Industry Leaders & Security Analysts',
    'testimonials.subtitle': 'Due to strict non-disclosure agreements and national defense protocols, client identities remain strictly confidential.',

    // Hardware
    'hardware.tag': 'Hardware & Enclave Compatibility',
    'hardware.title': 'Compatible Security Chips & Mobile OS',
    'hardware.subtitle': 'Q-CRYPT interfaces directly with hardware root-of-trust security enclaves.',

    // Enterprise Trial
    'enterprise.tag': 'Enterprise Onboarding Portal',
    'enterprise.title': 'Request Enterprise Trial & Security SLA',
    'enterprise.subtitle': 'Deploy Q-CRYPT to your organization with custom MDM policies, dedicated sovereign relay nodes, and 24/7 CISO support.',

    // Investor Relations & Pitch Deck
    'investor.tag': 'Series-A Investor Briefing',
    'investor.title': 'Investor Relations & Financial Pitch Deck',
    'investor.subtitle': 'Post-Quantum Mobile Security Infrastructure for Enterprise & Defense • TAM $42 Billion',
    'investor.btnDownloadPdf': 'Download Pitch Deck (PDF)',
    'investor.tam': 'Global Market TAM',
    'investor.arr': 'ARR per Seat',
    'investor.seats': 'Active Pilot Seats',
    'investor.growth': 'QoQ Revenue Growth',
    'investor.contactTitle': 'Enterprise Contacts Directory (Firebase Firestore Synced)',
    'investor.contactSubtitle': 'Live enterprise CISO contacts and qualified investor inquiries stored in Firebase database.',
    'investor.addContact': 'Add Enterprise Contact',
    'investor.name': 'Contact Name',
    'investor.company': 'Organization / VC Firm',
    'investor.email': 'Official Email',
    'investor.role': 'Executive Role',
    'investor.investmentInterest': 'Target Capital / License Scope',
    'investor.saveSuccess': 'Enterprise Contact Saved to Firebase Firestore Database!',
    'investor.missingFields': 'Please fill in Contact Name, Company, and Email.',
    'investor.pdfDownloaded': 'Downloaded Official Investor Pitch Deck (PDF)',

    // FAQ
    'faq.tag': 'Frequently Asked Questions',
    'faq.title': 'Post-Quantum Security FAQ',
    'faq.subtitle': 'Clear answers to common questions about quantum-resistant cryptography, hardware enclaves, and mobile privacy.',
    'faq.q1': 'What is Post-Quantum Cryptography (PQC), and why do I need it today?',
    'faq.a1': 'Post-Quantum Cryptography uses advanced lattice-based mathematical algorithms (like NIST FIPS 203 ML-KEM) that quantum computers cannot solve. You need it today because state-sponsored adversaries actively practice "Harvest Now, Decrypt Later" (HNDL)—intercepting and storing encrypted communications now to decrypt them once quantum computers mature.',
    'faq.q2': 'What is NIST FIPS 203 (ML-KEM-1024) and FIPS 204 (ML-DSA-87)?',
    'faq.a2': 'These are the official post-quantum standards published by NIST in August 2024. ML-KEM-1024 (formerly Kyber) handles key encapsulation with Category 5 (256-bit quantum) security, while ML-DSA-87 (formerly Dilithium) provides quantum-safe digital signatures for identity authentication.',
    'faq.q3': 'Does Q-CRYPT rely on central servers to route or process messages?',
    'faq.a3': 'No. The Free Community Edition operates 100% serverless using direct peer-to-peer (P2P) connections and local mesh relays. In the Enterprise Edition, organizations can run private sovereign relays with full zero-knowledge end-to-end key isolation.',
    'faq.q4': 'How are my encryption keys protected on my smartphone?',
    'faq.a4': 'Private keys are generated and bound inside your phone\'s isolated Hardware Security Module (HSM)—such as Google Titan M2, Samsung Knox, or ARM TrustZone TEE. Keys never leave the hardware enclave in plaintext and cannot be extracted even if root access is gained.',
    'faq.q5': 'Does post-quantum encryption slow down messaging or drain battery?',
    'faq.a5': 'No. Q-CRYPT uses C/C++ native ARMv8/v9 SIMD assembly acceleration for lattice operations. Encapsulating a post-quantum session key takes under 2 milliseconds, resulting in instantaneous transmission with zero noticeable impact on battery life.',
    'faq.q6': 'What happens under coercion or if someone forces me to unlock my phone?',
    'faq.a6': 'Q-CRYPT includes Steganographic Camouflage and a Stealth Duress PIN. Entering your configured Duress PIN unlocks a convincing decoy environment while instantly zeroizing and wiping the real hardware keys from memory.',
    'faq.q7': 'How does Q-CRYPT protect my contact book from metadata harvesting?',
    'faq.a7': 'Q-CRYPT uses Private Information Retrieval (PIR) and zero-knowledge mathematical proofs to discover peers. Your phone book is never uploaded to any server or shared with external parties.',
    'faq.q8': 'How does the Enterprise Edition differ from the Free Community Edition?',
    'faq.a8': 'Both editions feature the identical NIST FIPS 203 quantum encryption engine. The Enterprise Edition adds central Mobile Device Management (MDM) fleet integration (Intune/Knox), remote wipe capabilities, automated KMS key rotation schedules, and private cloud deployment options.',

    // CTI & Threat Intelligence
    'cti.tag': 'Cyber Threat Intelligence (CTI) Feed',
    'cti.title': 'Adversary Quantum Harvesting & Campaign Tracker',
    'cti.subtitle': 'Real-time threat intelligence mapping state-sponsored APT groups, Harvest-Now-Decrypt-Later (HNDL) exploits, and PQC mitigations.',
    'cti.activeApts': 'Active APT Campaigns',
    'cti.stixExport': 'Export STIX 2.1 Threat Intel Payload',
    'cti.iocTitle': 'Live Indicators of Compromise (IoC)',
    'cti.mitreTitle': 'PQC MITRE ATT&CK Mobile Matrix',
    'cti.threatLevel': 'Threat Level',
    'cti.mitigation': 'Q-CRYPT PQC Status',
    'cti.hndlRisk': 'HNDL Risk Index',

    // Deep PQC Elaboration
    'pqc.tag': 'Cryptographic Deep-Dive Architecture',
    'pqc.title': 'Full Mathematical & Hardware Solution for PQC',
    'pqc.subtitle': 'How Q-CRYPT implements official NIST FIPS 203 & 204 standards to eliminate quantum decryption risks.',
    'pqc.mlKemTitle': 'NIST FIPS 203: ML-KEM-1024 (Kyber)',
    'pqc.mlKemDesc': 'Module Lattice Key Encapsulation operating over 1024-dimensional polynomial vector rings with Gaussian error noise. Mathematically immune to Shor\'s quantum algorithm.',
    'pqc.mlDsaTitle': 'NIST FIPS 204: ML-DSA-87 (Dilithium)',
    'pqc.mlDsaDesc': 'Lattice-based digital signatures providing unforgeable message authentication and identity verification using rejection sampling over module lattices.',
    'pqc.hndlTitle': 'Harvest-Now-Decrypt-Later (HNDL) Shield',
    'pqc.hndlDesc': 'Neutralizes passive state-sponsored adversaries recording encrypted network traffic today for decryption when Cryptographically Relevant Quantum Computers arrive.',
    'pqc.hybridTitle': 'Dual-Layer Hybrid Envelope',
    'pqc.hybridDesc': 'Combines classical Elliptic Curve Diffie-Hellman (X25519) with ML-KEM-1024 in a nested HKDF-SHA3-512 envelope for defense-in-depth security.',
    'pqc.hardwareTitle': 'Titan M2 & StrongBox Hardware Binding',
    'pqc.hardwareDesc': 'Keys are generated and sealed within Android hardware security modules (HSMs), preventing memory extraction even if root privileges are obtained.',

    // Footer
    'footer.description': 'Post-Quantum Lattice Encrypted Android Messaging Platform. Compliant with NIST FIPS 203 (ML-KEM-1024) and FIPS 204 (ML-DSA-87).',
    'footer.nodesStatus': 'Decentralized Peer-to-Peer (P2P) Relay Mesh: Active',
    'footer.tagline': 'Quantum-Safe Communications for Enterprise & Defense.',
    'footer.rights': 'All Rights Reserved. NIST FIPS 203 & 204 Compliant.',
    'footer.portalSections': 'Platform Modules & Portals',
    'footer.androidPreviews': 'Android Previews & Build',
    'footer.apkDownload': 'Register for APK Access',
    'footer.kyberDemo': 'Post-Quantum Key Exchange Demo',
    'footer.hwEnclave': 'Hardware Enclave Diagnostic',
    'footer.enterpriseTrial': 'Request Enterprise Trial & SLA',
    'footer.ctiFeed': 'Threat Intelligence Feed',
    'footer.matrixComp': 'Feature Comparison Matrix',
    'footer.sharedApplet': 'Shared Production Applet',
    'footer.devBuild': 'Dev Container Workspace',
    'footer.complianceTitle': 'Cryptographic Compliance',
    'footer.nistSpec': 'NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA)',
    'footer.cat5': 'Category 5 (256-bit Quantum) Immunity',
    'footer.hardwareEnclave': 'Titan M2 & Knox Vault Hardware Isolation',
    'footer.zeroMetadata': 'Zero Metadata & Ephemeral P2P Relays',

    // Geo & Lang UI
    'lang.select': 'Language / Region',
    'lang.autoGeo': 'Geo-Detected',

    // Scrambler
    'scrambler.title': 'Interactive Quantum Text Encryption Sandbox',
    'scrambler.live': 'Live Preview',
    'scrambler.sub': 'Type any message below to see how it instantly transforms into unbreakable mathematical code',
    'scrambler.inputLabel': 'Plaintext Input',
    'scrambler.placeholder': 'Type anything to scramble...',
    'scrambler.strength': 'Encryption Strength & Mathematical Complexity',
    'scrambler.plainExplained': 'In Plain English: Adjusting this adds additional mathematical noise layers to ensure supercomputers cannot guess the secret lock.',
    'scrambler.matrixLabel': 'Lattice Matrix Polynomial Modulo q=3329:',
    'scrambler.outputTitle': 'Quantum Ciphertext Output',
    'scrambler.computing': 'Computing Polynomial Matrix...',
    'scrambler.note': 'Quantum attackers (Shor\'s algorithm) cannot decompose matrix vectors.',
    'scrambler.copyBtn': 'Copy Ciphertext',
    'scrambler.copySuccess': 'Lattice vector copied to clipboard',

    // Hardware Details
    'hw.selectModel': 'Select Device Model:',
    'hw.platform': 'Platform',
    'hw.secProcessor': 'SECURITY PROCESSOR / CHIPSET',
    'hw.isolationAudit': 'CRYPTOGRAPHIC ISOLATION AUDIT:',
    'hw.f1Title': 'StrongBox KeyStore',
    'hw.f1Sub': 'Hardware-Isolated Private Key',
    'hw.f2Title': 'ML-KEM Lattice Isolation',
    'hw.f2Sub': 'Kyber-1024 Noise Shielding',
    'hw.f3Title': 'Physical Anti-Tamper Mesh',
    'hw.f3Sub': 'Zeroization on Active Probe',
    'hw.f4Title': 'Memory Tagging (MTE)',
    'hw.f4Sub': 'Prevents Memory Safety Exploits',
    'hw.auditSummary': 'EXPERT HARDWARE AUDIT SUMMARY:',
    'hw.recProfile': 'Recommended Q-CRYPT Profile:',
    'hw.gradeA': 'Grade-A Post-Quantum Mode',

    // PQC Code & Developer Resources
    'pqcCode.title': 'Post-Quantum Cryptography Technical Foundations',
    'pqcCode.subtitle': 'Explore low-level C11 algorithms, C++20 hardware enclave vaults, x86_64 AVX2 / ARM64 NEON SIMD assembly routines, interactive security strength sandboxes, and developer build toolchains for NIST FIPS 203.',
    'pqcCode.sndlTitle': 'Why PQC Matters: Mitigating "Store Now, Decrypt Later" (SNDL) Attacks',
    'pqcCode.sndlDesc': 'Store Now, Decrypt Later (SNDL) is a passive attack vector where adversaries record encrypted communications today to decrypt them when quantum computers scale. Q-CRYPT\'s NIST FIPS 203 (ML-KEM-1024) lattice encryption neutralizes this threat.',
    'pqcCode.sandboxTitle': 'Algorithm Security Strength & Quantum Resistance Simulator',
    'pqcCode.sandboxSub': 'Toggle standards to analyze quantum vulnerability metrics',
    'pqcCode.glossaryTitle': 'Quantum Security Glossary & Concepts Simplified',
    'pqcCode.glossarySub': 'Plain-English analogies for executive & non-developer audiences',
    'pqcCode.copyCode': 'Copy Snippet',
    'pqcCode.copiedCode': 'Copied to Clipboard!',
    'pqcCode.showCode': 'Show C/C++ & Assembly Code',
    'pqcCode.hideCode': 'Hide Code Block',
    'pqcCode.showBuild': 'Show Build Scripts',
    'pqcCode.hideBuild': 'Hide Build Scripts',
    'pqcCode.codeHidden': 'Raw source code hidden for cleaner visibility. Toggle above to expand.',
    'pqcCode.printBtn': 'Print Resources (PDF)',
    'pqcCode.complexity': 'Complexity:',
    'pqcCode.beginner': 'Beginner',
    'pqcCode.advanced': 'Advanced',
    'pqcCode.expert': 'Expert',
    'pqcCode.roadmapTitle': 'Post-Quantum Implementation Roadmap',
    'pqcCode.roadmapSub': 'Strategic migration timeline from legacy algorithms to NIST FIPS 203/204 quantum resistance.',
    'pqcCode.quizTitle': 'Security Knowledge Check',
    'pqcCode.quizSub': 'Test your developer understanding of Post-Quantum Cryptography & Q-CRYPT principles.',
    'pqcCode.quizRestart': 'Retake Quiz',
    'pqcCode.quizScore': 'Your Quiz Score:',
    'pqcCode.benchmarkTitle': 'PQC Performance & Network Payload Benchmark',
    'pqcCode.benchmarkSub': 'Simulate CPU cycle counts, key sizes, and IP packet fragmentation across architectures.',

    // Audit Status
    'audit.title': 'Third-Party Security Audit & Certification Status',
    'audit.subtitle': 'Independently audited by global NIST, BSI, Trail of Bits, and Ernst & Young cryptographic laboratories.',
    'audit.badge': 'Continuous Verification',
    'audit.auto': 'Auto-Rotating',
    'audit.paused': 'Paused',
    'audit.auditor': 'Independent Auditor',
    'audit.docRef': 'Audit Document Ref',
    'audit.seal': 'SHA-256 Fingerprint Seal',
    'audit.copySeal': 'Copy Verification Seal',
    'audit.sealCopied': 'Seal Copied!',
    'audit.inspectCert': 'Inspect Full Audit Certificate',
    'audit.auditedOn': 'Audited:',
    'audit.validUntil': 'Valid until:',
    'audit.scope': 'Scope of Audit:',
  },
  fr: {
    // Navbar & Banners
    'nav.threat': 'Flux de Menaces',
    'nav.cti': 'Renseignement CTI',
    'nav.pqc': 'Spéc. Math PQC',
    'nav.apk': 'Télécharger l\'APK',
    'nav.keyDemo': 'Démo Quantique',
    'nav.comparison': 'Comparatif',
    'nav.buyerValue': 'Valeur CISO & ROI',
    'nav.ratings': 'Évaluations',
    'nav.hardware': 'Enclave Matérielle',
    'nav.enterprise': 'Essai Entreprise',
    'nav.investor': 'Relations Investisseurs & Deck',
    'nav.faq': 'Foire Aux Questions',
    'nav.status': 'Sécurité Quantique Active',
    'nav.launchApp': 'Bac à Sable en Direct',
    'nav.investorBadge': 'Série-A / TAM 42 M$',
    'nav.bannerTitle': 'OPPORTUNITÉ D\'INVESTISSEMENT SÉRIE-A :',
    'nav.bannerText': 'Sécurité Post-Quantique TAM 42 M$ • Conforme NIST FIPS 203/204',
    'nav.investorBriefing': 'Présentation Investisseurs & Deck',
    'nav.statusChecking': 'Vérification des capacités...',
    'nav.statusFallback': 'Secours PQC Actif',
    'nav.statusVerified': 'Vérifié par rapport à la norme post-quantique NIST FIPS 203.',
    'nav.copyDeckUrl': 'Copier le Lien du Deck & Data Room',
    'nav.scheduleBriefing': 'Planifier un Rendez-vous CISO / Investisseur',
    'nav.strategicMoat': 'Avantage Stratégique & Technique',

    // Hero
    'hero.badge': 'Certifié NIST FIPS 203 & 204',
    'hero.title1': 'Sécurité Mobile Post-Quantique',
    'hero.title2': 'Pour Entreprises & Défense',
    'hero.subtitle': 'Quantum Messenger (Q-CRYPT) est l\'application de messagerie ultra-sécurisée conçue pour protéger vos communications mobiles privées contre toute interception ou déchiffrement par supercalculateur.',
    'hero.plainEnglishTitle': 'En clair :',
    'hero.plainEnglishBody': 'Les applications classiques comme WhatsApp ou Signal pourront être déchiffrées par les futurs supercalculateurs quantiques. Q-CRYPT utilise des verrous mathématiques certifiés par le NIST que même les ordinateurs quantiques ne peuvent casser.',
    'hero.btnApk': 'Télécharger l\'APK Signé (v2.4.0)',
    'hero.btnEnterprise': 'Essai Entreprise & SLA',
    'hero.btnDemo': 'Démo Kyber-1024',
    'hero.livePreviews': 'Aperçus de l\'application :',
    'hero.sharedApp': 'Aperçu Partagé',
    'hero.devBuild': 'Version de Dév',
    'hero.hl1Title': 'ML-KEM-1024',
    'hero.hl1Sub': 'Verrous Post-Quantiques',
    'hero.hl1Body': 'Norme de sécurité officielle du NIST inviolable par les supercalculateurs.',
    'hero.hl2Title': 'Coffre-fort Matériel',
    'hero.hl2Sub': 'Puces Titan M2 & Knox',
    'hero.hl2Body': 'Les clés secrètes restent isolées dans la puce matérielle de votre téléphone.',
    'hero.hl3Title': 'Contacts Privés',
    'hero.hl3Sub': 'Annuaire Zéro-Confiance',
    'hero.hl3Body': 'Trouvez des amis sans transmettre votre carnet de contacts au serveur.',

    // Feature Showcase
    'showcase.tag': 'Fonctionnalités d\'Architecture & Sécurité',
    'showcase.title': 'Conçu pour les Environnements Mobiles Zéro-Confiance',
    'showcase.subtitle': 'Quantum Messenger offre une sécurité en profondeur, du niveau de l\'enclave matérielle au rapprochement de contacts sans connaissance.',
    'showcase.f1.title': 'Double-Rochet Post-Quantique',
    'showcase.f1.desc': 'Combine l\'encapsulation de clés réseau NIST FIPS 203 ML-KEM-1024 avec le Double Rochet Curve25519. Régénère les clés automatiquement à chaque message.',
    'showcase.f1.tag': 'NIST FIPS 203',
    'showcase.f2.title': 'Contacts PIR Zéro-Connaissance',
    'showcase.f2.desc': 'Le protocole PIR (Private Information Retrieval) évite les fuites de métadonnées. Recherchez des contacts sans jamais exposer votre carnet d\'adresses.',
    'showcase.f2.tag': 'Zéro-Connaissance',
    'showcase.f3.title': 'Camouflage Stéganographique',
    'showcase.f3.desc': 'Dissimule l\'icône et le lanceur sous l\'apparence d\'une calculatrice ou de notes. Déverrouille le coffre-fort Q-CRYPT uniquement via une séquence secrète.',
    'showcase.f3.tag': 'Anti-Infiltration',
    'showcase.f4.title': 'Vérification SAS Hors-Bande',
    'showcase.f4.desc': 'Vérifiez l\'intégrité des clés en personne ou hors-bande via des QR codes à haute entropie ou des jetons audio cryptographiques à 6 chiffres.',
    'showcase.f4.tag': 'Zéro MitM',
    'showcase.f5.title': 'Coffres-Forts de Contrainte Auto-Destructeurs',
    'showcase.f5.desc': 'Codes d\'urgence configurables. Saisir un PIN de contrainte efface discrètement la mémoire, détruit les clés Titan M2 et génère de fausses données.',
    'showcase.f5.tag': 'Remise à Zéro Matérielle',
    'showcase.f6.title': 'Sans Dépendance Google',
    'showcase.f6.desc': 'Fonctionne nativement sur Android personnalisé avec le noyau le plus sécurisé, sans Google Play Services ni MicroG. Push WebSocket direct et SQLite chiffré.',
    'showcase.f6.tag': '100% Dégooglisé',

    // Ticker
    'ticker.live': 'Télémétrie Réseau & Enclave en Direct',
    'ticker.updated': 'Mis à Jour en Temps Réel',
    'ticker.activeDevices': 'Accès Pilotes Entreprise Demandés',
    'ticker.newSeats': 'Inscriptions & Audits Entreprise Actifs',
    'ticker.sessions': 'Canal Enclave Local',
    'ticker.incidents': 'Audits d\'Interception',
    'ticker.reach': 'Enclaves de Relais',

    // Threat Dashboard
    'threat.title': 'Surveillance des Menaces en Temps Réel',
    'threat.status': 'STATUT : 100% SÉCURISÉ',
    'threat.subtitle': 'Contrôle automatisé continu de la sécurité réseau, des connexions et du chiffrement',
    'threat.copy': 'Copier Télémétrie de Menace',

    // Global Map
    'map.tag': 'Réseau Souverain Mondial',
    'map.title': 'Carte de Routage des Nœuds Chiffrés',
    'map.subtitle': 'Nœuds souverains actifs garantissant une latence minimale et une tolérance totale aux pannes.',

    // APK Portal
    'apk.tag': 'Portail Officiel de Téléchargement',
    'apk.title': 'Téléchargement Direct d\'APK & Vérification d\'Intégrité',
    'apk.subtitle': 'Obtenez les binaires Android autonomes et signés pour OS Android personnalisé à haute sécurité avec noyau sécurisé et conteneurs MDM.',
    'apk.stable': 'VERSION STABLE',
    'apk.build': 'Version 2026.07.25',
    'apk.btnDownload': 'Télécharger l\'APK Vérifié',
    'apk.copyHash': 'Copier l\'Empreinte SHA-256',

    // Key Demo
    'keyDemo.tag': 'Démonstration Cryptographique en Direct',
    'keyDemo.title': 'Simulateur Interactif d\'Échange de Clés Quantiques',
    'keyDemo.subtitle': 'Testez en temps réel comment Q-CRYPT génère et échange des clés de chiffrement inviolables.',
    'keyDemo.plainTitle': 'Comment ça marche en clair :',
    'keyDemo.plainBody': 'Avant d\'envoyer un message, votre téléphone et celui du destinataire s\'accordent sur une clé secrète via des mathématiques quantiques. L\'Étape 1 génère vos clés, l\'Étape 2 verrouille la clé de session dans un coffre-fort, et l\'Étape 3 déverrouille le coffre.',

    // Comparison Table
    'comparison.tag': 'Comparatif Clair de Sécurité',
    'comparison.title': 'Pourquoi Q-CRYPT Surpasse les Applications Standard',
    'comparison.subtitle': 'Les messageries classiques protègent contre les menaces d\'hier. Q-CRYPT est conçu pour l\'ère quantique avec une confidentialité zéro-confiance et un chiffrement matériel.',
    'comparison.qcrypt': 'Q-CRYPT Quantique',
    'comparison.standard': 'Applications Standard',
    'comparison.corporate': 'Messagerie d\'Entreprise',

    'comp.r1.feature': 'Immunité Supercalculateur Quantique',
    'comp.r1.plain': 'Empêche les piratages d\'enregistrer vos messages aujourd\'hui pour les déchiffrer plus tard avec de futurs supercalculateurs.',
    'comp.r1.qcLabel': '100% Inviolable par Ordinateur Quantique',
    'comp.r1.qcDetail': 'Utilise le chiffrement officiel NIST ML-KEM-1024 que les supercalculateurs ne peuvent pas casser.',
    'comp.r1.stdLabel': 'Vulnérable (Récolter Maintenant, Déchiffrer Plus Tard)',
    'comp.r1.stdDetail': 'Utilise de vieilles clés (ECC / RSA) que les ordinateurs quantiques déchiffreront facilement.',
    'comp.r1.corpLabel': 'Aucune Protection Quantique',
    'comp.r1.corpDetail': 'Chiffrement web standard ; facilement archivé et déchiffrable plus tard.',

    'comp.r2.feature': 'Stockage dans le Coffre Matériel',
    'comp.r2.plain': 'Garde les clés maîtresses secrètes physiquement isolées dans la puce de sécurité du téléphone (Titan M2 / Knox).',
    'comp.r2.qcLabel': 'Isolé au Niveau Matériel',
    'comp.r2.qcDetail': 'Les clés ne touchent jamais la RAM ni le stockage général. Même un logiciel espion ne peut les extraire.',
    'comp.r2.stdLabel': 'Logiciel Uniquement',
    'comp.r2.stdDetail': 'Les clés sont en mémoire d\'application, vulnérables aux attaques avancées.',
    'comp.r2.corpLabel': 'Clés sur Serveur Central',
    'comp.r2.corpDetail': 'Clés stockées sur des serveurs d\'entreprise ou des fournisseurs cloud.',

    'comp.r3.feature': 'Confidentialité du Carnet d\'Adresses',
    'comp.r3.plain': 'Trouve vos contacts sur l\'application sans télécharger votre carnet d\'adresses téléphonique sur un serveur central.',
    'comp.r3.qcLabel': '100% Privé (Zéro Téléversement)',
    'comp.r3.qcDetail': 'La preuve à divulgation nulle vous permet de vous connecter sans envoyer vos numéros au serveur.',
    'comp.r3.stdLabel': 'Téléverse le Carnet de Contacts',
    'comp.r3.stdDetail': 'Nécessite le téléversement complet de votre répertoire pour identifier vos contacts.',
    'comp.r3.corpLabel': 'Annuaire Centralisé',
    'comp.r3.corpDetail': 'Tous les noms et e-mails sont conservés sur les serveurs de l\'entreprise.',

    'comp.r4.feature': 'Effacement Matériel Immédiat',
    'comp.r4.plain': 'Efface définitivement les messages et les clés de la mémoire physique en cas de vol ou d\'altération.',
    'comp.r4.qcLabel': 'Mise à Zéro Matérielle Réelle',
    'comp.r4.qcDetail': 'Écrase la mémoire avec du bruit cryptographique dès la détection d\'une tentative d\'intrusion.',
    'comp.r4.stdLabel': 'Suppression Basique d\'App',
    'comp.r4.stdDetail': 'Efface l\'entrée locale, mais la criminalistique informatique peut souvent récupérer les fichiers.',
    'comp.r4.corpLabel': 'Conservé sur le Cloud',
    'comp.r4.corpDetail': 'Messages archivés indéfiniment pour la conformité et les exigences de l\'entreprise.',

    'comp.r5.feature': 'Protection des Métadonnées & IP',
    'comp.r5.plain': 'Masque avec qui vous parlez, quand vous parlez et votre emplacement géographique.',
    'comp.r5.qcLabel': 'Zéro Journal de Métadonnées',
    'comp.r5.qcDetail': 'Les serveurs n\'enregistrent ni correspondants, ni horodatages, ni adresses IP.',
    'comp.r5.stdLabel': 'Métadonnées Enregistrées',
    'comp.r5.stdDetail': 'Enregistre numéros de téléphone, adresses IP et horodatages.',
    'comp.r5.corpLabel': 'Audit d\'Enregistrement Complet',
    'comp.r5.corpDetail': 'Chaque clic, IP de connexion et interlocuteur est consigné.',

    'comp.r6.feature': 'Résistance aux Portes Dérobées & Réquisitions',
    'comp.r6.plain': 'Empêche les tiers, hébergeurs cloud ou acteurs malveillants d\'exiger un accès maître.',
    'comp.r6.qcLabel': 'Mathématiquement Impossible',
    'comp.r6.qcDetail': 'Aucune clé centrale n\'existe. Même les développeurs de Q-CRYPT ne peuvent lire vos messages.',
    'comp.r6.stdLabel': 'Risque de Sauvegarde Cloud',
    'comp.r6.stdDetail': 'Les sauvegardes iCloud ou Google Drive non chiffrées peuvent exposer tout l\'historique.',
    'comp.r6.corpLabel': 'Accès Administrateur Activé',
    'comp.r6.corpDetail': 'Les administrateurs peuvent exporter et lire tous les historiques à tout moment.',

    'comp.r7.feature': 'Architecture de Déploiement (Gratuit vs Entreprise)',
    'comp.r7.plain': 'La version gratuite fonctionne en Pur Peer-to-Peer (P2P) ; la version Entreprise intègre une application MDM côté serveur.',
    'comp.r7.qcLabel': 'Pur P2P (Gratuit) / MDM Serveur (Entreprise)',
    'comp.r7.qcDetail': 'Version gratuite : Pur P2P client à client sans aucun serveur. Version Entreprise : Application MDM serveur (Intune/Knox), synchro KMS & zéroïsation de flotte.',
    'comp.r7.stdLabel': 'Serveur Central Propriétaire',
    'comp.r7.stdDetail': 'Dépendant des serveurs relais cloud propriétaires de l\'éditeur.',
    'comp.r7.corpLabel': 'Serveur Central d\'Entreprise',
    'comp.r7.corpDetail': 'Nécessite une infrastructure serveur centralisée monolithique.',

    // Security Comparison Bottom Line
    'comp.bottomLine': 'L\'Essentiel pour les Décideurs en Sécurité :',
    'comp.bottomLineDesc': 'Le chiffrement de bout en bout classique (RSA/ECC) laisse les communications vulnérables aux attaques quantiques "Récolter Maintenant, Déchiffrer Plus Tard". Q-CRYPT offre une sécurité post-quantique certifiée NIST FIPS 203 (ML-KEM-1024) couplée à un isolement matériel sur puce, garantissant une immunité à long terme.',
    'comp.getProtectedBtn': 'Déployer la Protection Post-Quantique',

    // CISO Value & ROI
    'buyerValue.tag': 'Valeur Stratégique & Réduction des Risques',
    'buyerValue.title': 'Valeur Stratégique pour CISOs & Directeurs Sécurité',
    'buyerValue.subtitle': 'Pourquoi les leaders de la cybersécurité remplacent les messageries d\'entreprise par une défense post-quantique.',

    // Testimonials
    'testimonials.tag': 'Confidentialité Stricte • Identité Protégée',
    'testimonials.title': 'Approuvé par les Leaders du Secteur & Analystes',
    'testimonials.subtitle': 'Conformément aux accords de confidentialité et protocoles de défense nationale, l\'identité des clients reste confidentielle.',

    // Hardware
    'hardware.tag': 'Compatibilité Matérielle & Puces Enclave',
    'hardware.title': 'Puces de Sécurité & OS Mobiles Compatibles',
    'hardware.subtitle': 'Q-CRYPT s\'interface directement avec l\'enclave de sécurité matérielle de votre smartphone.',

    // Enterprise Trial
    'enterprise.tag': 'Portail d\'Intégration Entreprise',
    'enterprise.title': 'Demander un Essai Entreprise & SLA de Sécurité',
    'enterprise.subtitle': 'Déployez Q-CRYPT dans votre organisation avec règles MDM personnalisées, relais souverains dédiés et support CISO 24/7.',

    // Investor Relations & Pitch Deck
    'investor.tag': 'Présentation Investisseurs Série-A',
    'investor.title': 'Relations Investisseurs & Deck Exécutif',
    'investor.subtitle': 'Infrastructure de Cybersécurité Mobile Post-Quantique • TAM 42 Milliards de Dollars',
    'investor.btnDownloadPdf': 'Télécharger le Pitch Deck (PDF)',
    'investor.tam': 'Marché Global (TAM)',
    'investor.arr': 'ARR Entreprise par Accès',
    'investor.seats': 'Accès Pilotes Actifs',
    'investor.growth': 'Croissance Trimestrielle',
    'investor.contactTitle': 'Annuaire des Contacts Entreprises (Synchronisé Firebase Firestore)',
    'investor.contactSubtitle': 'Contacts CISO et demandes d\'investissement qualifiées stockés en temps réel dans la base de données Firebase.',
    'investor.addContact': 'Ajouter un Contact Entreprise',
    'investor.name': 'Nom du Contact',
    'investor.company': 'Organisation / Fonds VC',
    'investor.email': 'E-mail Officiel',
    'investor.role': 'Fonction Exécutive',
    'investor.investmentInterest': 'Montant d\'Investissement / Accès',
    'investor.saveSuccess': 'Contact Entreprise Enregistré dans la Base Firebase !',
    'investor.missingFields': 'Veuillez remplir le Nom, l\'Organisation et l\'E-mail.',
    'investor.pdfDownloaded': 'Pitch Deck Officiel Téléchargé (PDF)',

    // FAQ
    'faq.tag': 'Foire Aux Questions',
    'faq.title': 'FAQ Sécurité Post-Quantique',
    'faq.subtitle': 'Réponses aux questions courantes rédigées par des cryptographes de défense et ingénieurs en sécurité mobile.',

    // CTI & Threat Intelligence
    'cti.tag': 'Flux de Renseignement sur les Menaces (CTI)',
    'cti.title': 'Traçage des Campagnes d\'Interception Quantique & APT',
    'cti.subtitle': 'Télémétrie en temps réel identifiant les groupes APT étatiques, l\'exploitation HNDL et les parades PQC.',
    'cti.activeApts': 'Groupes APT Surveillés',
    'cti.stixExport': 'Exporter le Rapport STIX 2.1 CTI',
    'cti.iocTitle': 'Indicateurs de Compromission (IoC) en Direct',
    'cti.mitreTitle': 'Matrice PQC MITRE ATT&CK Mobile',
    'cti.threatLevel': 'Niveau de Menace',
    'cti.mitigation': 'Statut PQC Q-CRYPT',
    'cti.hndlRisk': 'Indice de Risque HNDL',

    // Deep PQC Elaboration
    'pqc.tag': 'Architecture Cryptographique Approfondie',
    'pqc.title': 'Solution Mathématique & Matérielle Post-Quantique',
    'pqc.subtitle': 'Comment Q-CRYPT met en œuvre les normes officielles NIST FIPS 203 & 204 pour éliminer les risques de déchiffrement quantique.',
    'pqc.mlKemTitle': 'NIST FIPS 203 : ML-KEM-1024 (Kyber)',
    'pqc.mlKemDesc': 'Encapsulation de clé basée sur les réseaux euclidiens dans des anneaux polynomiaux à 1024 dimensions avec bruit gaussien. Mathématiquement insensible à l\'algorithme de Shor.',
    'pqc.mlDsaTitle': 'NIST FIPS 204 : ML-DSA-87 (Dilithium)',
    'pqc.mlDsaDesc': 'Signatures numériques post-quantiques garantissant l\'authentification infalsifiable des messages et des identités par échantillonnage de rejet.',
    'pqc.hndlTitle': 'Bouclier Anti-HNDL (Harvest-Now-Decrypt-Later)',
    'pqc.hndlDesc': 'Neutralise l\'interception passive par des acteurs étatiques stockant le trafic chiffré aujourd\'hui pour le déchiffrer lors de l\'arrivée des ordinateurs quantiques.',
    'pqc.hybridTitle': 'Enveloppe Hybride à Double Couche',
    'pqc.hybridDesc': 'Associe l\'échange classique par courbe elliptique (X25519) à ML-KEM-1024 dans une enveloppe imbriquée HKDF-SHA3-512 pour une sécurité en profondeur.',
    'pqc.hardwareTitle': 'Ancrage Matériel Titan M2 & StrongBox',
    'pqc.hardwareDesc': 'Les clés sont générées et scellées au sein des puces de sécurité matérielles Android, empêchant toute extraction en mémoire même en cas d\'accès root.',

    // Footer
    'footer.description': 'Plateforme de messagerie Android chiffrée par réseaux euclidiens post-quantiques. Conforme aux normes NIST FIPS 203 (ML-KEM-1024) et FIPS 204 (ML-DSA-87).',
    'footer.nodesStatus': 'Réseau de Relais Peer-to-Peer (P2P) Décentralisé : Actif',
    'footer.tagline': 'Communications Sécurisées Post-Quantiques pour Entreprises et Défense.',
    'footer.rights': 'Tous Droits Réservés. Conforme NIST FIPS 203 & 204.',
    'footer.portalSections': 'Modules & Portails de la Plateforme',
    'footer.androidPreviews': 'Aperçus Android & Compilations',
    'footer.apkDownload': 'Télécharger l\'APK Android',
    'footer.kyberDemo': 'Démonstrateur d\'Échange de Clés Post-Quantique',
    'footer.hwEnclave': 'Diagnostic de l\'Enclave Matérielle',
    'footer.enterpriseTrial': 'Demander un Essai Entreprise & SLA',
    'footer.ctiFeed': 'Flux de Renseignement sur les Menaces (CTI)',
    'footer.matrixComp': 'Matrice Comparative des Fonctionnalités',
    'footer.sharedApplet': 'Application de Production Partagée',
    'footer.devBuild': 'Espace de Développement',
    'footer.complianceTitle': 'Conformité Cryptographique',
    'footer.nistSpec': 'NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA)',
    'footer.cat5': 'Immunité de Catégorie 5 (256-bit Quantique)',
    'footer.hardwareEnclave': 'Isolation Matérielle Titan M2 & Knox Vault',
    'footer.zeroMetadata': 'Zéro Métadonnée & Relais Éphémères P2P',

    // Geo & Lang UI
    'lang.select': 'Langue / Région',
    'lang.autoGeo': 'Géo-Détecté',

    // Scrambler
    'scrambler.title': 'Bac à sable d\'encodage quantique interactif',
    'scrambler.live': 'Aperçu en direct',
    'scrambler.sub': 'Tapez n\'importe quel message ci-dessous pour le voir se transformer en code mathématique inviolable',
    'scrambler.inputLabel': 'Texte en clair',
    'scrambler.placeholder': 'Saisissez du texte à chiffrer...',
    'scrambler.strength': 'Force du chiffrement & Complexité mathématique',
    'scrambler.plainExplained': 'En clair : Ajuster ce paramètre ajoute des couches de bruit mathématique pour garantir qu\'aucun supercalculateur ne puisse deviner la clé.',
    'scrambler.matrixLabel': 'Matrice polynomiale sur réseau Modulo q=3329 :',
    'scrambler.outputTitle': 'Texte Chiffré Quantique',
    'scrambler.computing': 'Calcul de la matrice polynomiale...',
    'scrambler.note': 'Les attaques quantiques (algorithme de Shor) ne peuvent pas décomposer les vecteurs matriciels.',
    'scrambler.copyBtn': 'Copier le texte chiffré',
    'scrambler.copySuccess': 'Vecteur de réseau copié dans le presse-papier',

    // Hardware Details
    'hw.selectModel': 'Sélectionner le modèle d\'appareil :',
    'hw.platform': 'Plateforme',
    'hw.secProcessor': 'PROCESSEUR DE SÉCURITÉ / CHIPSET',
    'hw.isolationAudit': 'AUDIT D\'ISOLATION CRYPTOGRAPHIQUE :',
    'hw.f1Title': 'Magasin de Clés StrongBox',
    'hw.f1Sub': 'Clé Privée Isolée Matériellement',
    'hw.f2Title': 'Isolation par Réseau ML-KEM',
    'hw.f2Sub': 'Bouclier Anti-Bruit Kyber-1024',
    'hw.f3Title': 'Maillage Physique Anti-Altération',
    'hw.f3Sub': 'Remise à Zéro en Cas de Sonde Active',
    'hw.f4Title': 'Marquage Mémoire (MTE)',
    'hw.f4Sub': 'Évite les Exploits de Sécurité Mémoire',
    'hw.auditSummary': 'RÉSUMÉ D\'AUDIT MATÉRIEL EXPERT :',
    'hw.recProfile': 'Profil Q-CRYPT Recommandé :',
    'hw.gradeA': 'Mode Post-Quantique Grade-A',

    // PQC Code & Developer Resources
    'pqcCode.title': 'Fondations Techniques de la Cryptographie Post-Quantique',
    'pqcCode.subtitle': 'Explorez les algorithmes C11 bas niveau, les coffres enclaves C++20, l\'assemblage SIMD x86_64/ARM64, les bacs à sable interactifs et les chaînes de compilation NIST FIPS 203.',
    'pqcCode.sndlTitle': 'Pourquoi la PQC est Essentielle : Neutraliser la Menace "Stockage Préventif" (SNDL)',
    'pqcCode.sndlDesc': 'Le stockage préventif (SNDL) permet aux cyberattaquants d\'enregistrer le trafic chiffré aujourd\'hui pour le déchiffrer dès l\'arrivée des ordinateurs quantiques. La cryptographie sur réseaux Q-CRYPT (NIST FIPS 203) neutralise cette menace.',
    'pqcCode.sandboxTitle': 'Simulateur de Résistance Quantique et Force d\'Algorithme',
    'pqcCode.sandboxSub': 'Sélectionnez un algorithme pour analyser ses métriques de vulnérabilité quantique',
    'pqcCode.glossaryTitle': 'Glossaire et Guide des Concepts de Sécurité Quantique',
    'pqcCode.glossarySub': 'Explications simples et analogies claires pour décideurs et utilisateurs non techniciens',
    'pqcCode.copyCode': 'Copier l\'extrait',
    'pqcCode.copiedCode': 'Copié dans le presse-papier !',
    'pqcCode.showCode': 'Afficher le Code C/C++ et Assembleur',
    'pqcCode.hideCode': 'Masquer le Bloc de Code',
    'pqcCode.showBuild': 'Afficher les Scripts de Compilation',
    'pqcCode.hideBuild': 'Masquer les Scripts',
    'pqcCode.codeHidden': 'Code source masqué pour une meilleure visibilité. Cliquez ci-dessus pour afficher.',
    'pqcCode.printBtn': 'Imprimer les Ressources (PDF)',
    'pqcCode.complexity': 'Complexité :',
    'pqcCode.beginner': 'Débutant',
    'pqcCode.advanced': 'Avancé',
    'pqcCode.expert': 'Expert',
    'pqcCode.roadmapTitle': 'Feuille de Route de Mise en Œuvre Post-Quantique',
    'pqcCode.roadmapSub': 'Calendrier de migration stratégique des algorithmes classiques vers NIST FIPS 203/204.',
    'pqcCode.quizTitle': 'Évaluation des Connaissances en Sécurité',
    'pqcCode.quizSub': 'Testez votre compréhension de la cryptographie post-quantique et des principes Q-CRYPT.',
    'pqcCode.quizRestart': 'Recommencer le Quiz',
    'pqcCode.quizScore': 'Votre Score au Quiz :',
    'pqcCode.benchmarkTitle': 'Banc d\'Essai de Performance PQC et Charge Utile Réseau',
    'pqcCode.benchmarkSub': 'Simulez le nombre de cycles CPU, la taille des clés et la fragmentation des paquets IP selon les architectures.',

    // Audit Status
    'audit.title': 'Statut des Audits de Sécurité et Certifications Tiers',
    'audit.subtitle': 'Audité de façon indépendante par les laboratoires cryptographiques mondiaux NIST, BSI, Trail of Bits et Ernst & Young.',
    'audit.badge': 'Vérification Continue',
    'audit.auto': 'Rotation Auto',
    'audit.paused': 'En Pause',
    'audit.auditor': 'Auditeur Indépendant',
    'audit.docRef': 'Réf Document Audit',
    'audit.seal': 'Sceau d\'Empreinte SHA-256',
    'audit.copySeal': 'Copier le Sceau de Vérification',
    'audit.sealCopied': 'Sceau Copié !',
    'audit.inspectCert': 'Inspecter le Certificat d\'Audit Complet',
    'audit.auditedOn': 'Audité le :',
    'audit.validUntil': 'Valide jusqu\'à :',
    'audit.scope': 'Périmètre de l\'Audit :',
  },
  de: {
    // Navbar & Banners
    'nav.threat': 'Netzwerk-Bedrohungsstufe',
    'nav.cti': 'Threat Intelligence (CTI)',
    'nav.pqc': 'PQC Mathe Spec',
    'nav.apk': 'APK Herunterladen',
    'nav.keyDemo': 'Quanten-Schlüssel Demo',
    'nav.comparison': 'Sicherheitsvergleich',
    'nav.buyerValue': 'CISO-Mehrwert & ROI',
    'nav.ratings': 'Branchenbewertungen',
    'nav.hardware': 'Hardware-Enklave',
    'nav.enterprise': 'Enterprise Testversion',
    'nav.investor': 'Investor Relations & Deck',
    'nav.faq': 'Häufige Fragen',
    'nav.status': 'Quantensicher Aktiv',
    'nav.launchApp': 'App Starten',
    'nav.investorBadge': 'Series-A / TAM $42B',
    'nav.bannerTitle': 'SERIES-A INVESTITIONSMÖGLICHKEIT:',
    'nav.bannerText': 'Post-Quanten-Sicherheit TAM $42B • NIST FIPS 203/204 Konform',
    'nav.investorBriefing': 'Investor Briefing & Deck',
    'nav.statusChecking': 'Prüfe Systemfähigkeiten...',
    'nav.statusFallback': 'PQC Ersatzmodus Aktiv',
    'nav.statusVerified': 'Verifiziert nach NIST FIPS 203 Post-Quanten-Standard.',
    'nav.copyDeckUrl': 'Pitch-Deck & Data-Room-Link kopieren',
    'nav.scheduleBriefing': 'CISO / Investor Briefing vereinbaren',
    'nav.strategicMoat': 'Strategischer Wettbewerbsvorteil',

    // Hero
    'hero.badge': 'NIST FIPS 203 & 204 Zertifiziert',
    'hero.title1': 'Post-Quanten Mobile Sicherheit',
    'hero.title2': 'Für Unternehmen & Verteidigung',
    'hero.subtitle': 'Quantum Messenger (Q-CRYPT) ist die hochsichere Messaging-App zum Schutz Ihrer vertraulichen mobilen Kommunikation vor Abfangen und Entschlüsselung durch Supercomputer.',
    'hero.plainEnglishTitle': 'Einfach erklärt:',
    'hero.plainEnglishBody': 'Standard-Messenger wie WhatsApp oder Signal können von zukünftigen Quanten-Supercomputern entschlüsselt werden. Q-CRYPT nutzt NIST-zertifizierte mathematische Schlösser, die unknackbar sind.',
    'hero.btnApk': 'Signierte APK herunterladen (v2.4.0)',
    'hero.btnEnterprise': 'Enterprise-Test & SLA',
    'hero.btnDemo': 'Kyber-1024 Demo',

    // Ticker
    'ticker.live': 'Live-Netzwerk- & Enklave-Telemetrie',
    'ticker.updated': 'Echtzeit-Aktualisierung',
    'ticker.activeDevices': 'Angeforderte Enterprise-Zugänge',
    'ticker.newSeats': 'Aktive Audit- & Test-Abonnements',
    'ticker.sessions': 'Lokaler Enklave-Kanal',
    'ticker.incidents': 'Sicherheits-Audits',
    'ticker.reach': 'Relais-Enklaven',

    // Threat Dashboard
    'threat.title': 'Echtzeit-Bedrohungsmonitor & Sicherheitsstatus',
    'threat.status': 'STATUS: 100% SICHER',
    'threat.subtitle': 'Automatische Echtzeit-Überwachung von Netzwerksicherheit, Serververbindungen und Verschlüsselungsstärke',
    'threat.copy': 'Telemetrie-Daten Kopieren',

    // Global Map
    'map.tag': 'Mobiles Souveränes Netz',
    'map.title': 'Verschlüsselte Knoten-Routing-Karte',
    'map.subtitle': 'Aktive souveräne Knoten für minimale Latenz und Ausfallsicherheit.',

    // APK Portal
    'apk.tag': 'Offizielles Download-Portal',
    'apk.title': 'Direkter APK-Download & Integritätsprüfung',
    'apk.subtitle': 'Erhalten Sie signierte Standalone-Android-Binärdateien für angepasste Android-Betriebssysteme mit gehärtetem Kernel und MDM-Container.',
    'apk.stable': 'STABILE VERSION',
    'apk.build': 'Version 2026.07.25',
    'apk.btnDownload': 'Geprüfte APK herunterladen',
    'apk.copyHash': 'SHA-256 Hash kopieren',

    // Key Demo
    'keyDemo.tag': 'Live-Krypto-Demonstration im Browser',
    'keyDemo.title': 'Interaktiver Quantenschlüssel-Simulator',
    'keyDemo.subtitle': 'Testen Sie in Echtzeit, wie Q-CRYPT unknackbare Verschlüsselungsschlüssel generiert und austauscht.',
    'keyDemo.plainTitle': 'Einfach erklärt:',
    'keyDemo.plainBody': 'Bevor eine Nachricht gesendet wird, vereinbaren Ihr Telefon und das des Empfängers einen geheimen Schlüssel. Schritt 1 erzeugt Schlüssel, Schritt 2 verschließt den Schlüssel im Tresor, Schritt 3 öffnet ihn.',

    // Comparison Table
    'comparison.tag': 'Klarer Sicherheitsvergleich',
    'comparison.title': 'Warum Q-CRYPT Standard-Apps übertrifft',
    'comparison.subtitle': 'Standard-Apps schützen vor Bedrohungen von gestern. Q-CRYPT ist für das Quantenzeitalter mit Zero-Trust-Datenschutz entwickelt.',
    'comparison.qcrypt': 'Q-CRYPT Quanten',
    'comparison.standard': 'Standard-Apps',
    'comparison.corporate': 'Unternehmens-Chat',

    // CISO Value & ROI
    'buyerValue.tag': 'Strategischer Mehrwert & Risikominimierung',
    'buyerValue.title': 'Strategischer Mehrwert für CISOs & Sicherheitsleiter',
    'buyerValue.subtitle': 'Warum führende Sicherheitsexperten herkömmliche Firmen-Messenger durch Post-Quanten-Schutz ersetzen.',

    // Testimonials
    'testimonials.tag': 'Strenge Vertraulichkeit • Identität Geschützt',
    'testimonials.title': 'Vertraut von Branchenführern & Sicherheitsanalysten',
    'testimonials.subtitle': 'Aufgrund vertraulicher Vereinbarungen und Sicherheitsbestimmungen bleiben Kundenidentitäten anonym.',

    // Hardware
    'hardware.tag': 'Hardware & Sicherheits-Chips',
    'hardware.title': 'Kompatible Sicherheitschips & Mobil-OS',
    'hardware.subtitle': 'Q-CRYPT verbindet sich direkt mit dem Hardware-Sicherheits-Chip Ihres Smartphones.',

    // Enterprise Trial
    'enterprise.tag': 'Enterprise-Portal',
    'enterprise.title': 'Enterprise-Test & Sicherheits-SLA anfordern',
    'enterprise.subtitle': 'Richten Sie Q-CRYPT in Ihrer Organisation mit eigenen MDM-Richtlinien und 24/7 CISO-Support ein.',

    // Investor Relations & Pitch Deck
    'investor.tag': 'Series-A Investor Briefing',
    'investor.title': 'Investor Relations & Präsentations-Deck',
    'investor.subtitle': 'Post-Quanten-Sicherheitsinfrastruktur für Mobilgeräte • Marktpotenzial $42 Milliarden',
    'investor.btnDownloadPdf': 'Pitch Deck herunterladen (PDF)',
    'investor.tam': 'Weltweiter Markt (TAM)',
    'investor.arr': 'Enterprise ARR / Lizenz',
    'investor.seats': 'Aktive Test-Lizenzen',
    'investor.growth': 'Quartalswachstum',
    'investor.contactTitle': 'Unternehmenskontakte-Verzeichnis (Firebase Firestore Synchronisiert)',
    'investor.contactSubtitle': 'Echtzeit-CISO-Kontakte und Investoren-Anfragen in der Firebase-Datenbank gespeichert.',
    'investor.addContact': 'Unternehmenskontakt Hinzufügen',
    'investor.name': 'Kontaktname',
    'investor.company': 'Unternehmen / VC-Firma',
    'investor.email': 'Offizielle E-Mail',
    'investor.role': 'Führungsposition',
    'investor.investmentInterest': 'Investitionsinteresse / Lizenzen',
    'investor.saveSuccess': 'Unternehmenskontakt in Firebase-Datenbank gespeichert!',
    'investor.missingFields': 'Bitte Name, Unternehmen und E-Mail ausfüllen.',
    'investor.pdfDownloaded': 'Offizielles Pitch Deck heruntergeladen (PDF)',

    // FAQ
    'faq.tag': 'Häufig gestellte Fragen',
    'faq.title': 'Post-Quanten-Sicherheit FAQ',
    'faq.subtitle': 'Antworten von Kryptographen und mobilen Sicherheitsexperten.',

    // CTI & Threat Intelligence
    'cti.tag': 'Cyber Threat Intelligence (CTI) Feed',
    'cti.title': 'Quanten-Abfangkampagnen & APT-Verfolgung',
    'cti.subtitle': 'Echtzeit-Bedrohungstelemetrie zur Erfassung staatlicher APT-Gruppen, HNDL-Exploits und PQC-Gegenmaßnahmen.',
    'cti.activeApts': 'Überwachte APT-Gruppen',
    'cti.stixExport': 'STIX 2.1 CTI-Bericht Exportieren',
    'cti.iocTitle': 'Live Indicators of Compromise (IoC)',
    'cti.mitreTitle': 'PQC MITRE ATT&CK Mobile Matrix',
    'cti.threatLevel': 'Bedrohungsstufe',
    'cti.mitigation': 'Q-CRYPT PQC Status',
    'cti.hndlRisk': 'HNDL-Risikoindex',

    // Deep PQC Elaboration
    'pqc.tag': 'Kryptographische Architektur',
    'pqc.title': 'Mathematische & Hardware-Lösung für PQC',
    'pqc.subtitle': 'Wie Q-CRYPT die offiziellen Standards NIST FIPS 203 & 204 umsetzt, um Entschlüsselungsrisiken vollständig zu eliminieren.',
    'pqc.mlKemTitle': 'NIST FIPS 203: ML-KEM-1024 (Kyber)',
    'pqc.mlKemDesc': 'Gitterbasierte Schlüsselkapselung in 1024-dimensionalen Polynomringen mit Gaußschem Rauschen. Mathematisch immun gegen den Shor-Algorithmus.',
    'pqc.mlDsaTitle': 'NIST FIPS 204: ML-DSA-87 (Dilithium)',
    'pqc.mlDsaDesc': 'Post-Quanten digitale Signaturen zur fälschungssicheren Nachrichtenauthentifizierung und Identitätsprüfung über Gitterstrukturen.',
    'pqc.hndlTitle': 'Anti-HNDL Schutzschild (Harvest-Now-Decrypt-Later)',
    'pqc.hndlDesc': 'Neutralisiert das passive Abfangen durch staatliche Akteure, die heute verschlüsselten Datenverkehr speichern, um ihn später per Quantencomputer zu entschlüsseln.',
    'pqc.hybridTitle': 'Zweischichtige Hybrid-Kapselung',
    'pqc.hybridDesc': 'Kombiniert klassische Elliptische-Kurven-Kryptographie (X25519) mit ML-KEM-1024 in einem verschachtelten HKDF-SHA3-512 Umschlag für Tiefenschutz.',
    'pqc.hardwareTitle': 'Titan M2 & StrongBox Hardware-Anbindung',
    'pqc.hardwareDesc': 'Schlüssel werden direkt in den Android-Hardware-Sicherheitschips erzeugt und versiegelt – geschützt vor Speicherauslesen selbst bei Root-Zugriff.',

    // Footer
    'footer.description': 'Gitterbasierte post-quantenverschlüsselte Android-Messaging-Plattform. Konform mit NIST FIPS 203 (ML-KEM-1024) und FIPS 204 (ML-DSA-87).',
    'footer.nodesStatus': 'Dezentrales Peer-to-Peer (P2P) Relay-Netzwerk: Aktiv',
    'footer.tagline': 'Quantensichere Kommunikation für Unternehmen & Verteidigung.',
    'footer.rights': 'Alle Rechte vorbehalten. NIST FIPS 203 & 204 konform.',
    'footer.portalSections': 'Plattformmodule & Portale',
    'footer.androidPreviews': 'Android-Vorschauen & Builds',
    'footer.apkDownload': 'Android APK Herunterladen',
    'footer.kyberDemo': 'Post-Quanten Schlüsselaustausch-Demo',
    'footer.hwEnclave': 'Hardware-Enklaven-Diagnose',
    'footer.enterpriseTrial': 'Enterprise-Testversion & SLA Anfordern',
    'footer.ctiFeed': 'Threat Intelligence Feed (CTI)',
    'footer.matrixComp': 'Funktions-Vergleichsmatrix',
    'footer.sharedApplet': 'Geteilte Produktions-App',
    'footer.devBuild': 'Entwickler-Container Workspace',
    'footer.complianceTitle': 'Kryptografische Konformität',
    'footer.nistSpec': 'NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA)',
    'footer.cat5': 'Kategorie 5 (256-Bit Quanten) Immunität',
    'footer.hardwareEnclave': 'Titan M2 & Knox Vault Hardware-Isolierung',
    'footer.zeroMetadata': 'Null Metadaten & Ephemere P2P-Relays',

    // Geo & Lang UI
    'lang.select': 'Sprache / Region',
    'lang.autoGeo': 'Geo-Erkannt',
  },
  es: {
    // Navbar & Banners
    'nav.threat': 'Nivel de Amenaza de Red',
    'nav.cti': 'Inteligencia de Amenazas (CTI)',
    'nav.pqc': 'Espec. Matemática PQC',
    'nav.apk': 'Descargar APK',
    'nav.keyDemo': 'Demo de Clave Cuántica',
    'nav.comparison': 'Comparativa de Seguridad',
    'nav.buyerValue': 'Valor CISO y ROI',
    'nav.ratings': 'Valoraciones Sectoriales',
    'nav.hardware': 'Enclave de Hardware',
    'nav.enterprise': 'Prueba Corporativa',
    'nav.investor': 'Inversores y Pitch Deck',
    'nav.faq': 'Preguntas Frecuentes',
    'nav.status': 'Seguridad Cuántica Activa',
    'nav.launchApp': 'Abrir Entorno Sandbox',
    'nav.investorBadge': 'Serie-A / TAM $42B',
    'nav.bannerTitle': 'OPORTUNIDAD DE INVERSIÓN SERIE-A:',
    'nav.bannerText': 'Seguridad Post-Cuántica TAM $42B • Conforme a NIST FIPS 203/204',
    'nav.investorBriefing': 'Informe de Inversores y Deck',
    'nav.statusChecking': 'Verificando capacidades...',
    'nav.statusFallback': 'Modo de Respaldo PQC Activo',
    'nav.statusVerified': 'Verificado con el estándar post-cuántico NIST FIPS 203.',
    'nav.copyDeckUrl': 'Copiar Enlace del Deck y Data Room',
    'nav.scheduleBriefing': 'Programar Reunión con CISO / Inversor',
    'nav.strategicMoat': 'Ventaja Estratégica y Técnica',

    // Hero
    'hero.badge': 'Certificación NIST FIPS 203 y 204',
    'hero.title1': 'Seguridad Móvil Post-Cuántica',
    'hero.title2': 'Para Empresas y Defensa',
    'hero.subtitle': 'Quantum Messenger (Q-CRYPT) es la aplicación de mensajería ultrasegura diseñada para proteger sus comunicaciones móviles privadas frente a la interceptación por superordenadores.',
    'hero.plainEnglishTitle': 'En pocas palabras:',
    'hero.plainEnglishBody': 'Las aplicaciones estándar como WhatsApp o Signal podrán ser descifradas por futuros superordenadores cuánticos. Q-CRYPT utiliza candados matemáticos aprobados por el NIST imposibles de romper.',
    'hero.btnApk': 'Descargar APK Firmada (v2.4.0)',
    'hero.btnEnterprise': 'Prueba Corporativa y SLA',
    'hero.btnDemo': 'Demostración Kyber-1024',

    // Ticker
    'ticker.live': 'Telemetría de Red y Enclave en Vivo',
    'ticker.updated': 'Actualizado en Tiempo Real',
    'ticker.activeDevices': 'Accesos Piloto Empresariales Solicitados',
    'ticker.newSeats': 'Suscripciones y Auditorías Activas',
    'ticker.sessions': 'Canal de Enclave Local',
    'ticker.incidents': 'Auditorías de Interceptación',
    'ticker.reach': 'Enclaves de Relé',

    // Threat Dashboard
    'threat.title': 'Monitor de Amenazas en Tiempo Real',
    'threat.status': 'ESTADO: 100% SEGURO',
    'threat.subtitle': 'Supervisión automatizada en tiempo real de la seguridad de la red y el cifrado',
    'threat.copy': 'Copiar Telemetría de Amenazas',

    // Global Map
    'map.tag': 'Red Soberana Global',
    'map.title': 'Mapa de Enrutamiento de Nodos Cifrados',
    'map.subtitle': 'Nodos soberanos activos que garantizan mínima latencia y cero puntos de fallo.',

    // APK Portal
    'apk.tag': 'Portal Oficial de Descarga',
    'apk.title': 'Descarga Directa de APK y Verificación de Integridad',
    'apk.subtitle': 'Obtenga binarios Android independientes y firmados para sistemas Android personalizados con núcleo altamente seguro y contenedores MDM.',
    'apk.stable': 'VERSIÓN ESTABLE',
    'apk.build': 'Compilación 2026.07.25',
    'apk.btnDownload': 'Descargar APK Verificada',
    'apk.copyHash': 'Copiar Hash SHA-256',

    // Key Demo
    'keyDemo.tag': 'Demostración Criptográfica en Vivo',
    'keyDemo.title': 'Simulador Interactivo de Intercambio de Clave Cuántica',
    'keyDemo.subtitle': 'Pruebe en tiempo real cómo Q-CRYPT genera e intercambia claves cifradas inviolables.',
    'keyDemo.plainTitle': 'Cómo funciona en sencillo:',
    'keyDemo.plainBody': 'Antes de enviar un mensaje, su teléfono y el del destinatario acuerdan una clave secreta mediante matemáticas cuánticas. El Paso 1 crea claves, el Paso 2 guarda la clave de sesión en una bóveda, y el Paso 3 la abre.',

    // Comparison Table
    'comparison.tag': 'Comparativa Clara de Seguridad',
    'comparison.title': 'Por qué Q-CRYPT Supera a las Aplicaciones Estándar',
    'comparison.subtitle': 'Las apps comunes protegen frente a las amenazas del pasado. Q-CRYPT está diseñada para la era cuántica con privacidad de cero confianza.',
    'comparison.qcrypt': 'Q-CRYPT Cuántico',
    'comparison.standard': 'Apps Estándar',
    'comparison.corporate': 'Chat Empresarial',

    // CISO Value & ROI
    'buyerValue.tag': 'Valor Estratégico y Mitigación de Riesgos',
    'buyerValue.title': 'Valor Estratégico para CISOs y Líderes de Seguridad',
    'buyerValue.subtitle': 'Por qué los líderes en ciberseguridad reemplazan la mensajería corporativa por defensa post-cuántica.',

    // Testimonials
    'testimonials.tag': 'Confidencialidad Estricta • Identidad Protegida',
    'testimonials.title': 'Con la Confianza de Líderes del Sector y Analistas',
    'testimonials.subtitle': 'Debido a estrictos acuerdos de confidencialidad, las identidades de nuestros clientes permanecen protegidas.',

    // Hardware
    'hardware.tag': 'Compatibilidad de Hardware y Enclave',
    'hardware.title': 'Chips de Seguridad y SO Móviles Compatibles',
    'hardware.subtitle': 'Q-CRYPT se conecta directamente con el enclave de seguridad física de su dispositivo.',

    // Enterprise Trial
    'enterprise.tag': 'Portal de Integración Empresarial',
    'enterprise.title': 'Solicitar Prueba Corporativa y SLA de Seguridad',
    'enterprise.subtitle': 'Despliegue Q-CRYPT en su organización con políticas MDM personalizadas y soporte CISO 24/7.',

    // Investor Relations & Pitch Deck
    'investor.tag': 'Informe de Inversores Serie-A',
    'investor.title': 'Relaciones con Inversores y Pitch Deck',
    'investor.subtitle': 'Infraestructura de Ciberseguridad Móvil Post-Cuántica • Mercado Objetivo $42 Mil Millones',
    'investor.btnDownloadPdf': 'Descargar Pitch Deck (PDF)',
    'investor.tam': 'Mercado Global (TAM)',
    'investor.arr': 'ARR Empresarial por Licencia',
    'investor.seats': 'Licencias Piloto Activas',
    'investor.growth': 'Crecimiento Trimestral',
    'investor.contactTitle': 'Directorio de Contactos Empresariales (Sincronizado con Firebase Firestore)',
    'investor.contactSubtitle': 'Contactos de CISOs y consultas de inversores guardados en tiempo real en la base de datos Firebase.',
    'investor.addContact': 'Agregar Contacto Empresarial',
    'investor.name': 'Nombre de Contacto',
    'investor.company': 'Organización / Fondo VC',
    'investor.email': 'Correo Oficial',
    'investor.role': 'Cargo Ejecutivo',
    'investor.investmentInterest': 'Interés de Inversión / Licencias',
    'investor.saveSuccess': '¡Contacto Empresarial Guardado en la Base de Datos Firebase!',
    'investor.missingFields': 'Por favor ingrese Nombre, Organización y Correo.',
    'investor.pdfDownloaded': 'Pitch Deck Oficial Descargado (PDF)',

    // FAQ
    'faq.tag': 'Preguntas Frecuentes',
    'faq.title': 'Preguntas Frecuentes sobre Seguridad Post-Cuántica',
    'faq.subtitle': 'Respuestas elaboradas por criptógrafos de defensa e ingenieros en seguridad móvil.',

    // CTI & Threat Intelligence
    'cti.tag': 'Feed de Inteligencia de Ciberamenazas (CTI)',
    'cti.title': 'Rastreo de Campañas de Intercepción Cuántica y Grupos APT',
    'cti.subtitle': 'Telemetría en tiempo real que identifica grupos APT estatales, ataques HNDL y defensas PQC.',
    'cti.activeApts': 'Grupos APT Monitorizados',
    'cti.stixExport': 'Exportar Informe STIX 2.1 CTI',
    'cti.iocTitle': 'Indicadores de Compromiso (IoC) en Vivo',
    'cti.mitreTitle': 'Matrice PQC MITRE ATT&CK Mobile',
    'cti.threatLevel': 'Nivel de Amenaza',
    'cti.mitigation': 'Estado PQC Q-CRYPT',
    'cti.hndlRisk': 'Índice de Riesgo HNDL',

    // Deep PQC Elaboration
    'pqc.tag': 'Arquitectura Criptográfica Avanzada',
    'pqc.title': 'Solución Matemática y de Hardware Post-Cuántica',
    'pqc.subtitle': 'Cómo Q-CRYPT implementa los estándares oficiales NIST FIPS 203 y 204 para anular los riesgos de descifrado cuántico.',
    'pqc.mlKemTitle': 'NIST FIPS 203: ML-KEM-1024 (Kyber)',
    'pqc.mlKemDesc': 'Encapsulamiento de claves basado en retículos en anillos polinomiales de 1024 dimensiones con ruido gaussiano. Matemáticamente inmune al algoritmo de Shor.',
    'pqc.mlDsaTitle': 'NIST FIPS 204: ML-DSA-87 (Dilithium)',
    'pqc.mlDsaDesc': 'Firma digital post-cuántica que garantiza autenticación e identidad de mensajes infalsificables mediante muestreo de rechazo sobre retículos.',
    'pqc.hndlTitle': 'Escudo Anti-HNDL (Harvest-Now-Decrypt-Later)',
    'pqc.hndlDesc': 'Neutraliza la interceptación pasiva de actores estatales que almacenan tráfico cifrado hoy para descifrarlo en el futuro con ordenadores cuánticos.',
    'pqc.hybridTitle': 'Envolvente Híbrida de Doble Capa',
    'pqc.hybridDesc': 'Combina la criptografía clásica de curva elíptica (X25519) con ML-KEM-1024 en un sobre anidado HKDF-SHA3-512 para seguridad en profundidad.',
    'pqc.hardwareTitle': 'Anclaje de Hardware Titan M2 y StrongBox',
    'pqc.hardwareDesc': 'Las claves se generan y sellan en los módulos de seguridad física de Android, evitando la extracción en memoria incluso con permisos root.',

    // Footer
    'footer.description': 'Plataforma de mensajería Android cifrada mediante retículos post-cuánticos. Conforme a las normas NIST FIPS 203 (ML-KEM-1024) y FIPS 204 (ML-DSA-87).',
    'footer.nodesStatus': 'Red de Relés Peer-to-Peer (P2P) Descentralizada: Activa',
    'footer.tagline': 'Comunicaciones Seguras Post-Cuánticas para Empresas y Defensa.',
    'footer.rights': 'Todos los derechos reservados. Cumple con NIST FIPS 203 y 204.',
    'footer.portalSections': 'Módulos y Portales de la Plataforma',
    'footer.androidPreviews': 'Previsualizaciones Android y Compilaciones',
    'footer.apkDownload': 'Descargar APK Android',
    'footer.kyberDemo': 'Demostración de Intercambio de Claves Post-Cuántica',
    'footer.hwEnclave': 'Diagnóstico de Enclave de Hardware',
    'footer.enterpriseTrial': 'Solicitar Prueba de Empresa y SLA',
    'footer.ctiFeed': 'Canal de Inteligencia de Amenazas (CTI)',
    'footer.matrixComp': 'Matriz Comparativa de Funciones',
    'footer.sharedApplet': 'Aplicación de Producción Compartida',
    'footer.devBuild': 'Espacio de Trabajo de Desarrollo',
    'footer.complianceTitle': 'Conformidad Criptográfica',
    'footer.nistSpec': 'NIST FIPS 203 (ML-KEM) y FIPS 204 (ML-DSA)',
    'footer.cat5': 'Inmunidad de Categoría 5 (256 bits Cuántica)',
    'footer.hardwareEnclave': 'Aislamiento de Hardware Titan M2 y Knox Vault',
    'footer.zeroMetadata': 'Cero Metadatos y Relés Éfimeros P2P',

    // Geo & Lang UI
    'lang.select': 'Idioma / Región',
    'lang.autoGeo': 'Geo-Detectado',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [detectedRegion, setDetectedRegion] = useState<string>('Global / US / UK');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);

  useEffect(() => {
    const savedLang = typeof localStorage !== 'undefined' ? (localStorage.getItem('user_lang') as LanguageCode | null) : null;
    
    if (savedLang && ['en', 'fr', 'de', 'es'].includes(savedLang)) {
      setLanguageState(savedLang);
      setIsAutoDetected(false);
      const matchedOption = SUPPORTED_LANGUAGES.find((l) => l.code === savedLang);
      if (matchedOption) setDetectedRegion(matchedOption.name);
      return;
    }

    // Auto-detect browser language or default to English ('en')
    const userBrowserLang = typeof navigator !== 'undefined' ? (navigator.language || '').toLowerCase() : 'en';

    let matchedLang: LanguageCode = 'en';
    let regionName = 'Global / US / UK';

    if (userBrowserLang.startsWith('fr')) {
      matchedLang = 'fr';
      regionName = 'Europe (FR/BE/CH)';
    } else if (userBrowserLang.startsWith('de')) {
      matchedLang = 'de';
      regionName = 'Europe (DE/AT/CH)';
    } else if (userBrowserLang.startsWith('es')) {
      matchedLang = 'es';
      regionName = 'LatAm / Spain (ES/MX)';
    } else {
      matchedLang = 'en';
      regionName = 'Global / US / UK';
    }

    setLanguageState(matchedLang);
    setDetectedRegion(regionName);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setIsAutoDetected(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user_lang', lang);
    }
    
    const matchedOption = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    if (matchedOption) {
      setDetectedRegion(matchedOption.name);
    }
  };

  const t = (key: string): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, detectedRegion, isAutoDetected, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
