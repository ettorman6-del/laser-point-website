import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://TUO_PROGETTO.supabase.co';
const supabaseKey = 'TUA_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    document.getElementById('message').innerText = error.message;
  } else {
    window.location.href = '/';
  }
});

document.getElementById('registerBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    document.getElementById('message').innerText = error.message;
  } else {
    document.getElementById('message').innerText = 'Registrazione avvenuta! Controlla la tua email per confermare.';
  }
});