package com.pci.onbid.mapper;

import com.pci.onbid.domain.Bookmark;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BookmarkMapper {

    // 북마크 추가
    @Insert("""
        INSERT INTO bookmark (item_id, user_id, created_at)
        VALUES (#{itemId}, #{userId}, NOW())
    """)
    void insert(Bookmark bookmark);

    // 북마크 삭제
    @Delete("""
        DELETE FROM bookmark
        WHERE item_id = #{itemId} AND user_id = #{userId}
    """)
    void delete(@Param("itemId") Long itemId, @Param("userId") String userId);

    // 특정 사용자의 북마크 목록 조회
    @Select("""
        SELECT * FROM bookmark
        WHERE user_id = #{userId}
        ORDER BY created_at DESC
    """)
    List<Bookmark> findByUser(String userId);

    // 이미 북마크 되어있는지 확인
    @Select("""
        SELECT COUNT(*) FROM bookmark
        WHERE item_id = #{itemId} AND user_id = #{userId}
    """)
    int exists(@Param("itemId") Long itemId, @Param("userId") String userId);
}
