---
title: "Hugo Tufte 테마 비교 분석"
date: 2025-12-04
draft: true
toc: true
---

세 Hugo Tufte 테마를 Tufte CSS 원본과 비교 분석한다.

## 테마 계보

```
edwardtufte/tufte-css (순수 CSS, 기준점)
        ↓
shawnohare/hugo-tufte (Hugo 적용 원본, unmaintained)
        ↓
slashformotion/hugo-tufte (1차 fork, v0.2.0까지)
        ↓
loikein/hugo-tufte (2차 fork, 현재 사용 중)
```

## 저장소 구조 비교

### shawnohare/hugo-tufte

```
├── layouts/
│   ├── _default/ (list, single, summary, terms)
│   ├── partials/ (14개)
│   └── shortcodes/ (10개)
├── static/css/
│   ├── tufte.css
│   ├── hugo-tufte.css
│   ├── hugo-tufte-override.css
│   └── et-book/ (글꼴 파일)
└── theme.toml
```

**특징:**
- CSS 파일 직접 포함 (SCSS 미사용)
- MathJax 지원
- 유지보수 중단됨

### slashformotion/hugo-tufte

```
├── layouts/
│   ├── _default/ (baseof.html 추가)
│   ├── partials/ (8개로 축소)
│   └── shortcodes/ (10개)
├── assets/scss/
│   ├── vendor/tufte.scss
│   ├── components/
│   ├── syntax/
│   └── hugo-tufte.scss
├── static/css/et-book/
└── go.mod
```

**주요 변경 (v0.1.0 ~ v0.2.0):**
- CSS → SCSS 전환
- `baseof.html` 도입 (Hugo 템플릿 상속)
- KaTeX 지원 추가
- Shortcode에 `markdownify` 적용
- Dark mode 지원 (CSS `prefers-color-scheme`)
- normalize.css CDN 사용
- 불필요한 partial 제거 (disqus, highlight 등)

### loikein/hugo-tufte

```
├── layouts/
│   ├── _default/ (render-heading.html 추가)
│   ├── book/ (신규 레이아웃)
│   ├── partials/ (button.html 추가)
│   └── shortcodes/ (14개)
├── assets/
│   ├── scss/
│   │   ├── tufte.scss (수정됨)
│   │   ├── hugo-tufte-options.scss (신규)
│   │   └── ...
│   └── latex-fix.js
├── static/css/et-book/
└── netlify.toml
```

**주요 변경:**
- SCSS 변수 도입 (`$serif-fonts`, `$sans-fonts`, `$mono-fonts`)
- CJK 글꼴 추가 (Noto Serif SC, Noto Emoji)
- Hyphenation 지원
- 접근성 개선 (label focus 가능)
- Sidenote 번호: CSS counter → Hugo Scratch 기반
- 추가 shortcode: `button`, `cols`, `youtube`
- `book` 레이아웃 추가
- `lang` 속성 지원
- Video container 지원
- 원본 링크 스타일(text-shadow) 제거

## Shortcode 비교

| Shortcode | shawnohare | slashformotion | loikein |
|-----------|------------|----------------|---------|
| blockquote | ✓ | ✓ (markdownify) | ✓ |
| cite | ✓ | ✓ | ✓ |
| div | ✓ | ✓ | ✓ |
| epigraph | ✓ | ✓ (markdownify) | ✓ |
| figure | ✓ | ✓ | ✓ (확장) |
| marginnote | ✓ | ✓ (markdownify) | ✓ (확장) |
| newthought | ✓ | ✓ (markdownify) | ✓ |
| section | ✓ | ✓ | ✓ |
| sidenote | ✓ | ✓ (markdownify) | ✓ (확장) |
| tag | ✓ | ✓ | ✓ |
| button | - | - | ✓ (신규) |
| cols | - | - | ✓ (신규) |
| youtube | - | - | ✓ (신규) |

### Sidenote 구현 비교

**shawnohare (원본 방식):**
```html
<label for="sidenote-{{.Page.File.UniqueID}}-{{ $sidenoteDomIdSuffix }}"
       class="margin-toggle sidenote-number"></label>
<input type="checkbox" id="..." class="margin-toggle"/>
<span class="sidenote">{{ .Inner }}</span>
```
- CSS counter로 번호 매김 (원본 Tufte CSS와 동일)
- 간결한 구현

**loikein (수정된 방식):**
```html
{{- $.Page.Scratch.Set "sidenoteCounter" (add . 1) -}}
<label for="sidenote-{{ $label }}" class="margin-toggle sidenote-number">
  ({{ $label }})
</label>
<input type="checkbox" id="sidenote-{{ $label }}" class="margin-toggle"/>
<span class="sidenote">
  <span class="sidenote-number">({{ $label }})</span>
  {{ .Inner | markdownify }}
</span>
```
- Hugo Scratch로 번호 관리
- 번호에 괄호 추가 `(1)`
- `lang` 속성 지원
- `markdownify` 적용

