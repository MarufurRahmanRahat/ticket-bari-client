import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/Firebase.config";
import axios from "axios";


const AuthContext = createContext();

// Configuration of axios base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Register with Email & Password
    const registerWithEmail = async (email, password, name, photoURL) => {
        setLoading(true);
        try {
            // 1. Register with Firebase
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Update profile with name and photo
            await updateProfile(result.user, {
                displayName: name,
                photoURL: photoURL,
            });

            // 3. Register user in backend MongoDB
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                photoURL,
                firebaseUID: result.user.uid,
                role: 'user', // Default role
            });

            // 4. Save JWT token
            const jwtToken = response.data.data.token;
            localStorage.setItem('token', jwtToken);
            setToken(jwtToken);

            // 5. Set user with backend data
            setUser({
                ...result.user,
                ...response.data.data.user,
            });

            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    // Login with Email & Password
    const loginWithEmail = async (email, password) => {
        setLoading(true);
        try {
            // 1. Login with Firebase
            const result = await signInWithEmailAndPassword(auth, email, password);

            // 2. Login to backend
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                firebaseUID: result.user.uid,
            });

            // 3. Save JWT token
            const jwtToken = response.data.data.token;
            localStorage.setItem('token', jwtToken);
            setToken(jwtToken);

            // 4. Set user with backend data
            setUser({
                ...result.user,
                ...response.data.data.user,
            });

            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Google Sign In
    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();

            // 1. Sign in with Google
            const result = await signInWithPopup(auth, provider);

            // 2. Register/Login to backend
            const response = await axios.post(`${API_URL}/auth/register`, {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                firebaseUID: result.user.uid,
                role: 'user',
            });

            // 3. Save JWT token
            const jwtToken = response.data.data.token;
            localStorage.setItem('token', jwtToken);
            setToken(jwtToken);

            // 4. Set user with backend data
            setUser({
                ...result.user,
                ...response.data.data.user,
            });

            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    // Logout
    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Password Reset
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Observer for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser && token) {
                try {
                    // Fetch user data from backend
                    const response = await axios.get(`${API_URL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setUser({
                        ...currentUser,
                        ...response.data.data.user,
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [token]);


    const authInfo = {
        user,
        loading,
        token,
        registerWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};