'use client';
import { useState, useEffect, FormEvent, useRef } from "react";
import { createClient } from '@/utils/supabase/client'
import { FiCopy, FiBookmark } from "react-icons/fi"; 
const supabase = createClient()


//bookmarks
async function saveBookmark(content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('bookmarks').insert([
    {
      user_id: user.id,
      content: content
    }
  ]);
}

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState<string | null>(null);
  const[ searchtype, setType] = useState("web")
  const controller = useRef<AbortController | null>(null);

  //Search Bar
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    searchData(input)
  }

  //Display data titles
  const [results, setResults] = useState<string[]>([]);

    //Dropdown

      //Fonts
      const fonts = [
        { name: "Calibri", className: "calibri" },
        { name: "Arial", className: "arial" },
        { name: "Times New Roman", className: "times" },
        { name: "Comic Sans", className: "comic" }
      ];
    const [font, setFont] = useState("calibri");
    const [highlightColor, setHighlightColor] = useState("#fdff00");
    const [modifiedHTML, setModifiedHTML] = useState("");
    
      //Highlight Color
    const updateHighlightedHTML = () => {
      if (!show) return "";
      const updatedHTML = show.replace(
        /<mark>(.*?)<\/mark>/g,
        `<span style="background-color: ${highlightColor}; padding: 2px;">$1</span>`
      );
      setModifiedHTML(updatedHTML);
    };
      useEffect(() => {
        updateHighlightedHTML();
      }, [highlightColor, show]);
    
    //Search Function
    // async function searchData(str: string){
    //   setLoading(true);
    //   const data = await generate(searchtype, str);
    // //   setResults(data);
    //   setLoading(false);
    // }

    async function searchData(str: string) {
        if (controller.current) controller.current.abort();
        controller.current = new AbortController();

        setLoading(true);
        try {
            const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: searchtype, entry: str }),
            signal: controller.current.signal,
            });

            const contentType = res.headers.get('content-type');
            if (!res.ok || !contentType?.includes('application/json')) {
            const text = await res.text();
            throw new Error(`Unexpected response:\n${text}`);
            }

            const data = await res.json();
            setResults(data);
            console.log(results)
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === 'AbortError') {
            console.log('Request aborted');
            } else {
            console.error('Fetch error:', error);
            }
        } finally {
            setLoading(false);
        }
        }

    //UI
    return(
        <div>
        <div className="relative flex flex-col mt-5 ml-5 mr-5 defaulttext">
        <div className="flex justify-between items-center">
          <div className = 'flex-col'>
          <h1 className="text-3xl font-semibold mb-3">Search with AI</h1>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <select
              className="simpleform"
              onChange={(e) => setHighlightColor(e.target.value)}
            >
              <option value="#fdff00">Yellow</option>
              <option value="#00ffff">Cyan</option>
              <option value="#00ff00">Green</option>
            </select>

            <select
              className="simpleform"
              onChange={(e) => setFont(e.target.value)}
              value={font}
            >
              {fonts.map((font) => (
                <option key={font.name} value={font.className}>
                  {font.name}
                </option>
              ))}

            </select>
                        <select
              className="simpleform"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="web">Web</option>
              <option value="news">News</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-col flex w-3/10 mb-3">
          <div className="mb-5 w-full h-1 bg-gray-800 dark:bg-white rounded-full opacity-80" />
          <div className='flex'>

          <input
            type="text"
            placeholder="Search..."
            value={input}
            className="w-full simpleform hover:scale-102"  
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="ml-2 simpleform">Submit</button>
          </div>
        {loading && (
            <p className="mt-2 text-sm text-gray-500">Fetching results...</p>
        )}

        </form>

      <div className="w-3/10 mt-2 overflow-y-auto p-2 rounded-md" style={{ height: "calc(100vh - 210px)" }}>
          <ul>
            {results.map((html, index) => (
              <li key={index} className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </li>
            ))}
          </ul>
      </div>

      <div 
        className={`absolute top-20 right-8 w-62/100 p-4 rounded-md overflow-y-auto ${show != null ? 'dark:bg-gray-100' : 'dark:bg-gray-900'} text-black reset-injected-html ${font}`} 
        style={{ height: "calc(100vh - 150px)" }}      
      >
        {show && (
          <div className="relative flex items-start reset-injected-html">

          {/* Copy Button */}
          <button
            onClick={() => {
              const type = "text/html";
              const blob = new Blob([modifiedHTML], { type });
              const data = [new ClipboardItem({ [type]: blob })];
              navigator.clipboard.write(data);
            }}
            className="absolute top-0 right-0 text-lg text-gray-600 hover:text-gray-300 p-1 cursor-pointer"
            title="Copy to clipboard"
          >
            <FiCopy size={20} />
          </button>

          <button
            onClick={() => {
              saveBookmark(modifiedHTML);
            }}
            className="absolute top-0 right-10 text-lg text-gray-600 hover:text-gray-300 p-1 cursor-pointer"
            title="Bookmark"
          >
            <FiBookmark size={20} />
          </button>

          <div
            className={`bg-${highlightColor} text-[12pt] w-full p-7 `}
            dangerouslySetInnerHTML={{ __html: modifiedHTML }}
          />
        </div>
          )}
      </div>
    </div>
    </div>
    );
};