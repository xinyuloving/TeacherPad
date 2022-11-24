export function getToken() {
    return localStorage.getItem('teacher_token')
}

export function setToken(token) {
    return localStorage.setItem('teacher_token', token)
}

export function removeToken() {
    return localStorage.removeItem('teacher_token')
}

export function handleSessionData(...rest) {
    if (rest.length === 2) {
        sessionStorage.setItem(rest[0], rest[1]);
    } else {
        return sessionStorage.getItem(rest[0]);
    }
}

export function removeSessionData(key) {
    sessionStorage.removeItem(key);
}