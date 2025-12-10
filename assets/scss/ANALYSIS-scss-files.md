# themes/tufte/assets/scss/ 파일 역할 정리

## 진입점

| 파일 | 역할 |
|------|------|
| **hugo-tufte.scss** | 메인 진입점. 모든 SCSS를 import하고 Hugo 템플릿 구문 포함 (`{{ if ... }}`) |
| **hugo-tufte-options.scss** | 조건부 스타일. `sansSubtitle`, `centerArticle` 파라미터에 따라 스타일 변경 |

## 핵심 스타일

| 파일 | 역할 | 주요 내용 |
|------|------|----------|
| **tufte.scss** | 원본 Tufte CSS | @font-face (ET Book 4종), 글꼴 변수 정의, 본문 타이포그래피, sidenote/marginnote, 반응형 (760px), `.newthought`, `.sans` |
| **general.scss** | Hugo 확장 스타일 | 선택/포커스 스타일, heading anchor, hr, kbd, mark, 목록 페이지, 테이블, 각주, 수식, 측주 간격, 컬럼 그리드 (`.row`/`.column`), 버튼, **i18n** (zh/ja 글꼴 크기) |

## 컴포넌트 (components/)

| 파일 | 역할 | 주요 내용 |
|------|------|----------|
| **brand.scss** | 브랜드 영역 | `.brand` padding만 (5줄) |
| **code-highlight.scss** | 코드 블록 레이아웃 | `.highlight` 너비 50%, 스크롤, 줄번호 테이블, 하이라이트 줄 표시 (`>`), 반응형 |
| **meta.scss** | 메타 정보 | `.content-meta` (작성자, 날짜), `.post-avatar` |
| **nav.scss** | 네비게이션 | `.menu` 가로 목록, 대문자 링크 |
| **toc.scss** | 목차 | `details`/`summary` 스타일, `.toc` 목록 |

## 페이지 (pages/)

| 파일 | 역할 | 주요 내용 |
|------|------|----------|
| **footer.scss** | 푸터 | `footer.page-footer` 스타일, 링크, 메뉴 |

## 문법 하이라이팅 (syntax/)

| 파일 | 역할 | 주요 내용 |
|------|------|----------|
| **highlight-light.scss** | 라이트 테마 래퍼 | `$ht-code-bgcolor: #dde2ff` → syntax-light 임포트 |
| **highlight-dark.scss** | 다크 테마 래퍼 | `$ht-code-bgcolor: #282a36` → syntax-dark 임포트 |
| **syntax-light.scss** | 라이트 색상 정의 | GitHub 스타일 색상 (`.highlight .k`, `.c` 등) |
| **syntax-dark.scss** | 다크 색상 정의 | Dracula 테마 색상 |

---

## 의존 관계 다이어그램

```
hugo-tufte.scss (진입점)
│
├─ @import "tufte"
│   └─ 글꼴 변수: $serif-fonts, $sans-fonts, $mono-fonts
│   └─ @font-face: et-book (4종)
│   └─ 본문, 제목, sidenote, marginnote, figure
│
├─ @import "general"
│   └─ Hugo 확장, 테이블, 각주, 컬럼, i18n
│
├─ @import "pages/footer"
│
├─ @import "components/*"
│   ├─ code-highlight (코드 블록 레이아웃)
│   ├─ toc, nav, brand, meta
│
└─ {{ if codeBlocksDark }}
    ├─ @import "syntax/highlight-dark"
    │   └─ @import "syntax-dark" (Dracula)
    └─ @import "syntax/highlight-light"
        └─ @import "syntax-light" (GitHub)


hugo-tufte-options.scss (조건부)
│
└─ {{ if sansSubtitle }} → h2, h3 sans-serif
```

---

## 글꼴 커스터마이징 관련 핵심 포인트

1. **글꼴 변수 위치**: `tufte.scss:57-59` - 하드코딩됨
2. **@font-face 위치**: `tufte.scss:8-55` - ET Book만 정의
3. **i18n 글꼴 크기**: `general.scss:260-275` - zh/ja만, **ko 없음**
4. **옵션 시스템**: `hugo-tufte-options.scss` - Hugo 템플릿 구문으로 조건부 CSS
