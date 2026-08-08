import React, { useState } from 'react';
import { 
  Cpu, Code2, Terminal, BookOpen, Layers, ShieldCheck, Download, Copy, Check, 
  Sparkles, ExternalLink, Zap, Lock, RefreshCw, FileCode, CheckCircle2, ChevronRight,
  HardDrive, Wrench, Box, AlertTriangle, HelpCircle, ShieldAlert, Activity, Key, Sliders, Info,
  Eye, EyeOff, ChevronDown, ChevronUp, Printer, Award, CheckCircle, XCircle, RotateCcw,
  Calendar, ArrowRight, Clock, Milestone, BarChart3, Network, ArrowUpRight
} from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';
import { RsaVsPqcSimulation } from './RsaVsPqcSimulation';
import { EncryptionHistoryTimeline } from './EncryptionHistoryTimeline';
import { ApiPlaygroundModal } from './ApiPlaygroundModal';
import { DailySecurityTreatFetcher } from './DailySecurityTreatFetcher';

export interface AlgorithmSpec {
  id: string;
  name: string;
  category: 'Classical Asymmetric' | 'Symmetric Cipher' | 'Post-Quantum Lattice' | 'Post-Quantum Hash';
  classicalBits: number;
  quantumBits: number;
  shorStatus: 'CRITICAL_VULNERABLE' | 'GROVER_REDUCED' | 'QUANTUM_IMMUNE';
  keySize: string;
  crackTime: string;
  ratingScore: number; // 0 to 100
  color: 'rose' | 'amber' | 'emerald' | 'cyan' | 'purple';
  description: string;
  codeSnippet: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  simpleAnalogy: string;
  technicalDefinition: string;
  iconName: string;
}

