package com.pci.onbid.mapper;

import com.pci.onbid.domain.Bookmark;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BookmarkMapper {

    //북마크추가
    @Insert("""
        INSERT INTO bookmark (item_id, user_id, created_at)
        VALUES (#{itemId}, #{userId}, NOW())
    """)
    void insert(Bookmark bookmark);

    //북마크삭제
    @Delete("""
        DELETE FROM bookmark
        WHERE item_id = #{itemId} AND user_id = #{userId}
    """)
    void delete(@Param("itemId") Long itemId, @Param("userId") String userId);

    // ✅ alias로 카멜케이스 강제 매핑 (가장 중요)
    @Select("""
        SELECT 
            id,
            item_id   AS itemId,
            user_id   AS userId,
            created_at AS createdAt
        FROM bookmark
        WHERE user_id = #{userId}
        ORDER BY created_at DESC
    """)
    List<Bookmark> findByUser(String userId);

    @Select("""
        SELECT COUNT(*) FROM bookmark
        WHERE item_id = #{itemId} AND user_id = #{userId}
    """)
    int exists(@Param("itemId") Long itemId, @Param("userId") String userId);
}
