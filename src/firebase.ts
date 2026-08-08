/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

export interface EnterpriseContact {
  id?: string;
  name: string;
  company: string;
  email: string;
  role: string;
  investmentInterest?: string;
  notes?: string;
  createdAt?: string | Timestamp;
  status?: string;
}

// Default Firebase config (or read environment if present)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForQCryptDemoOnly2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "q-crypt-pqc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "q-crypt-pqc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "q-crypt-pqc.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1005525931747",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1005525931747:web:qcryptpqc2026"
};

// Initialize Firebase App gracefully
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Seed initial demo enterprise contacts if needed (completely anonymized)
const INITIAL_ENTERPRISE_CONTACTS: EnterpriseContact[] = [
  {
    id: 'ent-1',
    name: 'Verified Enterprise CISO #402',
    company: 'Sovereign Defense Sector Org',
    email: 'ciso-office@sovereignty-defense.eu',
    role: 'Chief Information Security Officer (CISO)',
    investmentInterest: '$5,000,000 (Series-A)',
    notes: 'Req: NIST FIPS 203 ML-KEM-1024 deployment across 12,000 sovereign mobile devices.',
    createdAt: new Date().toISOString(),
    status: 'QUALIFIED_PILOT'
  },
  {
    id: 'ent-2',
    name: 'Enterprise Risk Lead #118',
    company: 'Global Tier-1 Financial Institution',
    email: 'crypto-risk@global-tier1-bank.com',
    role: 'VP of Enterprise Risk & Cryptography',
    investmentInterest: '$2,500,000 (Series-A)',
    notes: 'Interested in StrongBox / Titan M2 hardware key isolation for banking executives.',
    createdAt: new Date().toISOString(),
    status: 'DUE_DILIGENCE'
  },
  {
    id: 'ent-3',
    name: 'Cybersecurity Fund Partner #09',
    company: 'Tier-1 Cybersecurity Venture Fund',
    email: 'partner@tier1-vc-fund.com',
    role: 'Managing Director & Partner',
    investmentInterest: '$10,000,000 (Lead Series-A)',
    notes: 'Targeting Q-CRYPT as primary post-quantum mobile shield for Fortune 500 CISOs.',
    createdAt: new Date().toISOString(),
    status: 'TERM_SHEET_ISSUED'
  }
];

export async function saveEnterpriseContactToFirestore(contact: EnterpriseContact): Promise<{ success: boolean; id: string }> {
  try {
    const contactsCol = collection(db, 'enterprise_contacts');
    const docRef = await addDoc(contactsCol, {
      ...contact,
      createdAt: new Date().toISOString(),
      status: contact.status || 'NEW_INQUIRY'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Firestore save fallback to local memory storage:", error);
    // Local fallback persistence
    const localId = `ent-local-${Date.now()}`;
    const existing = getLocalEnterpriseContacts();
    const updated = [{ ...contact, id: localId, createdAt: new Date().toISOString() }, ...existing];
    localStorage.setItem('qcrypt_enterprise_contacts', JSON.stringify(updated));
    return { success: true, id: localId };
  }
}

export function getLocalEnterpriseContacts(): EnterpriseContact[] {
  try {
    const stored = localStorage.getItem('qcrypt_enterprise_contacts');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading local contacts:", e);
  }
  return INITIAL_ENTERPRISE_CONTACTS;
}

export async function fetchEnterpriseContactsFromFirestore(): Promise<EnterpriseContact[]> {
  try {
    const contactsCol = collection(db, 'enterprise_contacts');
    const snapshot = await getDocs(contactsCol);
    if (!snapshot.empty) {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnterpriseContact));
      return docs;
    }
  } catch (error) {
    console.warn("Firestore fetch fallback to local stored contacts:", error);
  }
  return getLocalEnterpriseContacts();
}
