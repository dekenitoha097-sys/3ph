import { pool } from '@/lib/db';

export async function GET() {
    try {
        const [stats]: any = await pool.query(
            'SELECT * FROM admin_dashboard_stats'
        );

        if (!stats || stats.length === 0) {
            return new Response(
                JSON.stringify({ message: 'Aucune statistique disponible' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ stats: stats[0] }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching stats:', error);
        return new Response(
            JSON.stringify({ message: 'Erreur serveur' }),
            { status: 500 }
        );
    }
}
