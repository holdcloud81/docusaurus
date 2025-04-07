# 구성

## 디렉터리 구조

📁 my-docusaurus/
  ├── 📁 docs/              → 공개 문서 (GitHub Pages에서 배포)
  │   ├── 📁 public/        → 일반 사용자용 문서 (공개)
  │   ├── 📁 gloria/        → Private 문서 (서브모듈)
  │   ├── 📁 guide/         → Private 문서 (서브모듈)
  ├── 📁 static/
  ├── 📁 src/
  ├── 📁 sidebars.js
  ├── docusaurus.config.js

## docusaurus 설치

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.14.0".
nvm current # Should print "v22.14.0".

# Verify npm version:
npm -v # Should print "10.9.2".

# docusaurus 3.7 설치
npx create-docusaurus@latest my-docusaurus classic

# docusaurus 실행
npx docusaurus start

```
## git 리포지토리 생성

submodule 리포지토리를 추가할때 반드시 초기 커밋이 존재해야한다.
리포지토리 생성할때 readme.md 파일을 생성하고 커밋을 진행한다. 

또는 리포지토리를 업로드하고 커밋을 해도 상관없다. 

**public 공개 리포지토리 생성**
- git@github.com:holdcloud81/ducusaurus-public.git 

**priavate  구성 문서, 비공개**
- git@github.com:holdcloud81/docusaurus-private.git 

## ducusaurus-public 메인 프로젝트 구성

우선 메인 프로젝트에서 사용할 public 리포를 구성한다.

```bash
# git 초기화
cd docusaurus
git init

# git 로컬 환경설정
git config user.name "holdcloud81"
git config user.email "holdcloud81@outlook.com"

# 브랜치 main 설정
git branch -M main

# 메인 공개 리포지토리 연결
git remote add origin git@github.com:holdcloud81/docusaurus-public.git

# 메인 공개 리포 최초 커밋
git add .
git commit -m "initial"
git push -u origin main
```


## submodule 구성
이제 비공개 리포를 사용할 submodule 구성한다.

비공개 리포지토리는 docusaurus 멀티 인스턴스를 사용하기 위해 별도의 디렉터리에 구성한다.

디렉터리는 서브모듈 추가할때 생성되어야한다. 

```bash
# 메인 프로젝트에서 비공개 submoude 리포지토리 연결 
git submodule add git@github.com:holdcloud81/docusaurus-private ./private-docs

```
.gitmodules 자동 생성이 되었는지 확인한다.

```cat .gitmodules```

다음 결과를 확인해보자

```
[submodule "private"]
	path = private
	url = git@github.com:holdcloud81/docusaurus-private
```

이제 submodule 리포를 초기화 한다.
private 디렉터리에에 정상적으로 리포지토리 내용이 체크아웃을 해야한다.

```bash 
cd private
git submodule update --init --recursive
--- 
```
submodule 은 메인 프로젝트에서 로컬 환경설정을 상속받지않는다.
즉 submoudle에서 별도의 환경설정을 지정한다. 

```bash
cd private
git config --local user.name "holdcloud81"
git config --local user.email "holdcloud@outlook.com"
```

## submodule 테스트

각 submodule에서 index.md 파일을 생성하고 커밋을 한다. 

```bash

cd private
echo "# guide 비공개 문서" > index.md
git add .
git commit -m "guide 비공개 문서 추가"
git push origin main

# 위 명령어에서 추가된 submodule 파일 정보를  메인 프로젝트에서도 push 하자
git add .
git commit -m "submoudle update"
git push origin main
```

github 메인 프로젝트에서 private 디렉터리에는 초기에 커밋된 문서만 존재한다.

이후에 추가된 index.md는 비공개이므로 비공개 리포에서만 index.md 파일이 존재한다. 

## 서브모듈 포함한 프로젝트 Clone

메인프로젝트와 서브모듈을 포함하는 프로젝트를 Clone 하는 예제를 살펴본다. 

우선 메인 프로젝트를 가져온다. 
```bash
git clone git@github.com:holdcloud81/ducusaurus-public.git
cd ducusaurus-public
ls -lh docs/gloria 
ls -lh docs/guide
```
프로젝트를 Clone 하면 기본적으로 submodule gloria, guide 있지만 비어있는 디렉토리이다. 
submodule 명령어를 실행해야 완전히 clone 완료된다. 

```bash
# git submodule 초기화 진행(이 명령어는 최초 1회만 수행한다) 
git submoudle init

