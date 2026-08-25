# tufte theme 구조 가이드

Hugo theme submodule. repo: https://github.com/kizoo69/tufte.git

## 디렉토리 구조

```
themes/tufte/
├── assets/
│   ├── js/
│   │   └── search.js                        # 검색 기능
│   ├── lib/mermaid/mermaid.min.js           # Mermaid 다이어그램 라이브러리
│   └── scss/
│       ├── main.scss                         # SCSS 진입점 (import 모음)
│       ├── general.scss                      # 전반적인 레이아웃/기본 스타일
│       ├── tufte.scss                        # Tufte CSS 핵심 스타일 (sidenote, marginnote 등)
│       ├── tufte-options.scss                # Tufte 커스텀 옵션
│       ├── _i18n.scss                        # 다국어 관련 스타일
│       ├── components/
│       │   ├── back-to-top.scss
│       │   ├── brand.scss                    # 사이트 브랜드/로고
│       │   ├── code-highlight.scss           # 코드 블록 하이라이트
│       │   ├── listings.scss                 # 글 목록 (list 페이지)
│       │   ├── meta.scss                     # 날짜·태그 등 메타 정보
│       │   ├── navigation.scss               # 네비게이션 바
│       │   ├── search.scss                   # 검색 UI
│       │   └── tabs.scss                     # tabs/tab shortcode 스타일
│       ├── fonts/
│       │   ├── ETBook.scss                   # ET Book 폰트 정의
│       │   ├── options.scss                  # 폰트 옵션 변수
│       │   └── variables.scss                # 폰트 관련 SCSS 변수
│       ├── pages/
│       │   └── footer.scss                   # 푸터 스타일
│       └── syntax/
│           ├── highlight-dark.scss           # 코드 하이라이트 (다크)
│           ├── highlight-light.scss          # 코드 하이라이트 (라이트)
│           ├── syntax-dark.scss
│           └── syntax-light.scss
│
├── layouts/
│   ├── _default/
│   │   ├── baseof.html                       # 최상위 base 템플릿
│   │   ├── single.html                       # 단일 글 페이지
│   │   ├── list.html                         # 글 목록 페이지
│   │   ├── summary.html                      # 목록 내 글 요약 partial
│   │   └── terms.html                        # 태그/카테고리 목록
│   ├── _default/_markup/
│   │   ├── render-codeblock-mermaid.html     # Mermaid 코드블록 렌더러
│   │   ├── render-heading.html               # 제목 렌더러
│   │   └── render-table.html                 # 표 렌더러
│   ├── book/
│   │   ├── all.html                          # book 타입: 전체 보기
│   │   ├── chapters.html                     # book 타입: 챕터 목록
│   │   └── volumes.html                      # book 타입: 볼륨 목록
│   ├── partials/
│   │   ├── brand.html                        # 헤더 브랜드 영역
│   │   ├── content.header.html               # 글 제목·메타 영역
│   │   ├── footer.html                       # 푸터
│   │   ├── header.html                       # 헤더 전체
│   │   ├── header-includes.html              # <head> 내 추가 include
│   │   ├── math.html                         # MathJax/KaTeX 로드
│   │   ├── search.html                       # 검색 UI partial
│   │   └── social.html                       # 소셜 링크
│   ├── shortcodes/
│   │   ├── blockquote.html                   # 인용 블록
│   │   ├── cite.html                         # 인용 출처
│   │   ├── cols.html                         # 다단 컬럼
│   │   ├── details.html                      # <details> 접기
│   │   ├── div.html                          # 범용 div wrapper
│   │   ├── epigraph.html                     # 에피그래프 (장 앞 인용구)
│   │   ├── figure.html                       # 이미지/캡션
│   │   ├── marginnote.html                   # Tufte margin note
│   │   ├── newthought.html                   # 단락 첫 강조 (small-caps)
│   │   ├── section.html                      # <section> wrapper
│   │   ├── sidenote.html                     # Tufte side note (번호 있음)
│   │   ├── tab.html                          # 탭 패널 (tabs 안에서 사용)
│   │   ├── tabs.html                         # 탭 컨테이너
│   │   └── tag.html                          # 인라인 태그 배지
│   ├── 404.html
│   ├── index.html                            # 홈페이지
│   ├── index.json                            # 검색 인덱스 템플릿
│   └── robots.txt
│
├── static/
│   ├── favicon.ico
│   └── fonts/et-book/                        # ET Book 웹폰트 (woff, ttf)
│
├── i18n/
│   ├── en.yaml
│   └── ko.yaml                               # 한국어 번역
│
└── theme.toml
```

## 자주 수정하는 파일

| 목적 | 파일 |
|------|------|
| 전체 레이아웃/여백 | `assets/scss/general.scss`, `assets/scss/tufte.scss` |
| 폰트 추가/변경 | `assets/scss/fonts/variables.scss`, `assets/scss/fonts/ETBook.scss` |
| 코드 블록 스타일 | `assets/scss/components/code-highlight.scss` |
| tabs shortcode 스타일 | `assets/scss/components/tabs.scss` |
| marginnote/sidenote | `layouts/shortcodes/marginnote.html`, `assets/scss/tufte.scss` |
| 글 헤더(제목·날짜) | `layouts/partials/content.header.html` |
| 헤더/네비게이션 | `layouts/partials/header.html`, `assets/scss/components/navigation.scss` |
| 홈페이지 | `layouts/index.html` |
| 글 목록 | `layouts/_default/list.html`, `assets/scss/components/listings.scss` |
| 다국어 문자열 | `i18n/ko.yaml` |

## 사이트 오버라이드 위치

Hugo는 `themes/tufte/` 파일보다 루트 `layouts/`를 우선한다.
theme 파일을 직접 고치는 대신 루트에 같은 경로로 복사해 오버라이드하는 것이 원칙.
단, 이 theme은 fork이므로 직접 수정 후 commit/push 해도 무방.
