import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProspects, mockUsers } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { Prospect, ProspectStatus } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const ProspectsList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtrer les prospects selon le rôle
  const prospects = user?.role === 'Admin' 
    ? mockProspects 
    : mockProspects.filter(p => p.commercialId === user?.userId);

  // Appliquer les filtres
  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = 
      prospect.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ProspectStatus) => {
    const colors = {
      'Nouveau': 'bg-blue-100 text-blue-800',
      'À Contacter': 'bg-gray-100 text-gray-800',
      'Contact Établi': 'bg-green-100 text-green-800',
      'Ne répond pas': 'bg-red-100 text-red-800',
      'Analyse des Besoins': 'bg-purple-100 text-purple-800',
      'Devis Envoyé': 'bg-yellow-100 text-yellow-800',
      'En Négociation': 'bg-orange-100 text-orange-800',
      'Gagné - Client': 'bg-emerald-100 text-emerald-800',
      'Perdu': 'bg-red-100 text-red-800',
      'Relance Marketing': 'bg-pink-100 text-pink-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCommercialName = (commercialId: string) => {
    const commercial = mockUsers.find(u => u.userId === commercialId);
    return commercial?.fullName || 'Non assigné';
  };

  const handleViewProspect = (prospectId: string) => {
    navigate(`/prospects/${prospectId}`);
  };

  const handleEditProspect = (prospectId: string) => {
    toast.success('Fonctionnalité en développement');
  };

  const handleDeleteProspect = (prospectId: string) => {
    if (user?.role === 'Admin') {
      toast.success('Fonctionnalité en développement');
    }
  };

  const handleAddProspect = () => {
    toast.success('Fonctionnalité en développement');
    setShowAddModal(false);
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'Admin' ? 'Tous les Prospects' : 'Mes Prospects'}
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredProspects.length} prospect{filteredProspects.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau Prospect</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtre par statut */}
          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProspectStatus | 'all')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="Nouveau">Nouveau</option>
                <option value="À Contacter">À Contacter</option>
                <option value="Contact Établi">Contact Établi</option>
                <option value="Ne répond pas">Ne répond pas</option>
                <option value="Analyse des Besoins">Analyse des Besoins</option>
                <option value="Devis Envoyé">Devis Envoyé</option>
                <option value="En Négociation">En Négociation</option>
                <option value="Gagné - Client">Gagné - Client</option>
                <option value="Perdu">Perdu</option>
                <option value="Relance Marketing">Relance Marketing</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des prospects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prospect
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                {user?.role === 'Admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commercial
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProspects.map((prospect) => (
                <tr key={prospect.prospectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {prospect.firstName} {prospect.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date().getFullYear() - new Date(prospect.dateOfBirth).getFullYear()} ans
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {prospect.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {prospect.email}
                        </div>
                      )}
                      {prospect.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {prospect.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prospect.status)}`}>
                      {prospect.status}
                    </span>
                  </td>
                  {user?.role === 'Admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCommercialName(prospect.commercialId)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prospect.source || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(prospect.createdAt), 'dd/MM/yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewProspect(prospect.prospectId)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir le détail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditProspect(prospect.prospectId)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {user?.role === 'Admin' && (
                        <button 
                          onClick={() => handleDeleteProspect(prospect.prospectId)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun prospect trouvé</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier prospect'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveau Prospect</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: jean.dupont@email.fr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Sélectionner une source</option>
                    <option value="Site Web">Site Web</option>
                    <option value="Recommandation">Recommandation</option>
                    <option value="Campagne Email">Campagne Email</option>
                    <option value="Salon Senior">Salon Senior</option>
                    <option value="Téléprospection">Téléprospection</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 12 rue de la Paix, 75001 Paris"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddProspect}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer le prospect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectsList;