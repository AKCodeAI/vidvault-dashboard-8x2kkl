import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vidvault_bookmarks') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('vidvault_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((video) => {
    setBookmarks(prev => {
      if (prev.find(b => b.id === video.id)) return prev;
      return [...prev, { ...video, savedAt: new Date().toISOString() }];
    });
  }, []);

  const removeBookmark = useCallback((videoId) => {
    setBookmarks(prev => prev.filter(b => b.id !== videoId));
  }, []);

  const isBookmarked = useCallback((videoId) => {
    return bookmarks.some(b => b.id === videoId);
  }, [bookmarks]);

  const clearAll = useCallback(() => setBookmarks([]), []);

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, clearAll }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);
