
'use client';

import { BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
    
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-900 to-red-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Bienvenue sur votre Dashboard</h2>
                <p className="text-blue-100">Gérez vos demandes de composants et suivez l'état de vos commandes</p>
            </div>
        </div>
    );
}