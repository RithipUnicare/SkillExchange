import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (mobileNumber: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const token = await apiService.getAccessToken();
            setIsAuthenticated(!!token);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (mobileNumber: string, password: string) => {
        await apiService.login(mobileNumber, password);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await apiService.clearTokens();
        setIsAuthenticated(false);
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
