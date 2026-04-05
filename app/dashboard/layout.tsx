import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Sidebar from './components/Sidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Récupérer et vérifier le token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            {/* Main content area */}
            <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Optional Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
