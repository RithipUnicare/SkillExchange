import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService';
import { User } from '../types/user.types';

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    isSuperAdmin: boolean;
    fetchUser: () => Promise<void>;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const response = await apiService.getCurrentUser();
            if (response.success && response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const clearUser = () => {
        setUser(null);
    };

    const isSuperAdmin = user?.roles?.toLowerCase() === 'superadmin';

    return (
        <UserContext.Provider value={{ user, isLoading, isSuperAdmin, fetchUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
