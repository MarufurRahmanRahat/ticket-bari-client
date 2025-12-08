import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, Image as ImageIcon, UserPlus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";


const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        photoURL: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasMinLength: false,
    });

    const { registerWithEmail, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for this field
        setErrors({ ...errors, [name]: "" });

        // Real-time password validation
        if (name === "password") {
            setPasswordStrength({
                hasUppercase: /[A-Z]/.test(value),
                hasLowercase: /[a-z]/.test(value),
                hasMinLength: value.length >= 6,
            });
        }
    };

    // Validate password according to requirements
    const validatePassword = (password) => {
        const errors = [];

        if (password.length < 6) {
            errors.push("Length must be at least 6 characters");
        }

        if (!/[A-Z]/.test(password)) {
            errors.push("Must have an Uppercase letter");
        }

        if (!/[a-z]/.test(password)) {
            errors.push("Must have a Lowercase letter");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    };

    // Validate entire form
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        // Photo URL validation
        if (!formData.photoURL.trim()) {
            newErrors.photoURL = "Photo URL is required";
        } else if (
            !/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(formData.photoURL)
        ) {
            newErrors.photoURL = "Please enter a valid image URL";
        }

        // Password validation
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.errors.join(", ");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);

        try {
            await registerWithEmail(
                formData.email,
                formData.password,
                formData.name,
                formData.photoURL
            );
            toast.success("Registration successful! Welcome to TicketBari! 🎉");
            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);

            // Handle specific Firebase errors
            if (error.code === "auth/email-already-in-use") {
                toast.error("This email is already registered");
            } else if (error.code === "auth/invalid-email") {
                toast.error("Invalid email address");
            } else if (error.code === "auth/weak-password") {
                toast.error("Password is too weak");
            } else {
                toast.error(error.message || "Failed to register");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Google registration
    const handleGoogleRegister = async () => {
        setLoading(true);

        try {
            await loginWithGoogle();
            toast.success("Registration successful with Google! 🎉");
            navigate("/");
        } catch (error) {
            console.error("Google registration error:", error);

            if (error.code === "auth/popup-closed-by-user") {
                toast.error("Registration cancelled");
            } else if (error.code === "auth/popup-blocked") {
                toast.error("Popup blocked. Please allow popups for this site");
            } else {
                toast.error(error.message || "Failed to register with Google");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join TicketBari today and start booking!</p>
                </div>

                {/* Registration Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full pl-10 pr-4 py-3 border ${errors.name ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`w-full pl-10 pr-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Photo URL Field */}
                        <div>
                            <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-2">
                                Photo URL
                            </label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="photoURL"
                                    name="photoURL"
                                    value={formData.photoURL}
                                    onChange={handleChange}
                                    placeholder="https://example.com/photo.jpg"
                                    className={`w-full pl-10 pr-4 py-3 border ${errors.photoURL ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                />
                            </div>
                            {errors.photoURL && (
                                <p className="mt-1 text-sm text-red-500">{errors.photoURL}</p>
                            )}
                            {/* Photo Preview */}
                            {formData.photoURL && !errors.photoURL && (
                                <div className="mt-2 flex justify-center">
                                    <img
                                        src={formData.photoURL}
                                        alt="Preview"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            setErrors({ ...errors, photoURL: "Invalid image URL" });
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    className={`w-full pl-10 pr-12 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Requirements */}
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center text-xs">
                                    <span
                                        className={`mr-2 ${passwordStrength.hasMinLength ? "text-green-500" : "text-gray-400"
                                            }`}
                                    >
                                        {passwordStrength.hasMinLength ? "✓" : "○"}
                                    </span>
                                    <span className={passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"}>
                                        At least 6 characters
                                    </span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <span
                                        className={`mr-2 ${passwordStrength.hasUppercase ? "text-green-500" : "text-gray-400"
                                            }`}
                                    >
                                        {passwordStrength.hasUppercase ? "✓" : "○"}
                                    </span>
                                    <span className={passwordStrength.hasUppercase ? "text-green-600" : "text-gray-500"}>
                                        One uppercase letter
                                    </span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <span
                                        className={`mr-2 ${passwordStrength.hasLowercase ? "text-green-500" : "text-gray-400"
                                            }`}
                                    >
                                        {passwordStrength.hasLowercase ? "✓" : "○"}
                                    </span>
                                    <span className={passwordStrength.hasLowercase ? "text-green-600" : "text-gray-500"}>
                                        One lowercase letter
                                    </span>
                                </div>
                            </div>

                            {errors.password && (
                                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or register with</span>
                        </div>
                    </div>

                    {/* Google Register Button */}
                    <button
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={loading}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-semibold transition"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    By registering, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Register;