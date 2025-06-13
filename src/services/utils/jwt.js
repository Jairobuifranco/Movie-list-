export const decodeJWT = (token) => {
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Failed to decode token", e);
        return null;
    }
};
