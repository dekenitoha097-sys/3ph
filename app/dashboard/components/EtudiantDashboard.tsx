'use client';

import { useState, useEffect } from 'react';
import { 
    BookOpen, Clock, CheckCircle, XCircle, TrendingUp, AlertTriangle, 
    Package, Eye, BarChart4, Inbox, Loader, AlertCircle 
} from 'lucide-react';

interface StudentStats {
    id_utilisateur: number;
    total_demandes: number;
    demandes_en_attente: number;
    demandes_en_revision: number;
    demandes_en_cour_traitement: number;
    demandes_valide: number;
    demandes_transmis_labo: number;
    demandes_materiel_fourni: number;
    demandes_transmis_admin: number;
    demandes_commande_lancee: number;
    demandes_alternative_proposee: number;
    demandes_rejete: number;
    demandes_en_cours: number;
    taux_completion_percent: string;
    taux_rejet_percent: string;
    progression_moyenne_demandes: string;
    total_composants_demandes: number;
    composants_disponibles: number;
    composants_indisponibles: number;
    composants_non_evalues: number;
    notifications_non_lues: number;
    notifications_totales: number;
}

export default function EtudiantDashboard() {
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/dashboard/etudiant_dashboard_stats');
                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || 'Erreur lors du chargement des statistiques');
                    return;
                }

                setStats(data.stats);
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
            {/* En-tête */}
            <div className="bg-gradient-to-r from-blue-900 to-red-600 text-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Dashboard Étudiant</h1>
                <p className="text-blue-100">Vue d'ensemble de vos statistiques</p>
            </div>

            {/* ========== CARTES STATISTIQUES PRINCIPALES ========== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Demandes */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Demandes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_demandes}</p>
                        </div>
                        <BookOpen className="w-10 h-10 text-blue-600 " />
                    </div>
                </div>

                {/* Demandes En Cours */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">En Cours</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.demandes_en_cours}</p>
                        </div>
                        <Clock className="w-10 h-10 text-yellow-500 " />
                    </div>
                </div>

                {/* Taux Completion */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Taux Complétude</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{stats.taux_completion_percent}%</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-600 " />
                    </div>
                </div>

                {/* Taux Rejet */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Taux Rejet</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">{stats.taux_rejet_percent}%</p>
                        </div>
                        <XCircle className="w-10 h-10 text-red-600 " />
                    </div>
                </div>
            </div>

            {/* ========== STATUT DES DEMANDES ========== */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        Statut de Mes Demandes
                    </h3>
                </div>
                <div className="p-6 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { label: 'En attente', value: stats.demandes_en_attente, icon: Clock, color: 'text-yellow-500' },
                            { label: 'En révision', value: stats.demandes_en_revision, icon: Eye, color: 'text-blue-500' },
                            { label: 'En traitement', value: stats.demandes_en_cour_traitement, icon: BarChart4, color: 'text-purple-500' },
                            { label: 'Validées', value: stats.demandes_valide, icon: CheckCircle, color: 'text-green-500' },
                            { label: 'Transmis Labo', value: stats.demandes_transmis_labo, icon: Package, color: 'text-indigo-500' },
                            { label: 'Matériel Fourni', value: stats.demandes_materiel_fourni, icon: CheckCircle, color: 'text-emerald-500' },
                            { label: 'Transmis Admin', value: stats.demandes_transmis_admin, icon: AlertTriangle, color: 'text-amber-500' },
                            { label: 'Commande Lancée', value: stats.demandes_commande_lancee, icon: TrendingUp, color: 'text-cyan-500' },
                            { label: 'Alternative Proposée', value: stats.demandes_alternative_proposee, icon: AlertTriangle, color: 'text-orange-500' },
                            { label: 'Rejetées', value: stats.demandes_rejete, icon: XCircle, color: 'text-red-500' },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Icon className={`w-5 h-5 ${item.color}`} />
                                    <div>
                                        <p className="text-xs text-gray-600">{item.label}</p>
                                        <p className="text-lg font-bold text-gray-900">{item.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ========== GESTION COMPOSANTS ========== */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-600" />
                        Composants Demandés
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                        <div>
                            <p className="text-xs text-emerald-700">Disponibles</p>
                            <p className="text-2xl font-bold text-emerald-900">{stats.composants_disponibles}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                        <XCircle className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="text-xs text-red-700">Indisponibles</p>
                            <p className="text-2xl font-bold text-red-900">{stats.composants_indisponibles}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                        <div>
                            <p className="text-xs text-amber-700">Non Évalués</p>
                            <p className="text-2xl font-bold text-amber-900">{stats.composants_non_evalues}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Package className="w-6 h-6 text-blue-600" />
                        <div>
                            <p className="text-xs text-blue-700">Total Uniques</p>
                            <p className="text-2xl font-bold text-blue-900">{stats.total_composants_demandes}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== PROGRESSION & NOTIFICATIONS ========== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progression Moyenne */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-cyan-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyan-600" />
                            Progression Moyenne
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700 font-semibold">{parseFloat(stats.progression_moyenne_demandes).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-full transition-all duration-300"
                                style={{ width: `${Math.min(parseFloat(stats.progression_moyenne_demandes), 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Inbox className="w-5 h-5 text-purple-600" />
                            Notifications
                        </h3>
                    </div>
                    <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <span className="text-red-700 font-medium">Non Lues</span>
                            <span className="text-2xl font-bold text-red-900">{stats.notifications_non_lues}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-blue-700 font-medium">Total</span>
                            <span className="text-2xl font-bold text-blue-900">{stats.notifications_totales}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
