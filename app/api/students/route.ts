import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, query, orderBy } from 'firebase/firestore';

// 학생 전체 명단 조회
export async function GET() {
  try {
    const studentsCol = collection(db, 'students');
    const q = query(studentsCol, orderBy('student_id', 'asc'));
    const snapshot = await getDocs(q);

    const students: any[] = [];
    snapshot.forEach((docSnap) => {
      students.push({ id: docSnap.id, ...docSnap.data() });
    });

    return NextResponse.json({ success: true, students });
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

    // Firestore batch or setDoc loop (document id = student_id)
    let count = 0;
    for (const s of students) {
      const studentIdClean = String(s.student_id).trim();
      const nameClean = String(s.name).trim();

      if (studentIdClean && nameClean) {
        const studentRef = doc(db, 'students', studentIdClean);
        await setDoc(studentRef, {
          student_id: studentIdClean,
          name: nameClean,
          updated_at: new Date().toISOString(),
        }, { merge: true });
        count++;
      }
    }

    return NextResponse.json({ success: true, count });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
