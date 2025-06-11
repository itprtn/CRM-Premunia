import { User, Company, Plan, Prospect, Contract, EmailTemplate, AutomationSequence, SequenceStep, ScheduledAction } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    userId: '1',
    fullName: 'Pierre Dubois',
    email: 'admin@premunia.fr',
    passwordHash: 'admin123',
    role: 'Admin',
    isActive: true
  },
  {
    userId: '2', 
    fullName: 'Marie Martin',
    email: 'marie@premunia.fr',
    passwordHash: 'marie123',
    role: 'Commercial',
    isActive: true
  },
  {
    userId: '3',
    fullName: 'Jean Dupont',
    email: 'jean@premunia.fr',
    passwordHash: 'jean123',
    role: 'Commercial',
    isActive: true
  }
];

// Mock Companies
export const mockCompanies: Company[] = [
  {
    companyId: '1',
    name: 'Mutuelle Générale',
    contactPerson: 'Sophie Laurent',
    contactEmail: 'sophie.laurent@mutuelle-generale.fr',
    contactPhone: '01 23 45 67 89'
  },
  {
    companyId: '2',
    name: 'Assurance Santé Plus',
    contactPerson: 'Marc Durand',
    contactEmail: 'marc.durand@sante-plus.fr',
    contactPhone: '01 98 76 54 32'
  },
  {
    companyId: '3',
    name: 'Senior Protect',
    contactPerson: 'Claire Moreau',
    contactEmail: 'claire.moreau@senior-protect.fr',
    contactPhone: '01 11 22 33 44'
  }
];

// Mock Plans
export const mockPlans: Plan[] = [
  {
    planId: '1',
    companyId: '1',
    name: 'Essentiel Senior',
    description: 'Couverture de base pour les seniors avec remboursement hospitalisation et soins courants',
    baseMonthlyPremium: 89.90,
    isActive: true
  },
  {
    planId: '2',
    companyId: '1',
    name: 'Confort Senior',
    description: 'Couverture étendue avec optique, dentaire et médecines douces',
    baseMonthlyPremium: 129.90,
    isActive: true
  },
  {
    planId: '3',
    companyId: '2',
    name: 'Santé Premium 65+',
    description: 'Formule haut de gamme avec chambre particulière et dépassements d\'honoraires',
    baseMonthlyPremium: 189.90,
    isActive: true
  },
  {
    planId: '4',
    companyId: '3',
    name: 'Protection Totale',
    description: 'Couverture complète avec assistance et services à domicile',
    baseMonthlyPremium: 159.90,
    isActive: true
  }
];

// Mock Prospects
export const mockProspects: Prospect[] = [
  {
    prospectId: '1',
    commercialId: '2',
    firstName: 'Robert',
    lastName: 'Durand',
    email: 'robert.durand@email.fr',
    phone: '06 12 34 56 78',
    dateOfBirth: '1955-03-15',
    address: '12 rue de la Paix, 75001 Paris',
    status: 'Nouveau',
    source: 'Site Web',
    createdAt: '2024-01-15T10:30:00Z',
    lastInteractionAt: '2024-01-15T10:30:00Z'
  },
  {
    prospectId: '2',
    commercialId: '2',
    firstName: 'Françoise',
    lastName: 'Martin',
    email: 'francoise.martin@email.fr',
    phone: '06 98 76 54 32',
    dateOfBirth: '1960-07-22',
    address: '45 avenue des Champs, 69000 Lyon',
    status: 'Contact Établi',
    source: 'Recommandation',
    createdAt: '2024-01-10T14:20:00Z',
    lastInteractionAt: '2024-01-18T16:45:00Z'
  },
  {
    prospectId: '3',
    commercialId: '3',
    firstName: 'Michel',
    lastName: 'Leblanc',
    email: 'michel.leblanc@email.fr',
    phone: '06 55 44 33 22',
    dateOfBirth: '1958-11-08',
    address: '78 boulevard Saint-Germain, 33000 Bordeaux',
    status: 'Devis Envoyé',
    source: 'Campagne Email',
    createdAt: '2024-01-05T09:15:00Z',
    lastInteractionAt: '2024-01-20T11:30:00Z'
  },
  {
    prospectId: '4',
    commercialId: '2',
    firstName: 'Sylvie',
    lastName: 'Rousseau',
    email: 'sylvie.rousseau@email.fr',
    phone: '06 77 88 99 00',
    dateOfBirth: '1962-04-12',
    address: '23 rue Victor Hugo, 13000 Marseille',
    status: 'Gagné - Client',
    source: 'Salon Senior',
    createdAt: '2023-12-20T13:45:00Z',
    lastInteractionAt: '2024-01-22T10:15:00Z'
  }
];

// Mock Contracts
export const mockContracts: Contract[] = [
  {
    contractId: '1',
    prospectId: '4',
    planId: '2',
    commercialId: '2',
    contractNumber: 'CTR-2024-001',
    subscriptionDate: '2024-01-22',
    effectiveDate: '2024-02-01',
    monthlyPremium: 129.90,
    status: 'Actif'
  }
];

