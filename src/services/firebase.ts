import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD2iE2nUoubR9WBXPvmFaCZxz36hMT2zFk",
  authDomain: "mengaislagi-3f425.firebaseapp.com",
  projectId: "mengaislagi-3f425",
  storageBucket: "mengaislagi-3f425.firebasestorage.app",
  messagingSenderId: "467736651652",
  appId: "1:467736651652:web:7a49093613fe24d594dfd1",
  measurementId: "G-QNZJL7T9JB"
};

// Temporary: always enable debug mode so events show in Firebase DebugView
// Remove this line once you've confirmed analytics is working
(window as any).FIREBASE_ANALYTICS_DEBUG_MODE = true;

const app = initializeApp(firebaseConfig);

let analytics: Analytics | null = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn('Firebase Analytics not available:', e);
}

export { analytics, logEvent };
