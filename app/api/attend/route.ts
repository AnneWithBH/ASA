import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

// 지정한 날짜의 출석 정보 & 전체 학생 통합 목록 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // 1. 전체 학생 명단 불러오기
    const studentsCol = collection(db, 'students');
    const studentQuery = query(studentsCol, orderBy('student_id', 'asc'));
    const studentSnap = await getDocs(studentQuery);

    const students: any[] = [];
    studentSnap.forEach((docSnap) => {
      students.push({ id: docSnap.id, ...docSnap.data() });
    });

    // 2. 해당 날짜의 출석 기록 불러오기
    const attendanceCol = collection(db, 'attendance');
    const attendQuery = query(attendanceCol, where('date', '==', dateParam));
    const attendSnap = await getDocs(attendQuery);

    const attendMap = new Map();
    attendSnap.forEach((docSnap) => {
      const data = docSnap.data();
      attendMap.set(data.student_id, data);
    });

    // 3. 전체 학생 대비 출석 현황 매핑
    let presentCount = 0;
    const combinedList = students.map((student) => {
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
        total: students.length,
        present: presentCount,
        absent: students.length - presentCount,
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
    const nowIso = new Date().toISOString();

    // 1. 학생 명단에 존재하는지 확인 (없으면 자동으로 학생 목록에 추가)
    const studentRef = doc(db, 'students', cleanStudentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      await setDoc(studentRef, {
        student_id: cleanStudentId,
        name: cleanName,
        created_at: nowIso,
      });
    }

    // 2. 당일 중복 출석 확인 (문서 ID: TODAY_STUDENTID)
    const attendDocId = `${today}_${cleanStudentId}`;
    const attendRef = doc(db, 'attendance', attendDocId);
    const attendSnap = await getDoc(attendRef);

    if (attendSnap.exists()) {
      const existingData = attendSnap.data();
      return NextResponse.json(
        {
          success: false,
          code: 'ALREADY_CHECKED',
          message: `${cleanName} 학생은 이미 오늘(${today}) 출석 체크가 완료되었습니다.`,
          timestamp: existingData.timestamp,
        },
        { status: 409 }
      );
    }

    // 3. 출석 데이터 저장
    const newRecord = {
      student_id: cleanStudentId,
      name: cleanName,
      date: today,
      timestamp: nowIso,
      status: 'PRESENT',
    };

    await setDoc(attendRef, newRecord);

    return NextResponse.json({
      success: true,
      message: '출석이 성공적으로 완료되었습니다!',
      record: newRecord,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
