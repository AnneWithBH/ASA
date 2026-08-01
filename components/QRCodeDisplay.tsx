'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, RefreshCw } from 'lucide-react';

export default function QRCodeDisplay() {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrUrl(window.location.href);
    }
  }, []);

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      setQrUrl(`${window.location.origin}/attend?t=${Date.now()}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-4">
        <QrCode className="w-3.5 h-3.5" />
        <span>실시간 출석 QR 코드</span>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 shadow-inner">
        {qrUrl ? (
          <QRCodeSVG 
            value={qrUrl} 
            size={180} 
            level="H" 
            includeMargin={true}
            imageSettings={{
              src: "",
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        ) : (
          <div className="w-[180px] h-[180px] bg-slate-200 animate-pulse rounded-lg" />
        )}
      </div>

      <p className="text-xs text-slate-500 max-w-[220px] mb-3">
        스마트폰 카메라로 위 QR 코드를 스캔하거나 학번과 이름을 입력하여 출석하세요.
      </p>

      <button
        onClick={handleRefresh}
        type="button"
        className="text-xs text-slate-400 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        <span>QR 코드 새로고침</span>
      </button>
    </div>
  );
}
