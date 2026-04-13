'use client';
import { useEffect, useState } from "react";
import { Plus, Trash2, FolderPlus } from 'lucide-react';
import AssignmentModal from "./components/AssignmentModal";
import FilterBar from "./components/FilterBar";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import CreateGroupModal from "./components/CreateGroupModal";

interface Group {
    id: string;
    name: string;
}

interface Encadrant {
    id: string;
    name: string;
    prenom: string;
    email:string;
}

interface Affectation {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  id_groupe: number;
  code_groupe: string;
  filiere: string;
};


export default function GestionDesAffectations() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [encadrants, setEncadrants] = useState<Encadrant[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [affectations, setAffectations] = useState<Affectation[]>([]);
    const [searchNom, setSearchNom] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchGroupe, setSearchGroupe] = useState('');
    const [searchFiliere, setSearchFiliere] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{
        id_utilisateur: number;
        id_groupe: number;
        nom: string;
        prenom: string;
        code_groupe: string;
    } | null>(null);

    // Fonction pour charger les groupes
    const loadGroups = () => {
        fetch("/api/utils/groups")
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error("Error fetching groups:", error));
    };

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        fetch("/api/utils/profs")
            .then(response => response.json())
            .then(data => setEncadrants(data))
            .catch(error => console.error("Error fetching encadrants:", error));
    }, []);

    useEffect(() => {
        fetch("/api/dashboard/gestion-des-affectations")
            .then(response => response.json())
            .then(data => setAffectations(data))
            .catch(error => console.error("Error fetching affectations:", error));
    }, []);

    const handleAssign = async (groupId: string, encadrantId: string) => {
        const res = await fetch("/api/dashboard/gestion-des-affectations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                id_groupe: groupId, 
                id_encadrant: encadrantId 
            })
        });
        
        if (!res.ok) {
            throw new Error("Erreur l'encadrant est déjà assigné à ce groupe ou une erreur est survenue");
        }

        const result = await res.json();
        setSuccess("Assignation effectuée avec succès");
        setTimeout(() => setSuccess(null), 3000);
    };

    // Filtrer les affectations
    const filteredAffectations = affectations.filter((aff) => {
        const nomMatch = `${aff.prenom} ${aff.nom}`.toLowerCase().includes(searchNom.toLowerCase());
        const emailMatch = aff.email.toLowerCase().includes(searchEmail.toLowerCase());
        const groupeMatch = aff.code_groupe.toLowerCase().includes(searchGroupe.toLowerCase());
        const filiereMatch = aff.filiere.toLowerCase().includes(searchFiliere.toLowerCase());
        
        return nomMatch && emailMatch && groupeMatch && filiereMatch;
    });

    const handleClearFilters = () => {
        setSearchNom('');
        setSearchEmail('');
        setSearchGroupe('');
        setSearchFiliere('');
    };

    const handleDelete = async (id_utilisateur: number, id_groupe: number, nom: string, prenom: string, codeGroupe: string) => {
        setItemToDelete({
            id_utilisateur,
            id_groupe,
            nom,
            prenom,
            code_groupe: codeGroupe
        });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        setDeleteLoading(true);

        try {
            const res = await fetch("/api/dashboard/gestion-des-affectations", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    id_encadrant: itemToDelete.id_utilisateur, 
                    id_groupe: itemToDelete.id_groupe 
                })
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la suppression");
            }

            // Mettre à jour la liste
            setAffectations(affectations.filter(aff => 
                !(aff.id_utilisateur === itemToDelete.id_utilisateur && aff.id_groupe === itemToDelete.id_groupe)
            ));

            setSuccess("Affectation supprimée avec succès");
            setTimeout(() => setSuccess(null), 3000);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la suppression de l'affectation");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCreateGroupSuccess = () => {
        loadGroups();
        setSuccess("Groupe créé avec succès");
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Header with Buttons */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    Gestion des Affectations
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateGroupModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FolderPlus className="w-5 h-5" />
                        Créer un Groupe
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Nouvelle Affectation
                    </button>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                </div>
            )}

            {/* Assignment Modal */}
            <AssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                groups={groups}
                encadrants={encadrants}
                onAssign={handleAssign}
            />

            {/* Confirm Delete Modal */}
            {itemToDelete && (
                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setItemToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    encadrantName={`${itemToDelete.prenom} ${itemToDelete.nom}`}
                    groupeCode={itemToDelete.code_groupe}
                    isLoading={deleteLoading}
                />
            )}

            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                onSuccess={handleCreateGroupSuccess}
            />

            {/* Filter Bar */}
            <FilterBar
                searchNom={searchNom}
                searchEmail={searchEmail}
                searchGroupe={searchGroupe}
                searchFiliere={searchFiliere}
                onNomChange={setSearchNom}
                onEmailChange={setSearchEmail}
                onGroupeChange={setSearchGroupe}
                onFiliereChange={setSearchFiliere}
                onClear={handleClearFilters}
            />

            {/* Affectations List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Encadrant</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Groupe</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Filière</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredAffectations.length > 0 ? (
                            filteredAffectations.map((aff) => (
                                <tr key={`${aff.id_utilisateur}-${aff.id_groupe}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                                        {aff.prenom} {aff.nom}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-600">
                                        {aff.email}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                                        {aff.code_groupe}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-600">
                                        {aff.filiere}
                                    </td>
                                    <td className="px-6 py-3 text-sm">
                                        <button
                                            onClick={() => handleDelete(aff.id_utilisateur, aff.id_groupe, aff.nom, aff.prenom, aff.code_groupe)}
                                            className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Aucune affectation
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}