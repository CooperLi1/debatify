import { NextResponse } from 'next/server';

export async function GET() {
  // Server-side redirect to /main/account
  const redirectUrl = new URL('/main/account', process.env.NEXT_PUBLIC_SITE_URL); // Use the correct base URL
  return NextResponse.redirect(redirectUrl);
}
