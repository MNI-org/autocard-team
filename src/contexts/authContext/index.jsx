import React, { useContext, useState, useEffect } from 'react';
import {auth, db} from '../../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLogged, setUserLogged] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, []);

    async function initializeUser(user) {
        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setCurrentUser({
                        uid: user.uid,
                        email: user.email,
                        ...userDoc.data()
                    });
                } else {
                    setCurrentUser({
                        uid: user.uid,
                        email: user.email
                    });
                }
                setUserLogged(true);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setCurrentUser({
                    uid: user.uid,
                    email: user.email
                });
                setUserLogged(true);
            }
        } else {
            setUserLogged(null);
            setUserLogged(false);
        }
        setLoading(false);
    }

    const refreshUser = async () => {
        if (auth.currentUser) {
            await initializeUser(auth.currentUser);
        }
    };

    const value = {
        currentUser,
        userLogged,
        loading,
        refreshUser
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}