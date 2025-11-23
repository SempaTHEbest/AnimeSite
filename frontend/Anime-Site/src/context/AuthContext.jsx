import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

// Функція для розшифровки JWT
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

    // Логіка витягування імені з токена
    const getUserFromToken = (token) => {
        const decoded = parseJwt(token);
        if (!decoded) return null;

        // .NET Identity часто використовує такі ключі:
        const soapNameKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        const soapIdKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

        // Шукаємо ім'я в порядку пріоритету
        let username = 
            decoded[soapNameKey] || // Стандартний ключ імені в .NET
            decoded.unique_name ||  // Альтернатива
            decoded.name ||         // Стандарт JWT
            decoded.sub;            // Fallback

        // Якщо ми випадково взяли ID (бо іноді sub = id), спробуємо знайти краще поле
        // Перевіряємо, чи це не той самий ID, що в nameidentifier
        if (decoded[soapIdKey] && username === decoded[soapIdKey]) {
             // Якщо ім'я співпадає з ID, спробуємо знайти інше поле, схоже на ім'я
             const potentialName = Object.keys(decoded).find(key => 
                key.toLowerCase().includes('name') && 
                !key.toLowerCase().includes('identifier') && 
                !key.toLowerCase().includes('id')
            );
            if (potentialName) username = decoded[potentialName];
        }

        return { username: username || "Member", token };
    };

    useEffect(() => {
        const initializeAuth = () => {
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
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        const token = response.data; 
        
        localStorage.setItem('token', token);
        
        const userData = getUserFromToken(token);
        setUser(userData);
        
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