// Mock Email Templates
export const mockEmailTemplates: EmailTemplate[] = [
  {
    templateId: '1',
    name: 'Premier Contact',
    subject: 'Bonjour {{prospect.firstName}}, votre demande de devis mutuelle senior',
    body: `Bonjour {{prospect.firstName}},

Merci pour votre intérêt pour nos solutions de mutuelle santé senior.

Je suis {{commercial.fullName}}, votre conseiller dédié chez Premunia. Je vais étudier votre profil et vous proposer les meilleures solutions adaptées à vos besoins.

Je vous recontacterai dans les 48h pour faire le point sur vos attentes.

Cordialement,
{{commercial.fullName}}
Premunia - Spécialiste Mutuelle Senior`
  },
  {
    templateId: '2',
    name: 'Relance Devis',
    subject: 'Votre devis mutuelle senior - {{prospect.firstName}}',
    body: `Bonjour {{prospect.firstName}},

J'espère que vous allez bien. Je reviens vers vous concernant le devis que je vous ai envoyé il y a quelques jours.

Avez-vous eu l'occasion de l'examiner ? Je reste à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre choix.

N'hésitez pas à me contacter au 01 23 45 67 89.

Cordialement,
{{commercial.fullName}}`
  },
  {
    templateId: '3',
    name: 'Relance Marketing',
    subject: 'Une solution mutuelle adaptée à vos besoins - {{prospect.firstName}}',
    body: `Bonjour {{prospect.firstName}},

Nous n'avons pas eu l'occasion d'échanger récemment, mais je tenais à vous informer de nos nouvelles offres mutuelle senior.

Nos tarifs ont été revus à la baisse et nous proposons maintenant des garanties encore plus avantageuses.

Si vous souhaitez faire le point sur votre situation, je suis disponible pour un entretien téléphonique.

Bien à vous,
{{commercial.fullName}}`
  }
];

// Mock Automation Sequences
export const mockAutomationSequences: AutomationSequence[] = [
  {
    sequenceId: '1',
    name: 'Séquence Nouveau Prospect',
    triggerProspectStatus: 'Nouveau',
    isActive: true
  },
  {
    sequenceId: '2',
    name: 'Relance Devis J+5',
    triggerProspectStatus: 'Devis Envoyé',
    isActive: true
  },
  {
    sequenceId: '3',
    name: 'Relance Marketing Prospect Perdu',
    triggerProspectStatus: 'Perdu',
    isActive: true
  }
];

// Mock Sequence Steps
export const mockSequenceSteps: SequenceStep[] = [
  // Séquence Nouveau Prospect
  {
    stepId: '1',
    sequenceId: '1',
    executionOrder: 1,
    delayDays: 0,
    actionType: 'SEND_EMAIL',
    emailTemplateId: '1'
  },
  {
    stepId: '2',
    sequenceId: '1',
    executionOrder: 2,
    delayDays: 2,
    actionType: 'CREATE_TASK',
    taskDescription: 'Appeler le prospect pour faire connaissance'
  },
  {
    stepId: '3',
    sequenceId: '1',
    executionOrder: 3,
    delayDays: 7,
    actionType: 'UPDATE_PROSPECT_STATUS',
    targetStatus: 'À Contacter'
  },
  // Séquence Relance Devis
  {
    stepId: '4',
    sequenceId: '2',
    executionOrder: 1,
    delayDays: 5,
    actionType: 'SEND_EMAIL',
    emailTemplateId: '2'
  },
  {
    stepId: '5',
    sequenceId: '2',
    executionOrder: 2,
    delayDays: 10,
    actionType: 'CREATE_TASK',
    taskDescription: 'Appel de relance pour le devis'
  },
  // Séquence Relance Marketing
  {
    stepId: '6',
    sequenceId: '3',
    executionOrder: 1,
    delayDays: 30,
    actionType: 'SEND_EMAIL',
    emailTemplateId: '3'
  },
  {
    stepId: '7',
    sequenceId: '3',
    executionOrder: 2,
    delayDays: 60,
    actionType: 'UPDATE_PROSPECT_STATUS',
    targetStatus: 'Relance Marketing'
  }
];

// Mock Scheduled Actions
export const mockScheduledActions: ScheduledAction[] = [
  {
    actionId: '1',
    prospectId: '1',
    stepId: '1',
    scheduledExecutionTime: '2024-01-15T10:30:00Z',
    status: 'Exécutée',
    resultMessage: 'Email envoyé avec succès'
  },
  {
    actionId: '2',
    prospectId: '1',
    stepId: '2',
    scheduledExecutionTime: '2024-01-17T10:30:00Z',
    status: 'En Attente'
  },
  {
    actionId: '3',
    prospectId: '3',
    stepId: '4',
    scheduledExecutionTime: '2024-01-25T11:30:00Z',
    status: 'En Attente'
  }
];