"use server";
import * as dotenv from 'dotenv';
dotenv.config();
const bravekey = process.env.BRAVE_API;
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';
export async function braveSearch(type, entry) {
  try {
    const response = await fetch(`https://api.search.brave.com/res/v1/${encodeURIComponent(type)}/search?q=${encodeURIComponent(entry)}`, {
      method: 'GET',
      headers: {
        'X-Subscription-Token': bravekey,
        'Accept': 'application/json',
        'Api-Version': '2023-10-11'
      }
    });

    console.log("Status:", response.status, response.statusText);

    const data = await response.json();
    const results = data[type]?.results;

    if (!results) {
      console.warn(`No results found for type: ${type}`);
      return { web: { results: [] } };
    }

    // Score results based on relevance to entry
    const scored = results.map((r) => {
      const title = r.title || '';
      const description = r.description || '';
      const text = `${title} ${description}`.toLowerCase();
      const terms = entry.toLowerCase().split(/\s+/);

      const score = terms.reduce((acc, term) => acc + (text.includes(term) ? 1 : 0), 0);

      return { ...r, score };
    });

    // Sort descending by score
    const ranked = scored.sort((a, b) => b.score - a.score);

    return {
      [type]: {
        results: ranked
      }
    };
  } catch (error) {
    console.error(' Brave search error:', error);
    return { web: { results: [] } };
  }
}

export async function scrape(sites) {
  console.log(' Starting concurrent scrape...');
  
  const results = await Promise.allSettled(
    sites.map(async (url) => {
      if (url.includes('wikipedia.org')) {
        console.log(` Skipped Wikipedia URL: ${url}`);
        return null;
      }

      try {
        const response = await axios.get(url, {
          timeout: 5000,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        });

        const $ = cheerio.load(response.data);
        const blocks = $('body')
          .find('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter((text) => text.length > 0);

        const pageText = blocks.map((block) => `    ${block}`).join('\n\n');

        if (pageText.length > 60000 || pageText.length < 10) {
          console.log(`⛔️ Skipped ${url}: content too long/short (${pageText.length} chars)`);
          return null;
        }

        console.log(` Scraped ${url}`);
        return { url, text: pageText };
      } catch (err) {
        console.error(` Error scraping ${url}:`, err.message);
        return null;
      }
    })
  );

  const dict = {};
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      dict[result.value.url] = result.value.text;
    }
  }

  console.log(`Successfully scraped ${Object.keys(dict).length} pages.`);
  return dict;
}

// export async function scrape(sites) {
//   console.log('🔍 Starting concurrent scrape...');

//   const results = await Promise.allSettled(
//     sites.map(async (url) => {
//       if (url.includes('wikipedia.org')) {
//         console.log(`⛔️ Skipped Wikipedia URL: ${url}`);
//         return null;
//       }

//       try {
//         const response = await axios.get(url, {
//           timeout: 5000,
//           headers: {
//             'User-Agent':
//               'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
//             Accept: 'text/html,application/xhtml+xml',
//           },
//         });

//         const $ = cheerio.load(response.data);
//         let blocks = $('body')
//           .find('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre')
//           .map((_, el) => $(el).text().trim())
//           .get()
//           .filter((text) => text.length > 0);

//         // Smart start index
//         let startIndex = 0;
//         for (let i = 0; i < blocks.length; i++) {
//           if (blocks[i].split(/\s+/).length >= 30) {
//             const nextFive = blocks.slice(i + 1, i + 6);
//             const shortCount = nextFive.filter(b => b.split(/\s+/).length < 10).length;
//             if (shortCount < 4) {
//               startIndex = i;
//               break;
//             }
//           }
//         }

//         let selectedBlocks = blocks.slice(startIndex);

//         // Smart tail trimming
//         let i = selectedBlocks.length - 1;
//         while (i >= 0) {
//           const currentWords = selectedBlocks[i].split(/\s+/).length;

//           if (currentWords < 20) {
//             selectedBlocks.pop();
//           } else {
//             const priorBlocks = selectedBlocks.slice(Math.max(0, i - 4), i);
//             const longCount = priorBlocks.filter(b => b.split(/\s+/).length >= 10).length;

//             if (longCount >= 2) {
//               selectedBlocks = selectedBlocks.slice(0, i + 1);
//               break;
//             } else {
//               selectedBlocks.pop();
//             }
//           }
//           i--;
//         }

//         // Enforce 49,000 character limit
//         const charLimit = 49000;
//         let currentChars = 0;
//         const finalBlocks = [];

//         for (const block of selectedBlocks) {
//           const formatted = `    ${block}\n\n`;
//           if (currentChars + formatted.length > charLimit) break;
//           finalBlocks.push(formatted);
//           currentChars += formatted.length;
//         }

//         const pageText = finalBlocks.join('').trim();

//         if (pageText.length < 10) {
//           console.log(`⛔️ Skipped ${url}: too short`);
//           return null;
//         }

//         console.log(`✅ Scraped ${url}`);
//         return { url, text: pageText };
//       } catch (err) {
//         console.error(`❌ Error scraping ${url}:`, err.message);
//         return null;
//       }
//     })
//   );

//   const dict = {};
//   for (const result of results) {
//     if (result.status === 'fulfilled' && result.value) {
//       dict[result.value.url] = result.value.text;
//     }
//   }

//   console.log(`📦 Successfully scraped ${Object.keys(dict).length} pages.`);
//   return dict;
// }

// export async function generate(type, entry){
//   console.log('hello')
//   const links = await braveSearch(type, entry)

//   if(links instanceof Error){
//     console.log('hello')
//     return links
//   }else{
//     const urls = links.web?.results?.map(r => r.url).filter(Boolean);
//     const sites = await scrape(urls)
//     console.log(sites)
//   }
// }


// Initialize Vertex with your Cloud project and location

const project = process.env.VERTEXPROJECT;
const loc = process.env.VERTEXLOCATION;
const model = process.env.VERTEXMODEL;

const ai = new GoogleGenAI({
  vertexai: true,
  project: project,
  location: loc
});


// Set up generation config
const generationConfig = {
  maxOutputTokens: 3000,
  temperature: 1,
  topP: 0.95,
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'OFF',
    }
  ],
};


export async function generateContent(userInput) {
  const req = {
    model,
    contents: [
      {
        role: 'user',
        parts: [{ text: userInput }],
      },
    ],
    config: generationConfig,
  };

  const streamingResp = await ai.models.generateContentStream(req);

  let result = '';

  for await (const chunk of streamingResp) {
    if (chunk.text) {
      result += chunk.text;
    }
  }

  return result;
}

export async function getPrompt(search, link, body){
  return `Create a cut card in HTML format arguing: ${search}

Use this source:  
Link and body = 'Link = ${link}, Body = ${body}'

Instructions:
- Start with a tagline (short summary).
- Add a citation (authors or no author if unavailable, credentials, title, source, date, URL), ending with //debatifyAI.
- Include the full body: multiple full, unedited paragraphs.
- Formatting rules:
  - No partial paragraphs.
  - Use paragraph breaks between paragraphs.
  - Highlight, bold, and underline content meant to be read in round.
  - Underline context not meant to be read.
  - Use bold underline for mid-importance text.
- Sourcing rules:
  - Do not paraphrase or fabricate.
  - Verify all quotes.
  - Every sentence must be grounded in the source.
`
}
