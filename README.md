# Epic & Steam MCP Server

Epic Games Launcher와 Steam을 통합 관리할 수 있는 Model Context Protocol (MCP) 서버입니다.

## 주요 기능

### Epic Games 기능
- ✅ Epic Games Launcher 상태 확인 및 실행
- 🎮 설치된 게임 목록 조회 (23개 게임 지원)
- 🆓 무료 게임 정보 조회
- 💰 할인 게임 정보 조회
- 🚀 URI 스킴을 통한 게임 직접 실행
- ⌨️ 키보드 단축키 전송

### Steam 기능
- ✅ Steam 상태 확인 및 실행
- 📚 다중 라이브러리 지원 (4개 경로)
- 🎮 설치된 게임 목록 조회 (116개 게임 지원)
- 🚀 Steam URI 스킴을 통한 게임 실행
- 📂 라이브러리별 게임 분류
- 💾 게임 크기 정보 표시

## 설치 방법

### 사전 요구사항
- Node.js 18+ 
- Epic Games Launcher
- Steam
- Windows 10/11

### 설치 단계

1. **저장소 클론**
```bash
git clone https://github.com/utahime12/epic-steam-mcp.git
cd epic-steam-mcp

의존성 설치

bashnpm install

MCP 서버 실행

bash# 방법 1: npm 스크립트 사용
npm start

# 방법 2: 배치 파일 사용 (Windows)
.\Epic-Steam-MCP-Launch.bat

# 방법 3: 직접 실행
node index.mjs
사용법
Claude Desktop과 연동
Claude Desktop의 설정 파일에 다음을 추가하세요:
json{
  "mcpServers": {
    "epic-steam-mcp": {
      "command": "node",
      "args": ["path/to/epic-steam-mcp/index.mjs"],
      "cwd": "path/to/epic-steam-mcp"
    }
  }
}
지원되는 명령어
Epic Games 명령어

epic-steam:check_epic_status - Epic 런처 상태 확인
epic-steam:start_epic_launcher - Epic 런처 실행
epic-steam:get_installed_games - Epic 설치된 게임 목록
epic-steam:get_free_games - Epic 무료 게임 정보
epic-steam:get_epic_discounts - Epic 할인 게임 정보

Steam 명령어

epic-steam:check_steam_status - Steam 상태 확인
epic-steam:start_steam - Steam 실행
epic-steam:get_steam_installed_games - Steam 설치된 게임 목록
epic-steam:launch_steam_game - Steam 게임 실행
epic-steam:open_steam_library - Steam 라이브러리 열기

Steam 라이브러리 설정
기본적으로 일반적인 Steam 라이브러리 경로들을 지원합니다:

C:\Program Files (x86)\Steam\steamapps\common (기본 Steam 설치)
D:\SteamLibrary\steamapps\common
E:\SteamLibrary\steamapps\common
F:\SteamLibrary\steamapps\common

⚠️ 개인 경로 설정: 다른 경로를 사용하시는 경우 index.mjs의 steamLibraryPaths 배열을 수정하세요.
테스트된 게임들
Epic Games (23개)

원신 (Genshin Impact)
명조 (Wuthering Waves)
붕괴: 스타레일
프로스트펑크 (Frostpunk)
The Long Dark
Ghostrunner
툼 레이더 시리즈
그리고 더 많은 게임들...

Steam (116개)

Baldur's Gate 3
Cyberpunk 2077
Monster Hunter Wilds
METAPHOR
Dragon's Dogma 2
Total War 시리즈
Atelier 시리즈
그리고 더 많은 게임들...

작동 원리
Epic Games 실행
javascript// URI 스킴을 통한 게임 실행
Start-Process "com.epicgames.launcher://apps/{APP_ID}?action=launch"
Steam 게임 실행
javascript// App ID를 통한 게임 실행
Start-Process "steam://rungameid/{APP_ID}"
주요 특징

🔄 통합 관리: Epic과 Steam을 하나의 인터페이스로 관리
📊 상세 정보: 게임 크기, 설치 위치, 버전 정보 제공
🚀 빠른 실행: URI 스킴을 통한 즉시 게임 실행
📂 다중 라이브러리: Steam의 여러 설치 경로 지원
🆓 무료 게임: Epic의 현재/예정 무료 게임 정보
💰 할인 정보: Epic의 실시간 할인 게임 정보

문제 해결
일반적인 문제들

Epic Games Launcher가 인식되지 않는 경우

Epic Games Launcher가 설치되어 있는지 확인
관리자 권한으로 실행


Steam 게임이 표시되지 않는 경우

Steam 라이브러리 경로 확인
steamLibraryPaths 설정 수정


게임 실행이 안 되는 경우

해당 런처가 실행 중인지 확인
URI 스킴 지원 여부 확인



개발 정보

언어: JavaScript (Node.js)
프로토콜: Model Context Protocol (MCP)
지원 OS: Windows 10/11
버전: 2.0.0

기여하기

Fork 이 저장소
Feature 브랜치 생성 (git checkout -b feature/AmazingFeature)
변경사항 커밋 (git commit -m 'Add some AmazingFeature')
브랜치에 Push (git push origin feature/AmazingFeature)
Pull Request 생성

라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.
연락처
프로젝트 링크: https://github.com/utahime12/epic-steam-mcp
감사 인사

Model Context Protocol - MCP 프레임워크
Epic Games - Epic Games Launcher API
Valve - Steam URI 스킴 지원
