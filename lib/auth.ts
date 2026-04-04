export async function fetchSession() {
    const res = await fetch('/api/profile', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) return null;

    return res.json();
}

