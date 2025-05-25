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
  try {
    await loadGoogleCredentials();
    const { type, entry } = await req.json();
    const links = await braveSearch(type, entry);
    const urls = links?.web?.results?.map((r) => r.url).filter(Boolean);

    const scraped = await scrape(urls);
    const results = []
    for (const key in scraped) {
      const content = scraped[key];
      console.log(content.length)

      if (typeof content === 'string' && content.length < 60000 && content.length > 10) {
        const prompt = await getPrompt(entry, key, scraped[key])
        const card = await generateContent(prompt)
        results.push(card)
      }
    }
    // console.log(results)
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(message)
    return NextResponse.json({ message }, { status: 500 });
  }
}

