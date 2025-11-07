package com.pci.onbid.service;

import com.pci.onbid.domain.Bookmark;
import com.pci.onbid.mapper.BookmarkMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkMapper bookmarkMapper;

    // 북마크 토글 (있으면 삭제, 없으면 추가)
    public boolean toggleBookmark(Long itemId, String userId) {
        boolean exists = bookmarkMapper.exists(itemId, userId) > 0;

        if (exists) {
            bookmarkMapper.delete(itemId, userId);
            return false; // 해제됨
        } else {
            Bookmark bookmark = new Bookmark();
            bookmark.setItemId(itemId);
            bookmark.setUserId(userId);
            bookmarkMapper.insert(bookmark);
            return true; // 등록됨
        }
    }

    // 사용자 북마크 목록 조회
    public List<Bookmark> getBookmarks(String userId) {
        return bookmarkMapper.findByUser(userId);
    }
}
