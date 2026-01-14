# 다국어 정적 웹 검색 구현 계획 (Tufte Theme 철학 기반)

이 문서는 Tufte 테마의 철학(데이터 중심, 미니멀리즘, 높은 가독성)을 유지하면서 정적 웹사이트에 알맞은 다국어 검색 기능을 구현하기 위한 상세 계획입니다.

## 1. 철학 및 목표 (Philosophy)

*   **Content-First:** 검색 UI가 콘텐츠 읽기를 방해해서는 안 됩니다. 거대한 검색바 대신 미니멀한 아이콘이나 단축키(`/`)로 접근하도록 합니다.
*   **Speed & Static:** 별도의 백엔드 서버 없이 클라이언트 사이드에서 즉각적으로 동작해야 합니다.
*   **Context:** 검색 결과는 단순한 링크 나열이 아니라, 해당 키워드가 포함된 문맥(KWIC: Key Word In Context)을 보여주어 사용자가 클릭 전 내용을 파악할 수 있어야 합니다.
*   **Multilingual:** 다국어 콘텐츠가 섞이지 않고, 사용자가 보고 있는 언어의 문맥에 맞는 결과를 우선하거나 필터링해야 합니다.

## 2. 기술 스택 (Technology Recommendation)

**Pagefind** (https://pagefind.app/) 사용을 권장합니다.
*   **이유:**
    *   Hugo, Jekyll 등 정적 사이트 생성기와 완벽하게 호환됩니다.
    *   빌드 후 생성된 정적 HTML 파일을 인덱싱하므로 테마 구조에 의존하지 않습니다.
    *   다국어 지원이 강력합니다 (HTML의 `lang` 속성을 자동으로 인식).
    *   매우 가볍고 빠르며, 사용자의 브라우저 리소스를 최소화합니다.

## 3. 구현 단계 (Implementation Steps)

### A. 사전 준비 (Prerequisites)
1.  프로젝트 루트에 `pagefind` 설치 (NPM 또는 Binary).
    ```bash
    npm install pagefind
    # 또는
    npx pagefind --help
    ```

### B. 빌드 파이프라인 수정 (Build Process)
Hugo 빌드 후 Pagefind가 `public` 폴더를 스캔하여 인덱스를 생성하도록 스크립트를 수정합니다.

```bash
# 예: package.json script 또는 Makefile
hugo
npx pagefind --site public
```

### C. UI 구현 (User Interface)
Tufte 스타일의 미니멀한 검색 UI를 추가합니다.

1.  **HTML 구조 (`layouts/partials/search.html`):**
    ```html
    <div id="search-wrapper">
      <div id="search"></div>
    </div>
    <!-- Pagefind JS/CSS 로드 -->
    <link href="/pagefind/pagefind-ui.css" rel="stylesheet">
    <script src="/pagefind/pagefind-ui.js"></script>
    ```

2.  **초기화 스크립트:**
    ```javascript
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({
            element: "#search",
            showSubResults: true,
            translations: {
                placeholder: "Search...", // 다국어 변수 처리 필요
                zero_results: "No results found for [SEARCH_TERM]"
            }
        });
    });
    ```

3.  **위치 선정:**
    *   사이드바(Sidebar) 최상단 혹은 푸터(Footer)에 작게 배치하거나,
    *   우측 상단에 돋보기 아이콘을 두고 클릭 시 모달(Modal)로 뜨도록 구현합니다 (Tufte 스타일 권장: 모달 방식이 본문 가독성을 해치지 않음).

### D. 다국어 처리 (Multilingual Support)

Hugo의 다국어 설정(`config.toml`)에 따라 각 페이지 `<html>` 태그에 `lang` 속성이 정확한지 확인합니다.

1.  **인덱싱:** Pagefind는 자동으로 `lang="ko"`, `lang="en"`을 구분하여 인덱싱합니다.
2.  **검색 필터링:**
    현재 페이지의 언어에 맞춰 검색 결과를 필터링하도록 설정할 수 있습니다.
    ```javascript
    // 현재 페이지의 lang 속성 가져오기
    const currentLang = document.documentElement.lang || "en";

    new PagefindUI({
        element: "#search",
        // 특정 언어로 결과 필터링 (선택 사항)
        // 만약 모든 언어를 다 보여주되 구분하고 싶다면 필터 설정을 조정합니다.
    });
    ```
    *참고: Pagefind는 기본적으로 검색어가 포함된 모든 언어의 문서를 찾지만, 언어별 필터를 UI에 자동으로 생성해줍니다.*

### E. 스타일링 (Styling for Tufte)
기본 Pagefind UI는 다소 일반적이므로, Tufte CSS(`tufte.css`)와 어울리도록 커스터마이징이 필요합니다.

*   **Font:** 본문 폰트(`et-book` 등)와 일치시킵니다.
*   **Colors:** Tufte의 배경색(`cream` or `white`)과 텍스트 색상을 상속받도록 CSS 변수를 오버라이드합니다.
*   **Marking:** 검색된 키워드 하이라이트 색상을 너무 튀지 않는 형광펜 색상(예: 연한 노랑)으로 조정합니다.

```css
:root {
    --pagefind-ui-scale: 0.8;
    --pagefind-ui-primary: #111;
    --pagefind-ui-text: #111;
    --pagefind-ui-background: #fffff8; /* Tufte Cream color */
    --pagefind-ui-border: #111;
    --pagefind-ui-tag: #111;
}
```

## 4. 작업 목록 (Checklist)

- [ ] `pagefind` 바이너리 설치 및 실행 테스트
- [ ] Hugo 빌드 파이프라인에 `pagefind` 명령어 통합
- [ ] `layouts/partials/search.html` 생성 및 `baseof.html` 등에 삽입
- [ ] 현재 페이지 언어(`{{ .Language.Lang }}`)를 기반으로 검색 UI 언어 설정 연동
- [ ] Tufte.css와 이질감이 없도록 CSS 커스터마이징 (CSS Variables 활용)
- [ ] 모바일 환경에서의 반응형 동작 확인
