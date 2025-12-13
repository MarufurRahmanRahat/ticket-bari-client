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
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const AuthContext = createContext();

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

      // 2. Update Firebase profile
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL,
      });

      // 3. Register in backend MongoDB
      const response = await authService.register({
        name,
        email,
        photoURL,
        firebaseUID: result.user.uid,
        role: 'user',
      });

      // 4. Save JWT token
      const jwtToken = response.data.token;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);

      // 5. Set user with backend data
      setUser({
        ...result.user,
        role: response.data.user.role,
        _id: response.data.user._id,
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
      const response = await authService.login({
        email,
        firebaseUID: result.user.uid,
      });

      // 3. Save JWT token
      const jwtToken = response.data.token;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);

      // 4. Set user with backend data
      setUser({
        ...result.user,
        role: response.data.user.role,
        _id: response.data.user._id,
        isFraud: response.data.user.isFraud,
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
      const result = await signInWithPopup(auth, provider);

      // Register/Login to backend
      const response = await authService.register({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        firebaseUID: result.user.uid,
        role: 'user',
      });

      // Save JWT token
      const jwtToken = response.data.token;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);

      // Set user with backend data
      setUser({
        ...result.user,
        role: response.data.user.role,
        _id: response.data.user._id,
        isFraud: response.data.user.isFraud,
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
          const response = await authService.getCurrentUser();
          setUser({
            ...currentUser,
            role: response.data.user.role,
            _id: response.data.user._id,
            isFraud: response.data.user.isFraud,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
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