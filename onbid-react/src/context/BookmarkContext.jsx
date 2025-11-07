import React, { createContext, useState, useContext, useCallback } from 'react';
import { propertyAPI } from '../services/api';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const userId = 'guest';

  const loadBookmarks = useCallback(async () => {
    try {
      const res = await propertyAPI.getBookmarks(userId);
      const list = res.data || [];
      setBookmarkedItems(new Set(list.map(it => String(it.id))));
    } catch (err) {
      console.error('북마크 불러오기 실패:', err);
    }
  }, []);

  const toggleBookmark = useCallback(async (propertyId) => {
    try {
      const res = await propertyAPI.saveBookmark(propertyId, userId);
      if (res && res.data !== undefined) {
        setBookmarkedItems(prev => {
          const next = new Set(prev);
          if (res.data) {
            next.add(String(propertyId));
          } else {
            next.delete(String(propertyId));
          }
          return next;
        });
        return res.data;
      }
    } catch (err) {
      console.error('북마크 토글 실패:', err);
      return false;
    }
  }, []);

  const isBookmarked = useCallback((propertyId) => {
    return bookmarkedItems.has(String(propertyId));
  }, [bookmarkedItems]);

  return (
    <BookmarkContext.Provider value={{ isBookmarked, toggleBookmark, loadBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};