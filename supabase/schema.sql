-- 1. 기존 테이블 정리 (필요시 사용)
-- DROP TABLE IF EXISTS public.attendance;
-- DROP TABLE IF EXISTS public.students;

-- 2. 학생 명단 테이블 생성
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) UNIQUE NOT NULL, -- 학번 (예: 10101)
    name VARCHAR(100) NOT NULL,              -- 이름 (예: 홍길동)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 출석 기록 테이블 생성
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) NOT NULL,          -- 학번
    name VARCHAR(100) NOT NULL,                -- 이름
    date DATE NOT NULL DEFAULT CURRENT_DATE,   -- 출석 날짜 (YYYY-MM-DD)
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- 출석 상세 일시
    status VARCHAR(20) DEFAULT 'PRESENT',      -- 출석 상태 (PRESENT: 출석, LATE: 지각, ABSENT: 결석)
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE,
    CONSTRAINT unique_student_daily_attendance UNIQUE (student_id, date) -- 하루 동일 학번 중복 출석 방지
);

-- 4. 인덱스 생성 (조회 속도 최적화)
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);

-- 5. RLS (Row Level Security) 설정 - 기본 허용 정책 (개발 및 서비스 간편 연동용)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on students" ON public.students FOR ALL USING (true);

CREATE POLICY "Allow public select on attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on attendance" ON public.attendance FOR ALL USING (true);

-- 6. 테스트용 기초 데이터 (선택 사항)
INSERT INTO public.students (student_id, name) VALUES
('10101', '강하늘'),
('10102', '김민준'),
('10103', '박서준'),
('10104', '이지은'),
('10105', '최유진')
ON CONFLICT (student_id) DO NOTHING;
