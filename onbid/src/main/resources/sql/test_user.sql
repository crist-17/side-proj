-- 기존 데이터 삭제
DELETE FROM users WHERE username = 'testuser';

-- 테스트용 사용자 데이터 (비밀번호: password123)
-- BCrypt 해시값 생성 후 삽입
INSERT INTO users (username, password, nickname, role) VALUES 
('testuser', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9b2.lQOxmui6aIm', '테스트사용자', 'user');

-- 검증용 쿼리
-- SELECT username, password FROM users WHERE username = 'testuser';

-- 다른 비밀번호로 테스트하려면:
-- 1. POST /api/test/hash 로 해시값 생성
-- 2. 생성된 해시값으로 DB 업데이트