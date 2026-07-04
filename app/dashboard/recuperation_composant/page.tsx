'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileBox, Sparkles, ShieldCheck, ArrowRight, CalendarDays, BarChart3 } from 'lucide-react';
import FilterSection from '../all-demands/components/FilterSection';
import ContentState from '../all-demands/components/ContentState';

interface RecuperationItem {
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

const statusBadge = (status: string) => {
  if (status === 'RECUPERE') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'RENDU') {
    return 'bg-sky-100 text-sky-800';
  }
  return 'bg-gray-100 text-gray-700';
};

const statusLabel = (status: string) => {
  if (status === 'RECUPERE') return 'Récupéré';
  if (status === 'RENDU') return 'Rendu';
  return status;
};

export default function RecuperationComposantPage() {
  const router = useRouter();
  const [items, setItems] = useState<RecuperationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    filiere: '',
    annee: '',
    status: '',
    search: '',
    date_soumission: '',
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.filiere) params.append('filiere', filters.filiere);
      if (filters.annee) params.append('annee', filters.annee);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.date_soumission) params.append('date_soumission', filters.date_soumission);

      const response = await fetch(`/api/dashboard/Composants_recuperes?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des récupérations');
      }

      const data = await response.json();
      setItems(data.recuperation_composant || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      filiere: '',
      annee: '',
      status: '',
      search: '',
      date_soumission: '',
    });
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalRecupere = items.filter((item) => item.statut === 'RECUPERE').length;
  const totalRendu = items.filter((item) => item.statut === 'RENDU').length;
  const totalWithoutStatus = items.length - totalRecupere - totalRendu;

  const hasActiveFilters = !!(
    filters.filiere || filters.annee || filters.status || filters.search || filters.date_soumission
  );

  const handleCardClick = (id: number) => {
    router.push(`/dashboard/recuperation_composant/${id}`);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="w-full">
        <div className="mb-8 rounded-[28px] bg-gradient-to-r from-sky-600 to-cyan-500 p-8 text-white shadow-xl shadow-sky-200/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="uppercase tracking-[0.2em] text-sm font-bold text-cyan-100">Table de récupération</p>
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">Composants récupérés</h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-cyan-100/90">
                Suivez toutes les récupérations de composants par groupe et étudiant. Cliquez sur une carte pour voir le détail.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-5 shadow-lg shadow-sky-500/20 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-100/80">Total</p>
                <p className="mt-4 text-3xl font-bold">{items.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 shadow-lg shadow-sky-500/20 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-100/80">Récupéré</p>
                <p className="mt-4 text-3xl font-bold">{totalRecupere}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 shadow-lg shadow-sky-500/20 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-100/80">Rendu</p>
                <p className="mt-4 text-3xl font-bold">{totalRendu}</p>
              </div>
            </div>
          </div>
        </div>

        <FilterSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <ContentState loading={loading} error={error} demandesCount={items.length} viewMode="table">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <button
                key={item.id_recuperation}
                type="button"
                onClick={() => handleCardClick(item.id_recuperation)}
                className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Récupération #{item.id_recuperation}</p>
                    <h2 className="mt-3 text-lg font-semibold text-slate-900">
                      {item.titre || 'Titre indisponible'}
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-600 group-hover:bg-slate-200">
                    <FileBox size={22} />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">
                  {item.description || 'Aucune description fournie.'}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Groupe</p>
                    <p className="mt-2 font-semibold text-slate-900">{item.code_groupe || '—'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Étudiant</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {item.prenom_etudiant || '—'} {item.nom_etudiant || ''}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(item.statut)}`}>
                    {statusLabel(item.statut)}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <CalendarDays size={16} />
                    <span>{formatDate(item.date_recuperation)}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <span>{item.filiere || 'Filière inconnue'}</span>
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-900">
                    Voir détail
                    <ArrowRight size={16} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ContentState>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sky-500">
              <Sparkles size={20} />
              <p className="font-semibold text-slate-900">Dernières récupérations</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">Accédez rapidement aux fiches de récupération récentes en cliquant sur une carte.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-500">
              <ShieldCheck size={20} />
              <p className="font-semibold text-slate-900">Suivi simplifié</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">Les statuts sont affichés en clair pour savoir rapidement si un composant est déjà rendu ou encore récupéré.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <BarChart3 size={20} />
              <p className="font-semibold text-slate-900">Filtrage rapide</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">Utilisez les filtres pour isoler par filière, année, statut ou date de récupération.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
