#!/bin/bash
## 1. 서브 모듈 업데이트 발생시 서브모듈 커밋 및 푸시
## 2. 루트에서 서브 모듈 ref 업데이트 커밋 및 푸시
## 3. 서브 모듈 업데이트 없이 메인 루트에서 업데이트 발생시 루트에서 커밋 및 푸시

set -e 

# 변수 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" # 스크립트 파일이 어디 있는지 정확한 디렉토리 경로 찾기
SUBMOUDULE_DIR="$SCRIPT_DIR/../private-docs" # 서브모듈 디렉터리 경로 
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd) # 루트 디렉터리 경로
# 1. 서브모듈 푸시
cd $SUBMOUDULE_DIR
git add .
git commit -m "update" || echo "no changes"
git push origin main
cd $ROOT_DIR

# 2. 루트 푸시
git add .
git commit -m "update" || echo "no changes"
git push origin main
