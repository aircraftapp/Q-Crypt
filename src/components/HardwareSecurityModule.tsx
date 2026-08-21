import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Cpu, ShieldCheck, Lock, Radio, Activity, Key, RefreshCw, RotateCw,
  Layers, CheckCircle2, AlertTriangle, Copy, Download,
  Search, Shield, Zap, Sparkles, Play, Flame,
  HardDrive, Gauge, Network,
  Workflow, SlidersHorizontal, CheckCircle, Clock,
  TrendingUp, BarChart2, ShieldAlert, Check, Trash2, RotateCcw,
  FileCheck, Binary, CheckCheck, ShieldX, Terminal, Filter, FileText,
  Printer, Award, FileBadge, QrCode, KeyRound, Fingerprint, Shuffle,
  Crosshair, CircleDot, ChevronRight, Eye, ShieldQuestion, HelpCircle,
  FileCode, BellRing, Power, Battery, BatteryLow, BatteryWarning, Timer, X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  ZAxis,
  Tooltip, 
  ReferenceLine, 
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  HsmDevice, 
  HsmKeyObject, 
  HsmCryptographicOpLog,
  FirmwareIntegrityEvent,
  INITIAL_HSM_DEVICES, 
  INITIAL_HSM_KEYS, 
  INITIAL_HSM_LOGS,
  INITIAL_FIRMWARE_INTEGRITY_LOGS,
  simulateHsmSigning,
  LiveSigningResult,
  verifyHsmFirmwareIntegrity
} from '../services/hsmService';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { HsmDiagnosticLogViewer } from './HsmDiagnosticLogViewer';
import { HsmLatencyMonitor } from './HsmLatencyMonitor';
import { HsmPolicyExporter } from './HsmPolicyExporter';
import { HsmEntropyHealthMonitor } from './HsmEntropyHealthMonitor';
import { HsmSecurityStressTestModal } from './HsmSecurityStressTestModal';
import { HsmTamperHistoryView } from './HsmTamperHistoryView';
import { HsmKeyLifecycleManager } from './HsmKeyLifecycleManager';
import { HsmEntropyAnalysisTab } from './HsmEntropyAnalysisTab';
import { HsmInactivityLockModal } from './HsmInactivityLockModal';
import { HsmSecuritySelfTestSuite } from './HsmSecuritySelfTestSuite';
import { QuantumAdversarySimulator } from './QuantumAdversarySimulator';
import { HsmSelectionGuide } from './HsmSelectionGuide';
import { HsmSecurityBaselineManager } from './HsmSecurityBaselineManager';
import { HsmSecurityHardeningAssistant } from './HsmSecurityHardeningAssistant';
import { HsmApiVolumeVisualizer } from './HsmApiVolumeVisualizer';
import { HsmThermalMonitor } from './HsmThermalMonitor';
import { HsmFirmwareIntegritySection } from './HsmFirmwareIntegritySection';
import { generateHsmSecurityBaselinePdf } from '../utils/generateHsmSecurityBaselinePdf';

interface LatencyDataPoint {
  time: string;
  latency: number;
  baseline: number;
  ops: number;
}

interface SelfTestStep {
  id: number;
  title: string;
  category: string;
  standard: string;
  durationMs: number;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  details: string;
}

