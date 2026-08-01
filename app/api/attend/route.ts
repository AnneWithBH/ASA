import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 지정한 날짜의 출석 정보 & 전체 학생 통합 목록 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // 1. 전체 학생 명단 불러오기
    const { data: students, error: studentErr } = await supabase
      .from('students')
      .select('*')
      .order('student_id', { ascending: true });

    // 2. 해당 날짜 출석 기록 불러오기
    const { data: attendanceRecords, error: attendErr } = await supabase
      .from('attendance')
      .select('*')
      .eq('date', dateParam);

    if (studentErr || attendErr) {
      // Supabase 미설치 또는 연결 미작동시 폴백 Response
      return NextResponse.json({
        success: true,
        date: dateParam,
        summary: { total: 0, present: 0, absent: 0 },
        list: [],
      });
    }

    // 출석 Map 생성 (key: student_id)
    const attendMap = new Map();
    (attendanceRecords || []).forEach((rec: any) => {
      attendMap.set(rec.student_id, rec);
    });

    // 전체 학생 대비 출석 현황 가공
    let presentCount = 0;
    const combinedList = (students || []).map((student: any) => {
      const record = attendMap.get(student.student_id);
      const isPresent = !!record;
      if (isPresent) presentCount++;

      return {
        student_id: student.student_id,
        name: student.name,
        status: isPresent ? (record.status || 'PRESENT') : 'ABSENT',
        timestamp: record?.timestamp || null,
        date: dateParam,
      };
    });

    return NextResponse.json({
      success: true,
      date: dateParam,
      summary: {
        total: students?.length || 0,
        present: presentCount,
        absent: (students?.length || 0) - presentCount,
      },
      list: combinedList,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 학생 출석체크 처리
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student_id, name } = body;

    if (!student_id || !name) {
      return NextResponse.json(
        { success: false, error: '학번과 이름을 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    const cleanStudentId = String(student_id).trim();
    const cleanName = String(name).trim();
    const today = new Date().toISOString().split('T')[0];

    // 1. 학생 명단에 존재하는지 확인 (없다면 자동 생성 또는 연동)
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', cleanStudentId)
      .single();

    if (!studentData) {
      // 명단에 없는 학번이라도 자동 등록 처리하여 편의 제공
      await supabase.from('students').insert([
        { student_id: cleanStudentId, name: cleanName }
      ]);
    }

    // 2. 당일 중복 출석 확인
    const { data: existingAttend } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', cleanStudentId)
      .eq('date', today)
      .single();

    if (existingAttend) {
      return NextResponse.json(
        {
          success: false,
          code: 'ALREADY_CHECKED',
          message: `${cleanName} 학생은 이미 오늘(${today}) 출석 체크가 완료되었습니다.`,
          timestamp: existingAttend.timestamp,
        },
        { status: 409 }
      );
    }

    // 3. 출석 데이터 저장
    const { data: inserted, error: insertErr } = await supabase
      .from('attendance')
      .insert([
        {
          student_id: cleanStudentId,
          name: cleanName,
          date: today,
          status: 'PRESENT',
        },
      ])
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '출석이 성공적으로 완료되었습니다!',
      record: inserted,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
