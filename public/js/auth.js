import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://supabase.com/dashboard/project/lzsuifjeawzbevkajohh';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c3VpZmplYXd6YmV2a2Fqb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTgwNTAsImV4cCI6MjA5MzQ5NDA1MH0.OC23ouLU-hA3phCgMxCDKk_AzRX0KYulAi_N5V3XSwU';
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
