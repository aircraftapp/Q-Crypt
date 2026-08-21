export interface PqcCertificate {
  id: string;
  serialNumber: string;
  commonName: string;
  organization: string;
  organizationalUnit: string;
  subjectAltNames: string[];
  algorithm: 'ML-DSA-87 (FIPS 204)' | 'ML-DSA-65' | 'Falcon-1024' | 'Hybrid (Ed25519 + ML-DSA-87)' | 'SLH-DSA (SPHINCS+)';
  keyUsage: string[];
  type: 'ROOT_CA' | 'INTERMEDIATE_CA' | 'GATEWAY' | 'MESH_NODE' | 'EXECUTIVE_ENDPOINT' | 'API_SERVICE';
  issuerId: string;
  issuerName: string;
  hsmRootOfTrust: 'Thales Luna PCIe HSM' | 'AWS CloudHSM' | 'Utimaco CryptoServer' | 'Titan M2 / Knox StrongBox' | 'Software Air-Gapped Key';
  issuedDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRING_SOON';
  revocationReason?: string;
  revocationDate?: string;
  sha256Fingerprint: string;
  pemCertificate: string;
  pemPrivateKey?: string;
  pemCsr?: string;
}

export const INITIAL_PKI_CERTIFICATES: PqcCertificate[] = [
  {
    id: 'pqc-root-ca-01',
    serialNumber: '5F:9B:3A:C1:4E:88:20:26:00:01',
    commonName: 'Q-CRYPT Global Sovereign Post-Quantum Root CA G1',
    organization: 'Q-CRYPT Sovereign Trust Network Inc.',
    organizationalUnit: 'Post-Quantum Cryptographic Root Directorate',
    subjectAltNames: ['ca.q-crypt.sec', 'root-ca.pqc.internal'],
    algorithm: 'ML-DSA-87 (FIPS 204)',
    keyUsage: ['Digital Signature', 'Certificate Signing', 'CRL Signing'],
    type: 'ROOT_CA',
    issuerId: 'self-signed',
    issuerName: 'Q-CRYPT Global Sovereign Post-Quantum Root CA G1 (Self-Signed)',
    hsmRootOfTrust: 'Thales Luna PCIe HSM',
    issuedDate: '2026-01-15',
    expiryDate: '2046-01-15',
    status: 'ACTIVE',
    sha256Fingerprint: 'A4:9E:72:11:8C:3F:5B:90:D2:18:7E:6C:44:01:FA:B8:2C:99:E1:34:5B:09:88:F1:C7:22:A0:15:3E:D4:56:88',
    pemCertificate: `-----BEGIN CERTIFICATE-----
MIIFnTCCBAWgAwIBAgIUW5s6wU6IICYAAAEwDQYJYIZIAWUDBAICBQAwYjELMAkG
A1UEBhMCVVMxETAPBgNVBAoMCFEtQ1JZUFQxNzA1BgNVBAMMLlEtQ1JZUFQgR2xv
YmFsIFNvdmVyZWlnbiBQb3N0LVF1YW50dW0gUm9vdCBDQSBHMTAYMB4XDTI2MDEx
NTAwMDAwMFoXDTQ2MDExNTAwMDAwMFowYjELMAkGA1UEBhMCVVMxETAPBgNVBAoM
CFEtQ1JZUFQxNzA1BgNVBAMMLlEtQ1JZUFQgR2xvYmFsIFNvdmVyZWlnbiBQb3N0
LVF1YW50dW0gUm9vdCBDQSBHMTCCAiEwDQYJYIZIAWUDBAICBQADggIPADCCAg8C
ggIBAK8d0q/9L3rKqZ7M2Xz9Nq8R8L+P0K1v9Z7M2Xz9Nq8R8L+P0K1v9Z7M2Xz9
... [ML-DSA-87 DILITHIUM LEVEL-5 FIPS 204 SOVEREIGN TRUST ROOT] ...
uH1k3mP9X4v7N2q8R+P0L1v9Z7M2Xz9Nq8R8L+P0K1v9Z7M2Xz9Nq8R8L+P0K1v9
-----END CERTIFICATE-----`
  },
  {
    id: 'pqc-issuing-ca-01',
    serialNumber: '7B:44:A9:12:F0:39:20:26:01:04',
    commonName: 'Q-CRYPT EU Banking & Critical Infrastructure Issuing CA',
    organization: 'Q-CRYPT Sovereign Trust Network Inc.',
    organizationalUnit: 'EU Financial & NIS2 Trust Division',
    subjectAltNames: ['eu-ca.q-crypt.sec', 'issuing-eu.pqc.internal'],
    algorithm: 'ML-DSA-87 (FIPS 204)',
    keyUsage: ['Digital Signature', 'Certificate Signing', 'CRL Signing', 'OCSP Signing'],
    type: 'INTERMEDIATE_CA',
    issuerId: 'pqc-root-ca-01',
    issuerName: 'Q-CRYPT Global Sovereign Post-Quantum Root CA G1',
    hsmRootOfTrust: 'AWS CloudHSM',
    issuedDate: '2026-02-01',
    expiryDate: '2036-02-01',
    status: 'ACTIVE',
    sha256Fingerprint: '77:3B:19:D4:E8:22:90:A1:CB:55:70:E3:4A:11:F9:C0:D3:8E:56:B2:91:04:88:AC:32:5E:F7:19:62:4D:99:A2',
    pemCertificate: `-----BEGIN CERTIFICATE-----
MIIDxzCCAq+gAwIBAgIUU0SpEvA5ICYBAAQwDQYJYIZIAWUDBAICBQAwYjELMAkG
A1UEBhMCVVMxETAPBgNVBAoMCFEtQ1JZUFQxNzA1BgNVBAMMLlEtQ1JZUFQgR2xv
YmFsIFNvdmVyZWlnbiBQb3N0LVF1YW50dW0gUm9vdCBDQSBHMTAYMB4XDTI2MDIw
MTAwMDAwMFoXDTM2MDIwMTAwMDAwMFowZTELMAkGA1UEBhMCRVUxETAPBgNVBAoM
CFEtQ1JZUFQxPDA6BgNVBAMMM1EtQ1JZUFQgRVUgQmFua2luZyAmIENyaXRpY2Fs
IEluZnJhc3RydWN0dXJlIElzc3VpbmcgQ0EwggIhMA0GCWCGSAFlAwQCAgUAA4IC
... [ML-DSA-87 INTERMEDIATE ISSUING CA CERTIFICATE] ...
-----END CERTIFICATE-----`
  },
  {
    id: 'pqc-gateway-lux-01',
    serialNumber: '9C:18:77:E2:31:09:20:26:02:19',
    commonName: 'lux-financial-mesh-gateway-01.q-crypt.sec',
    organization: 'Banque Internationale de Luxembourg S.A.',
    organizationalUnit: 'Sovereign Core PQC Gateway Tunnels',
    subjectAltNames: ['lux-financial-mesh-gateway-01.q-crypt.sec', '10.240.10.15', 'mesh-lux.pqc.internal'],
    algorithm: 'Hybrid (Ed25519 + ML-DSA-87)',
    keyUsage: ['Digital Signature', 'Key Encipherment', 'Server Authentication', 'Client Authentication'],
    type: 'GATEWAY',
    issuerId: 'pqc-issuing-ca-01',
    issuerName: 'Q-CRYPT EU Banking & Critical Infrastructure Issuing CA',
    hsmRootOfTrust: 'Utimaco CryptoServer',
    issuedDate: '2026-04-10',
    expiryDate: '2027-04-10',
    status: 'ACTIVE',
    sha256Fingerprint: 'C2:11:8E:44:99:A0:F5:23:41:88:7D:66:9C:3B:18:A7:E5:02:D3:49:7A:B1:08:CE:54:19:92:DF:38:12:66:90',
    pemCertificate: `-----BEGIN CERTIFICATE-----
MIICzzCCAhagAwIBAgIUGBh34jEJIiYCERkwDQYJYIZIAWUDBAICBQAwZTELMAkG
A1UEBhMCRVUxETAPBgNVBAoMCFEtQ1JZUFQxPDA6BgNVBAMMM1EtQ1JZUFQgRVUg
QmFua2luZyAmIENyaXRpY2FsIEluZnJhc3RydWN0dXJlIElzc3VpbmcgQ0EwHhcN
MjYwNDEwMDAwMDAwWhcNMjcwNDEwMDAwMDAwWjBkMQswCQYDVQQGEwJMVTERMA8G
A1UECgwIQmFucXVlIEl4NzA1BgNVBAMMMSx1eC1maW5hbmNpYWwtbWVzaC1nYXRl
d2F5LTAxLnEtY3J5cHQuc2VjMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
... [COMPOSITE DUAL-ALGORITHM HYBRID X.509 v3 CERTIFICATE] ...
-----END CERTIFICATE-----`
  },
  {
    id: 'pqc-node-paris-02',
    serialNumber: '3D:88:12:BC:60:44:20:26:03:08',
    commonName: 'paris-defense-node-02.anssi.fr',
    organization: 'Ministère des Armées & OIV Defense Grid',
    organizationalUnit: 'Post-Quantum Sovereign Mesh Node',
    subjectAltNames: ['paris-defense-node-02.anssi.fr', '10.192.4.88'],
    algorithm: 'ML-DSA-87 (FIPS 204)',
    keyUsage: ['Digital Signature', 'Key Encipherment', 'Client Authentication', 'Server Authentication'],
    type: 'MESH_NODE',
    issuerId: 'pqc-issuing-ca-01',
    issuerName: 'Q-CRYPT EU Banking & Critical Infrastructure Issuing CA',
    hsmRootOfTrust: 'Thales Luna PCIe HSM',
    issuedDate: '2026-05-18',
    expiryDate: '2027-05-18',
    status: 'ACTIVE',
    sha256Fingerprint: '98:2D:4E:71:09:A3:8C:F2:18:6B:3E:99:41:F0:77:2B:D8:1A:66:3C:90:5E:7B:44:11:89:DF:00:23:41:99:11',
    pemCertificate: `-----BEGIN CERTIFICATE-----
MIIC1DCCAg+gAwIBAgIUMogSvGBEICYDCDAwDQYJYIZIAWUDBAICBQAwZTELMAkG
A1UEBhMCRVUxETAPBgNVBAoMCFEtQ1JZUFQxPDA6BgNVBAMMM1EtQ1JZUFQgRVUg
QmFua2luZyAmIENyaXRpY2FsIEluZnJhc3RydWN0dXJlIElzc3VpbmcgQ0EwHhcN
MjYwNTE4MDAwMDAwWhcNMjcwNTE4MDAwMDAwWjBfMQswCQYDVQQGEwJGUjEWMBQG
A1UECgwNTWluaXN0w6hyZSBJMTcwNQYDVQQDDC5wYXJpcy1kZWZlbnNlLW5vZGUt
MDIuYW5zc2kuZnIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC6r...
... [ML-DSA-87 ENCLAVE NODE CERTIFICATE] ...
-----END CERTIFICATE-----`
  },
  {
    id: 'pqc-executive-enclave-ceo',
    serialNumber: '88:F2:01:A9:5E:21:20:26:04:12',
    commonName: 'executive-titan-m2-chief-security.q-crypt.sec',
    organization: 'Enterprise Sovereign Directorate',
    organizationalUnit: 'Executive StrongBox Cryptographic Root',
    subjectAltNames: ['executive-phone-enclave-01', 'ceo-terminal.secure'],
    algorithm: 'ML-DSA-87 (FIPS 204)',
    keyUsage: ['Digital Signature', 'Client Authentication'],
    type: 'EXECUTIVE_ENDPOINT',
    issuerId: 'pqc-issuing-ca-01',
    issuerName: 'Q-CRYPT EU Banking & Critical Infrastructure Issuing CA',
    hsmRootOfTrust: 'Titan M2 / Knox StrongBox',
    issuedDate: '2026-06-01',
    expiryDate: '2026-12-01',
    status: 'ACTIVE',
    sha256Fingerprint: '6F:39:1A:BC:88:2E:40:91:DE:33:F7:18:22:90:5B:C4:8A:1F:62:30:77:49:EE:12:09:A3:44:81:CC:20:38:F1',
    pemCertificate: `-----BEGIN CERTIFICATE-----
MIICjTCCAbagAwIBAgIUiPIBqV4hICYEBjAwDQYJYIZIAWUDBAICBQAwZTELMAkG
A1UEBhMCRVUxETAPBgNVBAoMCFEtQ1JZUFQxPDA6BgNVBAMMM1EtQ1JZUFQgRVUg
QmFua2luZyAmIENyaXRpY2FsIEluZnJhc3RydWN0dXJlIElzc3VpbmcgQ0EwHhcN
MjYwNjAxMDAwMDAwWhcNMjYxMjAxMDAwMDAwWjBsMQswCQYDVQQGEwJFUzEXMBUGA1
... [HARDWARE TITAN M2 STRONGBOX ENDPOINT CERTIFICATE] ...
-----END CERTIFICATE-----`
  },
  {
    id: 'pqc-revoked-legacy-01',
    serialNumber: '11:22:33:44:55:66:20:25:99:99',
    commonName: 'legacy-rsa-deprecate-gateway.internal',
    organization: 'Legacy Infrastructure Unit',
    organizationalUnit: 'Decommissioned Gateway',
    subjectAltNames: ['legacy-gw.internal'],
    algorithm: 'Hybrid (Ed25519 + ML-DSA-87)',
    keyUsage: ['Digital Signature', 'Key Encipherment'],
    type: 'GATEWAY',
    issuerId: 'pqc-issuing-ca-01',
    issuerName: 'Q-CRYPT EU Banking & Critical Infrastructure Issuing CA',
    hsmRootOfTrust: 'Software Air-Gapped Key',
    issuedDate: '2025-08-01',
    expiryDate: '2026-08-01',
    status: 'REVOKED',
    revocationReason: 'Key Compromise / Quantum Cryptographic Rekey to FIPS 204',
    revocationDate: '2026-03-14',
    sha256Fingerprint: '11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00',
    pemCertificate: `-----BEGIN CERTIFICATE-----
MIICVTCCAcCgAwIBAgIUESIzRFVmyCU5mTAwDQYJYIZIAWUDBAICBQAwZTELMAkG
... [REVOKED CERTIFICATE - RECORD STORED IN IMMUTABLE CRL] ...
-----END CERTIFICATE-----`
  }
];

