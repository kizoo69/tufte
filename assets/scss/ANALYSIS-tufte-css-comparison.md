# 원본 tufte.css vs hugo-tufte tufte.scss 상세 비교

원본: https://github.com/edwardtufte/tufte-css

## 1. 파일 형식 변환

| 항목 | 원본 (tufte.css) | hugo-tufte (tufte.scss) |
|------|------------------|------------------------|
| 형식 | 순수 CSS | SCSS (Sass) |
| 변수 | 없음 (하드코딩) | SCSS 변수 사용 |
| 주석 | `/* */` only | `/* */` + `//` |

**이유**: SCSS로 변환하면 변수, 중첩, 믹스인 등을 사용할 수 있어 유지보수성이 향상됨

---

## 2. @font-face 선언

| 항목 | 원본 | hugo-tufte | 변경 이유 |
|------|------|------------|----------|
| `font-display` | `swap` 있음 | **없음** | 의도적 제거인지 누락인지 불명확 |
| 포맷 | 한 줄 | 여러 줄 포맷팅 | 가독성 향상 |
| 파일 형식 | eot, woff, ttf, svg | 동일 | - |

```css
/* 원본 - font-display: swap 포함 */
@font-face {
    font-family: "et-book";
    ...
    font-display: swap;  /* ← 원본에 있음 */
}
```

```scss
/* hugo-tufte - font-display 누락 */
@font-face {
    font-family: "et-book";
    ...
    /* font-display: swap 없음 */
}
```

**⚠️ 주의**: `font-display: swap` 누락은 FOIT(Flash of Invisible Text) 문제를 야기할 수 있음

---

## 3. 글꼴 변수 도입 (신규)

```scss
/* hugo-tufte에서 추가됨 (57-59행) */
$serif-fonts: et-book, "Noto Serif SC", Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif, "Noto Emoji";
$sans-fonts: "Gill Sans", "Gill Sans MT", Calibri, sans-serif, "Noto Emoji";
$mono-fonts: Consolas, "Liberation Mono", Menlo, Courier, monospace, "Noto Emoji";
```

| 항목 | 원본 | hugo-tufte |
|------|------|------------|
| serif | `et-book, Palatino, ... Georgia, serif` | `et-book, "Noto Serif SC", Palatino, ... "Noto Emoji"` |
| sans | `"Gill Sans", ... sans-serif` | 동일 + `"Noto Emoji"` |
| mono | `Consolas, ... monospace` | 동일 + `"Noto Emoji"` |

**변경 내용**:
- **Noto Serif SC** 추가: 중국어 간체 지원
- **Noto Emoji** 추가: 이모지 일관성 보장

**이유**: 다국어 지원 및 이모지 렌더링 일관성

---

## 4. body 스타일

```css
/* 원본 */
body {
    width: 87.5%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 12.5%;
    font-family: et-book, Palatino, ...;
    background-color: #fffff8;
    color: #111;
    max-width: 1400px;
    counter-reset: sidenote-counter;  /* ← 원본에 있음 */
}
```

```scss
/* hugo-tufte */
body {
    margin-left: auto;
    margin-right: auto;
    padding-left: 12.5%;
    font-family: $serif-fonts;
    background-color: #fffff8;
    color: #111;
    max-width: 1400px;
    /* width: 87.5% 제거됨 */
    /* counter-reset: sidenote-counter 제거됨 */
}
```

| 속성 | 원본 | hugo-tufte | 변경 이유 |
|------|------|------------|----------|
| `width: 87.5%` | ✅ | ❌ 제거 | 레이아웃 방식 변경 |
| `counter-reset: sidenote-counter` | ✅ | ❌ 제거 | Hugo shortcode가 번호 관리 |
| `font-family` | 하드코딩 | `$serif-fonts` 변수 | 유지보수성 |

**이유**:
- `width` 제거: `padding-left: 12.5%`만으로 레이아웃 제어
- `counter-reset` 제거: CSS counter 대신 Hugo의 `.Scratch`로 sidenote 번호 관리

---

## 5. 다크 모드 제거

