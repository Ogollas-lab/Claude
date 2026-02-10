import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const response = await register(formData.username, formData.email, formData.password);
        if (response.success) {
            navigate('/');
        } else {
            setError(response.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
            <div className="glass-panel p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
                    <p className="text-gray-400">Join the Food Security Grid</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                name="username"
                                type="text"
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-brand-green outline-none"
                                placeholder="Choose username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                name="email"
                                type="email"
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-brand-green outline-none"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white focus:border-brand-green outline-none"
                                placeholder="Create strong password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Creating...' : <><UserPlus className="w-5 h-5" /> Sign Up</>}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-brand-dark text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                loginWithGoogle(credentialResponse);
                                navigate('/');
                            }}
                            onError={() => {
                                setError('Google Sign In Failed');
                            }}
                            theme="filled_black"
                            shape="pill"
                        />
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-brand-accent hover:text-white">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
