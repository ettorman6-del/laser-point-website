import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = context.env;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { request } = context;

  if (request.method === 'GET') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return new Response(JSON.stringify({ admin: false }), { status: 401 });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return new Response(JSON.stringify({ admin: false }), { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    return new Response(JSON.stringify({ admin: profile?.role === 'admin' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Metodo non supportato', { status: 405 });
}