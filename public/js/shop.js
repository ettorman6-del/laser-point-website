import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// In produzione, usa le variabili d’ambiente di Cloudflare.
const supabaseUrl = 'https://TUO_PROGETTO.supabase.co';
const supabaseKey = 'TUA_ANON_KEY';
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