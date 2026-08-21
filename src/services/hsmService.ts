export type FipsLevel = 'FIPS 140-3 Level 3' | 'FIPS 140-3 Level 4' | 'FIPS 140-2 Level 3' | 'Open-Source Dev Target';
export type HsmDeviceType = 'NETWORK_HSM' | 'PCIE_HARDWARE' | 'SILICON_ROOT_OF_TRUST' | 'PKCS11_SOFTWARE_PROVIDER' | 'USB_HARDWARE_TOKEN';
export type HsmStatus = 'ONLINE' | 'STANDBY' | 'ZEROIZED' | 'BUSY';

export interface HsmDevice {
  id: string;
  name: string;
  vendor: string;
  fipsLevel: FipsLevel;
  fipsCertificateNumber: string;
  firmware: string;
  type: HsmDeviceType;
  interfaceProtocol: string;
  status: HsmStatus;
  activeSlot: string;
  slotCount: number;
  temperatureC: number;
  coreVoltageV: number;
  batteryBackupV: number;
  entropyRateMBps: number;
  tamperMeshIntact: boolean;
  zeroizationArmed: boolean;
  supportedAlgorithms: string[];
  totalCapacityKeys: number;
  storedKeysCount: number;
  opsPerSecondPeak: number;
  description: string;
  location: string;
}

export interface HsmKeyObject {
  id: string;
  hsmId: string;
  slotId: string;
  label: string;
  algorithm: 'ML-DSA-87 (FIPS 204)' | 'ML-KEM-1024 (FIPS 203)' | 'SPHINCS+-SHA256' | 'AES-256-GCM' | 'Dilithium-5';
  keyType: 'CKK_ML_DSA' | 'CKK_ML_KEM' | 'CKK_AES' | 'CKK_SPHINCS_PLUS';
  keyHandle: string;
  keySizeBits: number;
  isExtractable: boolean;
  isSensitive: boolean;
  isHardwareStored: boolean;
  createdDate: string;
  usageCount: number;
  assignedApplication: string;
  fipsAttestationHash: string;
}

export interface HsmCryptographicOpLog {
  id: string;
  timestamp: string;
  hsmId: string;
  hsmName: string;
  operation: 'C_Sign' | 'C_Verify' | 'C_Encapsulate' | 'C_Decapsulate' | 'C_GenerateKeyPair' | 'C_DeriveKey' | 'C_GenerateRandom';
  algorithm: string;
  keyLabel: string;
  durationMs: number;
  status: 'SUCCESS' | 'FAILED';
  slot: string;
  clientIp: string;
  signatureHex?: string;
  details: string;
}

export interface FirmwareIntegrityEvent {
  id: string;
  timestamp: string;
  hsmId: string;
  hsmName: string;
  firmwareVersion: string;
  component: string;
  hashAlgorithm: 'SHA3-512' | 'SHA-256' | 'SHAKE-256';
  computedHash: string;
  knownGoodHash: string;
  status: 'MATCH' | 'MISMATCH' | 'RE_BASELINED' | 'TAMPER_ALERT';
  fipsStandard: string;
  signingKeyValidation: {
    signer: string;
    pqcAlgorithm: string;
    certSerial: string;
    status: 'VALID' | 'REVOKED' | 'INVALID';
  };
  validationType: 'POST_POWER_ON' | 'PERIODIC_CHT' | 'MANUAL_OFFICER_AUDIT' | 'FIRMWARE_FLASH';
  durationMs: number;
  notes: string;
}

export interface HsmHeartbeatMetric {
  timestamp: number;
  opsPerSec: number;
  latencyMs: number;
  cpuLoadPercent: number;
  entropyHealth: 'OPTIMAL' | 'DEGRADED';
}

