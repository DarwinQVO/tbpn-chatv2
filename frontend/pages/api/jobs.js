export default async function handler(req, res) {
  if (req.method === 'POST') {
    const resp = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json();
    res.status(200).json(data);
  } else {
    res.status(405).end();
  }
}
