import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockProspects, mockContracts, mockUsers } from '../../data/mockData';
import { format, subDays, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Données pour les graphiques
  const getDateRangeData = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case '7days':
        startDate = subDays(now, 7);
        break;
      case '30days':
        startDate = subDays(now, 30);
        break;
      case '3months':
        startDate = subMonths(now, 3);
        break;
      case '6months':
        startDate = subMonths(now, 6);
        break;
      default:
        startDate = subDays(now, 30);
    }

    return {
      prospects: mockProspects.filter(p => new Date(p.createdAt) >= startDate),
      contracts: mockContracts.filter(c => new Date(c.subscriptionDate) >= startDate)
    };
  };

  const { prospects, contracts } = getDateRangeData();

  // Performance par commercial
  const commercialPerformance = mockUsers
    .filter(u => u.role === 'Commercial')
    .map(commercial => {
      const commercialProspects = prospects.filter(p => p.commercialId === commercial.userId);
      const commercialContracts = contracts.filter(c => c.commercialId === commercial.userId);
      const revenue = commercialContracts.reduce((sum, c) => sum + c.monthlyPremium, 0);
      
      return {
        name: commercial.fullName.split(' ')[0],
        prospects: commercialProspects.length,
        contrats: commercialContracts.length,
        revenue: revenue,
        conversion: commercialProspects.length > 0 ? (commercialContracts.length / commercialProspects.length * 100) : 0
      };
    });

  // Évolution mensuelle
  const monthlyEvolution = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const monthProspects = mockProspects.filter(p => {
      const pDate = new Date(p.createdAt);
      return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
    });
    const monthContracts = mockContracts.filter(c => {
      const cDate = new Date(c.subscriptionDate);
      return cDate.getMonth() === date.getMonth() && cDate.getFullYear() === date.getFullYear();
    });

    return {
      month: format(date, 'MMM', { locale: fr }),
      prospects: monthProspects.length,
      contrats: monthContracts.length,
      revenue: monthContracts.reduce((sum, c) => sum + c.monthlyPremium, 0)
    };
  });

  // Répartition par statut
  const statusDistribution = [
    { name: 'Nouveau', value: prospects.filter(p => p.status === 'Nouveau').length, color: '#3B82F6' },
    { name: 'Contact Établi', value: prospects.filter(p => p.status === 'Contact Établi').length, color: '#10B981' },
    { name: 'Devis Envoyé', value: prospects.filter(p => p.status === 'Devis Envoyé').length, color: '#F59E0B' },
    { name: 'Gagné', value: prospects.filter(p => p.status === 'Gagné - Client').length, color: '#059669' },
    { name: 'Perdu', value: prospects.filter(p => p.status === 'Perdu').length, color: '#DC2626' }
  ].filter(item => item.value > 0);

  const handleExportReport = () => {
    // Simulation d'export
    const data = {
      dateRange,
      selectedReport,
      prospects: prospects.length,
      contracts: contracts.length,
      revenue: contracts.reduce((sum, c) => sum + c.monthlyPremium, 0),
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${selectedReport}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalRevenue = contracts.reduce((sum, c) => sum + c.monthlyPremium, 0);
  const conversionRate = prospects.length > 0 ? (contracts.length / prospects.length * 100) : 0;

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports et Analyses</h1>
          <p className="text-gray-600 mt-1">Analysez les performances de votre équipe commerciale</p>
        </div>
        <button
          onClick={handleExportReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Exporter</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="3months">3 derniers mois</option>
              <option value="6months">6 derniers mois</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="overview">Vue d'ensemble</option>
              <option value="commercial">Performance commerciale</option>
              <option value="conversion">Taux de conversion</option>
              <option value="revenue">Analyse du chiffre d'affaires</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nouveaux Prospects</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{prospects.length}</p>
              <p className="text-xs text-green-600 mt-1">+12% vs période précédente</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contrats Signés</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{contracts.length}</p>
              <p className="text-xs text-green-600 mt-1">+8% vs période précédente</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de Conversion</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-red-600 mt-1">-2% vs période précédente</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalRevenue.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-green-600 mt-1">+15% vs période précédente</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

      {/* Évolution mensuelle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Mensuelle</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyEvolution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="prospects" stroke="#3B82F6" name="Prospects" strokeWidth={2} />
            <Line type="monotone" dataKey="contrats" stroke="#10B981" name="Contrats" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau de performance détaillé */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Détaillée par Commercial</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commercial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prospects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux de Conversion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CA Généré
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commercialPerformance.map((commercial, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {commercial.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commercial.prospects}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commercial.contrats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commercial.conversion.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commercial.revenue.toLocaleString('fr-FR')}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;