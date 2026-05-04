import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://TUO_PROGETTO.supabase.co';
const supabaseKey = 'TUA_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    document.getElementById('loginMessage').innerText = 'Accesso negato. Effettua il login.';
    return;
  }

  // Verifica ruolo admin tramite API sicura
  const token = session.access_token;
  const res = await fetch('/api/auth/check-admin', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { admin } = await res.json();
  if (!admin) {
    document.getElementById('loginMessage').innerText = 'Accesso riservato agli amministratori.';
    return;
  }

  // Mostra il pannello
  document.getElementById('loginMessage').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  loadAdminProducts();

  // Gestisci inserimento prodotto
  document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prodName').value;
    const description = document.getElementById('prodDesc').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const image_url = document.getElementById('prodImage').value;

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, description, price, image_url })
    });
    if (res.ok) {
      alert('Prodotto aggiunto!');
      location.reload();
    } else {
      alert('Errore durante l\'aggiunta');
    }
  });
}

async function loadAdminProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const list = document.getElementById('productsListAdmin');
  list.innerHTML = products.map(p => `<li>${p.name} - €${p.price}</li>`).join('');
}

document.addEventListener('DOMContentLoaded', init);