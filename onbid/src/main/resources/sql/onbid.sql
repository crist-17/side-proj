-- ========================================
-- ✅ 1. 데이터베이스 생성 및 사용
-- ========================================
CREATE DATABASE onbiddb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE onbiddb;
SHOW DATABASES;


-- ========================================
-- ✅ 2. onbid_item (온비드 물건 기본 테이블)
-- ========================================
CREATE TABLE onbid_item (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,       -- 내부 고유키 (DB 전용)
                            plnm_no VARCHAR(20),                        -- 공고번호
                            cltr_mnmt_no VARCHAR(50),                   -- 물건관리번호
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

-- ✅ 필요 시 기존 테이블 초기화 및 제약조건 관리
DROP TABLE IF EXISTS onbid_item;
SELECT * FROM onbid_item;
ALTER TABLE onbid_item ADD UNIQUE (plnm_no);
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE onbid_item;
SET FOREIGN_KEY_CHECKS = 1;

-- ✅ 주소 중복 제거용 쿼리 (같은 주소가 여러 행으로 존재할 경우)
DELETE t1
FROM onbid_item t1
JOIN onbid_item t2
  ON t1.ldnm_adrs = t2.ldnm_adrs
  AND t1.id > t2.id;

-- ✅ 중복제약 (필요 시 해제/재등록)
ALTER TABLE onbid_item ADD CONSTRAINT uq_onbid_unique UNIQUE (ldnm_adrs);
ALTER TABLE onbid_item ADD UNIQUE (plnm_no);
ALTER TABLE onbid_item DROP INDEX uq_onbid_plnm;
ALTER TABLE onbid_item DROP INDEX uq_onbid_unique;
ALTER TABLE onbid_item DROP INDEX plnm_no;


-- ========================================
-- ✅ 3. bookmark (북마크 테이블)
-- ========================================
CREATE TABLE bookmark (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          item_id BIGINT NOT NULL,                    -- onbid_item.id 외래키
                          user_id VARCHAR(50) NOT NULL,               -- 사용자 ID
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (item_id) REFERENCES onbid_item(id)
);

SELECT * FROM bookmark;
TRUNCATE TABLE bookmark;


-- ========================================
-- ✅ 4. onbid_history (주소별 이력 관리 테이블)
-- ========================================
/*
  이 테이블은 onbid_item 과 1:N 관계.
  즉, 하나의 물건(item) 이 여러 개의 이력(history)을 가질 수 있음.
  프론트에서는 주소 단위로 그룹화하여 이 테이블을 조회하게 됨.
*/
CREATE TABLE IF NOT EXISTS onbid_history (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             item_id BIGINT NOT NULL,             -- FK: onbid_item.id
                                             cltr_hstr_no VARCHAR(50),            -- 이력번호
    cltr_no VARCHAR(50),                 -- 공고번호
    pbct_begn_dtm DATETIME,              -- 공고시작일시
    pbct_cls_dtm DATETIME,               -- 공고종료일시
    open_price DECIMAL(18,2),            -- 게시가격
    cltr_stts_nm VARCHAR(100),           -- 물건상태명
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_item FOREIGN KEY (item_id) REFERENCES onbid_item(id)
    );

-- ✅ 조회 속도 향상용 인덱스
CREATE INDEX idx_history_item ON onbid_history(item_id);
CREATE INDEX idx_history_cltr_no ON onbid_history(cltr_no);

-- ✅ 이력 테이블 확인
SELECT * FROM onbid_history;


-- ========================================
-- ✅ 5. 점검용 쿼리
-- ========================================
SELECT COUNT(*) AS item_count FROM onbid_item;
SHOW TABLES;
SHOW CREATE TABLE onbid_history;
-- ✅ 참고:
-- 1) onbid_item : 물건 기본 정보
-- 2) bookmark   : 사용자별 즐겨찾기 정보
-- 3) onbid_history : 주소별/공고별 상세 이력
-- ========================================
