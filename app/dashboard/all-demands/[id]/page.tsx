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
  
  // États pour les messages
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState(''); // Nouvel état pour les erreurs d'action (ex: stock insuffisant)
  
  // État dynamique pour gérer quelle action nécessite une confirmation
  const [actionToConfirm, setActionToConfirm] = useState<'disponible' | 'recuperer' | null>(null);

  const isEncadrant = user?.role === 'encadrant' || demande?.encadrants?.some(enc => enc.id_utilisateur === user?.id);
  const isLaboratoire = user?.role === 'laboratoire';
  const viewMode = searchParams?.get('view') as 'encadrant' | 'laboratoire' | null;
  const showEncadrantActions = viewMode === 'encadrant' ? isEncadrant : viewMode === 'laboratoire' ? false : isEncadrant;
  const showLaboratoireActions = viewMode === 'laboratoire' ? isLaboratoire : viewMode === 'encadrant' ? false : isLaboratoire;
  const showDiscussion = viewMode === 'laboratoire' ? false : user?.role === 'etudiant' || isEncadrant;

  // Conditions d'activation des boutons basées sur les statuts
  const isDisponibleDisabled = demande?.status === 'pret' || demande?.status === 'recupere';
  const isRecupererDisabled = demande?.status !== 'pret';
  
  // NOUVEAU : Désactiver "Valider" et "Rejeter" si la demande a déjà été traitée par l'encadrant
  const isValidationDisabled = demande?.status === 'valide' || demande?.status === 'rejete' || demande?.status === 'pret' || demande?.status === 'recupere';

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

  // Effet pour effacer les messages de succès
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timeout);
  }, [message]);

  // Effet pour effacer les messages d'erreur d'action (comme les stocks)
  useEffect(() => {
    if (!actionError) return;
    const timeout = setTimeout(() => setActionError(''), 7000);
    return () => clearTimeout(timeout);
  }, [actionError]);

  async function handleUpdateDemande(id_st: number, progression: number) {
    try {
      const response = await fetch(`/api/dashboard/all-demands/update_demande`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_demande: id, id_status: id_st, progression: progression }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setActionError('Erreur lors de la mise à jour de la demande');
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

  // NOUVEAU : Fonction pour vérifier le stock avant d'ouvrir la modale de récupération
  const handleRecupererClick = () => {
    if (demande && demande.composants) {
      // Cherche s'il y a un composant dont la quantité demandée dépasse le stock
      const composantEnRupture = demande.composants.find(
        (comp) => comp.quantite_demandee > comp.quantite_stock
      );

      if (composantEnRupture) {
        // Affiche une erreur et bloque la suite
        setActionError(`Impossible de récupérer : la quantité demandée pour "${composantEnRupture.nom}" (${composantEnRupture.quantite_demandee}) dépasse le stock disponible (${composantEnRupture.quantite_stock}).`);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte pour voir le message
        return;
      }
    }
    
    // Si tout est OK, on ouvre la modale de confirmation
    setActionToConfirm('recuperer');
  };

  async function handleRecupererComposant() {
    if (!demande?.groupe?.id_groupe) {
      setActionError('Impossible de récupérer : groupe manquant.');
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
        setActionError(fallbackMessage);
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
        setActionError(fallbackMessage);
        return;
      }

      setMessage(creationData.message || 'Composant récupéré avec succès');
      setActionError('');
    } catch (error) {
      console.error('Erreur lors de la récupération du composant:', error);
      setActionError('Erreur réseau lors de la récupération du composant');
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8 relative">
      
      {/* Alertes (Succès et Erreurs non-bloquantes) */}
      {message && (
        <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-lg p-4 md:p-6 text-green-700 text-base md:text-lg">
          {message}
        </div>
      )}
      
      {actionError && (
        <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-4 md:p-6 text-red-700 text-base md:text-lg">
          {actionError}
        </div>
      )}

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
            {user?.role === 'etudiant' && !isValidationDisabled && (
              <button
                onClick={() => router.push(`/dashboard/all-demands/${id}/edit`)}
                className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-blue-700 font-medium text-sm hover:text-blue-900 hover:bg-blue-200 rounded-lg transition-all duration-200 ease-in-out"
              >
                <Edit2 size={18} className="stroke-2" />
                Modifier
              </button>
            )}
            {user?.role === 'etudiant' && isValidationDisabled && (
              <span className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-600 font-medium text-sm bg-gray-200 rounded-lg cursor-not-allowed">
                Ne peut plus être modifiée
              </span>
            )}
            
            {showEncadrantActions && (
              <div>
                <button
                  disabled={isValidationDisabled}
                  onClick={() => handleUpdateDemande(3, 50)}
                  className={`ml-4 inline-flex items-center gap-2 px-4 py-2.5 text-white font-medium text-sm rounded-lg transition-all duration-200 ease-in-out ${
                    isValidationDisabled 
                      ? 'opacity-50 cursor-not-allowed bg-green-600' 
                      : 'cursor-pointer bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Valider la demande
                </button>
                <button
                  disabled={isValidationDisabled}
                  onClick={() => handleUpdateDemande(2, 25)}
                  className={`ml-4 inline-flex items-center gap-2 px-4 py-2.5 text-white font-medium text-sm rounded-lg transition-all duration-200 ease-in-out ${
                    isValidationDisabled 
                      ? 'opacity-50 cursor-not-allowed bg-red-600' 
                      : 'cursor-pointer bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Rejeter la demande
                </button>
              </div>
            )}
            
            {showLaboratoireActions && (
              <div>
                <button
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
                  disabled={isRecupererDisabled}
                  onClick={handleRecupererClick} // NOUVEAU : Appel de la fonction de vérification
                  className={`ml-4 inline-flex items-center gap-2 px-4 py-2.5 text-white font-medium text-sm bg-red-600 rounded-lg transition-all duration-200 ease-in-out ${
                    isRecupererDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:bg-red-700'
                  }`}
                >
                  Recuperer
                </button>
              </div>
            )}
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