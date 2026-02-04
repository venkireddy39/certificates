import { AUTH_TOKEN_KEY } from './auth.constants';

export const authService = {
    login: async (email, password) => {
        try {
            // Using /auth/login to match the proxy in vite.config.js targeting 192.168.1.34:8081
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                // If backend is unreachable or returns Forbidden (403), check for mock fallback
                if (res.status === 403 || res.status === 404 || res.status === 500) {
                    return handleMockLogin(email, password);
                }

                const text = await res.text();
                let errorMsg = text;
                try {
                    const parsed = JSON.parse(text);
                    errorMsg = parsed.message || parsed.error || text;
                } catch (e) { }
                throw new Error(errorMsg || 'Login failed');
            }

            // Backend returns the raw token string
            const token = await res.text();
            localStorage.setItem(AUTH_TOKEN_KEY, token);
            return { token };
        } catch (error) {
            console.warn('Auth API failed, trying mock fallback:', error);
            return handleMockLogin(email, password);
        }
    },

    logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
    }
};

/**
 * Fallback login for demo purposes when backend isn't available
 */
async function handleMockLogin(email, password) {
    console.log('Using Mock Fallback for:', email);

    // Explicit Demo Accounts
    const demoAccounts = {
        'admin@gmail.com': 'ADMIN',
        'student@gmail.com': 'STUDENT',
        'librarian@gmail.com': 'LIBRARIAN',
        'marketing@gmail.com': 'MARKETING_MANAGER'
    };

    const role = demoAccounts[email.toLowerCase()];

    if (role || email.includes('admin') || email.includes('student')) {
        const mockToken = generateMockJWT(email, role);
        localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
        return { token: mockToken, isMock: true };
    }

    throw new Error('Invalid credentials. Use admin@gmail.com or student@gmail.com for demo.');
}

function generateMockJWT(email, providedRole) {
    const role = providedRole || (email.includes('admin') ? 'ADMIN' : 'STUDENT');
    const payload = {
        sub: email,
        email: email,
        role: role,
        firstName: email.includes('admin') ? 'Admin' : 'Ajay',
        lastName: email.includes('admin') ? 'User' : 'Kumar',
        tenantDb: 'demo_db',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    };

    // Create a fake base64 JWT for frontend parsing
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const data = btoa(JSON.stringify(payload));
    return `${header}.${data}.mock_signature`;
}
