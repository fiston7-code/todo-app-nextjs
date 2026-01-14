'use client';

import { useState, useEffect, Suspense } from 'react'; // Ajout de Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, ArrowLeft, User } from 'lucide-react';

// 1. On crée un composant interne pour la logique du formulaire
function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Utilisation sécurisée ici
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
          },
        });

        if (error) throw error;
        
        if (data?.user?.identities?.length === 0) {
          setError('Cet email est déjà utilisé. Veuillez vous connecter.');
          setIsLogin(true);
        } else {
          setSuccess(`🎉 Compte créé ! Vérifiez vos emails (${email}) pour activer votre compte.`);
          setName(''); setEmail(''); setPassword('');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* ... (Tout ton JSX de formulaire ici : Button Retour, Card, etc.) ... */}
      <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6 group hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
      </Button>

      <Card className="shadow-2xl border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">✓</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{isLogin ? 'Bienvenue !' : 'Créer un compte'}</CardTitle>
          <CardDescription>{isLogin ? 'Connectez-vous pour accéder à vos tâches' : 'Commencez à organiser votre vie'}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10" />
              </div>
            </div>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {success && <Alert className="bg-green-50 text-green-800 border-green-200"><AlertDescription>{success}</AlertDescription></Alert>}

            <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (isLogin ? 'Se connecter' : 'Créer mon compte')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t pt-6">
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }} className="text-blue-600 hover:underline">
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

// 2. Le composant principal exporté par défaut
export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 flex items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-blue-600" />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}