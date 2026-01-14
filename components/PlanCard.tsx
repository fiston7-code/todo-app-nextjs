'use client';

import React from 'react';
import { Check, Crown } from 'lucide-react';
import { PlanType } from '@/types/planTypes';

interface PlanCardProps {
  plan: PlanType;
  icon: React.ReactNode;
  name: string;
  price: number;
  priceUnit?: string;
  features:  readonly string[];
  isCurrentPlan: boolean;
  isPopular?: boolean;
  showCurrentPlanBadge?: boolean;
  onSelect: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  icon,
  name,
  price,
  priceUnit,
  features,
  isCurrentPlan,
  isPopular = false,
  showCurrentPlanBadge = true,
  onSelect,
}) => {
  const getButtonText = () => {
    if (isCurrentPlan) return 'Plan actuel';
    if (plan === 'free') return 'Commencer gratuitement';
    return 'Choisir ce plan';
  };

  const getButtonStyle = () => {
    if (isCurrentPlan) {
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed';
    }
    if (isPopular) {
      return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700';
    }
    return 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100';
  };

  return (
    <div
      className={`relative rounded-2xl border-2 p-8 transition-all ${
        isPopular
          ? 'border-blue-500 dark:border-purple-500 shadow-xl scale-105'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } ${
        isCurrentPlan
          ? 'bg-blue-50 dark:bg-blue-900/10'
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Crown className="w-4 h-4" />
            Le plus populaire
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && showCurrentPlanBadge && (
        <div className="absolute top-4 right-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
            Actuel
          </div>
        </div>
      )}

      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${
          isPopular
            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
      >
        {icon}
      </div>

      {/* Plan Name */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {name}
      </h3>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">
            {price}€
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            /mois
          </span>
        </div>
        {priceUnit && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {priceUnit}
          </p>
        )}
      </div>

      {/* Features List */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        disabled={isCurrentPlan}
        className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${getButtonStyle()}`}
      >
        {getButtonText()}
      </button>
    </div>
  );
};
