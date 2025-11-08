import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { propertyAPI } from '../services/api';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const userId = 'guest';

  const loadBookmarks = useCallback(async () => {
    try {
      const res = await propertyAPI.getBookmarks(userId);
      const ids = (res.data || []).map(b => String(b.itemId ?? b.item_id ?? b.id));
      setBookmarkedItems(new Set(ids));
    } catch (err) {
      console.error('❌ 북마크 불러오기 실패:', err);
      setBookmarkedItems(new Set());
    }
  }, []);

  const toggleBookmark = useCallback(async (propertyId) => {
    try {
      const res = await propertyAPI.toggleBookmark(propertyId, userId);
      const ok = res?.data === true || res?.data === 'true' || res?.data === 1;

      setBookmarkedItems(prev => {
        const next = new Set(prev);
        const key = String(propertyId);
        if (ok) next.add(key);
        else next.delete(key);
        return next;
      });

      // ✅ Context 내부에서만 상태 유지, 외부 이벤트 삭제
      await loadBookmarks();
    } catch (err) {
      console.error('❌ 북마크 토글 실패:', err);
    }
  }, [loadBookmarks]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const isBookmarked = useCallback(
    (propertyId) => bookmarkedItems.has(String(propertyId)),
    [bookmarkedItems]
  );

  return (
    <BookmarkContext.Provider value={{ isBookmarked, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => useContext(BookmarkContext);
