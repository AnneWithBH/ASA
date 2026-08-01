'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCheck, ShieldCheck, Home } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <UserCheck className="w-5 h-5" />
          </div>
          <span>방과후 스마트 출석부</span>
        </Link>

        {/* 네비게이션 버튼 */}
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname === '/' 
                ? 'bg-slate-100 text-slate-900 font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>홈</span>
          </Link>
          
          <Link
            href="/attend"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname === '/attend' 
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>학생 출석하기</span>
          </Link>

          <Link
            href="/admin"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname === '/admin' 
                ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>교사용 대시보드</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
