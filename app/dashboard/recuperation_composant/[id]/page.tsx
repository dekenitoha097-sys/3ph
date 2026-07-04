'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface RecuperationDetail {
  id_recuperation: number;
  id_demande: number;
  id_groupe: number;
  titre: string | null;
  description: string | null;
  code_groupe: string | null;
  nom_groupe: string | null;
  filiere: string | null;
  annee: string | null;
  nom_etudiant: string | null;
  prenom_etudiant: string | null;
  email_etudiant: string | null;
  date_recuperation: string;
  date_retour: string | null;
  statut: string;
}

interface ComposantDetail {
  id_ligne: number;
  id_composant: number;
  nom: string | null;
  reference: string | null;
  photo_lien: string | null;
  quantite_demandee: number;
  quantite_stock: number;
  commentaire: string | null;
  commentaire_labo: string | null;
  existe: number | null;
  Statut_Disponibilite: string | null;
}

export default function RecuperationComposantDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [recuperation, setRecuperation] = useState<RecuperationDetail | null>(null);
  const [composants, setComposants] = useState<ComposantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/Composants_recuperes/${id}`);

        if (!response.ok) {
          throw new Error('Erreur lors du chargement du détail');
        }

        const data = await response.json();
        setRecuperation(data.recuperation || null);
        setComposants(data.composants || []);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timeout);
  }, [message]);

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusBadge = (status: string) => {
    if (status === 'RECUPERE') return 'bg-emerald-100 text-emerald-800';
    if (status === 'RENDU') return 'bg-sky-100 text-sky-800';
    return 'bg-gray-100 text-gray-700';
  };

  async function handleRestituerStocks() {
    if (!recuperation?.id_demande) return;

    try {
      setMessage('Restitution des stocks et mise à jour du statut en cours...');
      setShowConfirmModal(false);

      const stockResponse = await fetch('/api/composants/rendu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_demande: Number(recuperation.id_demande) }),
      });

      const stockData = await stockResponse.json().catch(() => ({}));

      if (!stockResponse.ok) {
        const fallbackMessage = stockData.error || stockData.message || 'Erreur lors de la restitution des stocks';
        setError(fallbackMessage);
        setMessage('');
        return;
      }

      setMessage(stockData.message || 'Stocks des composants restitués avec succès');
      setError('');

      // Rafraîchir l'état local depuis la BDD (Le statut passera à RENDU et la date de retour sera remplie)
      const updatedResponse = await fetch(`/api/dashboard/Composants_recuperes/${id}`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setRecuperation(updatedData.recuperation || null);
        setComposants(updatedData.composants || []);
      }

    } catch (error) {
      console.error('Erreur lors de la restitution des stocks:', error);
      setError('Erreur réseau lors de la restitution des stocks');
      setMessage('');
    }
  }

  // Désactivation si le statut vaut 'RENDU'
  const isRenduDisabled = recuperation?.statut === 'RENDU';

  return (
    <div className="min-h-screen bg-slate-50 px-2 py-2 md:px-3 md:py-3 relative">
      
      {message && (
        <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-lg p-4 text-green-700 text-sm md:text-base font-medium">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 text-sm md:text-base font-medium">
          {error}
        </div>
      )}
      
      <div className="w-full rounded-[20px] bg-white p-3 shadow-sm md:p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Détail de récupération</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Récupération #{id}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/recuperation_composant"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Retour à la liste
            </Link>
            
            {recuperation && (
              <button
                disabled={isRenduDisabled}
                onClick={() => setShowConfirmModal(true)}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ${
                  isRenduDisabled 
                    ? 'bg-gray-300 cursor-not-allowed opacity-60' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                }`}
              >
                {isRenduDisabled ? 'Composants rendus' : 'Rendre les composants'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-600">Chargement...</div>
        ) : error && !recuperation ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : recuperation ? (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusBadge(recuperation.statut)}`}>
                    {recuperation.statut === 'RECUPERE' ? 'Récupéré' : recuperation.statut === 'RENDU' ? 'Rendu' : recuperation.statut}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-600">
                    Demande #{recuperation.id_demande}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-slate-900">
                  {recuperation.titre || 'Titre indisponible'}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {recuperation.description || 'Aucune description fournie.'}
                </p>
              </div>

              <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-slate-900">Informations</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>Groupe</span>
                    <span className="font-semibold text-slate-900">{recuperation.code_groupe || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Filière</span>
                    <span className="font-semibold text-slate-900">{recuperation.filiere || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Année</span>
                    <span className="font-semibold text-slate-900">{recuperation.annee || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Étudiant</span>
                    <span className="font-semibold text-slate-900">
                      {recuperation.prenom_etudiant || ''} {recuperation.nom_etudiant || ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Date récupération</span>
                    <span className="font-semibold text-slate-900">{formatDate(recuperation.date_recuperation)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Date retour</span>
                    <span className="font-semibold text-slate-900">{formatDate(recuperation.date_retour)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-semibold text-slate-900">Composants demandés</h3>
              {composants.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                  Aucun composant n’est associé à cette récupération.
                </div>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {composants.map((composant) => (
                    <div key={composant.id_ligne} className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
                      {composant.photo_lien ? (
                        <img
                          src={composant.photo_lien}
                          alt={composant.nom || 'Composant'}
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                          Aucune image disponible
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900">{composant.nom || 'Composant'}</h4>
                            <p className="mt-1 text-sm text-slate-500">{composant.reference || 'Référence indisponible'}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            x{composant.quantite_demandee}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                          <div className="flex items-center justify-between">
                            <span>Quantité stock</span>
                            <span className="font-semibold text-slate-900">{composant.quantite_stock ?? '—'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Disponibilité</span>
                            <span className="font-semibold text-slate-900">{composant.Statut_Disponibilite || '—'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Existant</span>
                            <span className="font-semibold text-slate-900">{composant.existe ? 'Oui' : 'Non'}</span>
                          </div>
                        </div>

                        {composant.commentaire && (
                          <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                            {composant.commentaire}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Confirmer la restitution</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Êtes-vous sûr de vouloir valider le retour de ces composants ? Cette action remettra à jour les stocks du laboratoire et passera définitivement le statut de cette récupération à "Rendu".
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  void handleRestituerStocks();
                }}
                className="px-5 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-colors duration-200"
              >
                Oui, restituer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}