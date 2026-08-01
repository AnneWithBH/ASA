import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: '방과후 스마트 출석 관리 시스템',
  description: 'QR 코드 및 엑셀 연동 방과후 출석 체크 웹 애플리케이션',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
          © 2026 방과후 스마트 출석부 System. anne쌤을 위한 출석 관리 웹 앱
        </footer>
      </body>
    </html>
  );
}
