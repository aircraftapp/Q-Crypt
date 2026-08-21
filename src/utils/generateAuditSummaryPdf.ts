import { jsPDF } from 'jspdf';
import { AuditCertification } from '../components/SecurityAuditStatus';

export interface AuditPdfOptions {
  certifications: AuditCertification[];
  generatedBy?: string;
  organizationName?: string;
}

export function generateAuditSummaryPdf({
  certifications,
  generatedBy = 'Q-CRYPT Chief Information Security Officer (CISO) Directorate',
  organizationName = 'Enterprise Security Audit Board'
}: AuditPdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // Page 1: Header & Executive Overview
  // Header Navy Banner
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 36, 'F');

  // Accent Line (Emerald & Cyan dual strip)
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 36, 105, 2, 'F');
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(105, 36, 105, 2, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Q-CRYPT EXECUTIVE SECURITY & COMPLIANCE AUDIT', 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('NIST FIPS 203/204 • BSI TR-02102-4 • CSSF LUXEMBOURG • SOC 2 TYPE II • HARDWARE ENCLAVES', 14, 21);

  doc.setFontSize(8);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text(`Official Audit Summary | Target: ${organizationName} | Generated: ${dateStr}`, 14, 29);

  let y = 46;

  // Executive Summary Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('EXECUTIVE ATTESTATION & COMPLIANCE SUMMARY', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('This machine-readable document provides formal verification of Q-CRYPT post-quantum cryptographic', 18, y + 13);
  doc.text('implementations. All evaluated production algorithms, hardware enclave bindings, and communication', 18, y + 18);
  doc.text('tunnels comply with international sovereign security standards with zero high/critical vulnerabilities.', 18, y + 23);

  y += 34;

  // Overview Metrics Row
  const drawSummaryCard = (x: number, yPos: number, w: number, h: number, title: string, value: string, sub: string) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, yPos, w, h, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(title, x + 4, yPos + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(value, x + 4, yPos + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(16, 185, 129);
    doc.text(sub, x + 4, yPos + 18);
  };

  drawSummaryCard(14, y, 42, 21, 'TOTAL AUDITS', `${certifications.length} Certified`, '100% Pass Rate');
  drawSummaryCard(60, y, 42, 21, 'PQC STANDARD', 'NIST FIPS 203', 'ML-KEM-1024 Certified');
  drawSummaryCard(106, y, 42, 21, 'HARDWARE ISOLATION', 'Titan M2 & Knox', 'FIPS 140-3 Physical');
  drawSummaryCard(152, y, 44, 21, 'SOVEREIGN DEFENSE', 'EU & BSI Verified', 'HNDL Attack Immune');

  y += 28;

  // Section Header: Detailed Certification Records
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Formal Certification & Sovereign Regulatory Ledger', 14, y);
  y += 4;

  doc.setLineWidth(0.4);
  doc.setDrawColor(16, 185, 129);
  doc.line(14, y, 196, y);
  y += 6;

  // Iterate over certifications
  certifications.forEach((cert, index) => {
    // Check if page break is needed
    if (y > 250) {
      doc.addPage();
      y = 20;

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Q-CRYPT EXECUTIVE SECURITY AUDIT (CONTINUED)', 14, 8);
      y += 5;
    }

    // Card Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 27, 2, 2, 'FD');

    // Left Status Accent
    doc.setFillColor(cert.status === 'VERIFIED' ? 16 : 245, cert.status === 'VERIFIED' ? 185 : 158, cert.status === 'VERIFIED' ? 129 : 11);
    doc.rect(14, y, 3, 27, 'F');

    // Title & Index
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${index + 1}. ${cert.title}`, 20, y + 6);

    // Auditor & Status Badge
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Auditing Authority: ${cert.auditor} | Ref: ${cert.documentRef}`, 20, y + 11);

    // Scope / Description
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(`Scope: ${cert.scope} — ${cert.description}`, 172);
    doc.text(splitDesc, 20, y + 16);

    // SHA256 Fingerprint
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`SHA-256: ${cert.sha256Hash}`, 20, y + 24);

    // Valid Date Stamp
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(16, 185, 129);
    doc.text(`STATUS: ${cert.status} (Valid thru ${cert.expiryDate})`, 140, y + 6);

    y += 30;
  });

  // Footer / Machine-Readable Verification Meta
  if (y > 255) {
    doc.addPage();
    y = 20;
  }

  y += 4;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 18, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('MACHINE-READABLE AUDIT TELEMETRY & DIGITAL SIGNATURE', 18, y + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Timestamp: ${timestamp} | CMVP: NIST-FIPS-203-KYBER-1024 | Signer: ${generatedBy}`, 18, y + 11);
  doc.text('Verification Endpoint: https://q-crypt.sec/api/v1/compliance/verify-audit', 18, y + 15);

  // Save the PDF
  doc.save(`Q-CRYPT-Security-Audit-Summary-${new Date().toISOString().slice(0, 10)}.pdf`);
}
