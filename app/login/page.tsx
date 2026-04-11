'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader, CheckCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
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

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Erreur de connexion');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);

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
            <div className="relative z-10 w-full flex items-center justify-center p-4">
                <div className="w-full max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
                                    <span>Gérez facilement vos demandes de composants</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                    <span>Suivi en temps réel de vos demandes</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                    <span>Accessible à tous les rôles académiques</span>
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

                                    {/* Welcome text */}
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion</h2>
                                        <p className="text-gray-600 text-sm">Accédez à votre compte HESTIM</p>
                                    </div>

                                    {/* Messages d'erreur ou succès */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 animate-slideIn">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2 animate-slideIn">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-green-700 text-sm">Connexion réussie! Redirection...</p>
                                        </div>
                                    )}

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Email input */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="nom@hestim.ma"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>

                                        {/* Password input */}
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Mot de passe
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Votre mot de passe"
                                                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remember & Forgot */}
                                        <div className="flex items-center justify-between text-xs">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" disabled={loading} />
                                                <span className="ml-2 text-gray-600">Se souvenir</span>
                                            </label>
                                            <Link href="#" className="text-red-600 hover:text-red-700 font-medium">
                                                Oublié?
                                            </Link>
                                        </div>

                                        {/* Submit button */}
                                        <button
                                            type="submit"
                                            disabled={loading || success}
                                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg text-sm"
                                        >
                                            {loading && <Loader className="w-4 h-4 animate-spin" />}
                                            {success ? '✓ Succès!' : loading ? 'Connexion...' : 'Se Connecter'}
                                        </button>
                                    </form>

                                    {/* Register link */}
                                    <p className="mt-5 text-center text-sm text-gray-600">
                                        Pas de compte? <Link href="/register" className="text-red-600 hover:text-red-700 font-semibold">S'inscrire</Link>
                                    </p>
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
            `}</style>
        </div>
    );
}
