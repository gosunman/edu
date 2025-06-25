# 과학 학습실 🧪

중학교 과학 교육을 위한 인터랙티브 학습 플랫폼입니다.

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
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** → **사용자 인증 정보**로 이동
4. **사용자 인증 정보 만들기** → **OAuth 2.0 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션** 선택
6. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발용)
   - `https://your-domain.com/api/auth/callback/google` (배포용)
7. 생성된 클라이언트 ID와 시크릿을 `.env.local`에 입력

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🛠️ 사용 기술

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js
- **Styling**: CSS3 (Custom)
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
