import * as XLSX from 'xlsx';
import { Student } from './supabase';

/**
 * 엑셀 ArrayBuffer를 읽어 [{ student_id: string, name: string }] 형태로 파싱
 */
export function parseStudentsExcel(buffer: ArrayBuffer): Student[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // JSON 객체로 변환
  const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

  const students: Student[] = [];

  for (const row of jsonData) {
    // 헤더 이름이 학번/학번/Id/Student_ID 등일 수 있으므로 정규화
    const studentIdRaw = row['학번'] || row['학번/번호'] || row['student_id'] || row['Student ID'] || row['ID'];
    const nameRaw = row['이름'] || row['성명'] || row['name'] || row['Name'];

    if (studentIdRaw && nameRaw) {
      students.push({
        student_id: String(studentIdRaw).trim(),
        name: String(nameRaw).trim(),
      });
    }
  }

  return students;
}

/**
 * 출석 기록 데이터를 Excel 파일로 내보내고 브라우저에서 바로 다운로드
 */
export function downloadAttendanceExcel(records: any[], targetDate: string) {
  const exportData = records.map((item, index) => ({
    '번호': index + 1,
    '학번': item.student_id,
    '이름': item.name,
    '출석 상태': item.status === 'PRESENT' ? '출석 (O)' : item.status === 'LATE' ? '지각 (▲)' : '결석 (X)',
    '출석 시각': item.timestamp ? new Date(item.timestamp).toLocaleTimeString('ko-KR') : '-',
    '출석 날짜': item.date || targetDate,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // 컬럼 너비 자동 설정
  worksheet['!cols'] = [
    { wch: 8 },  // 번호
    { wch: 14 }, // 학번
    { wch: 14 }, // 이름
    { wch: 14 }, // 출석 상태
    { wch: 18 }, // 출석 시각
    { wch: 14 }, // 출석 날짜
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '출석현황');

  // 파일 다운로드 실행
  const fileName = `출석현황_${targetDate}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