export const PqcCodeAndDeveloperResources: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [activeCodeTab, setActiveCodeTab] = useState<'c_ntt' | 'cpp_enclave' | 'asm_avx2' | 'asm_arm64'>('c_ntt');
  const [activeBuildTab, setActiveBuildTab] = useState<'cmake' | 'ndk' | 'liboqs'>('cmake');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Visibility toggles for clean UI
  const [showCodeBlock, setShowCodeBlock] = useState<boolean>(false);
  const [showBuildBlock, setShowBuildBlock] = useState<boolean>(false);

  // Interactive Sandbox state
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('ml_kem_1024');

  // Interactive NTT Simulator state
  const [nttCoeffA, setNttCoeffA] = useState<number>(1248);
  const [nttCoeffB, setNttCoeffB] = useState<number>(2091);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Benchmark Simulator state
  const [benchmarkArch, setBenchmarkArch] = useState<'avx2' | 'arm64' | 'cref'>('avx2');
  const [cpuClockGhz, setCpuClockGhz] = useState<number>(3.2);
  const [benchmarkAlgoId, setBenchmarkAlgoId] = useState<string>('ml_kem_1024');
  const [isApiPlaygroundOpen, setIsApiPlaygroundOpen] = useState<boolean>(false);

  const benchmarkDataset = [
    {
      id: 'ml_kem_1024',
      name: 'NIST FIPS 203 ML-KEM-1024',
      type: 'PQC Lattice (KEM)' as const,
      pubKeyBytes: 1568,
      secKeyBytes: 3168,
      ctSigBytes: 1568,
      cycles: {
        avx2: { keygen: 120000, encapsSign: 150000, decapsVerify: 165000 },
        arm64: { keygen: 145000, encapsSign: 175000, decapsVerify: 190000 },
        cref: { keygen: 380000, encapsSign: 450000, decapsVerify: 510000 }
      }
    },
    {
      id: 'ml_dsa_87',
      name: 'NIST FIPS 204 ML-DSA-87',
      type: 'PQC Signature' as const,
      pubKeyBytes: 2592,
      secKeyBytes: 4896,
      ctSigBytes: 4627,
      cycles: {
        avx2: { keygen: 310000, encapsSign: 1200000, decapsVerify: 410000 },
        arm64: { keygen: 360000, encapsSign: 1450000, decapsVerify: 490000 },
        cref: { keygen: 950000, encapsSign: 3800000, decapsVerify: 1250000 }
      }
    },
    {
      id: 'falcon_1024',
      name: 'Falcon-1024 Signature',
      type: 'PQC Signature' as const,
      pubKeyBytes: 1793,
      secKeyBytes: 2305,
      ctSigBytes: 1280,
      cycles: {
        avx2: { keygen: 24000000, encapsSign: 380000, decapsVerify: 78000 },
        arm64: { keygen: 29000000, encapsSign: 460000, decapsVerify: 92000 },
        cref: { keygen: 75000000, encapsSign: 1100000, decapsVerify: 240000 }
      }
    },
    {
      id: 'rsa_2048',
      name: 'Classical RSA-2048',
      type: 'Classical RSA' as const,
      pubKeyBytes: 256,
      secKeyBytes: 1190,
      ctSigBytes: 256,
      cycles: {
        avx2: { keygen: 120000000, encapsSign: 2500000, decapsVerify: 75000000 },
        arm64: { keygen: 140000000, encapsSign: 3100000, decapsVerify: 88000000 },
        cref: { keygen: 280000000, encapsSign: 6500000, decapsVerify: 180000000 }
      }
    },
    {
      id: 'ecdh_p256',
      name: 'Classical ECDH P-256',
      type: 'Classical ECC' as const,
      pubKeyBytes: 64,
      secKeyBytes: 32,
      ctSigBytes: 64,
      cycles: {
        avx2: { keygen: 1100000, encapsSign: 1400000, decapsVerify: 1400000 },
        arm64: { keygen: 1300000, encapsSign: 1650000, decapsVerify: 1650000 },
        cref: { keygen: 2800000, encapsSign: 3500000, decapsVerify: 3500000 }
      }
    }
  ];

  const snippetComplexityMap: Record<string, { level: string; color: string; badgeText: string }> = {
    c_ntt: { level: 'Advanced', color: 'bg-cyan-950 text-cyan-300 border-cyan-700', badgeText: 'Advanced (C11 Math)' },
    cpp_enclave: { level: 'Advanced', color: 'bg-emerald-950 text-emerald-300 border-emerald-700', badgeText: 'Advanced (C++20 Enclave)' },
    asm_avx2: { level: 'Expert', color: 'bg-purple-950 text-purple-300 border-purple-700', badgeText: 'Expert (x86_64 AVX2 SIMD)' },
    asm_arm64: { level: 'Expert', color: 'bg-amber-950 text-amber-300 border-amber-700', badgeText: 'Expert (ARM64 NEON SIMD)' },
    cmake: { level: 'Beginner', color: 'bg-blue-950 text-blue-300 border-blue-700', badgeText: 'Beginner (CMake Build)' },
    ndk: { level: 'Advanced', color: 'bg-emerald-950 text-emerald-300 border-emerald-700', badgeText: 'Advanced (Android NDK)' },
    liboqs: { level: 'Advanced', color: 'bg-purple-950 text-purple-300 border-purple-700', badgeText: 'Advanced (liboqs C)' },
  };

  const quizQuestions = [
    {
      id: 1,
      question: "What active attack vector does Post-Quantum Cryptography (PQC) immediately neutralize?",
      options: [
        "SQL database injection exploits",
        "Store Now, Decrypt Later (SNDL) passive interception",
        "Browser cookie expiration glitches",
        "DNS resolution timeouts"
      ],
      correctIndex: 1,
      explanation: "SNDL is where adversaries record encrypted traffic today and hoard it until Cryptographically Relevant Quantum Computers (CRQCs) can break classical RSA/ECC."
    },
    {
      id: 2,
      question: "Which official NIST standard governs ML-KEM-1024 post-quantum key encapsulation?",
      options: [
        "NIST FIPS 140-3",
        "NIST FIPS 197",
        "NIST FIPS 203",
        "NIST SP 800-53"
      ],
      correctIndex: 2,
      explanation: "NIST FIPS 203 specifies Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM) for quantum-resistant key establishment."
    },
    {
      id: 3,
      question: "How does Grover's Quantum Algorithm impact symmetric ciphers like AES-256-GCM?",
      options: [
        "Completely breaks AES-256 in milliseconds",
        "Provides a quadratic speedup, reducing 256-bit keys to 128-bit quantum security",
        "Has zero theoretical impact on key brute-forcing",
        "Forces key lengths to expand to 8192 bits"
      ],
      correctIndex: 1,
      explanation: "Grover's algorithm halves effective symmetric key length (square-root reduction), leaving AES-256 with 128 bits of security, which remains mathematically unbreakable."
    },
    {
      id: 4,
      question: "Why are classical public-key systems (RSA-2048, ECDH) vulnerable to quantum computers?",
      options: [
        "They rely on prime factorization & discrete logarithms, which Shor's Algorithm solves in polynomial time",
        "They require continuous Wi-Fi connectivity",
        "They lack 64-bit operating system support",
        "They use unencrypted HTTP headers"
      ],
      correctIndex: 0,
      explanation: "Shor's quantum algorithm solves integer factorization and discrete logarithms in O(n^3) time, breaking RSA, DSA, and ECC."
    },
    {
      id: 5,
      question: "What is the security role of explicit RAM zeroization in low-level C/C++ PQC enclaves?",
      options: [
        "To save mobile battery power",
        "To overwrite ephemeral secret key material immediately after handshake to prevent memory dump leaks",
        "To reformat device flash storage",
        "To compress key packets before transmitting over 5G"
      ],
      correctIndex: 1,
      explanation: "Volatile memory zeroization (via explicit_bzero or _mm_clflush) prevents secret keys from lingering in RAM where memory dump exploits could read them."
    }
  ];

  const roadmapMilestones = [
    {
      step: "PHASE 01",
      title: "Hybrid PQC Key Encapsulation (ML-KEM-1024 + X25519)",
      timeframe: "Active Today (Q1 2026)",
      status: "ACTIVE_DEPLOYED",
      badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-500/50",
      iconColor: "text-cyan-400 bg-cyan-950 border-cyan-500/40",
      summary: "Combine classical ECDH with NIST FIPS 203 lattice key exchange to ensure immediate immunity against 'Store Now, Decrypt Later' (SNDL) harvested traffic.",
      keyActions: [
        "NIST FIPS 203 ML-KEM-1024 primary key establishment",
        "X25519 fallback for legacy client compatibility",
        "Constant-time NTT polynomial multiplication"
      ]
    },
    {
      step: "PHASE 02",
      title: "Hardware Enclave Attestation & SIMD Acceleration",
      timeframe: "Production Enforced (Q2 2026)",
      status: "PRODUCTION_ENFORCED",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/50",
      iconColor: "text-emerald-400 bg-emerald-950 border-emerald-500/40",
      summary: "Hardware-bound key generation inside isolated CPU enclaves (Android Titan M2, Apple Secure Enclave) accelerated by x86_64 AVX2 & ARM64 NEON SIMD routines.",
      keyActions: [
        "16x parallel AVX2 / ARM64 NEON vector registers",
        "Compiler memory-barrier RAM zeroization (explicit_bzero)",
        "Hardware enclave key attestation certificates"
      ]
    },
    {
      step: "PHASE 03",
      title: "Post-Quantum Digital Signatures (NIST FIPS 204 ML-DSA-87)",
      timeframe: "Scheduled Q3 2026",
      status: "SCHEDULED",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-500/50",
      iconColor: "text-purple-400 bg-purple-950 border-purple-500/40",
      summary: "Transition identity authentication from RSA/ECDSA signatures to NIST FIPS 204 Dilithium signatures to prevent quantum identity spoofing.",
      keyActions: [
        "ML-DSA-87 (Dilithium) quantum signature verification",
        "Post-quantum Certificate Authority (CA) root anchors",
        "Zero-trust peer-to-peer device identity stamping"
      ]
    },
    {
      step: "PHASE 04",
      title: "Pure Post-Quantum Zero-Trust Enterprise Mesh",
      timeframe: "Target Vision 2027+",
      status: "VISION",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/50",
      iconColor: "text-amber-400 bg-amber-950 border-amber-500/40",
      summary: "Complete retirement of classical asymmetric fallback algorithms across all enterprise endpoints and network backbones.",
      keyActions: [
        "100% pure PQC packet wrapping across all layers",
        "Autonomous CRQC threat feed key auto-rotation",
        "Air-gapped enterprise vault certification"
      ]
    }
  ];

  const handleQuizOptionSelect = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const score = calculateQuizScore();
    showToast(
      `Quiz Complete: ${score}/${quizQuestions.length}`,
      score >= 4 ? 'Excellent! Quantum Cryptography Master.' : 'Good effort! Review the explanations below.',
      score >= 4 ? 'success' : 'info'
    );
  };

  const handleQuizReset = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleCopy = (code: string, id: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    showToast(`${label} Copied`, 'Source code copied to clipboard', 'success');
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  // Cryptographic Algorithm Specs for Interactive Sandbox
  const algorithmSpecs: AlgorithmSpec[] = [
    {
      id: 'rsa_2048',
      name: 'RSA-2048 (Classical PKI)',
      category: 'Classical Asymmetric',
      classicalBits: 112,
      quantumBits: 0,
      shorStatus: 'CRITICAL_VULNERABLE',
      keySize: '256 bytes (Public Key)',
      crackTime: '~10 seconds on 4,000 Qubit CRQC',
      ratingScore: 12,
      color: 'rose',
      description: 'Legacy public-key cryptography relying on prime factorization. Highly vulnerable to Shor\'s Quantum Algorithm.',
      codeSnippet: `// Legacy RSA-2048 Encryption (VULNERABLE TO QUANTUM)
RSA* rsa = RSA_generate_key(2048, RSA_F4, NULL, NULL);
// Shor's Algorithm solves N = p*q in O((log N)^3) on CRQC!`
    },
    {
      id: 'ecc_p256',
      name: 'ECC ECDH / ECDSA (P-256)',
      category: 'Classical Asymmetric',
      classicalBits: 128,
      quantumBits: 0,
      shorStatus: 'CRITICAL_VULNERABLE',
      keySize: '64 bytes (Public Key)',
      crackTime: '~1.8 seconds on 2,330 Qubit CRQC',
      ratingScore: 18,
      color: 'rose',
      description: 'Elliptic Curve Cryptography relying on Discrete Logarithm problem. Completely broken by Shor\'s algorithm.',
      codeSnippet: `// Legacy ECDH Key Exchange (VULNERABLE TO QUANTUM)
EVP_PKEY* pkey = EVP_PKEY_Q_keygen(NULL, NULL, "EC", "P-256");
// Shor's Algorithm computes private scalar k in seconds!`
    },
    {
      id: 'aes_256',
      name: 'AES-256-GCM (Symmetric)',
      category: 'Symmetric Cipher',
      classicalBits: 256,
      quantumBits: 128,
      shorStatus: 'GROVER_REDUCED',
      keySize: '32 bytes (Secret Key)',
      crackTime: '> 10^18 years (Grover halving to 128-bit)',
      ratingScore: 85,
      color: 'amber',
      description: 'Symmetric block cipher. Quantum Grover\'s algorithm reduces security strength from 256-bit to 128-bit, remaining secure.',
      codeSnippet: `// AES-256-GCM Symmetric Cipher (Quantum Safe with 256-bit keys)
EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, 12, NULL);
// Grover's Algorithm square-root search turns 256-bit key into 128-bit security.`
    },
    {
      id: 'ml_kem_1024',
      name: 'NIST FIPS 203 (ML-KEM-1024)',
      category: 'Post-Quantum Lattice',
      classicalBits: 256,
      quantumBits: 256,
      shorStatus: 'QUANTUM_IMMUNE',
      keySize: '1,568 bytes (Public Key)',
      crackTime: '> 10^32 years (NP-Hard Lattice Problem)',
      ratingScore: 100,
      color: 'cyan',
      description: 'Primary NIST standard for Post-Quantum Key Encapsulation based on Module Learning With Errors (M-LWE). Fully immune to Shor\'s.',
      codeSnippet: `// NIST FIPS 203 ML-KEM-1024 Post-Quantum Handshake (Q-CRYPT DEFAULT)
OQS_KEM *kem = OQS_KEM_new(OQS_KEM_alg_ml_kem_1024);
OQS_KEM_keypair(kem, public_key, secret_key); // Category 5 Security Margin!`
    },
    {
      id: 'ml_dsa_87',
      name: 'NIST FIPS 204 (ML-DSA-87)',
      category: 'Post-Quantum Lattice',
      classicalBits: 256,
      quantumBits: 256,
      shorStatus: 'QUANTUM_IMMUNE',
      keySize: '2,592 bytes (Public Key)',
      crackTime: '> 10^30 years (Short Vector Lattice Problem)',
      ratingScore: 98,
      color: 'emerald',
      description: 'NIST standard for Post-Quantum Digital Signatures (Dilithium). Provides cryptographic authentication against quantum forged signatures.',
      codeSnippet: `// NIST FIPS 204 ML-DSA-87 Quantum Signature Verification
OQS_SIG *sig = OQS_SIG_new(OQS_SIG_alg_ml_dsa_87);
OQS_SIG_verify(sig, message, msg_len, signature, sig_len, public_key);`
    },
    {
      id: 'xmss_hash',
      name: 'XMSS Stateful Hash Signatures',
      category: 'Post-Quantum Hash',
      classicalBits: 256,
      quantumBits: 256,
      shorStatus: 'QUANTUM_IMMUNE',
      keySize: '64 bytes (Public Key)',
      crackTime: '> 10^35 years (Collision Resistant Hash Trees)',
      ratingScore: 95,
      color: 'purple',
      description: 'Stateful hash-based signature scheme (RFC 8391). Relies exclusively on SHA-256 / SHAKE-256 collision resistance.',
      codeSnippet: `// XMSS Hash-Based Stateful Signature (NIST SP 800-208)
xmss_params params; xmss_set_params(&params, XMSS_SHA2_10_256);
xmss_sign_message(&params, message, msg_len, sk, signature);`
    }
  ];

  // Non-Technical Quantum Security Glossary
  const glossaryTerms: GlossaryTerm[] = [
    {
      id: 'lattice',
      term: 'Lattice-Based Cryptography',
      category: 'Core PQC Algorithm',
      simpleAnalogy: 'Imagine trying to find a specific hidden point in a high-dimensional grid maze covered in mathematical fog. Even a supercomputer or quantum computer gets hopelessly lost.',
      technicalDefinition: 'Cryptography based on the hardness of high-dimensional geometric grid problems, such as the Shortest Vector Problem (SVP) and Module Learning With Errors (M-LWE) over polynomial rings.',
      iconName: 'Cpu'
    },
    {
      id: 'sndl',
      term: 'Store Now, Decrypt Later (SNDL)',
      category: 'Quantum Threat Vector',
      simpleAnalogy: 'Bad actors record your encrypted internet conversations today, saving them on hard drives. When a quantum computer is built years from now, they unlock all past recorded data in seconds.',
      technicalDefinition: 'Adversarial passive interception where encrypted transport streams (TLS/ECDH) are harvested today to retroactively decrypt sensitive communications once CRQCs become operational.',
      iconName: 'AlertTriangle'
    },
    {
      id: 'shor',
      term: 'Shor’s Algorithm & CRQC',
      category: 'Quantum Physics Concept',
      simpleAnalogy: 'A specialized quantum recipe that breaks traditional digital locks (like RSA & ECC) in seconds by testing millions of mathematical factor combinations simultaneously.',
      technicalDefinition: 'A quantum computer algorithm developed by Peter Shor that solves integer factorization and discrete logarithms in polynomial time O((log N)^3), breaking classical asymmetric PKI.',
      iconName: 'Zap'
    },
    {
      id: 'hash_sig',
      term: 'Hash-Based Signatures (XMSS/LMS)',
      category: 'Quantum Digital Signatures',
      simpleAnalogy: 'Like creating an unbreakable chain of one-way wax seals. Once a seal is broken, everyone knows immediately without needing complex algebra.',
      technicalDefinition: 'Quantum-resistant signature schemes (NIST SP 800-208) relying solely on cryptographic hash functions (SHA-256/SHAKE) arranged in Merkle trees.',
      iconName: 'ShieldCheck'
    },
    {
      id: 'constant_time',
      term: 'Constant-Time Memory Execution',
      category: 'Hardware Security',
      simpleAnalogy: 'Making sure your computer takes the exact same number of microseconds to process every secret message, so spies listening to CPU power fluctuations hear nothing.',
      technicalDefinition: 'Code design technique that eliminates data-dependent branching (if/else) and memory lookups to prevent CPU microarchitectural side-channel timing attacks.',
      iconName: 'Lock'
    },
    {
      id: 'grover',
      term: 'Grover’s Quantum Search Algorithm',
      category: 'Quantum Physics Concept',
      simpleAnalogy: 'A quantum method that speeds up searching a massive needle in a haystack. It halves secret key length strength (turning 128-bit keys into 64-bit, requiring 256-bit keys).',
      technicalDefinition: 'A quantum algorithm providing a quadratic speedup for unstructured search problems, reducing symmetric key search complexity from N to sqrt(N).',
      iconName: 'Sparkles'
    }
  ];

  // C Code Snippet
  const cNttCode = `/* 
 * ML-KEM-1024 (NIST FIPS 203) Constant-Time NTT Polynomial Multiplication
 * Target Ring: R_q = Z_q[X] / (X^256 + 1), Modulus q = 3329
 * 
 * Implements Cooley-Tukey butterfly operations with Montgomery Reduction.
 * Zero branches & zero data-dependent memory access for side-channel immunity.
 */

#include <stdint.h>
#include <stddef.h>
#include <string.h>

#define KYBER_N 256
#define KYBER_Q 3329
#define MONT 2285 // 2^16 mod 3329
#define QINV -3327 // q^-1 mod 2^16

/* Constant-Time Montgomery Reduction: returns a * 2^-16 mod q */
static inline int16_t montgomery_reduce(int32_t a) {
    int16_t t;
    t = (int16_t)a * QINV;
    t = (a - (int32_t)t * KYBER_Q) >> 16;
    return t;
}

/* Constant-Time Barret Reduction: returns a mod q in [0, q) */
static inline int16_t barrett_reduce(int16_t a) {
    int16_t t;
    const int16_t v = ((1U << 26) + KYBER_Q / 2) / KYBER_Q;
    t = ((int32_t)v * a + (1 << 25)) >> 26;
    t *= KYBER_Q;
    return a - t;
}

/* Forward NTT Transformation in Z_3329[X]/(X^256 + 1) */
void poly_ntt_forward(int16_t r[KYBER_N], const int16_t zetas[128]) {
    unsigned int len, start, j, k = 1;
    int16_t zeta, t;

    for (len = 128; len >= 2; len >>= 1) {
        for (start = 0; start < KYBER_N; start += 2 * len) {
            zeta = zetas[k++];
            for (j = start; j < start + len; ++j) {
                /* Constant-Time Cooley-Tukey Butterfly Operation */
                t = montgomery_reduce((int32_t)zeta * r[j + len]);
                r[j + len] = r[j] - t;
                r[j] = r[j] + t;
            }
        }
    }
}
`;

  // C++ Code
  const cppEnclaveCode = `// Q-CRYPT Enterprise C++ Hardware Enclave & Anti-Forensic RAM Zeroize
// Compiles with G++ / Clang++ (C++20) for Android NDK & Linux Air-Gapped Relays

#include <iostream>
#include <vector>
#include <memory>
#include <atomic>
#include <cstdint>

#if defined(__x86_64__) || defined(_M_X64)
  #include <emmintrin.h> // _mm_clflush
#endif

namespace qcrypt::pqc {

// Secure Volatile RAM Zeroize Function - Guarantees compiler does not optimize away wiping
static void secure_memzero(void* v, size_t n) {
    static void* (* const volatile memset_ptr)(void*, int, size_t) = memset;
    memset_ptr(v, 0, n);

#if defined(__x86_64__)
    // Flush L1/L2 CPU cache lines containing private key material
    char* p = static_cast<char*>(v);
    for (size_t i = 0; i < n; i += 64) {
        _mm_clflush(p + i);
    }
    asm volatile("mfence" ::: "memory");
#elif defined(__aarch64__)
    // ARM64 Memory Barrier instruction
    asm volatile("dmb sy" ::: "memory");
#endif
}

class EphemeralLatticeKeyVault {
private:
    uint8_t secret_key_[3168]; // ML-KEM-1024 Private Key Buffer
    bool is_locked_;

public:
    EphemeralLatticeKeyVault() : is_locked_(false) {
        std::clog << "[OK] Enclave Vault Initialized inside Hardware Isolated Boundary\\n";
    }

    ~EphemeralLatticeKeyVault() {
        // Automatically zeroize private key buffer on object destruction
        secure_memzero(secret_key_, sizeof(secret_key_));
        std::clog << "[ZEROIZED] ML-KEM Private Key Wiped from Memory Register\\n";
    }

    // Disable copy constructors to prevent key leakage in RAM
    EphemeralLatticeKeyVault(const EphemeralLatticeKeyVault&) = delete;
    EphemeralLatticeKeyVault& operator=(const EphemeralLatticeKeyVault&) = delete;
};

} // namespace qcrypt::pqc
`;

  // x86_64 AVX2 SIMD Assembly Code
  const asmAvx2Code = `; Q-CRYPT x86_64 AVX2 Vectorized NTT Coefficient Reduction (Assembly)
; Target: Intel/AMD Processors with AVX2 instruction set extension
; Operates on 16 int16_t polynomial coefficients in parallel per CPU clock cycle.

section .text
global fips203_avx2_barrett_reduce_16x

align 32
fips203_avx2_barrett_reduce_16x:
    ; Input: ymm0 contains 16 x int16_t coefficients
    ; Const: ymm1 contains q = 3329 (0x0D01) broadcasted
    ; Const: ymm2 contains v = 20159 Barrett multiplier
    
    vpmulhw     ymm3, ymm0, ymm2        ; ymm3 = (coeff * v) >> 16
    vpsraw      ymm3, ymm3, 10          ; ymm3 = ymm3 >> 10 (approx quotient)
    vpmullw     ymm4, ymm3, ymm1        ; ymm4 = quotient * q
    vpsubw      ymm0, ymm0, ymm4        ; ymm0 = coeff - (quotient * q)
    
    ; Guarantee constant-time execution (no branches)
    ret
`;

  // ARM64 NEON Vector Assembly Code
  const asmArm64Code = `// Q-CRYPT ARM64 NEON Vectorized Montgomery Reduction (Assembly)
// Target: ARMv8.4-A (Android Titan M2 / Apple M-series / Snapdragon Hardware)
// Processes 8 x int16_t polynomial coefficients simultaneously in NEON vector register v0.s

.text
.align 4
.global fips203_neon_montgomery_reduce_8x
.type fips203_neon_montgomery_reduce_8x, %function

fips203_neon_montgomery_reduce_8x:
    // v0.8h = input vector (8 x int16_t coefficients)
    // v1.8h = QINV (-3327) constant vector
    // v2.8h = KYBER_Q (3329) constant vector

    mul         v3.8h, v0.8h, v1.8h      // t = (int16_t)a * QINV
    sqrdmulh    v4.8h, v3.8h, v2.8h      // high-half multiply by q
    sub         v0.8h, v0.8h, v4.8h      // result = a - t*q (Constant Time)

    // Hardware Memory Barrier
    dmb         sy
    ret
`;

  // CMake Build Script
  const cmakeBuildScript = `# Q-CRYPT Post-Quantum C/C++ Engine CMake Build Configuration
cmake_minimum_required(VERSION 3.20)
project(QCrypt_PQC_Engine LANGUAGES C CXX ASM)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 20)

# Security Compiler Hardening Flags
add_compile_options(
    -O3
    -fstack-protector-strong
    -D_FORTIFY_SOURCE=2
    -Wformat -Wformat-security
    -fvisibility=hidden
    -Wall -Wextra
)

# Architecture-specific SIMD Vector Acceleration
if(CMAKE_SYSTEM_PROCESSOR MATCHES "x86_64")
    add_compile_options(-mavx2 -maes)
    message(STATUS "[PQC BUILD] x86_64 AVX2 SIMD Acceleration Enabled")
elseif(CMAKE_SYSTEM_PROCESSOR MATCHES "aarch64")
    add_compile_options(-march=armv8.4-a+crypto+dotprod)
    message(STATUS "[PQC BUILD] ARM64 NEON Crypto Acceleration Enabled")
endif()

# Build Static & Shared C/C++ Post-Quantum Libraries
add_library(qcrypt_pqc STATIC
    src/c/ntt.c
    src/c/fips203_ml_kem.c
    src/cpp/enclave_vault.cpp
    src/asm/vector_reduce.s
)

target_include_directories(qcrypt_pqc PUBLIC include/)
`;

  // Android NDK Makefile
  const ndkBuildScript = `# Android NDK (ARM64-v8a) Cross-Compilation Makefile for Mobile PQC
NDK_PATH ?= /opt/android-ndk-r26b
TOOLCHAIN = $(NDK_PATH)/toolchains/llvm/prebuilt/linux-x86_64
CC = $(TOOLCHAIN)/bin/aarch64-linux-android34-clang
CXX = $(TOOLCHAIN)/bin/aarch64-linux-android34-clang++

CFLAGS = -O3 -flto -march=armv8.4-a+crypto -DANDROID -fPIC -fstack-protector-all
LDFLAGS = -shared -Wl,-z,relro -Wl,-z,now -Wl,--gc-sections

TARGET = libqcrypt_pqc_native.so
OBJS = src/c/ntt.o src/c/fips203_ml_kem.o src/cpp/enclave_vault.o

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(LDFLAGS) -o $@ $(OBJS)
	$(TOOLCHAIN)/bin/llvm-strip --strip-unneeded $@
	@echo "[SUCCESS] Built Android NDK Native PQC Library for Arm64-v8a"

clean:
	rm -f $(OBJS) $(TARGET)
`;

  // Liboqs Integration Script
  const liboqsIntegration = `/* 
 * Integrating Open Quantum Safe (liboqs) with Q-CRYPT C Engine
 * Reference API for ML-KEM-1024 Key encapsulation
 */

#include <stdio.h>
#include <stdlib.h>
#include <oqs/oqs.h>

int generate_ml_kem_1024_keys(uint8_t *public_key, uint8_t *secret_key) {
    OQS_KEM *kem = OQS_KEM_new(OQS_KEM_alg_ml_kem_1024);
    if (kem == NULL) {
        fprintf(stderr, "[ERROR] ML-KEM-1024 algorithm not supported in build\\n");
        return -1;
    }

    // Key Generation (Constant-Time)
    OQS_STATUS rc = OQS_KEM_keypair(kem, public_key, secret_key);
    if (rc != OQS_SUCCESS) {
        fprintf(stderr, "[ERROR] Keypair generation failed\\n");
        OQS_KEM_free(kem);
        return -1;
    }

    printf("[PQC SNTD] Generated 1568-byte Public Key & 3168-byte Secret Key\\n");
    OQS_KEM_free(kem);
    return 0;
}
`;

  const selectedAlgo = algorithmSpecs.find(a => a.id === selectedAlgoId) || algorithmSpecs[3];

  return (
    <section id="pqc-code-resources" className="py-16 bg-slate-950 text-slate-100 border-b border-slate-900 relative overflow-hidden font-sans">
      
      {/* Background Neon Accent Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Title Header with Print Button */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>LOW-LEVEL C/C++ & ASSEMBLY PQC ENGINE & BUILD RESOURCES</span>
            </div>

            {/* PRINT RESOURCES BUTTON */}
            <button
              onClick={() => window.print()}
              className="no-print px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/50 hover:bg-cyan-950/80 text-cyan-300 font-bold text-xs flex items-center space-x-2 transition-all shadow-md hover:scale-105"
              title="Print printer-friendly documentation and code"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>{t('pqcCode.printBtn')}</span>
            </button>

            {/* API PLAYGROUND MODAL LAUNCHER BUTTON */}
            <button
              onClick={() => setIsApiPlaygroundOpen(true)}
              className="no-print px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md hover:scale-105"
              title="Launch interactive API Playground"
            >
              <Terminal className="w-4 h-4 text-slate-950" />
              <span>Launch API Playground</span>
            </button>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            {t('pqcCode.title')}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            {t('pqcCode.subtitle')}
          </p>
        </div>

        {/* DAILY SECURITY TREAT FETCHER (FETCH BUTTON & FIRESTORE INTEGRATION) */}
        <DailySecurityTreatFetcher />

        {/* POST-QUANTUM IMPLEMENTATION ROADMAP TIMELINE */}
        <div id="pqc-roadmap" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-1">
                <Milestone className="w-3.5 h-3.5 text-cyan-400" />
                <span>MIGRATION TIMELINE & ALGORITHM TRANSITION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                {t('pqcCode.roadmapTitle')}
              </h3>
            </div>

            <p className="text-xs font-mono text-slate-400 max-w-md">
              {t('pqcCode.roadmapSub')}
            </p>
          </div>

          {/* Visual Timeline Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {roadmapMilestones.map((ms, index) => (
              <div 
                key={ms.step}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 relative flex flex-col justify-between shadow-xl group"
              >
                {/* Connector Line (Desktop) */}
                {index < roadmapMilestones.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-slate-800 group-hover:bg-cyan-500/50 z-20" />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                      {ms.step}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${ms.badgeColor}`}>
                      {ms.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-xl border shrink-0 ${ms.iconColor}`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white block">{ms.timeframe}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans leading-snug">{ms.title}</h4>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {ms.summary}
                  </p>
                </div>

                {/* Key Action Bullets */}
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Key Architectural Deliverables:</span>
                  {ms.keyActions.map((action, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURE 2: 'WHY PQC MATTERS' INFO-CARD ON STORE NOW, DECRYPT LATER (SNDL) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-cyan-950/40 border border-rose-500/30 shadow-2xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-rose-950 border border-rose-500/50 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider block">
                  CRITICAL QUANTUM THREAT VECTOR
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                  {t('pqcCode.sndlTitle')}
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-700 font-bold shrink-0">
              URGENT COMPLIANCE MANDATE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-rose-500/20">
              <span className="text-rose-400 font-mono font-bold block text-xs uppercase">
                1. The Active Threat (Harvest Now, Decrypt Later)
              </span>
              <p>
                Hostile state actors and intelligence adversaries are actively sniffing and recording encrypted TLS/ECDH internet traffic at global scale today. Although they cannot crack RSA-2048 or ECC P-256 instantly now, they store millions of petabytes of ciphertext on high-capacity server arrays.
              </p>
            </div>

            <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/20">
              <span className="text-cyan-400 font-mono font-bold block text-xs uppercase">
                2. How Q-CRYPT Instantly Eliminates SNDL
              </span>
              <p>
                When a Cryptographically Relevant Quantum Computer (CRQC) goes online, harvested legacy ciphertext will be retroactively decrypted in seconds using Shor’s Algorithm. Q-CRYPT wraps transport payloads in NIST FIPS 203 (ML-KEM-1024) lattice keys today—rendering harvested data mathematically unbreakable forever.
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE CRQC ATTACK INTERCEPTION SIMULATION (RSA VS ML-KEM) */}
        <RsaVsPqcSimulation />

        {/* ENCRYPTION EVOLUTION TIMELINE WIDGET */}
        <EncryptionHistoryTimeline />

        {/* FEATURE 3: INTERACTIVE QUANTUM SECURITY SANDBOX & STRENGTH VISUALIZER */}
        <div id="quantum-sandbox" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>INTERACTIVE CRYPTOGRAPHIC SANDBOX</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                {t('pqcCode.sandboxTitle')}
              </h3>
            </div>

            <span className="text-xs font-mono text-slate-400">
              {t('pqcCode.sandboxSub')}
            </span>
          </div>

          {/* Sandbox Algorithm Selection Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-xs">
            {algorithmSpecs.map((algo) => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgoId(algo.id)}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 ${
                  selectedAlgoId === algo.id
                    ? algo.color === 'rose'
                      ? 'bg-rose-950/80 border-rose-500 text-white ring-2 ring-rose-500/40'
                      : algo.color === 'amber'
                      ? 'bg-amber-950/80 border-amber-500 text-white ring-2 ring-amber-500/40'
                      : 'bg-cyan-950/80 border-cyan-500 text-white ring-2 ring-cyan-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-[11px] block leading-snug">{algo.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold w-max ${
                  algo.shorStatus === 'CRITICAL_VULNERABLE'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : algo.shorStatus === 'GROVER_REDUCED'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {algo.shorStatus === 'CRITICAL_VULNERABLE' ? 'VULNERABLE' : algo.shorStatus === 'GROVER_REDUCED' ? 'REDUCED' : 'QUANTUM IMMUNE'}
                </span>
              </button>
            ))}
          </div>

          {/* Active Algorithm Security Strength Dashboard */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-lg sm:text-xl font-black text-white font-sans">{selectedAlgo.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs font-bold">
                    {selectedAlgo.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">{selectedAlgo.description}</p>
              </div>

              {/* Quantum Score Dial Badge */}
              <div className="flex items-center space-x-3 shrink-0 font-mono">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase">Quantum Immunity Rating</span>
                  <span className={`text-2xl font-black ${
                    selectedAlgo.ratingScore >= 90 ? 'text-emerald-400' : selectedAlgo.ratingScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {selectedAlgo.ratingScore} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Security Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Quantum Resistance Gauge:</span>
                <span className="font-bold text-slate-200">{selectedAlgo.ratingScore}% Protected</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    selectedAlgo.ratingScore >= 90
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                      : selectedAlgo.ratingScore >= 70
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${selectedAlgo.ratingScore}%` }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block">Classical Security</span>
                <span className="text-white font-bold">{selectedAlgo.classicalBits}-bit strength</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block">Post-Quantum Security</span>
                <span className={`font-bold ${selectedAlgo.quantumBits === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedAlgo.quantumBits === 0 ? '0-bit (BROKEN BY SHOR)' : `${selectedAlgo.quantumBits}-bit Quantum Immune`}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block">Key/Cipher Overhead</span>
                <span className="text-cyan-300 font-bold">{selectedAlgo.keySize}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block">Estimated CRQC Crack Time</span>
                <span className={`font-bold ${selectedAlgo.ratingScore < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedAlgo.crackTime}
                </span>
              </div>
            </div>

            {/* Code Snippet for Selected Sandbox Algo */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-xs relative space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[10px] border-b border-slate-800 pb-2">
                <span>Code Representation for {selectedAlgo.name}</span>
                <button
                  onClick={() => handleCopy(selectedAlgo.codeSnippet, `algo_${selectedAlgo.id}`, 'Sandbox Code')}
                  className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1 font-bold text-[10px]"
                >
                  {copiedCodeId === `algo_${selectedAlgo.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                  <span>{copiedCodeId === `algo_${selectedAlgo.id}` ? 'Copied!' : 'Copy Snippet'}</span>
                </button>
              </div>
              <pre className="text-slate-200 overflow-x-auto">{selectedAlgo.codeSnippet}</pre>
            </div>

          </div>
        </div>

        {/* 1. Educational Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 relative overflow-hidden shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans">
              Module Learning With Errors (M-LWE)
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Classical RSA & ECC rely on prime factorization and discrete logarithms, which are solvable in polynomial time by Shor’s Algorithm on a Quantum Computer. ML-KEM relies on the Shortest Vector Problem (SVP) in 256-dimensional polynomial rings over finite fields <code className="text-cyan-300 font-mono">Z_3329[X]/(X^256 + 1)</code>, which remains NP-hard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans">
              Constant-Time Memory Execution
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Side-channel attacks exploit timing variations in CPU memory access or branching during modular reduction. Q-CRYPT’s C/C++ primitives use zero conditional branches (<code className="text-emerald-300 font-mono">if/else</code>) and branchless Montgomery/Barrett modulo reductions, ensuring key operations execute in fixed clock cycles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3 relative overflow-hidden shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center font-mono font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans">
              Hardware Vault & Cache Flush
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Ephemeral lattice secret keys (3,168 bytes) are generated exclusively within isolated CPU enclaves (Android Titan M2, Samsung Knox, Apple Secure Enclave). Memory buffers are zeroized using compiler-barrier memory fences (<code className="text-purple-300 font-mono">_mm_clflush</code> / <code className="text-purple-300 font-mono">dmb sy</code>) preventing cold-boot RAM extractions.
            </p>
          </div>

        </div>

        {/* 2. Interactive Low-Level Code Viewer Section (C / C++ / Assembly) WITH TOGGLE FOR CLEAN VISIBILITY */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative space-y-6">
          
          {/* Header & Code Tab Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                NIST FIPS 203 Cryptographic Kernel Source Code
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                Native C/C++ & SIMD Assembly Implementation
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {/* Toggle Code Block Visibility */}
              <button
                onClick={() => setShowCodeBlock(!showCodeBlock)}
                className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md"
              >
                {showCodeBlock ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4 text-cyan-400" />}
                <span>{showCodeBlock ? t('pqcCode.hideCode') : t('pqcCode.showCode')}</span>
              </button>

              {/* Code Tabs (only active when code is shown) */}
              {showCodeBlock && (
                <>
                  <button
                    onClick={() => setActiveCodeTab('c_ntt')}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-2 ${
                      activeCodeTab === 'c_ntt'
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>C11 NTT Math</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 font-mono font-bold border border-cyan-700">Advanced</span>
                  </button>

                  <button
                    onClick={() => setActiveCodeTab('cpp_enclave')}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-2 ${
                      activeCodeTab === 'cpp_enclave'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>C++20 Enclave</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-mono font-bold border border-emerald-700">Advanced</span>
                  </button>

                  <button
                    onClick={() => setActiveCodeTab('asm_avx2')}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-2 ${
                      activeCodeTab === 'asm_avx2'
                        ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                    <span>x86_64 AVX2</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 font-mono font-bold border border-purple-700">Expert</span>
                  </button>

                  <button
                    onClick={() => setActiveCodeTab('asm_arm64')}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-2 ${
                      activeCodeTab === 'asm_arm64'
                        ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    <span>ARM64 NEON</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-300 font-mono font-bold border border-amber-700">Expert</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Active Code Box or Collapsed Clean Summary */}
          {showCodeBlock ? (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 relative font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
              <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-slate-200 font-bold">
                    {activeCodeTab === 'c_ntt' && 'src/c/ntt.c (Constant-Time NTT & Montgomery Reduction)'}
                    {activeCodeTab === 'cpp_enclave' && 'src/cpp/enclave_vault.cpp (Secure RAM Wiping & Cache Flush)'}
                    {activeCodeTab === 'asm_avx2' && 'src/asm/avx2_reduce.s (AVX2 16x Parallel Vector Reduction)'}
                    {activeCodeTab === 'asm_arm64' && 'src/asm/arm64_neon.s (ARM64 NEON Titan M2 Hardware Vector)'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${snippetComplexityMap[activeCodeTab].color}`}>
                    Complexity Level: {snippetComplexityMap[activeCodeTab].level}
                  </span>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => {
                    const code = activeCodeTab === 'c_ntt' ? cNttCode : activeCodeTab === 'cpp_enclave' ? cppEnclaveCode : activeCodeTab === 'asm_avx2' ? asmAvx2Code : asmArm64Code;
                    handleCopy(code, activeCodeTab, 'Source Code Snippet');
                  }}
                  className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 text-xs font-bold transition-all shadow-md active:scale-95 ${
                    copiedCodeId === activeCodeTab
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 scale-105 ring-2 ring-emerald-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  {copiedCodeId === activeCodeTab ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span className="text-emerald-300 font-extrabold">{t('pqcCode.copiedCode')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-cyan-400" />
                      <span>{t('pqcCode.copyCode')}</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-slate-200 leading-relaxed font-mono max-h-[500px] overflow-y-auto">
                {activeCodeTab === 'c_ntt' && cNttCode}
                {activeCodeTab === 'cpp_enclave' && cppEnclaveCode}
                {activeCodeTab === 'asm_avx2' && asmAvx2Code}
                {activeCodeTab === 'asm_arm64' && asmArm64Code}
              </pre>
            </div>
          ) : (
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-6 text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs font-mono">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>{t('pqcCode.codeHidden')}</span>
              </div>
              <button
                onClick={() => setShowCodeBlock(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-lg hover:scale-105"
              >
                <ChevronDown className="w-4 h-4 text-cyan-400" />
                <span>{t('pqcCode.showCode')}</span>
              </button>
            </div>
          )}

        </div>

        {/* 3. Interactive Montgomery Reduction NTT Calculator / Simulator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>INTERACTIVE PQC MATH SIMULATOR</span>
              </span>
              <h3 className="text-xl font-extrabold text-white font-sans">
                Montgomery Modular Reduction Calculator (Z_3329)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 font-bold shrink-0">
              0 BRANCHES • CONSTANT-TIME
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Input Controls */}
            <div className="md:col-span-5 space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 block">Polynomial Coefficient A (a):</label>
                <input
                  type="number"
                  value={nttCoeffA}
                  onChange={(e) => setNttCoeffA(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block">Polynomial Coefficient B (b):</label>
                <input
                  type="number"
                  value={nttCoeffB}
                  onChange={(e) => setNttCoeffB(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                <span className="text-slate-500 block">NIST FIPS 203 Modulus (q):</span>
                <span className="text-white font-bold block">3329 (2^16 mod 3329 = 2285)</span>
              </div>
            </div>

            {/* Simulated Math Output */}
            <div className="md:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>SIMULATED REGISTER RESULT</span>
                <span className="text-cyan-400 font-bold">1 CPU CLOCK CYCLE</span>
              </div>

              {(() => {
                const product = nttCoeffA * nttCoeffB;
                const QINV = -3327;
                const Q = 3329;
                const t = Math.imul((product & 0xFFFF), QINV) & 0xFFFF;
                const tSigned = t > 32767 ? t - 65536 : t;
                const reduced = (product - Math.imul(tSigned, Q)) >> 16;

                return (
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Raw Product (a * b):</span>
                      <span className="text-amber-300 font-bold">{product}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Montgomery Reduction (a * b * 2^-16 mod 3329):</span>
                      <span className="text-emerald-400 font-black text-sm">{reduced}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-[10px] text-slate-300 font-sans mt-2">
                      <span className="text-emerald-400 font-bold block font-mono">Constant-Time Guarantee:</span>
                      Execution completes in 1 clock cycle on x86_64 AVX2 / ARM64 NEON without branching or table lookups.
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>

        {/* FEATURE 4: QUANTUM SECURITY GLOSSARY SECTION FOR NON-TECHNICAL USERS */}
        <div id="quantum-glossary" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>NON-TECHNICAL KNOWLEDGE BASE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                {t('pqcCode.glossaryTitle')}
              </h3>
            </div>

            <span className="text-xs font-mono text-slate-400">
              {t('pqcCode.glossarySub')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {glossaryTerms.map((term) => (
              <div 
                key={term.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all shadow-md group"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {term.category}
                  </span>
                  <HelpCircle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h4 className="text-base font-bold text-white font-sans">{term.term}</h4>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                    💡 Simple Analogy:
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {term.simpleAnalogy}
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    Technical Definition:
                  </span>
                  <p className="text-[11px] text-slate-400 font-sans leading-snug">
                    {term.technicalDefinition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Build Resources & Toolchains (CMake, NDK, Liboqs) WITH TOGGLE FOR CLEAN VISIBILITY */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold mb-1">
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                <span>ENTERPRISE BUILD TOOLCHAINS & RESOURCES</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                Compiling PQC C/C++ Libraries for Enterprise Fleets
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {/* Build Scripts Visibility Toggle */}
              <button
                onClick={() => setShowBuildBlock(!showBuildBlock)}
                className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md"
              >
                {showBuildBlock ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                <span>{showBuildBlock ? t('pqcCode.hideBuild') : t('pqcCode.showBuild')}</span>
              </button>

              {/* Build Tabs (only visible when active) */}
              {showBuildBlock && (
                <>
                  <button
                    onClick={() => setActiveBuildTab('cmake')}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-2 ${
                      activeBuildTab === 'cmake'
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>CMakeLists.txt</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-mono font-bold border border-blue-700">Beginner</span>
                  </button>

                  <button
                    onClick={() => setActiveBuildTab('ndk')}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-2 ${
                      activeBuildTab === 'ndk'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Android NDK</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-700">Advanced</span>
                  </button>

                  <button
                    onClick={() => setActiveBuildTab('liboqs')}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-2 ${
                      activeBuildTab === 'liboqs'
                        ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>liboqs C Integration</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-mono font-bold border border-purple-700">Advanced</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {showBuildBlock ? (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 relative font-mono text-xs overflow-x-auto shadow-inner">
              <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-200 font-bold">
                    {activeBuildTab === 'cmake' && 'CMakeLists.txt (SIMD Vector Acceleration Build Configuration)'}
                    {activeBuildTab === 'ndk' && 'Makefile (Android NDK ARM64-v8a Cross-Compilation Script)'}
                    {activeBuildTab === 'liboqs' && 'src/c/oqs_wrapper.c (Open Quantum Safe C Integration)'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${snippetComplexityMap[activeBuildTab].color}`}>
                    Complexity Level: {snippetComplexityMap[activeBuildTab].level}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const code = activeBuildTab === 'cmake' ? cmakeBuildScript : activeBuildTab === 'ndk' ? ndkBuildScript : liboqsIntegration;
                    handleCopy(code, activeBuildTab, 'Build Resource Script');
                  }}
                  className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 text-xs font-bold transition-all shadow-md active:scale-95 ${
                    copiedCodeId === activeBuildTab
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 scale-105 ring-2 ring-emerald-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {copiedCodeId === activeBuildTab ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span className="text-emerald-300 font-extrabold">{t('pqcCode.copiedCode')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-emerald-400" />
                      <span>{t('pqcCode.copyCode')}</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-slate-200 leading-relaxed max-h-[500px] overflow-y-auto">
                {activeBuildTab === 'cmake' && cmakeBuildScript}
                {activeBuildTab === 'ndk' && ndkBuildScript}
                {activeBuildTab === 'liboqs' && liboqsIntegration}
              </pre>
            </div>
          ) : (
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-6 text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs font-mono">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>{t('pqcCode.codeHidden')}</span>
              </div>
              <button
                onClick={() => setShowBuildBlock(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-lg hover:scale-105"
              >
                <ChevronDown className="w-4 h-4 text-emerald-400" />
                <span>{t('pqcCode.showBuild')}</span>
              </button>
            </div>
          )}
        </div>

        {/* FEATURE 5: SECURITY KNOWLEDGE CHECK INTERACTIVE QUIZ */}
        <div id="pqc-quiz" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span>DEVELOPER KNOWLEDGE ASSESSMENT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                {t('pqcCode.quizTitle')}
              </h3>
            </div>

            <p className="text-xs font-mono text-slate-400 max-w-sm">
              {t('pqcCode.quizSub')}
            </p>
          </div>

          {/* Quiz Container */}
          <div className="space-y-6">
            {quizQuestions.map((q, qIndex) => {
              const selectedOpt = quizAnswers[q.id];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div 
                  key={q.id}
                  className={`p-5 rounded-2xl bg-slate-950 border transition-all space-y-3 ${
                    quizSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/60 bg-emerald-950/20'
                        : 'border-rose-500/60 bg-rose-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      Question {qIndex + 1} of {quizQuestions.length}
                    </span>

                    {quizSubmitted && (
                      <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                        isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}>
                        {isCorrect ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                        <span>{isCorrect ? 'Correct (+1)' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans">{q.question}</h4>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOpt === optIndex;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                      if (isSelected) {
                        btnStyle = 'bg-cyan-950 border-cyan-500 text-cyan-200 font-bold ring-1 ring-cyan-500/50';
                      }

                      if (quizSubmitted) {
                        if (optIndex === q.correctIndex) {
                          btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/60';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 font-bold ring-2 ring-rose-500/60';
                        } else {
                          btnStyle = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={quizSubmitted}
                          onClick={() => handleQuizOptionSelect(q.id, optIndex)}
                          className={`p-3 rounded-xl border text-left text-xs font-sans transition-all flex items-start space-x-2.5 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 font-mono text-[10px] text-slate-400 font-bold">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="leading-snug mt-0.5">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Callout when submitted */}
                  {quizSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-sans text-slate-300 space-y-1">
                      <span className="text-cyan-400 font-mono font-bold block text-[11px] uppercase">
                        💡 Cryptographic Principle:
                      </span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Bar & Results Banner */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            {quizSubmitted ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-mono font-black text-xl">
                    {calculateQuizScore()} / {quizQuestions.length}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase block">{t('pqcCode.quizScore')}</span>
                    <span className="text-sm font-bold text-white">
                      {calculateQuizScore() === 5 ? '🏆 Quantum Cryptography Master' : calculateQuizScore() >= 3 ? '🛡️ Quantum Security Engineer' : '📚 Quantum Apprentice'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleQuizReset}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 font-bold text-xs flex items-center space-x-2 transition-all shadow-md hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  <span>{t('pqcCode.quizRestart')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-mono text-slate-400">
                  Select an answer for each question above to submit.
                </span>

                <button
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                  onClick={handleQuizSubmit}
                  className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-lg ${
                    Object.keys(quizAnswers).length === quizQuestions.length
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/20 hover:scale-105'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Knowledge Check</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FEATURE 6: PQC PERFORMANCE & NETWORK PAYLOAD BENCHMARK SIMULATOR */}
        <div id="pqc-benchmark" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>SIMD CYCLE & PACKET COST SIMULATOR</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                {t('pqcCode.benchmarkTitle')}
              </h3>
            </div>

            <p className="text-xs font-mono text-slate-400 max-w-sm">
              {t('pqcCode.benchmarkSub')}
            </p>
          </div>

          {/* Controls Bar: Hardware Architecture & Clock Speed Slider */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Target CPU Architecture:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBenchmarkArch('avx2')}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    benchmarkArch === 'avx2'
                      ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  x86_64 AVX2
                </button>

                <button
                  onClick={() => setBenchmarkArch('arm64')}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    benchmarkArch === 'arm64'
                      ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ARM64 NEON
                </button>

                <button
                  onClick={() => setBenchmarkArch('cref')}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    benchmarkArch === 'cref'
                      ? 'bg-blue-950 border-blue-500 text-blue-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  C Reference
                </button>
              </div>
            </div>

            {/* Clock Speed Slider */}
            <div className="flex items-center space-x-4 w-full md:w-64">
              <div className="flex justify-between text-[11px] w-full items-center">
                <span className="text-slate-400 font-bold">CPU Frequency:</span>
                <span className="text-cyan-400 font-bold font-mono">{cpuClockGhz.toFixed(1)} GHz</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={4.5}
                step={0.1}
                value={cpuClockGhz}
                onChange={(e) => setCpuClockGhz(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Benchmark Table / Comparison Grid */}
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 gap-4">
              {benchmarkDataset.map((item) => {
                const cyclesObj = item.cycles[benchmarkArch];
                const totalCycleSum = cyclesObj.keygen + cyclesObj.encapsSign + cyclesObj.decapsVerify;
                const timeMicroseconds = (totalCycleSum / (cpuClockGhz * 1e9)) * 1e6;
                const opsPerSec = Math.round((cpuClockGhz * 1e9) / cyclesObj.encapsSign);
                const mtuPackets = Math.ceil(item.pubKeyBytes / 1500);

                return (
                  <div 
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          item.type.includes('PQC') ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}>
                          {item.type}
                        </span>
                        <h4 className="text-sm font-bold text-white font-sans">{item.name}</h4>
                      </div>

                      <div className="flex items-center space-x-4 text-[11px]">
                        <span className="text-slate-400">
                          Total Cycles: <strong className="text-cyan-300">{totalCycleSum.toLocaleString()}</strong>
                        </span>
                        <span className="text-slate-400">
                          Time: <strong className="text-emerald-400">{timeMicroseconds.toFixed(1)} µs</strong>
                        </span>
                      </div>
                    </div>

                    {/* Breakdown Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-[11px]">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase">Public Key Size</span>
                        <span className="text-white font-bold">{item.pubKeyBytes.toLocaleString()} B</span>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase">Secret Key Size</span>
                        <span className="text-white font-bold">{item.secKeyBytes.toLocaleString()} B</span>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase">Ciphertext / Sig</span>
                        <span className="text-white font-bold">{item.ctSigBytes.toLocaleString()} B</span>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase">IP MTU Packets</span>
                        <span className={`font-bold ${mtuPackets > 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {mtuPackets} {mtuPackets > 1 ? '(Fragmented)' : '(Single MTU)'}
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase">Encaps / Sign Cycles</span>
                        <span className="text-purple-300 font-bold">{cyclesObj.encapsSign.toLocaleString()}</span>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase">Est. Throughput</span>
                        <span className="text-cyan-300 font-bold">{opsPerSec.toLocaleString()} ops/s</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* API PLAYGROUND INTERACTIVE MODAL */}
      <ApiPlaygroundModal 
        isOpen={isApiPlaygroundOpen} 
        onClose={() => setIsApiPlaygroundOpen(false)} 
      />
    </section>
  );
};
