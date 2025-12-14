1이 적합하지만, 1번 파일은 사실 이 레퍼지토리의 tufte 브런치의 작업 계획 파일이어서 지금 이 main 브런치의 상황에 맞추어 전면 개정해야 해요. 지금 main에서 하는 일은:

1. loikein fork를 theme에서 가져오는 데서 시작
2. 처음에는 loikein theme 손 안댄체, hugo override로만 작업
   - infinite loop/stack overflow 야기하는 주요한 버그 수정, header.includes.html (partial)의 파일 이름
   - css, Sass 관련 deprecated hugo API 관련 버그 수정
3. loikein fork에서 고친 여러 css가 edward tufte 원본과 다르다는 점을 알고 원본과 가깝게 단계별 수정을 계획
   - 1차 시도: hugo-tufte의 https://github.com/shawnohare/hugo-tufte에서 tufte css 프로젝트의 원본을 비교 분석하면서 새로운 theme를 만들고자 함, 참고: https://github.com/slashformotion/hugo-tufte fork도 loikein 판과 비교 분석하여 작업 계획을 만듬. 그 결과가 @kizoo.gitlab.io/task-for-new-theme-build.md, 새 레퍼지토리의 설정이 뒤죽박죽되어 작업 과정에서 겼은 일을 기록한 일지 (블로그) 말고는 쓸모가 없을 것으로 판단.
   - 2차 시도: main 브런치도 와서 lokein 판의 새 fork을 만들고, (2)에서 고쳤던 layout 버그, 글꼴 custom 구조도 개선, 새로운 tufte 방식 테마를 만들기 시작. tufte css와 loikein 판의 css 분석 자료를 만듬 -  @kizoo.gitlab.io/themes/tufte/assets/scss/ANALYSIS-tufte-css-comparison.md. 이를 바탕으로 하나 씩 차이를 줄여가는 과정에서 css만으로 sidenote 카운터를 만드니 Hugo scratch를 썼던 loikein 판에 없던 sidenote 카운터 리셋 버그를 발견.
   - KaTeX의 수식 카운터와 충돌 생길 수 있다는 가설을 세우고 검증을 시도하기 앞서, MathJax 3 판으로 변경을 시도하고자 함
   - MathJax 3판은 1차 시도의 분석과 실험으로 얻은 결과 속도와 안정성을 위한 결정. 본래는 MathJax 3를 기본으로하고 site config으로 둘 중 하나를 선택하는 방식을 쓰려고 하였으나 불필요. 네트워크 연결 불안으로 cdn 단절을 대비해서 MathJax 3 로컬 복사본을 fallback으로 쓰는 방식을 고민중. MathJax 3로 math (수식 처리)를 구현하고 나면 두 카운터가 충돌하는 문제에 영향을 미칠 가능성이 있어서, 일단 MathJax 문제를 먼저 처리한 다음에 할 일로 어디에 기록하느냐로 고민 중.
