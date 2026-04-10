'use client';

import { User, Mail, Code, Calendar, Briefcase, Users } from 'lucide-react';

interface InfoGridProps {
  etudiant: {
    nom: string;
    prenom: string;
    email: string;
  };
  groupe: {
    code_groupe: string;
    nom: string;
    filiere: string;
    annee: string;
  };
  encadrant?: {
    nom: string;
    prenom: string;
  } | null;
  laboratoire?: {
    nom: string;
    email: string;
  } | null;
}

export default function InfoGrid({ etudiant, groupe, encadrant, laboratoire }: InfoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Étudiant */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Étudiant</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User size={18} className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Nom</p>
              <p className="text-base font-semibold text-gray-900">
              {etudiant && etudiant.prenom && etudiant.nom 
                ? `${etudiant.prenom} ${etudiant.nom}` 
                : <span className="text-gray-400 italic">Non renseigné</span>
              }
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-cyan-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Email</p>
              <p className="text-base text-gray-900 break-all font-medium">
              {etudiant && etudiant.email ? etudiant.email : <span className="text-gray-400 italic">Non renseigné</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Groupe */}
      {groupe && (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Users size={24} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Groupe</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Code size={18} className="text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Code</p>
              <p className="text-base font-semibold text-gray-900">{groupe.code_groupe || 'Non renseigné'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Briefcase size={18} className="text-pink-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Filière</p>
              <p className="text-base font-semibold text-gray-900">{groupe.filiere || 'Non renseigné'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Année</p>
              <p className="text-base font-semibold text-gray-900">{groupe.annee || 'Non renseigné'}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Encadrant */}
      {encadrant && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <Briefcase size={24} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Encadrant</h2>
          </div>
          <div className="flex items-start gap-3">
            <User size={18} className="text-green-500 mt-1 flex-shrink-0" />
            <p className="text-base font-semibold text-gray-900">{encadrant.prenom} {encadrant.nom}</p>
          </div>
        </div>
      )}

      {/* Laboratoire */}
      {laboratoire && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Briefcase size={24} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Laboratoire</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Code size={18} className="text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Nom</p>
                <p className="text-base font-semibold text-gray-900">{laboratoire.nom || 'Non renseigné'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-base font-semibold text-gray-900 break-all">{laboratoire.email || 'Non renseigné'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
