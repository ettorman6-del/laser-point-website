import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// In produzione, usa le variabili d’ambiente di Cloudflare.
const supabaseUrl = 'https://supabase.com/dashboard/project/lzsuifjeawzbevkajohh';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c3VpZmplYXd6YmV2a2Fqb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTgwNTAsImV4cCI6MjA5MzQ5NDA1MH0.OC23ouLU-hA3phCgMxCDKk_AzRX0KYulAi_N5V3XSwU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return console.error(error);
  const container = document.getElementById('products-container');
  container.innerHTML = data.map(p => `
    <div class="product-card">
      <img src="${p.image_url || 'https://via.placeholder.com/150'}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>€${p.price}</p>
    </div>`).join('');
}

// Controlla se l'utente è loggato e se è admin
async function checkUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    document.getElementById('userArea').innerHTML = `<span>Benvenuto, ${session.user.email}</span> <a href="#" id="logoutBtn">Logout</a>`;
    document.getElementById('logoutBtn').addEventListener('click', () => supabase.auth.signOut().then(() => location.reload()));

    // Controlla ruolo admin per mostrare link
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
    if (profile && profile.role === 'admin') {
      document.getElementById('adminLink').style.display = 'inline';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  checkUser();
});
