import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const RefreshButton = ({ onRefresh }) => {
  const handleClick = async () => {
    try {
      // 1) 백엔드에서 온비드 API를 불러와 DB에 저장
      await axios.get('http://localhost:8092/api/onbid/test');

      // 2) 저장 완료 후 목록 다시 가져오기
      await onRefresh();

      alert("🔄 최신 데이터가 성공적으로 반영되었습니다!");
    } catch (e) {
      console.error("새로고침 실패:", e);
      alert("❌ 새로고침 중 오류가 발생했습니다.");
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleClick}
      sx={{ mb: 2 }}
    >
      🔄 최신 데이터 가져오기
    </Button>
  );
};

export default RefreshButton;