```css
/* 원본에 있음, hugo-tufte에서 제거됨 */
@media (prefers-color-scheme: dark) {
    body {
        background-color: #151515;
        color: #ddd;
    }
}
```

**이유**: hugo-tufte는 다크 모드를 별도 시스템(`codeBlocksDark` 파라미터)으로 처리하거나, 사용자가 직접 구현하도록 남겨둠

---

## 6. 제목(h1, h2, h3) 스타일 통합

```css
/* 원본 - 개별 선언 */
h1 {
    font-weight: 400;
    margin-top: 4rem;
    margin-bottom: 1.5rem;
    font-size: 3.2rem;
    line-height: 1;
}

h2 {
    font-style: italic;
    font-weight: 400;
    margin-top: 2.1rem;
    margin-bottom: 1.4rem;  /* ← 원본 */
    font-size: 2.2rem;
    line-height: 1;
}

h3 {
    font-style: italic;
    font-weight: 400;
    font-size: 1.7rem;
    margin-top: 2rem;
    margin-bottom: 1.4rem;  /* ← 원본 */
    line-height: 1;
}
```

```scss
/* hugo-tufte - 공통 속성 통합 */
h1, h2, h3 {
    font-weight: 400;
    line-height: 1;
}

h1 {
    margin-top: 4rem;
    margin-bottom: 1.5rem;
    font-size: 3.2rem;
}

h2, h3 {
    font-style: italic;
    margin-bottom: 0;  /* ← 변경됨! */
}

h2 {
    margin-top: 2.1rem;
    font-size: 2.2rem;
}

h3 {
    font-size: 1.7rem;
    margin-top: 2rem;
}
```

| 속성 | 원본 | hugo-tufte | 변경 이유 |
|------|------|------------|----------|
| h2/h3 `margin-bottom` | `1.4rem` | `0` | 불명확 - 다음 요소의 `margin-top`에 의존하는 방식으로 변경한 것으로 추정. 원본 복원 검토 필요 |

---

## 7. 블로그용 클래스 추가 (신규)

### 7.1 작성자/날짜 메타 정보 스타일

```scss
/* hugo-tufte에서 추가 (tufte.scss 74-80행) */
.author, .date {
  font-size: 1.4rem;
  font-weight: 400;
  margin: 1rem auto 1rem 0;
  line-height: 1;
}
```

**사용처**: `layouts/partials/content.header.html`

```html
<!-- 개별 글 상단의 메타 정보 표시 -->
<span class="content-meta">
  {{- if .Params.author -}}
  <p class="author">{{ .Params.author }}</p>
  {{- end -}}

  {{- if not .Params.hidedate -}}
  <p class="date">{{ .Date.Format "2006-01-02" }}</p>
  {{- end -}}
  <!-- ... 읽기 시간, 태그 등 ... -->
</span>
```

**활성화 조건**: Front matter에서 `meta: true` 설정 필요

```yaml
---
title: "글 제목"
author: "홍길동"
date: 2025-12-10
meta: true        # ← 이 값이 true여야 author, date가 표시됨
hidedate: false   # ← true면 날짜 숨김
---
```

**추가 스타일**: `components/meta.scss`에서 `.content-meta .author` 추가 스타일 정의 가능

```scss
/* components/meta.scss */
.content-meta {
    display: block;
    font-size: 1.1rem;
    margin-top: 1em;
}

.content-meta .author {
    /* 추가 색상 등 커스터마이징 가능 */
}
```

**스타일 충돌 주의**: `tufte.scss`의 `.author, .date`와 `meta.scss`의 `.content-meta .author`가 중복 정의됨. `meta.scss`의 선택자가 더 구체적이므로 우선 적용됨.

---

### 7.2 홈페이지 글 목록 스타일

```scss
/* hugo-tufte에서 추가 (136-143행) */
.page-list .content-title {
    margin-top: 4.2rem;
    margin-bottom: 1.4rem;
}

.page-list .content-title:first-child {
    margin-top: 1.4rem;
}
```

**사용처**: `layouts/index.html` (홈페이지)

