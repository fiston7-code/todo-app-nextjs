'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Test de connexion
    supabase.from('todos').select('count').then(() => {
      setConnected(true);
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Todo App Pro
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          {connected ? (
            <p className="text-green-600 font-bold">✅ Connecté à Supabase !</p>
          ) : (
            <p className="text-gray-600">Connexion en cours...</p>
          )}
        </div>
      </div>
    </main>
  );
}