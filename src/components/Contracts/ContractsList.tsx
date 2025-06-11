import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, FileText, DollarSign } from 'lucide-react';
import { mockContracts, mockProspects, mockPlans, mockCompanies, mockUsers } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { ContractStatus } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ContractsList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');

  // Filtrer les contrats selon le rôle
  const contracts = user?.role === 'Admin' 
    ? mockContracts 
    : mockContracts.filter(c => c.commercialId === user?.userId);

  // Appliquer les filtres
  const filteredContracts = contracts.filter(contract => {
    const prospect = mockProspects.find(p => p.prospectId === contract.prospectId);
    const plan = mockPlans.find(p => p.planId === contract.planId);
    
    const matchesSearch = 
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ContractStatus) => {
    const colors = {
      'Actif': 'bg-green-100 text-green-800',
      'En Attente': 'bg-yellow-100 text-yellow-800',
      'Résilié': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getProspectName = (prospectId: string) => {
    const prospect = mockProspects.find(p => p.prospectId === prospectId);
    return prospect ? `${prospect.firstName} ${prospect.lastName}` : 'Inconnu';
  };

  const getPlanInfo = (planId: string) => {
    const plan = mockPlans.find(p => p.planId === planId);
    if (!plan) return { name: 'Inconnu', company: 'Inconnue' };
    
    const company = mockCompanies.find(c => c.companyId === plan.companyId);
    return {
      name: plan.name,
      company: company?.name || 'Inconnue'
    };
  };

  const getCommercialName = (commercialId: string) => {
    const commercial = mockUsers.find(u => u.userId === commercialId);
    return commercial?.fullName || 'Non assigné';
  };

  const totalMRR = filteredContracts
    .filter(c => c.status === 'Actif')
    .reduce((sum, c) => sum + c.monthlyPremium, 0);

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'Admin' ? 'Tous les Contrats' : 'Mes Contrats'}
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredContracts.length} contrat{filteredContracts.length > 1 ? 's' : ''} • 
            MRR: {totalMRR.toLocaleString('fr-FR')}€
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Nouveau Contrat</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contrats Actifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {filteredContracts.filter(c => c.status === 'Actif').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {filteredContracts.filter(c => c.status === 'En Attente').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MRR Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalMRR.toLocaleString('fr-FR')}€
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
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
                placeholder="Rechercher par numéro, client ou produit..."
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
                onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'all')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="En Attente">En Attente</option>
                <option value="Résilié">Résilié</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des contrats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prime Mensuelle
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
                  Date d'Effet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => {
                const planInfo = getPlanInfo(contract.planId);
                return (
                  <tr key={contract.contractId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contract.contractNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Souscrit le {format(new Date(contract.subscriptionDate), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getProspectName(contract.prospectId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {planInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {planInfo.company}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contract.monthlyPremium.toLocaleString('fr-FR')}€
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    {user?.role === 'Admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCommercialName(contract.commercialId)}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(contract.effectiveDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredContracts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contrat trouvé</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Les contrats signés apparaîtront ici'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsList;