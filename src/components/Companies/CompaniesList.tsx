import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2, User, Mail, Phone } from 'lucide-react';
import { mockCompanies, mockPlans } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const CompaniesList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Appliquer les filtres
  const filteredCompanies = mockCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompanyPlansCount = (companyId: string) => {
    return mockPlans.filter(p => p.companyId === companyId && p.isActive).length;
  };

  const handleAddCompany = () => {
    toast.success('Fonctionnalité en développement');
    setShowAddModal(false);
  };

  const handleEditCompany = (companyId: string) => {
    toast.success('Fonctionnalité en développement');
  };

  const handleDeleteCompany = (companyId: string) => {
    if (user?.role === 'Admin') {
      toast.success('Fonctionnalité en développement');
    }
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compagnies d'Assurance</h1>
          <p className="text-gray-600 mt-1">
            {filteredCompanies.length} compagnie{filteredCompanies.length > 1 ? 's' : ''}
          </p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle Compagnie</span>
          </button>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom de compagnie ou contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grille des compagnies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.companyId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* En-tête de la carte */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-500">
                    {getCompanyPlansCount(company.companyId)} produit{getCompanyPlansCount(company.companyId) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {user?.role === 'Admin' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditCompany(company.companyId)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.companyId)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Informations de contact */}
            <div className="space-y-3">
              {company.contactPerson && (
                <div className="flex items-center space-x-3 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{company.contactPerson}</span>
                </div>
              )}
              {company.contactEmail && (
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{company.contactEmail}</span>
                </div>
              )}
              {company.contactPhone && (
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{company.contactPhone}</span>
                </div>
              )}
            </div>

            {/* Produits de la compagnie */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Produits disponibles</h4>
              <div className="space-y-2">
                {mockPlans
                  .filter(p => p.companyId === company.companyId && p.isActive)
                  .slice(0, 3)
                  .map((plan) => (
                    <div key={plan.planId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{plan.name}</span>
                      <span className="font-medium text-gray-900">
                        {plan.baseMonthlyPremium.toLocaleString('fr-FR')}€
                      </span>
                    </div>
                  ))}
                {getCompanyPlansCount(company.companyId) > 3 && (
                  <p className="text-xs text-gray-500">
                    +{getCompanyPlansCount(company.companyId) - 3} autre{getCompanyPlansCount(company.companyId) - 3 > 1 ? 's' : ''} produit{getCompanyPlansCount(company.companyId) - 3 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* État vide */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune compagnie trouvée</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Les compagnies d\'assurance partenaires apparaîtront ici'
            }
          </p>
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle Compagnie</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la compagnie</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Mutuelle Générale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personne de contact</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Sophie Laurent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: contact@mutuelle.fr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 01 23 45 67 89"
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
                  onClick={handleAddCompany}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesList;