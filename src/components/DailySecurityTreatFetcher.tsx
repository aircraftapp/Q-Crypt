import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Bone, RefreshCw, Database, Award, Shield, Code2, Terminal } from 'lucide-react';
import { useToast } from './Toast';
import { useGoldenRetriever } from '../context/GoldenRetrieverContext';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export interface SecurityTreat {
  id?: string;
  title: string;
  badge: string;
  codeSnippet: string;
  funFact: string;
  category: string;
}

const INITIAL_SECURITY_TREATS: SecurityTreat[] = [
  {
    title: 'Kyber-1024 NTT Reduction Magic 🦴',
    badge: '🐾 PAWSOME PQC CODE',
    category: 'NIST FIPS 203',
    codeSnippet: `// Kyber-1024 Montgomery Butterfly
int16_t montgomery_reduce(int32_t a) {
  int16_t t = (int16_t)a * QINV;
  int16_t res = (a - (int32_t)t * KYBER_Q) >> 16;
  return res;
}`,
    funFact: 'Module-Lattice mathematics hides secret encryption keys in 256-dimensional polynomial noise vectors that confuse even 10,000-qubit quantum supercomputers! 🎾',
  },
  {
    title: 'Shor\'s Algorithm Vulnerability Check 🦴',
    badge: '🐾 QUANTUM THREAT FACT',
    category: 'Quantum Defense',
    codeSnippet: `// Verify Quantum Immunity
if (key_type == RSA_2048 || key_type == ECC_P256) {
  throw_quantum_vulnerability("Harvest-Now-Decrypt-Later Threat!");
} else if (key_type == ML_KEM_1024) {
  return IMMUNE_TO_SHORS_ALGORITHM;
}`,
    funFact: 'Shor\'s Algorithm easily breaks prime numbers and elliptic curves, but it gets completely stuck on lattice vectors because vector reduction is NP-hard! 🐕',
  },
  {
    title: 'Titan M2 Hardware Key Lockdown 🐾',
    badge: '🐾 HARDWARE VAULT TREAT',
    category: 'Hardware Enclave',
    codeSnippet: `// Zeroize RAM cache on Titan M2
void flush_hardware_enclave_keys(uint8_t *secret_key, size_t len) {
  explicit_bzero(secret_key, len);
  asm volatile("dmb sy" ::: "memory"); // Hardware memory barrier
}`,
    funFact: 'Your secret master keys stay locked inside physical smartphone hardware chips (Google Titan M2 / Knox). Even sneaky malware with root access cannot touch them! 🛡️',
  },
  {
    title: 'Zero-Knowledge Contact Lookup 🦴',
    badge: '🐾 PRIVACY TREAT',
    category: 'Zero-Knowledge PIR',
    codeSnippet: `// Private Information Retrieval (PIR)
Polynomial Query q = build_zk_pir_query(hashed_phone_number);
ServerResponse r = evaluate_pir_matrix(q, server_database);
uint8_t peer_key = extract_zk_result(r);`,
    funFact: 'Q-CRYPT connects you with friends without ever uploading your phone contact book to a central database server! Total zero-knowledge privacy! 🐶',
  },
  {
    title: 'Dilithium ML-DSA-87 Digital Signatures 🐾',
    badge: '🐾 FIPS 204 SIGNATURE',
    category: 'NIST FIPS 204',
    codeSnippet: `// ML-DSA-87 Unforgeable Identity Verification
int verify_pqc_signature(const uint8_t *msg, size_t msg_len,
                         const uint8_t *sig, const uint8_t *pk) {
  return poly_challenge_reject_sample(msg, sig, pk) == 0;
}`,
    funFact: 'NIST FIPS 204 ML-DSA-87 creates quantum-safe digital signatures that prove message authenticity with zero risk of forgery! 🦴',
  },
];

export const DailySecurityTreatFetcher: React.FC = () => {
  const { showToast } = useToast();
  const { isGoldenMode } = useGoldenRetriever();

  const [treats, setTreats] = useState<SecurityTreat[]>(INITIAL_SECURITY_TREATS);
  const [currentTreat, setCurrentTreat] = useState<SecurityTreat>(INITIAL_SECURITY_TREATS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFirestoreSynced, setIsFirestoreSynced] = useState<boolean>(false);

  // Attempt to fetch custom treats from Firestore collection 'daily_security_treats'
  const fetchFromFirestore = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'daily_security_treats'));
      if (!querySnapshot.empty) {
        const fetchedList: SecurityTreat[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedList.push({
            id: doc.id,
            title: data.title || 'Firestore PQC Security Treat 🦴',
            badge: data.badge || '🐾 FIRESTORE VERIFIED',
            category: data.category || 'PQC Firestore',
            codeSnippet: data.codeSnippet || '// PQC Code snippet from Firestore',
            funFact: data.funFact || 'Quantum-safe security fact stored in Firebase Firestore!',
          });
        });
        setTreats(fetchedList);
        // Pick a random treat
        const randomIndex = Math.floor(Math.random() * fetchedList.length);
        setCurrentTreat(fetchedList[randomIndex]);
        setIsFirestoreSynced(true);
        showToast(
          'Woof! 🐕 Fetched Daily Security Treat from Firestore!',
          `Database Treat: "${fetchedList[randomIndex].title}"`,
          'success'
        );
      } else {
        // Fallback to local built-in treats
        const randomIndex = Math.floor(Math.random() * INITIAL_SECURITY_TREATS.length);
        setCurrentTreat(INITIAL_SECURITY_TREATS[randomIndex]);
        showToast(
          'Fetch! 🐕 Daily Security Treat Ready!',
          `Fetched: "${INITIAL_SECURITY_TREATS[randomIndex].title}"`,
          'info'
        );
      }
    } catch (err) {
      console.warn('Firestore fetch fallback:', err);
      const randomIndex = Math.floor(Math.random() * INITIAL_SECURITY_TREATS.length);
      setCurrentTreat(INITIAL_SECURITY_TREATS[randomIndex]);
      showToast(
        'Fetch! 🐕 Local Security Treat Ready!',
        `Fetched: "${INITIAL_SECURITY_TREATS[randomIndex].title}"`,
        'info'
      );
    } finally {
      setLoading(false);
    }
  };

  // Seed / Add current treat to Firestore collection if requested
  const handleSaveTreatToFirestore = async () => {
    try {
      await addDoc(collection(db, 'daily_security_treats'), {
        title: currentTreat.title,
        badge: currentTreat.badge,
        category: currentTreat.category,
        codeSnippet: currentTreat.codeSnippet,
        funFact: currentTreat.funFact,
        createdAt: serverTimestamp(),
      });
      setIsFirestoreSynced(true);
      showToast(
        '🦴 Treat Saved to Firestore Database!',
        'Successfully added this Daily Security Treat to the Firebase collection `/daily_security_treats`!',
        'success'
      );
    } catch (err) {
      showToast('Error Saving Treat', String(err), 'error');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentTreat.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Copied Treat Code! 🦴', 'PQC code snippet copied to clipboard.', 'success');
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden my-8">
      {/* Background glow decorative circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & FETCH Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold">
            <Bone className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isGoldenMode ? 'DAILY SECURITY TREAT DISPENSER 🦴' : 'FIRESTORE DAILY SECURITY TREAT'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-sans flex items-center gap-2">
            <span>{isGoldenMode ? 'Fetch a Daily Security Treat! 🐕' : 'PQC Daily Code & Encryption Treat'}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              Firestore Synced
            </span>
          </h3>
          <p className="text-xs text-slate-300 font-sans">
            Click the <strong className="text-amber-400 font-mono">Fetch! 🐕</strong> button to pull a random PQC code snippet or quantum encryption fun fact from our Firestore collection.
          </p>
        </div>

        {/* PROMINENT FETCH BUTTON */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchFromFirestore}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-slate-950 font-black text-sm flex items-center space-x-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
            ) : (
              <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
            )}
            <span>{loading ? 'Sniffing Firestore...' : 'Fetch! 🐕'}</span>
          </button>
        </div>
      </div>

      {/* DISPLAYED SECURITY TREAT CARD */}
      <div className="bg-slate-950/90 rounded-2xl border border-amber-500/30 p-5 sm:p-6 space-y-4 shadow-xl relative z-10">
        
        {/* Treat Header Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700 text-xs font-mono font-bold">
              {currentTreat.badge}
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              {currentTreat.category}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            {isFirestoreSynced && (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <Database className="w-3.5 h-3.5" /> Firestore Collection
              </span>
            )}
          </div>
        </div>

        {/* Treat Title */}
        <h4 className="text-lg font-bold text-white font-sans flex items-center gap-2">
          <span>{currentTreat.title}</span>
        </h4>

        {/* Fun Fact / Explanation */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-1">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Fun Quantum Security Fact:
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
            {currentTreat.funFact}
          </p>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <Terminal className="w-3.5 h-3.5" /> PQC Code Snippet:
            </span>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1 font-bold text-xs transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied Snippet!' : 'Copy Snippet'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm overflow-x-auto">
            {currentTreat.codeSnippet}
          </pre>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
          <span className="text-slate-400">
            Collection: <code className="text-amber-300">/daily_security_treats</code>
          </span>

          <button
            onClick={handleSaveTreatToFirestore}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold flex items-center space-x-1.5 transition-all"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Save Treat to Firestore 🦴</span>
          </button>
        </div>

      </div>
    </div>
  );
};
