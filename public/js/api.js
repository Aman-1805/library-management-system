// Helper to make API calls with JWT token
const api = {
    getToken: () => localStorage.getItem('token'),
    
    request: async (url, options = {}) => {
        const token = api.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        try {
            const response = await fetch(url, { ...options, headers });
            
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                window.location.href = '/login';
                return null;
            }
            
            const data = await response.json();
            return { ok: response.ok, status: response.status, data };
        } catch (error) {
            console.error('API request failed:', error);
            return { ok: false, status: 500, data: { error: 'Network error' } };
        }
    },
    
    get: (url) => api.request(url, { method: 'GET' }),
    post: (url, body) => api.request(url, { method: 'POST', body: JSON.stringify(body) }),
    delete: (url) => api.request(url, { method: 'DELETE' })
};

// Protect routes: redirect to login if no token and not on login page
if (!api.getToken() && !window.location.pathname.includes('/login')) {
    window.location.href = '/login';
}

// Logout handler
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
