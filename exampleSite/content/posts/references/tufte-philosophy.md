---
title: "Tufte 타이포그래피 철학"
date: 2025-12-04
draft: true
toc: true
---

Edward Tufte의 타이포그래피 철학과 Tufte CSS (Cascading Style Sheets)의 핵심 원칙을 정리한다.

## ET Book 글꼴

### 역사와 설계 의도

ET Book은 Dmitry Krasny, Bonnie Scranton, Edward Tufte가 설계한 Bembo 계열 글꼴이다. Monotype Bembo를 디지털화하면 납활자 인쇄 시 잉크가 번지는 효과가 사라져 글자가 가늘고 빈약해지는 문제가 있었다. ET Book은 이 문제를 해결하기 위해 만들어졌다.

### 글꼴 구성

ET Book은 5개의 글꼴 파일로 구성된다:

| 글꼴 | 용도 |
|-----|-----|
| Roman (lining figures) | 기본 본문 |
| Roman (oldstyle figures) | 본문 내 숫자 |
| Semi-bold (oldstyle figures) | 강조 |
| Bold (lining figures) | 제목 등 강한 강조 |
| Display Italic (oldstyle figures) | 기울임체 |

**Oldstyle figures**는 소문자처럼 baseline 아래로 내려가는 숫자(3, 4, 5, 7, 9)가 있어 본문에 자연스럽게 어우러진다. **Lining figures**는 모든 숫자가 같은 높이로, 표나 제목에 적합하다.

### 대체 글꼴 (fallback)

ET Book을 사용할 수 없을 때 Tufte CSS는 다음 순서로 대체한다:
```
et-book, Palatino, "Palatino Linotype", "Palatino LT STD",
"Book Antiqua", Georgia, serif
```

## Tufte CSS 핵심 원칙

### 본문 폭과 마진 비율

```css
body {
    width: 87.5%;
    padding-left: 12.5%;
    max-width: 1400px;
}

p, footer, table { width: 55%; }

.sidenote, .marginnote {
    margin-right: -60%;
    width: 50%;
}
```

- 본문 영역: 55%
- 마진 영역: 약 45%
- 이 비율은 본문을 읽으면서 주석을 함께 볼 수 있도록 설계됨

### 색상 철학

```css
background-color: #fffff8;  /* off-white */
color: #111;                /* off-black */
```

