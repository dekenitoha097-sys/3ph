'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import HeaderInfo from './components/HeaderInfo';
import InfoGrid from './components/InfoGrid';
import ComposantsList from './components/ComposantsList';
import HistoriqueSection from './components/HistoriqueSection';
import DiscussionPanel from './components/DiscussionPanel';

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
  encadrants?: Array<{
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email: string;
  }>;
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
  const { user } = useSession();

  const [demande, setDemande] = useState<Demande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  async function handleUpdateDemande(id_st: number, progression: number) {
    try {
      const response = await fetch(`/api/dashboard/all-demands/update_demande`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_demande: id, id_status: id_st, progression: progression }),

      });
      if (!response.ok) {
        const errorData = await response.json();
        setMessage('Erreur lors de la mise à jour de la demande');
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la demande');
      }

      const data = await response.json();
      setMessage(data.message || 'Demande mise à jour avec succès');

      // Rafraîchir les données de la demande après la mise à jour
      const updatedDemandeResponse = await fetch(`/api/dashboard/all-demands/${id}`);
      if (!updatedDemandeResponse.ok) {
        throw new Error('Erreur lors du rafraîchissement de la demande');
      }
      const updatedData = await updatedDemandeResponse.json();
      setDemande(updatedData.demande);
      setError('');

    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error);
    }
  }

  setTimeout(() => {
    setMessage('');
  }, 5000);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      {
        message && (
          <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-lg p-4 md:p-6 text-green-700 text-base md:text-lg">
            {message}
          </div>
        )
      }
      <div className="w-full">
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-gray-700 font-medium text-sm hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200 ease-in-out"
          >
            <ArrowLeft size={18} className="stroke-2" />
            Retour
          </button>
          <div className="flex gap-2">
            {user?.role === 'etudiant' && demande?.status !== 'valide' && demande?.status !== 'pret' && demande?.status !== 'recupere' && (
              <button
                onClick={() => router.push(`/dashboard/all-demands/${id}/edit`)}
                className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-blue-700 font-medium text-sm hover:text-blue-900 hover:bg-blue-200 rounded-lg transition-all duration-200 ease-in-out"
              >
                <Edit2 size={18} className="stroke-2" />
                Modifier
              </button>
            )}
            {user?.role === 'etudiant' && (demande?.status === 'valide' || demande?.status === 'pret' || demande?.status === 'recupere') && (
              <span className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-600 font-medium text-sm bg-gray-200 rounded-lg cursor-not-allowed">
                Ne peut plus être modifiée
              </span>
            )}
            {
              user?.role == "encadrant" && (
                <div>
                  <button
                    onClick={() => handleUpdateDemande(3, 50)}
                    className="ml-4 inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-white font-medium text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 ease-in-out"
                  >
                    Valider la demande
                  </button>
                  <button
                    onClick={() => handleUpdateDemande(2, 25)}
                    className="ml-4 inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-white font-medium text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 ease-in-out"
                  >
                    Rejeter la demande

                  </button>
                </div>

              )
            }
            {
              user?.role == "laboratoire" && (
                <div>
                  <button
                    onClick={() => handleUpdateDemande(4, 75)}
                    className="ml-4 inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-white font-medium text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 ease-in-out"
                  >
                    Marquer comme disponible
                  </button>
                  <button
                    onClick={() => handleUpdateDemande(5, 100)}
                    className="ml-4 inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-white font-medium text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 ease-in-out"
                  >
                    Recuperer

                  </button>
                </div>
              )

            }

          </div>


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
              encadrants={demande.encadrants}
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

      {/* Discussion Panel - Uniquement pour étudiant et encadrant */}
      {user?.role && (user.role === 'etudiant' || user.role === 'encadrant') && (
        <DiscussionPanel id_demande={parseInt(id)} userRole={user.role} />
      )}
    </div>
  );
}
