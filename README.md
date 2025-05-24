This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## YTZA - AI YouTube Thumbnail Generator

YTZA is a sophisticated AI-powered platform for creating high-quality YouTube thumbnails. The application combines modern web technologies with AI services to provide creators with professional thumbnail generation capabilities.

## ✨ Key Features

- **AI-Powered Generation**: Uses OpenAI's GPT models for intelligent thumbnail creation
- **Multiple Styles**: Beast-style, Minimalist, Cinematic, and Clickbait styles
- **Smart Error Handling**: Advanced content policy violation detection with automatic credit refunds
- **Credit System**: One-time payment model with automatic credit management
- **Real-time Feedback**: Instant generation results with comprehensive error recovery

## 🛡️ Content Policy & Error Handling

YTZA includes sophisticated error handling to ensure a smooth user experience:

### Content Policy Protection
- **Automatic Detection**: Identifies content policy violations from AI services
- **Credit Refund**: Automatically refunds credits when requests are blocked
- **Helpful Suggestions**: Provides specific guidance to help users create compliant content
- **Smart Recovery**: Allows users to retry with improved prompts

### Supported Error Types
- **Content Policy Violations**: Copyrighted content, inappropriate material
- **API Errors**: Service outages, rate limiting, technical issues  
- **Generation Failures**: Missing data, corrupted responses
- **Network Issues**: Connection problems, timeouts

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Rethink Sans](https://fonts.google.com/specimen/Rethink+Sans), a modern font for the interface.

## 🏗️ Architecture

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration
- **AI Services**: OpenAI GPT + Google Gemini

### Project Structure
```
src/
├── app/                 # Next.js App Router
├── components/          # Reusable UI components
├── lib/                 # Core utilities
├── utils/               # Helper functions
└── hooks/               # Custom React hooks
```

## 💳 Credit System

- **Free Plan**: 3 credits (one-time allocation)
- **Pro Plan**: $29 one-time payment for 50 credits + lifetime Pro features
- **Credit Refunds**: Automatic refunds for failed generations due to policy violations or technical errors
- **No Subscriptions**: All payments are one-time purchases

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
