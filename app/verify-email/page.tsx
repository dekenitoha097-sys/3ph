import { Suspense } from 'react';
import VerifyEmailForm from './VerifyEmailForm';
import { Loader } from 'lucide-react';

function VerifyEmailLoading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
                <div className="mb-6 flex justify-center">
                    <Loader className="w-16 h-16 text-blue-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Vérification en cours...
                </h1>
                <p className="text-gray-600">
                    Veuillez patienter pendant que nous vérifions votre email.
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<VerifyEmailLoading />}>
            <VerifyEmailForm />
        </Suspense>
    );
}
