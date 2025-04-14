import CustomerPortalForm from '@/app/components/portalform';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link'
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import {
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default async function Account() {
  const supabase = await createClient();

  const [user, subscription] = await Promise.all([
    getUser(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    redirect('/signin');
  }
  const getEmailPrefix = (email: string) => email.split('@')[0];
  const truncateEmail = (email: string, maxLength: number) => {
    // Check if the email length exceeds maxLength minus the length of ellipses
    if (email.length > maxLength - 3) {
      return email.substring(0, maxLength - 3) + '...'; // Truncate and add ellipses
    }
    return email; // If email is short enough, return it as is
  };
  
  const prefix = user.email
    ? truncateEmail(getEmailPrefix(user.email), 18) // Set max length to 20 characters
    : 'Guest';

  return (
    <div className="flex justify-center items-center min-h-screen">
<div className="w-full justify-center items-center max-w-md min-w-[600px] mx-auto p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="defaulttext text-4xl font-extrabold sm:text-center sm:text-6xl">
            {prefix}
          </h1>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm subscription={subscription} />
      </div>
    </div>
    </div>
  );
}
