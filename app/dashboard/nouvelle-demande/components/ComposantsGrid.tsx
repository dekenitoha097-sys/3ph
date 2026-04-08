'use client';

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

interface ComposantsGridProps {
    composants: Composant[];
    loading: boolean;
    onAdd: (composant: Composant) => void;
}

export default function ComposantsGrid({ composants, loading, onAdd }: ComposantsGridProps) {
    if (loading) {
        return <p className="text-center text-gray-500 text-lg">Chargement...</p>;
    }

    if (composants.length === 0) {
        return <p className="col-span-full text-center text-gray-500 text-lg">Aucun composant trouvé</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {composants.map((comp) => (
                <div
                    key={comp.id_composant}
                    onClick={() => onAdd(comp)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onAdd(comp);
                        }
                    }}
                    className="text-left p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                >
                    {/* Image grande */}
                    <div className="mb-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {comp.image_url ? (
                            <img src={comp.image_url} alt={comp.nom} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-6xl">📦</div>
                        )}
                    </div>

                    {/* Info composant */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{comp.nom}</h4>
                        <p className="text-sm text-gray-600 mb-2">{comp.reference}</p>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{comp.description}</p>

                        {/* Statut et Stock */}
                        <div className="space-y-2 mb-4">

                            {/* Stock disponible */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600">Stock:</span>
                                <span className="text-sm font-semibold text-gray-900">{comp.disponibilite} unités</span>
                            </div>

                            {/* Statut Disponibilité */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${comp.statut_disponibilite === 'DIS'
                                    ? 'bg-green-100 text-green-700'
                                    : comp.statut_disponibilite === 'IND'
                                        ? 'bg-red-100 text-red-700'
                                        : comp.statut_disponibilite === 'EN_ATTENTE'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${comp.statut_disponibilite === 'DIS' ? 'bg-green-500' :
                                        comp.statut_disponibilite === 'IND' ? 'bg-red-500' :
                                            comp.statut_disponibilite === 'EN_ATTENTE' ? 'bg-yellow-500' :
                                                'bg-gray-500'
                                    }`}></span>
                                {comp.statut_disponibilite === 'DIS' ? '✓ Disponible' :
                                    comp.statut_disponibilite === 'IND' ? '✕ Indisponible' :
                                        comp.statut_disponibilite === 'EN_ATTENTE' ? '⏳ En attente' :
                                            comp.statut_disponibilite}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold text-sm pointer-events-none">
                                + Ajouter
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
