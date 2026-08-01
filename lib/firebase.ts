import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDlDWAk4pkcX9iSZL6qL-9JFzYjl-MAV_4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "test-1498e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "test-1498e",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "test-1498e.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "71528121743",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:71528121743:web:6bcd073569cd39e12db7fa",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GKFL3WR0N3"
};

// Next.js SSR 및 클라이언트 중복 초기화 방지
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface Student {
  id?: string;
  student_id: string;
  name: string;
  created_at?: any;
}

export interface AttendanceRecord {
  id?: string;
  student_id: string;
  name: string;
  date: string; // YYYY-MM-DD
  timestamp?: any;
  status: 'PRESENT' | 'LATE' | 'ABSENT';
}