## Tufte CSS 원본 충실도 평가

| 항목 | 원본 CSS | shawnohare | slashformotion | loikein |
|------|----------|------------|----------------|---------|
| ET Book 글꼴 | ✓ | ✓ | ✓ | ✓ (+CJK) |
| 본문 폭 55% | ✓ | ✓ | ✓ | ✓ |
| 마진 폭 45% | ✓ | ✓ | ✓ | ✓ |
| Sidenote 번호 | CSS counter | CSS counter | CSS counter | Scratch |
| Marginnote 기호 | ⊕ | ⊕ | ⊕ | 설정 가능 |
| 링크 스타일 | text-shadow | text-shadow | text-shadow | 제거됨 |
| Dark mode | - | - | ✓ | - |
| 반응형 760px | ✓ | ✓ | ✓ | ✓ |
| Oldstyle figures | ✓ | ✓ | ✓ | △ (주석처리) |

### 점수 (10점 만점)

| 테마 | 원본 충실도 | 기능성 | 유지보수성 | 총점 |
|-----|------------|--------|-----------|------|
| shawnohare | 9 | 6 | 3 | 6.0 |
| slashformotion | 8 | 8 | 5 | 7.0 |
| loikein | 6 | 9 | 7 | 7.3 |

## 세부 분석

### shawnohare/hugo-tufte

**장점:**
- 원본 Tufte CSS에 가장 충실
- 구조가 단순함
- 원본 링크 스타일 유지

**단점:**
- 유지보수 중단
- SCSS 미지원 (커스터마이징 어려움)
- Hugo 최신 기능 미반영

### slashformotion/hugo-tufte

**장점:**
- SCSS 전환으로 커스터마이징 용이
- Dark mode 지원
- KaTeX 지원
- `baseof.html` 도입

**단점:**
- normalize.css CDN 의존
- 유지보수 활발하지 않음

### loikein/hugo-tufte

**장점:**
- 가장 활발히 유지보수됨
- CJK 지원 (한중일 글꼴)
- 접근성 개선
- 다양한 shortcode
- `book` 레이아웃

**단점:**
- 원본 Tufte CSS에서 많이 벗어남
- Sidenote 구현이 원본과 다름 (CSS counter 대신 Scratch)
- 링크 스타일 제거
- 복잡한 SCSS 구조

## CSS 주요 차이점

### 링크 스타일

**원본 Tufte CSS:**
```css
a:link {
    text-decoration: none;
    text-shadow: 0.03em 0 #fffff8, -0.03em 0 #fffff8, ...;
    background: linear-gradient(#333, #333);
    background-position: 0% 93%;
}
```
Descender를 피하는 밑줄을 text-shadow로 구현.

**loikein:**
```css
a:link, a:visited { color: inherit; }
/* 나머지 제거됨 */
```
text-shadow 기법 제거. Browser 기본 밑줄 사용.

### Sidenote 번호

**원본:**
```css
.sidenote-number { counter-increment: sidenote-counter; }
.sidenote-number:after { content: counter(sidenote-counter); }
```

**loikein:**
Hugo template에서 Scratch로 관리. CSS counter 미사용.

### 글꼴 fallback

**원본:**
```css
font-family: et-book, Palatino, "Palatino Linotype",
             "Palatino LT STD", "Book Antiqua", Georgia, serif;
```

**loikein:**
```scss
$serif-fonts: et-book, "Noto Serif SC", Palatino,
              "Palatino Linotype", "Palatino LT STD",
              "Book Antiqua", Georgia, serif, "Noto Emoji";
```
Noto Serif SC (중국어)와 Noto Emoji 추가.

## 권고안

### 베이스 테마 선정

**shawnohare/hugo-tufte**를 베이스로 권장:

1. **원본 충실도**: Tufte CSS 원본에 가장 가까움
2. **구조 단순성**: 불필요한 추상화 없음
3. **깨끗한 출발점**: 필요한 것만 추가하기 좋음

### 개선 방향

shawnohare를 기반으로 다음만 선택적으로 적용:

1. **SCSS 전환** (slashformotion에서)
2. **KaTeX 지원** (slashformotion에서)
3. **한글 글꼴 추가** (loikein 참고하되 단순화)
4. **markdownify** (slashformotion에서)

### 제외할 것

- Dark mode (불필요)
- Scratch 기반 sidenote 번호 (원본 CSS counter 유지)
- 과도한 shortcode (button, cols, youtube 등)
- book 레이아웃 (불필요)

## 참고 자료

- https://github.com/edwardtufte/tufte-css
- https://github.com/shawnohare/hugo-tufte
- https://github.com/slashformotion/hugo-tufte
- https://github.com/loikein/hugo-tufte
