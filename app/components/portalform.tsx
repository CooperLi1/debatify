'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import { Tables } from '@/types_db';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <div className="m-auto my-8 w-full max-w-3xl">
      <div className="textbox">
        <h3 className="mb-1 text-2xl font-bold defaulttext">Your Plan</h3>
        <p className="defaulttext">
          {subscription
            ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
            : 'You are not currently subscribed to any plan.'}
        </p>
        <div className="mb-4 mt-8 text-xl font-semibold defaulttext">
          {subscription ? (
            `${subscriptionPrice}/${subscription?.prices?.interval}`
          ) : (
            <Link href="/pricing" className="text-pink-500 underline">
              Choose your plan
            </Link>
          )}
        </div>
      </div>

      <div className="textbox mt-4 border-t border-gray-300 dark:border-gray-600">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0 defaulttext">
            Manage your subscription.
          </p>
          <button
            onClick={handleStripePortalRequest}
            disabled={isSubmitting}
            className={`submitbutton w-auto px-6 py-2 text-sm font-medium ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Opening...' : 'Open customer portal'}
          </button>
        </div>
      </div>
    </div>
  );
}
