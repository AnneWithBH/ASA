'use client';

import { useState, useEffect, useCallback } from 'react';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import ExcelUploadModal from '@/components/ExcelUploadModal';
import { downloadAttendanceExcel } from '@/lib/excel';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Download, 
  Upload, 
  RefreshCw, 
  Search, 
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 날짜별 출석 데이터 페치
  const fetchAttendance = useCallback(async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attend?date=${dateStr}`);
      const json = await res.json();

      if (json.success) {
        setAttendanceData(json.list || []);
        setSummary(json.summary || { total: 0, present: 0, absent: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch attendance data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate, fetchAttendance]);

  // 엑셀 다운로드 실행
  const handleExcelDownload = () => {
    if (attendanceData.length === 0) {
      alert('다운로드할 출석 데이터가 없습니다.');
      return;
    }
    downloadAttendanceExcel(attendanceData, selectedDate);
  };

  // 검색 필터링
  const filteredData = attendanceData.filter(
    (item) =>
      item.student_id.includes(searchTerm) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 출석률 계산
  const attendanceRate = summary.total > 0
    ? Math.round((summary.present / summary.total) * 100)
    : 0;

  return (
    <div className="py-6 space-y-6">
      {/* 대시보드 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            방과후 출석 대시보드
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>선택된 날짜: <strong className="text-slate-800 font-mono">{selectedDate}</strong></span>
          </p>
        </div>

        {/* 상단 액션 버튼 그룹 */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>학생 명단 엑셀 업로드</span>
          </button>

          <button
            onClick={handleExcelDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-100"
          >
            <Download className="w-3.5 h-3.5" />
            <span>출석부 엑셀 다운로드</span>
          </button>

          <button
            onClick={() => fetchAttendance(selectedDate)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 요약 통계 카드 4종 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 전체 학생 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">전체 등록 학생</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-800">{summary.total}명</div>
        </div>

        {/* 출석 완료 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold">출석 완료 (O)</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{summary.present}명</div>
        </div>

        {/* 미출석/결석 */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-sm bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold">미출석 (X)</span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{summary.absent}명</div>
        </div>

        {/* 출석률 */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-200/80 shadow-sm bg-gradient-to-br from-white to-indigo-50/30">
          <div className="flex items-center justify-between text-indigo-700 mb-2">
            <span className="text-xs font-bold">오늘의 출석률</span>
            <span className="text-xs font-mono font-bold text-indigo-600">{attendanceRate}%</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-2.5 mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 메인 레이아웃: 좌측 달력 / 우측 출석 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* 좌측: 달력 컨트롤러 */}
        <div className="md:col-span-1 space-y-4">
          <AttendanceCalendar
            selectedDate={selectedDate}
            onDateChange={(d) => setSelectedDate(d)}
          />

          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm text-xs leading-relaxed">
            <h4 className="font-bold text-indigo-400 mb-2 text-sm flex items-center gap-1.5">
              💡 이용 팁
            </h4>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>달력에서 과거/현재 날짜를 클릭하면 해당 일자의 출석부 기록으로 자동 전환됩니다.</li>
              <li>학명 명단을 처음 등록할 때는 <strong>[학생 명단 엑셀 업로드]</strong>를 사용하세요.</li>
              <li>상단 <strong>[출석부 엑셀 다운로드]</strong> 버튼으로 조회된 날짜의 보고서 엑셀 파일을 다운로드합니다.</li>
            </ul>
          </div>
        </div>

        {/* 우측: 출석 데이터 상세 테이블 */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col min-h-[460px]">
          {/* 테이블 상단 컨트롤 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">출석 명단 상세</h3>
              <p className="text-xs text-slate-500">실시간 출석 상태 확인 및 학생 검색</p>
            </div>

            {/* 검색창 */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="학번 또는 이름 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* 테이블 본문 */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 text-xs gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <span>출석 데이터를 불러오는 중...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 text-xs">
              <Users className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <p className="font-semibold text-slate-600">등록된 학생이 없거나 검색 결과가 없습니다.</p>
              <p className="text-slate-400 mt-1">상단의 [학생 명단 엑셀 업로드] 버튼으로 명단을 등록해 보세요.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">번호</th>
                    <th className="py-3 px-4">학번</th>
                    <th className="py-3 px-4">이름</th>
                    <th className="py-3 px-4">출석 여부</th>
                    <th className="py-3 px-4">출석 시각</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredData.map((row, idx) => {
                    const isPresent = row.status === 'PRESENT';
                    return (
                      <tr key={row.student_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{row.student_id}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{row.name}</td>
                        <td className="py-3 px-4">
                          {isPresent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>출석 (O)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px]">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>미출석 (X)</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {row.timestamp ? (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {new Date(row.timestamp).toLocaleTimeString('ko-KR')}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 학생 명단 업로드 모달 */}
      <ExcelUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchAttendance(selectedDate)}
      />
    </div>
  );
}
