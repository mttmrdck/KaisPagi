import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, Analytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAKRg0MgFCHs2cjkn80-QmWTkFFonHp7VU",
  authDomain: "mengaislagi-3f425.firebaseapp.com",
  projectId: "mengaislagi-3f425",
  storageBucket: "mengaislagi-3f425.firebasestorage.app",
  messagingSenderId: "467736651652",
  appId: "1:467736651652:web:7a49093613fe24d594dfd1",
  measurementId: "G-QNZJL7T9JB"
};

// Must be set BEFORE getAnalytics()
(window as any).FIREBASE_ANALYTICS_DEBUG_MODE = true;

console.log('🔥 Firebase: initializing app...');
const app = initializeApp(firebaseConfig);
console.log('🔥 Firebase: app initialized');

let analytics: Analytics | null = null;

console.log('🔥 Firebase: checking isSupported...');
isSupported()
  .then((supported) => {
    console.log('🔥 Firebase: isSupported =', supported);
    if (supported) {
      analytics = getAnalytics(app);
      console.log('✅ Analytics ready — check DebugView in Firebase Console');
    } else {
      console.warn('⚠️ Analytics not supported — reason: browser blocked or no measurementId');
    }
  })
  .catch((e) => {
    console.error('❌ Analytics isSupported() threw an error:', e);
  });

export { analytics, logEvent };