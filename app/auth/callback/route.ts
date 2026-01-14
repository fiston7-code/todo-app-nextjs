// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/welcome';

  // ✅ Vérifie si le code existe
  if (!code) {
    console.error('Code manquant dans l\'URL');
    return NextResponse.redirect(
      new URL('/auth?error=missing-code', request.url)
    );
  }

  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              // Ignore les erreurs de cookies dans Route Handlers
              console.warn('Erreur lors de la configuration des cookies:', error);
            }
          },
        },
      }
    );
    
    // ✅ Échange le code contre une session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Erreur exchangeCodeForSession:', error);
      return NextResponse.redirect(
        new URL('/auth?error=session-failed&message=' + encodeURIComponent(error.message), request.url)
      );
    }

    // ✅ Vérifie que la session a bien été créée
    if (!data.session) {
      console.error('Session non créée après échange du code');
      return NextResponse.redirect(
        new URL('/auth?error=no-session', request.url)
      );
    }

    // ✅ Log pour debug (à retirer en production)
    console.log('✅ Session créée pour:', data.user?.email);

    // ✅ Vérifie si c'est un nouvel utilisateur
    const isNewUser = data.user?.user_metadata?.is_new_user === true

if (isNewUser) {
  return NextResponse.redirect(new URL('/welcome', request.url))
}

return NextResponse.redirect(new URL('/dashboard', request.url))

   

  } catch (error) {
    console.error('Erreur inattendue dans callback:', error);
    return NextResponse.redirect(
      new URL('/auth?error=unexpected', request.url)
    );
  }
}