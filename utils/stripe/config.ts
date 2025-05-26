//config.ts
import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    apiVersion: '2025-04-30.basil',
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'Your App Name',
      version: '0.0.0',
      url: 'https://github.com/vercel/nextjs-subscription-payments',
    },
  }
);
