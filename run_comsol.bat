@echo off
REM COMSOL Java API 실행 배치 파일
REM 이 파일을 create_mph_AM_multiscale_v2.java와 같은 폴더에 두고 실행하세요

echo ========================================
echo COMSOL .mph 파일 생성 시작
echo ========================================
echo.

REM COMSOL 설치 경로를 확인하세요. 일반적인 경로:
REM C:\Program Files\COMSOL\COMSOL63\Multiphysics
REM C:\Program Files\COMSOL\COMSOL62\Multiphysics

REM COMSOL 버전에 맞게 아래 경로를 수정하세요
set COMSOL_PATH=C:\Program Files\COMSOL\COMSOL63\Multiphysics

REM Java 파일 이름 (확장자 제외)
set JAVA_FILE=create_mph_AM_multiscale_v2

echo COMSOL 경로: %COMSOL_PATH%
echo Java 파일: %JAVA_FILE%.java
echo.

REM 먼저 Java 소스 컴파일
echo [1/2] Java 소스 컴파일 중...
javac -classpath ".;%COMSOL_PATH%\plugins\*" %JAVA_FILE%.java
if errorlevel 1 (
    echo 컴파일 실패! COMSOL 경로를 확인하세요.
    pause
    exit /b 1
)
echo 컴파일 완료!
echo.

REM COMSOL 배치 모드로 실행
echo [2/2] COMSOL 모델 생성 중...
"%COMSOL_PATH%\bin\win64\comsolbatch.exe" -classpath ".;%COMSOL_PATH%\plugins\*" %JAVA_FILE%
if errorlevel 1 (
    echo 실행 실패!
    pause
    exit /b 1
)

echo.
echo ========================================
echo 완료! AM_Multiscale_M1toM6_v2.mph 파일이 생성되었습니다.
echo ========================================
pause
