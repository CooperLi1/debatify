import { NextRequest, NextResponse } from 'next/server';
import { braveSearch, scrape, generateContent, getPrompt } from '@/app/api/ai';
import fs from 'fs/promises';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';

async function loadGoogleCredentials() {
  const base64 = process.env.GOOGLECREDENTIALS;
  if (!base64) throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_BASE64");

  const decoded = Buffer.from(base64, 'base64').toString('utf8');
  const tmpPath = path.join('/tmp', 'google-credentials.json');
  await fs.writeFile(tmpPath, decoded);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath;
}

export async function POST(req) {
  console.log('generate running')
  const abortSignal = req.signal;

  if (abortSignal?.aborted) {
    return NextResponse.json({ message: 'Request aborted before start' }, { status: 499 });
  }

  try {
    abortSignal?.addEventListener('abort', () => {
      console.log('❌ Server request was aborted by the client.');
    });

    await loadGoogleCredentials();
    const { type, entry } = await req.json();

    const links = await braveSearch(type, entry);
    const urls = links?.web?.results?.map((r) => r.url).filter(Boolean);
    const scraped = await scrape(urls);
    const results = [];
    console.log('got past scrape')

    for (const key in scraped) {
      if (abortSignal?.aborted) break;

      const content = scraped[key];
      try {
        const prompt = await getPrompt(entry, key, content);
        const card = await generateContent(prompt);
        results.push(card);
      } catch (err) {
        console.error(`❌ Failed on key "${key}":`, err);
      }
    }
    console.log(results)
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log('API Error:', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
