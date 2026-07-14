'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import GroupeRequiredModal from '@/app/dashboard/components/GroupeRequiredModal';
import InfoForm from './components/InfoForm';
import ComposantsListSection from './components/ComposantsListSection';
import AddComposantModal from './components/AddComposantModal';

interface Composant {
  id_composant: number;
  nom: string;
  reference: string;
  existe: boolean;
  image_url: string | null;
  disponibilite: number;
  description: string;
  statut_disponibilite: string;
  created_at: string;
}

interface ComposantSelectionne {
  id_composant?: number;
  nom: string;
  reference: string;
  quantite_demandee: number;
  image_url?: string | null;
  isNew?: boolean;
}

export default function NouvelleDemandePage() {
  const router = useRouter();
  const { user, loading: sessionLoading, refreshSession } = useSession() as { user: any, loading: boolean, refreshSession: () => Promise<void> };
  
  const [showGroupeModal, setShowGroupeModal] = useState(false);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  const [composants, setComposants] = useState<Composant[]>([]);
  const [composantsSelectionnes, setComposantsSelectionnes] = useState<ComposantSelectionne[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [searchComposant, setSearchComposant] = useState('');
  const [showNewComposantForm, setShowNewComposantForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Nouveaux composants
  const [newComposantNom, setNewComposantNom] = useState('');
  const [newComposantRef, setNewComposantRef] = useState('');
  const [newComposantImage, setNewComposantImage] = useState('');
  const [newComposantDesc, setNewComposantDesc] = useState('');
  const [newComposantQte, setNewComposantQte] = useState('1');


  // Charger les composants disponibles
  useEffect(() => {
    const fetchComposants = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/composants?type=3PH');
        const data = await res.json();
        setComposants(data.composants || []);
      } catch (err) {
        setError('Erreur lors du chargement des composants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComposants();
  }, []);

  // Vérifier si l'utilisateur a un groupe
  useEffect(() => {
    if (!sessionLoading && user && user.role === 'etudiant' && !user.id_groupe) {
      setShowGroupeModal(true);
    }
  }, [user, sessionLoading]);

  // Effacer le message d'erreur après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000); // 5 secondes

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Ajouter un composant existant
  const handleAddComposant = (composant: Composant) => {
    const alreadyExists = composantsSelectionnes.some((c) => c.id_composant === composant.id_composant);
    if (alreadyExists) {
      setError('Ce composant est déjà dans votre demande');
      return;
    }

    setComposantsSelectionnes([
      ...composantsSelectionnes,
      {
        id_composant: composant.id_composant,
        nom: composant.nom,
        reference: composant.reference,
        quantite_demandee: 1,
        image_url: composant.image_url,
        isNew: false,
      },
    ]);
    setShowModal(false);
    setSearchComposant('');
  };

  // Ajouter un nouveau composant
  const handleAddNewComposant = () => {
    if (!newComposantNom || !newComposantRef) {
      setError('Nom et référence requis');
      return;
    }

    setComposantsSelectionnes([
      ...composantsSelectionnes,
      {
        nom: newComposantNom,
        reference: newComposantRef,
        quantite_demandee: parseInt(newComposantQte) || 1,
        image_url: newComposantImage || null,
        isNew: true,
      },
    ]);

    // Réinitialiser le formulaire
    setNewComposantNom('');
    setNewComposantRef('');
    setNewComposantImage('');
    setNewComposantDesc('');
    setNewComposantQte('1');
    setShowNewComposantForm(false);
    setShowModal(false);
    setError('');
  };

  // Retirer un composant
  const handleRemoveComposant = (index: number) => {
    setComposantsSelectionnes(composantsSelectionnes.filter((_, i) => i !== index));
  };

  // Mettre à jour la quantité
  const handleUpdateQuantite = (index: number, quantite: number) => {
    const updated = [...composantsSelectionnes];
    updated[index].quantite_demandee = Math.max(1, quantite);
    setComposantsSelectionnes(updated);
  };

  // Gérer la fermeture de la modale de groupe
  const handleGroupeModalClose = async (success: boolean) => {
    setShowGroupeModal(false);
    if (success) {
      // Rafraîchir la session pour obtenir le nouvel id_groupe
      await refreshSession();
    }
  };

  // Soumettre la demande
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titre || !description) {
      setError('Titre et description requis');
      return;
    }

    if (composantsSelectionnes.length === 0) {
      setError('Ajoutez au moins un composant');
      return;
    }

    setSubmitting(true);
    setError('');

    // Vérifier que l'utilisateur est connecté
    if (!user) {
      setError('Vous devez être connecté');
      setSubmitting(false);
      return;
    }

    try {
      // Séparer composants existants et nouveaux
      const composantsExistants = composantsSelectionnes.filter((c) => !c.isNew);
      const composantsNouveaux = composantsSelectionnes.filter((c) => c.isNew);

      console.log('Composants existants:', composantsExistants);
      console.log('Composants nouveaux:', composantsNouveaux);

      // Étape 1: Créer les nouveaux composants
      const nouveauxIds: Array<{ id_composant: number; quantite_demandee: number }> = [];

      for (const comp of composantsNouveaux) {
        const createResponse = await fetch('/api/composants/custom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: comp.nom,
            reference: comp.reference,
            photo_lien: comp.image_url || null,
            quantite: comp.quantite_demandee,
            commentaire: null,
          }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => ({ error: 'Erreur serveur' }));
          throw new Error(`Erreur création composant ${comp.nom}: ${errorData.error || 'Erreur inconnue'}`);
        }

        const createdComp = await createResponse.json();
        console.log('Composant créé:', createdComp);

        nouveauxIds.push({
          id_composant: createdComp.id_composant,
          quantite_demandee: comp.quantite_demandee,
        });
      }

      // Étape 2: Construire la liste complète des composants
      const tousLesComposants = [
        ...composantsExistants.map((c) => ({
          id_composant: c.id_composant!,
          quantite_demandee: c.quantite_demandee,
        })),
        ...nouveauxIds,
      ];

      console.log('Tous les composants à envoyer:', tousLesComposants);

      // Étape 3: Créer la demande
      const payload = {
        titre,
        description,
        id_groupe: user.id_groupe,
        id_etudiant: user.id_etudiant,
        composants: tousLesComposants,
      };

      console.log('Payload finalisé:', JSON.stringify(payload, null, 2));

      const response = await fetch('/api/dashboard/cree_demande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const result = await response.json();
      router.push(`/dashboard/all-demands/${result.id_demande}`);
    } catch (err) {
      console.error('Erreur création demande:', err);
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <GroupeRequiredModal isOpen={showGroupeModal} onClose={handleGroupeModalClose} />

      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Nouvelle Demande</h1>
          <p className="text-gray-600">Créez une demande de composants</p>
        </div>

        {sessionLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
            Chargement de votre profil...
          </div>
        )}

        {!sessionLoading && !user && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Vous devez être connecté pour créer une demande
          </div>
        )}

        {error && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999] bg-red-50 border-2 border-red-400 rounded-lg p-4 text-red-700 max-w-md shadow-2xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InfoForm
            titre={titre}
            setTitre={setTitre}
            description={description}
            setDescription={setDescription}
          />

          <ComposantsListSection
            composants={composantsSelectionnes}
            onAdd={() => setShowModal(true)}
            onRemove={handleRemoveComposant}
            onUpdateQuantite={handleUpdateQuantite}
          />

          {/* Boutons Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={sessionLoading}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || sessionLoading || !user}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {submitting ? 'Envoi...' : sessionLoading ? 'Chargement...' : 'Soumettre'}
            </button>
          </div>
        </form>

        {/* Modal */}
        <AddComposantModal
          isOpen={showModal && !sessionLoading && !!user}
          composants={composants}
          loading={loading}
          searchComposant={searchComposant}
          setSearchComposant={setSearchComposant}
          showNewComposantForm={showNewComposantForm}
          setShowNewComposantForm={setShowNewComposantForm}
          newComposantNom={newComposantNom}
          setNewComposantNom={setNewComposantNom}
          newComposantRef={newComposantRef}
          setNewComposantRef={setNewComposantRef}
          newComposantImage={newComposantImage}
          setNewComposantImage={setNewComposantImage}
          newComposantDesc={newComposantDesc}
          setNewComposantDesc={setNewComposantDesc}
          newComposantQte={newComposantQte}
          setNewComposantQte={setNewComposantQte}
          onAddExisting={handleAddComposant}
          onAddNew={handleAddNewComposant}
          onClose={() => {
            setShowModal(false);
            setShowNewComposantForm(false);
            setSearchComposant('');
          }}
        />
      </div>
    </div>
  );
}

