@echo off
setlocal

set "MAVEN_VERSION=3.9.11"
set "WRAPPER_DIR=%~dp0.mvn\wrapper"
set "MAVEN_HOME=%WRAPPER_DIR%\apache-maven-%MAVEN_VERSION%"
set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd"

if not exist "%MAVEN_CMD%" (
    echo Maven %MAVEN_VERSION% is not installed for this project. Downloading it...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "$ErrorActionPreference = 'Stop';" ^
      "$dir = '%WRAPPER_DIR%';" ^
      "$zip = Join-Path $env:TEMP 'apache-maven-%MAVEN_VERSION%-bin.zip';" ^
      "New-Item -ItemType Directory -Force -Path $dir | Out-Null;" ^
      "Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile $zip;" ^
      "Expand-Archive -Path $zip -DestinationPath $dir -Force;" ^
      "Remove-Item $zip -Force"
    if errorlevel 1 (
        echo Failed to download Maven. Check your internet connection and try again.
        exit /b 1
    )
)

call "%MAVEN_CMD%" %*
