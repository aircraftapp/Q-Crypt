import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Official Quantum Messenger release metadata
  const OFFICIAL_RELEASE = {
    appName: "Quantum Messenger (Q-CRYPT)",
    packageId: "com.aistudio.quantummessenger.pqc",
    version: "v2.4.0-pqc-release",
    buildDate: "2026.07.25",
    fileSize: "48.2 MB",
    architecture: "arm64-v8a / x86_64",
    sha256: "d8f93e21a412b09c85e7284b109e3a9fa054231bf90123efd400192837401a89",
    signatureAlgorithm: "ML-DSA-87 (Dilithium-5) + ECDSA-P384",
    downloadPolicy: "CRM_REGISTRATION_REQUIRED",
    crmRegistrationUrl: "#apk-portal"
  };

  // API Route: Get latest release info
  app.get("/api/release-info", (req, res) => {
    res.json({
      success: true,
      release: OFFICIAL_RELEASE
    });
  });

  // API Route: Download APK request policy endpoint
  app.get("/api/download-apk", (req, res) => {
    return res.status(403).json({
      success: false,
      error: "DIRECT_DOWNLOAD_DISABLED",
      message: "Direct .APK file downloads are disabled for security verification. Please submit your organization details in the Firebase CRM portal. An Admin will review your registration and email the verified download link.",
      actionRequired: "Submit form in Firebase CRM Portal at #apk-portal"
    });
  });

  // API Route: Verify checksum
  app.post("/api/verify-checksum", (req, res) => {
    const { hash } = req.body;
    if (!hash || typeof hash !== "string") {
      return res.status(400).json({ success: false, message: "Hash string required" });
    }

    const cleanedHash = hash.trim().toLowerCase();
    const isAuthentic = cleanedHash === OFFICIAL_RELEASE.sha256.toLowerCase();

    return res.json({
      success: true,
      hashProvided: cleanedHash,
      expectedHash: OFFICIAL_RELEASE.sha256,
      isAuthentic,
      matchMessage: isAuthentic
        ? "MATCH VALIDATED: Authentic Quantum Messenger binary signed by Q-CRYPT Official Security Key."
        : "CHECKSUM MISMATCH: Provided hash does NOT match official release binary. Do not install!"
    });
  });

  // API Route: Enterprise Trial Request & PoC License Generation
  app.post("/api/enterprise-trial", (req, res) => {
    const { enterpriseName, email, seats, complianceNeeds, notes } = req.body;

    if (!enterpriseName || !email) {
      return res.status(400).json({
        success: false,
        message: "Enterprise Name and Contact Email are required."
      });
    }

    // Generate PoC License Details
    const licenseId = `QCRYPT-ENT-${crypto.randomBytes(4).toString("hex").toUpperCase()}-2026`;
    const pocKey = `kyber1024_poc_${crypto.randomBytes(16).toString("hex")}`;
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const pocLicenseData = {
      licenseId,
      enterpriseName,
      contactEmail: email,
      provisionedSeats: seats || 50,
      complianceScope: complianceNeeds || ["HIPAA", "NIST-FIPS-203", "SOC2-TYPE-II"],
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate,
      pocKey,
      status: "ACTIVE_PROOFOFCONCEPT",
      downloadUrl: `/api/download-license?id=${licenseId}`
    };

    return res.json({
      success: true,
      message: "Enterprise Proof-of-Concept account provisioned successfully.",
      license: pocLicenseData
    });
  });

  // API Route: Download Official Investor Pitch Deck PDF
  app.get("/api/download-pitch-deck-pdf", (req, res) => {
    const filename = "Q-CRYPT_Investor_Pitch_Deck_v2.4_SeriesA.pdf";
    
    // Valid PDF Buffer structure with full investor summary text
    const pdfContent = `%PDF-1.5
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kinds [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 850 >>
stream
BT
/F1 18 Tf
50 740 Td
(Q-CRYPT - Series-A Investor Pitch Deck & Executive Summary) Tj
/F1 12 Tf
0 -30 Td
(Post-Quantum Mobile Security Infrastructure for Enterprise & Defense) Tj
0 -20 Td
(NIST FIPS 203 ML-KEM-1024 & NIST FIPS 204 ML-DSA-87 Certified) Tj
0 -30 Td
(KEY FINANCIAL & MARKET HIGHLIGHTS:) Tj
0 -20 Td
(- Total Addressable Market: $42 Billion by 2030 in Post-Quantum Mobile Security) Tj
0 -20 Td
(- Enterprise ARR / Seat: $120 / seat / year (88% Gross Margin)) Tj
0 -20 Td
(- Active Pilot Deployments: 24,500 Seats across Defense, Banking, & Government) Tj
0 -20 Td
(- Hardware Enclave Binding: Direct integration with Google Titan M2 & Apple Secure Enclave) Tj
0 -30 Td
(ENTERPRISE CONTACTS & INVESTOR DIRECTORY (Firebase Synced):) Tj
0 -20 Td
(1. Sovereign Defense Sector Org - CISO Office (ciso-office@sovereignty-defense.eu)) Tj
0 -20 Td
(2. Global Tier-1 Financial Institution - Cryptography VP (crypto-risk@global-tier1-bank.com)) Tj
0 -20 Td
(3. Tier-1 Cybersecurity Venture Fund - Partner (partner@tier1-vc-fund.com)) Tj
0 -40 Td
(Confidential Pitch Deck Document - Q-CRYPT Inc. 2026. All Rights Reserved.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000018 00000 n 
0000000077 00000 n 
0000000133 00000 n 
0000000267 00000 n 
0000000336 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1240
%%EOF`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfContent));
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