export const INITIAL_HSM_DEVICES: HsmDevice[] = [
  {
    id: 'nitrokey-nethsm',
    name: 'Nitrokey NetHSM (Open-Source Hardware)',
    vendor: 'Nitrokey GmbH (Germany / EU)',
    fipsLevel: 'FIPS 140-3 Level 3',
    fipsCertificateNumber: 'NIST-CMVP-4891-PQC',
    firmware: 'v2.4.1-pqc-hardened (GPLv3)',
    type: 'NETWORK_HSM',
    interfaceProtocol: 'REST API + PKCS#11 v3.0 (TLS 1.3)',
    status: 'ONLINE',
    activeSlot: 'Slot 0x01 (PQC Root CA)',
    slotCount: 16,
    temperatureC: 38.4,
    coreVoltageV: 1.18,
    batteryBackupV: 3.24,
    entropyRateMBps: 64.0,
    tamperMeshIntact: true,
    zeroizationArmed: true,
    supportedAlgorithms: ['ML-DSA-87 (Dilithium)', 'ML-KEM-1024 (Kyber)', 'SPHINCS+-256', 'AES-256-GCM', 'Ed25519'],
    totalCapacityKeys: 20000,
    storedKeysCount: 1420,
    opsPerSecondPeak: 8400,
    description: 'Fully open-source physical network HSM with verifiable schematics, hardware TRNG, and microsecond zeroization on physical chassis breach.',
    location: 'Frankfurt Datacenter (Node-FRA-01)'
  },
  {
    id: 'thales-luna-pcie',
    name: 'Thales Luna PCIe 7000 PQC Enclave',
    vendor: 'Thales DIS CPL (France / US)',
    fipsLevel: 'FIPS 140-3 Level 3',
    fipsCertificateNumber: 'NIST-CMVP-4112-L3',
    firmware: 'v7.12.0-PQC-LATTICE',
    type: 'PCIE_HARDWARE',
    interfaceProtocol: 'PCIe Gen4 x8 Direct DMA + PKCS#11',
    status: 'ONLINE',
    activeSlot: 'Slot 0x00 (High-Speed Signer)',
    slotCount: 32,
    temperatureC: 44.2,
    coreVoltageV: 0.95,
    batteryBackupV: 3.31,
    entropyRateMBps: 128.0,
    tamperMeshIntact: true,
    zeroizationArmed: true,
    supportedAlgorithms: ['ML-DSA-87 (FIPS 204)', 'ML-KEM-1024 (FIPS 203)', 'LMS/HSS Stateful Hash', 'AES-256-XTS', 'RSA-4096'],
    totalCapacityKeys: 100000,
    storedKeysCount: 8940,
    opsPerSecondPeak: 25000,
    description: 'Ultra high-throughput enterprise PCIe security accelerator delivering 25k lattice signatures per second with military-grade tamper wrap.',
    location: 'Luxembourg PSF Banking Vault (Node-LUX-03)'
  },
  {
    id: 'opentitan-sot',
    name: 'OpenTitan Silicon Root of Trust',
    vendor: 'lowRISC / Google OpenTitan Alliance',
    fipsLevel: 'FIPS 140-3 Level 4',
    fipsCertificateNumber: 'FIPS-140-3-L4-PENDING-2026',
    firmware: 'EarlGrey-ROM-ext-v3.1',
    type: 'SILICON_ROOT_OF_TRUST',
    interfaceProtocol: 'Direct SPI / I3C Secure Bus + PKCS#11 Bridge',
    status: 'ONLINE',
    activeSlot: 'Slot 0x03 (Hardware Master Seed)',
    slotCount: 8,
    temperatureC: 32.1,
    coreVoltageV: 1.05,
    batteryBackupV: 3.00,
    entropyRateMBps: 32.0,
    tamperMeshIntact: true,
    zeroizationArmed: true,
    supportedAlgorithms: ['ML-DSA-87 (Dilithium)', 'ML-KEM-1024 (Kyber)', 'AES-256-GCM', 'KMAC-256', 'SHA3-512'],
    totalCapacityKeys: 4096,
    storedKeysCount: 248,
    opsPerSecondPeak: 4200,
    description: 'Open-source commercial silicon root of trust with physical active mesh coating, glitch protection, and side-channel power analysis immunity.',
    location: 'Paris Defense Sovereign Server (Node-PAR-02)'
  },
  {
    id: 'softhsm2-oqs',
    name: 'SoftHSMv2 + Open Quantum Safe Provider',
    vendor: 'Open Source (OASIS PKCS#11 / liboqs)',
    fipsLevel: 'Open-Source Dev Target',
    fipsCertificateNumber: 'N/A (Software PKCS#11 Emulation)',
    firmware: 'SoftHSM v2.6.1 + liboqs 0.10.1',
    type: 'PKCS11_SOFTWARE_PROVIDER',
    interfaceProtocol: 'libsofthsm2.so (POSIX Shared Library)',
    status: 'ONLINE',
    activeSlot: 'Slot 0x02 (CI/CD Sandbox)',
    slotCount: 64,
    temperatureC: 28.0,
    coreVoltageV: 1.20,
    batteryBackupV: 3.00,
    entropyRateMBps: 250.0,
    tamperMeshIntact: true,
    zeroizationArmed: false,
    supportedAlgorithms: ['ML-DSA-44/65/87', 'ML-KEM-512/768/1024', 'Falcon-1024', 'SPHINCS+', 'AES-256-GCM'],
    totalCapacityKeys: 500000,
    storedKeysCount: 350,
    opsPerSecondPeak: 18000,
    description: 'Software-emulated PKCS#11 engine utilizing Open Quantum Safe providers for automated integration testing, unit test suites, and mock deployments.',
    location: 'Local Container Runtime / Staging VPC'
  },
  {
    id: 'yubihsm2-fips',
    name: 'YubiHSM 2 FIPS Dual-Control Module',
    vendor: 'Yubico (Sweden / USA)',
    fipsLevel: 'FIPS 140-2 Level 3',
    fipsCertificateNumber: 'NIST-CMVP-3913',
    firmware: 'v2.3.2-fips',
    type: 'USB_HARDWARE_TOKEN',
    interfaceProtocol: 'USB CCID + YubiHSM Connector / PKCS#11',
    status: 'STANDBY',
    activeSlot: 'Slot 0x01 (M-of-N Quorum Key)',
    slotCount: 4,
    temperatureC: 35.8,
    coreVoltageV: 5.00,
    batteryBackupV: 0.00,
    entropyRateMBps: 16.0,
    tamperMeshIntact: true,
    zeroizationArmed: true,
    supportedAlgorithms: ['ML-DSA-87 Hybrid', 'ECDSA P-384', 'AES-256-CCM', 'HMAC-SHA512', 'Yubico Auth'],
    totalCapacityKeys: 256,
    storedKeysCount: 42,
    opsPerSecondPeak: 1200,
    description: 'Miniature hardware security module fitted for air-gapped root certificate authority keys, dual-custody approval quorum, and portable backup enclaves.',
    location: 'Air-Gapped Cold Room Safe (Offline Key Ceremony)'
  }
];

