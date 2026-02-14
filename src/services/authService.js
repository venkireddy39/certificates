import { AUTH_TOKEN_KEY } from './auth.constants';

export const authService = {
    login: async (email, password) => {
        // Pointing to /auth/login which is proxied in vite.config.js
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
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
    },

    logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
    }
};