export const HardwareSecurityModule: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [devices, setDevices] = useState<HsmDevice[]>(INITIAL_HSM_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('nitrokey-nethsm');
  const [activeTab, setActiveTab] = useState<
    'adversary-simulator' |
    'hsm-selection-guide' |
    'self-test-suite' |
    'security-baseline' |
    'hardening-assistant' |
    'api-volume' |
    'thermal-monitor' |
    'open-source-hsm' | 
    'telemetry' | 
    'latency-monitor' |
    'keys' | 
    'key-lifecycle' |
    'tamper-history' |
    'entropy-analysis' |
    'signer' | 
    'diagnostics' |
    'policy-export' |
    'audit-logs' | 
    'firmware-integrity' | 
    'entropy-distribution' |
    'entropy-health'
  >('adversary-simulator');

  const [isStressTestModalOpen, setIsStressTestModalOpen] = useState<boolean>(false);
  
  // High Load Simulation for Enclave Pulse
  const [isHighLoadSimulated, setIsHighLoadSimulated] = useState<boolean>(false);

  // Session Inactivity Timeout State
  const [inactivityTimeoutMinutes, setInactivityTimeoutMinutes] = useState<number>(5);
  const [secondsRemainingBeforeLock, setSecondsRemainingBeforeLock] = useState<number>(300);
  const [isEnclaveLocked, setIsEnclaveLocked] = useState<boolean>(false);

  // Emergency Power-Off & Ephemeral Volatile Key Shred State
  const [isEmergencyPowerOffArmed, setIsEmergencyPowerOffArmed] = useState<boolean>(true);
  const [simulatedBatteryLevel, setSimulatedBatteryLevel] = useState<number>(86);
  const [isPowerShredModalOpen, setIsPowerShredModalOpen] = useState<boolean>(false);
  const [isVolatileShredded, setIsVolatileShredded] = useState<boolean>(false);
  const [isExecutingPowerShred, setIsExecutingPowerShred] = useState<boolean>(false);
  const [ephemeralVolatileSlots, setEphemeralVolatileSlots] = useState<{
    address: string;
    name: string;
    lifetime: string;
    dataHex: string;
    isShredded: boolean;
  }>([
    { address: '0x00FF80', name: 'ML-KEM-1024 Ephemeral Shared Secret (SS)', lifetime: 'Volatile SRAM', dataHex: 'c3f19a08e2b744d901a884ef', isShredded: false },
    { address: '0x00FFA0', name: 'AES-256-GCM Ephemeral Ratchet Key (EK)', lifetime: 'Volatile SRAM', dataHex: '7d8e209ab410fc93041938bc', isShredded: false },
    { address: '0x00FFC0', name: 'Kyber NTT Decapsulation Scratchpad', lifetime: 'Volatile SRAM', dataHex: '55aa112233448899bbccddee', isShredded: false },
    { address: '0x00FFE0', name: 'FIDO2 Biometric Session Assertion Token', lifetime: 'Volatile SRAM', dataHex: '9900aabbccddeeff11223344', isShredded: false },
  ]);
  const [emergencyShredLogs, setEmergencyShredLogs] = useState<string[]>([
    '[INIT] Hardware Power-Loss Fast-Path capacitor armed (FIPS 140-3 §4.10).',
    '[STANDBY] Battery level monitoring active. Low threshold set to <= 5%.'
  ]);

  const [keys, setKeys] = useState<HsmKeyObject[]>(INITIAL_HSM_KEYS);
  const [searchKeyQuery, setSearchKeyQuery] = useState('');
  const [selectedKeyId, setSelectedKeyId] = useState<string>('key-pqc-root-01');

  // Firmware Integrity Log State
  const [firmwareLogs, setFirmwareLogs] = useState<FirmwareIntegrityEvent[]>(INITIAL_FIRMWARE_INTEGRITY_LOGS);
  const [fwFilterStatus, setFwFilterStatus] = useState<string>('ALL');
  const [fwSearchQuery, setFwSearchQuery] = useState<string>('');
  const [isVerifyingFw, setIsVerifyingFw] = useState<boolean>(false);
  const [selectedFwEvent, setSelectedFwEvent] = useState<FirmwareIntegrityEvent | null>(null);
  
  // Interactive Signer State
  const [payloadText, setPayloadText] = useState<string>(
    JSON.stringify({
      message: "Executive Quantum Telemetry - Level 5 Clearance",
      destinationNode: "mesh-eu-central-01.q-crypt.sec",
      timestamp: new Date().toISOString(),
      classification: "TOP_SECRET_PQC_RESTRICTED"
    }, null, 2)
  );
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signingResult, setSigningResult] = useState<LiveSigningResult | null>(null);

  // Live Heartbeat & Telemetry state
  const [opLogs, setOpLogs] = useState<HsmCryptographicOpLog[]>(INITIAL_HSM_LOGS);
  const [logFilterOp, setLogFilterOp] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [liveOpsPerSec, setLiveOpsPerSec] = useState<number>(4280);
  const [liveLatencyMs, setLiveLatencyMs] = useState<number>(1.35);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [heartbeatPulse, setHeartbeatPulse] = useState<boolean>(false);

  // Recharts Real-Time Latency History State
  const [latencyHistory, setLatencyHistory] = useState<LatencyDataPoint[]>(() => {
    const initial: LatencyDataPoint[] = [];
    const now = Date.now();
    for (let i = 15; i >= 0; i--) {
      const d = new Date(now - i * 2000);
      const timeStr = d.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
      const lat = parseFloat((1.15 + (Math.random() * 0.45)).toFixed(2));
      initial.push({
        time: timeStr,
        latency: lat,
        baseline: 1.50,
        ops: 4200 + Math.round((Math.random() - 0.5) * 300)
      });
    }
    return initial;
  });

  // FIPS 140-3 Power-On Self-Test (POST) State
  const [isSelfTestRunning, setIsSelfTestRunning] = useState<boolean>(false);
  const [selfTestProgress, setSelfTestProgress] = useState<number>(0);
  const [isSelfTestModalOpen, setIsSelfTestModalOpen] = useState<boolean>(false);
  const [selfTestComplete, setSelfTestComplete] = useState<boolean>(false);

  // Key Entropy Meter & Active Key Rotation State
  const [entropyValue, setEntropyValue] = useState<number>(7.9942);
  const [isRotatingKey, setIsRotatingKey] = useState<boolean>(false);
  const [rotationStep, setRotationStep] = useState<string>('IDLE');
  const [rotationProgress, setRotationProgress] = useState<number>(0);
  const [isContinuousRngSampling, setIsContinuousRngSampling] = useState<boolean>(true);
  const [entropyHistory, setEntropyHistory] = useState<{ time: string; entropy: number; minEntropy: number }[]>(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 12; i >= 0; i--) {
      const d = new Date(now - i * 3000);
      const timeStr = d.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
      initial.push({
        time: timeStr,
        entropy: parseFloat((7.992 + Math.random() * 0.006).toFixed(4)),
        minEntropy: 7.980
      });
    }
    return initial;
  });

  const [rngHealthMetrics, setRngHealthMetrics] = useState({
    rctStatus: 'PASS' as 'PASS' | 'FAIL',
    aptStatus: 'PASS' as 'PASS' | 'FAIL',
    minEntropy: 7.993,
    chiSquarePValue: 0.518,
    shannonEntropy: 7.996,
    samplesTested: 65536,
    noiseSource: 'Dual Zener Diode Avalanche & Ring Oscillator'
  });

  // Multi-step 'Zeroize Security Keys' Confirmation Dialog State
  const [isZeroizeDialogOpen, setIsZeroizeDialogOpen] = useState<boolean>(false);
  const [zeroizeStep, setZeroizeStep] = useState<1 | 2 | 3>(1);
  const [zeroizeAuthToken, setZeroizeAuthToken] = useState<string>('');
  const [simulatedOfficerToken, setSimulatedOfficerToken] = useState<string>('849201');
  const [zeroizeChallengeWord, setZeroizeChallengeWord] = useState<string>('');
  const [zeroizeScope, setZeroizeScope] = useState<'CURRENT_HSM' | 'ALL_CLUSTER'>('CURRENT_HSM');
  const [isAuthorizingZeroize, setIsAuthorizingZeroize] = useState<boolean>(false);

  // Printable Physical HSM Audit Certificate State
  const [isAuditCertModalOpen, setIsAuditCertModalOpen] = useState<boolean>(false);
  const [certGeneratedTime, setCertGeneratedTime] = useState<string>(new Date().toISOString());

  // Entropy Distribution State (QRNG / TRNG 2D Return Map Scatter Plot)
  const [entropySource, setEntropySource] = useState<'ZENER' | 'QUANTUM_VACUUM' | 'RING_OSCILLATOR'>('ZENER');
  const [scatterPoints, setScatterPoints] = useState<Array<{ id: number; x: number; y: number; z: number; byteHex: string; density: number }>>(() => {
    const pts = [];
    for (let i = 0; i < 320; i++) {
      const x = Math.floor(Math.random() * 256);
      const y = Math.floor(Math.random() * 256);
      pts.push({
        id: i,
        x,
        y,
        z: Math.floor(Math.random() * 60) + 40,
        byteHex: `0x${x.toString(16).padStart(2, '0').toUpperCase()}${y.toString(16).padStart(2, '0').toUpperCase()}`,
        density: Math.floor(Math.random() * 100)
      });
    }
    return pts;
  });
  const [byteHistogram, setByteHistogram] = useState<Array<{ bin: string; frequency: number; expected: number }>>([
    { bin: '0x00-0x0F', frequency: 21, expected: 20 },
    { bin: '0x10-0x1F', frequency: 19, expected: 20 },
    { bin: '0x20-0x2F', frequency: 20, expected: 20 },
    { bin: '0x30-0x3F', frequency: 22, expected: 20 },
    { bin: '0x40-0x4F', frequency: 18, expected: 20 },
    { bin: '0x50-0x5F', frequency: 20, expected: 20 },
    { bin: '0x60-0x6F', frequency: 21, expected: 20 },
    { bin: '0x70-0x7F', frequency: 19, expected: 20 },
    { bin: '0x80-0x8F', frequency: 20, expected: 20 },
    { bin: '0x90-0x9F', frequency: 21, expected: 20 },
    { bin: '0xA0-0xAF', frequency: 19, expected: 20 },
    { bin: '0xB0-0xBF', frequency: 20, expected: 20 },
    { bin: '0xC0-0xCF', frequency: 22, expected: 20 },
    { bin: '0xD0-0xDF', frequency: 18, expected: 20 },
    { bin: '0xE0-0xEF', frequency: 20, expected: 20 },
    { bin: '0xF0-0xFF', frequency: 20, expected: 20 }
  ]);
  const [rawBitstream, setRawBitstream] = useState<string>('11010010 10101111 00110101 11110000 01101001 10010110 11000011 00011100 10110100 01011101 11100010 00110110');
  const [isLiveEntropySampling, setIsLiveEntropySampling] = useState<boolean>(true);
  const [quantumBurstCount, setQuantumBurstCount] = useState<number>(320);

  // Tamper Event & Emergency Zeroization State
  const [isTamperModalOpen, setIsTamperModalOpen] = useState<boolean>(false);
  const [tamperPhase, setTamperPhase] = useState<'IDLE' | 'DETECTION' | 'CROWBAR_DISCHARGE' | 'ZEROIZING_SRAM' | 'ISOLATING_BUS' | 'LOCKED_ZEROIZED'>('IDLE');
  const [tamperProgress, setTamperProgress] = useState<number>(0);
  const [tamperLogs, setTamperLogs] = useState<string[]>([]);
  const [zeroizedMemorySlots, setZeroizedMemorySlots] = useState<{
    address: string;
    label: string;
    algorithm: string;
    hexDump: string;
    isWiped: boolean;
  }[]>([
    { address: '0x0000FF10', label: 'ML-KEM-1024 Master Private Key', algorithm: 'FIPS 203 (Lattice)', hexDump: '8a9c2e1f4b7a6d8c9e0f1a2b3c4d5e6f', isWiped: false },
    { address: '0x0000FF30', label: 'ML-DSA-87 Root Signing Secret', algorithm: 'FIPS 204 (Dilithium)', hexDump: '7f3a2c9d1e8b4a5f6e7d8c9b0a1f2e3d', isWiped: false },
    { address: '0x0000FF50', label: 'Kyber1024 Session KEK Enclave', algorithm: 'NIST Round 3', hexDump: '112233445566778899aabbccddeeff00', isWiped: false },
    { address: '0x0000FF70', label: 'DRBG Reseed State Vector (TRNG)', algorithm: 'NIST SP 800-90A', hexDump: 'ffeeddccbbaa99887766554433221100', isWiped: false },
    { address: '0x0000FF90', label: 'OpenTitan Attestation Seed Key', algorithm: 'Silicon RoT', hexDump: 'cafebabe0102030405060708deadbeef', isWiped: false }
  ]);
  const [selfTestSteps, setSelfTestSteps] = useState<SelfTestStep[]>([
    {
      id: 1,
      title: 'Firmware Digest & Microcode ROM Integrity',
      category: 'CRYPTOGRAPHIC INTEGRITY',
      standard: 'FIPS 140-3 §4.9.1 (SHA3-512)',
      durationMs: 45,
      status: 'PENDING',
      details: 'Calculated ROM hash matches factory FIPS signature vector (0x8F9C...3A12).'
    },
    {
      id: 2,
      title: 'Known Answer Test (KAT): NIST FIPS 204 ML-DSA-87',
      category: 'POST-QUANTUM SIGNATURE',
      standard: 'NIST FIPS 204 KAT Matrix',
      durationMs: 68,
      status: 'PENDING',
      details: 'Deterministic lattice signing & matrix verification matches test vector.'
    },
    {
      id: 3,
      title: 'Known Answer Test (KAT): NIST FIPS 203 ML-KEM-1024',
      category: 'POST-QUANTUM ENCAPSULATION',
      standard: 'NIST FIPS 203 KAT Vector',
      durationMs: 52,
      status: 'PENDING',
      details: 'Decapsulation derived shared secret equates exactly to standard seed.'
    },
    {
      id: 4,
      title: 'Continuous Health Test (CHT): NIST SP 800-90B TRNG',
      category: 'ENTROPY HEALTH',
      standard: 'NIST SP 800-90B Repetition & Adaptive Test',
      durationMs: 85,
      status: 'PENDING',
      details: 'Dual Zener diode avalanche noise passed RCT and APT with 0 entropy loss.'
    },
    {
      id: 5,
      title: 'Physical Active Tamper Mesh & Boundary Sensors',
      category: 'PHYSICAL ENCLAVE INTEGRITY',
      standard: 'FIPS 140-3 Level 3/4 Physical Boundary',
      durationMs: 38,
      status: 'PENDING',
      details: 'Micro-wire sensor grid continuity, voltage thresholds, and laser sensors nominal.'
    },
    {
      id: 6,
      title: 'Zeroization Discharge Circuitry Readiness',
      category: 'ANTI-FORENSIC ZEROIZATION',
      standard: 'FIPS 140-3 Zeroization Fast-Path',
      durationMs: 24,
      status: 'PENDING',
      details: 'Emergency 4-microsecond key purge discharge capacitor armed and verified.'
    }
  ]);

  // Open-Source HSM Slot Configuration & Bridge State
  const [hsmConnections, setHsmConnections] = useState<{
    [key: string]: {
      status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCHRONIZING';
      endpoint: string;
      activeSlot: string;
      assignedPkiRole: string;
      tokenLabel: string;
      trngStatus: 'OPTIMAL' | 'VERIFIED';
      ckaSensitive: boolean;
      ckaExtractable: boolean;
      ckaAlwaysAuth: boolean;
    };
  }>({
    'nitrokey-nethsm': {
      status: 'CONNECTED',
      endpoint: 'https://nethsm-fra-01.q-crypt.sec:8443 (TLS 1.3 mTLS)',
      activeSlot: 'Slot 0x01',
      assignedPkiRole: 'Enterprise Root PQC CA (ML-DSA-87)',
      tokenLabel: 'NetHSM-PQC-Vault-01',
      trngStatus: 'OPTIMAL',
      ckaSensitive: true,
      ckaExtractable: false,
      ckaAlwaysAuth: true
    },
    'opentitan-sot': {
      status: 'CONNECTED',
      endpoint: 'SPI/I3C Direct Hardware Enclave (Titan M2 RoT)',
      activeSlot: 'Slot 0x03',
      assignedPkiRole: 'Silicon Device Attestation & Measured Boot',
      tokenLabel: 'OpenTitan-EarlGrey-RoT',
      trngStatus: 'OPTIMAL',
      ckaSensitive: true,
      ckaExtractable: false,
      ckaAlwaysAuth: true
    },
    'softhsm2-oqs': {
      status: 'CONNECTED',
      endpoint: '/usr/lib/softhsm/libsofthsm2.so (POSIX PKCS#11)',
      activeSlot: 'Slot 0x02',
      assignedPkiRole: 'CI/CD Automated Testing & PQC Sandbox',
      tokenLabel: 'SoftHSM-OQS-Liboqs-02',
      trngStatus: 'VERIFIED',
      ckaSensitive: true,
      ckaExtractable: false,
      ckaAlwaysAuth: false
    }
  });

  // Selected Device
  const selectedDevice = useMemo(() => {
    return devices.find(d => d.id === selectedDeviceId) || devices[0];
  }, [devices, selectedDeviceId]);

  // Keys for current device
  const deviceKeys = useMemo(() => {
    return keys.filter(k => k.hsmId === selectedDevice.id);
  }, [keys, selectedDevice.id]);

  const filteredKeys = useMemo(() => {
    if (!searchKeyQuery.trim()) return deviceKeys;
    const q = searchKeyQuery.toLowerCase();
    return deviceKeys.filter(k => 
      k.label.toLowerCase().includes(q) ||
      k.algorithm.toLowerCase().includes(q) ||
      k.keyHandle.toLowerCase().includes(q) ||
      k.assignedApplication.toLowerCase().includes(q)
    );
  }, [deviceKeys, searchKeyQuery]);

  const activeKey = useMemo(() => {
    return keys.find(k => k.id === selectedKeyId) || deviceKeys[0] || keys[0];
  }, [keys, selectedKeyId, deviceKeys]);

  // Filtered Audit Logs
  const filteredOpLogs = useMemo(() => {
    return opLogs.filter(log => {
      const matchOp = logFilterOp === 'ALL' || log.operation === logFilterOp;
      const matchSearch = !logSearchQuery.trim() || 
        log.keyLabel.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.algorithm.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.clientIp.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.slot.toLowerCase().includes(logSearchQuery.toLowerCase());
      return matchOp && matchSearch;
    });
  }, [opLogs, logFilterOp, logSearchQuery]);

  // Filtered Firmware Integrity Logs
  const filteredFwLogs = useMemo(() => {
    return firmwareLogs.filter(log => {
      const matchStatus = fwFilterStatus === 'ALL' || 
        (fwFilterStatus === 'MATCH' && log.status === 'MATCH') ||
        (fwFilterStatus === 'MISMATCH' && (log.status === 'MISMATCH' || log.status === 'TAMPER_ALERT')) ||
        (fwFilterStatus === 'RE_BASELINED' && log.status === 'RE_BASELINED');
      
      const q = fwSearchQuery.trim().toLowerCase();
      const matchSearch = !q ||
        log.firmwareVersion.toLowerCase().includes(q) ||
        log.component.toLowerCase().includes(q) ||
        log.computedHash.toLowerCase().includes(q) ||
        log.hsmName.toLowerCase().includes(q) ||
        log.signingKeyValidation.signer.toLowerCase().includes(q);
      
      return matchStatus && matchSearch;
    });
  }, [firmwareLogs, fwFilterStatus, fwSearchQuery]);

  const handleRunFirmwareVerification = (simulateTamper: boolean = false) => {
    setIsVerifyingFw(true);
    showToast(
      simulateTamper ? 'Simulating Tamper Detection...' : 'Calculating ROM SHA3-512 Digest...',
      `Validating microcode integrity against certified FIPS 140-3 golden hash for ${selectedDevice.name}`,
      'info'
    );

    setTimeout(() => {
      const newEvent = verifyHsmFirmwareIntegrity(
        selectedDevice, 
        'Secure Boot Stage 0 (Immutable ROM)',
        simulateTamper
      );
      setFirmwareLogs(prev => [newEvent, ...prev]);
      setIsVerifyingFw(false);

      if (newEvent.status === 'MATCH') {
        showToast(
          'Firmware Integrity Validated',
          `Golden hash verified (0 soft errors, SHA3-512 bit-equality confirmed).`,
          'success'
        );
      } else {
        showToast(
          'FIPS 140-3 CHECKSUM MISMATCH!',
          `Integrity anomaly detected in ${selectedDevice.name}. Isolation barrier armed.`,
          'error'
        );
      }
    }, 600);
  };

  const handleExportFirmwareManifest = () => {
    const manifest = {
      exportedAt: new Date().toISOString(),
      standard: 'FIPS 140-3 Level 3 & Level 4 Firmware Validation Matrix',
      deviceId: selectedDevice.id,
      deviceName: selectedDevice.name,
      fipsCertificate: selectedDevice.fipsCertificateNumber,
      events: firmwareLogs
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firmware-integrity-manifest-${selectedDevice.id}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Manifest Exported', 'Downloaded signed cryptographic firmware integrity manifest.', 'success');
  };

  const handleDownloadActiveSecurityBaselinePdf = () => {
    try {
      const baselinePolicy = {
        schemaVersion: '2026.1-FIPS140-3',
        baselineId: `BASELINE-${selectedDevice.id.toUpperCase()}-${new Date().toISOString().slice(0, 10)}`,
        generatedTimestamp: new Date().toISOString(),
        device: {
          id: selectedDevice.id,
          name: selectedDevice.name,
          vendor: selectedDevice.vendor,
          model: selectedDevice.type,
          fipsCertificationLevel: selectedDevice.fipsLevel,
          fipsCertificateNumber: selectedDevice.fipsCertificateNumber,
          activeFirmwareVersion: selectedDevice.firmware,
          firmwareSha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          hardwareRootOfTrust: 'Titan M2 / Knox StrongBox Physical Silicon Die',
          tamperMeshStatus: selectedDevice.tamperMeshIntact ? 'ACTIVE_ARMED' : 'BREACH_DETECTED'
        },
        keyStrengthSettings: {
          keyEncapsulationMechanism: 'ML-KEM-1024 (Kyber-1024, NIST FIPS 203)',
          kemSecurityBits: 256,
          digitalSignatureAlgorithm: 'ML-DSA-87 (Dilithium-5, NIST FIPS 204)',
          dsaSecurityBits: 256,
          symmetricCipher: 'AES-256-GCM Enclave-Wrapped',
          symmetricKeyBits: 256,
          hashAndDigestStandard: 'SHA-384 & SHA3-512',
          keyExtractionPolicy: 'NEVER_EXTRACTABLE_HARDWARE_BOUND',
          mOfNQuorumRequired: '2-of-3 Multi-Party Cryptographic Authorization',
          zeroizationTriggerLatencyUs: 2.4
        },
        sideChannelMitigations: {
          laserFaultInjectionGuard: true,
          differentialPowerAnalysisShielding: true,
          thermalPanicShutdownThresholdC: 75,
          clockGlitchInterlockArmed: true,
          jitterToleranceMs: 0.15
        },
        entropyHealthThresholds: {
          minimumEntropyPerBit: 7.994,
          continuousAptRctChecks: true,
          noiseSourceRedundancy: 'Dual Zener Avalanche Diode & Ring Oscillator Array',
          shannonEntropyBaseline: 7.998
        },
        osPrerequisitesEnforced: {
          usbDebuggingDisabled: true,
          biometricLockoutThreshold: 3,
          verifiedBootGreenState: true,
          memoryTaggingStrictMode: true,
          flagSecureScreenCaptureBlocked: true,
          inactivityLockTimeoutSec: inactivityTimeoutMinutes * 60 || 300
        },
        baselineFingerprintSha256: '4d8a1f73b62c90e5421a8f93e41b2c6d7e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b'
      };
      generateHsmSecurityBaselinePdf(baselinePolicy);
      showToast('Security Baseline PDF Downloaded', `Exported human-readable FIPS 140-3 baseline report for ${selectedDevice.name}`, 'success');
    } catch (err) {
      console.error('Failed to download baseline PDF:', err);
      showToast('Export Error', 'Unable to generate security baseline PDF report.', 'error');
    }
  };

  // Real-time Heartbeat & Recharts Latency Simulator
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      setHeartbeatPulse(prev => !prev);
      
      // Jitter ops count and latency
      const jitterFactor = (Math.random() - 0.5) * 400;
      const baseOps = selectedDevice.id === 'thales-luna-pcie' ? 18500 : 
                      selectedDevice.id === 'nitrokey-nethsm' ? 6200 : 
                      selectedDevice.id === 'opentitan-sot' ? 3100 : 12000;
      
      const newOps = Math.round(Math.max(100, baseOps + jitterFactor));
      const newLat = parseFloat((1.1 + Math.random() * 0.48).toFixed(2));

      setLiveOpsPerSec(newOps);
      setLiveLatencyMs(newLat);

      // Append data point to Recharts latency graph
      const timeStr = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
      setLatencyHistory(prev => {
        const nextPoint: LatencyDataPoint = {
          time: timeStr,
          latency: newLat,
          baseline: 1.50,
          ops: newOps
        };
        const updated = [...prev.slice(1), nextPoint];
        return updated;
      });

      // Periodically append background HSM log if active
      if (Math.random() > 0.45 && selectedDevice.status === 'ONLINE') {
        const algorithms = ['ML-DSA-87', 'ML-KEM-1024', 'AES-256-GCM', 'SPHINCS+'];
        const operations: ('C_Sign' | 'C_Decapsulate' | 'C_DeriveKey')[] = ['C_Sign', 'C_Decapsulate', 'C_DeriveKey'];
        const randomOp = operations[Math.floor(Math.random() * operations.length)];
        const randomAlgo = algorithms[Math.floor(Math.random() * algorithms.length)];
        
        const newLog: HsmCryptographicOpLog = {
          id: `op-live-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
          hsmId: selectedDevice.id,
          hsmName: selectedDevice.name.split(' ')[0],
          operation: randomOp,
          algorithm: randomAlgo,
          keyLabel: `${selectedDevice.activeSlot} Master Key`,
          durationMs: parseFloat((0.8 + Math.random() * 1.2).toFixed(2)),
          status: 'SUCCESS',
          slot: selectedDevice.activeSlot.split(' ')[0] + ' ' + selectedDevice.activeSlot.split(' ')[1],
          clientIp: `10.180.${Math.floor(Math.random() * 40)}.${Math.floor(Math.random() * 250)} (Mesh Enclave)`,
          signatureHex: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          details: 'Real-time hardware cryptographic operation completed within FIPS boundary.'
        };

        setOpLogs(prev => [newLog, ...prev.slice(0, 79)]);
      }
    }, 2000);

    return () => clearInterval(heartbeatInterval);
  }, [selectedDevice]);

  // Continuous TRNG Random Number Generation Sampling Effect
  useEffect(() => {
    if (!isContinuousRngSampling || isRotatingKey) return;

    const rngSamplingInterval = setInterval(() => {
      const noise = (Math.random() - 0.5) * 0.003;
      const baseEntropy = selectedDevice.id === 'nitrokey-nethsm' ? 7.996 : 
                          selectedDevice.id === 'opentitan-sot' ? 7.994 : 7.998;
      const sampledVal = parseFloat(Math.min(8.000, Math.max(7.980, baseEntropy + noise)).toFixed(4));
      
      setEntropyValue(sampledVal);

      const timeStr = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
      setEntropyHistory(prev => [
        ...prev.slice(1),
        {
          time: timeStr,
          entropy: sampledVal,
          minEntropy: 7.980
        }
      ]);
    }, 2500);

    return () => clearInterval(rngSamplingInterval);
  }, [isContinuousRngSampling, isRotatingKey, selectedDevice]);

  // Key Rotation Execution with multi-stage RNG entropy quality validation
  const handleRotateSelectedKey = (targetKeyObj?: HsmKeyObject) => {
    const target = targetKeyObj || activeKey;
    if (!target) return;

    setIsRotatingKey(true);
    setRotationProgress(5);
    setRotationStep('SAMPLING_TRNG');
    showToast('Key Rotation Initiated', `Activating TRNG noise source to rekey ${target.label}...`, 'info');

    // Stage 1: TRNG Avalanche Noise Sampling
    setTimeout(() => {
      setRotationProgress(30);
      setRotationStep('NIST_HEALTH_TEST');
      const sampled = parseFloat((7.995 + Math.random() * 0.004).toFixed(4));
      setEntropyValue(sampled);
      setRngHealthMetrics(prev => ({
        ...prev,
        shannonEntropy: sampled,
        minEntropy: parseFloat((sampled - 0.002).toFixed(4)),
        chiSquarePValue: parseFloat((0.48 + Math.random() * 0.1).toFixed(3)),
        samplesTested: prev.samplesTested + 16384
      }));

      // Stage 2: NIST SP 800-90B Continuous Health Testing (RCT & APT)
      setTimeout(() => {
        setRotationProgress(60);
        setRotationStep('SEEDING_DRBG');
        const drbgSample = parseFloat((7.997 + Math.random() * 0.002).toFixed(4));
        setEntropyValue(drbgSample);

        // Stage 3: Lattice Matrix Secret Key Synthesis
        setTimeout(() => {
          setRotationProgress(85);
          setRotationStep('GENERATING_LATTICE');

          // Stage 4: Token Slot Write & Zeroization of Old Key
          setTimeout(() => {
            const finalEntropy = parseFloat((7.998 + Math.random() * 0.0015).toFixed(4));
            setEntropyValue(finalEntropy);
            setRotationProgress(100);
            setRotationStep('COMPLETED');
            setIsRotatingKey(false);

            const hexHandle = '0x' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('').toUpperCase();
            const nowIso = new Date().toISOString();

            // Update key object
            setKeys(prev => prev.map(k => {
              if (k.id === target.id) {
                return {
                  ...k,
                  keyHandle: hexHandle,
                  createdDate: nowIso.slice(0, 10),
                  usageCount: 0
                };
              }
              return k;
            }));

            // Record Operation History Log
            const rotLog: HsmCryptographicOpLog = {
              id: `op-rot-${Date.now()}`,
              timestamp: nowIso,
              hsmId: selectedDevice.id,
              hsmName: selectedDevice.name,
              operation: 'C_DeriveKey',
              algorithm: target.algorithm,
              keyLabel: target.label,
              durationMs: parseFloat((3.4 + Math.random() * 0.8).toFixed(2)),
              status: 'SUCCESS',
              slot: target.slotId,
              clientIp: '127.0.0.1 (Internal TRNG Enclave)',
              signatureHex: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
              details: `Active key rotation completed with physical TRNG entropy (${finalEntropy} bits/byte). NIST SP 800-90B RCT/APT verified.`
            };
            setOpLogs(prev => [rotLog, ...prev]);

            showToast(
              'Key Rotated & Re-keyed',
              `${target.label} rotated with ${finalEntropy} bits/byte true quantum entropy.`,
              'success'
            );
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  };

  // Execute FIPS 140-3 Power-On Self-Test (POST)
  const handleRunSelfTest = () => {
    setIsSelfTestModalOpen(true);
    setIsSelfTestRunning(true);
    setSelfTestComplete(false);
    setSelfTestProgress(0);

    // Reset steps to PENDING
    setSelfTestSteps(prev => prev.map(s => ({ ...s, status: 'PENDING' })));

    let currentStepIdx = 0;
    const totalSteps = 6;

    const runNextStep = () => {
      if (currentStepIdx >= totalSteps) {
        setIsSelfTestRunning(false);
        setSelfTestComplete(true);
        setSelfTestProgress(100);
        showToast('FIPS 140-3 POST Complete', 'All 6 cryptographic & hardware boundary tests PASSED.', 'success');
        
        // Add self-test log to audit trail
        const postLog: HsmCryptographicOpLog = {
          id: `op-post-${Date.now()}`,
          timestamp: new Date().toISOString(),
          hsmId: selectedDevice.id,
          hsmName: selectedDevice.name,
          operation: 'C_Sign',
          algorithm: 'FIPS 140-3 POST',
          keyLabel: 'Internal Self-Test Diagnostic Vector',
          durationMs: 312,
          status: 'SUCCESS',
          slot: 'Slot 0x00 (Diag)',
          clientIp: '127.0.0.1 (FIPS Firmware POST)',
          signatureHex: '9a4c8e1f0b2d3e4a5f6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
          details: 'FIPS 140-3 Power-On Self-Test (POST): KAT ML-DSA-87, KAT ML-KEM-1024, TRNG CHT, Tamper Mesh all VERIFIED.'
        };
        setOpLogs(prev => [postLog, ...prev]);
        return;
      }

      const stepNum = currentStepIdx + 1;
      
      // Set current step to RUNNING
      setSelfTestSteps(prev => prev.map((s, idx) => 
        idx === currentStepIdx ? { ...s, status: 'RUNNING' } : s
      ));

      const stepDuration = [450, 600, 500, 700, 400, 350][currentStepIdx] || 500;

      setTimeout(() => {
        // Mark step PASSED
        setSelfTestSteps(prev => prev.map((s, idx) => 
          idx === currentStepIdx ? { ...s, status: 'PASSED' } : s
        ));
        
        currentStepIdx++;
        setSelfTestProgress(Math.round((currentStepIdx / totalSteps) * 100));
        runNextStep();
      }, stepDuration);
    };

    runNextStep();
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast('Copied to Clipboard', label, 'success');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleExecuteHsmSign = () => {
    if (!activeKey) return;
    if (selectedDevice.status === 'ZEROIZED') {
      showToast('HSM Zeroized', 'Hardware is currently zeroized. Restore keys to resume signing.', 'error');
      return;
    }

    setIsSigning(true);
    setTimeout(() => {
      const res = simulateHsmSigning(selectedDevice, activeKey, payloadText);
      setSigningResult(res);
      setIsSigning(false);

      // Increment usage count in state
      setKeys(prev => prev.map(k => k.id === activeKey.id ? { ...k, usageCount: k.usageCount + 1 } : k));

      // Append log
      const logEntry: HsmCryptographicOpLog = {
        id: `op-user-${Date.now()}`,
        timestamp: new Date().toISOString(),
        hsmId: selectedDevice.id,
        hsmName: selectedDevice.name,
        operation: 'C_Sign',
        algorithm: activeKey.algorithm,
        keyLabel: activeKey.label,
        durationMs: res.executionTimeMs,
        status: 'SUCCESS',
        slot: activeKey.slotId,
        clientIp: '127.0.0.1 (Local Operator Console)',
        signatureHex: res.signatureHex,
        details: `Interactive ${activeKey.algorithm} hardware signature created.`
      };
      setOpLogs(prev => [logEntry, ...prev]);

      showToast('Hardware Signature Created', `${activeKey.algorithm} executed in ${res.executionTimeMs}ms`, 'success');
    }, 380);
  };

  const handleTriggerZeroization = () => {
    setDevices(prev => prev.map(d => {
      if (d.id === selectedDevice.id) {
        return {
          ...d,
          status: 'ZEROIZED',
          storedKeysCount: 0,
          activeSlot: 'EMERGENCY_ZEROIZED'
        };
      }
      return d;
    }));
    setSigningResult(null);
    showToast('Anti-Forensic Zeroization Triggered', 'All cryptographic keys in hardware enclave destroyed in 4µs.', 'error');
  };

  const handleSimulateTamperEvent = () => {
    setIsTamperModalOpen(true);
    setTamperPhase('DETECTION');
    setTamperProgress(15);
    setTamperLogs([
      `[0.00ms] PHYSICAL SENSOR TRIP: Micro-wire active conductive mesh breach on ${selectedDevice.name}`,
      `[0.18ms] VOLTAGE DISCONTINUITY: Rapid capacitance delta detected across silicon shield layer 4`
    ]);

    // Reset memory slots
    setZeroizedMemorySlots(prev => prev.map(s => ({ ...s, isWiped: false })));

    // Stage 1: Crowbar Circuit Discharge
    setTimeout(() => {
      setTamperPhase('CROWBAR_DISCHARGE');
      setTamperProgress(45);
      setTamperLogs(prev => [
        ...prev,
        `[0.55ms] HARDWARE CROWBAR FIRED: Battery-backed SRAM VCC line grounded to 0.0V in 12ns`,
        `[0.82ms] THERMAL & DRILL INTERRUPT: Cryogenic / laser trigger line asserted`
      ]);

      // Stage 2: Memory Overwrite & Zeroize
      setTimeout(() => {
        setTamperPhase('ZEROIZING_SRAM');
        setTamperProgress(75);
        setTamperLogs(prev => [
          ...prev,
          `[1.15ms] CRYPTOGRAPHIC PURGE: Overwriting FIPS 203 & FIPS 204 private keys with 0x00...`,
          `[1.60ms] DRBG SEED DESTROYED: Internal entropy pools cleared to absolute zero state`
        ]);

        // Animate wiping slots
        setZeroizedMemorySlots(prev => prev.map(s => ({ ...s, isWiped: true })));

        // Stage 3: Bus Isolation & State Lock
        setTimeout(() => {
          setTamperPhase('ISOLATING_BUS');
          setTamperProgress(90);
          setTamperLogs(prev => [
            ...prev,
            `[2.20ms] BUS ISOLATION: PKCS#11 sessions severed; PCIe/USB controller severed`,
            `[2.80ms] PERSISTENT ATTRIBUTES: CKA_EXTRACTABLE and CKA_SENSITIVE flags erased`
          ]);

          // Stage 4: Locked / Zeroized Completed
          setTimeout(() => {
            setTamperPhase('LOCKED_ZEROIZED');
            setTamperProgress(100);
            setTamperLogs(prev => [
              ...prev,
              `[3.40ms] TAMPER CONTAINMENT COMPLETE: Hardware enclave is locked/zeroized. Status = ZEROIZED.`
            ]);

            // Mutate HSM devices status
            setDevices(prev => prev.map(d => {
              if (d.id === selectedDevice.id) {
                return {
                  ...d,
                  status: 'ZEROIZED',
                  storedKeysCount: 0,
                  activeSlot: 'EMERGENCY_ZEROIZED'
                };
              }
              return d;
            }));

            // Mutate open source HSM connection status
            setHsmConnections(prev => ({
              ...prev,
              'nitrokey-nethsm': { ...prev['nitrokey-nethsm'], status: 'DISCONNECTED' },
              'opentitan-sot': { ...prev['opentitan-sot'], status: 'DISCONNECTED' }
            }));

            setSigningResult(null);

            // Add incident response audit log
            const tamperOpLog: HsmCryptographicOpLog = {
              id: `op-tamper-${Date.now()}`,
              timestamp: new Date().toISOString(),
              hsmId: selectedDevice.id,
              hsmName: selectedDevice.name,
              operation: 'C_Sign',
              algorithm: 'EMERGENCY_ZEROIZE',
              keyLabel: 'ALL ENCLAVE KEYS PURGED',
              durationMs: 3.4,
              status: 'FAILED',
              slot: '0x00 (Physical Shield Trip)',
              clientIp: 'Physical Enclave Boundary Breach',
              signatureHex: '0000000000000000000000000000000000000000000000000000000000000000',
              details: 'Active Physical Tamper Detection Response: Crowbar discharge executed. All SRAM keys destroyed in 3.4ms.'
            };
            setOpLogs(prev => [tamperOpLog, ...prev]);

            showToast(
              'EMERGENCY ZEROIZATION COMPLETED',
              'Physical tamper response successfully wiped all cryptographic secrets in 3.4ms.',
              'error'
            );
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleRestoreHsm = () => {
    setDevices(prev => prev.map(d => {
      if (d.id === selectedDevice.id) {
        const orig = INITIAL_HSM_DEVICES.find(origDev => origDev.id === d.id);
        return orig ? { ...orig } : d;
      }
      return d;
    }));
    setKeys(INITIAL_HSM_KEYS);
    setZeroizedMemorySlots(prev => prev.map(s => ({ ...s, isWiped: false })));
    setHsmConnections(prev => ({
      ...prev,
      'nitrokey-nethsm': { ...prev['nitrokey-nethsm'], status: 'CONNECTED' },
      'opentitan-sot': { ...prev['opentitan-sot'], status: 'CONNECTED' }
    }));
    setIsTamperModalOpen(false);
    setTamperPhase('IDLE');
    showToast('HSM Restored', 'Keys restored via M-of-N Quorum Smartcard ceremony.', 'success');
  };

  const handleToggleConnection = (hsmKey: string) => {
    setHsmConnections(prev => {
      const current = prev[hsmKey];
      if (!current) return prev;
      const nextStatus = current.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
      showToast(
        nextStatus === 'CONNECTED' ? 'Hardware Enclave Connected' : 'Hardware Enclave Disconnected',
        `${hsmKey} status updated to ${nextStatus}`,
        nextStatus === 'CONNECTED' ? 'success' : 'info'
      );
      return {
        ...prev,
        [hsmKey]: {
          ...current,
          status: nextStatus
        }
      };
    });
  };

  const handleAuditTrng = (hsmKey: string) => {
    showToast(
      'NIST SP 800-90B TRNG Audit',
      `Continuous noise source health validated for ${hsmKey} (0 entropy loss detected).`,
      'success'
    );
  };

  // Multi-step Zeroize Dialog Handlers
  const handleOpenZeroizeDialog = () => {
    setZeroizeStep(1);
    setZeroizeAuthToken('');
    setZeroizeChallengeWord('');
    setSimulatedOfficerToken(Math.floor(100000 + Math.random() * 900000).toString());
    setIsZeroizeDialogOpen(true);
  };

  const handleExecuteMultiStepZeroize = () => {
    setIsAuthorizingZeroize(true);
    setTimeout(() => {
      setIsAuthorizingZeroize(false);
      setIsZeroizeDialogOpen(false);
      handleSimulateTamperEvent();
    }, 450);
  };

  // Printable Audit Certificate Handlers
  const handleOpenAuditCertModal = () => {
    setCertGeneratedTime(new Date().toISOString());
    setIsAuditCertModalOpen(true);
  };

  const handlePrintAuditCert = () => {
    window.print();
    showToast('Document Sent to Print', 'Physical HSM Audit Certificate formatted for letter/A4 print.', 'success');
  };

  // Entropy Distribution Live Burst Generation
  const handleGenerateEntropyBurst = (customCount?: number) => {
    const count = customCount || quantumBurstCount;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 256);
      const y = Math.floor(Math.random() * 256);
      pts.push({
        id: i,
        x,
        y,
        z: Math.floor(Math.random() * 60) + 40,
        byteHex: `0x${x.toString(16).padStart(2, '0').toUpperCase()}${y.toString(16).padStart(2, '0').toUpperCase()}`,
        density: Math.floor(Math.random() * 100)
      });
    }
    setScatterPoints(pts);

    // Refresh Histogram
    const baseFreq = Math.round(count / 16);
    const bins = [
      '0x00-0x0F', '0x10-0x1F', '0x20-0x2F', '0x30-0x3F',
      '0x40-0x4F', '0x50-0x5F', '0x60-0x6F', '0x70-0x7F',
      '0x80-0x8F', '0x90-0x9F', '0xA0-0xAF', '0xB0-0xBF',
      '0xC0-0xCF', '0xD0-0xDF', '0xE0-0xEF', '0xF0-0xFF'
    ];
    setByteHistogram(bins.map(bin => ({
      bin,
      frequency: Math.max(1, baseFreq + Math.floor((Math.random() - 0.5) * 6)),
      expected: baseFreq
    })));

    // Refresh rolling bitstream
    const bitGroups = [];
    for (let g = 0; g < 12; g++) {
      let byteStr = '';
      for (let b = 0; b < 8; b++) {
        byteStr += Math.random() > 0.5 ? '1' : '0';
      }
      bitGroups.push(byteStr);
    }
    setRawBitstream(bitGroups.join(' '));

    // Perturb health metrics slightly around ideal 8.0
    setRngHealthMetrics(prev => ({
      ...prev,
      shannonEntropy: parseFloat((7.995 + Math.random() * 0.004).toFixed(4)),
      minEntropy: parseFloat((7.991 + Math.random() * 0.005).toFixed(4)),
      chiSquarePValue: parseFloat((0.48 + Math.random() * 0.08).toFixed(3)),
      samplesTested: prev.samplesTested + count
    }));
  };

  const handleToggleEntropySource = (src: 'ZENER' | 'QUANTUM_VACUUM' | 'RING_OSCILLATOR') => {
    setEntropySource(src);
    handleGenerateEntropyBurst(320);
    showToast(
      'Entropy Physical Source Switched',
      `Active TRNG physical stream routed to ${
        src === 'ZENER' ? 'Dual Zener Diode Avalanche Breakdown' :
        src === 'QUANTUM_VACUUM' ? 'Quantum Vacuum Optical Phase Fluctuation' :
        'Ring Oscillator Phase Jitter Enclave'
      }`,
      'info'
    );
  };

  // Heavy Cryptographic Processing load calculation for Enclave Pulse
  const isHeavyCryptoProcessing = isHighLoadSimulated || isSigning || isStressTestModalOpen || liveOpsPerSec > 6000;

  // Session Inactivity Timer & Activity Listener
  useEffect(() => {
    if (inactivityTimeoutMinutes <= 0) return; // Disabled

    const interval = setInterval(() => {
      setSecondsRemainingBeforeLock(prev => {
        if (prev <= 1) {
          setIsEnclaveLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const resetInactivity = () => {
      if (!isEnclaveLocked) {
        setSecondsRemainingBeforeLock(inactivityTimeoutMinutes * 60);
      }
    };

    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    window.addEventListener('click', resetInactivity);
    window.addEventListener('scroll', resetInactivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      window.removeEventListener('click', resetInactivity);
      window.removeEventListener('scroll', resetInactivity);
    };
  }, [inactivityTimeoutMinutes, isEnclaveLocked]);

  // Battery monitoring & automatic Emergency Power-Off trigger
  const handleTriggerEmergencyPowerCut = (targetBattery: number = 0) => {
    setIsExecutingPowerShred(true);
    setSimulatedBatteryLevel(targetBattery);

    const newLogs = [
      `[0.00ms] CRITICAL EVENT: ${targetBattery <= 5 ? `Low Battery Threshold Exceeded (${targetBattery}%)` : 'Host Power Cutoff / Emergency Shutdown'}`,
      '[0.18ms] VOLTAGE DISCHARGE: Ephemeral SRAM crowbar circuit grounded at 12ns.',
      '[0.52ms] MEMORY SHRED: Zeroizing volatile session keys across 4 SRAM buffers...',
      '[0.95ms] FIPS 140-3 VERIFICATION: All 4 ephemeral session secrets purged with 0x00 pattern.',
      '[1.18ms] HARDWARE PERSISTENCE: Non-volatile Root Keys (ML-DSA-87) safe in secure tamper flash.'
    ];

    setTimeout(() => {
      setEphemeralVolatileSlots(prev => prev.map(s => ({
        ...s,
        dataHex: '0x000000000000000000000000 [PURGED]',
        isShredded: true
      })));
      setIsVolatileShredded(true);
      setIsExecutingPowerShred(false);
      setEmergencyShredLogs(newLogs);
      showToast(
        'Emergency Power-Off Shred Complete',
        'Ephemeral volatile session keys shredded in 1.18ms upon power-off detection.',
        'error'
      );
    }, 600);
  };

  const handleRestoreEphemeralVolatileKeys = () => {
    setEphemeralVolatileSlots([
      { address: '0x00FF80', name: 'ML-KEM-1024 Ephemeral Shared Secret (SS)', lifetime: 'Volatile SRAM', dataHex: 'c3f19a08e2b744d901a884ef', isShredded: false },
      { address: '0x00FFA0', name: 'AES-256-GCM Ephemeral Ratchet Key (EK)', lifetime: 'Volatile SRAM', dataHex: '7d8e209ab410fc93041938bc', isShredded: false },
      { address: '0x00FFC0', name: 'Kyber NTT Decapsulation Scratchpad', lifetime: 'Volatile SRAM', dataHex: '55aa112233448899bbccddee', isShredded: false },
      { address: '0x00FFE0', name: 'FIDO2 Biometric Session Assertion Token', lifetime: 'Volatile SRAM', dataHex: '9900aabbccddeeff11223344', isShredded: false },
    ]);
    setSimulatedBatteryLevel(86);
    setIsVolatileShredded(false);
    showToast('Ephemeral Session Keys Re-Initialized', 'Fresh post-quantum ratchet session initialized.', 'success');
  };

  // Continuous Sampling Timer
  useEffect(() => {
    if (!isLiveEntropySampling || activeTab !== 'entropy-distribution') return;
    const interval = setInterval(() => {
      handleGenerateEntropyBurst(320);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLiveEntropySampling, activeTab]);

  return (
    <section id="hardware-security-module" className="py-16 md:py-24 bg-[#070B14] text-slate-100 border-b border-slate-900 relative overflow-hidden">
      {/* Background glow & subtle lattice grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>FIPS 140-3 LEVEL 3 & 4 HARDWARE SECURITY MODULES (HSM)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-sans">
              Open-Source HSM & Key Vault Dashboard
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Connect, configure, and inspect <strong className="text-cyan-300">Nitrokey NetHSM</strong>, <strong className="text-cyan-300">OpenTitan</strong>, and <strong className="text-cyan-300">SoftHSMv2 PKCS#11 slots</strong> directly integrated with our Enterprise Post-Quantum Public Key Infrastructure (PKI).
            </p>
          </div>

          {/* Top Enclave Telemetry & Pulse Bar */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* RHYTHMIC ENCLAVE PULSE ANIMATION HEADER BADGE */}
            <div 
              onClick={() => setIsHighLoadSimulated(prev => !prev)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer select-none relative overflow-hidden group ${
                isHeavyCryptoProcessing
                  ? 'bg-amber-950/80 border-amber-500/80 shadow-lg shadow-amber-950/80 ring-1 ring-amber-500/50'
                  : 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/50 hover:border-cyan-400'
              }`}
              title="Click to toggle simulated Heavy Crypto Load & observe Enclave Pulse color/tempo shift"
            >
              {/* Outer rhythmic aura */}
              <div className="relative flex items-center justify-center">
                <span className={`flex h-4 w-4 relative`}>
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isHeavyCryptoProcessing 
                      ? 'bg-amber-400 animate-ping duration-700' 
                      : 'bg-cyan-400 animate-ping duration-1500'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-4 w-4 ${
                    isHeavyCryptoProcessing ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' : 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]'
                  }`} />
                </span>
              </div>

              <div>
                <div className="text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-1.5">
                  <span className={isHeavyCryptoProcessing ? 'text-amber-300 font-black' : 'text-cyan-300 font-bold'}>
                    ENCLAVE PULSE
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isHeavyCryptoProcessing ? 'bg-amber-900 text-amber-200 border border-amber-700' : 'bg-cyan-950 text-cyan-300'
                  }`}>
                    {isHeavyCryptoProcessing ? 'HEAVY LOAD (0.6s)' : 'NOMINAL (1.6s)'}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-1">
                  <span>{isHeavyCryptoProcessing ? 'Crypto Pipeline: Peak NTT Stress' : 'Silicon Heartbeat: 100% Active'}</span>
                </div>
              </div>
            </div>

            {/* ENCLAVE STATUS */}
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 px-3.5 rounded-2xl backdrop-blur-md">
              <div className="relative">
                <span className={`flex h-3.5 w-3.5 relative ${
                  selectedDevice.status === 'ONLINE' ? 'text-emerald-400' :
                  selectedDevice.status === 'ZEROIZED' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    selectedDevice.status === 'ONLINE' ? 'bg-emerald-400' :
                    selectedDevice.status === 'ZEROIZED' ? 'bg-red-400' : 'bg-amber-400'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                    selectedDevice.status === 'ONLINE' ? 'bg-emerald-500' :
                    selectedDevice.status === 'ZEROIZED' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                </span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold">
                  Enclave Status
                </div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <span>{selectedDevice.status}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-cyan-400">{selectedDevice.fipsLevel}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECONDARY ACTION & SECURITY CONFIGURATION STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md items-center font-mono text-xs">
          
          {/* Emergency Power-Off Toggle & Trigger Widget */}
          <div className="xl:col-span-5 p-2 px-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => {
                  setIsEmergencyPowerOffArmed(prev => !prev);
                  showToast(
                    !isEmergencyPowerOffArmed ? 'Emergency Power-Off Armed' : 'Emergency Power-Off Disarmed',
                    !isEmergencyPowerOffArmed ? 'Auto volatile SRAM shred activated on <5% battery or forced shutdown.' : 'Auto power-off protection disabled.',
                    !isEmergencyPowerOffArmed ? 'success' : 'warning'
                  );
                }}
                className={`w-8 h-5 rounded-full transition-colors relative cursor-pointer ${
                  isEmergencyPowerOffArmed ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
                title="Toggle Emergency Power-Off volatile key shredder"
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                  isEmergencyPowerOffArmed ? 'left-4' : 'left-0.5'
                }`} />
              </button>

              <div>
                <div className="text-[11px] font-bold text-white flex items-center space-x-1.5">
                  <Power className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Emergency Power-Off Protection</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <span>Shred on &lt;5% Battery:</span>
                  <span className={isEmergencyPowerOffArmed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isEmergencyPowerOffArmed ? 'ARMED' : 'DISARMED'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPowerShredModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Battery className="w-3 h-3 text-cyan-400" />
              <span>Test Shred ({simulatedBatteryLevel}%)</span>
            </button>
          </div>

          {/* Session Inactivity Timeout Selector & Lock Button */}
          <div className="xl:col-span-4 p-2 px-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Inactivity Lock</div>
                <div className="text-[11px] text-purple-300 font-bold">
                  {secondsRemainingBeforeLock > 0 ? (
                    `${Math.floor(secondsRemainingBeforeLock / 60)}m ${secondsRemainingBeforeLock % 60}s remaining`
                  ) : (
                    'Enclave Locked'
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={inactivityTimeoutMinutes}
                onChange={(e) => {
                  const mins = parseInt(e.target.value, 10);
                  setInactivityTimeoutMinutes(mins);
                  setSecondsRemainingBeforeLock(mins * 60);
                  showToast('Inactivity Timeout Updated', `Enclave will lock after ${mins} minutes of user inactivity.`, 'info');
                }}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-[11px] font-mono cursor-pointer"
              >
                <option value={1}>1 Minute</option>
                <option value={5}>5 Minutes (Default)</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={0}>Disabled (Manual)</option>
              </select>

              <button
                onClick={() => setIsEnclaveLocked(true)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-bold cursor-pointer"
                title="Lock hardware enclave immediately"
              >
                Lock Now
              </button>
            </div>
          </div>

          {/* Quick Action Toolbar Buttons */}
          <div className="xl:col-span-4 flex flex-wrap items-center justify-end gap-2">
            <button
              id="download-security-baseline-btn"
              onClick={handleDownloadActiveSecurityBaselinePdf}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-950/60"
              title="Download human-readable NIST FIPS 140-3 Security Baseline PDF report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Baseline (PDF)</span>
            </button>

            <button
              id="security-stress-test-btn"
              onClick={() => setIsStressTestModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-md shadow-amber-950"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950" />
              <span>Stress Test</span>
            </button>

            <button
              onClick={handleOpenAuditCertModal}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audit Cert</span>
            </button>
          </div>

        </div>

        {/* PHYSICAL TAMPER EVENT & ZEROIZE KEYS ANIMATION OVERLAY MODAL */}
        {isTamperModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
            <div className="bg-slate-900 border-2 border-red-500/80 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl shadow-red-950/90 space-y-6 relative overflow-hidden animate-shake">
              
              {/* Flashing Warning Banner */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-400 to-amber-500 animate-pulse" />

              <div className="flex items-start justify-between border-b border-red-900/40 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-red-400 text-xs font-mono font-bold tracking-wider animate-pulse">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <span>FIPS 140-3 §4.10 PHYSICAL TAMPER RESPONSE (EMERGENCY ZEROIZATION)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                    Hardware Enclave Tamper Breach Detected
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Device: <strong className="text-red-400">{selectedDevice.name}</strong> • Physical Mesh: <span className="text-red-400 font-bold">BREACHED</span>
                  </p>
                </div>

                <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950 text-red-400 border border-red-800 animate-pulse">
                  PHASE: {tamperPhase}
                </div>
              </div>

              {/* Zeroization Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-red-300 font-bold">Anti-Forensic Key Destruction Progress</span>
                  <span className="text-red-400 font-bold">{tamperProgress}% Completed</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-red-900/60">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-300 rounded-full shadow-lg shadow-red-500/50"
                    style={{ width: `${tamperProgress}%` }}
                  />
                </div>
              </div>

              {/* Zeroize Keys Memory Visualizer Animation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-slate-300 uppercase tracking-wider">Battery-Backed Key Enclave SRAM (4µs Crowbar Discharge)</span>
                  <span className="text-red-400 font-bold">
                    {tamperPhase === 'LOCKED_ZEROIZED' ? 'ALL 5 SECRETS PURGED' : 'PURGE IN PROGRESS...'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 bg-slate-950 p-4 rounded-2xl border border-red-900/40 font-mono text-xs max-h-48 overflow-y-auto">
                  {zeroizedMemorySlots.map((slot) => (
                    <div
                      key={slot.address}
                      className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                        slot.isWiped
                          ? 'bg-red-950/40 border-red-500/60 text-red-300 shadow-sm shadow-red-950'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[10px] text-slate-500">{slot.address}</span>
                        <div>
                          <div className="font-bold text-xs text-white flex items-center space-x-1.5">
                            <span>{slot.label}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">
                              {slot.algorithm}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {slot.isWiped ? (
                          <div className="flex items-center space-x-1.5 text-[11px] text-red-400 font-bold animate-pulse">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>0x0000000000000000 [ZEROIZED]</span>
                          </div>
                        ) : (
                          <code className="text-[11px] text-cyan-300 font-mono tracking-wider">
                            0x{slot.hexDump.slice(0, 16)}...
                          </code>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Hardware Telemetry Audit Stream */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  Enclave Controller Incident Telemetry:
                </div>
                <div className="p-3 bg-black rounded-xl border border-slate-800 font-mono text-[11px] text-red-300/90 space-y-1 max-h-28 overflow-y-auto">
                  {tamperLogs.map((logLine, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <span className="text-red-500 font-bold">❯</span>
                      <span>{logLine}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Actions */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                <div>
                  {tamperPhase === 'LOCKED_ZEROIZED' ? (
                    <span className="text-red-400 font-bold flex items-center space-x-1.5">
                      <Lock className="w-4 h-4 text-red-400" />
                      <span>HSM STATE: LOCKED &amp; ZEROIZED (FIPS 140-3 COMPLIANT)</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center space-x-1.5 animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing anti-tamper zeroize sequence...</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRestoreHsm}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-950/60 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>M-of-N Quorum Restore</span>
                  </button>

                  <button
                    onClick={() => setIsTamperModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                  >
                    Close Overlay
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FIPS 140-3 Self-Test Progress Overlay Modal */}
        {isSelfTestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl shadow-cyan-950/80 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>FIPS 140-3 POWER-ON SELF-TEST (POST) DIAGNOSTIC</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-sans">
                    Hardware Enclave Cryptographic Self-Test
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Target: <strong className="text-cyan-300">{selectedDevice.name}</strong> ({selectedDevice.fipsCertificateNumber})
                  </p>
                </div>
                
                <button
                  onClick={() => setIsSelfTestModalOpen(false)}
                  disabled={isSelfTestRunning}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Diagnostic Execution Progress</span>
                  <span className="text-cyan-400 font-bold">{selfTestProgress}% Complete</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${selfTestProgress}%` }}
                  />
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selfTestSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-2xl border transition-all text-xs font-mono ${
                      step.status === 'PASSED'
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : step.status === 'RUNNING'
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        {step.status === 'PASSED' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : step.status === 'RUNNING' ? (
                          <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-white block font-sans text-xs sm:text-sm">
                            {step.title}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                            {step.standard}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        step.status === 'PASSED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        step.status === 'RUNNING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        'bg-slate-900 text-slate-500'
                      }`}>
                        {step.status}
                      </span>
                    </div>

                    {step.status === 'PASSED' && (
                      <p className="text-[11px] text-slate-300 mt-2 pl-6 pt-1 border-t border-slate-800/60">
                        {step.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Completion Banner & Close */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs font-mono">
                  {selfTestComplete ? (
                    <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                      <Check className="w-4 h-4" />
                      <span>FIPS 140-3 Validation Passed (6/6 Tests Green)</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>Executing Known Answer Tests (KAT) inside enclave...</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIsSelfTestModalOpen(false)}
                  disabled={isSelfTestRunning}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all disabled:opacity-40"
                >
                  {selfTestComplete ? 'Done' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Device Switcher Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {devices.map((device) => {
            const isSelected = device.id === selectedDeviceId;
            return (
              <button
                key={device.id}
                onClick={() => setSelectedDeviceId(device.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    device.type === 'NETWORK_HSM' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    device.type === 'SILICON_ROOT_OF_TRUST' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                    device.type === 'PCIE_HARDWARE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    device.type === 'USB_HARDWARE_TOKEN' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {device.type.replace(/_/g, ' ')}
                  </span>
                  
                  <span className={`w-2 h-2 rounded-full ${
                    device.status === 'ONLINE' ? 'bg-emerald-400' :
                    device.status === 'ZEROIZED' ? 'bg-red-400' : 'bg-amber-400'
                  }`} />
                </div>

                <div className="font-bold text-sm text-white truncate font-sans group-hover:text-cyan-300 transition-colors">
                  {device.name}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  {device.vendor.split('(')[0]}
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/60 pt-2">
                  <span>{device.storedKeysCount} Keys</span>
                  <span className="text-cyan-400">{device.opsPerSecondPeak.toLocaleString()} ops/s</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Real-Time Telemetry & Recharts Latency Stability Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Telemetry Metrics Card */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h4 className="font-bold text-sm text-white font-sans">
                    Live Enclave Telemetry
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  REAL-TIME HEARTBEAT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Real-time ops/sec */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>Live Throughput</span>
                  </div>
                  <div className="text-xl font-black font-mono text-white">
                    {liveOpsPerSec.toLocaleString()} <span className="text-xs font-normal text-slate-400">ops/s</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    Lattice Math Pipeline
                  </div>
                </div>

                {/* Hardware Latency */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-emerald-400" />
                    <span>Enclave Latency</span>
                  </div>
                  <div className="text-xl font-black font-mono text-cyan-300">
                    {liveLatencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    FIPS 204 ML-DSA Sign
                  </div>
                </div>

                {/* Hardware TRNG Entropy */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Radio className="w-3 h-3 text-purple-400" />
                    <span>TRNG Rate</span>
                  </div>
                  <div className="text-xl font-black font-mono text-white">
                    {selectedDevice.entropyRateMBps} <span className="text-xs font-normal text-slate-400">MB/s</span>
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono">
                    NIST SP 800-90B
                  </div>
                </div>

                {/* Tamper Mesh */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Tamper Mesh</span>
                  </div>
                  <div className={`text-xl font-black font-mono ${
                    selectedDevice.tamperMeshIntact ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {selectedDevice.tamperMeshIntact ? 'INTACT' : 'BREACH'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    0 Alarm Triggers
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Core Temp & Voltage:</span>
              <span className="text-white font-bold">{selectedDevice.temperatureC}°C • {selectedDevice.coreVoltageV}V</span>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <button
                onClick={() => setActiveTab('security-baseline')}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/40 text-left text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Security Baseline (JSON)</span>
              </button>
              <button
                onClick={() => setActiveTab('hardening-assistant')}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/40 text-left text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">Hardening Assistant</span>
              </button>
              <button
                onClick={() => setActiveTab('thermal-monitor')}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/40 text-left text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">Thermal & Panic Scram</span>
              </button>
              <button
                onClick={() => setActiveTab('api-volume')}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/40 text-left text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <BarChart2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Daily API Volume</span>
              </button>
            </div>
          </div>

          {/* Recharts Real-Time Latency / Heartbeat Stability Chart */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-sm text-white font-sans">
                    Real-Time Enclave Latency & Jitter Stability
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Sub-millisecond cryptographic hardware response timeline
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="flex items-center space-x-1 text-cyan-400">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                  <span>Latency (ms)</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-500">
                  <span className="w-2.5 h-0.5 bg-slate-500 border-b border-dashed inline-block" />
                  <span>SLA (1.50ms)</span>
                </span>
              </div>
            </div>

            {/* Recharts LineChart Component */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    domain={[0.8, 2.2]} 
                    tickFormatter={(val) => `${val.toFixed(1)}ms`}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#020617', 
                      borderColor: '#06b6d4', 
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.3)'
                    }} 
                    itemStyle={{ color: '#22d3ee' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                    formatter={(value: any) => [`${value} ms`, 'Response Latency']}
                  />
                  <ReferenceLine y={1.50} stroke="#475569" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#06b6d4" 
                    strokeWidth={2.5} 
                    dot={{ r: 2.5, fill: '#06b6d4' }}
                    activeDot={{ r: 5, stroke: '#22d3ee', strokeWidth: 2, fill: '#020617' }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Statistics Bar */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center font-mono text-xs">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">Average Latency</span>
                <span className="text-white font-bold">{liveLatencyMs} ms</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">Jitter Variance</span>
                <span className="text-emerald-400 font-bold">±0.12 ms</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">SLA Compliance</span>
                <span className="text-cyan-300 font-bold">99.999% Nominal</span>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'adversary-simulator', label: 'Quantum Adversary Simulator (HNDL & News)', icon: Zap },
              { id: 'hsm-selection-guide', label: 'HSM Selection Guide & FIPS 140-3', icon: HardDrive },
              { id: 'self-test-suite', label: 'Security Self-Test Suite & HSM Guide', icon: ShieldCheck },
              { id: 'security-baseline', label: 'Security Baseline (JSON & Drift)', icon: FileCode },
              { id: 'hardening-assistant', label: 'Security Hardening Assistant (FIPS 140-3)', icon: SlidersHorizontal },
              { id: 'api-volume', label: 'Daily API Call Volume (Recharts)', icon: BarChart2 },
              { id: 'thermal-monitor', label: 'Thermal Monitoring & Panic Scram', icon: Flame },
              { id: 'firmware-integrity', label: `Firmware Integrity & Public Registry (${firmwareLogs.length})`, icon: ShieldCheck },
              { id: 'open-source-hsm', label: 'Open-Source HSM & PKI Bridge', icon: Network },
              { id: 'telemetry', label: 'Hardware Architecture & Enclave', icon: HardDrive },
              { id: 'latency-monitor', label: 'Real-Time Latency Monitor (RTT)', icon: TrendingUp },
              { id: 'keys', label: `Key Storage & Entropy Meter (${deviceKeys.length})`, icon: Gauge },
              { id: 'key-lifecycle', label: 'Key Lifecycle Management', icon: RotateCw },
              { id: 'tamper-history', label: 'Enclave Tamper History', icon: ShieldAlert },
              { id: 'entropy-analysis', label: 'Entropy Analysis (NIST SP 800-22)', icon: Binary },
              { id: 'entropy-distribution', label: 'Entropy Distribution (QRNG)', icon: Binary },
              { id: 'entropy-health', label: 'Entropy Health & Trigger', icon: BellRing },
              { id: 'signer', label: 'Interactive Hardware Signer', icon: Sparkles },
              { id: 'diagnostics', label: 'Internal Enclave Diagnostics', icon: Terminal },
              { id: 'policy-export', label: 'Security Policies (JSON)', icon: FileCode },
              { id: 'audit-logs', label: `Operation History Log (${opLogs.length})`, icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Zeroization / Restore Sandbox Trigger */}
          <div className="flex items-center space-x-2">
            {selectedDevice.status === 'ZEROIZED' ? (
              <button
                onClick={handleRestoreHsm}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restore Keys (M-of-N Quorum)</span>
              </button>
            ) : (
              <button
                onClick={handleOpenZeroizeDialog}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900/80 font-mono text-xs transition-all cursor-pointer"
                title="Initiates multi-step dual-control zeroization sequence"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Zeroize Security Keys</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 7: Entropy Distribution (QRNG / TRNG 2D Scatter & NIST SP 800-90B) */}
        {activeTab === 'entropy-distribution' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header & Source Selector */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold mb-2">
                    <Binary className="w-3.5 h-3.5 animate-pulse" />
                    <span>NIST SP 800-90B & FIPS 140-3 TRUE RANDOM NUMBER GENERATION</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                    Quantum & Physical TRNG Noise Entropy Distribution
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                    Visualizing 2D phase space return map <span className="text-cyan-300">(Byte_n, Byte_n+1)</span> confirming cryptographic uniformity with zero orbital bias.
                  </p>
                </div>

                {/* Sampling Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleGenerateEntropyBurst(256)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Burst 256 Pts</span>
                  </button>

                  <button
                    onClick={() => handleGenerateEntropyBurst(512)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-black flex items-center space-x-1.5 cursor-pointer transition-all shadow-md shadow-cyan-950"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Burst 512 Pts</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsLiveEntropySampling(!isLiveEntropySampling);
                      showToast(
                        isLiveEntropySampling ? 'Live Sampling Paused' : 'Live Sampling Resumed',
                        isLiveEntropySampling ? 'Continuous stream paused.' : 'Sampling 320 quantum points every 3s.',
                        'info'
                      );
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer transition-all border ${
                      isLiveEntropySampling
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Activity className={`w-3.5 h-3.5 ${isLiveEntropySampling ? 'animate-pulse text-emerald-400' : ''}`} />
                    <span>{isLiveEntropySampling ? 'Live Streaming' : 'Stream Paused'}</span>
                  </button>
                </div>
              </div>

              {/* Physical Entropy Source Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'ZENER',
                    name: 'Dual Zener Diode Avalanche',
                    type: 'Hardware Physical TRNG',
                    mechanism: 'Reverse-bias thermal avalanche breakdown noise amplification',
                    entropyRate: '7.994 bits/byte',
                    fipsLevel: 'Level 4 Hardened',
                    jitter: '< 0.02 ns'
                  },
                  {
                    id: 'QUANTUM_VACUUM',
                    name: 'Quantum Vacuum Fluctuations',
                    type: 'Optoelectronic QRNG',
                    mechanism: 'Homodyne balanced detection of zero-point photon field state',
                    entropyRate: '7.998 bits/byte',
                    fipsLevel: 'Level 4 Quantum',
                    jitter: '< 0.005 ns'
                  },
                  {
                    id: 'RING_OSCILLATOR',
                    name: 'Ring Oscillator Phase Jitter',
                    type: 'Silicon Micro-Jitter Enclave',
                    mechanism: 'Metastable phase drift across 16-stage asynchronous ring inverters',
                    entropyRate: '7.991 bits/byte',
                    fipsLevel: 'Level 3 Enclave',
                    jitter: '< 0.08 ns'
                  }
                ].map((src) => {
                  const isSelected = entropySource === src.id;
                  return (
                    <div
                      key={src.id}
                      onClick={() => handleToggleEntropySource(src.id as any)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500/70 shadow-lg shadow-cyan-950/80 ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block">{src.type}</span>
                          <h4 className="font-bold text-sm text-white font-sans mt-0.5">{src.name}</h4>
                        </div>
                        <span className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-cyan-400' : 'bg-slate-800 border border-slate-700'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                        {src.mechanism}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-800/80 text-slate-300">
                        <span>Entropy: <strong className="text-emerald-400">{src.entropyRate}</strong></span>
                        <span className="text-cyan-300 font-bold">{src.fipsLevel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive 2D Scatter Return Map & NIST SP 800-90B Health Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* 2D Phase Space Scatter Return Map (X=Byte_n, Y=Byte_n+1) */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Crosshair className="w-4 h-4 text-cyan-400" />
                      <h4 className="font-bold text-sm text-white font-sans">
                        2D Return Map Phase Space (X_i = Byte_n, Y_i = Byte_n+1)
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Uniform scatter over $[0, 255] \times [0, 255]$ coordinate grid demonstrates zero serial correlation.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                      Sample Size: <strong>{scatterPoints.length} Points</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                      Uniformity: <strong>Ideal</strong>
                    </span>
                  </div>
                </div>

                {/* Recharts ScatterChart Component */}
                <div className="h-80 sm:h-96 w-full bg-slate-950 rounded-2xl p-2 border border-slate-800/80 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 15, right: 15, bottom: 15, left: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.7} />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Byte N" 
                        domain={[0, 255]} 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        tickCount={9}
                        unit=""
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Byte N+1" 
                        domain={[0, 255]} 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false}
                        tickCount={9}
                        unit=""
                      />
                      <ZAxis type="number" dataKey="z" range={[20, 70]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3', stroke: '#06b6d4' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 border border-cyan-500/80 p-2.5 rounded-xl shadow-xl font-mono text-xs text-slate-200 space-y-1">
                                <div className="text-cyan-400 font-bold flex items-center space-x-1">
                                  <CircleDot className="w-3 h-3" />
                                  <span>Point #{data.id}</span>
                                </div>
                                <div>Coordinates: <span className="text-white font-bold">({data.x}, {data.y})</span></div>
                                <div>Hex: <span className="text-emerald-400 font-bold">{data.byteHex}</span></div>
                                <div>Entropy: <span className="text-cyan-300">7.996 bits/byte</span></div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter name="Quantum Noise Samples" data={scatterPoints} fill="#06b6d4" opacity={0.85} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>$(0, 0)$ Ground Minimum</span>
                  <span className="text-cyan-400 font-bold">Zero Clusters / Zero Attractor Trajectories</span>
                  <span>$(255, 255)$ Saturation Maximum</span>
                </div>
              </div>

              {/* NIST SP 800-90B & Health Metrics Summary Card */}
              <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Gauge className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-sm text-white font-sans">
                        NIST SP 800-90B Health Tests
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Continuous on-the-fly hardware statistical checks
                    </p>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    
                    {/* Shannon Entropy Metric */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Shannon Entropy</span>
                        <span className="text-emerald-400 font-bold text-sm">{rngHealthMetrics.shannonEntropy} bits/byte</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Max: 8.0000</span>
                    </div>

                    {/* Min-Entropy Metric */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Min-Entropy ($H_\infty$)</span>
                        <span className="text-cyan-300 font-bold text-sm">{rngHealthMetrics.minEntropy} bits/byte</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">FIPS PASS</span>
                    </div>

                    {/* Chi-Square Uniformity Test */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Chi-Square Uniformity</span>
                        <span className="text-white font-bold text-sm">p = {rngHealthMetrics.chiSquarePValue}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Target: 0.1 - 0.9</span>
                    </div>

                    {/* RCT & APT On-the-fly tests */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 text-[10px] uppercase block">RCT Test</span>
                        <span className="text-emerald-400 font-bold text-xs">PASS (0 run)</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 text-[10px] uppercase block">APT Test</span>
                        <span className="text-emerald-400 font-bold text-xs">PASS (W=512)</span>
                      </div>
                    </div>

                    {/* Serial Correlation */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Serial Correlation ($\rho$)</span>
                        <span className="text-cyan-300 font-bold text-xs">-0.0004 (Uncorrelated)</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>

                  </div>
                </div>

                {/* Total Sample Tally */}
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Total Noise Evaluated:</span>
                  <span className="text-cyan-300 font-bold">{rngHealthMetrics.samplesTested.toLocaleString()} bytes</span>
                </div>

              </div>

            </div>

            {/* Byte Frequency Histogram (16-Bin Distribution) & Rolling Bitstream */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* 16-Bin Byte Distribution Histogram */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-white font-sans">
                      16-Bin Byte Frequency Distribution Histogram
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Monitors frequency uniformity across all 256 octet partitions.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">Expected: 20 pts/bin</span>
                </div>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byteHistogram} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />
                      <XAxis 
                        dataKey="bin" 
                        stroke="#64748b" 
                        fontSize={9} 
                        angle={-45} 
                        textAnchor="end" 
                        tickLine={false} 
                      />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 30]} />
                      <ReferenceLine y={20} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: 'Target 20', fill: '#06b6d4', fontSize: 9 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                      />
                      <Bar dataKey="frequency" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Real-time Quantum Binary Bitstream & Hex Inspector */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-white font-sans">
                      Live Quantum Bitstream & Hex Octets
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Raw unconditioned entropy feed before SP 800-90A DRBG expansion
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rawBitstream);
                      showToast('Copied', 'Binary bitstream copied to clipboard.', 'success');
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors cursor-pointer"
                    title="Copy Raw Bitstream"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Raw Binary Output:</span>
                  <div className="text-cyan-300 text-[11px] leading-relaxed break-all font-mono select-all p-2 bg-slate-900 rounded-lg border border-slate-800">
                    {rawBitstream}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Raw Hex Digest (32 Octets):</span>
                  <div className="text-emerald-400 text-[11px] font-mono break-all select-all p-2 bg-slate-900 rounded-lg border border-slate-800">
                    b9 4f e2 1a 88 dc 03 77 91 ff 42 c8 3a e0 19 b5 7d 64 2c 0f ea 93 b1 80 55 cf 2e 49 10 3b a7 6e
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Bit Bias $\epsilon = 0.00012$</span>
                  <span className="text-emerald-400 font-bold">Unbiased 50.00% Zero / 50.00% One</span>
                </div>
              </div>

            </div>

          </div>
        )}
        {activeTab === 'open-source-hsm' && (
          <div className="space-y-8">
            
            {/* 3 Primary Open-Source HSM Integration Profiles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile 1: Nitrokey NetHSM */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                      GPLv3 HARDWARE
                    </span>
                    <span className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{hsmConnections['nitrokey-nethsm'].status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white font-sans">
                      Nitrokey NetHSM
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Open-Source Network Hardware Security Module
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Physical rackmount hardware with verifiable open schematics and firmware. Hosts Enterprise Root PQC CA keys.
                  </p>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Assigned PKI CA:</span>
                      <span className="text-cyan-300 font-bold">Root Master PQC CA</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>PKCS#11 Slot:</span>
                      <span className="text-slate-200">Slot 0x01 (ML-DSA-87)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Protocol:</span>
                      <span className="text-slate-300">REST API / TLS 1.3 mTLS</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>TRNG Rate:</span>
                      <span className="text-emerald-400">64.0 MB/s (Optimal)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAuditTrng('Nitrokey NetHSM')}
                      className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Audit TRNG</span>
                    </button>
                    <button
                      onClick={() => handleToggleConnection('nitrokey-nethsm')}
                      className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync Slots</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile 2: OpenTitan Silicon Root of Trust */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700">
                      OPEN SILICON ROT
                    </span>
                    <span className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{hsmConnections['opentitan-sot'].status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white font-sans">
                      OpenTitan (lowRISC)
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Commercial Silicon Root-of-Trust Hardware
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Open-source silicon chip with physical active mesh coating, laser glitch protection, and measured boot signing.
                  </p>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Assigned PKI CA:</span>
                      <span className="text-purple-300 font-bold">Device Attestation CA</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>PKCS#11 Slot:</span>
                      <span className="text-slate-200">Slot 0x03 (Hardware Seed)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Interface:</span>
                      <span className="text-slate-300">Direct SPI / I3C Secure Bus</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Tamper Mesh:</span>
                      <span className="text-emerald-400">Active (Zero Delay)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAuditTrng('OpenTitan Silicon')}
                      className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Verify Boot</span>
                    </button>
                    <button
                      onClick={() => handleToggleConnection('opentitan-sot')}
                      className="py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Probe Enclave</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile 3: SoftHSMv2 + Open Quantum Safe */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      OASIS PKCS#11 v3.0
                    </span>
                    <span className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{hsmConnections['softhsm2-oqs'].status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white font-sans">
                      SoftHSMv2 + liboqs
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Open-Source PKCS#11 Software Testing Engine
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Provider for CI/CD test automation, developer staging environments, and rapid cryptographic benchmark suites.
                  </p>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Assigned PKI CA:</span>
                      <span className="text-amber-300 font-bold">Staging / Testbed CA</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>PKCS#11 Slot:</span>
                      <span className="text-slate-200">Slot 0x02 (OQS Provider)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Library Path:</span>
                      <span className="text-slate-300 truncate max-w-[140px]">libsofthsm2.so</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>OQS Algorithms:</span>
                      <span className="text-cyan-400 font-bold">Kyber / Dilithium / SPHINCS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAuditTrng('SoftHSMv2')}
                      className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rotate Slot</span>
                    </button>
                    <button
                      onClick={() => handleToggleConnection('softhsm2-oqs')}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-init Token</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Enterprise PKI & PKCS#11 Slot Architecture Mapping */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <Workflow className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">
                      Enterprise PKI Hierarchy & Hardware Slot Mapping
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Non-extractable master keys bound to physical hardware enclaves with M-of-N quorum
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-mono font-bold">
                  CROSS-SIGNING ACTIVE
                </span>
              </div>

              {/* Slot Hierarchy Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                
                {/* Level 1: Root Master CA */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">LEVEL 1: ROOT CA</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px]">NON-EXTRACTABLE</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Q-CRYPT Root Master PQC CA</h5>
                    <span className="text-slate-400 text-[11px]">Algorithm: NIST FIPS 204 (ML-DSA-87)</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Hardware Enclave:</span>
                      <span className="text-white font-bold">Nitrokey NetHSM</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">PKCS#11 Slot:</span>
                      <span className="text-cyan-300">Slot 0x01</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Quorum:</span>
                      <span className="text-amber-400">2-of-3 Smartcards</span>
                    </p>
                  </div>
                </div>

                {/* Level 2: Intermediate Defense Transit CA */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">LEVEL 2: INTERMEDIATE CA</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">ACTIVE SIGNER</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Defense Sector Transit CA</h5>
                    <span className="text-slate-400 text-[11px]">Algorithm: NIST FIPS 203 (ML-KEM-1024)</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Hardware Enclave:</span>
                      <span className="text-white font-bold">Thales Luna PCIe</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">PKCS#11 Slot:</span>
                      <span className="text-cyan-300">Slot 0x00</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Throughput:</span>
                      <span className="text-emerald-400">25,000 ops/s</span>
                    </p>
                  </div>
                </div>

                {/* Level 3: Device Attestation CA */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-400 font-bold uppercase">LEVEL 3: ATTESTATION CA</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px]">SILICON BOUND</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Mobile Enclave Issuance CA</h5>
                    <span className="text-slate-400 text-[11px]">Algorithm: ML-DSA-87 + Titan M2</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Hardware Enclave:</span>
                      <span className="text-white font-bold">OpenTitan RoT</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">PKCS#11 Slot:</span>
                      <span className="text-cyan-300">Slot 0x03</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">FIPS Level:</span>
                      <span className="text-purple-400">Level 4 Target</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* PKCS#11 Token Security Attribute Flags */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-slate-300 font-bold block">
                  Mandatory Hardware Token Security Flags (Zero Extraction Policy):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">CKA_SENSITIVE</span>
                    <span className="text-emerald-400 font-bold">TRUE</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">CKA_EXTRACTABLE</span>
                    <span className="text-red-400 font-bold">FALSE (LOCKED)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">CKA_ALWAYS_AUTHENTICATE</span>
                    <span className="text-emerald-400 font-bold">TRUE</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">CKA_LOCAL</span>
                    <span className="text-emerald-400 font-bold">TRUE (IN-SILICON)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Hardware Architecture & Enclave Overview */}
        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Device Details & Specifications */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                      Module Profile & Certification
                    </span>
                    <h3 className="text-2xl font-black text-white font-sans mt-1">
                      {selectedDevice.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedDevice.vendor} • {selectedDevice.location}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                    {selectedDevice.fipsCertificateNumber}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedDevice.description}
                </p>

                {/* Technical Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-slate-500 uppercase">Hardware Interface</span>
                    <p className="font-bold text-slate-200">{selectedDevice.interfaceProtocol}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-slate-500 uppercase">Firmware Build</span>
                    <p className="font-bold text-cyan-300">{selectedDevice.firmware}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-slate-500 uppercase">Key Storage Capacity</span>
                    <p className="font-bold text-slate-200">
                      {selectedDevice.storedKeysCount.toLocaleString()} / {selectedDevice.totalCapacityKeys.toLocaleString()} slots
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-slate-500 uppercase">Active Master Slot</span>
                    <p className="font-bold text-emerald-400">{selectedDevice.activeSlot}</p>
                  </div>
                </div>

                {/* Supported Algorithms Badges */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono text-slate-400 font-bold block">
                    Supported Hardware Cryptographic Algorithms:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedDevice.supportedAlgorithms.map((algo, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono flex items-center space-x-1.5"
                      >
                        <Lock className="w-3 h-3 text-cyan-400" />
                        <span>{algo}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: FIPS 140-3 Security Boundary Diagram */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-bold text-base text-white">
                      Physical Security Boundary
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    ISOLATED
                  </span>
                </div>

                {/* Enclave Visualization Card */}
                <div className="border-2 border-dashed border-cyan-500/40 rounded-2xl p-4 bg-slate-950/90 relative space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                    <span>FIPS 140-3 HARDWARE ENCLAVE BOUNDARY</span>
                    <span>LEVEL 3/4</span>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/20 space-y-2">
                    <div className="flex items-center justify-between text-slate-200 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        <span>Isolated Master Key Ring</span>
                      </span>
                      <span className="text-[10px] text-emerald-400">NON-EXTRACTABLE</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Private keys generated with True Random Number Generator (TRNG) avalanche noise. Bits never enter host RAM or bus.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/20 space-y-2">
                    <div className="flex items-center justify-between text-slate-200 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Lattice Math Coprocessor</span>
                      </span>
                      <span className="text-[10px] text-cyan-300">NTT ACCELERATED</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Constant-time polynomial multiplication for ML-DSA-87 and ML-KEM-1024 side-channel defense.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-red-500/30 space-y-2">
                    <div className="flex items-center justify-between text-slate-200 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-400" />
                        <span>Active Tamper Sensing Grid</span>
                      </span>
                      <span className="text-[10px] text-amber-400">ZEROIZATION READY</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Continuous voltage, laser, and micro-probe detection triggers 4-microsecond zero-voltage key discharge.
                    </p>
                  </div>
                </div>

                {/* M-of-N Quorum State */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Administrative Custody</span>
                    <span className="text-slate-200 font-bold">M-of-N Dual-Control Quorum</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-slate-700 font-bold">
                    2 of 3 Smartcards Required
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Key Storage Slots & Key Entropy Meter */}
        {activeTab === 'keys' && (
          <div className="space-y-8">
            
            {/* KEY ENTROPY METER & ACTIVE KEY ROTATION STUDIO */}
            <div className="bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/30 relative overflow-hidden backdrop-blur-md">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Studio Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                      <Gauge className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      True Random Number Generator (TRNG) Telemetry
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-sans">
                    Key Entropy Meter & Active Rekeying Studio
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Live Shannon entropy verification and NIST SP 800-90B continuous health telemetry during cryptographic key rotation
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Continuous sampling toggle */}
                  <button
                    onClick={() => setIsContinuousRngSampling(prev => !prev)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center space-x-2 cursor-pointer ${
                      isContinuousRngSampling
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600 shadow-sm shadow-cyan-950'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    <Radio className={`w-3.5 h-3.5 ${isContinuousRngSampling ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
                    <span>{isContinuousRngSampling ? 'TRNG Stream: LIVE SAMPLING' : 'TRNG Stream: PAUSED'}</span>
                  </button>

                  <span className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NIST SP 800-90B / AIS 31 PTG.3</span>
                  </span>
                </div>
              </div>

              {/* 3-Column Entropy & Rotation Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* COLUMN 1: Visual Key Entropy Gauge Chart (SVG Radial Meter) */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between items-center text-center relative overflow-hidden">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Binary className="w-3.5 h-3.5 text-cyan-400" />
                      <span>RNG Entropy Quality</span>
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      entropyValue >= 7.990 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      entropyValue >= 7.950 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {entropyValue >= 7.990 ? 'OPTIMAL' : entropyValue >= 7.950 ? 'ACCEPTABLE' : 'ALERT'}
                    </span>
                  </div>

                  {/* SVG Semi-Circle Gauge Chart */}
                  <div className="relative w-full max-w-[240px] aspect-[240/140] flex items-center justify-center my-2">
                    <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
                      <defs>
                        {/* Gauge Arc Gradient */}
                        <linearGradient id="entropyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="65%" stopColor="#f59e0b" />
                          <stop offset="85%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>

                        {/* Needle Shadow */}
                        <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.4" />
                        </filter>
                      </defs>

                      {/* Background Inactive Arc Track */}
                      <path
                        d="M 35 125 A 85 85 0 0 1 205 125"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="14"
                        strokeLinecap="round"
                      />

                      {/* Colored Active Value Arc Track */}
                      <path
                        d="M 35 125 A 85 85 0 0 1 205 125"
                        fill="none"
                        stroke="url(#entropyGradient)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray="267"
                        strokeDashoffset={267 - (267 * (Math.max(0, Math.min(8.0, entropyValue)) / 8.0))}
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Tick Markers */}
                      <text x="30" y="137" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">0.0</text>
                      <text x="70" y="70" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">4.0</text>
                      <text x="120" y="32" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">6.0</text>
                      <text x="175" y="70" fill="#06b6d4" fontSize="9" fontFamily="monospace" textAnchor="middle">7.8</text>
                      <text x="210" y="137" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">8.0</text>

                      {/* Rotating Gauge Needle */}
                      {(() => {
                        const normalized = Math.max(0, Math.min(8.0, entropyValue));
                        const angleDeg = 180 + (normalized / 8.0) * 180;
                        const angleRad = (angleDeg * Math.PI) / 180;
                        const needleLength = 70;
                        const tipX = 120 + needleLength * Math.cos(angleRad);
                        const tipY = 125 + needleLength * Math.sin(angleRad);
                        
                        return (
                          <g filter="url(#gaugeShadow)">
                            <line
                              x1="120"
                              y1="125"
                              x2={tipX}
                              y2={tipY}
                              stroke="#ffffff"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              className="transition-all duration-300 ease-out"
                            />
                            <circle cx={tipX} cy={tipY} r="3" fill="#22d3ee" />
                          </g>
                        );
                      })()}

                      {/* Center Needle Pivot Hub */}
                      <circle cx="120" cy="125" r="9" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
                      <circle cx="120" cy="125" r="3.5" fill="#38bdf8" />
                    </svg>
                  </div>

                  {/* Digital Entropy Readout */}
                  <div className="space-y-1 mt-1">
                    <div className="text-3xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-1">
                      <span>{entropyValue.toFixed(4)}</span>
                      <span className="text-xs font-normal text-cyan-400 font-mono">bits/byte</span>
                    </div>
                    <p className="text-[11px] font-mono text-emerald-400 font-bold">
                      {((entropyValue / 8.0) * 100).toFixed(3)}% True Randomness
                    </p>
                    <p className="text-[10px] font-mono text-slate-500">
                      NIST Minimum Threshold: 7.9800 bits/byte
                    </p>
                  </div>
                </div>

                {/* COLUMN 2: Active Key Rotation Operation Controller */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRotatingKey ? 'animate-spin' : ''}`} />
                      <span>Active Rotation Target</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {activeKey.slotId}
                    </span>
                  </div>

                  {/* Selected Key Details Card */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white font-sans">{activeKey.label}</h4>
                      <span className="text-[10px] text-purple-400 font-bold">{activeKey.algorithm}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block text-[10px]">CURRENT HANDLE</span>
                        <span className="text-slate-200 font-bold">{activeKey.keyHandle}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">USAGE LIFECYCLE</span>
                        <span className="text-cyan-300 font-bold">{activeKey.usageCount} Operations</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Stage Rotation Progress (When Rotating) */}
                  {isRotatingKey && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2.5 animate-in fade-in duration-200 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          <span>
                            {rotationStep === 'SAMPLING_TRNG' && 'Sampling TRNG Physical Avalanche Noise...'}
                            {rotationStep === 'NIST_HEALTH_TEST' && 'Performing NIST SP 800-90B Health Tests (RCT/APT)...'}
                            {rotationStep === 'SEEDING_DRBG' && 'Reseeding Cryptographic DRBG Vector...'}
                            {rotationStep === 'GENERATING_LATTICE' && 'Synthesizing PQC Lattice Polynomial Keypair...'}
                            {rotationStep === 'COMPLETED' && 'Writing In-Silicon Slot & Zeroizing Old Key...'}
                          </span>
                        </span>
                        <span className="text-cyan-400 font-bold">{rotationProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-800/60">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300 rounded-full"
                          style={{ width: `${rotationProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Trigger Action Button */}
                  <button
                    onClick={() => handleRotateSelectedKey()}
                    disabled={isRotatingKey || selectedDevice.status === 'ZEROIZED'}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isRotatingKey ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Rotating Key & Validating RNG Entropy...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Rotate Selected Key & Sample RNG Entropy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* COLUMN 3: RNG Entropy Stability History (Recharts LineChart) & Health Diagnostics */}
                <div className="lg:col-span-3 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>TRNG Stability Sparkline</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      H_min: {rngHealthMetrics.minEntropy}
                    </span>
                  </div>

                  {/* Recharts Mini LineChart for Entropy History */}
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={entropyHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.5} />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[7.975, 8.000]} stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#020617',
                            borderColor: '#10b981',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontFamily: 'monospace'
                          }}
                          itemStyle={{ color: '#34d399' }}
                          formatter={(val: any) => [`${val} bits/byte`, 'Entropy']}
                        />
                        <ReferenceLine y={7.980} stroke="#f59e0b" strokeDasharray="2 2" />
                        <Line
                          type="monotone"
                          dataKey="entropy"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 1.5, fill: '#10b981' }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* NIST SP 800-90B Health Tests Matrix */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-500 block">RCT Test (Cutoff 32)</span>
                      <span className="text-emerald-400 font-bold">PASS (0 Fails)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-500 block">APT Test (W=512)</span>
                      <span className="text-emerald-400 font-bold">PASS (Alpha 2⁻²⁰)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-500 block">Chi-Square Uniformity</span>
                      <span className="text-cyan-300 font-bold">p = {rngHealthMetrics.chiSquarePValue}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-500 block">Physical Noise Source</span>
                      <span className="text-purple-300 font-bold truncate block">Dual Zener TRNG</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* HARDWARE KEY STORAGE SLOT INSPECTOR GRID */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">
                    Hardware Key Storage Slot Inspector
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Non-extractable key objects stored in {selectedDevice.name}
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchKeyQuery}
                    onChange={(e) => setSearchKeyQuery(e.target.value)}
                    placeholder="Search by label, algorithm..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Keys Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredKeys.map((keyObj) => {
                  const isSelectedKey = keyObj.id === activeKey.id;
                  return (
                    <div
                      key={keyObj.id}
                      onClick={() => setSelectedKeyId(keyObj.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-4 ${
                        isSelectedKey
                          ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {keyObj.slotId}
                          </span>
                          <h4 className="font-bold text-sm text-white font-sans">
                            {keyObj.label}
                          </h4>
                          <span className="text-xs font-mono text-cyan-400 font-bold block">
                            {keyObj.algorithm}
                          </span>
                        </div>

                        <div className="text-right font-mono text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold block">
                            NON-EXTRACTABLE
                          </span>
                          <span className="text-slate-500 mt-1 block">Handle: {keyObj.keyHandle}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs font-mono text-slate-400">
                        <span className="text-slate-500 block text-[10px] uppercase">Assigned Application</span>
                        <p className="text-slate-300 text-xs line-clamp-1">{keyObj.assignedApplication}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono items-center">
                        <div>
                          <span className="text-slate-500 block">Key Size</span>
                          <span className="text-slate-200 font-bold">{keyObj.keySizeBits} bits</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Usage Count</span>
                          <span className="text-cyan-300 font-bold">{keyObj.usageCount.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedKeyId(keyObj.id);
                              handleRotateSelectedKey(keyObj);
                            }}
                            disabled={isRotatingKey}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-600 font-bold text-[10px] transition-all inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Rotate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Interactive Hardware Signer */}
        {activeTab === 'signer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-bold text-base text-white">
                      Live Hardware Signing Sandbox
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-700">
                    {activeKey.algorithm}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-mono">
                  Input JSON telemetry or raw data payload to be hashed and signed inside {selectedDevice.name}.
                </p>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-300 font-bold block">
                    Payload Payload (JSON):
                  </span>
                  <textarea
                    rows={6}
                    value={payloadText}
                    onChange={(e) => setPayloadText(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-400">
                    Key: <strong className="text-slate-200">{activeKey.label}</strong> ({activeKey.slotId})
                  </div>
                  <button
                    disabled={isSigning}
                    onClick={handleExecuteHsmSign}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {isSigning ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Execute Hardware Sign (C_Sign)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Signer Output */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-base text-white">
                      Enclave Attestation Output
                    </h4>
                  </div>
                  {signingResult && (
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                      {signingResult.executionTimeMs} ms Latency
                    </span>
                  )}
                </div>

                {signingResult ? (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px]">Return Code:</span>
                      <p className="text-emerald-400 font-bold">{signingResult.returnCode}</p>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[10px]">Lattice Signature Output:</span>
                        <button
                          onClick={() => handleCopy(signingResult.signatureHex, 'Signature')}
                          className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Hex</span>
                        </button>
                      </div>
                      <p className="text-cyan-300 text-[11px] break-all">
                        {signingResult.signatureHex}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px]">Hardware FIPS Attestation Hash:</span>
                      <p className="text-slate-300 text-[10px] break-all">{signingResult.fipsAttestation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 font-mono text-xs space-y-2">
                    <Cpu className="w-8 h-8 mx-auto text-slate-600" />
                    <p>Click &quot;Execute Hardware Sign&quot; to test real-time signing inside {selectedDevice.name}.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Scrollable Operation History Log (Mirrors Real HSM Audit Trail) */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-bold text-lg text-white font-sans">
                      Operation History Log (Cryptographic Audit Trail)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Immutable timestamped ledger tracking signing, decapsulation, and self-test events
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search filter */}
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                      placeholder="Filter by key, IP, slot..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Filter by Operation Type */}
                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
                    {['ALL', 'C_Sign', 'C_Decapsulate', 'C_DeriveKey'].map((op) => (
                      <button
                        key={op}
                        onClick={() => setLogFilterOp(op)}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          logFilterOp === op 
                            ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950 px-2.5 py-1 rounded-xl border border-cyan-800">
                    {filteredOpLogs.length} Events
                  </span>
                </div>
              </div>

              {/* Scrollable Audit Table Container */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/80">
                <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-800/60 font-mono text-xs">
                  
                  {/* Table Header (Sticky) */}
                  <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 grid grid-cols-12 gap-3 px-4 py-3 text-slate-400 text-[11px] font-bold">
                    <div className="col-span-2 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Timestamp</span>
                    </div>
                    <div className="col-span-2">Operation & Algorithm</div>
                    <div className="col-span-3">Key Label / Hardware Slot</div>
                    <div className="col-span-1 text-center">Latency</div>
                    <div className="col-span-3">Client Enclave / IP</div>
                    <div className="col-span-1 text-right">Status</div>
                  </div>

                  {/* Rows */}
                  {filteredOpLogs.length > 0 ? (
                    filteredOpLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className="grid grid-cols-12 gap-3 px-4 py-3.5 hover:bg-slate-900/60 transition-colors items-center text-[11px]"
                      >
                        <div className="col-span-2 text-slate-400 flex flex-col">
                          <span className="font-bold text-slate-300">{log.timestamp.slice(11, 23)}</span>
                          <span className="text-[9px] text-slate-500">{log.timestamp.slice(0, 10)}</span>
                        </div>

                        <div className="col-span-2">
                          <span className="font-bold text-cyan-300 block">{log.operation}</span>
                          <span className="text-slate-400 text-[10px]">{log.algorithm}</span>
                        </div>

                        <div className="col-span-3">
                          <span className="text-slate-200 font-medium block truncate">{log.keyLabel}</span>
                          <span className="text-[10px] text-slate-500">{log.slot}</span>
                        </div>

                        <div className="col-span-1 text-center font-bold text-emerald-400">
                          {log.durationMs}ms
                        </div>

                        <div className="col-span-3 text-slate-400 truncate">
                          <span className="block truncate text-slate-300">{log.clientIp}</span>
                          {log.signatureHex && (
                            <span className="text-[9px] text-slate-500 font-mono truncate block">
                              Sig: {log.signatureHex.slice(0, 16)}...
                            </span>
                          )}
                        </div>

                        <div className="col-span-1 text-right">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      No cryptographic operations match the selected filter.
                    </div>
                  )}

                </div>
              </div>

              {/* Footer Summary */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Audit Trail Integrity: Cryptographically Chained (SHA3-512)</span>
                </div>
                <span>Continuous streaming heartbeat connected</span>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: Firmware Integrity Log & Public Transparency Verification */}
        {activeTab === 'firmware-integrity' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Remote Public Registry Verification Engine */}
            <HsmFirmwareIntegritySection
              device={selectedDevice}
              onShowToast={showToast}
            />

            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Header & Verification Metric Badges */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                      <ShieldCheck className="w-5 h-5 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-lg sm:text-xl text-white font-sans">
                      Historic Firmware Integrity Event Ledger
                    </h4>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold uppercase">
                      SECURE BOOT IMMUTABLE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono max-w-3xl">
                    Real-time and historic ledger verifying immutable microcode ROM, FPGA lattice acceleration bitstreams, and crypto-driver binaries against NIST CMVP certified golden hash baselines.
                  </p>
                </div>

                {/* Quick Status Stats */}
                <div className="grid grid-cols-3 gap-3 font-mono text-xs shrink-0">
                  <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Verified Events</span>
                    <span className="text-emerald-400 text-lg font-black">{firmwareLogs.filter(l => l.status === 'MATCH').length}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Tamper Mismatches</span>
                    <span className={`text-lg font-black ${firmwareLogs.filter(l => l.status === 'MISMATCH' || l.status === 'TAMPER_ALERT').length > 0 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                      {firmwareLogs.filter(l => l.status === 'MISMATCH' || l.status === 'TAMPER_ALERT').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Digest Engine</span>
                    <span className="text-cyan-300 text-xs font-bold block mt-1">SHA3-512</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar & Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search & Status Filters */}
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fwSearchQuery}
                      onChange={(e) => setFwSearchQuery(e.target.value)}
                      placeholder="Filter by version, component, signer..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
                    {['ALL', 'MATCH', 'MISMATCH', 'RE_BASELINED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setFwFilterStatus(st)}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          fwFilterStatus === st
                            ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st === 'ALL' ? 'All Logs' : st === 'MATCH' ? 'Verified Match' : st === 'MISMATCH' ? 'Mismatch / Alert' : 'Re-Baselined'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Interactive Trigger Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    disabled={isVerifyingFw}
                    onClick={() => handleRunFirmwareVerification(false)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                    title="Live computes SHA3-512 microcode digest against golden baseline"
                  >
                    <FileCheck className={`w-3.5 h-3.5 ${isVerifyingFw ? 'animate-spin' : ''}`} />
                    <span>{isVerifyingFw ? 'Validating ROM...' : 'Verify Firmware Checksum Now'}</span>
                  </button>

                  <button
                    disabled={isVerifyingFw}
                    onClick={() => handleRunFirmwareVerification(true)}
                    className="px-3 py-2 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/80 font-mono text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Simulates FIPS 140-3 tamper detection alarm when a modified hash is detected"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Simulate Tamper Alert</span>
                  </button>

                  <button
                    onClick={handleExportFirmwareManifest}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Download cryptographically signed integrity manifest"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Manifest</span>
                  </button>
                </div>

              </div>

              {/* Color-Coded Firmware Events List */}
              <div className="space-y-4">
                {filteredFwLogs.length > 0 ? (
                  filteredFwLogs.map((log) => {
                    const isMatch = log.status === 'MATCH';
                    const isMismatch = log.status === 'MISMATCH' || log.status === 'TAMPER_ALERT';
                    
                    return (
                      <div
                        key={log.id}
                        className={`p-5 rounded-2xl border transition-all space-y-4 ${
                          isMismatch 
                            ? 'bg-red-950/30 border-red-800/80 shadow-lg shadow-red-950/40 ring-1 ring-red-500/30'
                            : isMatch
                            ? 'bg-slate-950/70 border-slate-800 hover:border-cyan-500/50'
                            : 'bg-amber-950/20 border-amber-800/50'
                        }`}
                      >
                        {/* Event Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl border ${
                              isMismatch 
                                ? 'bg-red-950 border-red-700 text-red-400 animate-bounce' 
                                : 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                            }`}>
                              {isMismatch ? <ShieldX className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h5 className="font-bold text-sm text-white font-sans">
                                  {log.component}
                                </h5>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-bold">
                                  {log.firmwareVersion}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-2 mt-0.5">
                                <span className="text-cyan-300 font-bold">{log.hsmName}</span>
                                <span>•</span>
                                <span>{log.fipsStandard}</span>
                                <span>•</span>
                                <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 font-mono text-xs">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase flex items-center space-x-1.5 ${
                              isMismatch
                                ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-sm shadow-emerald-950'
                            }`}>
                              {isMismatch ? <AlertTriangle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                              <span>{isMismatch ? 'CHECKSUM MISMATCH (TAMPER DETECTED)' : 'VERIFIED GOLDEN MATCH'}</span>
                            </span>

                            <button
                              onClick={() => setSelectedFwEvent(log)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold border border-slate-700 transition-colors cursor-pointer"
                            >
                              Inspect Hash
                            </button>
                          </div>
                        </div>

                        {/* Side-by-Side Checksum Validation Results */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          
                          {/* Computed Hash Box */}
                          <div className={`lg:col-span-6 p-3.5 rounded-xl border font-mono text-xs space-y-1.5 ${
                            isMismatch ? 'bg-red-950/40 border-red-800' : 'bg-slate-900/90 border-slate-800'
                          }`}>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400 uppercase font-bold flex items-center space-x-1">
                                <Binary className="w-3 h-3 text-cyan-400" />
                                <span>Computed ROM Digest ({log.hashAlgorithm})</span>
                              </span>
                              <span className="text-emerald-400 font-bold">{log.durationMs}ms</span>
                            </div>
                            <div className={`text-[10px] break-all p-2 rounded-lg font-mono border ${
                              isMismatch 
                                ? 'bg-red-950 text-red-300 border-red-700' 
                                : 'bg-slate-950 text-cyan-300 border-slate-800'
                            }`}>
                              {log.computedHash}
                            </div>
                          </div>

                          {/* Known-Good Hash Box */}
                          <div className="lg:col-span-6 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-1.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400 uppercase font-bold flex items-center space-x-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                <span>NIST CMVP Certified Golden Baseline</span>
                              </span>
                              <span className="text-cyan-400 font-bold">FIPS Level 3/4</span>
                            </div>
                            <div className="text-[10px] break-all p-2 rounded-lg font-mono bg-slate-950 text-slate-300 border border-slate-800">
                              {log.knownGoodHash}
                            </div>
                          </div>

                        </div>

                        {/* Signing Authority & Telemetry Diagnostics Footer */}
                        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono">
                          
                          <div className="md:col-span-7 flex items-center space-x-2 text-slate-400">
                            <span className="text-slate-500 font-bold">Signer:</span>
                            <span className="text-slate-200 font-semibold">{log.signingKeyValidation.signer}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                              {log.signingKeyValidation.pqcAlgorithm}
                            </span>
                            <span className="text-slate-500 text-[10px] hidden sm:inline">[{log.signingKeyValidation.certSerial}]</span>
                          </div>

                          <div className="md:col-span-5 text-right text-slate-400 text-[11px] truncate">
                            <span className="text-slate-300">{log.notes}</span>
                          </div>

                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center text-slate-500 font-mono text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
                    No firmware integrity logs match the selected filter.
                  </div>
                )}
              </div>

              {/* Immutable Ledger Guarantee Note */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>FIPS 140-3 §4.9.1 Firmware Attestation: Immutable Hardware-Rooted Verifier</span>
                </div>
                <span className="text-emerald-400 font-bold">100% CMVP Golden Hash Compliant</span>
              </div>

            </div>
          </div>
        )}

        {/* TAB: Security Baseline Manager (JSON & Drift Tracking) */}
        {activeTab === 'security-baseline' && (
          <HsmSecurityBaselineManager
            device={selectedDevice}
            onShowToast={showToast}
          />
        )}

        {/* TAB: Security Hardening Assistant (FIPS 140-3 Interactive Checklist) */}
        {activeTab === 'hardening-assistant' && (
          <HsmSecurityHardeningAssistant
            device={selectedDevice}
            onShowToast={showToast}
          />
        )}

        {/* TAB: Daily API Call Volume Visualizer (Recharts) */}
        {activeTab === 'api-volume' && (
          <HsmApiVolumeVisualizer
            device={selectedDevice}
            onShowToast={showToast}
          />
        )}

        {/* TAB: Thermal Monitoring & Panic Scram Interlock */}
        {activeTab === 'thermal-monitor' && (
          <HsmThermalMonitor
            device={selectedDevice}
            onShowToast={showToast}
            onVolatileShred={() => {
              setIsVolatileShredded(true);
              setEphemeralVolatileSlots(prev => prev.map(s => ({ ...s, isShredded: true, dataHex: '000000000000000000000000' })));
            }}
          />
        )}

        {/* TAB 8: Real-Time Latency Monitor (RTT) */}
        {activeTab === 'latency-monitor' && (
          <HsmLatencyMonitor 
            device={selectedDevice} 
            onShowToast={showToast} 
          />
        )}

        {/* TAB 9: Internal Enclave Diagnostics Log Viewer */}
        {activeTab === 'diagnostics' && (
          <HsmDiagnosticLogViewer 
            device={selectedDevice} 
            onShowToast={showToast} 
          />
        )}

        {/* TAB 10: Security Policies & Machine-Readable JSON Export */}
        {activeTab === 'policy-export' && (
          <HsmPolicyExporter 
            device={selectedDevice} 
            onShowToast={showToast} 
          />
        )}

        {/* TAB 11: Real-Time Entropy Health Monitoring Trigger */}
        {activeTab === 'entropy-health' && (
          <HsmEntropyHealthMonitor 
            device={selectedDevice} 
            onShowToast={showToast} 
          />
        )}

        {/* TAB 12: Enclave Tamper History Forensic Ledger */}
        {activeTab === 'tamper-history' && (
          <HsmTamperHistoryView
            device={selectedDevice}
          />
        )}

        {/* TAB 13: Post-Quantum Master Key Lifecycle & Rotation Manager */}
        {activeTab === 'key-lifecycle' && (
          <HsmKeyLifecycleManager
            selectedDevice={selectedDevice}
            keys={deviceKeys}
            onKeyRotated={(keyId, newLabel, algo) => {
              setKeys(prev => prev.map(k => k.id === keyId ? { ...k, label: newLabel, usageCount: 0 } : k));
              showToast('Key Rotation Synced', `Key slot ${keyId} updated to new PQC lattice generation.`, 'success');
            }}
          />
        )}

        {/* TAB 14: NIST SP 800-22 Entropy & P-Value Distribution Analysis */}
        {activeTab === 'entropy-analysis' && (
          <HsmEntropyAnalysisTab />
        )}

        {/* TAB: Quantum Adversary Simulator (HNDL & Real-World News) */}
        {activeTab === 'adversary-simulator' && (
          <QuantumAdversarySimulator />
        )}

        {/* TAB: HSM Selection Guide & FIPS 140-3 Architectures */}
        {activeTab === 'hsm-selection-guide' && (
          <HsmSelectionGuide />
        )}

        {/* TAB 15: Security Self-Test Suite & HSM Implementation Guide */}
        {activeTab === 'self-test-suite' && (
          <HsmSecuritySelfTestSuite selectedDevice={selectedDevice} />
        )}

        {/* SESSION INACTIVITY RE-AUTHENTICATION LOCK MODAL */}
        <HsmInactivityLockModal
          isOpen={isEnclaveLocked}
          onUnlock={() => {
            setIsEnclaveLocked(false);
            setSecondsRemainingBeforeLock(inactivityTimeoutMinutes * 60);
          }}
          inactivityDurationMinutes={inactivityTimeoutMinutes}
        />

        {/* EMERGENCY POWER-OFF PROTECTION & EPHEMERAL SHRED MODAL */}
        {isPowerShredModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl shadow-cyan-950/80 space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    <Power className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white font-sans flex items-center space-x-2">
                      <span>Emergency Power-Off Protection Studio</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isEmergencyPowerOffArmed ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isEmergencyPowerOffArmed ? 'ARMED' : 'DISARMED'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Sub-millisecond volatile SRAM key shredding on low battery (&lt;5%) or forced power loss
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPowerShredModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Interactive Battery State & Arming Control */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Battery className={`w-5 h-5 ${simulatedBatteryLevel <= 5 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                    <span className="text-xs text-slate-300 font-bold">Simulated Device Battery State:</span>
                    <span className={`text-sm font-black ${simulatedBatteryLevel <= 5 ? 'text-red-400' : 'text-cyan-300'}`}>
                      {simulatedBatteryLevel}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400">Protection Circuit:</span>
                    <button
                      onClick={() => setIsEmergencyPowerOffArmed(prev => !prev)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        isEmergencyPowerOffArmed
                          ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isEmergencyPowerOffArmed ? 'Armed (Auto Shred)' : 'Disarmed'}
                    </button>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={simulatedBatteryLevel}
                    onChange={(e) => {
                      const newLevel = parseInt(e.target.value, 10);
                      setSimulatedBatteryLevel(newLevel);
                      if (newLevel <= 5 && isEmergencyPowerOffArmed && !isVolatileShredded && !isExecutingPowerShred) {
                        handleTriggerEmergencyPowerCut(newLevel);
                      }
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span className="text-red-400 font-bold">0% (Shutdown Cutoff)</span>
                    <span className="text-amber-400">5% (Shred Threshold)</span>
                    <span className="text-slate-400">50%</span>
                    <span className="text-emerald-400 font-bold">100% (Nominal)</span>
                  </div>
                </div>

                {/* Trigger Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
                  <button
                    onClick={() => handleTriggerEmergencyPowerCut(0)}
                    disabled={isExecutingPowerShred || isVolatileShredded}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-md shadow-red-950"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isExecutingPowerShred ? 'Shredding in Progress...' : 'Trigger Forced Power Cutoff (0%)'}</span>
                  </button>

                  <button
                    onClick={handleRestoreEphemeralVolatileKeys}
                    disabled={!isVolatileShredded}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Re-Initialize Ephemeral Ratchet Keys</span>
                  </button>
                </div>
              </div>

              {/* Ephemeral Volatile SRAM Memory Slots Table */}
              <div className="space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ephemeral Volatile SRAM Key Allocations:</span>
                  </span>
                  <span className={`text-[11px] font-bold ${
                    isVolatileShredded ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {isVolatileShredded ? 'STATUS: ALL VOLATILE KEYS SHREDDED' : 'STATUS: LIVE ACTIVE IN MEMORY'}
                  </span>
                </div>

                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">SRAM Address</th>
                        <th className="p-2.5">Key Allocation</th>
                        <th className="p-2.5">Memory Type</th>
                        <th className="p-2.5">Data Pattern</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      {ephemeralVolatileSlots.map((slot) => (
                        <tr key={slot.address} className="hover:bg-slate-900/40">
                          <td className="p-2.5 text-cyan-300 font-bold">{slot.address}</td>
                          <td className="p-2.5 text-slate-200">{slot.name}</td>
                          <td className="p-2.5 text-slate-400">{slot.lifetime}</td>
                          <td className="p-2.5">
                            <span className={slot.isShredded ? 'text-red-400 font-bold' : 'text-slate-300'}>
                              {slot.dataHex}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              slot.isShredded
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {slot.isShredded ? 'PURGED (0x00)' : 'SECURE LIVE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hardware Discharge Telemetry Logs */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono">
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                  <span>Hardware Discharge & Zeroization Trace (Crowbar Circuit)</span>
                  <span className="text-cyan-400">Response Speed: 1.18ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  {emergencyShredLogs.map((log, idx) => (
                    <div key={idx} className={log.includes('CRITICAL') ? 'text-amber-400 font-bold' : log.includes('PURGED') ? 'text-red-400' : 'text-slate-300'}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Assurance Notice */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-slate-300 text-xs flex items-start space-x-2.5 font-sans">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-cyan-300">FIPS 140-3 Non-Volatile Isolation:</strong> While ephemeral ratchet keys in volatile SRAM are immediately purged to prevent cold-boot memory extraction attacks, your long-term device Root Keys (<strong className="text-white">ML-DSA-87</strong>) remain securely sealed inside the hardware tamper flash and require authorized biometric/PIN quorum to awaken.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Security Stress Test Modal */}
        {isStressTestModalOpen && (
          <HsmSecurityStressTestModal
            isOpen={isStressTestModalOpen}
            onClose={() => setIsStressTestModalOpen(false)}
            selectedDevice={selectedDevice}
            keys={deviceKeys}
          />
        )}

        {/* Detailed Hash Inspection Modal */}
        {selectedFwEvent && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl shadow-cyan-950/60 space-y-6 animate-scaleUp">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white font-sans">
                      Bitwise SHA3-512 Hash Inspector
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedFwEvent.component} ({selectedFwEvent.firmwareVersion})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFwEvent(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Computed Hash (Hex Formatted)</span>
                  <div className="text-cyan-300 break-all text-[11px] p-2 bg-slate-900 rounded border border-slate-800 select-all">
                    {selectedFwEvent.computedHash}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Certified Known-Good Golden Digest</span>
                  <div className="text-emerald-400 break-all text-[11px] p-2 bg-slate-900 rounded border border-slate-800 select-all">
                    {selectedFwEvent.knownGoodHash}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase block">Bit Match Status</span>
                    <span className={`font-bold text-sm ${selectedFwEvent.status === 'MATCH' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedFwEvent.status === 'MATCH' ? '512 / 512 Bits Identical' : 'Hash Mismatch (0xBAD0...)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase block">Signing Authority</span>
                    <span className="text-slate-200 font-bold text-xs truncate block">{selectedFwEvent.signingKeyValidation.signer}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                  <strong className="text-white block mb-1">Diagnostic Log:</strong>
                  {selectedFwEvent.notes}
                </div>

              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedFwEvent, null, 2));
                    showToast('Copied', 'Hash details copied to clipboard.', 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON Payload</span>
                </button>

                <button
                  onClick={() => setSelectedFwEvent(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-black cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MULTI-STEP 'ZEROIZE SECURITY KEYS' CONFIRMATION DIALOG */}
        {isZeroizeDialogOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border-2 border-red-500/80 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl shadow-red-950/90 space-y-6 relative overflow-hidden animate-scaleUp">
              
              {/* Top Accent Strip */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

              {/* Modal Header with Step Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-900/40 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-2xl bg-red-950/80 border border-red-500 text-red-400 animate-pulse">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white font-sans flex items-center gap-2">
                      <span>Zeroize Cryptographic Enclave</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono uppercase">
                        FIPS 140-3 §4.10
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Dual-Control Anti-Forensic Key Erasure Ceremony
                    </p>
                  </div>
                </div>

                {/* 3-Step Pill Tracker */}
                <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                  {[
                    { num: 1, label: 'Scope' },
                    { num: 2, label: 'Dual-Auth' },
                    { num: 3, label: 'Arm & Zeroize' }
                  ].map((s) => (
                    <div
                      key={s.num}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-bold ${
                        zeroizeStep === s.num
                          ? 'bg-red-600 text-white border-red-400 shadow-sm shadow-red-950'
                          : zeroizeStep > s.num
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      <span>{s.num}.</span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 1: Threat Assessment & Blast Radius */}
              {zeroizeStep === 1 && (
                <div className="space-y-5 animate-fadeIn font-mono text-xs">
                  
                  <div className="p-4 rounded-2xl bg-red-950/50 border border-red-800/80 space-y-2 text-slate-300 leading-relaxed">
                    <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>CRITICAL WARNING: IRREVERSIBLE ACTION</span>
                    </div>
                    <p>
                      Triggering zeroization instructs the hardware security controller to fire the crowbar circuit, grounding the battery-backed SRAM VCC line in <strong>12ns</strong> and wiping all private key slots with <strong>0x00</strong> patterns within <strong>4µs</strong>.
                    </p>
                  </div>

                  {/* Enclave Target Scope Selection */}
                  <div className="space-y-2">
                    <label className="text-slate-300 font-bold block text-xs">
                      Select Cryptographic Erasure Target:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setZeroizeScope('CURRENT_HSM')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          zeroizeScope === 'CURRENT_HSM'
                            ? 'bg-red-950/80 border-red-500 text-white ring-1 ring-red-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">Active Device Only</div>
                        <div className="text-[11px] text-slate-400 mt-1">{selectedDevice.name} ({selectedDevice.slot})</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setZeroizeScope('ALL_CLUSTER')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          zeroizeScope === 'ALL_CLUSTER'
                            ? 'bg-red-950/80 border-red-500 text-white ring-1 ring-red-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">Full HSM Cluster</div>
                        <div className="text-[11px] text-slate-400 mt-1">Wipe All Enclaves & Mesh Nodes</div>
                      </button>
                    </div>
                  </div>

                  {/* Affected Keys Summary */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Keys Slated for Immediate Destruction:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        <strong className="text-cyan-300 block">ML-KEM-1024</strong> FIPS 203 Lattice Master KEK
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        <strong className="text-cyan-300 block">ML-DSA-87</strong> FIPS 204 Dilithium Root Signer
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        <strong className="text-cyan-300 block">Kyber1024</strong> Session Enclave Secret
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        <strong className="text-cyan-300 block">TRNG Seed</strong> NIST SP 800-90A State Vector
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer Step 1 */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setIsZeroizeDialogOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setZeroizeStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center space-x-1.5 cursor-pointer shadow-md shadow-red-950"
                    >
                      <span>Proceed to Dual-Control Auth</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 2: Dual-Control Security Officer Challenge */}
              {zeroizeStep === 2 && (
                <div className="space-y-5 animate-fadeIn font-mono text-xs">
                  
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 space-y-2 text-slate-300">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                      <KeyRound className="w-4 h-4" />
                      <span>DUAL-CONTROL AUTHORIZATION REQUIRED</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Per FIPS 140-3 Level 4 protocol, emergency key destruction requires two-person integrity. Enter the simulated secondary Security Officer token and type the confirmation word <strong>ZEROIZE</strong>.
                    </p>
                  </div>

                  {/* Simulated Security Officer Token Card */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold flex items-center space-x-1.5">
                        <Fingerprint className="w-4 h-4 text-cyan-400" />
                        <span>Security Officer Hardware Token (FIDO2/TOTP):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setZeroizeAuthToken(simulatedOfficerToken);
                          showToast('Token Filled', 'Security Officer Token inserted into challenge field.', 'info');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[10px] font-bold border border-cyan-700 cursor-pointer"
                      >
                        Auto-Fill Token ({simulatedOfficerToken})
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      value={zeroizeAuthToken}
                      onChange={(e) => setZeroizeAuthToken(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Officer OTP (e.g. 849201)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Word Confirmation */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="text-slate-400 font-bold block text-xs">
                      Type confirmation keyword <strong className="text-red-400">ZEROIZE</strong> to confirm:
                    </label>
                    <input
                      type="text"
                      value={zeroizeChallengeWord}
                      onChange={(e) => setZeroizeChallengeWord(e.target.value.toUpperCase())}
                      placeholder="ZEROIZE"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-red-400 font-mono font-black text-sm tracking-wider focus:outline-none focus:border-red-500 uppercase"
                    />
                  </div>

                  {/* Modal Footer Step 2 */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setZeroizeStep(1)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      disabled={zeroizeAuthToken.length < 6 || zeroizeChallengeWord !== 'ZEROIZE'}
                      onClick={() => setZeroizeStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center space-x-1.5 cursor-pointer shadow-md shadow-red-950 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>Arm Zeroize Trigger</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 3: Armed Final Execution */}
              {zeroizeStep === 3 && (
                <div className="space-y-5 animate-fadeIn font-mono text-xs">
                  
                  <div className="p-5 rounded-2xl bg-red-950 border-2 border-red-600 text-center space-y-3 shadow-xl shadow-red-950">
                    <div className="inline-flex p-3 rounded-full bg-red-600 text-white animate-bounce">
                      <Flame className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white font-sans uppercase tracking-wide">
                      ZEROIZATION ARMED - READY TO EXECUTE
                    </h4>
                    <p className="text-xs text-red-200 leading-relaxed max-w-md mx-auto">
                      All dual-control safety interlocks are disengaged. Pressing the button below will immediately trigger hardware physical SRAM destruction in 4µs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Enclave Status After Zeroize:</span>
                    <span className="text-red-400 font-bold">LOCKED / EMERGENCY_ZEROIZED</span>
                  </div>

                  {/* Modal Footer Step 3 */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setIsZeroizeDialogOpen(false)}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                    >
                      Cancel & Disarm Enclave
                    </button>
                    
                    <button
                      onClick={handleExecuteMultiStepZeroize}
                      disabled={isAuthorizingZeroize}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black flex items-center justify-center space-x-2 cursor-pointer shadow-xl shadow-red-950 animate-pulse border border-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isAuthorizingZeroize ? 'DISCHARGING CROWBAR...' : 'DESTROY ALL HARDWARE KEYS (4µs)'}</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* PRINTABLE 'PHYSICAL HSM AUDIT CERTIFICATE' MODAL */}
        {isAuditCertModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-slate-900 border border-cyan-500/60 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl shadow-cyan-950/80 space-y-6 my-auto">
              
              {/* Actions Bar (Screen Only) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 print:hidden">
                <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold">
                  <Award className="w-5 h-5" />
                  <span>FIPS 140-3 LEVEL 4 SECURITY AUDIT & ATTESTATION</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrintAuditCert}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow-md shadow-cyan-950 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Certificate (Ctrl+P)</span>
                  </button>

                  <button
                    onClick={() => {
                      const certData = {
                        certificateId: 'NIST-CMVP-VAL-4891',
                        standard: 'NIST FIPS 140-3 Level 4',
                        device: selectedDevice.name,
                        serialNumber: 'HSM-FIPS4-2026-98124',
                        siliconRoTHash: '0x8F9C3E1B7A4D6F8C9E0B1A2C3D4E5F6A7B8C9D0E',
                        uptime24h: '100.00%',
                        cryptographicOps24h: 369820,
                        avgLatencyMs: 1.34,
                        tamperBreaches: 0,
                        trngMinEntropy: 7.9961,
                        activeKeys: keys.map(k => ({ label: k.label, algo: k.algorithm, slot: k.slotId })),
                        merkleRootDigest: '0x5b3a9c7d1e8f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b',
                        signatureAlgorithm: 'ML-DSA-87 (FIPS 204 Dilithium)',
                        signature: '0x7f3a2c9d1e8b4a5f6e7d8c9b0a1f2e3d4c5b6a7890123456789abcdef0123456',
                        timestamp: certGeneratedTime
                      };
                      navigator.clipboard.writeText(JSON.stringify(certData, null, 2));
                      showToast('Audit JSON Copied', 'Full attestation data copied to clipboard.', 'success');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center space-x-1.5 cursor-pointer border border-slate-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={() => setIsAuditCertModalOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PRINTABLE CERTIFICATE CONTAINER (High-Contrast Official NIST Document) */}
              <div 
                id="printable-hsm-certificate"
                className="bg-[#0b101b] text-slate-100 p-6 sm:p-8 rounded-2xl border-2 border-cyan-500/40 space-y-6 font-mono relative overflow-hidden"
              >
                {/* Background Watermark */}
                <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
                  <ShieldCheck className="w-80 h-80 text-cyan-400" />
                </div>

                {/* Certificate Header */}
                <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6">
                  <div className="inline-flex items-center justify-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NATIONAL INSTITUTE OF STANDARDS & TECHNOLOGY (NIST) CMVP COMPLIANT</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight uppercase">
                    Physical HSM Security Audit Certificate
                  </h2>
                  <p className="text-xs text-slate-400">
                    24-Hour Heartbeat Telemetry, Physical Tamper Containment & Post-Quantum Key Lifecycle Attestation
                  </p>
                </div>

                {/* Certificate Details Meta Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Certificate ID</span>
                    <span className="text-cyan-300 font-bold">NIST-CMVP-VAL-4891</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Enclave Serial</span>
                    <span className="text-white font-bold">HSM-FIPS4-2026-98124</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Security Standard</span>
                    <span className="text-emerald-400 font-bold">FIPS 140-3 Level 4</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Issued Timestamp</span>
                    <span className="text-slate-300 font-bold">{new Date(certGeneratedTime).toLocaleString()}</span>
                  </div>
                </div>

                {/* 24-Hour Heartbeat & Security Telemetry Summary */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
                    <span>1. Last 24-Hour Enclave Heartbeat & Performance Metrics</span>
                    <span className="text-emerald-400 font-bold">100.00% Nominal</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase block">Operational Uptime</span>
                      <span className="text-emerald-400 font-bold text-sm">24h 00m (100%)</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">0 Downtime Seconds</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase block">24h Cryptographic Ops</span>
                      <span className="text-cyan-300 font-bold text-sm">369,820 ops</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">0 Faulted Ops</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase block">Mean Latency & Jitter</span>
                      <span className="text-white font-bold text-sm">1.34 ms</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Jitter &lt; 0.08ms</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase block">Physical Mesh Trips</span>
                      <span className="text-emerald-400 font-bold text-sm">0 Alarms</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Mesh 100% Intact</span>
                    </div>
                  </div>
                </div>

                {/* 24-Hour Key Lifecycle Inventory */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800 pb-1">
                    2. Enclave Cryptographic Key Inventory & PQC Compliance
                  </h4>

                  <div className="space-y-2 text-xs">
                    {[
                      { slot: '0x0001', label: 'ML-KEM-1024 Master Key', algo: 'FIPS 203 (Lattice)', status: 'ACTIVE', ops24h: 184200 },
                      { slot: '0x0002', label: 'ML-DSA-87 Root Signing Secret', algo: 'FIPS 204 (Dilithium)', status: 'ACTIVE', ops24h: 98410 },
                      { slot: '0x0003', label: 'SLH-DSA-256 Stateless Hash Secret', algo: 'FIPS 205 (SPHINCS+)', status: 'ACTIVE', ops24h: 52100 },
                      { slot: '0x0004', label: 'Kyber1024 Quantum KEK Slot', algo: 'NIST Round 3', status: 'ACTIVE', ops24h: 35110 }
                    ].map((k) => (
                      <div key={k.slot} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-bold text-[10px]">{k.slot}</span>
                          <div>
                            <span className="text-white font-bold block">{k.label}</span>
                            <span className="text-[10px] text-slate-400">{k.algo}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold text-[11px] block">{k.status}</span>
                          <span className="text-[10px] text-slate-500">{k.ops24h.toLocaleString()} ops in 24h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 24h Audit Merkle Root & Silicon RoT Attestation */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">
                    24-Hour Immutable Audit Merkle Root (SHA3-512 Digest):
                  </span>
                  <div className="text-cyan-300 text-[10px] break-all select-all p-2 bg-slate-900 rounded border border-slate-800 font-mono">
                    0x5b3a9c7d1e8f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b9d8c7e6f5a4b3c2d1e0f
                  </div>
                </div>

                {/* Digital Attestation Signature Block */}
                <div className="pt-4 border-t-2 border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-1.5 text-xs">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                      <FileCheck className="w-4 h-4" />
                      <span>CRYPTOGRAPHICALLY ATTESTED BY HARDWARE ROOT-OF-TRUST</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Signer: <strong className="text-white">ML-DSA-87 Hardware Enclave Signer (Security Clearance L5)</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 break-all font-mono">
                      Signature: 0x7f3a2c9d1e8b4a5f6e7d8c9b0a1f2e3d4c5b6a7890123456789abcdef0123456...
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center justify-end space-x-3 text-right">
                    <div className="text-[10px] text-slate-400 font-mono">
                      <span className="block font-bold text-white">NIST CMVP VALIDATED</span>
                      <span>Level 4 Physical / PQC</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <QrCode className="w-12 h-12 text-slate-950" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

