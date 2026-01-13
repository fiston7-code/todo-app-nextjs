'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test de connexion à Supabase
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .limit(1);

        if (error) throw error;

        setConnected(true);
        setError(null);
      } catch (err) {
        console.error('Erreur de connexion:', err);
        setError(err instanceof Error ? err.message : 'Erreur de connexion');
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Todo App Pro
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          {loading && (
            <p className="text-gray-600">🔄 Connexion en cours...</p>
          )}
          
          {!loading && connected && (
            <div>
              <p className="text-green-600 font-bold mb-2">
                ✅ Connecté à Supabase !
              </p>
              <p className="text-sm text-gray-500">
                La base de données est accessible.
              </p>
            </div>
          )}
          
          {!loading && !connected && (
            <div>
              <p className="text-red-600 font-bold mb-2">
                ❌ Erreur de connexion
              </p>
              <p className="text-sm text-gray-700">
                {error || 'Impossible de se connecter à Supabase'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}