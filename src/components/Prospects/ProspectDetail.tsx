import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Phone, Mail, Calendar, MapPin, User, Clock, CheckCircle, X } from 'lucide-react';
import { mockProspects, mockUsers, mockScheduledActions } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ProspectStatus } from '../../types';
import toast from 'react-hot-toast';

const ProspectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProspect, setEditedProspect] = useState<any>(null);

  const prospect = mockProspects.find(p => p.prospectId === id);
  const commercial = mockUsers.find(u => u.userId === prospect?.commercialId);
  const scheduledActions = mockScheduledActions.filter(sa => sa.prospectId === id);

  if (!prospect) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Prospect non trouvé</h3>
          <button
            onClick={() => navigate('/prospects')}
            className="text-blue-600 hover:text-blue-800"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  // Vérifier les permissions
  if (user?.role === 'Commercial' && prospect.commercialId !== user.userId) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
          <p className="text-gray-500 mb-4">Vous ne pouvez voir que vos propres prospects</p>
          <button
            onClick={() => navigate('/prospects')}
            className="text-blue-600 hover:text-blue-800"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditedProspect({ ...prospect });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Dans une vraie application, ceci ferait un appel API
    toast.success('Prospect mis à jour avec succès');
    setIsEditing(false);
    setEditedProspect(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProspect(null);
  };

  const handleStatusChange = (newStatus: ProspectStatus) => {
    // Dans une vraie application, ceci ferait un appel API
    toast.success(`Statut changé vers "${newStatus}"`);
  };

  const cancelScheduledAction = (actionId: string) => {
    // Dans une vraie application, ceci ferait un appel API
    toast.success('Action automatique annulée');
  };

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

  const age = new Date().getFullYear() - new Date(prospect.dateOfBirth).getFullYear();

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/prospects')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {prospect.firstName} {prospect.lastName}
            </h1>
            <p className="text-gray-600">{age} ans • {prospect.source || 'Source inconnue'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(prospect.status)}`}>
            {prospect.status}
          </span>
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations de contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{prospect.email || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{prospect.phone || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium">
                    {format(new Date(prospect.dateOfBirth), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{prospect.address || 'Non renseignée'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Changement de statut */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Changer le Statut</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Nouveau', 'À Contacter', 'Contact Établi', 'Ne répond pas',
                'Analyse des Besoins', 'Devis Envoyé', 'En Négociation',
                'Gagné - Client', 'Perdu', 'Relance Marketing'
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as ProspectStatus)}
                  disabled={status === prospect.status}
                  className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                    status === prospect.status
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Actions automatiques en cours */}
          {scheduledActions.filter(sa => sa.status === 'En Attente').length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Automatisation en Cours ({scheduledActions.filter(sa => sa.status === 'En Attente').length})
              </h3>
              <div className="space-y-3">
                {scheduledActions
                  .filter(sa => sa.status === 'En Attente')
                  .map((action) => (
                    <div key={action.actionId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            Action automatique prévue
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(action.scheduledExecutionTime), 'dd/MM/yyyy à HH:mm')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => cancelScheduledAction(action.actionId)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Annuler cette action"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Commercial assigné */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Commercial Assigné</h3>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{commercial?.fullName}</p>
                <p className="text-sm text-gray-500">{commercial?.email}</p>
              </div>
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Prospect créé</p>
                  <p className="text-gray-500">
                    {format(new Date(prospect.createdAt), 'dd/MM/yyyy à HH:mm')}
                  </p>
                </div>
              </div>
              {prospect.lastInteractionAt && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Dernière interaction</p>
                    <p className="text-gray-500">
                      {format(new Date(prospect.lastInteractionAt), 'dd/MM/yyyy à HH:mm')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              {prospect.phone && (
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Appeler</span>
                </button>
              )}
              {prospect.email && (
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Envoyer un email</span>
                </button>
              )}
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Créer une tâche</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'édition */}
      {isEditing && editedProspect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier le Prospect</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editedProspect.firstName}
                    onChange={(e) => setEditedProspect({...editedProspect, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={editedProspect.lastName}
                    onChange={(e) => setEditedProspect({...editedProspect, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedProspect.email || ''}
                    onChange={(e) => setEditedProspect({...editedProspect, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={editedProspect.phone || ''}
                    onChange={(e) => setEditedProspect({...editedProspect, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={editedProspect.address || ''}
                    onChange={(e) => setEditedProspect({...editedProspect, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectDetail;