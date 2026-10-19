import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AdminUser } from '../types';

export const DESIGNATED_ADMIN = {
  email: 'ibrahimsm652@gmail.com',
  password: '2026',
  displayName: 'ইব্রাহিম (প্রধান সম্পাদক)',
};

/**
 * Format password to comply with Firebase Auth requirement (min 6 characters)
 */
export function formatAuthPassword(rawPassword: string): string {
  if (!rawPassword) return rawPassword;
  if (rawPassword.length < 6) {
    // Pad short passwords like '2026' so Firebase Authentication accepts it seamlessly
    return `${rawPassword}__hazrabari24`;
  }
  return rawPassword;
}

/**
 * Friendly Bengali error messages for Firebase Auth errors
 */
export function getBengaliAuthError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'এই ইমেইল দিয়ে কোনো ব্যবহারকারী অ্যাকাউন্ট পাওয়া যায়নি।';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'ভুল পাসওয়ার্ড অথবা ইমেইল। অনুগ্রহ করে সঠিক তথ্য দিন।';
    case 'auth/invalid-email':
      return 'ইমেইল ঠিকানাটি সঠিক নয়। অনুগ্রহ করে সঠিক ফরম্যাটে লিখুন।';
    case 'auth/email-already-in-use':
      return 'এই ইমেইল ঠিকানাটি ইতিমধ্যে নিবন্ধিত রয়েছে। সরাসরি লগইন করুন।';
    case 'auth/weak-password':
      return 'পাসওয়ার্ডটি খুবই দুর্বল। অন্তত ৪টি বা তার বেশি অক্ষর ব্যবহার করুন।';
    case 'auth/too-many-requests':
      return 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে অ্যাকাউন্টটি সাময়িকভাবে লক হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগে ত্রুটি হয়েছে। আপনার নেটওয়ার্ক পরীক্ষা করুন।';
    default:
      return 'প্রবেশ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
  }
}

/**
 * Checks if a Firebase user is an authorized admin in Firestore
 */
export async function checkAdminAuthorization(uid: string): Promise<{
  isAdmin: boolean;
  role: 'superadmin' | 'editor' | 'reporter';
}> {
  const currentUser = auth.currentUser;
  const isDesignated = currentUser?.email?.toLowerCase() === DESIGNATED_ADMIN.email.toLowerCase();

  try {
    const adminDocRef = doc(db, 'admins', uid);
    const snap = await getDoc(adminDocRef);

    if (snap.exists()) {
      const data = snap.data();
      const docEmail = data.email?.toLowerCase();
      if (docEmail === DESIGNATED_ADMIN.email.toLowerCase() || isDesignated) {
        return {
          isAdmin: true,
          role: 'superadmin',
        };
      }
      return {
        isAdmin: !!data.isAdmin && data.role === 'superadmin',
        role: data.role || 'reporter',
      };
    } else if (isDesignated && currentUser) {
      await setDoc(
        adminDocRef,
        {
          uid,
          email: currentUser.email || '',
          role: 'superadmin',
          displayName: DESIGNATED_ADMIN.displayName,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      return { isAdmin: true, role: 'superadmin' };
    }
  } catch (error) {
    console.warn('Admin check notice:', error);
  }

  return { isAdmin: isDesignated, role: isDesignated ? 'superadmin' : 'reporter' };
}

/**
 * Check if the initial admin claim document exists
 */
export async function isInitialAdminClaimed(): Promise<boolean> {
  return true;
}

/**
 * Claims initial superadmin rights for the first user
 */
export async function claimInitialSuperAdmin(user: User): Promise<boolean> {
  const isDesignated = user.email?.toLowerCase() === DESIGNATED_ADMIN.email.toLowerCase();
  if (!isDesignated) return false;

  try {
    const userRef = doc(db, 'admins', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        role: 'superadmin',
        displayName: DESIGNATED_ADMIN.displayName,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Failed to claim admin:', err);
    return false;
  }
}

/**
 * Log in admin with email & password - RESTRICTED TO DESIGNATED ADMIN ONLY
 */
export async function loginAdmin(email: string, rawPassword: string): Promise<AdminUser> {
  const cleanEmail = email.trim().toLowerCase();
  const safePassword = formatAuthPassword(rawPassword);
  const isDesignated = cleanEmail === DESIGNATED_ADMIN.email.toLowerCase();

  // STRICT ACCESS CONTROL: Completely block any unauthorized user from logging in or creating an admin account
  if (!isDesignated) {
    throw new Error('প্রবেশাধিকার সংরক্ষিত! শুধুমাত্র অনুমোদিত প্রধান সম্পাদক (ibrahimsm652@gmail.com) এর জন্য এই প্যানেল। নতুন কোনো অ্যাডমিন অ্যাকাউন্ট খোলার সুযোগ নেই।');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, safePassword);

    const admin: AdminUser = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: DESIGNATED_ADMIN.displayName,
      role: 'superadmin',
      isAdmin: true,
    };

    try {
      const userRef = doc(db, 'admins', cred.user.uid);
      await setDoc(
        userRef,
        {
          uid: cred.user.uid,
          email: cred.user.email,
          role: 'superadmin',
          displayName: admin.displayName,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Sync admin doc warning:', e);
    }

    localStorage.setItem('hazrabari_admin_session', JSON.stringify(admin));
    return admin;
  } catch (err: any) {
    console.warn('Sign-in error code:', err.code);

    // If account doesn't exist yet, initialize it for the designated admin
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-login-credentials'
    ) {
      try {
        const createCred = await createUserWithEmailAndPassword(auth, cleanEmail, safePassword);
        const admin: AdminUser = {
          uid: createCred.user.uid,
          email: createCred.user.email,
          displayName: DESIGNATED_ADMIN.displayName,
          role: 'superadmin',
          isAdmin: true,
        };

        try {
          await setDoc(
            doc(db, 'admins', createCred.user.uid),
            {
              uid: createCred.user.uid,
              email: cleanEmail,
              role: 'superadmin',
              displayName: admin.displayName,
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (dbErr) {
          console.warn('Firestore admin save notice:', dbErr);
        }

        localStorage.setItem('hazrabari_admin_session', JSON.stringify(admin));
        return admin;
      } catch (createErr: any) {
        console.warn('Auto-create attempt error:', createErr.code);
        
        // Direct password match fallback for designated admin
        if (rawPassword === '2026' || rawPassword === '20262026' || rawPassword.includes('2026')) {
          const designatedAdmin: AdminUser = {
            uid: 'admin-ibrahim-superadmin',
            email: DESIGNATED_ADMIN.email,
            displayName: DESIGNATED_ADMIN.displayName,
            role: 'superadmin',
            isAdmin: true,
          };
          localStorage.setItem('hazrabari_admin_session', JSON.stringify(designatedAdmin));
          return designatedAdmin;
        }

        if (createErr.code !== 'auth/email-already-in-use') {
          throw err;
        }
      }
    }

    // Direct password match fallback for designated admin credentials
    if (rawPassword === '2026' || rawPassword === '20262026' || rawPassword.includes('2026')) {
      const designatedAdmin: AdminUser = {
        uid: 'admin-ibrahim-superadmin',
        email: DESIGNATED_ADMIN.email,
        displayName: DESIGNATED_ADMIN.displayName,
        role: 'superadmin',
        isAdmin: true,
      };
      localStorage.setItem('hazrabari_admin_session', JSON.stringify(designatedAdmin));
      return designatedAdmin;
    }

    throw err;
  }
}

/**
 * Register a new staff user or initial admin - PERMANENTLY DISABLED
 */
export async function registerAdmin(
  _email?: string,
  _rawPassword?: string,
  _name?: string
): Promise<{ user: any; isInitial: boolean }> {
  throw new Error('নিরাপত্তার স্বার্থে নতুন কোনো অ্যাডমিন অ্যাকাউন্ট তৈরি সম্পূর্ণভাবে বন্ধ রাখা হয়েছে।');
}

/**
 * Send password reset email - ONLY FOR DESIGNATED ADMIN
 */
export async function resetAdminPassword(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== DESIGNATED_ADMIN.email.toLowerCase()) {
    throw new Error('অননুমোদিত ইমেইল! শুধুমাত্র অনুমোদিত প্রধান সম্পাদকের পাসওয়ার্ড রিসেট করা সম্ভব।');
  }
  await sendPasswordResetEmail(auth, cleanEmail);
}

/**
 * Sign out current admin user
 */
export async function logoutAdmin(): Promise<void> {
  localStorage.removeItem('hazrabari_admin_session');
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Signout warning:', e);
  }
}

/**
 * Listen to auth state changes
 */
export function onAdminAuthState(callback: (admin: AdminUser | null) => void) {
  // Check localStorage session first
  const cachedAdmin = localStorage.getItem('hazrabari_admin_session');
  let sessionAdmin: AdminUser | null = null;
  if (cachedAdmin) {
    try {
      sessionAdmin = JSON.parse(cachedAdmin);
      callback(sessionAdmin);
    } catch {
      // ignore
    }
  }

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      if (!sessionAdmin) {
        callback(null);
      }
      return;
    }

    const { isAdmin, role } = await checkAdminAuthorization(user.uid);
    const isDesignated = user.email?.toLowerCase() === DESIGNATED_ADMIN.email.toLowerCase();
    const adminData: AdminUser = {
      uid: user.uid,
      email: user.email,
      displayName: isDesignated
        ? DESIGNATED_ADMIN.displayName
        : user.displayName || (user.email ? user.email.split('@')[0] : 'সম্পাদক'),
      role: isDesignated ? 'superadmin' : role,
      isAdmin,
    };
    localStorage.setItem('hazrabari_admin_session', JSON.stringify(adminData));
    callback(adminData);
  });
}
