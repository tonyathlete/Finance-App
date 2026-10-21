// Reçoit la demande du formulaire de réservation et l'envoie à GoHighLevel
// (déclencheur « Inbound Webhook » d'un workflow GHL).
// L'URL du webhook est gardée secrète dans Netlify : variable d'environnement GHL_WEBHOOK_URL.

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const webhook = Netlify.env.get('GHL_WEBHOOK_URL');
  if (!webhook) return new Response('GHL_WEBHOOK_URL manquant', { status: 500 });

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

  const payload = {
    first_name: clean(data.prenom, 100),
    last_name: clean(data.nom, 100),
    email,
    phone: clean(data.telephone, 40),
    besoin: clean(data.besoin, 200),
    message: clean(data.message, 2000),
    source: 'Site web anthonygoulet.ca',
    page: clean(data.page, 300),
  };

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return new Response(null, { status: res.ok ? 204 : 502 });
};
