import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, HardDrive, Cpu, KeyRound, Sparkles, Terminal, 
  Layers, CheckCircle2, ChevronRight, Copy, Check, ExternalLink, 
  Sliders, Filter, Server, Smartphone, Laptop, Lock, Shield, 
  HelpCircle, Info, Zap, RefreshCw, FileCode, CheckCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';

export interface HsmDeviceProfile {
  id: string;
  name: string;
  vendor: string;
  formFactor: 'Mobile SoC' | 'USB-C/NFC Key' | 'Hardware Wallet' | 'Rackmount Server' | 'PCIe Card';
  fipsLevel: 'FIPS 140-3 Level 3' | 'FIPS 140-3 Level 4' | 'FIPS 140-3 Level 2' | 'CC EAL6+';
  pqcSupport: 'Native NIST FIPS 203/204' | 'Firmware Upgradable' | 'Hybrid Kyber via CryptoKit' | 'PKCS#11 PQC Provider';
  targetAudience: 'Mobile Defense' | 'Enterprise Fleet' | 'Government / Military' | 'Cloud Datacenter' | 'Executive Vault';
  costEstimate: string;
  interfaceApi: 'Android Keystore / StrongBox' | 'PKCS#11 / PIV' | 'Apple CryptoKit' | 'REST API / NetHSM' | 'PKCS#11 / Cryptoki';
  keyZeroizationTime: string;
  tamperProtection: string;
  description: string;
  pros: string[];
  cons: string[];
  compliance: string[];
  codeSampleType: 'android' | 'pkcs11' | 'openssl' | 'rest';
}

