'use client';

interface NewComposantFormProps {
  nom: string;
  setNom: (nom: string) => void;
  reference: string;
  setReference: (reference: string) => void;
  image: string;
  setImage: (image: string) => void;
  description: string;
  setDescription: (description: string) => void;
  quantite: string;
  setQuantite: (quantite: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export default function NewComposantForm({
  nom,
  setNom,
  reference,
  setReference,
  image,
  setImage,
  description,
  setDescription,
  quantite,
  setQuantite,
  onAdd,
  onCancel,
}: NewComposantFormProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <h4 className="text-2xl font-bold text-gray-900">Ajouter un nouveau composant</h4>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nom *</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex: Résistance 10kΩ"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Référence *</label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Ex: RES-10K-0805"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Lien image</label>
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        {image && (
          <div className="mt-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={image} alt="Aperçu" className="max-h-full max-w-full object-contain" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes techniques..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité</label>
        <input
          type="number"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          min="1"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-lg"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
