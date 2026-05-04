import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  // Recupera le variabili d'ambiente di Cloudflare
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = context.env;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  // GET: restituisce tutti i prodotti (pubblica)
  if (method === 'GET') {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST: aggiunge un prodotto (solo admin)
  if (method === 'POST') {
    // Verifica autenticazione admin
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 401 });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: 'Token non valido' }), { status: 401 });

    // Controlla il ruolo
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return new Response(JSON.stringify({ error: 'Accesso negato' }), { status: 403 });

    // Inserisci il prodotto
    const body = await request.json();
    const { name, description, price, image_url } = body;
    const { error: insertError } = await supabase.from('products').insert({ name, description, price, image_url });
    if (insertError) return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  }

  return new Response('Metodo non supportato', { status: 405 });
}