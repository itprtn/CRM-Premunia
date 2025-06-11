import React from 'react';
import { Users, TrendingUp, FileText, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockProspects, mockContracts, mockUsers } from '../../data/mockData';
import { format, subDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminDashboard: React.FC = () => {
  // Calculs des KPIs
  const thirtyDaysAgo = subDays(new Date(), 30);
  const newProspects = mockProspects.filter(p => 
    isAfter(new Date(p.createdAt), thirtyDaysAgo)
  ).length;

  const totalProspects = mockProspects.length;
  const clientsCount = mockProspects.filter(p => p.status === 'Gagné - Client').length;
  const conversionRate = totalProspects > 0 ? (clientsCount / totalProspects * 100) : 0;

  const activeContracts = mockContracts.filter(c => c.status === 'Actif').length;
  const monthlyRevenue = mockContracts
    .filter(c => c.status === 'Actif')
    .reduce((sum, c) => sum + c.monthlyPremium, 0);

  // Prospects sans activité depuis 15 jours
  const fifteenDaysAgo = subDays(new Date(), 15);
  const inactiveProspects = mockProspects.filter(p => 
    p.lastInteractionAt && isAfter(fifteenDaysAgo, new Date(p.lastInteractionAt))
  );

  // Données pour les graphiques
  const commercialPerformance = mockUsers
    .filter(u => u.role === 'Commercial')
    .map(commercial => {
      const prospects = mockProspects.filter(p => p.commercialId === commercial.userId);
      const contracts = mockContracts.filter(c => c.commercialId === commercial.userId);
      return {
        name: commercial.fullName.split(' ')[0],
        prospects: prospects.length,
        contrats: contracts.length
      };
    });

  const statusDistribution = [
    { name: 'Nouveau', value: mockProspects.filter(p => p.status === 'Nouveau').length, color: '#3B82F6' },
    { name: 'Contact Établi', value: mockProspects.filter(p => p.status === 'Contact Établi').length, color: '#10B981' },
    { name: 'Devis Envoyé', value: mockProspects.filter(p => p.status === 'Devis Envoyé').length, color: '#F59E0B' },
    { name: 'Gagné', value: mockProspects.filter(p => p.status === 'Gagné - Client').length, color: '#059669' },
    { name: 'Perdu', value: mockProspects.filter(p => p.status === 'Perdu').length, color: '#DC2626' }
  ].filter(item => item.value > 0);

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de l'activité commerciale</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Dernière mise à jour</p>
          <p className="font-medium">{format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nouveaux Prospects</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{newProspects}</p>
              <p className="text-xs text-gray-500 mt-1">30 derniers jours</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de Conversion</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">{clientsCount} clients sur {totalProspects}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contrats Signés</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{activeContracts}</p>
              <p className="text-xs text-gray-500 mt-1">Mois en cours</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenu Mensuel</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{monthlyRevenue.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-gray-500 mt-1">MRR total</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par Commercial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance par Commercial</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commercialPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="prospects" fill="#3B82F6" name="Prospects" />
              <Bar dataKey="contrats" fill="#10B981" name="Contrats" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline des Prospects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline des Prospects</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prospects sans activité */}
      {inactiveProspects.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Prospects sans activité depuis plus de 15 jours ({inactiveProspects.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prospect
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commercial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière Interaction
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inactiveProspects.slice(0, 5).map((prospect) => {
                  const commercial = mockUsers.find(u => u.userId === prospect.commercialId);
                  return (
                    <tr key={prospect.prospectId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {prospect.firstName} {prospect.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{prospect.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {commercial?.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          {prospect.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prospect.lastInteractionAt && format(new Date(prospect.lastInteractionAt), 'dd/MM/yyyy', { locale: fr })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;