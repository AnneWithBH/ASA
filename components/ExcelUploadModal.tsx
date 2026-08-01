'use client';

import { useState } from 'react';
import { parseStudentsExcel } from '@/lib/excel';
import { Student } from '@/lib/supabase';
import { Upload, FileSpreadsheet, X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ExcelUploadModal({ isOpen, onClose, onSuccess }: Props) {
  const [parsedData, setParsedData] = useState<Student[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');

    try {
      const buffer = await file.arrayBuffer();
      const students = parseStudentsExcel(buffer);

      if (students.length === 0) {
        setErrorMsg('엑셀 파일에서 학번과 이름 데이터열을 찾을 수 없습니다. (열 이름: 학번, 이름)');
        setParsedData([]);
      } else {
        setParsedData(students);
      }
    } catch (err: any) {
      setErrorMsg('엑셀 파싱 중 오류가 발생했습니다.');
      setParsedData([]);
    }
  };

  const handleSubmit = async () => {
    if (parsedData.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: parsedData }),
      });

      const json = await res.json();

      if (json.success) {
        alert(`총 ${json.count || parsedData.length}명의 학생 명단이 성공적으로 등록되었습니다.`);
        onSuccess();
        onClose();
        setParsedData([]);
        setFileName('');
      } else {
        setErrorMsg(json.error || '학생 명단 저장에 실패했습니다.');
      }
    } catch (err: any) {
      setErrorMsg('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">학생 명단 엑셀 일괄 업로드</h3>
              <p className="text-xs text-slate-500">학번과 이름이 포함된 .xlsx / .xls 파일을 등록하세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 파일 업로드 구역 */}
        <div className="mb-4">
          <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/30">
            <Upload className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-sm font-semibold text-slate-700">
              {fileName ? fileName : '클릭하여 엑셀 파일 선택'}
            </span>
            <span className="text-xs text-slate-400 mt-1">지원 형명: .xlsx, .xls (예: 학번, 이름 열)</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* 오류 메시지 */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 미리보기 목록 */}
        {parsedData.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-4 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-slate-600">미리보기 (총 {parsedData.length}명)</span>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-lg bg-white border border-slate-200 divide-y divide-slate-100">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-2.5 pl-4">학번</th>
                    <th className="p-2.5">이름</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {parsedData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 pl-4 font-mono font-medium">{item.student_id}</td>
                      <td className="p-2.5">{item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 푸터 버튼 */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={parsedData.length === 0 || loading}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-md shadow-indigo-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>등록 중...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>DB에 명단 일괄 등록</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
