import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/** 날짜를 YYYY-MM-DD HH:mm 형태로 변환 */
const formatDate = (dt) => {
  if (!dt) return '-';
  try {
    const date = new Date(dt);
    if (isNaN(date.getTime())) return dt; // 파싱 안되면 원본 표시
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dt;
  }
};

const HistoryModal = ({ open, onClose, address, history }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 620,
        bgcolor: '#fff',
        color: '#111',
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      {/* 상단 제목 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#222' }}>
          📜 {address} 이력조회
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: '#444' }} />
        </IconButton>
      </Box>

      {/* 테이블 */}
      <Table size="small" sx={{ borderTop: '2px solid #1976d2' }}>
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: '#222' }}>이력번호</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222' }}>공고번호</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222' }}>시작일</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222' }}>종료일</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#222' }}>상태</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Array.isArray(history) && history.length > 0 ? (
            history.map((row, idx) => (
              <TableRow
                key={`${row.cltrHstrNo}-${idx}`} // ⚠ key 충돌 방지
                sx={{
                  '&:hover': { backgroundColor: '#f9f9f9' },
                  transition: '0.2s',
                }}
              >
                <TableCell sx={{ color: '#333' }}>{row.cltrHstrNo ?? '-'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{row.cltrNo ?? '-'}</TableCell>
                <TableCell sx={{ color: '#333' }}>{formatDate(row.pbctBegnDtm)}</TableCell>
                <TableCell sx={{ color: '#333' }}>{formatDate(row.pbctClsDtm)}</TableCell>

                {/* 상태 색상 로직 */}
                <TableCell
                  sx={{
                    color:
                      row.cltrSttsNm === '낙찰'
                        ? 'error.main'
                        : row.cltrSttsNm === '입찰중'
                        ? 'success.main'
                        : '#333',
                    fontWeight: 600,
                  }}
                >
                  {row.cltrSttsNm ?? '-'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ color: '#666', py: 3 }}>
                📭 해당 주소의 이력 데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  </Modal>
);

export default HistoryModal;
