'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token invalide ou manquant');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch('/api/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setStatus('error');
                    setMessage(data.error || 'Une erreur est survenue');
                    return;
                }

                setStatus('success');
                setMessage('Votre email a été vérifié avec succès!');
            } catch (err) {
                setStatus('error');
                setMessage('Une erreur de connexion est survenue');
                console.error(err);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
                {status === 'loading' && (
                    <>
                        <div className="mb-6 flex justify-center">
                            <Loader className="w-16 h-16 text-blue-500 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Vérification en cours...
                        </h1>
                        <p className="text-gray-600">
                            Veuillez patienter pendant que nous vérifions votre email.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="mb-6 flex justify-center">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Email vérifié!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>
                        <p className="text-gray-600 text-sm mb-6">
                            Vous pouvez maintenant vous connecter à votre compte.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Aller à la connexion
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="mb-6 flex justify-center">
                            <AlertCircle className="w-16 h-16 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Erreur de vérification
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>
                        <p className="text-gray-600 text-sm mb-6">
                            Le lien peut être expiré. Veuillez vous inscrire à nouveau.
                        </p>
                        <Link
                            href="/register"
                            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Nouvelle inscription
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
