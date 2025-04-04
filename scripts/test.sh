#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" # 스크립트 파일이 어디 있는지 정확한 디렉토리 경로 찾기
SUBMOUDULE_DIR="$SCRIPT_DIR/../private-docs" # 서브모듈 디렉터리 
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)

