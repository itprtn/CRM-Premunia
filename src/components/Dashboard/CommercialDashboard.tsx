import React from 'react';
import { Users, TrendingUp, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockProspects, mockContracts, mockScheduledActions } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { format, subDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

const CommercialDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Filtrer les données pour le commercial connecté
  const myProspects = mockProspects.filter(p => p.commercialId === user?.userId);
  const myContracts = mockContracts.filter(c => c.commercialId === user?.userId);
  const myScheduledActions = mockScheduledActions.filter(sa => {
    const prospect = mockProspects.find(p => p.prospectId === sa.prospectId);
    return prospect?.commercialId === user?.userId;
  });

  // Calculs des KPIs
  const thirtyDaysAgo = subDays(new Date(), 30);
  const newProspects = myProspects.filter(p => 
    isAfter(new Date(p.createdAt), thirtyDaysAgo)
  ).length;

  const totalProspects = myProspects.length;
  const clientsCount = myProspects.filter(p => p.status === 'Gagné - Client').length;
  const conversionRate = totalProspects > 0 ? (clientsCount / totalProspects * 100) : 0;

  const activeContracts = myContracts.filter(c => c.status === 'Actif').length;

  // Actions en attente aujourd'hui
  const today = new Date();
  const todayActions = myScheduledActions.filter(sa => 
    sa.status === 'En Attente' && 
    format(new Date(sa.scheduledExecutionTime), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  // Prospects à relancer (sans activité depuis 7 jours)
  const sevenDaysAgo = subDays(new Date(), 7);
  const prospectsToFollow = myProspects.filter(p => 
    p.lastInteractionAt && 
    isAfter(sevenDaysAgo, new Date(p.lastInteractionAt)) &&
    !['Gagné - Client', 'Perdu'].includes(p.status)
  );

  // Tâches personnelles (actions CREATE_TASK en attente)
  const pendingTasks = myScheduledActions.filter(sa => sa.status === 'En Attente');

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Bonjour {user?.fullName}, voici votre activité</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Aujourd'hui</p>
          <p className="font-medium">{format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
        </div>
      </div>

      {/* KPIs personnels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mes Nouveaux Prospects</p>
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
              <p className="text-sm font-medium text-gray-600">Mon Taux de Conversion</p>
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
              <p className="text-sm font-medium text-gray-600">Mes Contrats Signés</p>
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
              <p className="text-sm font-medium text-gray-600">Actions Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{todayActions.length}</p>
              <p className="text-xs text-gray-500 mt-1">À traiter</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sections d'actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tâches personnelles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Mes Tâches ({pendingTasks.length})
            </h3>
          </div>
          {pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((action) => {
                const prospect = mockProspects.find(p => p.prospectId === action.prospectId);
                return (
                  <div key={action.actionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {prospect?.firstName} {prospect?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Prévu le {format(new Date(action.scheduledExecutionTime), 'dd/MM à HH:mm')}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Voir
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune tâche en attente</p>
          )}
        </div>

        {/* Prospects à relancer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Prospects à Relancer ({prospectsToFollow.length})
            </h3>
          </div>
          {prospectsToFollow.length > 0 ? (
            <div className="space-y-3">
              {prospectsToFollow.slice(0, 5).map((prospect) => (
                <div key={prospect.prospectId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {prospect.firstName} {prospect.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dernière interaction: {prospect.lastInteractionAt && format(new Date(prospect.lastInteractionAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    {prospect.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Tous vos prospects sont à jour</p>
          )}
        </div>
      </div>

      {/* Répartition de mes prospects par statut */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition de mes Prospects</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
            { status: 'Contact Établi', color: 'bg-green-100 text-green-800' },
            { status: 'Devis Envoyé', color: 'bg-yellow-100 text-yellow-800' },
            { status: 'Gagné - Client', color: 'bg-emerald-100 text-emerald-800' },
            { status: 'Perdu', color: 'bg-red-100 text-red-800' }
          ].map((item) => {
            const count = myProspects.filter(p => p.status === item.status).length;
            return (
              <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className={`text-xs font-medium px-2 py-1 rounded-full mt-2 ${item.color}`}>
                  {item.status}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommercialDashboard;