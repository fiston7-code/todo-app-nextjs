
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, ArrowLeft, Moon, Sun, User } from 'lucide-react';


export default function AuthPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  

const searchParams = useSearchParams();

useEffect(() => {
  const errorParam = searchParams?.get('error');
  const verifiedParam = searchParams?.get('verified');
  
  if (errorParam === 'verification-failed') {
    setError('La vérification de l\'email a échoué. Veuillez réessayer.');
  }
  
  if (verifiedParam === 'true') {
    setSuccess('Email vérifié ! Vous pouvez maintenant vous connecter.');
    setIsLogin(true);
  }
}, [searchParams]);
 

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        router.push('/dashboard');
    } else {
      // Inscription avec metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
        },
      });

      if (error) throw error;
      
      if (data?.user?.identities?.length === 0) {
        setError('Cet email est déjà utilisé. Veuillez vous connecter.');
        setIsLogin(true);
      } else {
        // ✅ Message plus détaillé
        setSuccess(
          '🎉 Compte créé avec succès ! Un email de confirmation vient d\'être envoyé à ' + 
          email + 
          '. Cliquez sur "Oui, c\'est moi" dans l\'email pour activer votre compte.'
        );
        setName('');
        setEmail('');
        setPassword('');
      }
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Une erreur est survenue');
  } finally {
    setLoading(false);
  }
};

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      
     

      <div className="w-full max-w-md">
        
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6 group hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Button>

        <Card className="shadow-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 transition-colors">
          <CardHeader className="text-center pb-8">
            
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white font-bold text-3xl">✓</span>
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              {isLogin ? 'Bienvenue !' : 'Créer un compte'}
            </CardTitle>
            <CardDescription className="text-base mt-2 text-gray-600 dark:text-gray-400">
              {isLogin 
                ? 'Connectez-vous pour accéder à vos tâches' 
                : 'Commencez à organiser votre vie dès aujourd\'hui'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Field - Only for Signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nom complet
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-10 h-12 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 h-12 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    disabled={loading}
                  />
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Minimum 6 caractères
                  </p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-top-2">
                  <AlertDescription className="text-sm">{success}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isLogin ? 'Connexion...' : 'Création du compte...'}
                  </>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer mon compte'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            
            {/* Toggle Login/Signup */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                disabled={loading}
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Connexion sécurisée SSL</span>
            </div>
          </CardFooter>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="text-2xl mb-1">🚀</div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Simple</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Rapide</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Sécurisé</div>
          </div>
        </div>
      </div>
    </div>
  );
}