순수한 흰색(#ffffff)과 검은색(#000000)의 강한 대비를 피하고, 눈의 피로를 줄이는 부드러운 색상 조합을 사용한다.

### 기본 글꼴 크기

```css
html { font-size: 15px; }
p { font-size: 1.4rem; line-height: 2rem; }
```

- 기본 크기: 15px
- 본문 크기: 21px (1.4rem)
- 줄 간격: 30px (2rem)

## Sidenote와 Marginnote

Tufte의 가장 특징적인 요소로, 각주(footnote)를 페이지 하단이 아닌 마진에 배치한다.

### Sidenote

- 본문에 **번호**가 표시됨 (superscript)
- 마진에 같은 번호와 함께 내용 표시
- CSS `counter`로 자동 번호 매김

```html
<label class="margin-toggle sidenote-number"></label>
<input type="checkbox" class="margin-toggle"/>
<span class="sidenote">주석 내용</span>
```

### Marginnote

- 번호 없음
- 대신 ⊕ 기호(&#8853;)로 표시
- 본문과 직접 연결되지 않는 보충 정보에 사용

```html
<label class="margin-toggle">&#8853;</label>
<input type="checkbox" class="margin-toggle"/>
<span class="marginnote">보충 내용</span>
```

### 반응형 처리

좁은 화면(760px 이하)에서는 sidenote/marginnote가 숨겨지고, toggle을 누르면 본문 아래에 펼쳐진다:

```css
@media (max-width: 760px) {
    .sidenote, .marginnote { display: none; }
    .margin-toggle:checked + .sidenote,
    .margin-toggle:checked + .marginnote {
        display: block;
        float: left;
        width: 95%;
        margin: 1rem 2.5%;
    }
}
```

## 그림 배치

### 기본 그림 (main column)

```css
figure { max-width: 55%; }
figcaption {
    float: right;
    margin-right: -48%;
    max-width: 40%;
}
```

그림은 본문 영역에, caption은 마진 영역에 배치한다.

### Margin figure

그림 자체를 마진에 배치. 작은 도표나 참고 이미지에 적합.

### Full-width figure

```css
.fullwidth { max-width: 90%; }
```

본문과 마진을 모두 사용하는 넓은 그림.

## Epigraph

장(chapter) 시작에 인용문을 배치하는 방식:

```css
div.epigraph { margin: 5em 0; }
div.epigraph > blockquote { font-style: italic; }
div.epigraph > blockquote > footer { font-style: normal; }
```

인용문은 기울임체, 출처는 정체(roman)로 구분한다.

## 링크 스타일링

Tufte CSS의 독특한 링크 스타일:

```css
a:link, a:visited { color: inherit; }
```

링크 색상을 본문과 동일하게 유지하고, 밑줄만으로 구분한다. 파란색 링크가 문장의 흐름을 방해한다는 철학에 기반한다.

### Descender를 피하는 밑줄

일반적인 밑줄(`text-decoration: underline`)은 g, y, p, q, j 같은 글자의 descender(baseline 아래로 내려가는 꼬리)를 가로질러 지나간다:

```
일반:    gyp     ← descender가 밑줄에 묻힘
         ━━━
```

Tufte CSS는 descender 주변에서 밑줄이 끊기도록 구현한다:

```
Tufte:   gyp     ← descender 주변이 끊김
         ━ ━
```

글자의 꼬리가 밑줄에 가려지지 않아 가독성이 높아진다.

### 구현 원리

```css
a:link {
    /* 1. 밑줄을 gradient로 그림 */
    background: linear-gradient(#333, #333);
    background-position: 0% 93%;

    /* 2. 글자 주변에 배경색 그림자로 밑줄을 가림 */
    text-shadow:
        0.03em 0 #fffff8,   /* 오른쪽 */
        -0.03em 0 #fffff8,  /* 왼쪽 */
        0 0.03em #fffff8,   /* 아래 */
        ...
}
```

밑줄을 background로 그리고, 글자 주변에 배경색과 같은 색의 text-shadow를 넣어서 descender 부분의 밑줄을 "지우는" 방식이다.

### 현대적 대안

현재는 CSS가 발전해서 더 간단한 방법이 있다:

```css
a:link {
    text-decoration: underline;
    text-underline-offset: 0.1em;      /* 밑줄 위치 조정 */
    text-decoration-thickness: 0.05em; /* 밑줄 두께 */
    text-decoration-skip-ink: auto;    /* descender 자동 회피 */
}
```

`text-decoration-skip-ink: auto`가 text-shadow 기법과 같은 효과를 browser가 자동으로 처리한다. 대부분의 현대 browser에서 지원된다.

## 코드 블록

```css
code, .code {
    font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 1.0rem;
    line-height: 1.42;
}
```

GitHub의 monospace 글꼴 스택을 따른다.

## 한글 적용 시 고려사항

### 글꼴 선택

ET Book은 라틴 문자 전용이므로 한글 글꼴과 조합해야 한다:

```scss
$serif-fonts: et-book, "Noto Serif KR", Palatino, Georgia, serif;
```

한글 본문용으로는 명조 계열(Noto Serif KR, 본명조 등)이 ET Book과 어울린다.

### Hyphenation

영문에서는 `hyphens: auto`로 자동 하이픈 처리가 가능하지만, 한글에는 적용되지 않는다. 한글 줄바꿈은 `word-break: keep-all`로 어절 단위 처리가 적절하다.

### 숫자 스타일

한글 문서에서 oldstyle figures가 어색할 수 있다. 문맥에 따라 lining figures 사용을 고려한다.

## 참고 자료

- https://edwardtufte.github.io/tufte-css/ - Tufte CSS 공식 문서
- https://edwardtufte.github.io/et-book/ - ET Book 글꼴
- https://github.com/edwardtufte/tufte-css - Tufte CSS 소스
