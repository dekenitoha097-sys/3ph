'use client';

import { useState, useEffect } from 'react';
import {
    BookOpen, Clock, CheckCircle, XCircle, TrendingUp,
    Package, Eye, Inbox, Loader, AlertCircle, AlertTriangle
} from 'lucide-react';

interface LaboratoireStats {
    id_utilisateur: number;
    total_demandes_traitees: number;
    demandes_a_traiter: number;
    demandes_completees: number;
    demandes_transmis_admin: number;
    demandes_alternative_proposee: number;
    total_composants_demandes: number;
    composants_disponibles: number;
    composants_indisponibles: number;
    composants_non_evalues: number;
    taux_traitement_percent: number | string;
    taux_disponibilite_percent: number | string;
    progression_moyenne_demandes: number | string;
    notifications_non_lues: number;
    notifications_totales: number;
}

export default function LaboratoireDashboard() {
    const [stats, setStats] = useState<LaboratoireStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const safeNumber = (value: any) => Number(value ?? 0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const response = await fetch('/api/dashboard/laboratoire_dashboard_stats');
                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Erreur lors du chargement des statistiques');
                    return;
                }

                setStats(data.data);
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
            <div className="bg-red-50 rounded-lg shadow-sm p-4 flex items-start gap-3">
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
                <h1 className="text-3xl font-bold mb-2">Dashboard Laboratoire</h1>
                <p className="text-blue-100">Vue d'ensemble des statistiques</p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <Card
                    title="Demandes Traitées"
                    value={stats.total_demandes_traitees}
                    icon={<BookOpen />}
                    color="text-blue-600"
                />

                <Card
                    title="À Traiter"
                    value={stats.demandes_a_traiter}
                    icon={<Clock />}
                    color="text-yellow-600"
                />

                <Card
                    title="Taux Traitement"
                    value={`${safeNumber(stats.taux_traitement_percent).toFixed(1)}%`}
                    icon={<CheckCircle />}
                    color="text-green-600"
                />

                <Card
                    title="Taux Disponibilité"
                    value={`${safeNumber(stats.taux_disponibilite_percent).toFixed(1)}%`}
                    icon={<Package />}
                    color="text-indigo-600"
                />
            </div>

            {/* STATUT */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Statuts
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MiniStat label="Complétées" value={stats.demandes_completees} color="text-green-600" />
                    <MiniStat label="Transmis Admin" value={stats.demandes_transmis_admin} color="text-orange-600" />
                    <MiniStat label="Révision" value={stats.demandes_alternative_proposee} color="text-purple-600" />
                </div>
            </div>

            {/* COMPOSANTS */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    Composants
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <MiniStat label="Total" value={stats.total_composants_demandes} />
                    <MiniStat label="Disponibles" value={stats.composants_disponibles} color="text-green-600" />
                    <MiniStat label="Indisponibles" value={stats.composants_indisponibles} color="text-red-600" />
                    <MiniStat label="Non évalués" value={stats.composants_non_evalues} color="text-yellow-600" />

                </div>
            </div>

            {/* PROGRESSION */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-600" />
                    Progression
                </h3>

                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-cyan-500 h-3 rounded-full"
                        style={{
                            width: `${Math.min(safeNumber(stats.progression_moyenne_demandes), 100)}%`
                        }}
                    />
                </div>

                <p className="mt-2 text-sm text-gray-600">
                    {safeNumber(stats.progression_moyenne_demandes).toFixed(1)}%
                </p>
            </div>

            {/* NOTIFICATIONS */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-purple-600" />
                    Notifications
                </h3>

                <div className="flex justify-between">
                    <span>Non lues</span>
                    <span className="font-bold text-red-600">{stats.notifications_non_lues}</span>
                </div>

                <div className="flex justify-between mt-2">
                    <span>Total</span>
                    <span className="font-bold">{stats.notifications_totales}</span>
                </div>
            </div>

        </div>
    );
}

/* ===== UI COMPONENTS ===== */

function Card({ title, value, icon, color }: any) {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
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
        <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
    );
}