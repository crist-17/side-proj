import React from 'react';
import { Tooltip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useBookmark } from '../context/BookmarkContext';
import { isLoggedIn } from '../services/api';

const BookmarkButton = ({ propertyId }) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const bookmarked = isBookmarked(propertyId);
  const loggedIn = isLoggedIn();

  const handleBookmarkClick = (e) => {
    e.stopPropagation();

    // ✅ 로그인 여부 확인
    if (!loggedIn) {
      alert('❌ 즐겨찾기는 로그인 후 사용 가능합니다.');
      return;
    }

    // ✅ 로그인 상태 → 즐겨찾기 토글
    toggleBookmark(propertyId);
  };

  return (
    <Tooltip 
      title={
        loggedIn 
          ? (bookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가')
          : '로그인 후 사용 가능'
      }
    >
      <span
        onClick={handleBookmarkClick}
        style={{
          cursor: loggedIn ? 'pointer' : 'not-allowed',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: loggedIn 
            ? (bookmarked ? '#FFD700' : '#999')
            : '#666',
          transition: 'color 0.2s ease',
          opacity: loggedIn ? 1 : 0.6,
        }}
      >
        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </span>
    </Tooltip>
  );
};

export default BookmarkButton;
