export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_GROUP_ID; // optional

  // Split name into first/last if provided
  const nameParts = (name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  try {
    // 1. Create or update the subscriber
    const subscriberRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          name: firstName,
          last_name: lastName,
        },
        status: 'active',
      }),
    });

    const subscriberData = await subscriberRes.json();

    if (!subscriberRes.ok) {
      return res.status(400).json({ error: subscriberData.message || 'Subscription failed' });
    }

    const subscriberId = subscriberData.data?.id;

    // 2. Add to group if GROUP_ID is set
    if (GROUP_ID && subscriberId) {
      await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${GROUP_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: 'Server error, please try again' });
  }
}
