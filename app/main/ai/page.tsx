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
  const [loading, setLoading] = useState('');
  const [show, setShow] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const latestRequest = useRef(0);
  const hasActiveRequest = useRef(false);
  const [results, setResults] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);


  //Search Bar
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    searchData(input)
  }

  useEffect(() => {
    const handleKeyDown = (e: { key: string; }) => {
      if (e.key === "Escape") setShow(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


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
    
    
async function searchData(str: string) {
  const requestId = Date.now();
  latestRequest.current = requestId;

  if (hasActiveRequest.current && controller.current) {
    controller.current.abort();
    setLoading('cancelling previous search...');
    await new Promise((r) => setTimeout(r, 400));
  } 

  const abortController = new AbortController();
  controller.current = abortController;

  setLoading('fetching results (could take up to a minute)...');
  hasActiveRequest.current = true; 

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'web', entry: str }),
      signal: abortController.signal,
    });

    const contentType = res.headers.get('content-type');
    if (!res.ok || !contentType?.includes('application/json')) {
      const text = await res.text();
      throw new Error(`Unexpected response:\n${text}`);
    }

    const data = await res.json();

    if (latestRequest.current === requestId) {
      setResults(data.results);
    }
  } catch (error: unknown) {
    setHasSearched(true)
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log("Request aborted.");
    } else {
      console.error("Fetch error:", error);
    }
  } finally {
    if (latestRequest.current === requestId) {
      setHasSearched(true)
      setLoading('');
      hasActiveRequest.current = false;
    }
  }
}


    //UI
    return(
        <div>
        <div className="relative z-0 flex flex-col mt-5 ml-5 mr-5 defaulttext pointer-events-auto">
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
            <p className="mt-2 text-sm text-gray-500">{loading}</p>
        )}

        </form>
        <div className="mt-6 overflow-y-auto px-4 cursor-default relative z-10" style={{ height: "calc(100vh - 200px)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.length === 0 && hasSearched === true ? (
              <div className="text-gray-500 text-sm">
                No Results or Timeout :(
              </div>
            ) : (
              results.map((html, index) => (
                <div
                  key={index}
                  onClick={() => setShow(html)}
                  className="group relative z-5 bg-white dark:bg-gray-100 text-black shadow-lg rounded-2xl overflow-hidden p-6 pt-12 hover:shadow-xl transition-all duration-200"
                  style={{ height: '340px' }}
                >
                  {/* Copy Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const type = "text/html";
                      const blob = new Blob([html], { type });
                      const data = [new ClipboardItem({ [type]: blob })];
                      navigator.clipboard.write(data);
                    }}
                    className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
                    title="Copy to clipboard"
                  >
                    <FiCopy size={18} />
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveBookmark(html);
                    }}
                    className="absolute top-3 right-10 z-10 text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
                    title="Bookmark"
                  >
                    <FiBookmark size={18} />
                  </button>

                  <div className={`reset-injected-html ${font} text-sm overflow-hidden`} style={{ maxHeight: '260px' }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: html.replace(
                        /<mark>(.*?)<\/mark>/g,
                        `<span style="background-color: ${highlightColor}; padding: 2px;">$1</span>`
                      ) }}
                    />
                    <span className="absolute bottom-3 left-3 text-xs text-gray-500 group-hover:opacity-100 opacity-0 transition-opacity">Click to expand</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Fullscreen Modal View */}
          {show && (
            <div
              className="fixed inset-0 backdrop-blur-md bg-white/30 dark:bg-black/30 flex items-center justify-center z-50 transition-all duration-300"
              onClick={() => setShow(null)}
            >
              <div
                className="bg-white dark:bg-gray-100 text-black rounded-2xl p-8 max-w-4xl w-full h-[80vh] overflow-y-auto relative scale-100 opacity-100 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Expanded Bookmark Button */}
                <button
                  onClick={() => saveBookmark(show)}
                  className="absolute top-3 right-3 z-10 text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
                  title="Bookmark"
                >
                  <FiBookmark size={20} />
                </button>

                {/* Expanded Copy Button */}
                <button
                  onClick={() => {
                    const type = "text/html";
                    const blob = new Blob([show], { type });
                    const data = [new ClipboardItem({ [type]: blob })];
                    navigator.clipboard.write(data);
                  }}
                  className="absolute top-3 right-12 z-10 text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
                  title="Copy to clipboard"
                >
                  <FiCopy size={20} />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setShow(null)}
                  className="absolute top-3 right-20 z-10 text-gray-600 hover:text-black dark:hover:text-white cursor-pointer"
                  title="Close"
                >
                  ✕
                </button>

                <div className={`reset-injected-html ${font} text-base mt-8`}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: show.replace(
                        /<mark>(.*?)<\/mark>/g,
                        `<span style="background-color: ${highlightColor}; padding: 2px;">$1</span>`
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        `}</style>
    </div>
    </div>
    );
};