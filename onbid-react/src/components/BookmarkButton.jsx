import React, { useState, useEffect } from 'react';
import { propertyAPI } from '../services/api';
import { Checkbox, IconButton, Tooltip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const BookmarkButton = ({ propertyId, initialIsBookmarked = false }) => {
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

    const handleToggleBookmark = async () => {
        try {
            await propertyAPI.saveBookmark(propertyId);
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error('북마크 처리 중 오류:', error);
        }
    };

    return (
        <Tooltip title={isBookmarked ? "관심물건 해제" : "관심물건 등록"}>
            <IconButton onClick={handleToggleBookmark} color="primary">
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default BookmarkButton;