
"use client";

import {
    useState,
    useEffect,
    createContext,
    useContext,
    type ReactNode,
} from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserRole } from "@/app/actions";

type UserRole = 'patient' | 'doctor' | 'unknown';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    userRole: UserRole | null;
    userData: any | null; // To store Firestore data
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => {},
    userRole: null,
    userData: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [userData, setUserData] = useState<any | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const { role, data } = await getUserRole(user.uid);
                setUserRole(role);
                setUserData(data);
            } else {
                setUserRole(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};