```html
<!-- 홈페이지의 최근 글 목록 -->
<section class="page-list">
{{ range (.Paginate $pgFilter).Pages }}
  <h2 class="content-title">
    <a href="{{ .RelPermalink }}">{{ .Title }}</a>
  </h2>
  {{ if .Description }}
  <p>{{ .Description }}</p>
  {{ end }}
{{ end }}
</section>
```

**동작**:
- 첫 번째 글 제목: `margin-top: 1.4rem` (상단 여백 최소화)
- 이후 글 제목: `margin-top: 4.2rem` (글 사이 충분한 간격)

**참고**: `layouts/_default/list.html`의 아카이브 페이지는 `.list-page` 클래스 사용 (다른 레이아웃)

---

### 7.3 관련 클래스 요약

| 클래스 | 사용 위치 | 용도 |
|--------|-----------|------|
| `.author` | content.header.html | 개별 글의 작성자 표시 |
| `.date` | content.header.html | 개별 글의 작성일 표시 |
| `.content-meta` | content.header.html | 메타 정보 컨테이너 |
| `.content-title` | content.header.html, index.html | 글 제목 (h1, h2) |
| `.page-list` | index.html | 홈페이지 글 목록 섹션 |
| `.list-page` | list.html | 아카이브 페이지 섹션 |
| `.list-date` | list.html | 아카이브의 날짜 (다른 형식: "Jan 2") |

**이유**: 원본 tufte-css는 정적 페이지용이므로 블로그 메타 정보 스타일이 없음. Hugo 테마로 변환하면서 블로그 기능에 필요한 클래스 추가

---

## 8. subtitle 선택자 변경

```css
/* 원본 */
p.subtitle { ... }
```

```scss
/* hugo-tufte */
.subtitle { ... }
```

**이유**: 불명확 - 실제 사이트에서는 `<p class="subtitle">`만 사용됨. 원본처럼 `p.subtitle`이 더 명시적

---

## 9. 하이픈 처리 추가 (신규)

```scss
/* hugo-tufte에서 추가 (158-162행) */
p {
    ...
    hyphens: auto;
    -webkit-hyphenate-limit-before: 3;
    -webkit-hyphenate-limit-after: 4;
    -ms-hyphenate-limit-chars: 10 3 4;
    hyphenate-limit-chars: 10 3 4;
}
```

**이유**: 긴 영어 단어의 자동 하이픈 처리로 텍스트 정렬 개선. 단어가 최소 10자 이상일 때, 앞 3자/뒤 4자 이상 남기고 분리

---

## 10. epigraph 선택자 변경

```css
/* 원본 */
div.epigraph { margin: 5em 0; }
div.epigraph > blockquote { ... }
```

```scss
/* hugo-tufte */
.epigraph { margin: 3em 0; }  /* 5em → 3em */
.epigraph > blockquote { ... }
```

| 속성 | 원본 | hugo-tufte |
|------|------|------------|
| 선택자 | `div.epigraph` | `.epigraph` |
| margin | `5em 0` | `3em 0` |

**이유**:
- 선택자 단순화 (더 유연)
- 마진 축소 (블로그 레이아웃에 맞게)

---

## 11. blockquote 스타일

```css
/* 원본 */
blockquote p {
    width: 55%;
    margin-right: 40px;
}

blockquote footer {
    width: 55%;
    font-size: 1.1rem;
    text-align: right;
}
```

```scss
/* hugo-tufte */
blockquote p {
    width: 50%;  /* 55% → 50% */
    /* margin-right 제거 */
}

blockquote footer {
    width: 50%;  /* 55% → 50% */
    font-size: 1.1rem;
    text-align: right !important;  /* !important 추가 */
}
```

**이유**:
- 너비 축소로 마진 영역 확보
- `!important`: 다른 스타일과의 충돌 방지

---

_## 12. 리스트 스타일

```css
/* 원본 */
section > dl,
section > ol,
section > ul {
    width: 50%;
    -webkit-padding-start: 5%;
}

dt:not(:first-child),
li:not(:first-child) {
    margin-top: 0.25rem;
}
```

