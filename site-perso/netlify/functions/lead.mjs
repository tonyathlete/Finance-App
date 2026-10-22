// Reçoit la demande du formulaire de réservation et crée (ou met à jour) le contact
// dans GoHighLevel avec l'API officielle (clé « Private Integration », sans frais).
// Variables d'environnement dans Netlify :
//   GHL_TOKEN        clé Private Integration (Settings → Private Integrations)
//   GHL_LOCATION_ID  identifiant du sous-compte (Settings → Business Profile)

const API = 'https://services.leadconnectorhq.com';

const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const token = Netlify.env.get('GHL_TOKEN');
  const locationId = Netlify.env.get('GHL_LOCATION_ID');
  const api = Netlify.env.get('GHL_API_BASE') || API;
  if (!token || !locationId) return new Response('GHL_TOKEN ou GHL_LOCATION_ID manquant', { status: 500 });

  let data;
  try {
    data = await req.json();
  } catch {
    return new Response('JSON invalide', { status: 400 });
  }

  // Robot anti-spam : champ caché rempli = on ignore
  if (data['bot-field']) return new Response(null, { status: 204 });

  const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);
  const email = clean(data.courriel, 200);
  if (!email.includes('@')) return new Response('Courriel requis', { status: 400 });

  const besoin = clean(data.besoin, 200);
  const headers = {
    Authorization: `Bearer ${token}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Les tags servent de déclencheurs gratuits pour tes workflows GHL (« Contact Tag »)
  const tags = ['site-web'];
  if (besoin) tags.push(`besoin-${slug(besoin)}`);

  // Demande de références : un tag par partenaire coché
  const partenaires = (Array.isArray(data.partenaires) ? data.partenaires : [])
    .slice(0, 15)
    .map((p) => clean(p, 80))
    .filter(Boolean);
  if (partenaires.length) {
    tags.push('demande-reference');
    partenaires.forEach((p) => tags.push(`partenaire-${slug(p)}`));
  }

  const upsert = await fetch(`${api}/contacts/upsert`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locationId,
      firstName: clean(data.prenom, 100),
      lastName: clean(data.nom, 100),
      email,
      phone: clean(data.telephone, 40) || undefined,
      source: 'Site web anthonygoulet.ca',
      tags,
    }),
  });
  if (!upsert.ok) {
    console.error('GHL upsert', upsert.status, await upsert.text());
    return new Response(null, { status: 502 });
  }

  // Le besoin et le message vont dans une note sur la fiche du contact
  const contactId = (await upsert.json())?.contact?.id;
  const message = clean(data.message, 2000);
  if (contactId) {
    const lines = [
      partenaires.length ? 'Demande de référence via le site web' : 'Demande via le site web',
      besoin && `Besoin : ${besoin}`,
      partenaires.length && `Références demandées : ${partenaires.join(', ')}`,
      partenaires.length && `Consentement au partage avec ces partenaires : ${data.consentement === 'oui' ? 'oui' : 'non'}`,
      message && `Message : ${message}`,
      data.page && `Page : ${clean(data.page, 300)}`,
    ].filter(Boolean);
    const note = await fetch(`${api}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ body: lines.join('\n') }),
    });
    if (!note.ok) console.error('GHL note', note.status, await note.text());
  }

  return new Response(null, { status: 204 });
};
