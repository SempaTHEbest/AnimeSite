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

    // Функція для отримання розширених даних про юзера
    // Токен має тільки ім'я, а нам треба ще Аватар і Біо
    const fetchUserProfile = async (token) => {
        const decoded = parseJwt(token);
        if (!decoded) return null;

        // Шукаємо ID в токені (nameid або sub)
        const idKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        const userId = decoded[idKey] || decoded.sub;

        // Базовий об'єкт з токена
        let userData = { 
            username: decoded.unique_name || decoded.name || "User", 
            role: decoded.role || "User",
            token 
        };

        // Пробуємо підтягнути повні дані з бекенду (Avatar, Bio)
        if (userId) {
            try {
                const response = await api.get(`/users/${userId}`);
                // Об'єднуємо дані з токена і дані з БД
                userData = { ...userData, ...response.data }; 
            } catch (err) {
                console.warn("Could not fetch full profile", err);
            }
        }
        return userData;
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const userData = await fetchUserProfile(token);
                if (userData) setUser(userData);
                else localStorage.removeItem('token');
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        const token = response.data; 
        localStorage.setItem('token', token);
        
        // Завантажуємо повний профіль при вході
        const userData = await fetchUserProfile(token);
        setUser(userData);
        return true;
    };

    // --- НОВА ФУНКЦІЯ: Оновлення даних локально ---
    const updateUserLocal = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const register = async (username, email, password) => {
        await api.post('/users/register', { username, email, password });
    };

    // Експорт googleAuth якщо він у тебе є...

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUserLocal, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);