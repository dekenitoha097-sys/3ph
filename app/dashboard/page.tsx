
'use client';

import {useSession} from '@/hooks/useSession';
import AdminDashboard from './components/AdminDashboard';
import EtudiantDashboard from './components/EtudiantDashboard';
import EncadrantDashboard from './components/EncadrantDashboard';
import LaboratoireDashboard from './components/LaboratoireDashboard';

export default function DashboardPage() {

    const { user, loading } = useSession() as { user: any, loading: boolean };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">

            {/* Admin Dashboard */}
            {user?.role === 'admin' && <AdminDashboard />}
            {user?.role === 'etudiant' && <EtudiantDashboard />}
            {user?.role === 'encadrant' && <EncadrantDashboard />}
            {user?.role === 'laboratoire' && <LaboratoireDashboard />}
            {user?.role === 'achat' && <></>}
        </div>
    );
}