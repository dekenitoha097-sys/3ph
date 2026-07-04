'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu,PackageCheck, X, Home, FileText, Users, BarChart3, Settings, LogOut, ShoppingCart, CheckCircle, Package, LayoutDashboard } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useSession() as { user: any, loading: boolean };

    // Fermer le menu au clic sur un lien
    const handleNavClick = () => {
        setIsOpen(false);
    };

    const handleLogout = async () => {
        // Appeler l'API logout pour effacer le cookie httpOnly côté serveur
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    };

    // Mapper le rôle de la base de données au type attendu
    const roleMap: Record<string, 'student' | 'supervisor' | 'lab' | 'admin' | 'achat'> = {
        'Étudiant': 'student',
        'etudiant': 'student',
        'Encadrant': 'supervisor',
        'encadrant': 'supervisor',
        'Laboratoire': 'lab',
        'laboratoire': 'lab',
        'Admin': 'admin',
        'admin': 'admin',
        'ADMIN': 'admin',
        'Administrateur': 'admin',
        'administrateur': 'admin',
        'Achat' : 'achat',
        'achat' : 'achat',
    };

    // Debug: Log le rôle reçu
    if (user?.role && !loading) {
        console.log('User role received:', user.role);
        console.log('Mapped role:', roleMap[user.role]);
    }

    // Déterminer le titre en fonction du sexe
    const getTitleBySex = (sexe: string) => {
        if (!sexe) return '';
        const sexeLower = sexe.toLowerCase();
        if (sexeLower === 'f' || sexeLower === 'femme' || sexeLower === 'female') {
            return 'Mme';
        }
        return 'Mr';
    };

    const userRole: 'student' | 'supervisor' | 'lab' | 'admin' | 'achat' = (user?.role && roleMap[user.role]) || 'student';
    const userTitle = user?.sexe ? getTitleBySex(user.sexe) : '';
    const userName = user ? `${userTitle} ${user.prenom} ${user.nom}` : 'Utilisateur';

    // Configuration des menus par rôle
    const menuConfig = {
        student: [
            { href: '/dashboard', label: 'Accueil', icon: Home },
            { href: '/dashboard/all-demands', label: 'Mes Demandes', icon: FileText },
            { href: '/dashboard/nouvelle-demande', label: 'Nouvelle Demande', icon: ShoppingCart },
        ],
        supervisor: [
            { href: '/dashboard', label: 'Accueil', icon: Home },
            { href: '/dashboard/all-demands', label: 'Demandes', icon: FileText },
        ],
        lab: [
            { href: '/dashboard', label: 'Accueil', icon: Home },
            { href: '/dashboard/all-demands', label: 'Demandes', icon: FileText },
            { href: '/dashboard/voir-demandes-encadrant', label: 'Voir Demandes Encadrant', icon: CheckCircle },
            { href: '/dashboard/recuperation_composant', label: 'Composants récupérés.', icon: PackageCheck },
            { href: '/dashboard/composants', label: 'Composants', icon: Package },

        ],
        admin: [
            { href: '/dashboard', label: 'Accueil', icon: Home },
            { href: '/dashboard/all-demands', label: 'Toutes Demandes', icon: FileText },
            { href: '/dashboard/utilisateur', label: 'Utilisateurs', icon: Users },
            { href: '/dashboard/gestion-des-affectations', label: 'Gestion des Affectations', icon: BarChart3 },
        ],
        achat: [
            { href: '/dashboard', label: 'Accueil', icon: Home },
            { href: '/dashboard/all-demands', label: 'Toutes Demandes', icon: FileText },
            { href: '/dashboard/composants', label: 'Composants', icon: Package },
            
        ]
    } as const;

    const menuItems = menuConfig[userRole];

    // Déterminer le titre du rôle
    const roleTitle = {
        student: 'Étudiant',
        supervisor: 'Encadrant',
        lab: 'Laboratoire',
        admin: 'Administrateur',
        achat: 'achat',
    }[userRole];

    if (loading) {
        return (
            <div className="hidden lg:flex">
                <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 h-screen flex items-center justify-center">
                    <div className="text-white">Chargement...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static
                top-0 left-0 h-screen
                w-64 transform transition-transform duration-300 lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                bg-gradient-to-b from-blue-900 to-blue-800
                border-r border-blue-700
                flex flex-col
                z-40
                shadow-xl
            `}>
                {/* Header Sidebar */}
                <div className="p-6 border-b border-blue-700">
                    <div className="flex items-center justify-between mb-4">
                        <img
                            src="https://candidature.hestim.ma/hestim_portal/static/description/img/hestim_white_logo.png"
                            alt="HESTIM"
                            className="h-10 object-contain"
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden text-white hover:bg-blue-700 p-1 rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-white">
                        <p className="text-xs text-blue-200">Connecté en tant que</p>
                        <p className="font-semibold text-sm truncate">{userName}</p>
                        <p className="text-xs text-blue-300 mt-1">{roleTitle}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleNavClick}
                                className={`
                                    flex items-center gap-3 px-4 py-2.5 rounded-lg
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="px-3 py-2">
                    <div className="border-t border-blue-700"></div>
                </div>

                {/* Settings & Logout */}
                <div className="p-3 space-y-2">
                    <Link
                        href="/dashboard/parametres"
                        onClick={handleNavClick}
                        className={`
                            flex items-center gap-3 px-4 py-2.5 rounded-lg
                            transition-all duration-200
                            ${pathname === '/dashboard/parametres'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                            }
                        `}
                    >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">Paramètres</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="
                            w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                            transition-all duration-200
                            text-blue-100 hover:bg-red-600 hover:text-white
                        "
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Hamburger Button (Mobile) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="
                    fixed lg:hidden top-4 right-4 z-50
                    bg-gradient-to-r from-blue-900 to-red-600
                    text-white p-3 rounded-full shadow-lg
                    hover:shadow-xl transition-all
                    border-2 border-blue-700
                    active:scale-95
                "
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </>
    );
}