import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminData: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  adminData: null,
  loading: true,
  signOut: async () => {},
});

// The designated super admin emails
const SUPER_ADMIN_EMAILS = ['sagarkiisha9@gmail.com', 'admin@visafinance.com'];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const adminRef = doc(db, 'adminUsers', currentUser.uid);
          const adminDoc = await getDoc(adminRef);
          
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            // Check if user is active AND has an admin role
            const hasAdminRole = ['super_admin', 'admin', 'editor'].includes(data.role);
            if (data.status === 'active' && hasAdminRole) {
              setIsAdmin(true);
              setAdminData(data);
            } else {
              setIsAdmin(false);
              setAdminData(null);
              console.warn(`User ${currentUser.email} authenticated but role "${data.role}" or status "${data.status}" is invalid.`);
            }
          } else if (currentUser.email && SUPER_ADMIN_EMAILS.includes(currentUser.email)) {
            // Auto-provision the super admin on first login
            console.log(`First-time setup: Provisioning super admin for ${currentUser.email}`);
            const superAdminData = {
              name: 'Super Admin',
              email: currentUser.email,
              role: 'super_admin',
              status: 'active',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            };
            await setDoc(adminRef, superAdminData);
            setIsAdmin(true);
            setAdminData(superAdminData);
          } else {
            setIsAdmin(false);
            setAdminData(null);
            console.warn(`Access denied for ${currentUser.email}: Not an authorized admin.`);
          }
        } catch (error) {
          console.error('Error checking admin status', error);
          // If we hit a permission error but they are a super admin, let them in anyway
          if (currentUser.email && SUPER_ADMIN_EMAILS.includes(currentUser.email)) {
            setIsAdmin(true);
            setAdminData({ role: 'super_admin', email: currentUser.email, name: 'Super Admin' });
          } else {
            setIsAdmin(false);
            setAdminData(null);
          }
        }
      } else {
        setIsAdmin(false);
        setAdminData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, adminData, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
