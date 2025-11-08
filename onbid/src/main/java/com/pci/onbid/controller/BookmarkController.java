package com.pci.onbid.controller;

import com.pci.onbid.domain.Bookmark;
import com.pci.onbid.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService bookmarkService;

    @PostMapping("/{itemId}")
    public ResponseEntity<Boolean> toggleBookmark(
            @PathVariable Long itemId,
            @RequestParam(defaultValue = "guest") String userId) {
        boolean result = bookmarkService.toggleBookmark(itemId, userId);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<Bookmark>> getUserBookmarks(
            @RequestParam(defaultValue = "guest") String userId) {
        return ResponseEntity.ok(bookmarkService.getBookmarks(userId));
    }
}
