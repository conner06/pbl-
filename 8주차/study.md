
### 1. 배운점
- types/index.ts 파일에 Part, Member, MemberFormData 타입을 따로 분리해서 정의하고 여러 컴포넌트에서 import해서 쓰는 방식을 배웠다.
- type으로 union 타입(Frontend | Backend | Design)을 만들어서 특정 값만 허용하도록 제한하는 법을 배웠다.
- interface로 Member 객체의 구조를 정의하고, 필수 필드와 선택 필드(?)를 구분해서 타입을 설계하는 법을 배웠다.
- useState, Dispatch 같은 React 훅에도 제네릭으로 타입을 넣어서 안전하게 상태를 관리하는 법을 익혔다.

### 2. 핵심 정리 (내 언어로)
- type Part = 'Frontend' | 'Backend' | 'Design' — 세 가지 값만 허용하는 union 타입, 다른 문자열을 넣으면 컴파일 에러가 남
- interface Member — id, name, part 같은 필수 필드와 bio, email, skills 같은 선택 필드(?)로 멤버 데이터 구조를 정의
- interface MemberFormData — 폼 입력에만 필요한 필드만 따로 분리한 타입
- interface UseMembersReturn — 커스텀 훅의 반환 타입을 명시해서 사용하는 쪽에서 자동완성이 되게 함

### 3. 결과 이미지

메인 목록 페이지ㄴ

./출력.png
./상세페이지%20출력.png
./코드.png

### 4. 느낀 점
- 타입을 한 파일에 모아두니 여러 컴포넌트에서 동일한 타입을 공유할 수 있어서 수정할 때 편리했다.

- 타입 덕분에 잘못된 값을 넣었을 때 런타임이 아니라 코드 작성 시점에 바로 잡을 수 있어서 더 안전하게 개발할 수 있었다.