```scss
/* hugo-tufte */
ol,
ul,
dl {
    width: 45%;  /* 50% → 45% */
    -webkit-padding-start: 5%;
    -webkit-padding-end: 5%;  /* 추가됨 */
}

li  ul {
    width: 100%;  /* 중첩 리스트 */
}

li,
dt, dd {
    padding: 0.5rem 0;  /* 0.25rem → 0.5rem */
}

dt {
    font-weight: 700;  /* 추가됨 */
}
```

| 항목 | 원본 | hugo-tufte | 변경 이유 |
|------|------|------------|----------|
| 선택자 | `section > ol` | `ol` | 모든 컨텍스트에서 적용 |
| 너비 | 50% | 45% | 마진 영역 확보 |
| padding-end | 없음 | 5% | 양쪽 패딩 균형 |
| li 간격 | 0.25rem | 0.5rem | 가독성 향상 |
| dt 굵기 | 없음 | 700 | 정의 목록 강조 |
| 중첩 리스트 | 없음 | 100% | 중첩 시 너비 유지 |_

---

## 13. figcaption margin 차이

```css
/* 원본 */
figcaption {
    float: right;
    clear: right;
    margin-top: 0;
    margin-bottom: 0;
    /* margin-right 없음 */
    ...
}
```

```scss
/* hugo-tufte */
figcaption {
    ...
    margin-right: -48%;  /* 원본에 없는 속성 */
    ...
}
```

**분석 오류 정정**: 원본에는 `figcaption`에 `margin-right`가 없음. 이전 분석의 `-60%`는 잘못된 정보

---

## 14. 링크 스타일 단순화

```css
/* 원본 */
a:link,
a:visited {
    color: inherit;
    text-underline-offset: 0.1em;
    text-decoration-thickness: 0.05em;
}
```

```scss
/* hugo-tufte */
a:link,
a:visited {
    color: inherit;
    /* underline 관련 속성 제거 */
}
```

**이유**: 밑줄 스타일을 별도로 처리하거나 브라우저 기본값 사용

---

## 15. sidenote 번호 처리 방식 완전 변경

```css
/* 원본 - CSS counter 사용 */
.sidenote-number {
    counter-increment: sidenote-counter;
}

.sidenote-number:after,
.sidenote:before {
    font-family: et-book-roman-old-style;
    position: relative;
    vertical-align: baseline;
}

.sidenote-number:after {
    content: counter(sidenote-counter);
    font-size: 1rem;
    top: -0.5rem;
    left: 0.1rem;
}

.sidenote:before {
    content: counter(sidenote-counter) " ";
    font-size: 1rem;
    top: -0.5rem;
}
```

```scss
/* hugo-tufte - Hugo Scratch 사용 */
.marginnote-ind,
.sidenote-number {
    // font-family: et-book-roman-old-style, "Noto Emoji";  /* 주석 처리 */
    position: relative;
    vertical-align: baseline;
    user-select: none;  /* 추가: 선택 방지 */
}

// note indicator
label.marginnote-ind,
label.sidenote-number {
    font-size: 1rem;
    top: -0.5rem;
    left: 0.1rem;
}

// inside sidenote
span.marginnote-ind,
span.sidenote-number {
    font-size: 1.1rem;
}
```

**핵심 차이점**:

| 항목 | 원본 | hugo-tufte |
|------|------|------------|
| 번호 생성 | CSS `counter()` | Hugo `.Scratch` |
| 번호 표시 | `::before`, `::after` pseudo | `<span>`, `<label>` 실제 요소 |
| 글꼴 | `et-book-roman-old-style` 강제 | 주석 처리 (상속) |
| 선택 | 기본값 | `user-select: none` |

**이유**:
- CSS counter는 정적 HTML에서만 작동
- Hugo shortcode로 동적 번호 관리 필요
- 번호를 실제 요소로 렌더링하여 더 많은 제어 가능

---

## 16. 너비 선언 방식

```css
/* 원본 */
section > p,
section > footer,
section > table {
    width: 55%;
}
```

```scss
/* hugo-tufte */
p,
footer,
table,
div.table-wrapper-small,
div.supertable-wrapper > p,
div.booktabs-wrapper {
    width: 55%;
}
```

**이유**: `section >` 제거로 모든 컨텍스트에 적용, 추가 래퍼 클래스 지원

---

## 17. table-wrapper 스크롤

