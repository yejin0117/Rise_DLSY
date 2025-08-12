// src/utils/auth.js
export const TOKEN_KEY = 'jwtToken';

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('isLoggedIn', 'true');
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('isLoggedIn');
}

// Authorization 헤더 자동 추가 + 401/403 에서만 토큰 제거
export async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = new Headers(options.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
        clearToken();
    }
    return res;
}
