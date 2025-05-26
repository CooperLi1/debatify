"use server";
import * as dotenv from 'dotenv';
dotenv.config();
const bravekey = process.env.BRAVE_API;
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';

export async function braveSearch(type, entry) {
  try{
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

    // if (!results) {
    //   console.warn(`No results found for type: ${type}`);
    // } else {
    //   console.log(results.map(r => r.url || r.link || r.title));
    // }

    return data;
  } catch(error){
    console.log(error)
    return error;
  }
}

export async function scrape(sites) {
  const dict = {};

  for (const url of sites) {
    try {
      if (url.includes('wikipedia.org')) {
        console.log(`Skipped Wikipedia URL: ${url}`);
        continue;
      }

      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });

      const $ = cheerio.load(response.data);

      const blocks = $('body')
        .find('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0);

      const pageText = blocks.map(block => `    ${block}`).join('\n\n');

      if (pageText.length > 60000 || pageText.length < 10) {
        console.log(`Skipped ${url}: content too long/short (${pageText.length} chars)`);
        continue;
      }

      dict[url] = pageText;
      console.log(`Scraped ${url}`);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
    }
  }
  console.log(dict.length)
  return dict;
}


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
  return `Turn this link/evidence body into a cut card arguing ${search} in html format that i can directly display on a website
          Begin with a tagline: a 1-sentence summary of the argument.
          Include a citation: author(s), qualifications, title, publication, date, and URL. End the citation ONLY with //debatifyAI, not the other paragraphs.
          Provide the body: multiple full paragraphs copied verbatim from the source.
          Formatting in the body:
          Never include partial paragraphs—only full, unedited ones.
          there should be a paragraph break between each individual paragraph in the evidence
          Highlight the text the debater should read aloud using bold and underline.
          Underline important context not meant for reading.
          Use bold + underline for mid-importance content.
          Sourcing:
          Do not fabricate or paraphrase anything.
          Verify all quotes against the original.
          Be extremely careful to avoid hallucinations. Every line in the cut card must be grounded in the source.
          Use the following link and full text to help you: Link = ${link}, Body = ${body}`
}