# 과학 학습실 - Next.js 교육 앱

중1,2,3학년 과학 교육을 위한 인터랙티브 학습 플랫폼입니다.

## ✨ 주요 기능

- 📚 **암기 카드**: 단원별 핵심 개념 학습
- 🎮 **3D 시뮬레이션**: 직관적인 실험 체험 (준비 중)
- 📊 **학습 통계**: 정답률, 학습 횟수 추적
- 🔐 **Google 로그인**: 개인화된 학습 경험
- 📱 **반응형 디자인**: 모바일 친화적 UI

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone <repository-url>
cd edu
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/callback/google` 추가
4. 클라이언트 ID와 시크릿을 환경 변수에 설정

### 4. Supabase 설정

1. [Supabase](https://supabase.com/)에서 새 프로젝트 생성
2. 프로젝트 URL과 anon key를 환경 변수에 설정
3. SQL Editor에서 `supabase-schema.sql` 파일의 내용을 실행하여 데이터베이스 스키마 생성

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🛠️ 사용 기술

- **Framework**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API
│   ├── layout.tsx                       # 루트 레이아웃
│   ├── page.tsx                         # 메인 페이지
│   └── globals.css                      # 전역 스타일
├── components/
│   ├── LoginButton.tsx                  # 로그인 버튼
│   ├── UnitList.tsx                     # 단원 목록
│   └── FlashCardSection.tsx             # 암기 카드 섹션
├── data/
│   ├── units.ts                         # 단원 데이터
│   └── flashCards.ts                    # 암기 카드 데이터
└── types/
    └── index.ts                         # TypeScript 타입 정의
```

## 🎨 주요 컴포넌트

### LoginButton
- Google OAuth 로그인/로그아웃 처리
- 사용자 프로필 이미지 및 이름 표시
- 로딩 상태 관리

### UnitList
- 학습 단원 목록 표시
- 진행률 시각화
- 단원별 통계 정보

### FlashCardSection
- 인터랙티브 암기 카드
- 플립 애니메이션
- 정답/오답 처리

## 🚀 배포

### Vercel 배포
1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 환경 변수 설정 (Vercel 대시보드에서)
3. 자동 배포 완료

### 환경 변수 (배포용)
```env
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
```

## 🔧 개발 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
npm run lint         # ESLint 실행
npm run generate-favicons  # Favicon 생성
```

## 📱 반응형 디자인

- **데스크톱**: 최적화된 레이아웃
- **태블릿**: 적응형 그리드
- **모바일**: 터치 친화적 UI

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

## 데이터베이스 스키마

### Users 테이블
- 사용자 기본 정보 (ID, 이메일, 이름, 프로필 이미지)

### User Progress 테이블
- 사용자별 단원 진행률
- 정답 수, 시도 횟수, 마지막 학습 시간 등

### Study Sessions 테이블
- 학습 세션 기록
- 세션 타입, 정답 수, 학습 시간 등

## 주요 컴포넌트

- `AuthWrapper`: 로그인/로그아웃 버튼
- `UnitList`: 단원 목록 표시
- `FlashCardSection`: 플래시카드 학습 섹션
- `AuthService`: Supabase 데이터베이스 연동 서비스

## 달의 위상변화 3D 시뮬레이션

- **경로:** `/simulation/moon-phase-3d`
- **설명:** 태양-지구-달의 상대적 위치와 운동(공전, 자전)을 3D로 시각화하여 달의 위상변화를 입체적으로 관찰할 수 있습니다.
- **기능:**
  - three.js 기반 3D 씬에서 태양, 지구, 달 모델링 및 애니메이션
  - 달의 공전, 지구/달 자전, 궤도 표시
  - 태양빛 방향(추후 그림자/밤 영역 시각화 추가 예정)
  - 반응형 레이아웃, 한글 UI/설명 제공
- **추가 예정:**
  - 마우스 드래그로 시점 회전, 햇빛/밤 영역 명확한 시각화, 다국어 지원

---

### 개발/운영 규칙
- 시뮬레이션 타입, 데이터, 스타일 등은 기존 구조와 최대한 일관성 있게 작성
- 타입 파일은 `src/types` 폴더에 통합 관리
- CSS 단위는 dvh, dvw 사용, min-width 344px, max-width 1200px 준수
- 기능/규칙 추가 시 본 README에 반드시 기록