export interface NewCertificateParams {
  commonName: string;
  organization: string;
  organizationalUnit: string;
  subjectAltNames: string;
  algorithm: 'ML-DSA-87 (FIPS 204)' | 'ML-DSA-65' | 'Falcon-1024' | 'Hybrid (Ed25519 + ML-DSA-87)' | 'SLH-DSA (SPHINCS+)';
  type: 'GATEWAY' | 'MESH_NODE' | 'EXECUTIVE_ENDPOINT' | 'API_SERVICE';
  validityDays: number;
  hsmRootOfTrust: 'Thales Luna PCIe HSM' | 'AWS CloudHSM' | 'Utimaco CryptoServer' | 'Titan M2 / Knox StrongBox' | 'Software Air-Gapped Key';
  keyUsage: string[];
}

export function generateRandomHex(length: number): string {
  const bytes = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
}

export function generatePqcCertificate(params: NewCertificateParams): PqcCertificate {
  const now = new Date();
  const expiry = new Date();
  expiry.setDate(now.getDate() + params.validityDays);

  const serial = generateRandomHex(10);
  const fingerprint = generateRandomHex(32);
  const certId = 'pqc-' + params.commonName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Math.floor(Math.random() * 1000);

  const sanArray = params.subjectAltNames
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  if (sanArray.length === 0) {
    sanArray.push(params.commonName);
  }

  const pemCert = `-----BEGIN CERTIFICATE-----
MIIFUDCCBAqgAwIBAgIU${serial.replace(/:/g, '')}wDQYJYIZIAWUDBAICBQAw
ZTELMAkGA1UEBhMCRVUxETAPBgNVBAoMCFEtQ1JZUFQxPDA6BgNVBAMMM1EtQ1JZ
UFQgRVUgQmFua2luZyAmIENyaXRpY2FsIEluZnJhc3RydWN0dXJlIElzc3Vpbmcg
Q0EwHhcN${now.toISOString().slice(2, 10).replace(/-/g, '')}000000Z
FhcN${expiry.toISOString().slice(2, 10).replace(/-/g, '')}000000Z
WjBjMQswCQYDVQQGEwJTRTEMMAoGA1UECgwD${params.organization.slice(0, 10)}
MQ0wCwYDVQQLDAR${params.organizationalUnit.slice(0, 10)}MQ8wDQYDVQQD
DAZ${params.commonName.slice(0, 15)}MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
... [PQC-X509v3 ${params.algorithm} CERTIFICATE SIGNED BY ISSUING CA] ...
... [FINGERPRINT: ${fingerprint}] ...
... [ROOT OF TRUST: ${params.hsmRootOfTrust}] ...
-----END CERTIFICATE-----`;

  const pemKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQI${generateRandomHex(8).replace(/:/g, '')}
MBICBggqhkiG9w0DBwQBBQAEggQAMIIE/AIBADANBgkqhkiG9w0BAQEFAASCBEkw
... [POST-QUANTUM PRIVATE KEY ENCRYPTED WITH AES-256-GCM & ARGON2ID] ...
... [ALGORITHM: ${params.algorithm} - SECURE HARDWARE VAULT] ...
-----END ENCRYPTED PRIVATE KEY-----`;

  const pemCsr = `-----BEGIN CERTIFICATE REQUEST-----
MIICvDCCAaQCAQAwdzELMAkGA1UEBhMCVVMxETAPBgNVBAoMCFEtQ1JZUFQxIzAh
BgNVBAsMGlBvc3QtUXVhbnR1bSBDZXJ0IFJlcXVlc3QxHzAdBgNVBAMMFlEtQ1JZ
UFQgTWVzaCBOb2RlIENTUjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
... [CERTIFICATE SIGNING REQUEST FOR ${params.commonName}] ...
-----END CERTIFICATE REQUEST-----`;

  return {
    id: certId,
    serialNumber: serial,
    commonName: params.commonName,
    organization: params.organization,
    organizationalUnit: params.organizationalUnit,
    subjectAltNames: sanArray,
    algorithm: params.algorithm,
    keyUsage: params.keyUsage.length > 0 ? params.keyUsage : ['Digital Signature', 'Key Encipherment'],
    type: params.type,
    issuerId: 'pqc-issuing-ca-01',
    issuerName: 'Q-CRYPT EU Banking & Critical Infrastructure Issuing CA',
    hsmRootOfTrust: params.hsmRootOfTrust,
    issuedDate: now.toISOString().slice(0, 10),
    expiryDate: expiry.toISOString().slice(0, 10),
    status: 'ACTIVE',
    sha256Fingerprint: fingerprint,
    pemCertificate: pemCert,
    pemPrivateKey: pemKey,
    pemCsr: pemCsr
  };
}

export function generateOpenSslConfig(cert: PqcCertificate): string {
  return `# OpenSSL 3.3+ Post-Quantum Cryptography Configuration
# Target: ${cert.commonName}
# Standard: NIST FIPS 203 (ML-KEM-1024) / FIPS 204 (${cert.algorithm})

openssl_conf = openssl_init

[openssl_init]
providers = provider_sect

[provider_sect]
default = default_sect
oqsprovider = oqsprovider_sect

[default_sect]
activate = 1

[oqsprovider_sect]
activate = 1
module = /usr/lib/x86_64-linux-gnu/ossl-modules/oqsprovider.so

[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
O = ${cert.organization}
OU = ${cert.organizationalUnit}
CN = ${cert.commonName}

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
${cert.subjectAltNames.map((san, idx) => `DNS.${idx + 1} = ${san}`).join('\n')}
`;
}

export function generateNginxPqcConfig(cert: PqcCertificate): string {
  return `# Nginx / Envoy Post-Quantum Hybrid TLS Reverse Proxy Configuration
# Cryptographic Suite: ML-KEM-1024 + X25519 Hybrid Key Exchange

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${cert.commonName} ${cert.subjectAltNames.join(' ')};

    # Post-Quantum Certificates & Key Paths
    ssl_certificate /etc/qcrypt/pki/certs/${cert.id}.crt;
    ssl_certificate_key /etc/qcrypt/pki/private/${cert.id}.key;
    ssl_trusted_certificate /etc/qcrypt/pki/ca-bundle.crt;

    # Post-Quantum Cipher Suites & Groups
    ssl_protocols TLSv1.3;
    ssl_ecdh_curve mlkem1024_x25519:mlkem768_x25519:X25519;
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;

    # OCSP Stapling with Post-Quantum Signed Responses
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_stapling_responder http://ocsp.pqc.q-crypt.sec:8880;

    # Enforce Zero-Knowledge Hardware Session Isolation
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-PQC-Enclave-Verification "FIPS-204-ML-DSA-87; RootOfTrust=${cert.hsmRootOfTrust.replace(/\s+/g, '-')}" always;
    add_header X-Content-Type-Options nosniff always;

    location / {
        proxy_pass https://127.0.0.1:8443;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-PQC-Cert-Fingerprint "${cert.sha256Fingerprint}";
    }
}
`;
}

export function generateKubernetesCertManagerYaml(cert: PqcCertificate): string {
  return `# Kubernetes cert-manager Post-Quantum ClusterIssuer & Certificate Spec
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ${cert.id}-tls
  namespace: qcrypt-mesh
spec:
  secretName: ${cert.id}-tls-secret
  duration: 8760h # 1 year
  renewBefore: 720h # 30 days
  subject:
    organizations:
      - "${cert.organization}"
    organizationalUnits:
      - "${cert.organizationalUnit}"
  commonName: "${cert.commonName}"
  dnsNames:
${cert.subjectAltNames.map(san => `    - "${san}"`).join('\n')}
  issuerRef:
    name: qcrypt-pqc-cluster-issuer
    kind: ClusterIssuer
    group: cert-manager.io
  privateKey:
    algorithm: PostQuantumDilithium
    size: 5 # ML-DSA-87 Level 5
    rotationPolicy: Always
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: qcrypt-pqc-cluster-issuer
spec:
  ca:
    secretName: qcrypt-root-ca-key-pair
`;
}

export interface PkiOidConstraint {
  id: string;
  name: string;
  oid: string;
  category: 'EXTENDED_KEY_USAGE' | 'BASIC_CONSTRAINTS' | 'KEY_USAGE' | 'CERTIFICATE_POLICIES' | 'NAME_CONSTRAINTS' | 'PQC_CUSTOM';
  description: string;
  enabled: boolean;
  isCritical: boolean;
  standard: string;
  value?: string;
}

export interface PkiPolicyConfig {
  policyName: string;
  profileType: 'SOVEREIGN_ROOT_CA' | 'DEFENSE_CROSS_CERT' | 'FINANCIAL_ZERO_TRUST' | 'HIGH_VELOCITY_LEAF';
  validityPreset: '1_YEAR' | '3_YEARS' | '5_YEARS' | '10_YEARS' | '25_YEARS' | 'CUSTOM';
  validityDays: number;
  backdateOffsetMinutes: number;
  maxPathLength: number | 'UNLIMITED';
  isCa: boolean;
  enforceCriticalBasicConstraints: boolean;
  permittedDnsDomains: string[];
  excludedDnsDomains: string[];
  oids: PkiOidConstraint[];
}

export const INITIAL_OID_CONSTRAINTS: PkiOidConstraint[] = [
  // 1. Basic Constraints
  {
    id: 'oid-basic-constraints',
    name: 'Basic Constraints (isCA = TRUE)',
    oid: '2.5.29.19',
    category: 'BASIC_CONSTRAINTS',
    description: 'Designates whether the certificate is a Certificate Authority capable of signing subordinate certs and CRLs.',
    enabled: true,
    isCritical: true,
    standard: 'RFC 5280 / X.509 v3',
    value: 'CA:TRUE, pathlen:unlimited'
  },
  // 2. Key Usage Constraints
  {
    id: 'oid-ku-certsign',
    name: 'Key Cert Sign (Bit 5)',
    oid: '2.5.29.15',
    category: 'KEY_USAGE',
    description: 'Authorizes verification of signatures on other public key certificates for lattice trust hierarchy derivation.',
    enabled: true,
    isCritical: true,
    standard: 'RFC 5280 §4.2.1.3',
    value: 'keyCertSign'
  },
  {
    id: 'oid-ku-crlsign',
    name: 'CRL Sign (Bit 6)',
    oid: '2.5.29.15.6',
    category: 'KEY_USAGE',
    description: 'Authorizes verification of signatures on certificate revocation lists (CRLs) and delta revocation digests.',
    enabled: true,
    isCritical: true,
    standard: 'RFC 5280 §4.2.1.3',
    value: 'cRLSign'
  },
  {
    id: 'oid-ku-digitalsig',
    name: 'Digital Signature (Bit 0)',
    oid: '2.5.29.15.0',
    category: 'KEY_USAGE',
    description: 'Authorizes digital signature verification for entity authentication and quantum TLS key exchanges.',
    enabled: true,
    isCritical: true,
    standard: 'RFC 5280 §4.2.1.3',
    value: 'digitalSignature'
  },
  // 3. Extended Key Usage (EKU) OIDs
  {
    id: 'oid-eku-server-auth',
    name: 'TLS Web Server Authentication',
    oid: '1.3.6.1.5.5.7.3.1',
    category: 'EXTENDED_KEY_USAGE',
    description: 'TLS/HTTPS server authentication for PQC endpoints and sovereign cloud gateways.',
    enabled: true,
    isCritical: false,
    standard: 'RFC 5280 (id-kp-serverAuth)'
  },
  {
    id: 'oid-eku-client-auth',
    name: 'TLS Web Client Authentication',
    oid: '1.3.6.1.5.5.7.3.2',
    category: 'EXTENDED_KEY_USAGE',
    description: 'mTLS dual-sided client authentication for executive smartphones and hardware tokens.',
    enabled: true,
    isCritical: false,
    standard: 'RFC 5280 (id-kp-clientAuth)'
  },
  {
    id: 'oid-eku-code-signing',
    name: 'Code & Microcode Signing',
    oid: '1.3.6.1.5.5.7.3.3',
    category: 'EXTENDED_KEY_USAGE',
    description: 'Cryptographic code signing for HSM firmware releases and air-gapped executable validation.',
    enabled: true,
    isCritical: false,
    standard: 'RFC 5280 (id-kp-codeSigning)'
  },
  {
    id: 'oid-eku-ocsp-signing',
    name: 'OCSP Responder Signing',
    oid: '1.3.6.1.5.5.7.3.9',
    category: 'EXTENDED_KEY_USAGE',
    description: 'Authorizes designated sub-responder to sign online revocation status protocol assertions.',
    enabled: true,
    isCritical: false,
    standard: 'RFC 6960 (id-kp-OCSPSigning)'
  },
  {
    id: 'oid-eku-timestamping',
    name: 'RFC 3161 PQC Time Stamping',
    oid: '1.3.6.1.5.5.7.3.8',
    category: 'EXTENDED_KEY_USAGE',
    description: 'Authorizes cryptographic time-stamping authority (TSA) countersignatures on audit records.',
    enabled: false,
    isCritical: false,
    standard: 'RFC 3161 (id-kp-timeStamping)'
  },
  // 4. Custom Post-Quantum & Sovereign Mesh OIDs
  {
    id: 'oid-pqc-mesh-enclave',
    name: 'PQC Mesh Enclave Direct Node Transport',
    oid: '1.3.6.1.4.1.58495.1.1',
    category: 'PQC_CUSTOM',
    description: 'Enforces pure post-quantum lattice handshake without classical fallback for zero-trust mesh links.',
    enabled: true,
    isCritical: false,
    standard: 'Q-CRYPT Sovereign IANA PEN 58495'
  },
  {
    id: 'oid-pqc-hsm-attestation',
    name: 'Hardware Security Token Attestation',
    oid: '1.3.6.1.4.1.58495.1.2',
    category: 'PQC_CUSTOM',
    description: 'Validates that the key pair was generated inside a physical FIPS 140-3 Level 3+ tamper-evident boundary.',
    enabled: true,
    isCritical: false,
    standard: 'Q-CRYPT Sovereign IANA PEN 58495'
  },
  {
    id: 'oid-pqc-kem-decapsulation',
    name: 'ML-KEM-1024 Decapsulation Peer',
    oid: '1.3.6.1.4.1.58495.1.3',
    category: 'PQC_CUSTOM',
    description: 'Direct Kyber-1024 / ML-KEM post-quantum key encapsulation peer assertion.',
    enabled: true,
    isCritical: false,
    standard: 'NIST FIPS 203 / Q-CRYPT'
  },
  // 5. Certificate Policies OIDs
  {
    id: 'oid-policy-us-fed-high',
    name: 'US Federal PKI High Assurance Policy',
    oid: '2.16.840.1.101.3.2.1.48.1',
    category: 'CERTIFICATE_POLICIES',
    description: 'Compliance with NIST SP 800-57 Part 3 and Federal PKI Policy Authority requirements.',
    enabled: true,
    isCritical: false,
    standard: 'FPKI-CP-v3.0'
  },
  {
    id: 'oid-policy-anssi-pqc-l3',
    name: 'ANSSI Post-Quantum Level 3 High Assurance',
    oid: '1.2.250.1.137.1.1.4.2',
    category: 'CERTIFICATE_POLICIES',
    description: 'French National Cybersecurity Agency security profile for post-quantum dual-track transition.',
    enabled: true,
    isCritical: false,
    standard: 'ANSSI PQC Guide 2026'
  },
  {
    id: 'oid-policy-nato-stanag',
    name: 'NATO Sovereign Defense STANAG 4778',
    oid: '1.3.6.1.4.1.44947.1.1',
    category: 'CERTIFICATE_POLICIES',
    description: 'Interoperable sovereign cross-border military data-centric security architecture.',
    enabled: false,
    isCritical: false,
    standard: 'NATO STANAG 4778'
  },
  // 6. Name Constraints
  {
    id: 'oid-name-constraints',
    name: 'Name Constraints (Permitted Subtrees)',
    oid: '2.5.29.30',
    category: 'NAME_CONSTRAINTS',
    description: 'Restricts subject alternative names of subordinate certificates to approved sovereign DNS domains.',
    enabled: true,
    isCritical: true,
    standard: 'RFC 5280 §4.2.1.10',
    value: '.q-crypt.sec, .defense.internal, .pqc.internal'
  }
];

export const DEFAULT_PKI_POLICY: PkiPolicyConfig = {
  policyName: 'Sovereign Master Defense Root CA Policy (FIPS 204)',
  profileType: 'SOVEREIGN_ROOT_CA',
  validityPreset: '25_YEARS',
  validityDays: 9125, // 25 years
  backdateOffsetMinutes: 10,
  maxPathLength: 'UNLIMITED',
  isCa: true,
  enforceCriticalBasicConstraints: true,
  permittedDnsDomains: ['.q-crypt.sec', '.defense.internal', '.pqc.internal', '.mesh.sec'],
  excludedDnsDomains: ['.legacy-rsa.net', '.insecure-public.org'],
  oids: INITIAL_OID_CONSTRAINTS
};

export function generateRootCaFromPolicy(
  policy: PkiPolicyConfig,
  params: {
    commonName: string;
    organization: string;
    organizationalUnit: string;
    algorithm: 'ML-DSA-87 (FIPS 204)' | 'ML-DSA-65' | 'Falcon-1024' | 'Hybrid (Ed25519 + ML-DSA-87)' | 'SLH-DSA (SPHINCS+)';
    hsmRootOfTrust: 'Thales Luna PCIe HSM' | 'AWS CloudHSM' | 'Utimaco CryptoServer' | 'Titan M2 / Knox StrongBox' | 'Software Air-Gapped Key';
    validityDays: number;
  }
): PqcCertificate {
  const now = new Date();
  const expiry = new Date();
  expiry.setDate(now.getDate() + params.validityDays);

  const serial = generateRandomHex(10);
  const fingerprint = generateRandomHex(32);
  const certId = 'pqc-root-' + params.commonName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 28) + '-' + Math.floor(Math.random() * 900 + 100);

  const enabledOids = policy.oids.filter(o => o.enabled);
  const activeEkus = enabledOids.filter(o => o.category === 'EXTENDED_KEY_USAGE' || o.category === 'PQC_CUSTOM').map(o => o.name);
  const keyUsages = ['Digital Signature', 'Certificate Signing', 'CRL Signing', ...activeEkus];

  const pemCert = `-----BEGIN CERTIFICATE-----
MIIF7jCCBNagAwIBAgIU${serial.replace(/:/g, '')}wDQYJYIZIAWUDBAICBQAw
ZjELMAkGA1UEBhMCVVMxETAPBgNVBAoMCFEtQ1JZUFQxPDA6BgNVBAMMM1${params.commonName.slice(0, 18)}
HhcN${now.toISOString().slice(2, 10).replace(/-/g, '')}000000Z
FhcN${expiry.toISOString().slice(2, 10).replace(/-/g, '')}000000Z
WjBjMQswCQYDVQQGEwJTRTEMMAoGA1UECgwD${params.organization.slice(0, 12)}
... [FIPS 204 ML-DSA-87 SOVEREIGN ROOT CA CERTIFICATE] ...
... [POLICY: ${policy.policyName}] ...
... [VALIDITY: ${params.validityDays} DAYS | EXPIRY: ${expiry.toISOString().slice(0, 10)}] ...
... [ENFORCED OIDs: ${enabledOids.map(o => o.oid).join(', ')}] ...
... [HSM ROOT OF TRUST: ${params.hsmRootOfTrust}] ...
... [FINGERPRINT: ${fingerprint}] ...
-----END CERTIFICATE-----`;

  const pemKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQI${generateRandomHex(8).replace(/:/g, '')}
MBICBggqhkiG9w0DBwQBBQAEggQAMIIE/AIBADANBgkqhkiG9w0BAQEFAASCBEkw
... [SOVEREIGN ROOT CA MASTER SIGNING KEY HELD IN FIPS 140-3 HSM] ...
... [ALGORITHM: ${params.algorithm} - ACCESS CONTROL: M-of-N QUORUM] ...
-----END ENCRYPTED PRIVATE KEY-----`;

  return {
    id: certId,
    serialNumber: serial,
    commonName: params.commonName,
    organization: params.organization,
    organizationalUnit: params.organizationalUnit,
    subjectAltNames: ['ca.' + params.commonName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.sec', 'root-ca.pqc.internal'],
    algorithm: params.algorithm,
    keyUsage: keyUsages,
    type: 'ROOT_CA',
    issuerId: 'self-signed',
    issuerName: `${params.commonName} (Self-Signed Root Authority)`,
    hsmRootOfTrust: params.hsmRootOfTrust,
    issuedDate: now.toISOString().slice(0, 10),
    expiryDate: expiry.toISOString().slice(0, 10),
    status: 'ACTIVE',
    sha256Fingerprint: fingerprint,
    pemCertificate: pemCert,
    pemPrivateKey: pemKey
  };
}

export function generateOpensslPolicyConfig(policy: PkiPolicyConfig, caParams: any): string {
  const enabledOids = policy.oids.filter(o => o.enabled);
  const ekus = enabledOids.filter(o => o.category === 'EXTENDED_KEY_USAGE').map(o => o.oid).join(', ');
  const certPolicies = enabledOids.filter(o => o.category === 'CERTIFICATE_POLICIES').map(o => o.oid).join(', ');
  const customOids = enabledOids.filter(o => o.category === 'PQC_CUSTOM');

  return `# OpenSSL 3.3+ Post-Quantum Root CA Policy Specification
# Generated by Enterprise PKI Policy Editor
# Policy Name: ${policy.policyName}
# Validity Period: ${policy.validityDays} days (${(policy.validityDays / 365.25).toFixed(1)} years)

[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = /etc/qcrypt/pki/root-ca
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
serial            = $dir/serial
RANDFILE          = $dir/private/.rand

# Cryptographic Root of Trust: Hardware Security Module (PKCS#11)
private_key       = "pkcs11:token=Nitrokey%20NetHSM;object=RootCAKey;type=private"
certificate       = $dir/certs/root-ca.crt

default_md        = sha3-512
default_days      = ${policy.validityDays}
preserve          = no
policy            = policy_strict

[ policy_strict ]
countryName             = match
organizationName        = match
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ v3_ca ]
# X.509 v3 Extensions for Post-Quantum Root CA
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints       = ${policy.enforceCriticalBasicConstraints ? 'critical, ' : ''}CA:TRUE${policy.maxPathLength === 'UNLIMITED' ? '' : `, pathlen:${policy.maxPathLength}`}
keyUsage               = critical, digitalSignature, cRLSign, keyCertSign

# Extended Key Usage (EKU) Constraints
${ekus ? `extendedKeyUsage       = ${ekus}` : '# extendedKeyUsage is omitted for unrestricted root'}

# Certificate Policies OIDs
${certPolicies ? `certificatePolicies   = ${certPolicies}` : ''}

# Name Constraints (Permitted Sovereign Subtrees)
${policy.permittedDnsDomains.length > 0 ? `nameConstraints        = critical, ${policy.permittedDnsDomains.map(d => `permitted;DNS:${d}`).join(', ')}` : ''}

# Custom Post-Quantum Extension OIDs
${customOids.map(c => `# OID ${c.oid} => ${c.name} (${c.standard})`).join('\n')}
`;
}