```css
/* 원본 */
div.table-wrapper {
    overflow-x: auto;
    font-family: "Trebuchet MS", "Gill Sans", "Gill Sans MT", sans-serif;
}
```

```scss
/* hugo-tufte */
div.table-wrapper {
    overflow-x: scroll;  /* auto → scroll */
    font-family: "Trebuchet MS", "Gill Sans", "Gill Sans MT", sans-serif, "Noto Emoji";
}
```

**이유**:
- `scroll`: 항상 스크롤바 표시 (사용자 힌트)
- `Noto Emoji` 추가

---

## 18. 반응형: 첫 번째 미디어 쿼리 단순화

```css
/* 원본 */
@media (max-width: 760px) {
    body {
        width: 84%;
        padding-left: 8%;
        padding-right: 8%;
    }

    hr,
    section > p,
    section > footer,
    section > table {
        width: 100%;
    }

    pre > code {
        width: 97%;
    }

    section > dl,
    section > ol,
    section > ul {
        width: 90%;
    }

    /* ... 더 많은 규칙 ... */

    blockquote {
        margin-left: 1.5em;
        margin-right: 0em;
    }

    label {
        cursor: pointer;
    }

    /* ... */
}
```

```scss
/* hugo-tufte - 상당 부분 제거 */
@media screen and (max-width: 760px) {
    h2,
    h3,
    p,
    footer {
        width: 90%;
    }
    ul,
    ol,
    dl {
        width: 85%;
    }
    figure {
        max-width: 90%;
    }
    figcaption,
    figure.fullwidth figcaption {
        margin-right: 0%;
        max-width: none;
    }
    blockquote p,
    blockquote footer {
        width: 90%;
    }
}
```

**제거된 항목**:
- `body` 패딩 조정
- `hr`, `pre > code` 너비
- `blockquote` 마진
- `label { cursor: pointer }`

**이유**:
- body 스타일은 별도 처리
- 일부 규칙은 general.scss로 이동
- 단순화된 모바일 레이아웃

---

## 19. 코드 스타일

```css
/* 원본 */
code, pre > code {
    font-family: Consolas, ...;
    font-size: 1.0rem;
    line-height: 1.42;
    -webkit-text-size-adjust: 100%;
}

.sans > code {
    font-size: 1.2rem;
}

pre > code {
    font-size: 0.9rem;
    width: 52.5%;
    margin-left: 2.5%;
    overflow-x: auto;
    display: block;
}

pre.fullwidth > code {
    width: 90%;
}
```

```scss
/* hugo-tufte */
code,
.code,  /* 클래스 추가 */
kbd {   /* kbd 추가 */
    font-family: $mono-fonts;
    font-size: 1.125rem;  /* 1.0rem → 1.125rem */
    line-height: 1.42;
    /* -webkit-text-size-adjust 제거 */
}

h1 .code,
h2 .code,
h3 .code {
    font-size: 0.8em;
}

.marginnote .code,
.sidenote .code {
    font-size: 1rem;
}

pre.code {
    font-size: 0.9rem;
    width: 52.5%;
    padding-left: 2.5%;
    overflow-x: scroll;  /* auto → scroll */
}

/* pre.fullwidth > code 제거됨 */
/* .sans > code 제거됨 */
```

| 항목 | 원본 | hugo-tufte | 변경 이유 |
|------|------|------------|----------|
| 선택자 | `code` | `code, .code, kbd` | 더 넓은 적용 |
| 크기 | 1.0rem | 1.125rem | 가독성 향상 |
| iOS 조정 | 있음 | 제거 | 현대 브라우저 대응 |
| 제목 내 코드 | 없음 | 0.8em | 제목과 조화 |

---

## 20. margin-toggle 접근성 개선 (신규)

```css
/* 원본 */
input.margin-toggle {
    display: none;
}

label.sidenote-number {
    display: inline-block;
    max-height: 2rem;
}

label.margin-toggle:not(.sidenote-number) {
    display: none;
}
```

