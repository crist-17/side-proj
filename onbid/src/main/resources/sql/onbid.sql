CREATE DATABASE onbiddb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE onbiddb;
SHOW DATABASES;

CREATE TABLE onbid_item (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 내부 고유키
                            cltr_nm VARCHAR(255) NOT NULL,      -- 물건명
                            ldnm_adrs VARCHAR(255),             -- 주소
                            min_bid_prc VARCHAR(50),            -- 최저입찰가
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS onbid_item;
SELECT * FROM onbid_item;

DELETE t1 FROM onbid_item t1
JOIN onbid_item t2
  ON t1.cltr_nm = t2.cltr_nm
  AND t1.ldnm_adrs = t2.ldnm_adrs
  AND t1.id > t2.id;

ALTER TABLE onbid_item
    ADD CONSTRAINT uq_onbid_unique UNIQUE (cltr_nm, ldnm_adrs);

-- CREATE DATABASE onbiddb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE onbiddb;
-- SHOW DATABASES;
--
-- CREATE TABLE onbid_item (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 내부 고유키
--     rnum INT,                               -- 순번
--     plnm_no VARCHAR(20),                    -- 공고번호
--     cltr_nm VARCHAR(255),                   -- 물건명
--     ldnm_adrs VARCHAR(255),                 -- 주소(지번)
--     nmr_dadrs VARCHAR(255),                 -- 주소(도로명)
--     dpsl_mtd_nm VARCHAR(50),                -- 매각방식
--     bid_mtd_nm VARCHAR(100),                -- 입찰방식
--     min_bid_prc VARCHAR(50),                -- 최저입찰가
--     apsl_ases_avg_amt VARCHAR(50),          -- 감정가(평균)
--     fee_rate VARCHAR(20),                   -- 수수료율
--     pbct_begn_dtm VARCHAR(20),              -- 입찰시작일시
--     pbct_cls_dtm VARCHAR(20),               -- 입찰종료일시
--     pbct_cltr_stat_nm VARCHAR(50),          -- 진행상태 (입찰준비중 등)
--     goods_nm TEXT,                          -- 물건설명
--     ctgr_full_nm VARCHAR(100),              -- 카테고리명 (토지/임야 등)
--     sido VARCHAR(50),                       -- 시/도명 (검색조건용)
--     reg_date DATETIME DEFAULT NOW()         -- 등록일
-- );
--
-- DROP TABLE IF EXISTS onbid_item;
-- SELECT * FROM onbid_item;