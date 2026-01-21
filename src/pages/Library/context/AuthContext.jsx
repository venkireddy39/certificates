import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/* =========================
   ROLE → PERMISSION MAP
   ========================= */

const ROLE_PERMISSIONS = {
    // Admins have full access
    ADMIN: [
        'VIEW_DASHBOARD',
        'MANAGE_BOOKS', 'VIEW_BOOKS',
        'MANAGE_MEMBERS', 'VIEW_MEMBERS',
        'ISSUE_BOOKS', 'VIEW_ISSUES', 'RETURN_BOOKS',
        'VIEW_REPORTS',
        'SYSTEM_SETTINGS',
        'MANAGE_MARKETING_STRATEGY' // Added for Manager View
    ],
    MARKETING_MANAGER: [
        'VIEW_MARKETING_DASHBOARD',
        'MANAGE_CAMPAIGNS_APPROVAL',
        'VIEW_GLOBAL_ANALYTICS',
        'CONFIGURE_MARKETING_SETTINGS'
    ],
    MARKETING_EXECUTIVE: [
        'VIEW_MARKETING_WORKSPACE',
        'CREATE_CAMPAIGN',
        'MANAGE_LEADS',
        'VIEW_MY_PERFORMANCE'
    ],
    // Librarians manage operations
    LIBRARIAN: [
        'VIEW_DASHBOARD',
        'MANAGE_BOOKS', 'VIEW_BOOKS',
        'VIEW_MEMBERS',
        'ISSUE_BOOKS', 'VIEW_ISSUES', 'RETURN_BOOKS'
    ],
    // Students/Faculty (MEMBERS) have read-only access to their own data & catalog
    MEMBER: [
        'VIEW_DASHBOARD',
        'VIEW_BOOKS',
        'VIEW_MY_ACCOUNT'
    ],
    STUDENT: [ // Mapping alias for MEMBER
        'VIEW_DASHBOARD',
        'VIEW_BOOKS',
        'VIEW_MY_ACCOUNT'
    ],
    FACULTY: [ // Mapping alias for MEMBER
        'VIEW_DASHBOARD',
        'VIEW_BOOKS',
        'VIEW_MY_ACCOUNT'
    ]
};

/* =========================
   AUTH PROVIDER
   ========================= */

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------- RESTORE SESSION ---------- */
    useEffect(() => {
        try {
            const saved = localStorage.getItem('auth_user');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Allow login if role exists in map
                if (!ROLE_PERMISSIONS[parsed.role]) {
                    localStorage.removeItem('auth_user');
                    setUser(null);
                } else {
                    setUser(parsed);
                }
            } else {
                // AUTO-LOGIN DEFAULT ADMIN (Demo Mode)
                const defaultAdmin = {
                    id: 'u1',
                    name: 'Sarah Connor',
                    email: 'admin@library.com',
                    role: 'ADMIN',
                    avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=0D8ABC&color=fff'
                };
                setUser(defaultAdmin);
                localStorage.setItem('auth_user', JSON.stringify(defaultAdmin));
            }
        } catch (e) {
            console.error("Failed to parse auth user", e);
            localStorage.removeItem('auth_user');
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- LOGIN ---------- */
    const login = async (role = 'ADMIN') => {
        setLoading(true);

        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockUsers = {
            ADMIN: {
                id: 'u1',
                name: 'Sarah Connor',
                email: 'admin@library.com',
                role: 'ADMIN',
                avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=0D8ABC&color=fff'
            },
            MARKETING_MANAGER: {
                id: 'm1',
                name: 'Jessica Pearson',
                email: 'jessica@marketing.com',
                role: 'MARKETING_MANAGER',
                avatar: 'https://ui-avatars.com/api/?name=Jessica+Pearson&background=8e44ad&color=fff'
            },
            MARKETING_EXECUTIVE: {
                id: 'e1',
                name: 'Mike Ross',
                email: 'mike@marketing.com',
                role: 'MARKETING_EXECUTIVE',
                avatar: 'https://ui-avatars.com/api/?name=Mike+Ross&background=f39c12&color=fff'
            },
            LIBRARIAN: {
                id: 'u2',
                name: 'John Wick',
                email: 'librarian@library.com',
                role: 'LIBRARIAN',
                avatar: 'https://ui-avatars.com/api/?name=John+Wick&background=eb4034&color=fff'
            },
            STUDENT: {
                id: 'u3',
                memberId: 'MEM-003',
                name: 'Peter Parker',
                email: 'peter@student.edu',
                role: 'STUDENT',
                category: 'UG_ENGINEERING',
                status: 'ACTIVE',
                avatar: 'https://ui-avatars.com/api/?name=Peter+Parker&background=random'
            }
        };

        // Fallback or specific selection
        const loggedUser = mockUsers[role] || mockUsers['STUDENT'];

        if (!loggedUser) {
            console.error("Login failed: Invalid role", role);
            setLoading(false);
            return;
        }

        setUser(loggedUser);
        localStorage.setItem('auth_user', JSON.stringify(loggedUser));
        setLoading(false);
    };

    /* ---------- LOGOUT ---------- */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
        window.location.href = '/';
    };

    /* ---------- PERMISSION CHECK ---------- */
    const hasPermission = (permission) => {
        if (!user || !user.role) return false;

        // Admin overrides all
        if (user.role === 'ADMIN') return true;

        const perms = ROLE_PERMISSIONS[user.role] || [];
        return perms.includes(permission);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                hasPermission
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
