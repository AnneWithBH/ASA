import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 학생 전체 명단 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('student_id', { ascending: true });

    if (error) {
      // Supabase 미연동 환경 픽스 또는 폴백
      return NextResponse.json({ success: true, students: [], isFallback: true });
    }

    return NextResponse.json({ success: true, students: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 학생 명단 일괄 등록 (엑셀 업로드 등)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { students } = body;

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ success: false, error: '유효한 학생 데이터가 없습니다.' }, { status: 400 });
    }

    // Supabase Upsert (학번 중복시 이름 업데이트)
    const { data, error } = await supabase
      .from('students')
      .upsert(
        students.map(s => ({
          student_id: String(s.student_id).trim(),
          name: String(s.name).trim(),
        })),
        { onConflict: 'student_id' }
      )
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data?.length || students.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
