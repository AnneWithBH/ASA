'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (dateStr: string) => void;
}

export default function AttendanceCalendar({ selectedDate, onDateChange }: Props) {
  // YYYY-MM-DD -> Date Object
  const dateObj = new Date(selectedDate);

  const handleCalendarChange = (value: any) => {
    if (value instanceof Date) {
      // 시간대 오차 방지를 위해 한국 로컬 날짜 정형화
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      onDateChange(`${year}-${month}-${day}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-sm">
        <CalendarIcon className="w-4 h-4 text-indigo-600" />
        <span>출석 조회 날짜 선택</span>
      </div>

      <div className="custom-calendar-wrapper">
        <Calendar
          onChange={handleCalendarChange}
          value={dateObj}
          locale="ko-KR"
          formatDay={(_, date) => String(date.getDate())}
          calendarType="gregory"
          className="border-none text-sm w-full font-sans"
        />
      </div>
    </div>
  );
}
