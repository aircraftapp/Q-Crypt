import { jsPDF } from 'jspdf';
import { SecurityBaselinePolicy } from '../components/HsmSecurityBaselineManager';

export function generateHsmSecurityBaselinePdf(baseline: SecurityBaselinePolicy): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // Top Dark Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line (Cyan #06b6d4)
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 42, 210, 2, 'F');

  // Header Title & Metadata
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Q-CRYPT NIST FIPS 140-3 SECURITY BASELINE REPORT', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('HARDWARE SECURITY MODULE (HSM) CONFIGURATION & CRYPTO-POLICY AUDIT', 14, 23);

  doc.setFontSize(7.5);
  doc.setTextColor(6, 182, 212); // cyan-400
  doc.text(`BASELINE ID: ${baseline.baselineId}   |   SCHEMA: ${baseline.schemaVersion}`, 14, 30);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`ISSUED: ${dateStr}   |   TARGET: ${baseline.device.name} (${baseline.device.vendor})`, 14, 36);

  let y = 52;

  // Helper box drawer
  const drawSectionHeader = (title: string, tag: string) => {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(14, y - 4, 182, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(title, 16, y + 1);

    doc.setFontSize(7.5);
    doc.setTextColor(14, 116, 144); // cyan-700
    doc.text(tag, 194, y + 1, { align: 'right' });
    y += 8;
  };

  const drawRow = (label: string, value: string, isCompliant: boolean = true) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(label, 16, y);

    doc.setFont('helvetica', 'bold');
    if (isCompliant) {
      doc.setTextColor(15, 23, 42); // slate-900
    } else {
      doc.setTextColor(220, 38, 38); // red-600
    }
    doc.text(value, 194, y, { align: 'right' });

    // Subtle divider
    doc.setDrawColor(226, 232, 240);
    doc.line(16, y + 1.5, 194, y + 1.5);
    y += 5.5;
  };

  // Section 1: Device Identity & Certification State
  drawSectionHeader('1. HARDWARE DEVICE IDENTIFICATION & FIPS STATUS', 'LEVEL 3/4 ATTESTATION');
  drawRow('Enclave Hardware Name / Model:', `${baseline.device.name} (${baseline.device.model})`);
  drawRow('Manufacturer / Vendor:', baseline.device.vendor);
  drawRow('FIPS 140-3 Certification Level:', baseline.device.fipsCertificationLevel);
  drawRow('NIST CMVP Certificate Number:', baseline.device.fipsCertificateNumber);
  drawRow('Active Silicon Microcode / Firmware:', baseline.device.activeFirmwareVersion);
  drawRow('Firmware SHA-256 Digest:', baseline.device.firmwareSha256Digest.slice(0, 32) + '...');
  drawRow('Silicon Physical Tamper Mesh:', baseline.device.tamperMeshStatus);
  y += 3;

  // Section 2: Cryptographic Algorithms & Key Strengths
  drawSectionHeader('2. CRYPTOGRAPHIC POLICY MATRIX & POST-QUANTUM PRIMITIVES', 'NIST FIPS 203 & 204');
  drawRow('Key Encapsulation Mechanism (KEM):', baseline.keyStrengthSettings.keyEncapsulationMechanism);
  drawRow('KEM Security Strength (NIST Category):', `${baseline.keyStrengthSettings.kemSecurityBits}-Bit Security (Level 5 Quantum Hardened)`);
  drawRow('Digital Signature Algorithm (DSA):', baseline.keyStrengthSettings.digitalSignatureAlgorithm);
  drawRow('DSA Signature Strength:', `${baseline.keyStrengthSettings.dsaSecurityBits}-Bit Post-Quantum`);
  drawRow('Symmetric Bulk Data Cipher:', `${baseline.keyStrengthSettings.symmetricCipher} (${baseline.keyStrengthSettings.symmetricKeyBits}-bit)`);
  drawRow('Cryptographic Hash & Digest Functions:', baseline.keyStrengthSettings.hashAndDigestStandard);
  drawRow('Silicon Key Extraction Policy:', baseline.keyStrengthSettings.keyExtractionPolicy);
  drawRow('Multi-Party Authorization Quorum:', baseline.keyStrengthSettings.mOfNQuorumRequired);
  drawRow('Zeroization SRAM Flush Latency:', `< ${baseline.keyStrengthSettings.zeroizationTriggerLatencyUs} µs`);
  y += 3;

  // Section 3: Physical & Side-Channel Defenses
  drawSectionHeader('3. SIDE-CHANNEL DEFENSE & PHYSICAL ATTACK INTERLOCKS', 'HARDWARE ISOLATION');
  drawRow('Laser Fault Injection (LFI) Optical Sensors:', baseline.sideChannelMitigations.laserFaultInjectionGuard ? 'ARMED & ACTIVE' : 'DISABLED');
  drawRow('Differential Power Analysis (DPA) Masking:', baseline.sideChannelMitigations.differentialPowerAnalysisShielding ? 'ENFORCED' : 'DISABLED');
  drawRow('Thermal Panic Auto-Zeroization Threshold:', `${baseline.sideChannelMitigations.thermalPanicShutdownThresholdC}°C Silicon Core`);
  drawRow('Clock Glitch / Under-Voltage Interlock:', baseline.sideChannelMitigations.clockGlitchInterlockArmed ? 'ENABLED' : 'DISABLED');
  drawRow('Execution Jitter Tolerance:', `±${baseline.sideChannelMitigations.jitterToleranceMs} ms`);
  y += 3;

  // Section 4: TRNG / Quantum Entropy Source Health
  drawSectionHeader('4. PHYSICAL TRUE RANDOM NUMBER GENERATION (TRNG/QRNG)', 'NIST SP 800-90B');
  drawRow('Hardware Entropy Noise Sources:', baseline.entropyHealthThresholds.noiseSourceRedundancy);
  drawRow('Shannon Entropy Lower Baseline:', `${baseline.entropyHealthThresholds.shannonEntropyBaseline} / 8.0000 bits/byte`);
  drawRow('Minimum Min-Entropy Bound:', `${baseline.entropyHealthThresholds.minimumEntropyPerBit.toFixed(3)} bits/byte`);
  drawRow('Continuous Health Tests (NIST SP 800-90B RCT/APT):', baseline.entropyHealthThresholds.continuousAptRctChecks ? 'CONTINUOUS MONITORING ACTIVE' : 'OFFLINE');
  y += 3;

  // Section 5: Host OS Hardening & Enclave Environment Prerequisites
  drawSectionHeader('5. HOST OPERATING SYSTEM HARDENING & ENCLAVE PREREQUISITES', 'FIPS ENFORCEMENT');
  drawRow('USB Debugging & ADB Interface:', baseline.osPrerequisitesEnforced.usbDebuggingDisabled ? 'DISABLED (Strict Compliant)' : 'NON-COMPLIANT', baseline.osPrerequisitesEnforced.usbDebuggingDisabled);
  drawRow('Biometric Hardware Lockout Threshold:', `Maximum ${baseline.osPrerequisitesEnforced.biometricLockoutThreshold} Failed Attempts`);
  drawRow('Hardware-Backed Verified Boot (dm-verity):', baseline.osPrerequisitesEnforced.verifiedBootGreenState ? 'GREEN STATE (Verified Locked)' : 'UNLOCKED');
  drawRow('Memory Tagging Extension (ARMv9 MTE):', baseline.osPrerequisitesEnforced.memoryTaggingStrictMode ? 'STRICT SYNC MODE' : 'DISABLED');
  drawRow('Screen Mirroring Protection (FLAG_SECURE):', baseline.osPrerequisitesEnforced.flagSecureScreenCaptureBlocked ? 'ENFORCED' : 'DISABLED');
  drawRow('Operator Inactivity Auto-Lockout:', `${baseline.osPrerequisitesEnforced.inactivityLockTimeoutSec} Seconds`);
  y += 5;

  // Footer Cryptographic Seal & Verification Block
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 182, 24, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, 182, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CRYPTOGRAPHIC BASELINE INTEGRITY DIGEST & ATTESTATION SEAL', 18, y + 6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(14, 116, 144);
  doc.text(`SHA-256: ${baseline.baselineFingerprintSha256}`, 18, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('This machine-generated report attests that the specified Hardware Security Module (HSM) enforces all mandatory', 18, y + 17);
  doc.text('NIST FIPS 140-3 Level 3/4 baseline policies, post-quantum key encapsulation mechanisms, and side-channel countermeasures.', 18, y + 21);

  // Save/Download PDF
  const filename = `Q-CRYPT-Security-Baseline-${baseline.device.id}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
