'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import HeaderInfo from './components/HeaderInfo';
import InfoGrid from './components/InfoGrid';
import ComposantsList from './components/ComposantsList';
import HistoriqueSection from './components/HistoriqueSection';

interface Demande {
  id_demande: number;
  titre: string;
  description: string;
  progression: number;
  date_soumission: string;
  date_modification: string;
  status: string;
  groupe: {
    id_groupe: number;
    code_groupe: string;
    nom: string;
    filiere: string;
    annee: string;
  };
  etudiant: {
    nom: string;
    prenom: string;
    email: string;
  };
  encadrant?: {
    nom: string;
    prenom: string;
  } | null;
  laboratoire?: {
    nom: string;
    email: string;
  } | null;
  composants: Array<{
    id_ligne: number;
    id_composant: number;
    nom: string;
    reference: string;
    photo_lien: string | null;
    quantite_demandee: number;
    quantite_stock: number;
    disponible: boolean | null;
    existe: boolean | null;
    statut_disponibilite: string;
    commentaire_labo: string | null;
    commentaire: string;
  }>;
}

export default function DemandDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [demande, setDemande] = useState<Demande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchDemande = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/all-demands/${id}`);
        
        if (!response.ok) {
          throw new Error('Demande non trouvée');
        }
        
        const data = await response.json();
        setDemande(data.demande);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchDemande();
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 font-medium text-sm hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200 ease-in-out"
          >
            <ArrowLeft size={18} className="stroke-2" />
            Retour
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-4 border-blue-600"></div>
            <p className="mt-6 text-base md:text-lg text-gray-600 font-medium">Chargement des détails...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 md:p-6 text-red-700 text-base md:text-lg">
            {error}
          </div>
        ) : demande ? (
          <div className="space-y-6">
            <HeaderInfo 
              titre={demande.titre}
              description={demande.description}
              status={demande.status}
              progression={demande.progression}
            />

            <InfoGrid 
              etudiant={demande.etudiant}
              groupe={demande.groupe}
              encadrant={demande.encadrant}
              laboratoire={demande.laboratoire}
            />

            <ComposantsList composants={demande.composants} />

            <HistoriqueSection 
              dateSoumission={demande.date_soumission}
              dateModification={demande.date_modification}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