export const INITIAL_HSM_KEYS: HsmKeyObject[] = [
  {
    id: 'key-pqc-root-01',
    hsmId: 'nitrokey-nethsm',
    slotId: 'Slot 0x01',
    label: 'Q-CRYPT Root Master PQC CA (ML-DSA-87)',
    algorithm: 'ML-DSA-87 (FIPS 204)',
    keyType: 'CKK_ML_DSA',
    keyHandle: '0x000104A1',
    keySizeBits: 20736,
    isExtractable: false,
    isSensitive: true,
    isHardwareStored: true,
    createdDate: '2026-01-15',
    usageCount: 48920,
    assignedApplication: 'Enterprise PKI Master Certificate Authority Signing',
    fipsAttestationHash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f012345678abcdef01'
  },
  {
    id: 'key-mesh-gw-02',
    hsmId: 'nitrokey-nethsm',
    slotId: 'Slot 0x01',
    label: 'Frankfurt Core Gateway Key Exchange (ML-KEM-1024)',
    algorithm: 'ML-KEM-1024 (FIPS 203)',
    keyType: 'CKK_ML_KEM',
    keyHandle: '0x000104B8',
    keySizeBits: 12544,
    isExtractable: false,
    isSensitive: true,
    isHardwareStored: true,
    createdDate: '2026-02-10',
    usageCount: 1428900,
    assignedApplication: 'High-Throughput PQC TLS 1.3 Tunnel Decapsulation',
    fipsAttestationHash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0123456'
  },
  {
    id: 'key-luna-banking-03',
    hsmId: 'thales-luna-pcie',
    slotId: 'Slot 0x00',
    label: 'Luxembourg Financial PSF Sovereign Vault Key',
    algorithm: 'ML-DSA-87 (FIPS 204)',
    keyType: 'CKK_ML_DSA',
    keyHandle: '0x000008F2',
    keySizeBits: 20736,
    isExtractable: false,
    isSensitive: true,
    isHardwareStored: true,
    createdDate: '2026-03-01',
    usageCount: 683100,
    assignedApplication: 'Banking Telemetry & CSSF Financial Payload Signing',
    fipsAttestationHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f012345678'
  },
  {
    id: 'key-opentitan-seed-04',
    hsmId: 'opentitan-sot',
    slotId: 'Slot 0x03',
    label: 'OpenTitan Silicon Master Seed & Identity Key',
    algorithm: 'ML-DSA-87 (FIPS 204)',
    keyType: 'CKK_ML_DSA',
    keyHandle: '0x0003011C',
    keySizeBits: 20736,
    isExtractable: false,
    isSensitive: true,
    isHardwareStored: true,
    createdDate: '2026-04-12',
    usageCount: 94100,
    assignedApplication: 'Hardware Enclave Remote Attestation & Measured Boot',
    fipsAttestationHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0123456789a'
  },
  {
    id: 'key-db-vault-05',
    hsmId: 'nitrokey-nethsm',
    slotId: 'Slot 0x02',
    label: 'Firestore Encrypted Columns Master DEK Key (AES-256-GCM)',
    algorithm: 'AES-256-GCM',
    keyType: 'CKK_AES',
    keyHandle: '0x0002005E',
    keySizeBits: 256,
    isExtractable: false,
    isSensitive: true,
    isHardwareStored: true,
    createdDate: '2026-05-20',
    usageCount: 3829000,
    assignedApplication: 'Zero-Knowledge Firebase Cloud Field-Level Key Unwrapping',
    fipsAttestationHash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0123456789ab0'
  },
  {
    id: 'key-softhsm-test-06',
    hsmId: 'softhsm2-oqs',
    slotId: 'Slot 0x02',
    label: 'SPHINCS+-SHA256 Stateless Hash Backup Signer',
    algorithm: 'SPHINCS+-SHA256',
    keyType: 'CKK_SPHINCS_PLUS',
    keyHandle: '0x0002091A',
    keySizeBits: 40960,
    isExtractable: false,
    isSensitive: true,
    isHardwareStored: true,
    createdDate: '2026-06-01',
    usageCount: 12500,
    assignedApplication: 'Stateless Hash Signature Fallback for Air-Gapped Verification',
    fipsAttestationHash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0123456789ab012'
  }
];

export const INITIAL_HSM_LOGS: HsmCryptographicOpLog[] = [
  {
    id: 'op-log-101',
    timestamp: '2026-08-18T11:45:10.124Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    operation: 'C_Sign',
    algorithm: 'ML-DSA-87 (Dilithium-5)',
    keyLabel: 'Q-CRYPT Root Master PQC CA',
    durationMs: 1.42,
    status: 'SUCCESS',
    slot: 'Slot 0x01',
    clientIp: '10.180.12.44 (Enterprise Gateway)',
    signatureHex: '9f8a7e6d5c4b3a210987654321fedcba8a7e4c21b308e9d2a15f0b89c3d4e74411aaccbb8877665544332211...',
    details: 'Hardware lattice signature generated inside tamper-proof enclave. No private key bits exposed.'
  },
  {
    id: 'op-log-102',
    timestamp: '2026-08-18T11:45:09.840Z',
    hsmId: 'thales-luna-pcie',
    hsmName: 'Thales Luna PCIe 7000',
    operation: 'C_Decapsulate',
    algorithm: 'ML-KEM-1024 (Kyber)',
    keyLabel: 'Frankfurt Core Gateway Key Exchange',
    durationMs: 0.86,
    status: 'SUCCESS',
    slot: 'Slot 0x00',
    clientIp: '10.180.20.12 (Mesh Core Node)',
    signatureHex: '3f4e5d6c7b8a90123456789abcdef012a9b0c1d2e3f4a5b6c7d8e9f012345678',
    details: 'Reconstructed 256-bit symmetric session master secret via hardware lattice decapsulation.'
  },
  {
    id: 'op-log-103',
    timestamp: '2026-08-18T11:45:08.512Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    operation: 'C_DeriveKey',
    algorithm: 'AES-256-GCM',
    keyLabel: 'Firestore Encrypted Columns Master DEK Key',
    durationMs: 0.18,
    status: 'SUCCESS',
    slot: 'Slot 0x02',
    clientIp: '10.180.10.8 (Firebase Worker Cloud)',
    signatureHex: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    details: 'KMAC-256 authenticated key unwrap performed within FIPS 140-3 boundary.'
  },
  {
    id: 'op-log-104',
    timestamp: '2026-08-18T11:45:07.198Z',
    hsmId: 'opentitan-sot',
    hsmName: 'OpenTitan Silicon RoT',
    operation: 'C_Sign',
    algorithm: 'ML-DSA-87',
    keyLabel: 'OpenTitan Silicon Master Seed & Identity Key',
    durationMs: 2.14,
    status: 'SUCCESS',
    slot: 'Slot 0x03',
    clientIp: '10.180.14.99 (Device Attestation Service)',
    signatureHex: 'e4d3c2b1a09876543210fedcba9f8a7e6d5c4b3a210987654321098765432109887766554433221100...',
    details: 'Hardware attestation certificate issued for Android Titan M2 remote device boot integrity.'
  }
];

