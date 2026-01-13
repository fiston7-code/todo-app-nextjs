

import { PlanType } from '@/types/planTypes';

// ==================== PLAN LIMITS ====================
export const PLAN_LIMITS = {
  free: {
    maxProjects: 3,
    maxExportRows: 100,
    historyDays: 30,
  },
  pro: {
    maxProjects: null,
    maxExportRows: null,
    historyDays: null,
  },
  business: {
    maxProjects: null,
    maxExportRows: null,
    historyDays: null,
  },
} as const;

// ==================== PRICING ====================
export const PLAN_PRICES = {
  free: 0,
  pro: 10,
  business: 25,
} as const;

export const PLAN_FEATURES = {
  free: {
    name: 'Gratuit',
    price: 0,
    features: [
      'Jusqu\'à 3 projets',
      'Tâches illimitées',
      'Vue liste',
      'Filtres de base',
      'Recherche simple',
      'Export limité (100 lignes)',
      'Historique 30 jours',
    ],
  },
  pro: {
    name: 'Pro',
    price: 10,
    features: [
      'Projets illimités',
      'Tags personnalisés',
      'Sous-tâches',
      'Rappels intelligents',
      'Vue Kanban & Calendrier',
      'Filtres avancés',
      'Vues sauvegardées',
      'Analytics avancés',
      'Templates de tâches',
      'Export illimité',
      'Historique illimité',
    ],
  },
  business: {
    name: 'Business',
    price: 25,
    priceUnit: 'par utilisateur',
    features: [
      'Tout du plan Pro',
      'Collaboration en temps réel',
      'Assignation de tâches',
      'Commentaires & mentions',
      'Rôles et permissions',
      'Workspaces multiples',
      'Automatisations',
      'Rapports d\'équipe',
      'Intégrations API',
      'Support prioritaire 24/7',
      'Formation personnalisée',
    ],
  },
} as const;

// ==================== UI CONSTANTS ====================
export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400',
  low: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400',
} as const;

export const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  done: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
} as const;

export const PRIORITY_LABELS = {
  high: 'Haute',
  medium: 'Moyenne',
  low: 'Basse',
} as const;

export const STATUS_LABELS = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
} as const;

// ==================== MOBILE MONEY ====================
export const MOBILE_MONEY_PROVIDERS = [
  { value: 'mtn', label: 'MTN Mobile Money', icon: '📱' },
  { value: 'moov', label: 'Moov Money', icon: '💰' },
  { value: 'orange', label: 'Orange Money', icon: '🍊' },
  { value: 'wave', label: 'Wave', icon: '🌊' },
] as const;

// ==================== PROJECT COLORS ====================
export const PROJECT_COLORS = [
  { value: 'blue', label: 'Bleu', color: '#3B82F6' },
  { value: 'green', label: 'Vert', color: '#10B981' },
  { value: 'red', label: 'Rouge', color: '#EF4444' },
  { value: 'yellow', label: 'Jaune', color: '#F59E0B' },
  { value: 'purple', label: 'Violet', color: '#8B5CF6' },
  { value: 'pink', label: 'Rose', color: '#EC4899' },
  { value: 'indigo', label: 'Indigo', color: '#6366F1' },
  { value: 'gray', label: 'Gris', color: '#6B7280' },
] as const;

// ==================== PROJECT ICONS ====================
export const PROJECT_ICONS = [
  '📁', '💼', '🎯', '🚀', '💡', '🎨', '📊', '🏠',
  '🏢', '🎓', '💻', '📱', '🛠️', '⚡', '🌟', '🎪',
] as const;