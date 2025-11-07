import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useBookmark } from '../context/BookmarkContext';

const BookmarkButton = ({ propertyId }) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const bookmarked = isBookmarked(propertyId);

  return (
    <Tooltip title={bookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}>
      <IconButton
        onClick={() => toggleBookmark(propertyId)}
        sx={{
          color: bookmarked ? '#FFD700' : '#999', // 💛 더 눈에 띄는 노랑
          '&:hover': { color: bookmarked ? '#FFEB3B' : '#ccc' },
          transition: 'color 0.2s ease',
        }}
      >
        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default BookmarkButton;
