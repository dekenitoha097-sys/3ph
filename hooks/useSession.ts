import { useEffect, useState } from "react";
import { fetchSession } from "../lib/auth";

interface User {
    id?: number;
    id_utilisateur?: number;
    nom?: string;
    prenom?: string;
    email?: string;
    role?: string;
    sexe?: string;
    id_groupe?: number;
}

export function useSession() {
    const [user, setUser] = useState<User | null>(null);
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