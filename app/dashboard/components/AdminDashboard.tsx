'use client';

import { useEffect, useState } from 'react';
import {
    AlertTriangle, Users, Package, FileText, CheckCircle, XCircle,
    Clock, Eye, EyeOff, Zap, TrendingUp, Database,
    Layers, Lock, BarChart4, Inbox, BookOpen
} from 'lucide-react';

interface AdminStats {
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
    total_utilisateurs: number;
    total_etudiants: number;
    total_encadrants: number;
    total_laboratoire: number;
    total_admins: number;
    total_groupes: number;
    total_composants: number;
    quantite_totale_composants: number;
    composants_rupture_stock: number;
    composants_stock_faible: number;
    total_lignes_demande: number;
    lignes_disponibles: number;
    lignes_indisponibles: number;
    lignes_non_evaluees: number;
    total_historique: number;
    notifications_non_lues: number;
    notifications_lues: number;
    notifications_totales: number;
    encadrants_assignes: number;
    groupes_supervises: number;
    progression_moyenne_demandes: number;
    taux_completion_percent: number;
    taux_rejet_percent: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard/admin_dashboard_stats');
                if (!res.ok) throw new Error('Erreur lors du chargement des statistiques');
                const data = await res.json();
                setStats(data.stats);
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
            <div className="flex items-center justify-center p-8">
                <div className="text-xl text-gray-600">Chargement des statistiques...</div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="p-6 bg-red-100 text-red-800 rounded-lg">
                {error || 'Erreur lors du chargement'}
            </div>
        );
    }

    // Statistiques clés
    const keyStats = [
        {
            label: 'Demandes Totales',
            value: stats.total_demandes,
            icon: FileText,
            color: 'bg-blue-500',
            trend: 'neutral',
        },
        {
            label: 'Utilisateurs',
            value: stats.total_utilisateurs,
            icon: Users,
            color: 'bg-purple-500',
            trend: 'neutral',
        },
        {
            label: 'Taux Completion',
            value: `${stats.taux_completion_percent}%`,
            icon: CheckCircle,
            color: 'bg-green-500',
            trend: 'up',
        },
        {
            label: 'Taux Rejet',
            value: `${stats.taux_rejet_percent}%`,
            icon: XCircle,
            color: 'bg-red-500',
            trend: 'down',
        },
    ];

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-blue-900 to-red-600 text-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Dashboard Administrateur</h1>
                <p className="text-blue-100">Vue d'ensemble complète du système</p>
            </div>

            {/* Clés statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {keyStats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-full`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sections détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demandes par statut */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" />Statut des Demandes</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-500" />En attente</span>
                            <span className="font-semibold bg-yellow-100 px-3 py-1 rounded">{stats.demandes_en_attente}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500" />En révision</span>
                            <span className="font-semibold bg-blue-100 px-3 py-1 rounded">{stats.demandes_en_revision}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Validées</span>
                            <span className="font-semibold bg-green-100 px-3 py-1 rounded">{stats.demandes_valide}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Package className="w-4 h-4 text-purple-500" />Transmis labo</span>
                            <span className="font-semibold bg-purple-100 px-3 py-1 rounded">{stats.demandes_transmis_labo}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Zap className="w-4 h-4 text-green-600" />Matériel fourni</span>
                            <span className="font-semibold bg-green-100 px-3 py-1 rounded">{stats.demandes_materiel_fourni}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" />Rejetées</span>
                            <span className="font-semibold bg-red-100 px-3 py-1 rounded">{stats.demandes_rejete}</span>
                        </div>
                    </div>
                </div>

                {/* Utilisateurs */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" />Répartition Utilisateurs</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" />Étudiants</span>
                            <span className="font-semibold bg-blue-100 px-3 py-1 rounded">{stats.total_etudiants}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" />Encadrants</span>
                            <span className="font-semibold bg-purple-100 px-3 py-1 rounded">{stats.total_encadrants}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Database className="w-4 h-4 text-green-500" />Laboratoire</span>
                            <span className="font-semibold bg-green-100 px-3 py-1 rounded">{stats.total_laboratoire}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 flex items-center gap-2"><Lock className="w-4 h-4 text-red-500" />Administrateurs</span>
                            <span className="font-semibold bg-red-100 px-3 py-1 rounded">{stats.total_admins}</span>
                        </div>
                    </div>
                </div>

                {/* Composants */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-orange-600" />Gestion Composants</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Layers className="w-4 h-4 text-blue-500" />Total composants</span>
                            <span className="font-semibold">{stats.total_composants}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><BarChart4 className="w-4 h-4 text-cyan-500" />Quantité totale</span>
                            <span className="font-semibold">{stats.quantite_totale_composants} unités</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                Rupture stock
                            </span>
                            <span className="font-semibold text-red-600">{stats.composants_rupture_stock}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                Stock faible
                            </span>
                            <span className="font-semibold text-yellow-600">{stats.composants_stock_faible}</span>
                        </div>
                    </div>
                </div>

                {/* Lignes de demande */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-teal-600" />Disponibilité Composants</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Disponibles</span>
                            <span className="font-semibold bg-green-100 px-3 py-1 rounded">{stats.lignes_disponibles}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" />Indisponibles</span>
                            <span className="font-semibold bg-red-100 px-3 py-1 rounded">{stats.lignes_indisponibles}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 flex items-center gap-2"><EyeOff className="w-4 h-4 text-gray-500" />Non évaluées</span>
                            <span className="font-semibold bg-gray-100 px-3 py-1 rounded">{stats.lignes_non_evaluees}</span>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Inbox className="w-5 h-5 text-indigo-600" />Notifications</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" />Non lues</span>
                            <span className="font-semibold bg-red-100 px-3 py-1 rounded">{stats.notifications_non_lues}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Lues</span>
                            <span className="font-semibold bg-green-100 px-3 py-1 rounded">{stats.notifications_lues}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 font-semibold flex items-center gap-2"><Inbox className="w-4 h-4 text-indigo-500" />Total</span>
                            <span className="font-semibold">{stats.notifications_totales}</span>
                        </div>
                    </div>
                </div>

                {/* Groupes & Encadrants */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-emerald-600" />Organisation</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-500" />Groupes</span>
                            <span className="font-semibold">{stats.total_groupes}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" />Encadrants assignés</span>
                            <span className="font-semibold">{stats.encadrants_assignes}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 flex items-center gap-2"><Layers className="w-4 h-4 text-amber-500" />Groupes supervisés</span>
                            <span className="font-semibold">{stats.groupes_supervises}</span>
                        </div>
                    </div>
                </div>

                {/* Progression */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-sky-600" />Progression Globale</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-gray-600 text-sm">Progression moyenne</p>
                                <p className="text-2xl font-bold text-blue-600">{Math.round(stats.progression_moyenne_demandes || 0)}%</p>
                            </div>
                            <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-blue-600 h-4 rounded-full transition-all"
                                        style={{ width: `${Math.min(stats.progression_moyenne_demandes || 0, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historique */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-rose-600" />Audit & Historique</h3>
                <div className="text-center py-4">
                    <p className="text-gray-600 flex items-center justify-center gap-2"><Database className="w-5 h-5 text-gray-500" />Entrées d'historique: <span className="font-bold text-lg text-rose-600">{stats.total_historique}</span></p>
                </div>
            </div>
        </div>
    );
}
