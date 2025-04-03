# FitCoach - AI Fitness App

This is a Next.js fitness application with AI-powered features to help users track their fitness journey.

## Features

- **User Authentication**: Email/password login and Google OAuth integration
- **Personalized Dashboard**: Track your fitness metrics and progress
- **AI Voice Input**: Log activities and meals using natural language
- **Personalized Reminders**: Get custom reminders based on your fitness profile
- **Health Metrics Tracking**: Monitor weight, heart rate, and other health data
- **Responsive UI**: Beautiful interface that works on all devices

## Getting Started

First, set up your environment variables:

1. Create a `.env.local` file in the root directory
2. Add the following variables (replace with your actual values):

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Google Provider 
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Then, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Google Authentication Setup

To enable Google login:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Configure the OAuth consent screen
4. Create credentials (OAuth client ID)
5. Add authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`)
6. Copy the Client ID and Client Secret to your `.env.local` file

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT
