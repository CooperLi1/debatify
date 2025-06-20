import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from './admin'
import { cache } from 'react';

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();
    
  console.log(error)
  console.log('subscription', subscription)
  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

export async function userExists(email: any): Promise<boolean> {
  const pageSize = 100;
  let page = 1;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: pageSize });

    if (error) {
      console.error("Error checking user:", error.message);
      return false;
    }

    const users = data?.users ?? [];

    if (users.some((user) => user.email?.toLowerCase() === email.toLowerCase())) {
      return true;
    }

    // If fewer users returned than pageSize, we've reached the end
    if (users.length < pageSize) break;

    page++;
  }

  return false;
}
