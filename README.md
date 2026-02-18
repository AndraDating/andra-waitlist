# Andra Waitlist — Vercel Deployment

## Project Structure
```
andra-waitlist/
├── index.html          # Landing page
├── api/
│   └── subscribe.js    # Serverless function → MailerLite
├── vercel.json         # Vercel routing config
└── README.md
```

## Setup Instructions

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy to Vercel
```bash
cd andra-waitlist
vercel
```

### 3. Add Environment Variables
In your Vercel dashboard → Project → Settings → Environment Variables, add:

| Variable                | Value                                      |
|-------------------------|--------------------------------------------|
| `MAILERLITE_API_KEY`    | Your MailerLite API token                  |
| `MAILERLITE_GROUP_ID`   | Your MailerLite Group ID (optional)        |

> **Where to find these:**
> - **API Key**: MailerLite → Integrations → API → Generate new token
> - **Group ID**: MailerLite → Subscribers → Groups → Create a "Waitlist" group → the ID appears in the URL

### 4. Redeploy
After adding env variables, redeploy:
```bash
vercel --prod
```

## Local Development
```bash
vercel dev
```
This runs both the HTML and the serverless function locally on `http://localhost:3000`.

## Sending a Launch Email
When Andra is ready to launch, go to MailerLite → Campaigns → Create Campaign, select your "Waitlist" group as the audience, and send to everyone who signed up.
