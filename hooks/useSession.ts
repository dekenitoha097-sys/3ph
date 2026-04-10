import { useEffect, useState } from "react";
import { fetchSession } from "../lib/auth";

export function useSession() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAndSetUser = async () => {
        try {
            const data = await fetchSession();
            setUser(data?.user || null);
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    };

    useEffect(() => {
        fetchAndSetUser().finally(() => {
            setLoading(false);
        });
    }, []);

    const refreshSession = async () => {
        return fetchAndSetUser();
    };

    return { user, loading, refreshSession };
}