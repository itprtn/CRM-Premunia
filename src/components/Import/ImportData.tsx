import React, { useState } from 'react';
import { Upload, Download, FileText, Users, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type ImportType = 'prospects' | 'companies' | 'contracts';

interface ImportStep {
  id: number;
  title: string;
  completed: boolean;
}

const ImportData: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ImportType>('prospects');
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const importTypes = [
    {
      id: 'prospects' as ImportType,
      title: 'Prospects',
      description: 'Importer une liste de prospects avec leurs informations de contact',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'companies' as ImportType,
      title: 'Compagnies',
      description: 'Importer des compagnies d\'assurance et leurs informations',
      icon: Building2,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'contracts' as ImportType,
      title: 'Contrats',
      description: 'Importer des contrats existants avec leurs détails',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const steps: ImportStep[] = [
    { id: 1, title: 'Sélection du type', completed: currentStep > 1 },
    { id: 2, title: 'Téléchargement du fichier', completed: currentStep > 2 },
    { id: 3, title: 'Mapping des colonnes', completed: currentStep > 3 },
    { id: 4, title: 'Validation', completed: currentStep > 4 },
    { id: 5, title: 'Importation', completed: false }
  ];

  const handleDownloadTemplate = () => {
    toast.success(`Modèle ${selectedType} téléchargé`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setCurrentStep(3);
      toast.success('Fichier uploadé avec succès');
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartImport = () => {
    setIsProcessing(true);
    // Simulation d'un processus d'importation
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Importation terminée avec succès!');
      setCurrentStep(1);
      setUploadedFile(null);
    }, 3000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Sélectionnez le type de données à importer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {importTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${type.color} w-fit mx-auto mb-4`}>
                    <type.icon className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{type.title}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Téléchargement du fichier</h3>
            
            {/* Télécharger le modèle */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">Télécharger le modèle</h4>
                  <p className="text-sm text-blue-700">
                    Utilisez notre modèle pour formater correctement vos données
                  </p>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Télécharger
                </button>
              </div>
            </div>

            {/* Zone d'upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Glissez votre fichier ici ou cliquez pour sélectionner
              </h4>
              <p className="text-gray-600 mb-4">Formats acceptés: CSV, Excel (.xlsx)</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
              >
                Sélectionner un fichier
              </label>
            </div>

            {uploadedFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Fichier uploadé</h4>
                    <p className="text-sm text-green-700">{uploadedFile.name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
              {uploadedFile && (
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continuer
                </button>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Mapping des colonnes</h3>
            <p className="text-gray-600">
              Faites correspondre les colonnes de votre fichier avec les champs de la base de données
            </p>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Colonne du fichier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Champ de destination
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {['Prénom', 'Nom', 'Email', 'Téléphone', 'Date de naissance'].map((column, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Sélectionner un champ</option>
                          <option value="firstName">Prénom</option>
                          <option value="lastName">Nom</option>
                          <option value="email">Email</option>
                          <option value="phone">Téléphone</option>
                          <option value="dateOfBirth">Date de naissance</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={handleNextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Valider le mapping
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Validation des données</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Validation réussie</h4>
                  <p className="text-sm text-green-700">
                    50 lignes validées, prêtes à être importées
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-900">Avertissements</h4>
                  <p className="text-sm text-yellow-700">
                    3 doublons potentiels détectés (basés sur l'email)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Aperçu des données (5 premières lignes)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Prénom</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nom</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Téléphone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.fr', phone: '06 12 34 56 78' },
                      { firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@email.fr', phone: '06 98 76 54 32' },
                      { firstName: 'Pierre', lastName: 'Durand', email: 'pierre.durand@email.fr', phone: '06 55 44 33 22' }
                    ].map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{row.firstName}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{row.lastName}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{row.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{row.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={handleStartImport}
                disabled={isProcessing}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Importation en cours...' : 'Lancer l\'importation'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Importation de Données</h1>
        <p className="text-gray-600 mt-1">Importez vos données en masse depuis des fichiers CSV ou Excel</p>
      </div>

      {/* Indicateur d'étapes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step.completed 
                  ? 'bg-green-600 text-white' 
                  : currentStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step.completed || currentStep === step.id ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  step.completed ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {renderStepContent()}
      </div>

      {/* Processus d'importation */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Importation en cours</h3>
              <p className="text-gray-600">Veuillez patienter pendant le traitement de vos données...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportData;