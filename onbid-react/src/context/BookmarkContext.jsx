import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { propertyAPI, isLoggedIn } from '../services/api';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

  // ✅ 로그인한 사용자 ID 가져오기 (또는 guest)
  const getUserId = () => {
    if (isLoggedIn()) {
      // 백엔드에서 사용자 ID를 받는 경우
      return localStorage.getItem('userId') || localStorage.getItem('nickname') || 'guest';
    }
    return 'guest';
  };

  const loadBookmarks = useCallback(async () => {
    try {
      const userId = getUserId();
      const res = await propertyAPI.getBookmarks(userId);
      const ids = (res.data || []).map(b => String(b.itemId ?? b.item_id ?? b.id));
      setBookmarkedItems(new Set(ids));
      console.log('✅ 북마크 로드 성공:', ids);
    } catch (err) {
      console.error('❌ 북마크 불러오기 실패:', err);
      setBookmarkedItems(new Set());
    }
  }, []);

  const toggleBookmark = useCallback(async (propertyId) => {
    try {
      // ✅ 로그인 상태 다시 확인
      if (!isLoggedIn()) {
        console.warn('⚠️ 로그인 필요');
        alert('❌ 즐겨찾기는 로그인 후 사용 가능합니다.');
        return;
      }

      const userId = getUserId();
      const res = await propertyAPI.toggleBookmark(propertyId, userId);
      const ok = res?.data === true || res?.data === 'true' || res?.data === 1;

      setBookmarkedItems(prev => {
        const next = new Set(prev);
        const key = String(propertyId);
        if (ok) {
          next.add(key);
          console.log('⭐ 즐겨찾기 추가:', propertyId);
        } else {
          next.delete(key);
          console.log('🗑️ 즐겨찾기 제거:', propertyId);
        }
        return next;
      });

      // ✅ Context 내부에서만 상태 유지
      await loadBookmarks();
    } catch (err) {
      console.error('❌ 북마크 토글 실패:', err);
      if (err.response?.status === 401) {
        alert('❌ 세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
      }
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
