# Campick Project – Portfolio & Project Management
- 과정명: 프로젝트기반 프론트엔드 개발자 양성 (Figma / React / Next.js / Supabase / MySQL / ChatGPT)
- 기간: 2025/03/24 ~ 2025/09/24
- 3차 프로젝트: 2025/08/27 ~ 2025/09/19

## 🔗 빠른 링크
- 📑 기획서(피그마 슬라이드): https://www.figma.com/slides/zK4M9g6HWJUNBgfIf2RMCg/%EC%82%BC%EC%82%BC%EC%82%BC?node-id=319-280&t=jhaIZb9Eq8hirOd7-1
- 🎨 디자인 원본(피그마): https://www.figma.com/design/bvrnIg5RzhsIGNqnQJF3Kf/%EC%82%BC%EC%82%BC%EC%82%BC?node-id=0-1&t=sbNQW62e4b4skIbE-1

---

## 1. 프로젝트 개요

### 1.1 목표
- **프로젝트/포트폴리오 관리**: 사용자에게는 프로젝트 열람, 관리자에게는 등록·수정·삭제 기능 제공  
- **실서비스형 구현**: Next.js(App Router)와 Supabase(Auth, DB, Storage)를 활용해 CRUD + 인증 시스템 구성  
- **협업 효율성**: GitHub Actions + Vercel CI/CD, 팀원 간 코드리뷰/컨벤션 일관성 유지  
- **배포 경험**: Vercel 프로덕션 배포 및 자동화 테스트 적용  

### 1.2 👥 팀원
| 이름 | 역할 | 주요 담당 | GitHub |
| --- | --- | --- | --- |
| 김영태 | 팀원 · FE 개발 | 레이아웃/컴포넌트, Auth/CRUD, 코드리뷰 | [@kyt0830](https://github.com/kyt0830) |
| A | 팀장 · 기획/BE | 아키텍처 설계, Supabase 정책, CI/CD | - |
| B | FE · UI/디자인 | 디자인 시스템, 반응형, 이미지 최적화 | - |

### 1.3 🗓️ 마일스톤
- **1주차 – 기획/설계**: IA/요구사항 정의, Figma 디자인, DB 스키마 및 RLS 설계  
- **2주차 – 구현(핵심)**: 프로젝트 CRUD, Auth 로그인/관리자 기능, 이미지 업로드  
- **3주차 – 품질/운영**: SEO·OG, 성능 최적화, 접근성 테스트, E2E 자동화  
- **4주차 – 배포/정리**: GitHub Actions CI/CD, Vercel 배포, 문서화  

### 1.4 주요 기능
- 관리자 로그인 (Supabase Auth)  
- 프로젝트 CRUD (등록/수정/삭제)  
- Supabase Storage 이미지 업로드 + 썸네일 구분  
- 검색/필터링, 페이지네이션/무한스크롤  
- 반응형 UI, SEO/OG 자동 생성  

---

## 2. 개발 환경 및 배포

### 2.1 개발 스택
- **Frontend**: Next.js 15(App Router), React, TypeScript, Tailwind CSS  
- **Backend (BaaS)**: Supabase(PostgreSQL, Auth, Storage)  
- **CI/CD & 배포**: GitHub Actions + Vercel  
- **Design**: Figma  

### 2.2 배포 URL
- **Production**: https://campick.vercel.app  

### 2.3 📚 개발 컨벤션
- HTML/CSS/JS 컨벤션: `docs/guide_html.md`, `docs/guide_css.md`, `docs/guide_js.md`  
- Git 커밋 메시지: `feat/`, `fix/`, `refactor/`, `docs/` prefix 사용  
- 코드 리뷰: PR 단위 리뷰, ESLint/Prettier 적용  

---

## 3. 폴더구조
```
campick_project/
├─ public/
├─ src/
│  ├─ app/                 # App Router (layout, page 등)
│  ├─ components/          # UI 컴포넌트
│  ├─ lib/                 # Supabase client 등
│  ├─ styles/              # Tailwind 및 글로벌 스타일
│  └─ utils/               # 유틸 함수
├─ .env.example
├─ next.config.mjs
└─ package.json
```

---

## 4. 향후 개선 사항
- Contact 폼 + Edge Functions 메일 발송  
- 이미지 업로드 시 썸네일 자동 생성  
- 다국어(i18n) 지원  
- 성능 최적화(Lighthouse 90점 이상 목표)  

---

## 5. 실행 방법
```bash
# 1. 클론
git clone https://github.com/kyt0830/campick_project.git
cd campick_project

# 2. 패키지 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local
# Supabase URL/KEY 등 입력

# 4. 로컬 실행
npm run dev
```

---

## 6. 제작 후기
- Next.js + Supabase 기반 풀스택 프로젝트 경험  
- 인증/스토리지/DB 통합 활용법 습득  
- GitHub Actions + Vercel CI/CD 자동화로 실제 서비스 운영 경험 강화  

---

## 7. 기획/디자인 문서
- **기획서**: https://www.figma.com/file/XXXX  
- **디자인 원본**: https://www.figma.com/file/YYYY  

---

## 8. 미리보기
[![사이트 미리보기](./public/readme/preview.png)](https://campick.vercel.app "사이트 보기")

---

## 9. 버전 메모
- v1.0 (2025-08-27): Next.js + Supabase 초기 구조 세팅  
- v1.1 (2025-09-10): CRUD 및 Auth 기능 구현  
