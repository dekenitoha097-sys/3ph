'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader, CheckCircle, User, Users } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        sexe: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.nom || !formData.prenom || !formData.sexe || !formData.email || !formData.password || !formData.password_confirmation) {
            setError('Veuillez remplir tous les champs');
            return false;
        }

        if (!formData.email.endsWith('@hestim.ma')) {
            setError('Veuillez utiliser une adresse email @hestim.ma');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        if (formData.password !== formData.password_confirmation) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Erreur lors de l\'inscription');
            }

            setSuccess(true);
            // Ne pas rediriger automatiquement - laisser l'utilisateur voir le message

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex relative overflow-hidden">
            {/* Décoration background avec couleurs HESTIM exactes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Blob Bleu Marine (#001A4D) - centre et coins */}
                <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob" style={{backgroundColor: '#001A4D'}}></div>
                
                {/* Blob Rouge Vif (#E63946) - bas gauche */}
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-35 animate-blob animation-delay-2000" style={{backgroundColor: '#E63946'}}></div>
                
                {/* Blob Orange (#F4A261) - droite milieu */}
                <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-3000" style={{backgroundColor: '#F4A261'}}></div>

                {/* Blob Vert (#2A9D8F) - centre bas */}
                <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-4000" style={{backgroundColor: '#2A9D8F'}}></div>

                {/* Blob Bleu Marine secondaire - haut gauche */}
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-5000" style={{backgroundColor: '#001A4D'}}></div>

                {/* Gradient overlay subtil du haut */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10"></div>
            </div>

            {/* Contenu Principal */}
            <div className="relative z-10 w-full flex items-center justify-center p-4 py-8">
                <div className="w-full max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:items-center">
                        {/* Colonne Gauche - Branding */}
                        <div className="hidden lg:flex flex-col justify-center items-center text-center">
                            <div className="mb-6 animate-fadeInLeft">
                                <img 
                                    src="https://candidature.hestim.ma/hestim_portal/static/description/img/hestim_white_logo.png" 
                                    alt="HESTIM Logo" 
                                    className="h-32 mx-auto object-contain drop-shadow-lg"
                                />
                            </div>
                            <h1 className="text-5xl font-bold text-black mb-3 animate-fadeInLeft" style={{animationDelay: '0.1s'}}>HESTIM</h1>
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400 font-bold text-xl mb-6 animate-fadeInLeft" style={{animationDelay: '0.2s'}}>Système de Gestion des Demandes</p>
                            <p className="text-gray-300 text-lg mb-8 animate-fadeInLeft" style={{animationDelay: '0.3s'}}>Composants Académiques</p>
                            
                            <div className="space-y-4 text-gray-400 text-sm max-w-xs">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                    <span>Créez votre compte facilement</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                    <span>Accès sécurisé et authentifié</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                    <span>Gérez vos demandes en toute simplicité</span>
                                </div>
                            </div>
                        </div>

                        {/* Colonne Droite - Formulaire */}
                        <div className="w-full">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-98">
                                <div className="px-6 py-8 sm:px-8">
                                    {/* Logo mobile */}
                                    <div className="lg:hidden text-center mb-6">
                                        <img 
                                            src="https://candidature.hestim.ma/hestim_portal/static/description/img/hestim_white_logo.png" 
                                            alt="HESTIM Logo" 
                                            className="h-16 mx-auto object-contain"
                                        />
                                    </div>

                                    {!success && (
                                        <>
                                            <div className="mb-6">
                                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Inscription</h2>
                                                <p className="text-gray-600 text-sm">Créez votre compte HESTIM</p>
                                            </div>

                                            {error && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 animate-slideIn">
                                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                    <p className="text-red-700 text-sm">{error}</p>
                                                </div>
                                            )}

                                            <form onSubmit={handleSubmit} className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                <label htmlFor="nom" className="block text-xs font-medium text-gray-700 mb-1">
                                                    Nom
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                                    <input
                                                        id="nom"
                                                        type="text"
                                                        name="nom"
                                                        value={formData.nom}
                                                        onChange={handleChange}
                                                        placeholder="Nom"
                                                        className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="prenom" className="block text-xs font-medium text-gray-700 mb-1">
                                                    Prénom
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                                    <input
                                                        id="prenom"
                                                        type="text"
                                                        name="prenom"
                                                        value={formData.prenom}
                                                        onChange={handleChange}
                                                        placeholder="Prénom"
                                                        className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sexe */}
                                        <div>
                                            <label htmlFor="sexe" className="block text-xs font-medium text-gray-700 mb-1">
                                                Genre
                                            </label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <select
                                                    id="sexe"
                                                    name="sexe"
                                                    value={formData.sexe}
                                                    onChange={handleChange}
                                                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none text-sm"
                                                    disabled={loading}
                                                >
                                                    <option value="">Sélectionner</option>
                                                    <option value="Homme">Homme</option>
                                                    <option value="Femme">Femme</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Email input */}
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="nom@hestim.ma"
                                                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>

                                        {/* Password input */}
                                        <div>
                                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                                Mot de passe
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="6+ caractères"
                                                    className="w-full pl-9 pr-10 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password input */}
                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-xs font-medium text-gray-700 mb-1">
                                                Confirmer
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="password_confirmation"
                                                    value={formData.password_confirmation}
                                                    onChange={handleChange}
                                                    placeholder="Confirmer"
                                                    className="w-full pl-9 pr-10 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
                                                    disabled={loading}
                                                >
                                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit button */}
                                        <button
                                            type="submit"
                                            disabled={loading || success}
                                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg text-sm mt-4"
                                        >
                                            {loading && <Loader className="w-4 h-4 animate-spin" />}
                                            {success ? '✓ Inscrit!' : loading ? 'Inscription...' : 'S\'Inscrire'}
                                                </button>
                                            </form>

                                            <p className="mt-4 text-center text-sm text-gray-600">
                                                Vous avez un compte? <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold">Se connecter</Link>
                                            </p>
                                        </>
                                    )}

                                    {success && (
                                        <div className="text-center py-8">
                                            <div className="mb-6 flex justify-center">
                                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Inscription réussie!</h2>
                                            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg p-5 mb-6">
                                                <p className="text-gray-700 mb-2">
                                                    Un email de vérification a été envoyé à:
                                                </p>
                                                <p className="font-semibold text-lg text-blue-600 mb-4">{formData.email}</p>
                                                <p className="text-sm text-gray-600">
                                                    ⚠️ Avant de pouvoir vous connecter, vous devez d'abord <span className="font-bold text-red-600">vérifier votre adresse email</span>.
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                                                <p className="text-gray-900 font-bold text-center mb-3 text-lg">📋 Prochaines étapes:</p>
                                                <ol className="text-gray-700 text-sm space-y-3">
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                                                        <span>Ouvrez votre boîte mail (recherchez un email de HESTIM)</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                                                        <span>Cliquez sur le lien <span className="font-semibold">"Vérifier mon email"</span></span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                                                        <span>Confirmez votre adresse email</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                                                        <span>Retournez vous connecter avec vos identifiants</span>
                                                    </li>
                                                </ol>
                                            </div>
                                            <p className="text-gray-600 text-xs mb-6 italic">
                                                💡 N'oubliez pas de vérifier votre dossier SPAM si vous ne voyez pas l'email
                                            </p>
                                            <button
                                                onClick={() => router.push('/login')}
                                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                                            >
                                                ← Retourner à la connexion
                                            </button>
                                            <p className="text-gray-500 text-xs mt-4">
                                                Une fois votre email vérifié, vous pourrez vous connecter normalement
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-3 sm:px-8 bg-gray-50 border-t border-gray-100 text-center">
                                    <p className="text-xs text-gray-500">© 2024 HESTIM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-3000 {
                    animation-delay: 3s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-5000 {
                    animation-delay: 5s;
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                .animate-fadeInLeft {
                    animation: fadeInLeft 0.6s ease-out;
                }
                .animation-delay-5000 {
                    animation-delay: 5s;
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                .animate-fadeInLeft {
                    animation: fadeInLeft 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}
