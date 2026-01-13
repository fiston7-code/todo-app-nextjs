'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { useTodoActions, useTodosLoading } from '@/store/selectors/todoSelectors';

import { AddTodo } from '@/components/AddTodo';
import { TodoFilters } from '@/components/TodoFilters';
import { TodoStats } from '@/components/TodoStats';
import { TodoList } from '@/components/TodoList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const router = useRouter();
  
  const { fetchTodos } = useTodoActions();
  const { loading: todosLoading, error } = useTodosLoading();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
        setLoading(false);
        fetchTodos();
      }
    };

    checkAuth();
  }, [router, fetchTodos]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  const userName = user?.user_metadata?.full_name || 'Utilisateur';

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* 🎯 En-tête */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl sm:text-3xl truncate">
                  👋 Salut {userName} !
                </CardTitle>
                <CardDescription className="mt-2 truncate">
                  {user?.email}
                </CardDescription>
              </div>
              
            </div>
          </CardHeader>
        </Card>

        {/* 📊 Statistiques */}
        <TodoStats />

        {/* ➕ Formulaire d'ajout */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">➕ Nouvelle tâche</CardTitle>
          </CardHeader>
          <CardContent>
            <AddTodo userId={user!.id} />
          </CardContent>
        </Card>

        {/* 📝 Liste des tâches */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              <CardTitle className="text-lg sm:text-xl">📝 Mes tâches</CardTitle>
              <TodoFilters currentFilter={filter} onFilterChange={setFilter} />
            </div>
          </CardHeader>
          <CardContent>
            {/* Erreur */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>❌ {error}</AlertDescription>
              </Alert>
            )}

            {/* Loading ou Liste */}
            {todosLoading ? (
              <div className="text-center py-8 sm:py-12">
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600">Chargement des tâches...</p>
              </div>
            ) : (
              <TodoList filter={filter} />
            )}
          </CardContent>
        </Card>
        <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full sm:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
      </div>
    </main>
  );
}