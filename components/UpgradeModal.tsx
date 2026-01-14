'use client';

import React, { useState } from 'react';
import { X, CreditCard, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import { PlanType } from '@/types/planTypes';
import { PLAN_FEATURES, MOBILE_MONEY_PROVIDERS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanType;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
}) => {
  const [step, setStep] = useState<'select' | 'details' | 'processing' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const planDetails = PLAN_FEATURES[selectedPlan];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      setStep('processing');
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { error: updateError } = await supabase
        .from('user_plans')
        .upsert({
          user_id: user.id,
          plan: selectedPlan,
          mobile_money_provider: paymentMethod === 'mobile_money' ? mobileMoneyProvider : null,
          mobile_money_number: paymentMethod === 'mobile_money' ? phoneNumber : null,
          subscription_start: new Date().toISOString(),
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
        });

      if (updateError) throw updateError;

      setStep('success');
      
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement');
      setStep('details');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Mode de paiement
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('mobile_money');
                    setStep('details');
                  }}
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center gap-4 bg-white dark:bg-gray-800"
                >
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Mobile Money</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Mpesa, Airtel money, Orange money,
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card');
                    setStep('details');
                  }}
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center gap-4 bg-white dark:bg-gray-800"
                >
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Carte bancaire</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Visa, Mastercard
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {paymentMethod === 'mobile_money' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Opérateur
                  </label>
                  <select
                    value={mobileMoneyProvider}
                    onChange={(e) => setMobileMoneyProvider(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionnez un opérateur</option>
                    {MOBILE_MONEY_PROVIDERS.map((provider) => (
                      <option key={provider.value} value={provider.value}>
                        {provider.icon} {provider.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+243 XX XX XX XX"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  Le paiement par carte bancaire sera bientôt disponible.
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading || (paymentMethod === 'card')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Traitement...' : `Payer ${planDetails.price}€`}
              </button>
            </div>
          </form>
        );

      case 'processing':
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Traitement du paiement...
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Veuillez patienter
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Paiement réussi !
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bienvenue dans le plan {planDetails.name} 🎉
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Passer au plan {planDetails.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {planDetails.price}€/mois {planDetails.priceUnit && `• ${planDetails.priceUnit}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};
