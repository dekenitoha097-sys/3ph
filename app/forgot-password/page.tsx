'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email) {
            setError('Veuillez entrer votre email');
            return;
        }

        if (!email.endsWith('@hestim.ma')) {
            setError('Veuillez utiliser une adresse email @hestim.ma');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Une erreur est survenue');
                return;
            }

            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError('Une erreur de connexion est survenue');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h1>
                        <p className="text-gray-600 mb-6">
                            Un lien de réinitialisation a été envoyé à <span className="font-semibold">{email}</span>. 
                            Veuillez consulter votre boîte de réception et suivre les instructions.
                        </p>
                        <p className="text-gray-600 text-sm mb-6">
                            N'oubliez pas de vérifier votre dossier spam si vous ne voyez pas l'email.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
                <div className="text-center mb-8">
                    <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Mot de passe oublié?
                    </h1>
                    <p className="text-gray-600">
                        Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(null);
                            }}
                            placeholder="votre.email@hestim.ma"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
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
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5" />
                                Envoyer le lien
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-600 text-sm mb-2">
                        Vous vous souvenez de votre mot de passe?
                    </p>
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}
