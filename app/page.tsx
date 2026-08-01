import Link from 'next/link';
import { UserCheck, ShieldCheck, QrCode, FileSpreadsheet, Calendar, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="py-8 sm:py-12 flex flex-col items-center">
      {/* 뱃지 */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-6 border border-indigo-100">
        <Sparkles className="w-3.5 h-3.5" />
        <span>anne쌤을 위한 방과후 출석 관리 웹앱</span>
      </div>

      {/* 헤더 히어로 */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-900 tracking-tight leading-tight mb-4 max-w-2xl">
        빠르고 간편한 스마트 <br className="hidden sm:block" />
        <span className="text-indigo-600">방과후 수업 출석체크</span> 시스템
      </h1>
      <p className="text-slate-600 text-center text-sm sm:text-base max-w-lg mb-10">
        QR 코드 스캔 및 모바일 학번 입력으로 3초 만에 출석을 완료하고,
        선생님 대시보드에서 엑셀과 연동해 실시간으로 현황을 관리하세요.
      </p>

      {/* 메인 선택 카드 2개 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
        {/* 학생용 카드 */}
        <Link
          href="/attend"
          className="group bg-white rounded-3xl p-8 border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all flex flex-col items-start relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <UserCheck className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">FOR STUDENTS</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">학생 출석체크 페이지</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            QR 코드를 확인하고 학번과 이름을 입력하여 실시간으로 오늘 방과후 수업 출석을 진행합니다.
          </p>
          <div className="mt-auto inline-flex items-center text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
            출석하러 가기 &rarr;
          </div>
        </Link>

        {/* 관리자용 카드 */}
        <Link
          href="/admin"
          className="group bg-slate-900 text-white rounded-3xl p-8 hover:shadow-2xl transition-all flex flex-col items-start relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">FOR TEACHER</span>
          <h2 className="text-2xl font-bold text-white mb-2">교사 출석 대시보드</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            학생 명단 엑셀 업로드, 일자별 출석 현황 실시간 모니터링 및 엑셀 다운로드를 제공합니다.
          </p>
          <div className="mt-auto inline-flex items-center text-indigo-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
            대시보드 입장하기 &rarr;
          </div>
        </Link>
      </div>

      {/* 하단 서브 기능 안내 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3">
          <QrCode className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-800 text-sm mb-0.5">QR 코드 자동 생성</h4>
            <p className="text-xs text-slate-500">학생 화면 접속 시 즉시 QR 코드가 생성됩니다.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-800 text-sm mb-0.5">엑셀 연동 지원</h4>
            <p className="text-xs text-slate-500">학생 명단 업로드 및 출석부 엑셀 다운로드 제공</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-800 text-sm mb-0.5">날짜별 이력 조회</h4>
            <p className="text-xs text-slate-500">달력을 통해 특정 날짜의 출석률을 확인합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
