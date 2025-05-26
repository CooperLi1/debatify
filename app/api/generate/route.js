import { NextRequest, NextResponse } from 'next/server';
import { braveSearch, scrape, generateContent, getPrompt } from '@/app/api/ai';
import fs from 'fs/promises';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';
import pLimit from 'p-limit';

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
    console.log('got past scrape')

    const limit = pLimit(3); // Limit to 3 concurrent LLM generations

    const genTasks = Object.entries(scraped).map(([key, content]) =>
      limit(async () => {
        if (abortSignal?.aborted) return null;
        try {
          const prompt = await getPrompt(entry, key, content);
          const card = await generateContent(prompt);
          return card;
        } catch (err) {
          console.error(`❌ Failed on key "${key}":`, err);
          return null;
        }
      })
    );

    const settled = await Promise.allSettled(genTasks);
    const results = settled
      .filter((r) => r.status === 'fulfilled' && r.value)
      .map((r) => r.value);

    console.log(results);
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log('API Error:', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
