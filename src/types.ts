export interface ReleaseInfo {
  appName: string;
  packageId: string;
  version: string;
  buildDate: string;
  fileSize: string;
  architecture: string;
  sha256: string;
  signatureAlgorithm: string;
  downloadUrl: string;
}

export interface DeviceProfile {
  id: string;
  name: string;
  brand: string;
  hardwareSecurityModule: string;
  securityRating: string;
  badgeColor: string;
  features: {
    strongBox: boolean;
    quantumKeyIsolation: boolean;
    physicalAntiTamper: boolean;
    memoryTaggingMTE: boolean;
    hwKyberAcceleration: boolean;
  };
  notes: string;
}

export interface KeyPairData {
  algorithm: 'ML-KEM-1024' | 'ML-DSA-87';
  publicKeyHex: string;
  secretKeyHex: string;
  seedHex: string;
  matrixDimension: string;
  generationTimeMs: number;
  timestamp: string;
}

export interface EncapsulationResult {
  ciphertextHex: string;
  sharedSecretHex: string;
  encapsulationTimeMs: number;
}

export interface EnterpriseTrialRequest {
  enterpriseName: string;
  email: string;
  seats: number;
  complianceNeeds: string[];
  notes?: string;
}

export interface EnterpriseLicense {
  licenseId: string;
  enterpriseName: string;
  contactEmail: string;
  provisionedSeats: number;
  complianceScope: string[];
  issueDate: string;
  expiryDate: string;
  pocKey: string;
  status: string;
  downloadUrl: string;
}
