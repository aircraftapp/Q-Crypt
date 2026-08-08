import { 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface EnterpriseTrialCRMRequest {
  id?: string;
  enterpriseName: string;
  contactEmail: string;
  seats: number;
  complianceNeeds: string[];
  notes?: string;
  requestedSla: string;
  slaTier: '24/7 Priority SLA' | 'Standard Enterprise SLA' | 'Sovereignty Custom SLA';
  status: 'PENDING_REVIEW' | 'SLA_APPROVED' | 'IN_PROGRESS' | 'PROVISIONED' | 'REJECTED';
  licenseId: string;
  pocKey: string;
  submittedAt: string;
  firestoreTimestamp?: any;
}

export interface ApkDownloadCRMRequest {
  id?: string;
  fullName: string;
  email: string;
  organization: string;
  osPlatform: string; // e.g. GrapheneOS, CalyxOS, Stock Android, Enterprise MDM
  edition?: string; // e.g. Free / Community Edition (P2P Mesh) or Enterprise Edition
  useCase?: string;
  status: 'PENDING_EMAIL_LINK' | 'LINK_PUSHED' | 'VERIFIED' | 'REJECTED';
  requestId: string;
  submittedAt: string;
  firestoreTimestamp?: any;
}

export interface NewsletterSubscription {
  id?: string;
  email: string;
  topics?: string[];
  source?: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  subscribedAt: string;
  firestoreTimestamp?: any;
}

const COLLECTION_NAME = 'enterprise_trial_requests';
const APK_COLLECTION_NAME = 'apk_download_requests';
const NEWSLETTER_COLLECTION_NAME = 'newsletter_subscriptions';

export const crmService = {
  /**
   * Submit new Enterprise Trial & Security SLA Request into Firebase CRM
   */
  async submitTrialRequest(requestData: Omit<EnterpriseTrialCRMRequest, 'id' | 'submittedAt' | 'status'>): Promise<string> {
    const payload: Omit<EnterpriseTrialCRMRequest, 'id'> = {
      ...requestData,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
      firestoreTimestamp: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
      return docRef.id;
    } catch (error) {
      console.warn('Firebase Firestore write failed or fallback triggered:', error);
      return `local_${Date.now()}`;
    }
  },

  /**
   * Submit new APK Download Registration Request into Firebase CRM
   */
  async submitApkDownloadRequest(requestData: Omit<ApkDownloadCRMRequest, 'id' | 'submittedAt' | 'status'>): Promise<string> {
    const payload: Omit<ApkDownloadCRMRequest, 'id'> = {
      ...requestData,
      status: 'PENDING_EMAIL_LINK',
      submittedAt: new Date().toISOString(),
      firestoreTimestamp: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, APK_COLLECTION_NAME), payload);
      return docRef.id;
    } catch (error) {
      console.warn('Firebase Firestore write failed for APK request:', error);
      return `local_apk_${Date.now()}`;
    }
  },

  /**
   * Real-time subscription to APK Download CRM Requests for Admin dispatch
   */
  subscribeToApkRequests(onData: (requests: ApkDownloadCRMRequest[]) => void) {
    try {
      const q = query(collection(db, APK_COLLECTION_NAME), orderBy('submittedAt', 'desc'));
      return onSnapshot(q, (querySnapshot) => {
        const list: ApkDownloadCRMRequest[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ApkDownloadCRMRequest);
        });
        onData(list);
      }, (error) => {
        console.warn('Firestore APK snapshot error:', error);
        onData([]);
      });
    } catch (error) {
      console.warn('Failed to subscribe to APK Firestore requests:', error);
      onData([]);
      return () => {};
    }
  },

  /**
   * Update APK CRM request status (e.g. when Admin pushes email link)
   */
  async updateApkStatus(docId: string, status: ApkDownloadCRMRequest['status']): Promise<boolean> {
    try {
      const docRef = doc(db, APK_COLLECTION_NAME, docId);
      await updateDoc(docRef, { status });
      return true;
    } catch (error) {
      console.error('Failed to update APK lead status in Firestore:', error);
      return false;
    }
  },

  /**
   * Fetch all CRM Enterprise Trial requests from Firebase
   */
  async getAllTrialRequests(): Promise<EnterpriseTrialCRMRequest[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: EnterpriseTrialCRMRequest[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as EnterpriseTrialCRMRequest);
      });
      return list;
    } catch (error) {
      console.warn('Failed to fetch Firestore trial requests:', error);
      return [];
    }
  },

  /**
   * Real-time subscription to CRM lead requests for live dashboard monitoring
   */
  subscribeToTrialRequests(onData: (requests: EnterpriseTrialCRMRequest[]) => void) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
      return onSnapshot(q, (querySnapshot) => {
        const list: EnterpriseTrialCRMRequest[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as EnterpriseTrialCRMRequest);
        });
        onData(list);
      }, (error) => {
        console.warn('Firestore snapshot error:', error);
        onData([]);
      });
    } catch (error) {
      console.warn('Failed to subscribe to Firestore:', error);
      onData([]);
      return () => {};
    }
  },

  /**
   * Update CRM lead status in Firebase
   */
  async updateStatus(docId: string, status: EnterpriseTrialCRMRequest['status']): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, docId);
      await updateDoc(docRef, { status });
      return true;
    } catch (error) {
      console.error('Failed to update CRM lead status in Firestore:', error);
      return false;
    }
  },

  /**
   * Submit new email subscription for Post-Quantum Security updates
   */
  async submitNewsletterSubscription(email: string, topics: string[] = ['PQC Vulnerability Briefs', 'NIST FIPS 203 Updates']): Promise<string> {
    const payload: Omit<NewsletterSubscription, 'id'> = {
      email,
      topics,
      source: 'Footer Newsletter Component',
      status: 'ACTIVE',
      subscribedAt: new Date().toISOString(),
      firestoreTimestamp: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, NEWSLETTER_COLLECTION_NAME), payload);
      return docRef.id;
    } catch (error) {
      console.warn('Firebase Firestore write failed for newsletter subscription:', error);
      return `local_news_${Date.now()}`;
    }
  },

  /**
   * Real-time subscription to Newsletter Subscribers for Admin monitoring
   */
  subscribeToNewsletterList(onData: (subs: NewsletterSubscription[]) => void) {
    try {
      const q = query(collection(db, NEWSLETTER_COLLECTION_NAME), orderBy('subscribedAt', 'desc'));
      return onSnapshot(q, (querySnapshot) => {
        const list: NewsletterSubscription[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as NewsletterSubscription);
        });
        onData(list);
      }, (error) => {
        console.warn('Firestore Newsletter snapshot error:', error);
        onData([]);
      });
    } catch (error) {
      console.warn('Failed to subscribe to Newsletter Firestore records:', error);
      onData([]);
      return () => {};
    }
  },

  /**
   * Update Newsletter Subscription status
   */
  async updateNewsletterStatus(docId: string, status: NewsletterSubscription['status']): Promise<boolean> {
    try {
      const docRef = doc(db, NEWSLETTER_COLLECTION_NAME, docId);
      await updateDoc(docRef, { status });
      return true;
    } catch (error) {
      console.error('Failed to update Newsletter subscription in Firestore:', error);
      return false;
    }
  }
};
