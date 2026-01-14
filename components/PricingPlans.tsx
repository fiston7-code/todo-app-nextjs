'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Zap } from 'lucide-react';
import { PLAN_FEATURES } from '@/lib/constants';
import { PlanType } from '@/types/planTypes';
import { PlanCard } from './PlanCard';
import { UpgradeModal } from './UpgradeModal';

interface PricingPlansProps {
  currentPlan?: PlanType;
  showCurrentPlanBadge?: boolean;
  onPlanSelect?: (plan: PlanType) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({
  currentPlan = 'free',
  showCurrentPlanBadge = true,
  onPlanSelect,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: PlanType) => {
    if (plan === 'free') {
      return;
    }

    if (onPlanSelect) {
      onPlanSelect(plan);
    } else {
      setSelectedPlan(plan);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'pro':
        return <Sparkles className="w-6 h-6" />;
      case 'business':
        return <Users className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const plans: PlanType[] = ['free', 'pro', 'business'];

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Des tarifs simples et transparents pour tous vos besoins
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan}
              plan={plan}
              icon={getPlanIcon(plan)}
              name={PLAN_FEATURES[plan].name}
              price={PLAN_FEATURES[plan].price}
              priceUnit={PLAN_FEATURES[plan].priceUnit}
              features={PLAN_FEATURES[plan].features}
              isCurrentPlan={currentPlan === plan}
              isPopular={plan === 'pro'}
              showCurrentPlanBadge={showCurrentPlanBadge}
              onSelect={() => handleSelectPlan(plan)}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Questions fréquentes
          </h3>
          <div className="space-y-6">
           <FAQItem
           question="Puis-je changer de forfait à tout moment ?"
           answer="Oui ! Vous pouvez passer à une offre supérieure ou inférieure quand vous le souhaitez. Les modifications prennent effet immédiatement."
           />
            <FAQItem
              question="Comment fonctionne le paiement Mobile Money ?"
              answer="Nous acceptons Mpesa, airtel Money, Orange Money et Visa. Le paiement est sécurisé et instantané."
            />
            <FAQItem
              question="Y a-t-il des frais cachés ?"
              answer="Non ! Les prix affichés sont tout inclus. Pas de frais cachés, pas de surprises."
            />
            <FAQItem
              question="Puis-je essayer le plan Pro gratuitement ?"
              answer="Oui ! Nous offrons une période d'essai de 14 jours pour le plan Pro sans engagement."
            />
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {selectedPlan && (
        <UpgradeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedPlan={selectedPlan}
        />
      )}
    </>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {question}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-xl">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">{answer}</p>
        </div>
      )}
    </div>
  );
};
