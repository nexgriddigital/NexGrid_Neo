import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc,
  updateDoc,
  deleteDoc,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Contract, MaintenanceRequest, ChatMessage, ProjectInquiry, ProvisionedClient } from '../types';

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth: Auth = getAuth(app);

// Clean slate: 0 mock clients, 0 mock contracts, 0 mock tickets
export const INITIAL_CONTRACTS: Contract[] = [];
export const INITIAL_TICKETS: MaintenanceRequest[] = [];
export const INITIAL_MESSAGES: ChatMessage[] = [];

// Helper to cleanup any legacy demo items if present in firestore
export async function cleanLegacyDemoData(): Promise<void> {
  try {
    const demoContractIds = ['contract-nex-001', 'contract-nex-002', 'contract-nex-003'];
    for (const cid of demoContractIds) {
      try {
        await deleteDoc(doc(db, 'contracts', cid));
      } catch (e) {}
    }
    const demoTicketIds = ['req-101', 'req-102', 'req-103'];
    for (const tid of demoTicketIds) {
      try {
        await deleteDoc(doc(db, 'maintenance_requests', tid));
      } catch (e) {}
    }
    const demoMessageIds = ['msg-001', 'msg-002'];
    for (const mid of demoMessageIds) {
      try {
        await deleteDoc(doc(db, 'messages', mid));
      } catch (e) {}
    }
  } catch (err) {
    // Silent catch if offline or permissions
  }
}

// Provisioned Client management in Firestore
export async function getProvisionedClientsFirestore(): Promise<ProvisionedClient[]> {
  try {
    const colRef = collection(db, 'provisioned_clients');
    const snap = await getDocs(colRef);
    const clients: ProvisionedClient[] = [];
    snap.forEach((docSnap) => {
      clients.push(docSnap.data() as ProvisionedClient);
    });
    return clients;
  } catch (err) {
    console.warn('Failed to load provisioned clients from Firestore:', err);
    return [];
  }
}

export async function saveProvisionedClientFirestore(client: ProvisionedClient): Promise<void> {
  try {
    await setDoc(doc(db, 'provisioned_clients', client.id), client);
  } catch (err) {
    console.warn('Failed to save provisioned client to Firestore:', err);
  }
}

export async function revokeProvisionedClientFirestore(clientId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'provisioned_clients', clientId));
  } catch (err) {
    console.warn('Failed to revoke provisioned client from Firestore:', err);
  }
}

