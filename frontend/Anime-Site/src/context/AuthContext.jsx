import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserFromToken = (token) => {
        const decoded = parseJwt(token);
        if (!decoded) return null;

        // Ключі .NET Identity
        const nameKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

        let username = decoded[nameKey] || decoded.unique_name || decoded.name || "User";
        
        // Отримуємо роль. Якщо її немає, ставимо "User"
        let role = decoded[roleKey] || decoded.role || "User";
        
        // Якщо ролей декілька (масив), беремо "Admin", якщо він там є, або просто першу
        if (Array.isArray(role)) {
            role = role.includes("Admin") ? "Admin" : role[0];
        }

        return { username, role, token };
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = getUserFromToken(token);
            if (userData) {
                setUser(userData);
            } else {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        const token = response.data; 
        localStorage.setItem('token', token);
        setUser(getUserFromToken(token));
        return true;
    };

    const register = async (username, email, password) => {
        await api.post('/users/register', { username, email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);