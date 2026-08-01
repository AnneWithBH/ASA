'use client';

import { useState } from 'react';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { UserCheck, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function AttendPage() {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ALREADY' | 'ERROR'>('IDLE');
  const [msg, setMsg] = useState('');
  const [attendanceTime, setAttendanceTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId.trim() || !name.trim()) {
      setStatus('ERROR');
      setMsg('학번과 이름을 모두 정확히 입력해 주세요.');
      return;
    }

    setLoading(true);
    setStatus('IDLE');
    setMsg('');

    try {
      const res = await fetch('/api/attend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId.trim(), name: name.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('SUCCESS');
        setMsg(data.message || '출석이 완료되었습니다!');
        setAttendanceTime(new Date().toLocaleTimeString('ko-KR'));
      } else if (res.status === 409) {
        setStatus('ALREADY');
        setMsg(data.message || '이미 오늘 출석 체크가 완료되었습니다.');
        if (data.timestamp) {
          setAttendanceTime(new Date(data.timestamp).toLocaleTimeString('ko-KR'));
        }
      } else {
        setStatus('ERROR');
        setMsg(data.error || '출석 처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setStatus('ERROR');
      setMsg('서버와 통신에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudentId('');
    setName('');
    setStatus('IDLE');
    setMsg('');
    setAttendanceTime('');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          학생 출석 체크
        </h1>
        <p className="text-sm text-slate-500">
          오늘의 방과후 수업 출석을 위해 학번과 이름을 입력하고 [출석하기]를 눌러주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* 좌측: QR 코드 영역 */}
        <QRCodeDisplay />

        {/* 우측: 출석 입력 폼 & 완료 화면 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative">
          {status === 'SUCCESS' ? (
            /* 완료 성공 화면 */
            <div className="flex flex-col items-center text-center py-6 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-md shadow-emerald-100">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-2">
                CHECK COMPLETE
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                출석이 완료되었습니다!
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                <span className="font-bold text-slate-800">{name}</span> ({studentId}) 학생
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500 mb-6">
                출석 인증 시각: <span className="font-semibold text-slate-700">{attendanceTime}</span>
              </div>

              <button
                onClick={handleReset}
                type="button"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>새로운 출석체크</span>
              </button>
            </div>
          ) : status === 'ALREADY' ? (
            /* 중복 출석 완료 안내 화면 */
            <div className="flex flex-col items-center text-center py-6 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-9 h-9" />
              </div>
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold mb-2">
                이미 확인됨
              </span>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                이미 오늘 출석체크를 완료했습니다.
              </h2>
              <p className="text-xs text-slate-500 mb-4 max-w-xs">{msg}</p>

              {attendanceTime && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500 mb-6">
                  기존 출석 시각: <span className="font-semibold text-slate-700">{attendanceTime}</span>
                </div>
              )}

              <button
                onClick={handleReset}
                type="button"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                확인 및 폼 초기화
              </button>
            </div>
          ) : (
            /* 일반 입력 폼 */
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>출석 정보 입력</span>
                </h3>
                <p className="text-xs text-slate-500">본인의 학번과 이름을 입력한 후 출석 버튼을 클릭하세요.</p>
              </div>

              {status === 'ERROR' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{msg}</span>
                </div>
              )}

              {/* 학번 입력 */}
              <div>
                <label htmlFor="studentId" className="block text-xs font-bold text-slate-700 mb-1.5">
                  학번 (예: 10101)
                </label>
                <input
                  id="studentId"
                  type="text"
                  placeholder="학번을 입력하세요 (예: 10101)"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono bg-slate-50/50"
                  required
                />
              </div>

              {/* 이름 입력 */}
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요 (예: 홍길동)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
                  required
                />
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>출석 처리 중...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>출석하기</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
