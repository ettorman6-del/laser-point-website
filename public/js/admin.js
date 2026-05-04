import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://supabase.com/dashboard/project/lzsuifjeawzbevkajohh';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c3VpZmplYXd6YmV2a2Fqb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTgwNTAsImV4cCI6MjA5MzQ5NDA1MH0.OC23ouLU-hA3phCgMxCDKk_AzRX0KYulAi_N5V3XSwU';
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
