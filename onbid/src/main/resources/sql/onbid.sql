CREATE DATABASE onbiddb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE onbiddb;
SHOW DATABASES;

CREATE TABLE onbid_item (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,       -- 내부 고유키 (DB 전용)
                            plnm_no VARCHAR(20),                        -- 공고번호
                            cltr_nm VARCHAR(255) NOT NULL,              -- 물건명
                            ldnm_adrs VARCHAR(255),                     -- 지번 주소
                            min_bid_prc VARCHAR(50),                    -- 최저입찰가
                            apsl_ases_avg_amt VARCHAR(50),              -- 감정가(평균)
                            pbct_begn_dtm VARCHAR(20),                  -- 입찰 시작일시
                            pbct_cls_dtm VARCHAR(20),                   -- 입찰 종료일시
                            pbct_cltr_stat_nm VARCHAR(50),              -- 진행 상태(예: 입찰중, 낙찰, 유찰 등)
                            sido VARCHAR(50),                           -- 시/도명 (검색용)

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