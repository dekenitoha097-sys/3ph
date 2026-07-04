'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const id = params.id as string;
  const { user } = useSession();

  const [demande, setDemande] = useState<Demande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // État dynamique pour gérer quelle action nécessite une confirmation
  const [actionToConfirm, setActionToConfirm] = useState<'disponible' | 'recuperer' | null>(null);

  const isEncadrant = user?.role === 'encadrant' || demande?.encadrants?.some(enc => enc.id_utilisateur === user?.id);
  const isLaboratoire = user?.role === 'laboratoire';
  const viewMode = searchParams?.get('view') as 'encadrant' | 'laboratoire' | null;
  const showEncadrantActions = viewMode === 'encadrant' ? isEncadrant : viewMode === 'laboratoire' ? false : isEncadrant;
  const showLaboratoireActions = viewMode === 'laboratoire' ? isLaboratoire : viewMode === 'encadrant' ? false : isLaboratoire;
  const showDiscussion = viewMode === 'laboratoire' ? false : user?.role === 'etudiant' || isEncadrant;

  // NOUVEAU : Conditions d'activation des boutons basées sur les statuts de MySQL
  const isDisponibleDisabled = demande?.status === 'pret' || demande?.status === 'recupere';
  const isRecupererDisabled = demande?.status !== 'pret';

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

  useEffect(() => {
    if (!message) return;

    const timeout = setTimeout(() => {
      setMessage('');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [message]);

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

  async function handleRecupererComposant() {
    if (!demande?.groupe?.id_groupe) {
      setMessage('Impossible de récupérer : groupe manquant.');
      return;
    }

    try {
      setMessage('Récupération en cours...');

      const creationResponse = await fetch('/api/dashboard/Composants_recuperes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_demande: Number(id),
          id_groupe: Number(demande.groupe.id_groupe),
          date_recuperation: new Date().toISOString().slice(0, 19).replace('T', ' '),
          date_retour: null,
          statut: 'RECUPERE',
        }),
      });

      const creationData = await creationResponse.json().catch(() => ({}));

      if (!creationResponse.ok) {
        const fallbackMessage = creationData.message || 'Erreur lors de la récupération du composant';
        setMessage(fallbackMessage);
        setError(fallbackMessage);
        return;
      }

      const stockResponse = await fetch('/api/composants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_demande: Number(id) }),
      });

      const stockData = await stockResponse.json().catch(() => ({}));

      if (!stockResponse.ok) {
        const fallbackMessage = stockData.error || 'Erreur lors de la mise à jour des stocks';
        setMessage(fallbackMessage);
        setError(fallbackMessage);
        return;
      }

      setMessage(creationData.message || 'Composant récupéré avec succès');
      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération du composant:', error);
      setMessage('Erreur réseau lors de la récupération du composant');
      setError('Erreur réseau lors de la récupération du composant');
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8 relative">
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
              showEncadrantActions && (
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
              showLaboratoireActions && (
                <div>
                  <button
                    // MODIFIÉ : Ajout du paramètre HTML disabled et style conditionnel
                    disabled={isDisponibleDisabled}
                    onClick={() => setActionToConfirm('disponible')}
                    className={`ml-4 inline-flex items-center gap-2 px-4 py-2.5 text-white font-medium text-sm bg-green-600 rounded-lg transition-all duration-200 ease-in-out ${
                      isDisponibleDisabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:bg-green-700'
                    }`}
                  >
                    Marquer comme disponible
                  </button>
                  <button
                    // MODIFIÉ : Ajout du paramètre HTML disabled et style conditionnel
                    disabled={isRecupererDisabled}
                    onClick={() => setActionToConfirm('recuperer')}
                    className={`ml-4 inline-flex items-center gap-2 px-4 py-2.5 text-white font-medium text-sm bg-red-600 rounded-lg transition-all duration-200 ease-in-out ${
                      isRecupererDisabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:bg-red-700'
                    }`}
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
      {showDiscussion && (
        <DiscussionPanel id_demande={parseInt(id)} userRole={user?.role ?? 'encadrant'} />
      )}

      {/* Modale de confirmation dynamique intégrée */}
      {actionToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {actionToConfirm === 'disponible' ? 'Confirmer la disponibilité' : 'Confirmer la récupération'}
            </h3>
            <p className="text-gray-600 mb-8">
              {actionToConfirm === 'disponible' 
                ? 'Êtes-vous sûr de vouloir marquer cette demande comme disponible ?'
                : 'Êtes-vous sûr de vouloir récupérer ces composants ? Cette action mettra à jour la demande et modifiera les stocks.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActionToConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (actionToConfirm === 'disponible') {
                    handleUpdateDemande(4, 75);
                  } else if (actionToConfirm === 'recuperer') {
                    handleUpdateDemande(5, 100);
                    void handleRecupererComposant();
                  }
                  setActionToConfirm(null);
                }}
                className={`px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200 ${
                  actionToConfirm === 'disponible' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionToConfirm === 'disponible' ? 'Oui, marquer disponible' : 'Oui, récupérer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}