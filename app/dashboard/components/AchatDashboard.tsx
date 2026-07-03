'use client';

import { useState, useEffect } from 'react';
import {
    BookOpen, Clock, CheckCircle, XCircle, TrendingUp,
    Package, Eye, Inbox, Loader, AlertCircle, AlertTriangle
} from 'lucide-react';

    interface LaboratoireStats {
        total_composants: number;
        composants_disponibles: number;
        composants_indisponibles: number;
    }

export default function AchatDashboard() {
    const [stats, setStats] = useState<LaboratoireStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const safeNumber = (value: any) => Number(value ?? 0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const response = await fetch('/api/dashboard/achat_dashboad_stats');
                const data = await response.json();

                console.log(data)

                if (!response.ok) {
                    setError(data.error || 'Erreur lors du chargement des statistiques');
                    return;
                }

                setStats(data.stats);
                console.log("Stats : ",stats)
                setError(null);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold text-red-900">Erreur</p>
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return <div className="text-gray-600">Aucune statistique disponible</div>;
    }

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-900 to-red-600 text-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Dashboard Achat</h1>
                <p className="text-blue-100">Vue d'ensemble des statistiques</p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

               
                <Card
                    title="Total composants"
                    value={stats.total_composants}
                    icon={<Package />}
                    color="text-indigo-600"
                />

                <Card
                    title="Composants Disponibilité"
                    value={stats.composants_disponibles}
                    icon={<Package />}
                    color="text-indigo-600"
                />

                <Card
                    title="Composants indisponibles"
                    value={stats.composants_indisponibles}
                    icon={<Package />}
                    color="text-indigo-600"
                />
            </div>


        </div>
    );
}

/* ===== UI COMPONENTS ===== */

function Card({ title, value, icon, color }: any) {
    return (
        <div className="bg-white  rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
                <div className="text-gray-400">{icon}</div>
            </div>
        </div>
    );
}

function MiniStat({ label, value, color = "text-gray-900" }: any) {
    return (
        <div className="bg-gray-50 border rounded-lg p-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
    );
}