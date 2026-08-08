import { DeviceProfile } from './types';

export const HARDWARE_DEVICES: DeviceProfile[] = [
  {
    id: "pixel9-titan",
    name: "Google Pixel 9 Pro / Pixel 8",
    brand: "Google Pixel",
    hardwareSecurityModule: "Titan M2 Dedicated Security Chip",
    securityRating: "Grade A+ (Max Protection)",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    features: {
      strongBox: true,
      quantumKeyIsolation: true,
      physicalAntiTamper: true,
      memoryTaggingMTE: true,
      hwKyberAcceleration: true,
    },
    notes: "Supports Google Titan M2 hardware-enforced StrongBox KeyStore. Full ARM Memory Tagging Extension (MTE) enabled for Custom Hardened Android OS with Secure Kernel."
  },
  {
    id: "librem5-openpgp",
    name: "Purism Librem 5",
    brand: "Purism",
    hardwareSecurityModule: "Smartcard / OpenPGP Hardware Enclave",
    securityRating: "Grade A+ (Open Hardware)",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    features: {
      strongBox: false, // Custom Linux/Android Stack
      quantumKeyIsolation: true,
      physicalAntiTamper: true,
      memoryTaggingMTE: false,
      hwKyberAcceleration: false,
    },
    notes: "Dedicated physical hardware kill-switches for baseband, Wi-Fi, and microphone. Direct smartcard lattice key isolation."
  },
  {
    id: "thinkpad-tpm2",
    name: "Lenovo ThinkPad / Workstation (Android x86 / Emulator)",
    brand: "Lenovo / Enterprise PC",
    hardwareSecurityModule: "Discrete TPM 2.0 / Microsoft Pluton",
    securityRating: "Grade A (Enterprise Workstation)",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    features: {
      strongBox: true,
      quantumKeyIsolation: true,
      physicalAntiTamper: true,
      memoryTaggingMTE: false,
      hwKyberAcceleration: true,
    },
    notes: "Hardware cryptographic isolation using PC discrete TPM 2.0 or Pluton security processor for enterprise MDM containers."
  },
  {
    id: "galaxy-knox",
    name: "Samsung Galaxy S24 / S25 Ultra",
    brand: "Samsung",
    hardwareSecurityModule: "Samsung Knox Vault (EAL6+ Certified)",
    securityRating: "Grade A+ (Knox Isolated)",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    features: {
      strongBox: true,
      quantumKeyIsolation: true,
      physicalAntiTamper: true,
      memoryTaggingMTE: true,
      hwKyberAcceleration: true,
    },
    notes: "Dedicated Knox Vault processor and memory. Tamper-resistant physical shield cuts power to security processor upon physical breach."
  },
  {
    id: "standard-android",
    name: "Standard Android Device (Android 14+)",
    brand: "Generic Android",
    hardwareSecurityModule: "Standard Android TEE (Trusted Execution Environment)",
    securityRating: "Grade B+ (Standard Secure Enclave)",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    features: {
      strongBox: false,
      quantumKeyIsolation: true, // Software KeyStore backed by TEE
      physicalAntiTamper: false,
      memoryTaggingMTE: false,
      hwKyberAcceleration: false,
    },
    notes: "Utilizes Android TEE software-enforced KeyStore with post-quantum Dual-Ratchet fallback."
  }
];

export const INSTALLATION_GUIDES = {
  grapheneOS: {
    title: "Hardened Custom Android OS Installation",
    steps: [
      "Submit your organization information into the Firebase CRM Portal above to request .apk access.",
      "Check your email inbox for the verified, signed QuantumMessenger-v2.4.0-pqc.apk link pushed by Admin.",
      "In Settings > Apps > Special App Access, enable 'Install Unknown Apps' for your sandboxed browser.",
      "Verify the SHA-256 checksum in terminal or using our in-browser validator: sha256sum QuantumMessenger-v2.4.0-pqc.apk",
      "Launch Q-CRYPT. Ensure 'Hardened Malloc' and 'Memory Tagging Extension (MTE)' are active in Hardened Android OS App Info > Security.",
      "Grant Network permission only after initial out-of-band identity verification."
    ]
  },
  calyxOS: {
    title: "Secure Kernel & Privacy Setup",
    steps: [
      "Register in the CRM portal to receive your secure, single-use download link via email.",
      "Transfer the downloaded .apk to your device via encrypted USB-C or F-Droid direct payload.",
      "Under Hardened System Firewall, confirm Q-CRYPT is granted restricted socket access.",
      "Q-CRYPT operates completely independently of Google Play Services (MicroG status: NOT REQUIRED).",
      "Enable 'Panic Trigger' integration in system settings to allow instant emergency key zeroization."
    ]
  },
  enterpriseMDM: {
    title: "Enterprise MDM Deployment (Intune / Knox / VMware)",
    steps: [
      "Add com.qcrypt.quantummessenger.pqc to your Android Enterprise App Catalog.",
      "Upload the managed app configuration JSON containing your Enterprise License Key and KMS endpoint.",
      "Enforce mandatory StrongBox KeyStore requirement across all managed fleet devices.",
      "Set auto-lock timeout to 60 seconds and disable screen capture policy across enterprise profiles."
    ]
  }
};

export const APP_REFERENCE = {
  appName: "Quantum Messenger (Q-CRYPT)",
  appletId: "b6af012a-db66-4207-8f18-cf5f17a4e751",
  packageId: "com.qcrypt.quantummessenger.pqc",
  devUrl: "https://ais-dev-anvnv5w33mig5hmvwrjnpv-1005525931747.europe-west2.run.app",
  sharedUrl: "https://ais-pre-anvnv5w33mig5hmvwrjnpv-1005525931747.europe-west2.run.app",
  nistStandard: "NIST FIPS 203 (ML-KEM-1024) & FIPS 204 (ML-DSA-87)",
  buildVersion: "v2.4.0-pqc-release"
};