export interface LiveSigningResult {
  signatureHex: string;
  signatureBase64: string;
  algorithm: string;
  keyLabel: string;
  hsmName: string;
  executionTimeMs: number;
  fipsAttestationHash: string;
  pkcs11ReturnCode: 'CKR_OK (0x00000000)';
  timestamp: string;
  digestVerified: boolean;
}

export function simulateHsmSigning(
  hsm: HsmDevice,
  key: HsmKeyObject,
  payloadText: string
): LiveSigningResult {
  const startTime = performance.now();
  
  // Deterministic hex generator from payload + keyHandle
  let hashNum = 0x811c9dc5;
  for (let i = 0; i < payloadText.length; i++) {
    hashNum ^= payloadText.charCodeAt(i);
    hashNum = Math.imul(hashNum, 0x01000193);
  }
  for (let i = 0; i < key.keyHandle.length; i++) {
    hashNum ^= key.keyHandle.charCodeAt(i);
    hashNum = Math.imul(hashNum, 0x01000193);
  }

  const pseudoHex = Math.abs(hashNum).toString(16).padStart(8, '0');
  const signatureHex = `${pseudoHex}9f8a7e6d5c4b3a210987654321fedcba8a7e4c21b308e9d2a15f0b89c3d4e7` +
    `4411aaccbb8877665544332211aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899` +
    `f8e7d6c5b4a392810fedcba9876543210123456789abcdef0123456789abcdef${key.keyHandle.slice(2)}`;

  const binaryString = signatureHex.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
  const signatureBase64 = btoa(binaryString).slice(0, 88) + '==';

  const executionTimeMs = parseFloat((performance.now() - startTime + (hsm.type === 'PCIE_HARDWARE' ? 0.7 : 1.4)).toFixed(2));

  return {
    signatureHex,
    signatureBase64,
    algorithm: key.algorithm,
    keyLabel: key.label,
    hsmName: hsm.name,
    executionTimeMs,
    fipsAttestationHash: key.fipsAttestationHash,
    pkcs11ReturnCode: 'CKR_OK (0x00000000)',
    timestamp: new Date().toISOString(),
    digestVerified: true
  };
}

export function generatePkcs11ToolCli(hsm: HsmDevice, key: HsmKeyObject): string {
  const modulePath = hsm.id === 'nitrokey-nethsm'
    ? '/usr/lib/x86_64-linux-gnu/pkcs11/libnethsm_pkcs11.so'
    : hsm.id === 'thales-luna-pcie'
    ? '/usr/safenet/lunaclient/lib/libCryptoki2_64.so'
    : hsm.id === 'opentitan-sot'
    ? '/opt/opentitan/lib/libopentitan_pkcs11.so'
    : '/usr/lib/softhsm/libsofthsm2.so';

  return `# 1. List Keys in Slot via PKCS#11 standard
pkcs11-tool --module ${modulePath} \\
  --login --pin <SO_USER_PIN> \\
  --list-objects --type privkey

# 2. Hardware Sign Payload with ${key.algorithm}
pkcs11-tool --module ${modulePath} \\
  --login --pin <SO_USER_PIN> \\
  --sign --mechanism CKM_ML_DSA_87 \\
  --label "${key.label}" \\
  --input-file payload.dat \\
  --output-file signature.pqc.sig

# 3. Export Public Key / Attestation Certificate Chain
pkcs11-tool --module ${modulePath} \\
  --read-object --type cert --label "${key.label}" \\
  --output-file cert.pem`;
}

export function generateNitroKeyRestCurl(hsm: HsmDevice, key: HsmKeyObject): string {
  return `# 1. Query Real-Time Health & FIPS Status
curl -k -X GET "https://hsm.q-crypt.sec:8443/api/v1/health" \\
  -H "Accept: application/json"

# 2. Sign Payload using NetHSM REST API (ML-DSA-87)
curl -k -X POST "https://hsm.q-crypt.sec:8443/api/v1/keys/${key.keyHandle}/sign" \\
  -u "admin_officer:YourStrongPassphrase" \\
  -H "Content-Type: application/json" \\
  -d '{
    "algorithm": "ML-DSA-87",
    "data": "VGhpcyBpcyBhbiBleGVjdXRpdmUgcXVhbnR1bSBzYWZlIHRlbGVtZXRyeSBwYXlsb2FkLg==",
    "encoding": "base64"
  }'`;
}

