# Hugo Tufte 테마 작업 기록 (Main 브랜치)

## 배경

**목표**: loikein fork의 hugo-tufte 테마를 Edward Tufte의 원본 tufte-css에 가깝게 복원

**참고 자료**:
- 원본 tufte-css: https://github.com/edwardtufte/tufte-css
- loikein fork: https://github.com/loikein/hugo-tufte
- 분석 문서: `themes/tufte/assets/scss/ANALYSIS-tufte-css-comparison.md`

---

## 진행 이력

### 1단계: loikein fork 도입 및 초기 버그 수정

Hugo override만으로 작업 (테마 파일 직접 수정 없이):

- [x] infinite loop/stack overflow 버그 수정
  - `header.includes.html` → `header-includes.html` (partial 파일명)
- [x] deprecated Hugo API 관련 버그 수정
  - CSS, Sass 관련 경고 해결

### 2단계: 테마 분석 및 계획 수립

- [x] 1차 시도: shawnohare/slashformotion/loikein fork 비교 분석
  - 결과: 새 레포지토리 설정이 복잡해져 중단
  - 산출물: 블로그 기록만 유효
- [x] 2차 시도: main 브랜치에서 loikein fork 직접 수정
  - [x] 새 fork 생성: `kizoo69/tufte`
  - [x] 글꼴 custom 구조 개선
  - [x] CSS 분석 문서 작성: `ANALYSIS-tufte-css-comparison.md`

### 3단계: tufte-css 원본 복원 작업 (완료)

- [x] `.author`, `.date` 스타일을 `meta.scss`로 이동 (12/11)
  - 선택자를 `.content-meta .author`로 범위 한정
- [x] sidenote CSS counter 방식으로 전환
  - Hugo Scratch 대신 원본 tufte-css의 CSS counter 사용
  - `body { counter-reset: sidenote-counter }` 복원
  - `sidenote.html` shortcode 수정: `.Ordinal`로 ID만 생성
- [x] epigraph shortcode 원본 구조에 맞게 수정
- [x] h2/h3 `margin-bottom: 1.4rem` 복원 (원본 값)
- [x] 760px 미디어 쿼리 원본 복원 (12/13)
  - body 패딩 (84%, 8%), blockquote 마진, label cursor
- [x] 코드 스타일 원본 복원 (12/13)
  - font-size 1.0rem, overflow-x: auto, .sans > code, pre.fullwidth > code
- [x] table-wrapper overflow-x: auto 복원 (12/13)

---

## 해결된 버그

### Sidenote CSS Counter 리셋 문제 (12/12 해결)

**증상**: sidenote 번호가 `<p>` 태그 경계에서 리셋됨 (예: 1, 2, 3, 1)

**원인**: KaTeX CSS가 `body`의 `counter-reset`을 덮어씀
```javascript
// 브라우저 콘솔에서 확인
getComputedStyle(document.body).counterReset
// 기대값: "sidenote-counter 0"
// 실제값: "katexEqnNo 0 mmlEqnNo 0"
```

**해결**: MathJax 3로 전환하여 충돌 제거

---

## TODO

### 우선순위 높음

- [x] **MathJax 3 전환** (12/12 완료)
  - KaTeX 제거, MathJax 3 적용
  - CDN 기본 + 로컬 복사본 fallback (`static/lib/mathjax/`)
  - `skipHtmlTags`에서 `code` 제거 (원본 hugo-tufte 방식)

- [x] **sidenote counter 버그 수정** (12/12 완료)
  - KaTeX 제거로 해결됨
  - 원인: KaTeX가 `body`의 `counter-reset`을 덮어씀

### 우선순위 중간

- [ ] **meta 플래그 기본값 개선**
  - 현재: `meta: true` 명시해야 author/date 표시
  - 개선안: 기본값 `true`, `copyrightHolder`를 author fallback으로 연결
  - 관련 파일: `layouts/partials/content.header.html`

- [x] **font-display: swap 복원** (이미 완료)
  - `_ETBook.scss`: 4개 @font-face 모두 적용됨
  - `header-includes.html`: Google Fonts에도 적용됨

- [ ] **다크 모드 복원 검토**
  - 원본에 있던 `@media (prefers-color-scheme: dark)` 제거됨

### CSS 스타일 검토 완료 (ANALYSIS 문서 기준, 12/12 확인)

- [x] **body width: 87.5%** - `tufte.scss:36`에 복원됨
- [x] **p.subtitle 선택자** - `tufte.scss:74`에 `p.subtitle`로 복원됨
- [x] **epigraph margin** - `tufte.scss:118`에 `5em` 복원됨
- [x] **blockquote 스타일** - `tufte.scss:142-143`에 `55%`, `margin-right: 40px` 복원됨
- [x] **리스트 스타일** - `tufte.scss:156`에 원본 값(`50%`, `0.25rem`) 유지
- [x] **링크 밑줄 스타일** - `tufte.scss:197-198`에 복원됨
- [x] **h2 margin-top** - `tufte.scss:59`에 `2.1rem`, `general.scss`의 `5.5rem`은 주석 처리됨

### 우선순위 낮음

- [x] tufte 브랜치에서 블로그 글 가져오기 (12/12 완료)
- [ ] 불필요한 shortcode/partial 제거
- [x] 테마 README.md 정리 (12/12, 12/13 업데이트)
- [x] 변경 이력 문서화 (README에 정리 완료)

---

## 분석 문서 참고

### tufte-css vs hugo-tufte 주요 차이점 (ANALYSIS 문서 요약)

| 항목 | 원본 tufte-css | loikein hugo-tufte |
|------|---------------|-------------------|
| sidenote 번호 | CSS counter | Hugo Scratch |
| font-display | swap | 누락 |
| 다크 모드 | 있음 | 제거 |
| h2/h3 margin-bottom | 1.4rem | 0 |
| body width | 87.5% | 제거 |

### 복원 완료 항목

- [x] sidenote CSS counter 방식
- [x] h2/h3 margin-bottom: 1.4rem
- [x] .author/.date 선택자 범위 한정

### ANALYSIS 문서 검토 완료 (12/13)

모든 섹션(1-22) 검토 완료. 복원이 필요한 항목은 모두 처리됨.
hugo-tufte 개선 사항(접근성, 현대 CSS 등)은 유지.

**남은 선택적 항목**:
- [ ] 다크 모드 복원 (원본에 있었으나 hugo-tufte에서 제거됨)

---

## 블로그 기록

- `/log/2025/12/12/`: CSS counter 버그 디버깅 기록 (draft)
