import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // In a real app, verify token validity here or decode payload
            setUser({ username: 'Agent' }); // Mock user object for now
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password
            });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            setToken(access);
            setUser({ username });
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                email,
                password
            });
            // Auto login after register
            await login(username, password);
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);
            const msg = error.response?.data?.username?.[0] ||
                error.response?.data?.password?.[0] ||
                error.response?.data?.detail ||
                error.message ||
                "Registration Failed";
            return { success: false, message: msg };
        }
    };

    const loginWithGoogle = (credentialResponse) => {
        // In a real app, send credentialResponse.credential to backend to verify
        // For now, we decode it client side (if possible) or just trust it for the demo
        console.log("Google Credential:", credentialResponse);
        const fakeToken = "google-mock-token-" + Date.now();
        localStorage.setItem('access_token', fakeToken);
        setToken(fakeToken);
        setUser({ username: "Google User" }); // We would extract name from decoded token
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
