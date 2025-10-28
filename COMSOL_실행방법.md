# COMSOL .mph 파일 생성 가이드

## 📋 개요
이 가이드는 Java API를 사용하여 COMSOL Multiphysics .mph 파일을 생성하는 방법을 설명합니다.

## 📁 파일 목록
- `create_mph_AM_multiscale_v2.java` - COMSOL 모델 생성 Java 소스코드
- `run_comsol.bat` - Windows 자동 실행 배치 파일
- `COMSOL_실행방법.md` - 이 설명서

## 🎯 생성되는 모델
**AM_Multiscale_M1toM6_v2.mph** - 다음을 포함하는 완전한 COMSOL 모델:
- 다공성 종이 위의 마이크로니들 어레이 기하구조
- 3층 피부 구조 (SC/EP/DM)
- 물리: Darcy 법칙, 희석 종 수송, 전기 전류, Butler-Volmer 반응
- 정상 및 시간 의존 연구

## 🚀 실행 방법

### 방법 1: 배치 파일 사용 (추천)

1. **파일 준비**
   - 세 파일을 모두 같은 폴더에 저장 (예: 바탕화면)
   - `create_mph_AM_multiscale_v2.java`
   - `run_comsol.bat`

2. **COMSOL 경로 확인 및 수정**
   - `run_comsol.bat` 파일을 메모장으로 열기
   - 다음 줄을 찾아서 실제 COMSOL 설치 경로로 수정:
   ```batch
   set COMSOL_PATH=C:\Program Files\COMSOL\COMSOL63\Multiphysics
   ```
   - COMSOL 6.2 사용시: `COMSOL62`
   - COMSOL 6.1 사용시: `COMSOL61`

3. **실행**
   - `run_comsol.bat` 파일을 더블클릭
   - 자동으로 컴파일 및 실행됨
   - 완료되면 `AM_Multiscale_M1toM6_v2.mph` 파일이 같은 폴더에 생성됨

### 방법 2: 명령 프롬프트 사용

1. **명령 프롬프트 열기**
   - Windows 키 + R
   - `cmd` 입력 후 Enter

2. **파일이 있는 폴더로 이동**
   ```cmd
   cd C:\Users\korea\Desktop
   ```

3. **컴파일**
   ```cmd
   javac -classpath ".;C:\Program Files\COMSOL\COMSOL63\Multiphysics\plugins\*" create_mph_AM_multiscale_v2.java
   ```

4. **실행**
   ```cmd
   "C:\Program Files\COMSOL\COMSOL63\Multiphysics\bin\win64\comsolbatch.exe" -classpath ".;C:\Program Files\COMSOL\COMSOL63\Multiphysics\plugins\*" create_mph_AM_multiscale_v2
   ```

### 방법 3: COMSOL GUI에서 실행

1. COMSOL Multiphysics 실행
2. **파일 > 새로 만들기 > Model Wizard 건너뛰기**
3. **개발자 > Java > Open Java File**
4. `create_mph_AM_multiscale_v2.java` 선택
5. **실행** 버튼 클릭

## ⚙️ 시스템 요구사항

- **COMSOL Multiphysics 6.x** 설치 필수
- **Java Development Kit (JDK)** - COMSOL에 포함됨
- **라이센스**: AC/DC Module, Chemical Reaction Engineering Module 권장

## 📊 모델 파라미터

생성된 모델은 다음 파라미터를 포함합니다:
- 온도: 298K
- 종이 크기: 6mm × 6mm × 0.3mm
- 니들 높이: 1.2mm, 피치: 0.8mm
- 3×3 니들 어레이
- 전극: WE, CE, RE
- 피부 층: SC (0.02mm), EP (0.08mm), DM (1.0mm)

## 🔧 문제 해결

### 오류: "javac가 인식되지 않습니다"
- JDK가 설치되지 않았거나 PATH에 없음
- 해결: COMSOL 설치 폴더의 Java 사용
  ```cmd
  set PATH=%PATH%;C:\Program Files\COMSOL\COMSOL63\Multiphysics\java\win64\jre\bin
  ```

### 오류: "comsol.jar를 찾을 수 없습니다"
- COMSOL_PATH가 잘못 설정됨
- 해결: 실제 COMSOL 설치 폴더 확인 후 경로 수정

### 오류: "라이센스 오류"
- 필요한 모듈의 라이센스가 없음
- 해결: COMSOL 라이센스 관리자에서 모듈 확인

### .mph 파일이 생성되지 않음
- Java 코드 실행 중 오류 발생
- 해결: 명령 프롬프트에서 실행하여 오류 메시지 확인

## 📝 참고사항

- 실행 시간: 약 1-5분 (컴퓨터 성능에 따라 다름)
- 생성되는 파일 크기: 약 1-10MB
- COMSOL 버전에 따라 일부 API가 변경될 수 있음
- 모델 파라미터는 COMSOL GUI에서 추가로 수정 가능

## 📞 추가 도움말

COMSOL 공식 문서:
- Java API 가이드: COMSOL 설치 폴더 → doc → api
- 온라인 헬프: https://doc.comsol.com/

---
**생성일**: 2025-10-28
**COMSOL 버전**: 6.x
**작성자**: Claude Code
