import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import https from 'https';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EpicSteamHybridServer {
  constructor() {
    this.server = new Server(
      {
        name: 'epic-steam-hybrid-mcp',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Steam 라이브러리 경로들
    this.steamLibraryPaths = [
      'C:\\Program Files (x86)\\Steam\\steamapps\\common',
      'D:\\SteamLibrary\\steamapps\\common',
      'E:\\SteamLibrary\\steamapps\\common',
      'F:\\SteamLibrary\\steamapps\\common'
    ];

    this.setupHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      process.exit(0);
    });
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Epic Games 도구들
        {
          name: 'check_epic_status',
          description: 'Check if Epic Games Launcher is running',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'start_epic_launcher',
          description: 'Start Epic Games Launcher',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'focus_epic_window',
          description: 'Bring Epic Games Launcher to foreground',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'send_keys_to_epic',
          description: 'Send keyboard shortcuts to Epic Games Launcher',
          inputSchema: {
            type: 'object',
            properties: {
              keys: {
                type: 'string',
                description: 'Keys to send (e.g., "ctrl+s" for store)',
              },
            },
            required: ['keys'],
          },
        },
        {
          name: 'get_epic_window_info',
          description: 'Get Epic Games Launcher window information',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_epic_discounts',
          description: 'Get current discounted games from Epic Games Store',
          inputSchema: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                description: 'Number of games to get',
                default: 5,
              },
            },
          },
        },
        {
          name: 'get_free_games',
          description: 'Get current and upcoming free games',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_installed_games',
          description: 'Get list of installed games from Epic Games Library',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        // Steam 도구들
        {
          name: 'check_steam_status',
          description: 'Check if Steam is running',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'start_steam',
          description: 'Start Steam',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'focus_steam_window',
          description: 'Bring Steam to foreground',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_steam_installed_games',
          description: 'Get list of installed games from Steam Library',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'launch_steam_game',
          description: 'Launch a Steam game by name or App ID',
          inputSchema: {
            type: 'object',
            properties: {
              gameName: {
                type: 'string',
                description: 'Name of the game to launch',
              },
              appId: {
                type: 'string',
                description: 'Steam App ID of the game to launch',
              },
            },
          },
        },
        {
          name: 'open_steam_library',
          description: 'Open Steam library',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        // Epic Games 핸들러들
        case 'check_epic_status':
          return await this.checkEpicStatus();
        case 'start_epic_launcher':
          return await this.startEpicLauncher();
        case 'focus_epic_window':
          return await this.focusEpicWindow();
        case 'send_keys_to_epic':
          return await this.sendKeysToEpic(args);
        case 'get_epic_window_info':
          return await this.getEpicWindowInfo();
        case 'get_epic_discounts':
          return await this.getEpicDiscounts(args || {});
        case 'get_free_games':
          return await this.getFreeGames();
        case 'get_installed_games':
          return await this.getInstalledGames();
        // Steam 핸들러들
        case 'check_steam_status':
          return await this.checkSteamStatus();
        case 'start_steam':
          return await this.startSteam();
        case 'focus_steam_window':
          return await this.focusSteamWindow();
        case 'get_steam_installed_games':
          return await this.getSteamInstalledGames();
        case 'launch_steam_game':
          return await this.launchSteamGame(args || {});
        case 'open_steam_library':
          return await this.openSteamLibrary();
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  // Epic Games 메서드들 (기존 코드 유지)
  async checkEpicStatus() {
    try {
      const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq EpicGamesLauncher.exe" /FO CSV');
      const isRunning = stdout.includes('EpicGamesLauncher.exe');
      
      return {
        content: [{
          type: 'text',
          text: isRunning 
            ? '✅ Epic Games Launcher가 실행 중입니다.' 
            : '❌ Epic Games Launcher가 실행되고 있지 않습니다.'
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `상태 확인 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async startEpicLauncher() {
    try {
      await execAsync('start "" "C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win32\\EpicGamesLauncher.exe"');
      await sleep(3000);
      
      return {
        content: [{
          type: 'text',
          text: '🚀 Epic Games Launcher를 시작했습니다.'
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `런처 시작 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async focusEpicWindow() {
    try {
      const script = `
        Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        public class Win32 {
          [DllImport("user32.dll")]
          public static extern bool SetForegroundWindow(IntPtr hWnd);
        }
"@
        $epic = Get-Process | Where {$_.ProcessName -eq "EpicGamesLauncher" -and $_.MainWindowHandle -ne 0}
        if ($epic) {
          [Win32]::SetForegroundWindow($epic.MainWindowHandle)
          "Success"
        }
      `;
      
      await execAsync(`powershell -command "${script.replace(/"/g, '\\"')}"`);
      
      return {
        content: [{
          type: 'text',
          text: '✅ Epic Games Launcher 창을 활성화했습니다.'
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `창 활성화 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async sendKeysToEpic(args) {
    try {
      await this.focusEpicWindow();
      await sleep(500);
      
      const psScript = `
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait("${args.keys}")
      `;
      await execAsync(`powershell -command "${psScript}"`);
      
      return {
        content: [{
          type: 'text',
          text: `⌨️ 키 입력을 전송했습니다: ${args.keys}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `키 입력 전송 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async getEpicWindowInfo() {
    try {
      const script = `
        Get-Process | Where {$_.ProcessName -eq "EpicGamesLauncher"} | 
        Select ProcessName, MainWindowTitle, @{Name="Memory(MB)";Expression={[Math]::Round($_.WorkingSet64/1MB,2)}}
      `;
      
      const { stdout } = await execAsync(`powershell -command "${script}"`);
      
      return {
        content: [{
          type: 'text',
          text: `🖼️ Epic Games Launcher 창 정보:\n\n${stdout}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `창 정보 조회 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async makeApiRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  async getEpicDiscounts(args) {
    const count = args.count || 5;
    
    try {
      const url = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=ko&country=KR&allowCountries=KR';
      const data = await this.makeApiRequest(url);
      
      const games = [];
      const elements = data?.data?.Catalog?.searchStore?.elements || [];
      
      for (const game of elements) {
        if (game.promotions?.promotionalOffers?.length > 0) {
          const price = game.price?.totalPrice;
          if (price && price.originalPrice > price.discountPrice) {
            const discountPercent = Math.round((1 - price.discountPrice / price.originalPrice) * 100);
            
            games.push({
              title: game.title,
              originalPrice: `₩${(price.originalPrice / 100).toLocaleString()}`,
              discountPrice: `₩${(price.discountPrice / 100).toLocaleString()}`,
              discount: `${discountPercent}% 할인`,
              developer: game.seller?.name || 'Unknown'
            });
            
            if (games.length >= count) break;
          }
        }
      }

      if (games.length === 0) {
        return {
          content: [{
            type: 'text',
            text: '현재 할인 중인 게임이 없습니다. Epic Games Launcher에서 직접 확인해보세요.'
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: `🎮 Epic Games Store 할인 게임 (${games.length}개):\n\n` +
                games.map((game, i) => 
                  `${i + 1}. **${game.title}**\n` +
                  `   💸 ${game.discount}\n` +
                  `   💰 ${game.originalPrice} → ${game.discountPrice}\n` +
                  `   👤 개발사: ${game.developer}`
                ).join('\n\n')
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `할인 정보를 가져올 수 없습니다: ${error.message}`
        }]
      };
    }
  }
  
  async getFreeGames() {
    try {
      const url = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=ko&country=KR&allowCountries=KR';
      const data = await this.makeApiRequest(url);
      
      const current = [];
      const upcoming = [];
      const elements = data?.data?.Catalog?.searchStore?.elements || [];
      
      for (const game of elements) {
        const promotions = game.promotions;
        
        if (promotions?.promotionalOffers?.length > 0) {
          const offer = promotions.promotionalOffers[0].promotionalOffers[0];
          if (game.price?.totalPrice?.discountPrice === 0) {
            current.push({
              title: game.title,
              endDate: new Date(offer.endDate).toLocaleDateString('ko-KR'),
              description: game.description
            });
          }
        }
        
        if (promotions?.upcomingPromotionalOffers?.length > 0) {
          const offer = promotions.upcomingPromotionalOffers[0].promotionalOffers[0];
          upcoming.push({
            title: game.title,
            startDate: new Date(offer.startDate).toLocaleDateString('ko-KR')
          });
        }
      }

      return {
        content: [{
          type: 'text',
          text: `🎁 Epic Games 무료 게임:\n\n` +
                `**현재 무료 (${current.length}개):**\n` +
                current.map((game, i) => 
                  `${i + 1}. ${game.title}\n` +
                  `   📅 종료: ${game.endDate}\n` +
                  `   📝 ${game.description?.substring(0, 50)}...`
                ).join('\n') +
                `\n\n**예정된 무료 게임 (${upcoming.length}개):**\n` +
                upcoming.map((game, i) => 
                  `${i + 1}. ${game.title}\n` +
                  `   📅 시작: ${game.startDate}`
                ).join('\n')
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `무료 게임 정보를 가져올 수 없습니다: ${error.message}`
        }]
      };
    }
  }

  async getInstalledGames() {
    try {
      // Epic Games 라이브러리 데이터를 찾기 위한 여러 경로 시도
      const possiblePaths = [
        path.join(process.env.PROGRAMDATA || 'C:\\ProgramData', 'Epic\\EpicGamesLauncher\\Data\\Manifests'),
        path.join(process.env.LOCALAPPDATA || 'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local', 'EpicGamesLauncher\\Saved\\Logs'),
        path.join(process.env.APPDATA || 'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Roaming', 'Epic\\EpicGamesLauncher')
      ];
      
      const games = [];
      
      // 방법 1: Manifest 파일들에서 설치된 게임 정보 읽기
      const manifestPath = possiblePaths[0];
      
      if (fs.existsSync(manifestPath)) {
        const files = fs.readdirSync(manifestPath);
        for (const file of files) {
          if (file.endsWith('.item')) {
            try {
              const filePath = path.join(manifestPath, file);
              const content = fs.readFileSync(filePath, 'utf8');
              const manifest = JSON.parse(content);
              
              if (manifest.bIsIncompleteInstall === false) {
                games.push({
                  name: manifest.DisplayName || manifest.AppName,
                  appName: manifest.AppName,
                  version: manifest.AppVersionString,
                  installLocation: manifest.InstallLocation,
                  installSize: manifest.InstallSize ? Math.round(manifest.InstallSize / (1024 * 1024 * 1024) * 100) / 100 : 'Unknown',
                  lastPlayed: manifest.LastPlayed || 'Never'
                });
              }
            } catch (e) {
              // 파일 파싱 실패 시 무시
            }
          }
        }
      }

      if (games.length === 0) {
        return {
          content: [{
            type: 'text',
            text: `📚 Epic Games 라이브러리:\n\n❌ 설치된 게임을 찾을 수 없습니다.\n\n가능한 원인:\n- Epic Games Launcher가 설치되지 않음\n- 게임이 설치되지 않음\n- 권한 부족\n\n수동으로 Epic Games Launcher의 라이브러리 탭에서 확인해보세요.`
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: `📚 Epic Games 라이브러리 (${games.length}개 게임):\n\n` +
                games.map((game, i) => {
                  return `${i + 1}. **${game.name}**\n` +
                         `   🎮 앱명: ${game.appName}\n` +
                         `   📦 버전: ${game.version}\n` +
                         `   💾 크기: ${game.installSize}GB\n` +
                         `   📍 위치: ${game.installLocation}\n` +
                         `   🕒 마지막 플레이: ${game.lastPlayed}`;
                }).join('\n\n')
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `라이브러리 정보를 가져올 수 없습니다: ${error.message}\n\nEpic Games Launcher에서 직접 확인해보세요.`
        }]
      };
    }
  }

  // Steam 메서드들 (새로 추가)
  async checkSteamStatus() {
    try {
      const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq steam.exe" /FO CSV');
      const isRunning = stdout.includes('steam.exe');
      
      return {
        content: [{
          type: 'text',
          text: isRunning 
            ? '✅ Steam이 실행 중입니다.' 
            : '❌ Steam이 실행되고 있지 않습니다.'
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Steam 상태 확인 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async startSteam() {
    try {
      await execAsync('start "" "C:\\Program Files (x86)\\Steam\\steam.exe"');
      await sleep(3000);
      
      return {
        content: [{
          type: 'text',
          text: '🚀 Steam을 시작했습니다.'
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Steam 시작 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async focusSteamWindow() {
    try {
      const script = `
        Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        public class Win32 {
          [DllImport("user32.dll")]
          public static extern bool SetForegroundWindow(IntPtr hWnd);
        }
"@
        $steam = Get-Process | Where {$_.ProcessName -eq "steam" -and $_.MainWindowHandle -ne 0}
        if ($steam) {
          [Win32]::SetForegroundWindow($steam.MainWindowHandle)
          "Success"
        }
      `;
      
      await execAsync(`powershell -command "${script.replace(/"/g, '\\"')}"`);
      
      return {
        content: [{
          type: 'text',
          text: '✅ Steam 창을 활성화했습니다.'
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Steam 창 활성화 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async getSteamInstalledGames() {
    try {
      const games = [];
      
      // 모든 Steam 라이브러리 경로에서 게임 검색
      for (const libraryPath of this.steamLibraryPaths) {
        if (fs.existsSync(libraryPath)) {
          const folders = fs.readdirSync(libraryPath, { withFileTypes: true });
          
          for (const folder of folders) {
            if (folder.isDirectory()) {
              const gamePath = path.join(libraryPath, folder.name);
              const gameSize = await this.getDirectorySize(gamePath);
              
              games.push({
                name: folder.name,
                path: gamePath,
                library: libraryPath,
                size: gameSize
              });
            }
          }
        }
      }

      if (games.length === 0) {
        return {
          content: [{
            type: 'text',
            text: `🎮 Steam 라이브러리:\n\n❌ 설치된 게임을 찾을 수 없습니다.\n\n확인된 라이브러리 경로:\n${this.steamLibraryPaths.map(p => `- ${p}`).join('\n')}`
          }]
        };
      }

      // 라이브러리별로 게임 그룹화
      const gamesByLibrary = {};
      games.forEach(game => {
        if (!gamesByLibrary[game.library]) {
          gamesByLibrary[game.library] = [];
        }
        gamesByLibrary[game.library].push(game);
      });

      let result = `🎮 Steam 라이브러리 (총 ${games.length}개 게임):\n\n`;
      
      Object.entries(gamesByLibrary).forEach(([library, libraryGames]) => {
        result += `📂 **${library}** (${libraryGames.length}개):\n`;
        libraryGames.forEach((game, i) => {
          result += `   ${i + 1}. ${game.name} (${game.size})\n`;
        });
        result += '\n';
      });

      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Steam 라이브러리 정보를 가져올 수 없습니다: ${error.message}`
        }]
      };
    }
  }

  async getDirectorySize(dirPath) {
    try {
      const { stdout } = await execAsync(`powershell -command "(Get-ChildItem -Path '${dirPath}' -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB"`);
      const sizeGB = parseFloat(stdout.trim());
      return isNaN(sizeGB) ? 'Unknown' : `${sizeGB.toFixed(2)}GB`;
    } catch (error) {
      return 'Unknown';
    }
  }

  async launchSteamGame(args) {
    try {
      if (args.appId) {
        // App ID로 게임 실행
        await execAsync(`start "" "steam://rungameid/${args.appId}"`);
        return {
          content: [{
            type: 'text',
            text: `🎮 Steam 게임을 실행했습니다 (App ID: ${args.appId})`
          }]
        };
      } else if (args.gameName) {
        // 게임 이름으로 실행 (Steam URI를 통한 검색 후 실행)
        await execAsync(`start "" "steam://nav/games/details/${encodeURIComponent(args.gameName)}"`);
        return {
          content: [{
            type: 'text',
            text: `🎮 Steam에서 "${args.gameName}" 게임 페이지를 열었습니다`
          }]
        };
      } else {
        return {
          content: [{
            type: 'text',
            text: '❌ 게임명(gameName) 또는 앱 ID(appId)를 제공해주세요.'
          }]
        };
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Steam 게임 실행 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async openSteamLibrary() {
    try {
      await execAsync('start "" "steam://open/games"');
      return {
        content: [{
          type: 'text',
          text: '📚 Steam 라이브러리를 열었습니다.'
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Steam 라이브러리 열기 중 오류 발생: ${error.message}`
        }]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Epic & Steam Hybrid MCP server running');
  }
}

const server = new EpicSteamHybridServer();
server.run().catch(console.error);
