// scripts/generate-app.js
const fs = require('fs');
const path = require('path');

// 앱 생성을 위한 요소들
const appElements = {
  categories: ['생산성', '게임', '교육', '건강', '엔터테인먼트', '유틸리티'],
  mechanics: ['타이머', '카운터', '랜덤 생성기', '추적기', '계산기', '변환기', '퀴즈'],
  themes: ['동물', '음식', '운동', '음악', '여행', '과학', '예술', '일상'],
  features: ['소셜 공유', '다크모드', '통계', '알림', '커스터마이징', '게임화'],
  colors: ['blue', 'green', 'purple', 'red', 'orange', 'pink', 'yellow', 'indigo']
};

// 오늘 날짜 기반 시드 생성
function getTodaysSeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

// 시드 기반 랜덤 함수
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 랜덤 선택 함수
function randomChoice(array, seed) {
  return array[Math.floor(seededRandom(seed) * array.length)];
}

// HTML 템플릿 생성
function generateHTMLTemplate(appData) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appData.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        
        .app-container {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        
        h1 {
            color: #${appData.color};
            margin-bottom: 1rem;
            font-size: 2rem;
        }
        
        .description {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .main-display {
            font-size: 3rem;
            font-weight: bold;
            color: #${appData.color};
            margin: 2rem 0;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .button-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        button {
            background: #${appData.color};
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .meta-info {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #eee;
            font-size: 0.875rem;
            color: #999;
        }
        
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #f0f0f0;
            border-radius: 20px;
            margin: 0.25rem;
            font-size: 0.75rem;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <h1>${appData.name}</h1>
        <p class="description">${appData.description}</p>
        
        <div class="main-display" id="display">
            시작하려면 버튼을 클릭하세요!
        </div>
        
        <div class="button-group" id="buttons">
            <!-- 버튼들이 여기에 동적으로 추가됩니다 -->
        </div>
        
        <div class="meta-info">
            <div>
                <span class="badge">${appData.category}</span>
                <span class="badge">${appData.theme}</span>
                <span class="badge">${appData.mechanic}</span>
            </div>
            <p style="margin-top: 1rem">생성일: ${appData.date}</p>
        </div>
    </div>
    
    <script>
        ${generateAppScript(appData)}
    </script>
</body>
</html>`;
}

// 앱별 JavaScript 코드 생성
function generateAppScript(appData) {
  const scripts = {
    '타이머': `
        let time = 0;
        let isRunning = false;
        let interval;
        
        const display = document.getElementById('display');
        const buttons = document.getElementById('buttons');
        
        buttons.innerHTML = \`
            <button onclick="toggleTimer()">시작/정지</button>
            <button onclick="resetTimer()">리셋</button>
        \`;
        
        function updateDisplay() {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            display.textContent = \`\${minutes}:\${seconds.toString().padStart(2, '0')}\`;
        }
        
        function toggleTimer() {
            isRunning = !isRunning;
            if (isRunning) {
                interval = setInterval(() => {
                    time++;
                    updateDisplay();
                }, 1000);
            } else {
                clearInterval(interval);
            }
        }
        
        function resetTimer() {
            time = 0;
            isRunning = false;
            clearInterval(interval);
            updateDisplay();
        }
        
        updateDisplay();
    `,
    '카운터': `
        let count = 0;
        
        const display = document.getElementById('display');
        const buttons = document.getElementById('buttons');
        
        buttons.innerHTML = \`
            <button onclick="increment()">+ 증가</button>
            <button onclick="decrement()">- 감소</button>
            <button onclick="reset()">리셋</button>
        \`;
        
        function updateDisplay() {
            display.textContent = count;
        }
        
        function increment() {
            count++;
            updateDisplay();
        }
        
        function decrement() {
            count--;
            updateDisplay();
        }
        
        function reset() {
            count = 0;
            updateDisplay();
        }
        
        updateDisplay();
    `,
    '랜덤 생성기': `
        const items = ['${appData.theme}1', '${appData.theme}2', '${appData.theme}3', '${appData.theme}4', '${appData.theme}5'];
        
        const display = document.getElementById('display');
        const buttons = document.getElementById('buttons');
        
        buttons.innerHTML = \`
            <button onclick="generate()">🎲 생성하기</button>
            <button onclick="clearDisplay()">지우기</button>
        \`;
        
        function generate() {
            const randomIndex = Math.floor(Math.random() * items.length);
            display.textContent = items[randomIndex];
            
            // 애니메이션 효과
            display.style.transform = 'scale(0.8)';
            setTimeout(() => {
                display.style.transform = 'scale(1)';
            }, 200);
        }
        
        function clearDisplay() {
            display.textContent = '시작하려면 버튼을 클릭하세요!';
        }
    `
  };
  
  return scripts[appData.mechanic] || scripts['카운터'];
}

// 메인 함수
function generateTodaysApp() {
  const seed = getTodaysSeed();
  let randomSeed = seed;
  
  // 랜덤 요소 선택
  const category = randomChoice(appElements.categories, randomSeed++);
  const mechanic = randomChoice(appElements.mechanics, randomSeed++);
  const theme = randomChoice(appElements.themes, randomSeed++);
  const feature = randomChoice(appElements.features, randomSeed++);
  const color = randomChoice(appElements.colors, randomSeed++);
  
  // 앱 이름 생성
  const nameTemplates = [
    `${theme} ${mechanic}`,
    `Super ${theme}`,
    `My ${theme} ${mechanic}`,
    `${theme}ify`,
    `${mechanic} Pro`
  ];
  
  const appName = randomChoice(nameTemplates, randomSeed++);
  
  // 설명 생성
  const descriptions = [
    `${category} 앱으로 ${theme} 테마의 ${mechanic}를 즐겨보세요!`,
    `${theme}을(를) 좋아하시나요? 이 ${mechanic} 앱으로 ${category}를 향상시켜보세요.`,
    `혁신적인 ${feature} 기능이 포함된 ${theme} ${category} 앱입니다.`
  ];
  
  const description = randomChoice(descriptions, randomSeed++);
  
  // 앱 데이터 객체
  const appData = {
    id: seed,
    name: appName,
    category,
    mechanic,
    theme,
    feature,
    description,
    date: new Date().toLocaleDateString('ko-KR'),
    color: color === 'blue' ? '3b82f6' : 
           color === 'green' ? '10b981' : 
           color === 'purple' ? '8b5cf6' : 
           color === 'red' ? 'ef4444' : 
           color === 'orange' ? 'f97316' : 
           color === 'pink' ? 'ec4899' : 
           color === 'yellow' ? 'eab308' : '6366f1'
  };
  
  // apps 디렉토리 생성
  const appsDir = path.join(__dirname, '..', 'apps');
  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir, { recursive: true });
  }
  
  // 오늘 날짜로 디렉토리 생성
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const appDir = path.join(appsDir, dateStr);
  
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }
  
  // HTML 파일 생성
  const htmlContent = generateHTMLTemplate(appData);
  fs.writeFileSync(path.join(appDir, 'index.html'), htmlContent);
  
  // 앱 정보 JSON 파일 생성
  fs.writeFileSync(path.join(appDir, 'app-info.json'), JSON.stringify(appData, null, 2));
  
  // README 업데이트
  updateReadme(appData, dateStr);
  
  console.log(`✅ 오늘의 앱 "${appName}"이(가) 생성되었습니다!`);
  console.log(`📁 위치: apps/${dateStr}/`);
}

// README 파일 업데이트
function updateReadme(appData, dateStr) {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent = '';
  
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  } else {
    readmeContent = `# 일일 자동 앱 생성기 🤖

매일 자동으로 새로운 웹 앱을 생성합니다!

## 최근 생성된 앱들

`;
  }
  
  // 새 앱 정보 추가
  const newAppEntry = `### 📅 ${appData.date} - [${appData.name}](apps/${dateStr}/index.html)
- **카테고리**: ${appData.category}
- **메커니즘**: ${appData.mechanic}
- **테마**: ${appData.theme}
- **설명**: ${appData.description}

`;
  
  // "## 최근 생성된 앱들" 섹션 찾기
  const sectionIndex = readmeContent.indexOf('## 최근 생성된 앱들');
  if (sectionIndex !== -1) {
    const insertIndex = readmeContent.indexOf('\n', sectionIndex) + 2;
    readmeContent = readmeContent.slice(0, insertIndex) + newAppEntry + readmeContent.slice(insertIndex);
  }
  
  fs.writeFileSync(readmePath, readmeContent);
}

// 스크립트 실행
generateTodaysApp();
