'use client';

import { useEffect, useState } from 'react';
import { FiCopy, FiX } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/types_db';
import Fuse from 'fuse.js';

export default function Saved() {
  const supabase = createClient();

  const fonts = [
    { name: "Calibri", className: "calibri" },
    { name: "Arial", className: "arial" },
    { name: "Times New Roman", className: "times" },
    { name: "Comic Sans", className: "comic" }
  ];
  const [font, setFont] = useState('calibri');
  const [saved, setSaved] = useState<{ id: string; content: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fuse, setFuse] = useState<Fuse<{ id: string; content: string }>>();  

  useEffect(() => {
    const fetchBookmarks = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data, error } = await supabase
        .from('bookmarks')
        .select('id, content')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookmarks:', error.message);
        return;
      }

      setSaved(data);
    };

    fetchBookmarks();
  }, [supabase]);

  useEffect(() => {
    if (saved.length > 0) {
      const fuseInstance = new Fuse(saved, {
        keys: ['content'],
        threshold: 0.3, // Adjust this for more or less fuzzy matching
      });
      setFuse(fuseInstance);
    }
  }, [saved]);

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete:', error.message);
      return;
    }

    setSaved((prev) => prev.filter((item) => item.id !== id));
  };

  // Search with Fuse.js
  const filteredBookmarks = searchQuery
    ? fuse?.search(searchQuery).map(({ item }) => item) || []
    : saved;

  return (
    <div className="flex flex-col h-screen defaulttext relative px-5 py-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Saved Evidence
      </h1>

      <div className="self-center mb-6 w-1/5 h-1 bg-gray-800 dark:bg-white rounded-full opacity-80" />

      <div className="w-full flex items-center gap-4 mb-8 justify-center">
        <input
          type="text"
          className="w-[40%] simpleform"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="simpleform w-36"
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

      <div className={`flex flex-col items-center ${font}`}>
        {filteredBookmarks.length > 0 ? (
          <ul className="w-full max-w-screen-md space-y-4">
            {filteredBookmarks.map(({ id, content }) => (
              <li
                key={id}
                className="relative bg-white dark:bg-gray-100 shadow-md rounded-md p-4 transition-transform transform"
              >
                <div
                  className="text-[12pt] text-black rounded-sm p-7"
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* Delete Button: X over bookmark */}
                <button
                  className="absolute top-4 right-2 text-lg text-gray-600 hover:text-gray-300 p-1 cursor-pointer"
                  title="Delete bookmark"
                  onClick={() => deleteBookmark(id)}
                >
                  <FiX size={20} />
                </button>

                {/* Copy button */}
                <button
                  onClick={() => {
                    const type = 'text/html';
                    const blob = new Blob([content], { type });
                    const data = [new ClipboardItem({ [type]: blob })];
                    navigator.clipboard.write(data);
                  }}
                  className="absolute top-4 right-8 text-lg text-gray-600 hover:text-gray-300 p-1 cursor-pointer"
                  title="Copy to clipboard"
                >
                  <FiCopy size={20} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-semibold text-xl text-center text-gray-600 dark:text-gray-300">
            No bookmarks found
          </p>
        )}
      </div>
    </div>
  );
}
