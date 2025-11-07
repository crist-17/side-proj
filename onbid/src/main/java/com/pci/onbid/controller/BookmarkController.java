package com.pci.onbid.controller;

import com.pci.onbid.domain.Bookmark;
import com.pci.onbid.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    // 북마크 토글 (등록/해제)
    @PostMapping("/{itemId}")
    public boolean toggleBookmark(@PathVariable Long itemId,
                                  @RequestParam(defaultValue = "guest") String userId) {
        return bookmarkService.toggleBookmark(itemId, userId);
    }

    // 사용자 북마크 목록 조회
    @GetMapping
    public List<Bookmark> getUserBookmarks(@RequestParam(defaultValue = "guest") String userId) {
        return bookmarkService.getBookmarks(userId);
    }
}
