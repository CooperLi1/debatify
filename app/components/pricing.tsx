'use client';

import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from '@/utils/supabase/cn';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

export default function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    if (subscription) {
      return router.push('/account');
    }

    if (!user) {
      return router.push('/account/login');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
  };

  if (!products.length) {
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black">
      <div className="mt-12 space-y-0 sm:mt-16 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
        {products.map((product) => {
          const price = product?.prices[0];
          if (!price) return null;

          const priceString = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency!,
            minimumFractionDigits: 0
          }).format((price?.unit_amount || 0) / 100);

          const billingInterval = price.interval || 'month';

          return (
            <div
              key={product.id}
              className={cn(
                'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                {
                  'border border-pink-500': subscription
                    ? product.name === subscription?.prices?.products?.name
                    : product.name === 'Freelancer'
                },
                'flex-1 basis-1/3 max-w-xs'
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold leading-6 text-white">
                  {product.name}
                </h2>
                <p className="mt-4 text-zinc-300">{product.description}</p>
                <p className="mt-8">
                  <span className="text-5xl font-extrabold text-white">
                    {priceString}
                  </span>
                  <span className="text-base font-medium text-zinc-100">
                    /{billingInterval}
                  </span>
                </p>
                <button
                  onClick={() => handleStripeCheckout(price)}
                  className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md bg-pink-600 hover:bg-pink-700 transition"
                >
                  {subscription ? 'Manage' : 'Subscribe'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
