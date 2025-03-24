import React, { createContext, useContext, useState, useEffect } from 'react';
import {toast} from "sonner";

// Types
export type UserRole = 'admin' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
    isAdmin: boolean;
}

// Default admin and user credentials
const ADMIN_USER: User = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
};

const NORMAL_USER: User = {
    id: 'user-1',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user'
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Check if user is already logged in on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('quizUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Mock login function
    const login = (email: string, password: string): void => {

        try {
            // Simple validation
            if (!email || !password) {
                throw new Error('Please enter both email and password');
            }

            // Demo credentials
            if (email === 'admin@example.com' && password === 'admin') {
                setUser(ADMIN_USER);
                localStorage.setItem('quizUser', JSON.stringify(ADMIN_USER));
                toast.success('Logged in as admin');
            } else if (email === 'user@example.com' && password === 'user') {
                setUser(NORMAL_USER);
                localStorage.setItem('quizUser', JSON.stringify(NORMAL_USER));
                toast.success('Logged in successfully');
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('quizUser');
        toast.info('Logged out successfully');
    };

    // Check if current user is admin
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
