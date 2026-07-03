
import { NextResponse } from 'next/server';
import {pool} from '@/lib/db';

export async function GET() {
    console.log('Received request for admin dashboard stats');
    try{
        // Vérifie d'abord que la vue existe
        const [viewExists]: any = await pool.query(
            "SELECT * FROM achat_dashboard_stats;"
        );

        if (!viewExists || viewExists.length === 0) {
            return NextResponse.json(
                { message: 'La vue achat_dashboard_stats n\'existe pas' },
                { status: 404 }
            );
        }

        const [stats]: any = await pool.query(
            'SELECT * FROM achat_dashboard_stats'
        );

        if (!stats || stats.length === 0) {
            return NextResponse.json(
                { message: 'Aucune statistique disponible', stats: [] },
                { status: 200 }
            );
        }
        return NextResponse.json({ stats: stats[0] }, { status: 200 });

    }catch(error){
        console.error('Error fetching stats:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        return NextResponse.json(
            { 
                message: 'Erreur serveur',
                error: errorMessage,
            },
            { status: 500 }
        );
    } 
}