```scss
/* hugo-tufte - 접근성 강화 */
.margin-toggle {
    cursor: pointer;  /* 추가 */
}

// accessibility feature: make label focus-able
input.margin-toggle {
    position: absolute;
    outline: none;
    opacity: 0;
    width: 1px;
    height: 1px;
    margin-left: 5px;
    margin-top: 5px;
    z-index: -100;
}

label:has(+ input.margin-toggle:focus) {
  outline: medium auto currentColor;
  outline: medium auto invert;
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -3px;
}

label.sidenote-number {
    display: inline;  /* inline-block → inline */
    /* max-height 제거 */
}

label.marginnote-ind {
    display: none;
}
```

**핵심 개선**:
- `display: none` → 화면에서 숨기지만 접근 가능하게
- `:has()` 선택자로 포커스 상태 표시
- 키보드 탐색 지원

---

## 21. 비디오 스타일 추가 (신규)

```scss
/* hugo-tufte에서 추가 */
.video-container {
    width: 100%;
    margin-top: 1.4rem;
    margin-bottom: 1.4rem;
}

.video {
    width: 55%;
}

.video--16x9 {
    aspect-ratio: 16/9;
}

.video--4x3 {
    aspect-ratio: 4/3;
}
```

```css
/* 원본 - iframe 방식 */
.iframe-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    padding-top: 25px;
    height: 0;
}

.iframe-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

**차이점**:

| 항목 | 원본 | hugo-tufte |
|------|------|------------|
| 방식 | padding hack | `aspect-ratio` |
| 클래스 | `.iframe-wrapper` | `.video`, `.video--16x9` |
| 유연성 | 16:9 고정 | 16:9, 4:3 선택 |

**이유**: 현대 CSS `aspect-ratio` 속성 활용

---

## 22. 두 번째 반응형 미디어 쿼리 (모바일 sidenote)

```scss
/* hugo-tufte - 추가된 내용 */
@media (max-width: 760px) {
    /* ... sidenote/marginnote 토글 (원본과 유사) ... */

    pre.code {
        width: 90%;
        padding: 0;
    }

    .table-caption {
        display: block;
        float: right;
        clear: both;
        width: 98%;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        margin-left: 1%;
        margin-right: 1%;
        vertical-align: baseline;
        position: relative;
    }

    div.table-wrapper,
    table,
    table.booktabs {
        width: 85%;
    }

    div.table-wrapper {
        border-right: 1px solid #efefef;  /* 스크롤 힌트 */
    }

    img {
        width: 100%;
    }

    .video {
        width: 90%;
    }
}
```

**추가된 모바일 스타일**:
- `pre.code` 너비 조정
- `.table-caption` 블록 표시
- `table.booktabs` 지원
- 테이블 래퍼에 스크롤 힌트 (오른쪽 테두리)
- 비디오 너비

---

## 요약: 변경 유형별 분류

### A. SCSS 전환으로 인한 변경
- 글꼴 변수 도입 (`$serif-fonts`, `$sans-fonts`, `$mono-fonts`)
- `//` 주석 사용

### B. Hugo 통합을 위한 변경
- CSS counter 제거 → Hugo `.Scratch` 사용
- `.author`, `.date`, `.page-list` 클래스 추가
- sidenote/marginnote를 실제 HTML 요소로 렌더링

### C. 다국어 지원
- `Noto Serif SC` 추가 (중국어)
- `Noto Emoji` 추가 (이모지)
- 하이픈 처리 규칙

### D. 접근성 개선
- margin-toggle 키보드 탐색
- `user-select: none` 번호 선택 방지
- 포커스 아웃라인

### E. 현대 CSS 활용
- `aspect-ratio` (비디오)
- `:has()` 선택자 (포커스)

### F. 레이아웃 미세 조정
- 너비값 변경 (55% → 50%, 50% → 45% 등)
- 마진/패딩 조정
- 반응형 규칙 단순화

### G. 제거된 기능
- 다크 모드 미디어 쿼리
- `font-display: swap`
- 일부 원본 선택자 (`section >`, `div.epigraph`)

---

## 잠재적 문제점

1. **`font-display: swap` 누락**: FOIT 문제 발생 가능
2. **다크 모드 제거**: 시스템 설정 무시
3. **`counter-reset` 제거**: sidenote 번호가 Hugo에 완전히 의존
