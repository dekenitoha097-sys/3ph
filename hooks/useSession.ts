import { useEffect, useState } from "react";
import { fetchSession } from "../lib/auth";

export function useSession() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSession()
            .then(data => {
                setUser(data?.user || null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { user, loading };
}