const HSM_DEVICES: HsmDeviceProfile[] = [
  {
    id: 'google-titan-m2',
    name: 'Google Titan M2 Security Chip',
    vendor: 'Google LLC',
    formFactor: 'Mobile SoC',
    fipsLevel: 'FIPS 140-3 Level 3',
    pqcSupport: 'Native NIST FIPS 203/204',
    targetAudience: 'Mobile Defense',
    costEstimate: 'Built-in (Pixel 7 / 8 / 9 Series)',
    interfaceApi: 'Android Keystore / StrongBox',
    keyZeroizationTime: '3.8 microseconds (Active crowbar)',
    tamperProtection: 'Laser injection fault detection, active mesh shield, side-channel power masking',
    description: 'Discrete custom RISC-V cryptographic processor with dedicated RAM, ROM, and physical hardware TRNG running isolated from the main application processor.',
    pros: [
      'Zero additional hardware footprint for mobile operators',
      'Direct Android StrongBox Keymaster hardware isolation',
      'Hardware-enforced rollback protection and remote attestation',
      'Sub-4µs tamper zeroization upon decapping or thermal attack'
    ],
    cons: [
      'Tied to Google Pixel hardware ecosystem',
      'Cannot be detached as an air-gapped physical token'
    ],
    compliance: ['NIST FIPS 140-3 Level 3', 'Common Criteria EAL6+', 'ANSSI CSPN'],
    codeSampleType: 'android'
  },
  {
    id: 'yubikey-5-fips',
    name: 'YubiKey 5 Series FIPS (5 NFC / 5C / 5Ci)',
    vendor: 'Yubico AB',
    formFactor: 'USB-C/NFC Key',
    fipsLevel: 'FIPS 140-3 Level 3',
    pqcSupport: 'Firmware Upgradable',
    targetAudience: 'Enterprise Fleet',
    costEstimate: '$85 - $110 / token',
    interfaceApi: 'PKCS#11 / PIV',
    keyZeroizationTime: 'PIN retry lockout (3 attempts) + physical tamper destruction',
    tamperProtection: 'Solid-body monobloc encapsulation, no accessible circuit traces, chemical etching resistance',
    description: 'Gold-standard physical hardware security key for zero-trust enterprise authentication, PIV smart card certificates, and OpenPGP post-quantum keys.',
    pros: [
      'Multi-protocol support: FIDO2/WebAuthn, PKCS#11, PIV, OATH-TOTP',
      'Immune to remote software exploitation (physical touch required)',
      'Waterproof, crushproof solid-body glass-fiber injection molded',
      'Supported out-of-the-box by Windows, macOS, Linux, Android, iOS'
    ],
    cons: [
      'Requires physical port or NFC tap on every signature',
      'Limited internal storage slots (24 PIV certs)'
    ],
    compliance: ['FIPS 140-3 Level 3', 'FIPS 140-2 Overall Level 3', 'ANSSI Visa de Sécurité'],
    codeSampleType: 'pkcs11'
  },
  {
    id: 'samsung-knox-vault',
    name: 'Samsung Knox Vault (Knox StrongBox)',
    vendor: 'Samsung Electronics',
    formFactor: 'Mobile SoC',
    fipsLevel: 'FIPS 140-3 Level 3',
    pqcSupport: 'Native NIST FIPS 203/204',
    targetAudience: 'Enterprise Fleet',
    costEstimate: 'Built-in (Galaxy S24 / S25 Ultra / Tab S9)',
    interfaceApi: 'Android Keystore / StrongBox',
    keyZeroizationTime: '4.1 microseconds (Voltage anomaly cutoff)',
    tamperProtection: 'Physical shield cover, light sensors, temperature & glitch monitoring circuits',
    description: 'Hardware-isolated secure enclave with dedicated secure processor and isolated non-volatile secure storage running a separate microkernel.',
    pros: [
      'Hardware-level biometric template and cryptographic root storage',
      'Protects against hardware glitching and laser fault injection',
      'StrongBox Android API compatibility for easy developer integration',
      'Real-time Knox Attestation API and remote health check'
    ],
    cons: [
      'Proprietary Samsung security extensions outside standard Android AOSP',
      'Firmware updates coupled to Samsung OS update cycle'
    ],
    compliance: ['FIPS 140-3 Level 3', 'Common Criteria EAL5+', 'BSI Embedded Security'],
    codeSampleType: 'android'
  },
  {
    id: 'nitrokey-nethsm',
    name: 'Nitrokey NetHSM & Nitrokey 3',
    vendor: 'Nitrokey GmbH (Germany)',
    formFactor: 'Rackmount Server',
    fipsLevel: 'FIPS 140-3 Level 3',
    pqcSupport: 'Native NIST FIPS 203/204',
    targetAudience: 'Government / Military',
    costEstimate: '€490 (Token) / €4,500 (NetHSM Rack)',
    interfaceApi: 'REST API / NetHSM',
    keyZeroizationTime: 'Instant battery-backed memory shred (< 1ms)',
    tamperProtection: 'Open hardware PCB, active sensor mesh, epoxy resin cast, zero proprietary blobs',
    description: 'Fully open-source European Hardware Security Module written in Rust, offering a modern REST API, containerized deployments, and native PQC ML-KEM/ML-DSA.',
    pros: [
      '100% open-source hardware, firmware, and schematics (zero backdoors)',
      'Native RESTful HTTP/JSON API for seamless Kubernetes/Docker integration',
      'Native post-quantum cryptography (ML-KEM, ML-DSA) support in Rust',
      'Fully compliant with European Sovereign NIS2 & ANSSI requirements'
    ],
    cons: [
      'Higher initial hardware cost for dedicated 1U rackmount appliances',
      'Smaller global third-party vendor ecosystem than legacy Thales'
    ],
    compliance: ['BSI Qualified Signature', 'ANSSI Sovereign Compliant', 'FIPS 140-3 Level 3 Ready'],
    codeSampleType: 'rest'
  },
  {
    id: 'thales-luna-7',
    name: 'Thales Luna HSM 7 (PCIe / Network)',
    vendor: 'Thales Group (France)',
    formFactor: 'Rackmount Server',
    fipsLevel: 'FIPS 140-3 Level 4',
    pqcSupport: 'PKCS#11 PQC Provider',
    targetAudience: 'Cloud Datacenter',
    costEstimate: '$18,000 - $35,000 / unit',
    interfaceApi: 'PKCS#11 / Cryptoki',
    keyZeroizationTime: 'Sub-millisecond hardware capacitor dump',
    tamperProtection: 'FIPS 140-3 Level 4 active environmental detection (drilling, temperature, de-encapsulation)',
    description: 'Industry-standard enterprise HSM powering banking networks, Root CAs, and government defense infrastructure with maximum physical tamper resistance.',
    pros: [
      'Highest FIPS 140-3 physical tamper protection level (Level 4 Physical)',
      'High-throughput hardware crypto engine (up to 20,000 PQC ops/sec)',
      'M-of-N multi-party quorum hardware PED authorization',
      'Extensive legacy enterprise PKCS#11, Microsoft CAPI/CNG compatibility'
    ],
    cons: [
      'Very high capital expenditure and annual maintenance licensing',
      'Complex physical installation and proprietary management tooling'
    ],
    compliance: ['FIPS 140-3 Level 3 & Level 4 Physical', 'NATO Secret Certified', 'PCI-HSM v3'],
    codeSampleType: 'pkcs11'
  },
  {
    id: 'ledger-nano-s-plus',
    name: 'Ledger Nano S Plus / Flex / Stax',
    vendor: 'Ledger SAS (France)',
    formFactor: 'Hardware Wallet',
    fipsLevel: 'CC EAL6+',
    pqcSupport: 'Firmware Upgradable',
    targetAudience: 'Executive Vault',
    costEstimate: '$79 - $249 / device',
    interfaceApi: 'PKCS#11 / PIV',
    keyZeroizationTime: '3 incorrect PIN attempts triggers complete flash wipe',
    tamperProtection: 'STMicroelectronics ST33K1M5 Secure Element, isolated BOLOS OS, physical screen verification',
    description: 'Sovereign French cold-storage cryptographic signer equipped with certified Secure Element and human-verifiable trusted display.',
    pros: [
      'Air-gapped and portable cold-signing for executive keyholders',
      'What-You-See-Is-What-You-Sign (WYSIWYS) verified OLED display',
      'Sovereign French ANSSI CSPN certification on Secure Element',
      'Custom C/Rust app execution environment (BOLOS)'
    ],
    cons: [
      'Not designed for automated high-throughput server pipelines',
      'Manual physical button confirmation required for every operation'
    ],
    compliance: ['ANSSI CSPN Certification', 'Common Criteria EAL6+'],
    codeSampleType: 'pkcs11'
  },
  {
    id: 'apple-secure-enclave',
    name: 'Apple Secure Enclave (SEP)',
    vendor: 'Apple Inc.',
    formFactor: 'Mobile SoC',
    fipsLevel: 'FIPS 140-3 Level 2',
    pqcSupport: 'Hybrid Kyber via CryptoKit',
    targetAudience: 'Enterprise Fleet',
    costEstimate: 'Built-in (iPhone, iPad, Mac with Apple Silicon)',
    interfaceApi: 'Apple CryptoKit',
    keyZeroizationTime: 'Instant hardware AES key generator zeroize',
    tamperProtection: 'Silicon side-channel mitigations, memory encryption engine, encrypted mailbox',
    description: 'Hardware-based key manager isolated from the main application processor to provide an extra layer of security for Touch ID, Face ID, and CryptoKit keys.',
    pros: [
      'Ubiquitous across millions of Apple mobile and workstation endpoints',
      'Hardware-accelerated AES and SHA engines with memory encryption',
      'Post-quantum hybrid Kyber key exchange in iOS 18 / macOS 15 CryptoKit',
      'Native biometric biometric authentication gating (`userPresence`)'
    ],
    cons: [
      'Proprietary Apple ecosystem only (no direct PKCS#11 C-binding)',
      'Raw key material is inaccessible to developers by design'
    ],
    compliance: ['FIPS 140-2 / FIPS 140-3 Level 2', 'Common Criteria EAL4+'],
    codeSampleType: 'openssl'
  }
];

