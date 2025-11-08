import React from 'react';
import { Tooltip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useBookmark } from '../context/BookmarkContext';

const BookmarkButton = ({ propertyId }) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const bookmarked = isBookmarked(propertyId);

  return (
    <Tooltip title={bookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(propertyId);
        }}
        style={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: bookmarked ? '#FFD700' : '#999',
          transition: 'color 0.2s ease',
        }}
      >
        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </span>
    </Tooltip>
  );
};

export default BookmarkButton;
