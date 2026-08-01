# 🏫 방과후 스마트 출석 관리 시스템 (ASA)

> anne쌤을 위한 **Next.js (App Router) + Supabase + Tailwind CSS** 기반 방과후 수업 스마트 출석 관리 웹 애플리케이션입니다.

---

## 🌟 주요 기능

1. **학생용 출석 페이지 (`/attend`)**
   - 실시간 고유 **QR 코드 생성** 및 디스플레이
   - 학번과 이름 입력 후 **[출석하기]** 3초 완료
   - 출석 성공 직관 모달 애니메이션 및 **당일 중복 출석 방지**

2. **교사용 출석 대시보드 (`/admin`)**
   - **학생 명단 엑셀 일괄 업로드**: 드래그앤드롭 모달로 `[학번, 이름]` 데이터 일괄 등록
   - **실시간 출석 현황**: O/X 및 초록/빨강 상태 뱃지, 오늘의 출석률 프로그래스바
   - **달력 선택 연동 (Date Picker)**: 특정 날짜 클릭 시 해당 일자의 출석부 자동 조회
   - **엑셀 다운로드**: 클릭 한 번으로 선택된 일자의 출석 결과(`.xlsx`) 다운로드

---

## 🛠️ 기술 스택

- **Frontend**: Next.js 14 (App Router, TypeScript), React, Tailwind CSS
- **Backend / DB**: Next.js API Routes (Route Handlers), Supabase PostgreSQL
- **주요 라이브러리**: `xlsx` (SheetJS), `qrcode.react`, `react-calendar`, `lucide-react`

---

## 🚀 빠른 시작 가이드 (로컬 실행)

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정 (`.env.local`)
프로젝트 루트 경로에 `.env.local` 파일을 생성하고 Supabase 프로젝트 API 정보를 입력합니다.
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 데이터베이스 테이블 생성 (Supabase SQL)
Supabase 대시보드 -> **SQL Editor**로 이동한 후, `supabase/schema.sql` 파일의 내용을 복사하여 실행합니다.

### 4. 로컬 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 로 접속하세요.

---

## 🌐 GitHub & Vercel 배포 방법

1. **GitHub 저장소 생성 및 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 방과후 출석 관리 웹앱"
   git branch -M main
   git remote add origin https://github.com/사용자이름/asa-attendance.git
   git push -u origin main
   ```

2. **Vercel 배포**
   - [Vercel Dashboard](https://vercel.com/dashboard) 접속 후 **[Add New] -> [Project]** 선택
   - 방금 푸시한 GitHub 저장소를 선택 (Import)
   - **Environment Variables**에 다음 두 가지 환경변수를 등록:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **[Deploy]** 버튼을 누르면 배포 완료!
