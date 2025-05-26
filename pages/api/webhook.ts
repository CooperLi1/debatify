// pages/api/webhook.ts

import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord
} from '@/utils/supabase/admin';

// Disable Next.js body parsing so we can get the raw buffer Stripe expects
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define events you care about
const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    if (!sig || !webhookSecret) {
      throw new Error('Missing signature or secret');
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log(`🔔 Received event: ${event.type}`);
  } catch (err: any) {
    console.error(`❌ Error verifying webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case 'price.deleted':
          await deletePriceRecord(event.data.object as Stripe.Price);
          break;
        case 'product.deleted':
          await deleteProductRecord(event.data.object as Stripe.Product);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(subscription);
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
          );
          break;
        }
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.mode === 'subscription') {
            await manageSubscriptionStatusChange(
              session.subscription as string,
              session.customer as string,
              true
            );
          }
          break;
        }
        default:
          throw new Error('Unhandled relevant event type.');
      }

      return res.status(200).json({ received: true });
    } catch (err: any) {
      console.error('❌ Error handling webhook event:', err.message);
      return res.status(400).send('Webhook handler failed.');
    }
  }

  return res.status(400).send(`Unhandled event type: ${event.type}`);
}
