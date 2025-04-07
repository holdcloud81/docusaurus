# 디렉토리 구조
- **docs/**           # 문서 디렉터리
  - **kvm-svr**/             # 서버의 작업 로그    
    - job.md   # 작업 기록

- **configs**/         # 구성 및 설정
  - **kvm-svr##**/             # 서버 구성      
    - **apache/**
      - apache2.conf
    - **nginx/**
        - nginx.conf
    - **images**/            # 이미지 저장
      - network.png
    - **scripts**/            # 이미지 저장  
      - backup.sh
  - **shared**/            # 공통 구성 파일 

- **scripts/**    # 관리 스크립트
  - generate-docs.sh    # 문서화 생성 스크립트
  - sync-configs.sh     # 설정 파일 동기화 스크립트

