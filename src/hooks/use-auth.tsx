
"use client";

import {
    useState,
    useEffect,
    createContext,
    useContext,
    useCallback,
    type ReactNode,
} from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserRole } from "@/app/actions";

type UserRole = 'patient' | 'doctor' | 'ambulance' | 'lab' | 'pharmacy' | 'unknown';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    userRole: UserRole | null;
    userData: any | null; // To store Firestore data
    refreshUserRole: () => Promise<{ role: UserRole, data: any }>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => {},
    userRole: null,
    userData: null,
    refreshUserRole: async () => ({ role: 'unknown', data: null }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [userData, setUserData] = useState<any | null>(null);

    const refreshUserRole = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const { role, data } = await getUserRole(currentUser.uid);
            setUserRole(role);
            setUserData(data);
            return { role, data };
        }
        setUserRole(null);
        setUserData(null);
        return { role: 'unknown' as UserRole, data: null };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                await refreshUserRole();
            } else {
                setUserRole(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [refreshUserRole]);

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            // State will be cleared by the onAuthStateChanged listener
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const value = {
        user,
        loading,
        signOut,
        userRole,
        userData,
        refreshUserRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};
