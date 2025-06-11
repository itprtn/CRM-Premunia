// Types de base pour le CRM Premunia
export type UserRole = 'Admin' | 'Commercial';

export type ProspectStatus = 
  | 'Nouveau' 
  | 'À Contacter' 
  | 'Contact Établi' 
  | 'Ne répond pas' 
  | 'Analyse des Besoins' 
  | 'Devis Envoyé' 
  | 'En Négociation' 
  | 'Gagné - Client' 
  | 'Perdu' 
  | 'Relance Marketing';

export type ContractStatus = 'Actif' | 'En Attente' | 'Résilié';

export type ActionType = 'SEND_EMAIL' | 'UPDATE_PROSPECT_STATUS' | 'CREATE_TASK';

export type ScheduledActionStatus = 'En Attente' | 'Exécutée' | 'Annulée par Commercial' | 'Échouée';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
}

export interface Company {
  companyId: string;
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Plan {
  planId: string;
  companyId: string;
  name: string;
  description: string;
  baseMonthlyPremium: number;
  isActive: boolean;
}

export interface Prospect {
  prospectId: string;
  commercialId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  address?: string;
  status: ProspectStatus;
  source?: string;
  createdAt: string;
  lastInteractionAt?: string;
}

export interface Contract {
  contractId: string;
  prospectId: string;
  planId: string;
  commercialId: string;
  contractNumber: string;
  subscriptionDate: string;
  effectiveDate: string;
  monthlyPremium: number;
  status: ContractStatus;
}

export interface EmailTemplate {
  templateId: string;
  name: string;
  subject: string;
  body: string;
}

export interface AutomationSequence {
  sequenceId: string;
  name: string;
  triggerProspectStatus: ProspectStatus;
  isActive: boolean;
}

export interface SequenceStep {
  stepId: string;
  sequenceId: string;
  executionOrder: number;
  delayDays: number;
  actionType: ActionType;
  emailTemplateId?: string;
  targetStatus?: string;
  taskDescription?: string;
}

export interface ScheduledAction {
  actionId: string;
  prospectId: string;
  stepId: string;
  scheduledExecutionTime: string;
  status: ScheduledActionStatus;
  resultMessage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  newProspects: number;
  conversionRate: number;
  contractsSigned: number;
  monthlyRevenue: number;
}