export const INITIAL_FIRMWARE_INTEGRITY_LOGS: FirmwareIntegrityEvent[] = [
  {
    id: 'fw-log-2026-001',
    timestamp: '2026-08-18T11:52:10.420Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    firmwareVersion: 'v2.4.1-pqc-hardened (GPLv3)',
    component: 'Secure Boot Stage 0 (Immutable ROM)',
    hashAlgorithm: 'SHA3-512',
    computedHash: '9a7f3e1b8c2d4a5f6e0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    knownGoodHash: '9a7f3e1b8c2d4a5f6e0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    status: 'MATCH',
    fipsStandard: 'FIPS 140-3 Level 3 (NIST-CMVP-4891-PQC)',
    signingKeyValidation: {
      signer: 'Nitrokey Sovereign Hardware Root CA (G4)',
      pqcAlgorithm: 'ML-DSA-87 (FIPS 204)',
      certSerial: '4F:8A:2B:99:12:00:26',
      status: 'VALID'
    },
    validationType: 'POST_POWER_ON',
    durationMs: 4.82,
    notes: 'Microcode ROM checksum exactly matches NIST CMVP certified golden baseline. Hardware write-protect latch confirmed engaged.'
  },
  {
    id: 'fw-log-2026-002',
    timestamp: '2026-08-18T11:48:33.812Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    firmwareVersion: 'v2.4.1-pqc-hardened (GPLv3)',
    component: 'Lattice Acceleration FPGA Bitstream',
    hashAlgorithm: 'SHA3-512',
    computedHash: 'c4e8b2a19f0d7e6c5b4a3928172635445566778899aabbccddeeff0011223344a1b2c3d4e5f60718293a4b5c6d7e8f01a2b3c4d5e6f708192a3b4c5d6e7f8091',
    knownGoodHash: 'c4e8b2a19f0d7e6c5b4a3928172635445566778899aabbccddeeff0011223344a1b2c3d4e5f60718293a4b5c6d7e8f01a2b3c4d5e6f708192a3b4c5d6e7f8091',
    status: 'MATCH',
    fipsStandard: 'FIPS 140-3 Level 3',
    signingKeyValidation: {
      signer: 'European Sovereign Lattice Foundation Key 02',
      pqcAlgorithm: 'ML-DSA-87 (FIPS 204)',
      certSerial: '88:A1:CC:42:01:26',
      status: 'VALID'
    },
    validationType: 'PERIODIC_CHT',
    durationMs: 6.14,
    notes: 'FPGA lattice pipeline bitstream verified against cryptographic manifest. Zero soft-error bitflips detected across SRAM partitions.'
  },
  {
    id: 'fw-log-2026-003',
    timestamp: '2026-08-18T11:35:19.102Z',
    hsmId: 'opentitan-sot',
    hsmName: 'OpenTitan Silicon RoT',
    firmwareVersion: 'EarlGrey-ROM-ext-v3.1',
    component: 'Silicon ROM Extension (Mask ROM + OTP Keys)',
    hashAlgorithm: 'SHA3-512',
    computedHash: '7b2c9e4a1f8d3056a2b3c4d5e6f708192a3b4c5d6e7f8091a1b2c3d4e5f60718e4d3c2b1a09876543210fedcba98765432109876543210fedcba9876543210fedc',
    knownGoodHash: '7b2c9e4a1f8d3056a2b3c4d5e6f708192a3b4c5d6e7f8091a1b2c3d4e5f60718e4d3c2b1a09876543210fedcba98765432109876543210fedcba9876543210fedc',
    status: 'MATCH',
    fipsStandard: 'FIPS 140-3 Level 4 Physical Security',
    signingKeyValidation: {
      signer: 'lowRISC / OpenTitan Master Silicon Root Authority',
      pqcAlgorithm: 'ML-DSA-87 Hybrid',
      certSerial: '01:AA:BB:CC:DD:EE:26',
      status: 'VALID'
    },
    validationType: 'POST_POWER_ON',
    durationMs: 3.25,
    notes: 'Silicon physical fuses, lock-bits, and OTP memory integrity validated. Active protective metal mesh continuity nominal.'
  },
  {
    id: 'fw-log-2026-004',
    timestamp: '2026-08-18T10:14:02.774Z',
    hsmId: 'thales-luna-pcie',
    hsmName: 'Thales Luna PCIe 7000',
    firmwareVersion: 'v7.12.0-PQC-LATTICE',
    component: 'Cryptoki PKCS#11 Firmware Kernel',
    hashAlgorithm: 'SHA-256',
    computedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    knownGoodHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'MATCH',
    fipsStandard: 'FIPS 140-3 Level 3 (NIST-CMVP-4112-L3)',
    signingKeyValidation: {
      signer: 'Thales DIS CPL Global Signing Authority #1',
      pqcAlgorithm: 'ML-DSA-87 (FIPS 204)',
      certSerial: '77:12:33:90:AB:26',
      status: 'VALID'
    },
    validationType: 'MANUAL_OFFICER_AUDIT',
    durationMs: 2.91,
    notes: 'Cryptoki firmware module authenticated by Security Officer (SO) quorum credentials during scheduled weekly maintenance window.'
  },
  {
    id: 'fw-log-2026-005',
    timestamp: '2026-08-18T08:00:15.990Z',
    hsmId: 'yubihsm2-fips',
    hsmName: 'YubiHSM 2 FIPS',
    firmwareVersion: 'v2.3.2-fips',
    component: 'Secure Microcontroller Boot Sector',
    hashAlgorithm: 'SHA-256',
    computedHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    knownGoodHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'MATCH',
    fipsStandard: 'FIPS 140-2 Level 3 (NIST-CMVP-3913)',
    signingKeyValidation: {
      signer: 'Yubico Primary Release Authority',
      pqcAlgorithm: 'ECDSA P-384 / FIPS 186-4',
      certSerial: '39:13:20:25:01:44',
      status: 'VALID'
    },
    validationType: 'POST_POWER_ON',
    durationMs: 5.40,
    notes: 'Immutable bootloader authenticated. No hardware debug ports (JTAG/SWD) accessible outside sealed monolithic enclosure.'
  }
];

export function verifyHsmFirmwareIntegrity(
  hsm: HsmDevice,
  component: string = 'Secure Boot Stage 0 (Immutable ROM)',
  simulateTamper: boolean = false
): FirmwareIntegrityEvent {
  const startTime = performance.now();
  const hashAlgorithm = 'SHA3-512';
  
  // Deterministic golden hash for device + component
  let baseStr = `${hsm.id}:${hsm.firmware}:${component}:NIST-FIPS-140-3-GOLDEN`;
  let hashVal = 0x811c9dc5;
  for (let i = 0; i < baseStr.length; i++) {
    hashVal ^= baseStr.charCodeAt(i);
    hashVal = Math.imul(hashVal, 0x01000193);
  }
  const prefix = Math.abs(hashVal).toString(16).padStart(8, '0');
  const knownGoodHash = `${prefix}8c2d4a5f6e0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d` +
    `7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f` +
    `0123456789abcdef0123456789abcdef9f8a7e6d5c4b3a210987654321fedcba`;

  let computedHash = knownGoodHash;
  let status: 'MATCH' | 'MISMATCH' | 'RE_BASELINED' | 'TAMPER_ALERT' = 'MATCH';
  let notes = `Firmware verification completed with 0 errors. Microcode SHA3-512 digest strictly equals NIST CMVP certified known-good baseline for ${hsm.name}.`;

  if (simulateTamper) {
    // Intentionally mutate computed hash to demonstrate mismatch detection
    computedHash = `BAD0` + knownGoodHash.slice(4, 120) + `DEADBEEF`;
    status = 'MISMATCH';
    notes = `[CRITICAL ALERT] FIPS 140-3 checksum mismatch detected! Computed digest does not match known-good ROM signature. Hardware isolation barrier armed.`;
  }

  const durationMs = parseFloat((performance.now() - startTime + (hsm.type === 'PCIE_HARDWARE' ? 2.1 : 4.5)).toFixed(2));

  return {
    id: `fw-log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    hsmId: hsm.id,
    hsmName: hsm.name,
    firmwareVersion: hsm.firmware,
    component,
    hashAlgorithm,
    computedHash,
    knownGoodHash,
    status,
    fipsStandard: hsm.fipsLevel,
    signingKeyValidation: {
      signer: `${hsm.vendor.split('(')[0].trim()} Sovereign Release Root CA`,
      pqcAlgorithm: 'ML-DSA-87 (FIPS 204)',
      certSerial: `CA:${Math.floor(Math.random() * 9000 + 1000)}:2026`,
      status: simulateTamper ? 'INVALID' : 'VALID'
    },
    validationType: 'MANUAL_OFFICER_AUDIT',
    durationMs,
    notes
  };
}

// ---------------------------------------------------------------------------
// INTERNAL HSM DIAGNOSTIC LOGS & ENCLAVE OPERATIONAL TROUBLESHOOTING
// ---------------------------------------------------------------------------

export type DiagnosticLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
export type DiagnosticSubsystem = 
  | 'PKCS11_CORE' 
  | 'TRNG_ENTROPY' 
  | 'MTLS_BRIDGE' 
  | 'BOOT_ROM' 
  | 'TAMPER_MESH' 
  | 'LATTICE_ACCELERATOR' 
  | 'QUORUM_AUTH'
  | 'SESSION_MANAGER';

export interface HsmDiagnosticLog {
  id: string;
  timestamp: string;
  hsmId: string;
  hsmName: string;
  level: DiagnosticLogLevel;
  subsystem: DiagnosticSubsystem;
  eventCode: string;
  message: string;
  sanitizedPayload: string;
  anonymizedClient: string;
  durationMs: number;
  troubleshootingTip?: string;
}

export const INITIAL_HSM_DIAGNOSTIC_LOGS: HsmDiagnosticLog[] = [
  {
    id: 'diag-001',
    timestamp: '2026-08-21T10:14:32.410Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    level: 'INFO',
    subsystem: 'MTLS_BRIDGE',
    eventCode: 'NET_MTLS_HANDSHAKE_OK',
    message: 'mTLS session negotiated over TLS 1.3 with X.509 client certificate pinning.',
    sanitizedPayload: '{"ciphersuite": "TLS_AES_256_GCM_SHA384", "kem": "X25519_ML_KEM_768", "peer_id": "anon-node-***.sec", "session_id": "0x4a9b***"}',
    anonymizedClient: '10.180.12.*** (Mesh Ingress GW)',
    durationMs: 4.82,
    troubleshootingTip: 'Normal operational handshake. Both endpoints verified post-quantum key encapsulation.'
  },
  {
    id: 'diag-002',
    timestamp: '2026-08-21T10:13:58.119Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    level: 'INFO',
    subsystem: 'LATTICE_ACCELERATOR',
    eventCode: 'CRYPTO_ML_DSA_SIGN_OK',
    message: 'Hardware enclave executed FIPS 204 ML-DSA-87 NTT polynomial matrix multiplication.',
    sanitizedPayload: '{"algorithm": "ML-DSA-87", "key_handle": "0x0001**** (Redacted)", "matrix_dim": "k=8, l=7", "ntt_cycles": 184200, "rtt_ms": 1.28}',
    anonymizedClient: '10.180.4.*** (CA Worker #3)',
    durationMs: 1.28,
    troubleshootingTip: 'Signing performance is nominal. Hardware NTT coprocessor is operating within 1.5ms SLA.'
  },
  {
    id: 'diag-003',
    timestamp: '2026-08-21T10:11:45.890Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    level: 'WARN',
    subsystem: 'TRNG_ENTROPY',
    eventCode: 'TRNG_JITTER_COMPENSATE',
    message: 'Avalanche diode thermal drift compensated by dynamic ring oscillator cross-sampling.',
    sanitizedPayload: '{"drift_mv": "+1.8mV", "health_test": "NIST_SP_800_90B_APT", "repetition_count": 0, "active_entropy": 7.9941}',
    anonymizedClient: 'Internal Enclave TRNG Supervisor',
    durationMs: 0.45,
    troubleshootingTip: 'Automatic temperature drift calibration succeeded. No entropy degradation observed.'
  },
  {
    id: 'diag-004',
    timestamp: '2026-08-21T10:08:12.602Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    level: 'DEBUG',
    subsystem: 'PKCS11_CORE',
    eventCode: 'C_GetSessionInfo_SANITIZED',
    message: 'PKCS#11 v3.0 slot session queried by authorized daemon. Flags: CKF_SERIAL_SESSION | CKF_RW_SESSION.',
    sanitizedPayload: '{"slot_id": 1, "state": "CKS_RW_USER_FUNCTIONS", "device_error": 0, "flags_hex": "0x00000006"}',
    anonymizedClient: '10.180.12.*** (Daemon-Agent)',
    durationMs: 0.18
  },
  {
    id: 'diag-005',
    timestamp: '2026-08-21T10:04:22.015Z',
    hsmId: 'opentitan-sot',
    hsmName: 'OpenTitan RoT',
    level: 'INFO',
    subsystem: 'BOOT_ROM',
    eventCode: 'ROM_EARLGREY_SECBOOT_NOMINAL',
    message: 'Silicon root of trust verified stage-0 immutable ROM hash with hardware OTP lock-bits.',
    sanitizedPayload: '{"rom_digest": "0x8f9c... (FIPS Valid)", "lc_state": "DEV_LOCKED", "life_cycle_ctrl": "NOMINAL", "glitch_sensors": "ARMED"}',
    anonymizedClient: 'Silicon Boot Controller',
    durationMs: 3.12,
    troubleshootingTip: 'Boot ROM verification passed with hardware active mesh intact.'
  },
  {
    id: 'diag-006',
    timestamp: '2026-08-21T09:58:33.782Z',
    hsmId: 'opentitan-sot',
    hsmName: 'OpenTitan RoT',
    level: 'WARN',
    subsystem: 'SESSION_MANAGER',
    eventCode: 'CKR_PIN_INCORRECT_WARNING',
    message: 'PKCS#11 authentication attempt with incorrect user PIN format. Attempt 1 of 5 before lockout.',
    sanitizedPayload: '{"auth_type": "CKU_USER", "failed_attempts_remaining": 4, "client_fingerprint": "mesh-agent-****"}',
    anonymizedClient: '10.180.88.*** (Staging Client)',
    durationMs: 12.40,
    troubleshootingTip: 'Check client credentials or SO token configuration. Token locks after 5 consecutive failed attempts.'
  },
  {
    id: 'diag-007',
    timestamp: '2026-08-21T09:51:19.431Z',
    hsmId: 'thales-luna-pcie',
    hsmName: 'Thales Luna PCIe',
    level: 'INFO',
    subsystem: 'TAMPER_MESH',
    eventCode: 'TAMPER_CONTINUITY_SCAN_PASS',
    message: 'Continuous physical tamper enclosure monitoring scan passed with 0 capacitance anomalies.',
    sanitizedPayload: '{"mesh_grid_res_ohm": 142.6, "rail_voltage": 3.308, "chassis_pressure": "SEALED", "temp_gradient_c": 0.2}',
    anonymizedClient: 'Physical Tamper Micro-controller',
    durationMs: 0.95
  },
  {
    id: 'diag-008',
    timestamp: '2026-08-21T09:44:05.109Z',
    hsmId: 'nitrokey-nethsm',
    hsmName: 'Nitrokey NetHSM',
    level: 'DEBUG',
    subsystem: 'QUORUM_AUTH',
    eventCode: 'QUORUM_M_OF_N_HEARTBEAT',
    message: 'Dual-control quorum smartcard reader bus heartbeat verified. 2 of 3 Officer keys present.',
    sanitizedPayload: '{"active_quorum": "2/3_OFFICER_SIGNATURES", "reader_status": "ONLINE", "bus_protocol": "ISO7816_T1"}',
    anonymizedClient: 'Hardware Quorum Panel',
    durationMs: 1.10
  }
];

// ---------------------------------------------------------------------------
// DEVICE SECURITY POLICIES & MACHINE-READABLE COMPLIANCE EXPORT
// ---------------------------------------------------------------------------

export interface HsmDeviceSecurityPolicy {
  policySchemaVersion: string;
  complianceStandard: string;
  generatedTimestamp: string;
  attestationAuthority: string;
  deviceId: string;
  deviceName: string;
  vendor: string;
  fipsCertification: {
    level: string;
    certificateNumber: string;
    validationStatus: 'ACTIVE_CERTIFIED' | 'HISTORICAL' | 'IN_REVIEW';
    cmvpReviewYear: number;
  };
  cryptographicPolicies: {
    postQuantumOnlyMode: boolean;
    allowedSigningAlgorithms: string[];
    allowedKemAlgorithms: string[];
    disallowedClassicalAlgorithms: string[];
    minimumLatticeSecurityLevel: number;
    allowNonFipsAlgorithms: boolean;
  };
  keyGovernanceRules: {
    allowExtractableKeys: boolean; // CKA_EXTRACTABLE must be FALSE
    enforceSensitiveAttribute: boolean; // CKA_SENSITIVE must be TRUE
    enforceAlwaysAuthenticate: boolean; // CKA_ALWAYS_AUTHENTICATE
    maxKeyLifetimeDays: number;
    mandatoryKeyUsageRestrictions: boolean;
    automatedRotationPeriodDays: number;
  };
  accessControlAndQuorum: {
    dualControlMOfN: {
      enabled: boolean;
      requiredOfficers: number;
      totalOfficers: number;
    };
    pinPolicy: {
      minLength: number;
      requireAlphanumeric: boolean;
      maxFailedAttemptsBeforeLock: number;
      lockoutDurationSeconds: number;
    };
    roleBasedAccessControl: string[];
  };
  hardwareAndPhysicalSecurity: {
    activeTamperMeshEnabled: boolean;
    zeroizationTriggerTimeMicroseconds: number;
    allowedOperatingTemperatureRangeC: { min: number; max: number };
    voltageSupervisionBoundsV: { min: number; max: number };
    laserLightBreachSensors: boolean;
    epoxyPottingIntegrity: boolean;
  };
  entropyAndRngHealth: {
    sourceType: string;
    minimumShannonEntropyBits: number;
    minimumThroughputMBps: number;
    nistSp80090bContinuousHealthTesting: boolean;
    repetitionCountCutoff: number;
    adaptiveProportionCutoff: number;
    autoFailoverBackupRng: boolean;
  };
  auditAndComplianceLogging: {
    rfc5424Compliant: boolean;
    tamperEvidentLogStorage: boolean;
    hashChainedAuditEntries: boolean;
    retentionDays: number;
    remoteSyslogTls13Pinned: boolean;
    anonymizeClientIpInDiagnostics: boolean;
  };
}

export function generateHsmDeviceSecurityPolicy(device: HsmDevice): HsmDeviceSecurityPolicy {
  return {
    policySchemaVersion: 'https://q-crypt.sec/schemas/fips140-3/hsm-policy-v2.json',
    complianceStandard: `${device.fipsLevel} & NIST Special Publication 800-208 / 800-90B / 800-56C`,
    generatedTimestamp: new Date().toISOString(),
    attestationAuthority: `Q-CRYPT Sovereign HSM Governance Enclave (${device.vendor})`,
    deviceId: device.id,
    deviceName: device.name,
    vendor: device.vendor,
    fipsCertification: {
      level: device.fipsLevel,
      certificateNumber: device.fipsCertificateNumber,
      validationStatus: device.fipsCertificateNumber.includes('PENDING') ? 'IN_REVIEW' : 'ACTIVE_CERTIFIED',
      cmvpReviewYear: 2026
    },
    cryptographicPolicies: {
      postQuantumOnlyMode: true,
      allowedSigningAlgorithms: ['ML-DSA-87 (NIST FIPS 204)', 'SLH-DSA-256 (NIST FIPS 205)', 'Falcon-1024'],
      allowedKemAlgorithms: ['ML-KEM-1024 (NIST FIPS 203)', 'ML-KEM-768'],
      disallowedClassicalAlgorithms: ['RSA-1024', 'RSA-2048', 'ECDSA-secp256k1', '3DES', 'SHA-1'],
      minimumLatticeSecurityLevel: 5,
      allowNonFipsAlgorithms: false
    },
    keyGovernanceRules: {
      allowExtractableKeys: false,
      enforceSensitiveAttribute: true,
      enforceAlwaysAuthenticate: true,
      maxKeyLifetimeDays: 90,
      mandatoryKeyUsageRestrictions: true,
      automatedRotationPeriodDays: 30
    },
    accessControlAndQuorum: {
      dualControlMOfN: {
        enabled: true,
        requiredOfficers: 2,
        totalOfficers: 3
      },
      pinPolicy: {
        minLength: 12,
        requireAlphanumeric: true,
        maxFailedAttemptsBeforeLock: 5,
        lockoutDurationSeconds: 1800
      },
      roleBasedAccessControl: ['CryptoOfficer', 'User', 'AuditOfficer', 'MaintenanceOperator']
    },
    hardwareAndPhysicalSecurity: {
      activeTamperMeshEnabled: device.tamperMeshIntact,
      zeroizationTriggerTimeMicroseconds: 4,
      allowedOperatingTemperatureRangeC: { min: -10, max: 70 },
      voltageSupervisionBoundsV: { min: 0.85, max: 3.45 },
      laserLightBreachSensors: true,
      epoxyPottingIntegrity: true
    },
    entropyAndRngHealth: {
      sourceType: 'Quantum Vacuum & Dual Zener Avalanche Noise (NIST SP 800-90B)',
      minimumShannonEntropyBits: 7.990,
      minimumThroughputMBps: 48.0,
      nistSp80090bContinuousHealthTesting: true,
      repetitionCountCutoff: 16,
      adaptiveProportionCutoff: 512,
      autoFailoverBackupRng: true
    },
    auditAndComplianceLogging: {
      rfc5424Compliant: true,
      tamperEvidentLogStorage: true,
      hashChainedAuditEntries: true,
      retentionDays: 365,
      remoteSyslogTls13Pinned: true,
      anonymizeClientIpInDiagnostics: true
    }
  };
}


