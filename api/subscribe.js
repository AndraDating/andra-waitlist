export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  const API_KEY = process.env.MAILERLITE_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZWY2YzczMzBhNWI1MDY0MTI2MzVlOTE4MmQxZGVjZjA2NzhmYzA1NDgyMmQ1MTJkMjE2MDQ0ZTFiMmNiMTU4NjY2ZDQ2NzQ4OGJiMzU5ZDciLCJpYXQiOjE3NzE0MzQzNjQuNTMxMTE5LCJuYmYiOjE3NzE0MzQzNjQuNTMxMTIxLCJleHAiOjQ5MjcxMDc5NjQuNTIyNTEsInN1YiI6IjIxNDI3NzMiLCJzY29wZXMiOltdfQ.NebtQwnrSR8EmZqWEai7OE9O7AFxOarpCF26JJkBXsJk6vibeH8bXLrGZtppVgnPTcTnYc0VrdD97ds-a6yfYgErDFVVpCL352X5kublGWd22x9SZS3bZlDUti2cTcbeuviC0y1-wtxaswvzGiI6wmid8MwSSA0VvvWM7zSS8uJ8pTqUKCY2l4RuCfjaE0nty4TtHhapN8a8inmUDpiaoQ0lCVP1maOsXHNJGCwAHVDH_KJUyN_Ke5GdQSdPTFd4EB0olAJDtd-uTq49flG3xXyTu87OoI9iJpriGRpHRDeM8vDQ0GogB45dx8hUdTYmiGbiHqFiy1KALYB9Rbmorv3CzaE0ykSbW97QBYxuZkNcLbp16sRwa0FDrkjSZNAHXuTBITFTkatEm0eOdPTtHPJWkq1PBo0XA9CvGvoeIpwmFuaveglifSLFpQqD4OI2pUOBqiZZSBBRmvo5LjmeTKhUvA6U2-j4uDTBy1MqqJxvW66LH8_Pgme513KXhJXEr3YJj7DmncTQAtewWy4jJVRN4d7tECe2ER-9pXtpeaq5hQrPP9udY3XyJvR_JEceHWMTpKImfaapHaADPJbhsjtHbGH-CiObyGYd1-2HuqOOHAHMeQrOVZ6WPOnvsk4SV3zs7NUPgNTPnitXF3r5nBin_UqRtE0EgQ_SdA8IGxw';
  const GROUP_ID = process.env.MAILERLITE_GROUP_ID || '179761812407846136';

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
