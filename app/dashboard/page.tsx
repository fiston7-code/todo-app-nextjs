
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTodoStore } from '@/store/todoStore';
import { useThemeStore } from '@/store/theme-store';
import { useThemeInit } from '@/hooks/use-theme-init';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Loader2, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  Moon,
  Sun
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [userName, setUserName] = useState('');
  const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo } = useTodoStore();
  const { theme, toggleTheme } = useThemeStore();

  // Initialiser le thème
  useThemeInit();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
      } else {
        // Récupérer le nom de l'utilisateur
        const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur';
        setUserName(name);
        
        await fetchTodos(user.id);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, fetchTodos]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await addTodo(newTodo, user.id);
    setNewTodo('');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Bonjour';
    if (hour < 18) return '👋 Bon après-midi';
    return '🌙 Bonsoir';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement de vos tâches...</p>
        </div>
      </div>
    );
  }

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGreeting()}, {userName} !
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalCount === 0 
              ? "Commencez votre journée en ajoutant une tâche !" 
              : `Vous avez ${totalCount - completedCount} tâche${totalCount - completedCount !== 1 ? 's' : ''} à accomplir`}
          </p>
        </div>

        {/* Progress Card */}
        {totalCount > 0 && (
          <Card className="mb-6 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progression du jour</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedCount}/{totalCount}
                  </p>
                </div>
                <div className="text-4xl">
                  {progress === 100 ? '🎉' : progress >= 50 ? '🔥' : '💪'}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {progress === 100 ? 'Bravo ! Toutes les tâches sont terminées ! 🎊' : `${Math.round(progress)}% complété`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Todo Form */}
        <Card className="mb-6 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="pt-6">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                type="text"
                placeholder="Ajouter une nouvelle tâche..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Todos List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Aucune tâche pour le moment</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Ajoutez votre première tâche pour commencer !
                </p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card 
                key={todo.id}
                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTodo(todo.id, todo.completed)}
                      className="flex-shrink-0 transition-transform hover:scale-110"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                    
                    <span 
                      className={`flex-1 text-base ${
                        todo.completed 
                          ? 'line-through text-gray-400 dark:text-gray-500' 
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {todo.title}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {totalCount > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {completedCount === totalCount 
              ? "🎉 Félicitations ! Vous avez tout terminé !" 
              : `Encore ${totalCount - completedCount} tâche${totalCount - completedCount !== 1 ? 's' : ''} à faire. Courage ! 💪`}
          </div>
        )}
      </main>
    </div>
  );
}
