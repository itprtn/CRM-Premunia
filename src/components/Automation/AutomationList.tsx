import React, { useState } from 'react';
import { Plus, Play, Pause, Edit, Trash2, Zap, Clock, Mail, User, CheckSquare } from 'lucide-react';
import { mockAutomationSequences, mockSequenceSteps, mockEmailTemplates } from '../../data/mockData';
import { AutomationSequence, SequenceStep } from '../../types';

const AutomationList: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<AutomationSequence | null>(null);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'SEND_EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'UPDATE_PROSPECT_STATUS':
        return <User className="h-4 w-4" />;
      case 'CREATE_TASK':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'SEND_EMAIL':
        return 'Envoyer Email';
      case 'UPDATE_PROSPECT_STATUS':
        return 'Changer Statut';
      case 'CREATE_TASK':
        return 'Créer Tâche';
      default:
        return actionType;
    }
  };

  const getSequenceSteps = (sequenceId: string): SequenceStep[] => {
    return mockSequenceSteps
      .filter(step => step.sequenceId === sequenceId)
      .sort((a, b) => a.executionOrder - b.executionOrder);
  };

  const getEmailTemplateName = (templateId?: string) => {
    if (!templateId) return '';
    const template = mockEmailTemplates.find(t => t.templateId === templateId);
    return template?.name || '';
  };

  const toggleSequenceStatus = (sequenceId: string) => {
    // Dans une vraie application, ceci ferait un appel API
    console.log('Toggle sequence status:', sequenceId);
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automatisation</h1>
          <p className="text-gray-600 mt-1">Gérez vos séquences de relance automatiques</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nouvelle Séquence</span>
        </button>
      </div>

      {/* Liste des séquences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAutomationSequences.map((sequence) => {
          const steps = getSequenceSteps(sequence.sequenceId);
          
          return (
            <div key={sequence.sequenceId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* En-tête de la séquence */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${sequence.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Zap className={`h-5 w-5 ${sequence.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                    <p className="text-sm text-gray-500">
                      Déclencheur: <span className="font-medium">{sequence.triggerProspectStatus}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSequenceStatus(sequence.sequenceId)}
                    className={`p-2 rounded-lg transition-colors ${
                      sequence.isActive 
                        ? 'text-orange-600 hover:bg-orange-100' 
                        : 'text-green-600 hover:bg-green-100'
                    }`}
                    title={sequence.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {sequence.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Statut */}
              <div className="mb-4">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  sequence.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {sequence.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Étapes de la séquence */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Étapes ({steps.length})
                </h4>
                {steps.map((step, index) => (
                  <div key={step.stepId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">J+{step.delayDays}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      {getActionIcon(step.actionType)}
                      <span className="text-sm font-medium text-gray-900">
                        {getActionLabel(step.actionType)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.actionType === 'SEND_EMAIL' && step.emailTemplateId && (
                        <span>"{getEmailTemplateName(step.emailTemplateId)}"</span>
                      )}
                      {step.actionType === 'UPDATE_PROSPECT_STATUS' && step.targetStatus && (
                        <span>→ {step.targetStatus}</span>
                      )}
                      {step.actionType === 'CREATE_TASK' && step.taskDescription && (
                        <span className="truncate max-w-32">{step.taskDescription}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton pour voir les détails */}
              <button
                onClick={() => setSelectedSequence(sequence)}
                className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Voir les détails
              </button>
            </div>
          );
        })}
      </div>

      {/* État vide */}
      {mockAutomationSequences.length === 0 && (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune séquence d'automatisation</h3>
          <p className="text-gray-500 mb-6">
            Créez votre première séquence pour automatiser vos relances
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer une séquence
          </button>
        </div>
      )}

      {/* Statistiques d'utilisation */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques d'Automatisation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{mockAutomationSequences.filter(s => s.isActive).length}</p>
            <p className="text-sm text-gray-600">Séquences actives</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {mockSequenceSteps.filter(s => s.actionType === 'SEND_EMAIL').length}
            </p>
            <p className="text-sm text-gray-600">Emails automatiques</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {mockSequenceSteps.reduce((sum, step) => sum + step.delayDays, 0)}
            </p>
            <p className="text-sm text-gray-600">Jours de suivi total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationList;