'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Lien invalide</h1>
                    <p className="text-gray-600 mb-6">
                        Le lien de réinitialisation est invalide ou a expiré.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Erreur lors de la réinitialisation');
                return;
            }

            setSuccess(true);
            setFormData({
                newPassword: '',
                confirmPassword: '',
            });

            // Rediriger vers login après 2 secondes
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            setError('Une erreur est survenue');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Succès!</h1>
                    <p className="text-gray-600 mb-6">
                        Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Réinitialiser le mot de passe
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Entrez votre nouveau mot de passe
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Entrez votre nouveau mot de passe"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmez votre mot de passe"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Réinitialisation en cours...
                            </>
                        ) : (
                            'Réinitialiser le mot de passe'
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Retour à la{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                        connexion
                    </Link>
                </p>
            </div>
        </div>
    );
}