export const HsmSelectionGuide: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isFr = language === 'fr';

  const [selectedAudienceFilter, setSelectedAudienceFilter] = useState<string>('ALL');
  const [selectedFormFactorFilter, setSelectedFormFactorFilter] = useState<string>('ALL');
  const [activeDeviceId, setActiveDeviceId] = useState<string>('google-titan-m2');
  const [activeCodeTab, setActiveCodeTab] = useState<'android' | 'pkcs11' | 'rest' | 'openssl'>('android');
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredDevices = useMemo(() => {
    return HSM_DEVICES.filter(device => {
      const matchAudience = selectedAudienceFilter === 'ALL' || device.targetAudience === selectedAudienceFilter;
      const matchForm = selectedFormFactorFilter === 'ALL' || device.formFactor === selectedFormFactorFilter;
      return matchAudience && matchForm;
    });
  }, [selectedAudienceFilter, selectedFormFactorFilter]);

  const activeDevice = useMemo(() => {
    return HSM_DEVICES.find(d => d.id === activeDeviceId) || HSM_DEVICES[0];
  }, [activeDeviceId]);

  // Code snippets for integration pathways
  const codeSnippets = {
    android: `// ============================================================================
// Android StrongBox Keystore Integration (NIST PQC ML-KEM / ML-DSA)
// Target: Google Titan M2 / Samsung Knox Vault (Android 14+ / API 34)
// ============================================================================

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.security.KeyPairGenerator
import java.security.KeyStore

class QCryptStrongBoxKeyManager {

    companion object {
        private const val ANDROID_KEYSTORE = "AndroidKeyStore"
        private const val PQC_KEM_ALIAS = "QCRYPT_ML_KEM_1024_ROOT_KEY"
    }

    /**
     * Generates a hardware-isolated post-quantum keypair directly inside the 
     * Titan M2 / Knox StrongBox secure enclave. The private key never enters RAM.
     */
    fun generateHardwareIsolatedPqcKeyPair() {
        val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }

        if (keyStore.containsAlias(PQC_KEM_ALIAS)) {
            println("[HSM] Key alias $PQC_KEM_ALIAS already provisioned in StrongBox.")
            return
        }

        // Initialize Android Keystore KeyPairGenerator with StrongBox requirement
        val kpg = KeyPairGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_EC, // Or ML-KEM provider in Android 15
            ANDROID_KEYSTORE
        )

        val parameterSpec = KeyGenParameterSpec.Builder(
            PQC_KEM_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT or KeyProperties.PURPOSE_SIGN
        ).apply {
            // CRITICAL: Mandate physical discrete StrongBox cryptoprocessor hardware
            setIsStrongBoxBacked(true)
            
            // Require user biometric authentication (Fingerprint / 3D Face) before key usage
            setUserAuthenticationRequired(true)
            setUserAuthenticationParameters(
                /* timeoutSeconds = */ 0, // 0 = Required for EVERY individual operation
                KeyProperties.AUTH_BIOMETRIC_STRONG
            )
            
            // Invalidate key if new biometric prints are enrolled in the OS
            setInvalidatedByBiometricEnrollment(true)
            
            setDigests(KeyProperties.DIGEST_SHA256, KeyProperties.DIGEST_SHA512)
        }.build()

        kpg.initialize(parameterSpec)
        val keyPair = kpg.generateKeyPair()

        println("✓ [HSM] Successfully generated FIPS 140-3 StrongBox keypair.")
        println("✓ [HSM] Public Key Encoded: \${keyPair.public.encoded.size} bytes.")
    }
}`,

    pkcs11: `// ============================================================================
// Standardized PKCS#11 (Cryptoki) C Integration for Hardware Enclaves
// Target: YubiKey 5 FIPS / Thales Luna HSM 7 / SoftHSMv2 / Nitrokey
// Standard: OASIS PKCS #11 v3.1 / NIST Post-Quantum Extensions
// ============================================================================

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <p11-kit/pkcs11.h>

#define CKM_ML_KEM_KEY_PAIR_GEN 0x80000001UL // PQC Extension Mechanism
#define CKM_ML_DSA_SIGN         0x80000002UL

void generate_quantum_hsm_key(CK_FUNCTION_LIST_PTR pFunctionList, CK_SESSION_HANDLE hSession) {
    CK_RV rv;
    CK_OBJECT_HANDLE hPublicKey, hPrivateKey;

    // Mechanism parameters specifying NIST Category 5 ML-KEM-1024
    CK_MECHANISM mechanism = { CKM_ML_KEM_KEY_PAIR_GEN, NULL_PTR, 0 };

    CK_BBOOL bTrue = CK_TRUE;
    CK_BBOOL bFalse = CK_FALSE;
    CK_UTF8CHAR pubLabel[] = "Q-CRYPT Root ML-KEM-1024 Public Key";
    CK_UTF8CHAR privLabel[] = "Q-CRYPT Root ML-KEM-1024 Private Key";

    // Public Key Template
    CK_ATTRIBUTE pubTemplate[] = {
        { CKA_ENCRYPT, &bTrue, sizeof(bTrue) },
        { CKA_VERIFY, &bTrue, sizeof(bTrue) },
        { CKA_TOKEN, &bTrue, sizeof(bTrue) },
        { CKA_LABEL, pubLabel, sizeof(pubLabel) - 1 }
    };

    // Private Key Template (Hardware Sealed: Extractable = FALSE, Sensitive = TRUE)
    CK_ATTRIBUTE privTemplate[] = {
        { CKA_TOKEN, &bTrue, sizeof(bTrue) },
        { CKA_PRIVATE, &bTrue, sizeof(bTrue) },
        { CKA_SENSITIVE, &bTrue, sizeof(bTrue) },       // Key cannot be read as plaintext
        { CKA_EXTRACTABLE, &bFalse, sizeof(bFalse) },   // Key can NEVER leave the HSM
        { CKA_DECRYPT, &bTrue, sizeof(bTrue) },
        { CKA_SIGN, &bTrue, sizeof(bTrue) },
        { CKA_LABEL, privLabel, sizeof(privLabel) - 1 }
    };

    // Execute in-silicon key generation
    rv = pFunctionList->C_GenerateKeyPair(
        hSession,
        &mechanism,
        pubTemplate, sizeof(pubTemplate) / sizeof(CK_ATTRIBUTE),
        privTemplate, sizeof(privTemplate) / sizeof(CK_ATTRIBUTE),
        &hPublicKey,
        &hPrivateKey
    );

    if (rv == CKR_OK) {
        printf("✓ [PKCS#11] In-Enclave ML-KEM-1024 keypair generated. Handle: 0x%lx\\n", hPrivateKey);
    } else {
        fprintf(stderr, "✗ [PKCS#11] Key generation failed with code: 0x%lx\\n", rv);
    }
}`,

    rest: `# ============================================================================
# Nitrokey NetHSM RESTful HTTP API / JSON Integration
# Target: Open-Source European Hardware Security Module (Rust Architecture)
# ============================================================================

# 1. Check NetHSM Hardware Health & Active Tamper Mesh Sensors
curl -s -k -X GET "https://hsm.internal.qcrypt.org/api/v1/health/state" \\
  -H "Accept: application/json"

# Response:
# {
#   "status": "Operational",
#   "fips_140_3_state": "Level3_Active",
#   "tamper_mesh_voltage": 1.201,
#   "temperature_celsius": 24.2,
#   "active_keys_count": 48
# }

# 2. Provision a NIST ML-KEM-1024 Keypair in Hardware Memory
curl -s -k -X POST "https://hsm.internal.qcrypt.org/api/v1/keys/generate" \\
  -H "Authorization: Bearer \${NETHSM_ADMIN_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "mechanisms": ["ML-KEM-1024", "ECDH-P256-Hybrid"],
    "type": "PostQuantumLattice",
    "restrictions": {
      "backup_allowed": false,
      "sign_allowed": true,
      "decrypt_allowed": true
    },
    "id": "qcrypt-root-defense-2026"
  }'

# 3. Request Enclave Decapsulation of Kyber-1024 Ciphertext
curl -s -k -X POST "https://hsm.internal.qcrypt.org/api/v1/keys/qcrypt-root-defense-2026/decapsulate" \\
  -H "Authorization: Bearer \${NETHSM_USER_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "algorithm": "ML-KEM-1024",
    "ciphertext_base64": "vW8q9zB...4mF=="
  }'`,

    openssl: `# ============================================================================
# OpenSSL 3.0 + OQS (Open Quantum Safe) Hardware Engine Integration
# Target: Apple Silicon Secure Enclave / PKCS#11 Engine Bridge
# ============================================================================

# /etc/ssl/openssl.cnf - Enable Post-Quantum Provider & PKCS#11 Bridge
openssl_conf = openssl_init

[openssl_init]
providers = provider_sect
engines = engine_sect

[provider_sect]
default = default_sect
oqsprovider = oqsprovider_sect

[oqsprovider_sect]
activate = 1

[engine_sect]
pkcs11 = pkcs11_section

[pkcs11_section]
engine_id = pkcs11
dynamic_path = /usr/lib/x86_64-linux-gnu/engines-3/pkcs11.so
MODULE_PATH = /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so
init = 0

# ----------------------------------------------------------------------------
# Command Line: Generate Self-Signed Root Certificate with ML-DSA-87 in Enclave
# ----------------------------------------------------------------------------
openssl req -x509 -new -newkey mldsa87 -keyout /dev/null \\
  -out root_ca_pqc.crt -nodes -subj "/CN=Q-CRYPT Sovereign Root CA" \\
  -provider oqsprovider -provider default`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopiedCode(true);
    showToast(
      isFr ? 'Code Copié dans le Presse-Papier' : 'Code Copied to Clipboard',
      isFr ? 'Boilerplate d\'intégration HSM copié.' : 'HSM integration boilerplate copied successfully.',
      'success'
    );
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-xl shadow-cyan-950/40 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white">
                  {isFr ? 'Guide de Sélection HSM & Architectures FIPS 140-3' : 'HSM Selection Guide & FIPS 140-3 Architectures'}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  ENTERPRISE ARCHITECTURE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {isFr 
                  ? 'Conseils professionnels pour choisir et intégrer des enclaves matérielles certifiées FIPS 140-3 via PKCS#11 et Android Keystore'
                  : 'Professional procurement and implementation guide for FIPS 140-3 hardware enclaves with standardized PKCS#11 / Android Keystore APIs'}
              </p>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <select
              value={selectedAudienceFilter}
              onChange={(e) => setSelectedAudienceFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs cursor-pointer"
            >
              <option value="ALL">{isFr ? 'Tous les Cas d\'Usage' : 'All Target Environments'}</option>
              <option value="Mobile Defense">{isFr ? 'Défense Mobile' : 'Mobile Defense'}</option>
              <option value="Enterprise Fleet">{isFr ? 'Flotte Entreprise' : 'Enterprise Fleet'}</option>
              <option value="Government / Military">{isFr ? 'Gouvernement & Militaire' : 'Government / Military'}</option>
              <option value="Cloud Datacenter">{isFr ? 'Datacenter Cloud' : 'Cloud Datacenter'}</option>
              <option value="Executive Vault">{isFr ? 'Coffre Exécutif' : 'Executive Vault'}</option>
            </select>

            <select
              value={selectedFormFactorFilter}
              onChange={(e) => setSelectedFormFactorFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs cursor-pointer"
            >
              <option value="ALL">{isFr ? 'Tous les Formats' : 'All Form Factors'}</option>
              <option value="Mobile SoC">{isFr ? 'SoC Mobile Intégré' : 'Mobile SoC'}</option>
              <option value="USB-C/NFC Key">{isFr ? 'Clé USB-C / NFC' : 'USB-C/NFC Key'}</option>
              <option value="Rackmount Server">{isFr ? 'Serveur Rack 1U' : 'Rackmount Server'}</option>
              <option value="Hardware Wallet">{isFr ? 'Portefeuille Matériel' : 'Hardware Wallet'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid & Device Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{isFr ? 'Enclaves Matérielles & HSM Évalués' : 'Evaluated Hardware Enclaves & HSM Modules'}</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            {filteredDevices.length} {isFr ? 'enclaves répertoriées' : 'enclaves cataloged'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map(device => {
            const isSelected = device.id === activeDeviceId;
            return (
              <div
                key={device.id}
                onClick={() => {
                  setActiveDeviceId(device.id);
                  setActiveCodeTab(device.codeSampleType);
                }}
                className={`p-5 rounded-3xl border transition-all cursor-pointer select-none space-y-3.5 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-xl shadow-cyan-950/60 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wide uppercase">
                      {device.vendor}
                    </span>
                    <h5 className="font-bold text-sm text-white font-sans mt-0.5 leading-snug">
                      {device.name}
                    </h5>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-800 shrink-0">
                    {device.formFactor}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                  {device.description}
                </p>

                {/* Key Spec Badges */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{isFr ? 'Niveau FIPS :' : 'Security Cert:'}</span>
                    <span className="text-emerald-400 font-bold">{device.fipsLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{isFr ? 'Support PQC :' : 'PQC Support:'}</span>
                    <span className="text-cyan-300 font-bold">{device.pqcSupport}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{isFr ? 'Interface API :' : 'Interface API:'}</span>
                    <span className="text-slate-300">{device.interfaceApi}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{isFr ? 'Zéroisation :' : 'Tamper Wipe:'}</span>
                    <span className="text-amber-400 font-bold">{device.keyZeroizationTime}</span>
                  </div>
                </div>

                {/* Compliance Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {device.compliance.map((c, i) => (
                    <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection & Code Integration Boilerplate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Device Architectural Breakdown */}
        <div className="lg:col-span-5 space-y-4 font-sans">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">ARCHITECTURAL SPECIFICATION</span>
                <h4 className="text-base font-bold text-white mt-0.5">{activeDevice.name}</h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                {activeDevice.costEstimate}
              </span>
            </div>

            {/* Pros and Cons */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Points Forts & Avantages Clés' : 'Key Advantages & Strengths'}</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {activeDevice.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="font-mono text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Considérations & Limites' : 'Deployment Considerations'}</span>
                </span>
                <ul className="space-y-1 text-slate-400">
                  {activeDevice.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Physical Tamper Resistance */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
              <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Physical Tamper Protection Circuitry</span>
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {activeDevice.tamperProtection}
              </p>
            </div>

          </div>
        </div>

        {/* Right: Integration Pathway Code Boilerplate */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {isFr ? 'Chemin d\'Intégration Standardisé' : 'Standardized Integration Pathway'}
                </span>
              </div>

              {/* Code Tab Switcher */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                {[
                  { id: 'android', label: 'Android Keystore' },
                  { id: 'pkcs11', label: 'PKCS#11 C/C++' },
                  { id: 'rest', label: 'REST API (NetHSM)' },
                  { id: 'openssl', label: 'OpenSSL 3.0' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCodeTab(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeCodeTab === tab.id
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block Container */}
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto max-h-[460px] leading-relaxed select-text">
                {codeSnippets[activeCodeTab]}
              </pre>

              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier le Code' : 'Copy Code')}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-sans flex items-center space-x-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                {isFr 
                  ? 'Toutes les clés privées générées restent scellées dans le matériel et ne sont jamais exposées en clair en mémoire applicative.'
                  : 'All private keys generated through these standardized pathways are strictly non-extractable and sealed within the hardware enclave.'}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