# 다음 결과가 출력됨
Submodule 'docs/gloria' (git@github.com:holdcloud81/docusaurus-gloria.git) registered for path 'docs/gloria'
Submodule 'docs/guide' (git@github.com:holdcloud81/docusaurus-guide.git) registered for path 'docs/guide'

# git submodule 업데이트, 리모트 저장소로부터 pull 받아오기 (이 명령어는 최초 1회만 수행한다)
git submodule update 

# 다음 결과가 출력됨
Cloning into 'C:/Temp/submodule/ducusaurus-public/docs/gloria'...
Cloning into 'C:/Temp/submodule/ducusaurus-public/docs/guide'...
Submodule path 'docs/gloria': checked out 'a95241c45731fc8ddb7102296451dd34aa851357'
Submodule path 'docs/guide': checked out '7eec1b1a3a1193768f5d3ff7faffdd4f4d0fc6d3'

# 공식문서에는 명령어를 한번에 실행하라고 권장하고 있다. 
git clone --recurse-submodules https://github.com/your-org/your-main-project.git
```

## 이미 메인프로젝트가 clone 상태에서 submodule 업데이트 하려면

만약 메인 리포는 이미 clone 되어 있고, submodule 최신 상태로 맞추고 싶다면

```git pull origin main --recurse-submodules```

위 명령을 개별 단계별로 진행하려면

```bash
# 메인 리포 업데이트
git pull origin main

# submodule 최신 업데이트 
git submodule update --init --recursive --remote
```
- --init: 만약 새로 추가된 서브모듈이 있을 경우 초기화
- --recursive: 서브모듈 안에 또 다른 서브모듈이 있을 경우까지도 모두 동기화
- --remote: .gitmodules에 정의된 브랜치 기준으로 서브모듈도 최신 커밋으로 이동

## submodule에서 변경사항(추가, 수정, 삭제) 발생 할때

submodule에서 발생될때 주의할점이 있다. 순서를 정확하게 지켜야한다.

1. 메인 프로젝트 보다 submodule 먼저 push, pull 진행해야한다.
2. 메인 프로젝트 push, pull 진행

### 순서 예시
1. guide submodule에서 커밋한다.

```bash
cd guide
git add index.md
git commit -m "Add index.md"
git push origin main
```

2. 메인 프로젝트(리포)에서 submodule 업데이트 

```git submodule update --remote --merge```

3. 메인 repo에서 서브모듈 커밋 & 푸시
```bash

git add .
git commit -m "update submodule"
git push origin main
```
즉 submodule에서 변경사항이 발생되면 메인 리포에는 폴더로 추적되는 것이 아니라 submodule의 특정 커밋의 해시를 .gitmodules와 메인 리포의 트리에서 "포인터"로 관리한다.

그래서 순서가 중요하다.

## docusaurus 구성

다음과 같이 순서와 작업을 위해 구성한다.

1. 공개용 비공개용 멀티 인스턴스를 구성한다.
2. sidebar 공개용, 비공개용으로 생성한다
3. 상단 navbar 공개용, 비공개용으로 생성한다.
4. 공개용은 공개 리포에 github pages 배포한다.
5. github pages에 비공개는 제외하고 workflow로 빌드 배포한다.
6. 로컬에 서브 모듈과 메인 업데이트를 스크립트를 생성하고 매일 오후 6시에 커밋과 푸시를 진행한다. 이때 github pages 배포한다.

### 외부용, 내부용 멀티 인스턴스 분리


 

















