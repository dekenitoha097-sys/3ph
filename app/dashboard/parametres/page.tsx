

'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { Eye, EyeOff, Loader, AlertCircle, CheckCircle, Save } from 'lucide-react';

interface ProfileData {
    nom: string;
    prenom: string;
    sexe: string;
}

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface GroupData {
    code_groupe: string;
}

export default function ParametersPage() {
    const { user, loading: sessionLoading, refreshSession } = useSession();
    const [profileData, setProfileData] = useState<ProfileData>({
        nom: '',
        prenom: '',
        sexe: '',
    });
    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [groupData, setGroupData] = useState<GroupData>({
        code_groupe: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);

    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [groupError, setGroupError] = useState<string | null>(null);
    const [groupSuccess, setGroupSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                nom: user.nom || '',
                prenom: user.prenom || '',
                sexe: user.sexe || '',
            });
        }
    }, [user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value,
        }));
        setProfileError(null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value,
        }));
        setPasswordError(null);
    };

    const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGroupData(prev => ({
            ...prev,
            [name]: value,
        }));
        setGroupError(null);
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(false);

        if (!profileData.nom.trim() || !profileData.prenom.trim()) {
            setProfileError('Le nom et le prénom sont requis');
            return;
        }

        setProfileLoading(true);

        try {
            const res = await fetch('/api/profile/update-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                setProfileError(data.error || 'Erreur lors de la mise à jour du profil');
                return;
            }

            setProfileSuccess(true);
            await refreshSession();
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (err) {
            setProfileError('Une erreur est survenue');
            console.error(err);
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError('Tous les champs sont requis');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Les mots de passe ne correspondent pas');
            return;
        }

        setPasswordLoading(true);

        try {
            const res = await fetch('/api/profile/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                setPasswordError(data.error || 'Erreur lors de la mise à jour du mot de passe');
                return;
            }

            setPasswordSuccess(true);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err) {
            setPasswordError('Une erreur est survenue');
            console.error(err);
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleGroupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGroupError(null);
        setGroupSuccess(false);

        if (!groupData.code_groupe.trim()) {
            setGroupError('Le code du groupe est requis');
            return;
        }

        setGroupLoading(true);

        try {
            const res = await fetch('/api/profile/update-groupe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupData),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                setGroupError(data.error || 'Erreur lors de la mise à jour du groupe');
                return;
            }

            setGroupSuccess(true);
            setGroupData({ code_groupe: '' });
            await refreshSession();
            setTimeout(() => setGroupSuccess(false), 3000);
        } catch (err) {
            setGroupError('Une erreur est survenue');
            console.error(err);
        } finally {
            setGroupLoading(false);
        }
    };

    if (sessionLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Paramètres</h1>

            {/* Informations de profil - Affichage */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de profil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded p-4">
                        <p className="text-sm text-gray-600">Prénom</p>
                        <p className="text-lg font-medium text-gray-900">{user?.prenom || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <p className="text-sm text-gray-600">Nom</p>
                        <p className="text-lg font-medium text-gray-900">{user?.nom || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-medium text-gray-900">{user?.email || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <p className="text-sm text-gray-600">Rôle</p>
                        <p className="text-lg font-medium text-gray-900">
                            {user?.role ? (
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    {user.role}
                                </span>
                            ) : (
                                '-'
                            )}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <p className="text-sm text-gray-600">Sexe</p>
                        <p className="text-lg font-medium text-gray-900">
                            {user?.sexe === 'M' ? 'Homme' : user?.sexe === 'F' ? 'Femme' : '-'}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <p className="text-sm text-gray-600">Groupe</p>
                        <p className="text-lg font-medium text-gray-900">
                            {user?.id_groupe ? `Groupe #${user.id_groupe}` : 'Aucun groupe'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modification des informations de profil */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Modifier les informations</h2>

                {profileError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700">{profileError}</p>
                    </div>
                )}

                {profileSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-green-700">Profil mis à jour avec succès</p>
                    </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                name="prenom"
                                value={profileData.prenom}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={profileLoading}
                                placeholder="Entrez votre prénom"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom
                            </label>
                            <input
                                type="text"
                                name="nom"
                                value={profileData.nom}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={profileLoading}
                                placeholder="Entrez votre nom"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sexe
                        </label>
                        <select
                            name="sexe"
                            value={profileData.sexe}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            disabled={profileLoading}
                        >
                            <option value="">Non spécifié</option>
                            <option value="M">Homme</option>
                            <option value="F">Femme</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {profileLoading && <Loader size={18} className="animate-spin" />}
                        {profileLoading ? 'Mise à jour...' : <><Save size={18} /> Enregistrer les modifications</>}
                    </button>
                </form>
            </div>

            {/* Modification du mot de passe */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Changer le mot de passe</h2>

                {passwordError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700">{passwordError}</p>
                    </div>
                )}

                {passwordSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-green-700">Mot de passe mis à jour avec succès</p>
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe actuel
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={passwordLoading}
                                placeholder="Entrez votre mot de passe actuel"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={passwordLoading}
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={passwordLoading}
                                placeholder="Entrez votre nouveau mot de passe"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={passwordLoading}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={passwordLoading}
                                placeholder="Confirmez votre nouveau mot de passe"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={passwordLoading}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                        Le mot de passe doit contenir au moins 6 caractères.
                    </div>

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {passwordLoading && <Loader size={18} className="animate-spin" />}
                        {passwordLoading ? 'Mise à jour...' : <><Save size={18} /> Changer le mot de passe</>}
                    </button>
                </form>
            </div>

            {/* Gestion du groupe */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Rejoindre un groupe</h2>

                {groupError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700">{groupError}</p>
                    </div>
                )}

                {groupSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-green-700">Groupe mis à jour avec succès</p>
                    </div>
                )}

                <form onSubmit={handleGroupSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code du groupe
                        </label>
                        <input
                            type="text"
                            name="code_groupe"
                            value={groupData.code_groupe}
                            onChange={handleGroupChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            disabled={groupLoading}
                            placeholder="Entrez le code du groupe"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                            Demandez le code du groupe à votre encadrant.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={groupLoading}
                        className="w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {groupLoading && <Loader size={18} className="animate-spin" />}
                        {groupLoading ? 'Mise à jour...' : <><Save size={18} /> Rejoindre le groupe</>}
                    </button>
                </form>
            </div>
        </div>
    );
}