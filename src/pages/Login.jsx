import React from 'react';
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to the page user tried to access or home
    const from = location.state?.from?.pathname || "/";

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle email/password login
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);

        try {
            await loginWithEmail(email, password);
            toast.success("Login successful! Welcome back! 🎉");
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login error:", error);

            // Handle specific Firebase errors
            if (error.code === "auth/user-not-found") {
                toast.error("No account found with this email");
            } else if (error.code === "auth/wrong-password") {
                toast.error("Incorrect password");
            } else if (error.code === "auth/invalid-email") {
                toast.error("Invalid email address");
            } else if (error.code === "auth/user-disabled") {
                toast.error("This account has been disabled");
            } else if (error.code === "auth/invalid-credential") {
                toast.error("Invalid email or password");
            } else {
                toast.error(error.message || "Failed to login");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        setLoading(true);

        try {
            await loginWithGoogle();
            toast.success("Login successful with Google! 🎉");
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Google login error:", error);

            if (error.code === "auth/popup-closed-by-user") {
                toast.error("Login cancelled");
            } else if (error.code === "auth/popup-blocked") {
                toast.error("Popup blocked. Please allow popups for this site");
            } else {
                toast.error(error.message || "Failed to login with Google");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle forgot password
    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address first");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            await resetPassword(email);
            toast.success("Password reset email sent! Check your inbox 📧");
        } catch (error) {
            console.error("Password reset error:", error);

            if (error.code === "auth/user-not-found") {
                toast.error("No account found with this email");
            } else {
                toast.error(error.message || "Failed to send reset email");
            }
        }
    };
    return (
        <div>
        this is login.
        </div>
    );
};

export default Login;