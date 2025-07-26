// scripts/generate-app.js
const fs = require('fs');
const path = require('path');
const https = require('https');

// News API 설정
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo-key';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${NEWS_API_KEY}`;

// 물리화학 기본 법칙과 실생활 예시
const physicsChemistryLaws = {
  // 운동과 역학
  mechanics: [
    {
      name: '택시 미터기로 배우는 속도 공식',
      law: '속도 = 거리 ÷ 시간',
      description: '실제 택시 요금 계산으로 속도, 거리, 시간의 관계를 체험해보세요!',
      icon: '🚕',
      realExample: '택시 미터기 작동 원리',
      generateApp: () => generateTaxiSpeed()
    },
    {
      name: '엘리베이터로 배우는 가속도',
      law: '가속도 = 속도 변화 ÷ 시간',
      description: '엘리베이터를 탈 때 느끼는 무거움과 가벼움으로 가속도를 이해하세요!',
      icon: '🛗',
      realExample: '엘리베이터 승강감',
      generateApp: () => generateElevatorAcceleration()
    },
    {
      name: '자전거 브레이크와 마찰력',
      law: '마찰력 = 마찰계수 × 수직항력',
      description: '자전거 브레이크가 어떻게 속도를 줄이는지 마찰력으로 알아보세요!',
      icon: '🚴',
      realExample: '자전거 제동 거리',
      generateApp: () => generateBikeFriction()
    }
  ],
  
  // 에너지와 일
  energy: [
    {
      name: '계단 오르기 칼로리 계산기',
      law: '일 = 힘 × 거리, 위치에너지 = mgh',
      description: '계단을 오를 때 소모되는 칼로리를 물리학적으로 계산해보세요!',
      icon: '🏃',
      realExample: '일상 운동의 에너지',
      generateApp: () => generateStairCalories()
    },
    {
      name: '전기밥솥 에너지 효율',
      law: '전력 = 전압 × 전류, 에너지 = 전력 × 시간',
      description: '밥을 지을 때 사용되는 전기 에너지와 열에너지 변환을 알아보세요!',
      icon: '🍚',
      realExample: '주방 가전 전력 소비',
      generateApp: () => generateRiceCookerEnergy()
    },
    {
      name: '스마트폰 배터리 수명 과학',
      law: '전하량 = 전류 × 시간',
      description: '배터리 용량(mAh)의 의미와 사용 시간의 관계를 이해하세요!',
      icon: '📱',
      realExample: '리튬이온 배터리',
      generateApp: () => generateBatteryLife()
    }
  ],
  
  // 파동과 소리
  waves: [
    {
      name: '노래방 음향 물리학',
      law: '음파의 주파수 = 음속 ÷ 파장',
      description: '마이크와 스피커가 어떻게 소리를 증폭시키는지 알아보세요!',
      icon: '🎤',
      realExample: '노래방 에코와 하울링',
      generateApp: () => generateKaraokeSound()
    },
    {
      name: '무지개 생성 원리',
      law: '스넬의 법칙: n₁sinθ₁ = n₂sinθ₂',
      description: '비 온 뒤 무지개가 생기는 빛의 굴절과 분산을 시뮬레이션해보세요!',
      icon: '🌈',
      realExample: '빛의 굴절과 프리즘',
      generateApp: () => generateRainbowPhysics()
    },
    {
      name: 'WiFi 신호 강도 지도',
      law: '전자기파 감쇠 = 거리의 제곱에 반비례',
      description: '집안의 WiFi 신호가 왜 거리에 따라 약해지는지 알아보세요!',
      icon: '📶',
      realExample: '무선 신호 전파',
      generateApp: () => generateWiFiSignal()
    }
  ],
  
  // 열역학
  thermodynamics: [
    {
      name: '에어컨 vs 선풍기 효율 비교',
      law: '열역학 제2법칙, COP = Q/W',
      description: '에어컨과 선풍기의 냉방 효율을 과학적으로 비교해보세요!',
      icon: '❄️',
      realExample: '여름철 냉방 효율',
      generateApp: () => generateCoolingEfficiency()
    },
    {
      name: '보온병 열전달 차단 원리',
      law: '열전달 = 전도 + 대류 + 복사',
      description: '텀블러가 어떻게 음료 온도를 유지하는지 3가지 열전달을 분석하세요!',
      icon: '☕',
      realExample: '진공 단열 기술',
      generateApp: () => generateThermosPhysics()
    },
    {
      name: '라면 끓이기 최적화',
      law: '기화열, 비열 용량',
      description: '물의 끓는점과 고도, 압력의 관계로 완벽한 라면 조리법을 찾으세요!',
      icon: '🍜',
      realExample: '조리 과학',
      generateApp: () => generateRamenScience()
    }
  ],
  
  // 화학 반응
  chemistry: [
    {
      name: '김치 발효 pH 추적기',
      law: 'pH = -log[H⁺], 발효 반응',
      description: '김치가 익어가는 과정의 pH 변화와 젖산 발효를 관찰하세요!',
      icon: '🥬',
      realExample: '발효 식품 과학',
      generateApp: () => generateKimchiFermentation()
    },
    {
      name: '세제의 계면활성제 작용',
      law: '표면장력, 친수성-소수성',
      description: '세제가 어떻게 기름때를 제거하는지 분자 수준에서 이해하세요!',
      icon: '🧼',
      realExample: '세탁 화학',
      generateApp: () => generateDetergentChemistry()
    },
    {
      name: '녹슨 자전거 화학 반응',
      law: '산화-환원 반응: Fe + O₂ → Fe₂O₃',
      description: '철이 녹스는 과정과 방청 원리를 화학적으로 분석하세요!',
      icon: '🚲',
      realExample: '부식과 산화',
      generateApp: () => generateRustChemistry()
    }
  ],
  
  // 압력과 유체
  pressure: [
    {
      name: '빨대 음료수 물리학',
      law: '압력차 = 대기압 - 구강 내압',
      description: '빨대로 음료를 마실 때 작용하는 압력의 원리를 체험하세요!',
      icon: '🥤',
      realExample: '진공과 대기압',
      generateApp: () => generateStrawPhysics()
    },
    {
      name: '자동차 타이어 공기압',
      law: '이상기체 법칙: PV = nRT',
      description: '온도에 따른 타이어 공기압 변화와 안전 운전의 관계를 알아보세요!',
      icon: '🚗',
      realExample: '타이어 압력 관리',
      generateApp: () => generateTirePressure()
    },
    {
      name: '압력밥솥 조리 시간 단축',
      law: '압력과 끓는점의 관계',
      description: '압력솥이 어떻게 조리 시간을 단축시키는지 과학적으로 분석하세요!',
      icon: '🍲',
      realExample: '고압 조리법',
      generateApp: () => generatePressureCooking()
    }
  ]
};

// 트렌드 뉴스 가져오기
async function fetchTrendingTopics() {
  return new Promise((resolve) => {
    // News API가 없으면 기본 트렌드 사용
    if (!NEWS_API_KEY || NEWS_API_KEY === 'demo-key') {
      resolve([
        { title: '전기차 충전소 확대', category: 'energy' },
        { title: '미세먼지 농도 증가', category: 'chemistry' },
        { title: '여름철 에너지 절약', category: 'thermodynamics' }
      ]);
      return;
    }

    https.get(NEWS_API_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const news = JSON.parse(data);
          const trends = news.articles.slice(0, 5).map(article => ({
            title: article.title,
            category: categorizeNews(article.title)
          }));
          resolve(trends);
        } catch (error) {
          console.error('뉴스 파싱 오류:', error);
          resolve([]);
        }
      });
    }).on('error', (error) => {
      console.error('뉴스 API 오류:', error);
      resolve([]);
    });
  });
}

// 뉴스 카테고리 분류
function categorizeNews(title) {
  const keywords = {
    mechanics: ['자동차', '교통', '속도', '운동', '이동'],
    energy: ['전기', '에너지', '배터리', '충전', '전력'],
    waves: ['소리', '소음', '전파', '통신', '음향'],
    thermodynamics: ['날씨', '온도', '더위', '추위', '에어컨'],
    chemistry: ['환경', '오염', '화학', '공기', '미세먼지'],
    pressure: ['압력', '바람', '태풍', '기압', '날씨']
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => title.includes(word))) {
      return category;
    }
  }
  return 'mechanics'; // 기본값
}

// 오늘의 앱 선택 (트렌드 반영)
async function selectTodaysApps() {
  const trends = await fetchTrendingTopics();
  const selectedApps = [];
  const usedCategories = new Set();

  // 트렌드에 맞는 앱 우선 선택
  for (const trend of trends) {
    if (selectedApps.length >= 3) break;
    if (!usedCategories.has(trend.category)) {
      const categoryApps = physicsChemistryLaws[trend.category];
      if (categoryApps) {
        const app = categoryApps[Math.floor(Math.random() * categoryApps.length)];
        selectedApps.push({
          ...app,
          category: trend.category,
          trend: trend.title
        });
        usedCategories.add(trend.category);
      }
    }
  }

  // 부족한 만큼 랜덤 선택
  const categories = Object.keys(physicsChemistryLaws);
  while (selectedApps.length < 3) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    if (!usedCategories.has(category)) {
      const apps = physicsChemistryLaws[category];
      const app = apps[Math.floor(Math.random() * apps.length)];
      selectedApps.push({
        ...app,
        category,
        trend: '일상 속 과학'
      });
      usedCategories.add(category);
    }
  }

  return selectedApps;
}

// 메인 함수
async function generateDailyApps() {
  console.log('🔬 물리화학 일상 법칙 앱 생성 시작...');
  
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const appsDir = path.join(__dirname, '..', 'apps', dateStr);
  
  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir, { recursive: true });
  }
  
  const selectedApps = await selectTodaysApps();
  const appInfo = {
    date: dateStr,
    theme: '물리화학 법칙의 일상 속 예시',
    apps: []
  };
  
  // 3개 앱 생성
  for (let i = 0; i < selectedApps.length; i++) {
    const app = selectedApps[i];
    const appId = `app${i + 1}`;
    const appDir = path.join(appsDir, appId);
    
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    
    const htmlContent = app.generateApp();
    fs.writeFileSync(path.join(appDir, 'index.html'), htmlContent);
    
    appInfo.apps.push({
      id: appId,
      name: app.name,
      law: app.law,
      description: app.description,
      category: app.category,
      icon: app.icon,
      realExample: app.realExample,
      trend: app.trend
    });
    
    console.log(`✅ 생성 완료: ${app.name}`);
  }
  
  // 정보 저장
  fs.writeFileSync(
    path.join(appsDir, 'physics-info.json'),
    JSON.stringify(appInfo, null, 2)
  );
  
  // 인덱스 페이지 생성
  generateIndexPage(appsDir, appInfo);
  
  // README 업데이트
  updateReadme(appInfo);
  
  console.log(`🎉 ${dateStr} 물리화학 일상 법칙 앱 3개 생성 완료!`);
}

// 인덱스 페이지 생성
function generateIndexPage(appsDir, appInfo) {
  const indexHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appInfo.date} - 물리화학 일상 법칙</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: white;
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        .subtitle {
            color: rgba(255,255,255,0.9);
            text-align: center;
            font-size: 1.2rem;
            margin-bottom: 40px;
        }
        .trend-badge {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin-bottom: 30px;
        }
        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }
        .app-card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            position: relative;
            overflow: hidden;
        }
        .app-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #42a5f5, #1e88e5, #1565c0);
        }
        .app-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .app-icon {
            font-size: 3rem;
            margin-bottom: 20px;
            text-align: center;
        }
        .app-title {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #333;
        }
        .app-law {
            background: #e3f2fd;
            padding: 10px 15px;
            border-radius: 20px;
            display: inline-block;
            font-size: 0.9rem;
            color: #1565c0;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
        }
        .app-example {
            background: #f5f5f5;
            padding: 8px 15px;
            border-radius: 15px;
            display: inline-block;
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 15px;
        }
        .app-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .launch-button {
            display: block;
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #1e88e5, #1565c0);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            text-align: center;
            font-weight: bold;
            transition: opacity 0.3s;
        }
        .launch-button:hover {
            opacity: 0.9;
        }
        .intro {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 40px;
            color: white;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔬 오늘의 물리화학 일상 법칙</h1>
        <div class="subtitle">${new Date(appInfo.date).toLocaleDateString('ko-KR', { 
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        })}</div>
        
        <div class="intro">
            ${appInfo.apps.some(app => app.trend !== '일상 속 과학') ? 
                `<div class="trend-badge">📰 오늘의 트렌드 반영</div>` : ''}
            <p>복잡한 물리화학 법칙을 일상생활의 친숙한 예시로 쉽게 배워보세요!</p>
        </div>
        
        <div class="apps-grid">
            ${appInfo.apps.map(app => `
                <div class="app-card">
                    <div class="app-icon">${app.icon}</div>
                    <h2 class="app-title">${app.name}</h2>
                    <div class="app-law">${app.law}</div>
                    <div class="app-example">📍 ${app.realExample}</div>
                    <p class="app-description">${app.description}</p>
                    ${app.trend !== '일상 속 과학' ? 
                        `<p style="font-size: 0.85rem; color: #999; margin-bottom: 15px;">
                            🔥 관련 트렌드: ${app.trend}
                        </p>` : ''}
                    <a href="${app.id}/index.html" class="launch-button">
                        체험하기 →
                    </a>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(appsDir, 'index.html'), indexHtml);
}

// README 업데이트
function updateReadme(appInfo) {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent = fs.existsSync(readmePath) ? 
    fs.readFileSync(readmePath, 'utf8') : 
    '# 물리화학 일상 법칙 체험관\n\n매일 3개의 물리화학 법칙을 일상생활 예시로 배우는 인터랙티브 앱\n\n';
  
  const newEntry = `\n### ${appInfo.date}\n${appInfo.apps.map(app => 
    `- ${app.icon} **${app.name}**: ${app.law} (${app.realExample})`
  ).join('\n')}\n`;
  
  // 최근 앱 섹션 업데이트
  const recentAppsSection = '## 최근 생성된 앱들';
  const index = readmeContent.indexOf(recentAppsSection);
  
  if (index !== -1) {
    const endIndex = readmeContent.indexOf('\n##', index + 1);
    const beforeSection = readmeContent.substring(0, index + recentAppsSection.length);
    const afterSection = endIndex !== -1 ? readmeContent.substring(endIndex) : '';
    
    readmeContent = beforeSection + newEntry + afterSection;
  } else {
    readmeContent += `\n${recentAppsSection}${newEntry}`;
  }
  
  fs.writeFileSync(readmePath, readmeContent);
}

// 택시 미터기 속도 계산
function generateTaxiSpeed() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>택시 미터기로 배우는 속도 공식</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        h1 {
            text-align: center;
            color: #f57c00;
            margin-bottom: 30px;
        }
        .formula-box {
            background: #fff3e0;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.3rem;
            font-family: 'Courier New', monospace;
        }
        .taxi-simulator {
            background: #f5f5f5;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
        }
        .road {
            height: 100px;
            background: #424242;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            margin: 20px 0;
        }
        .road-line {
            position: absolute;
            top: 45px;
            width: 50px;
            height: 10px;
            background: white;
            animation: move 2s linear infinite;
        }
        @keyframes move {
            from { left: -50px; }
            to { left: 100%; }
        }
        .taxi {
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 3rem;
        }
        .meter-display {
            background: #263238;
            color: #00ff00;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            margin: 20px 0;
        }
        .meter-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
        }
        .controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .control-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .control-card h3 {
            color: #f57c00;
            margin-bottom: 15px;
        }
        .speed-slider {
            width: 100%;
            margin: 20px 0;
        }
        .value-display {
            font-size: 2rem;
            color: #ff6f00;
            font-weight: bold;
        }
        .start-button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #ffd54f, #ffb300);
            color: black;
            border: none;
            border-radius: 10px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .start-button:hover {
            transform: scale(1.05);
        }
        .results {
            background: #e8f5e9;
            padding: 25px;
            border-radius: 15px;
            margin-top: 20px;
        }
        .result-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #c8e6c9;
        }
        .real-world-examples {
            background: #f3e5f5;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .example-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .example-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .example-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚕 택시 미터기로 배우는 속도 공식</h1>
        
        <div class="formula-box">
            <h3>속도(v) = 거리(d) ÷ 시간(t)</h3>
            <p style="font-size: 1rem; margin-top: 10px;">v = d/t (km/h = km ÷ h)</p>
        </div>
        
        <div class="taxi-simulator">
            <h3>🚖 택시 운행 시뮬레이터</h3>
            <div class="road">
                <div class="road-line"></div>
                <div class="road-line" style="animation-delay: 0.5s;"></div>
                <div class="road-line" style="animation-delay: 1s;"></div>
                <div class="road-line" style="animation-delay: 1.5s;"></div>
                <div class="taxi">🚕</div>
            </div>
            
            <div class="meter-display">
                <div class="meter-row">
                    <span>운행거리:</span>
                    <span id="distance">0.0 km</span>
                </div>
                <div class="meter-row">
                    <span>운행시간:</span>
                    <span id="time">00:00</span>
                </div>
                <div class="meter-row">
                    <span>현재속도:</span>
                    <span id="currentSpeed">0 km/h</span>
                </div>
                <div class="meter-row">
                    <span>요금:</span>
                    <span id="fare">₩3,800</span>
                </div>
            </div>
        </div>
        
        <div class="controls">
            <div class="control-card">
                <h3>🎯 목적지 거리</h3>
                <input type="range" class="speed-slider" id="targetDistance" 
                       min="1" max="20" value="5" step="0.5" oninput="updateDisplay()">
                <div class="value-display"><span id="distanceValue">5</span> km</div>
            </div>
            
            <div class="control-card">
                <h3>🚦 평균 속도</h3>
                <input type="range" class="speed-slider" id="avgSpeed" 
                       min="10" max="80" value="30" step="5" oninput="updateDisplay()">
                <div class="value-display"><span id="speedValue">30</span> km/h</div>
            </div>
        </div>
        
        <button class="start-button" onclick="startTrip()">🚕 운행 시작!</button>
        
        <div class="results" id="results" style="display: none;">
            <h3>📊 운행 분석 결과</h3>
            <div class="result-item">
                <span>총 운행 거리</span>
                <span id="totalDistance">0 km</span>
            </div>
            <div class="result-item">
                <span>총 소요 시간</span>
                <span id="totalTime">0분</span>
            </div>
            <div class="result-item">
                <span>평균 속도</span>
                <span id="avgSpeedResult">0 km/h</span>
            </div>
            <div class="result-item">
                <span>예상 택시 요금</span>
                <span id="totalFare">₩0</span>
            </div>
        </div>
        
        <div class="real-world-examples">
            <h3>🌍 실생활 속도 비교</h3>
            <div class="example-grid">
                <div class="example-card">
                    <div class="example-icon">🚶</div>
                    <div>보행자</div>
                    <div style="font-weight: bold;">4 km/h</div>
                </div>
                <div class="example-card">
                    <div class="example-icon">🚴</div>
                    <div>자전거</div>
                    <div style="font-weight: bold;">15 km/h</div>
                </div>
                <div class="example-card">
                    <div class="example-icon">🚕</div>
                    <div>시내 택시</div>
                    <div style="font-weight: bold;">30 km/h</div>
                </div>
                <div class="example-card">
                    <div class="example-icon">🚄</div>
                    <div>KTX</div>
                    <div style="font-weight: bold;">300 km/h</div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        let tripInterval;
        let currentDistance = 0;
        let currentTime = 0;
        
        function updateDisplay() {
            document.getElementById('distanceValue').textContent = 
                document.getElementById('targetDistance').value;
            document.getElementById('speedValue').textContent = 
                document.getElementById('avgSpeed').value;
            
            // 예상 시간 계산
            const distance = parseFloat(document.getElementById('targetDistance').value);
            const speed = parseFloat(document.getElementById('avgSpeed').value);
            const time = (distance / speed) * 60; // 분 단위
            
            // 도로 애니메이션 속도 조정
            const roadLines = document.querySelectorAll('.road-line');
            const animationDuration = 60 / speed; // 속도에 반비례
            roadLines.forEach(line => {
                line.style.animationDuration = animationDuration + 's';
            });
        }
        
        function startTrip() {
            // 초기화
            clearInterval(tripInterval);
            currentDistance = 0;
            currentTime = 0;
            
            const targetDistance = parseFloat(document.getElementById('targetDistance').value);
            const avgSpeed = parseFloat(document.getElementById('avgSpeed').value);
            
            // 운행 시작
            tripInterval = setInterval(() => {
                currentTime += 1; // 1초 증가
                
                // 거리 계산 (km = km/h × h)
                currentDistance = (avgSpeed * currentTime) / 3600; // 시간을 시간 단위로 변환
                
                // 속도 변화 (실제 도로처럼 약간의 변동)
                const speedVariation = Math.random() * 10 - 5;
                const currentSpeed = avgSpeed + speedVariation;
                
                // 미터기 업데이트
                document.getElementById('distance').textContent = 
                    currentDistance.toFixed(1) + ' km';
                document.getElementById('time').textContent = 
                    formatTime(currentTime);
                document.getElementById('currentSpeed').textContent = 
                    Math.max(0, currentSpeed).toFixed(0) + ' km/h';
                
                // 요금 계산 (기본요금 3800원 + 132m당 100원)
                const fare = 3800 + Math.floor(currentDistance * 1000 / 132) * 100;
                document.getElementById('fare').textContent = 
                    '₩' + fare.toLocaleString();
                
                // 목적지 도착
                if (currentDistance >= targetDistance) {
                    clearInterval(tripInterval);
                    showResults(targetDistance, currentTime, fare);
                }
            }, 100); // 0.1초마다 업데이트 (시뮬레이션 가속)
        }
        
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        
        function showResults(distance, time, fare) {
            const avgSpeed = (distance / (time / 3600)).toFixed(1);
            
            document.getElementById('totalDistance').textContent = distance + ' km';
            document.getElementById('totalTime').textContent = 
                Math.round(time / 60) + '분 ' + (time % 60) + '초';
            document.getElementById('avgSpeedResult').textContent = avgSpeed + ' km/h';
            document.getElementById('totalFare').textContent = '₩' + fare.toLocaleString();
            
            document.getElementById('results').style.display = 'block';
        }
        
        // 초기화
        updateDisplay();
    </script>
</body>
</html>`;
}

// 김치 발효 pH 추적기
function generateKimchiFermentation() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>김치 발효 pH 추적기</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #ff5252 0%, #f48fb1 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        h1 {
            text-align: center;
            color: #d32f2f;
            margin-bottom: 30px;
        }
        .formula-box {
            background: #ffebee;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
            font-family: 'Courier New', monospace;
        }
        .fermentation-container {
            display: flex;
            gap: 30px;
            margin: 30px 0;
            flex-wrap: wrap;
            justify-content: center;
        }
        .kimchi-jar {
            width: 200px;
            height: 250px;
            background: linear-gradient(to bottom, #fff 0%, #ffcdd2 100%);
            border: 3px solid #d32f2f;
            border-radius: 20px 20px 50px 50px;
            position: relative;
            overflow: hidden;
        }
        .kimchi-content {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: linear-gradient(to bottom, #ff5252 0%, #d32f2f 100%);
            transition: all 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
        .bubble {
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(255,255,255,0.7);
            border-radius: 50%;
            animation: bubble 3s infinite;
        }
        @keyframes bubble {
            0% { bottom: 20%; opacity: 0; }
            50% { opacity: 1; }
            100% { bottom: 90%; opacity: 0; }
        }
        .ph-meter {
            background: #263238;
            color: #00ff00;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            text-align: center;
            margin: 20px 0;
        }
        .ph-display {
            font-size: 3rem;
            margin: 10px 0;
        }
        .ph-scale {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            padding: 10px;
            background: linear-gradient(to right, 
                #ff0000 0%, 
                #ff9800 14%, 
                #ffeb3b 28%, 
                #8bc34a 42%, 
                #4caf50 56%, 
                #2196f3 70%, 
                #3f51b5 84%, 
                #9c27b0 100%);
            border-radius: 10px;
            color: white;
            font-weight: bold;
        }
        .controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .control-card {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
        }
        .control-card h3 {
            color: #d32f2f;
            margin-bottom: 15px;
        }
        input[type="range"] {
            width: 100%;
            margin: 10px 0;
        }
        .value-display {
            text-align: center;
            font-size: 1.2rem;
            color: #d32f2f;
            font-weight: bold;
        }
        .ferment-button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #ff5252, #d32f2f);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .ferment-button:hover {
            transform: scale(1.05);
        }
        .timeline {
            margin: 30px 0;
        }
        .day-marker {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 10px;
            transition: all 0.3s;
        }
        .day-marker.active {
            background: #ffebee;
            transform: translateX(10px);
        }
        .day-icon {
            font-size: 2rem;
            margin-right: 15px;
        }
        .chemical-equation {
            background: #e8f5e9;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            text-align: center;
        }
        .bacteria-count {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        .bacteria-card {
            text-align: center;
            padding: 15px;
            background: #fff3e0;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🥬 김치 발효 pH 추적기</h1>
        
        <div class="formula-box">
            <h3>pH = -log[H⁺]</h3>
            <p style="margin-top: 10px;">pH가 낮을수록 산성, 높을수록 염기성</p>
            <p>김치 최적 pH: 4.2 ~ 4.5</p>
        </div>
        
        <div class="fermentation-container">
            <div>
                <h3 style="text-align: center; margin-bottom: 10px;">발효 중인 김치</h3>
                <div class="kimchi-jar">
                    <div class="kimchi-content" id="kimchiContent" style="height: 80%">
                        🥬
                    </div>
                    <div class="bubble" style="left: 30%; animation-delay: 0s;"></div>
                    <div class="bubble" style="left: 50%; animation-delay: 1s;"></div>
                    <div class="bubble" style="left: 70%; animation-delay: 2s;"></div>
                </div>
            </div>
            
            <div style="flex: 1;">
                <div class="ph-meter">
                    <h3>pH 측정기</h3>
                    <div class="ph-display" id="phDisplay">6.5</div>
                    <div>현재 상태: <span id="fermentStatus">신선한 김치</span></div>
                </div>
                
                <div class="ph-scale">
                    <span>0</span>
                    <span>산성</span>
                    <span>7</span>
                    <span>중성</span>
                    <span>14</span>
                    <span>염기성</span>
                </div>
            </div>
        </div>
        
        <div class="chemical-equation">
            <h3>🧪 젖산 발효 반응</h3>
            <p>C₆H₁₂O₆ (포도당) → 2 C₃H₆O₃ (젖산)</p>
            <p style="margin-top: 10px; font-size: 0.9rem;">
                유산균이 배추의 당분을 젖산으로 변환 → pH 감소
            </p>
        </div>
        
        <div class="controls">
            <div class="control-card">
                <h3>🌡️ 발효 온도</h3>
                <input type="range" id="temperature" min="0" max="30" value="20" oninput="updateDisplay()">
                <div class="value-display"><span id="tempValue">20</span>°C</div>
            </div>
            
            <div class="control-card">
                <h3>🧂 염도</h3>
                <input type="range" id="salinity" min="1" max="5" value="2.5" step="0.5" oninput="updateDisplay()">
                <div class="value-display"><span id="saltValue">2.5</span>%</div>
            </div>
            
            <div class="control-card">
                <h3>📅 발효 일수</h3>
                <input type="range" id="days" min="0" max="30" value="0" oninput="updateFermentation()">
                <div class="value-display"><span id="daysValue">0</span>일</div>
            </div>
        </div>
        
        <button class="ferment-button" onclick="startFermentation()">🧪 발효 시작!</button>
        
        <div class="bacteria-count">
            <div class="bacteria-card">
                <h4>유산균 수</h4>
                <div style="font-size: 2rem;">🦠</div>
                <div id="bacteriaCount">10⁶ CFU/mL</div>
            </div>
            <div class="bacteria-card">
                <h4>젖산 농도</h4>
                <div style="font-size: 2rem;">💧</div>
                <div id="lacticAcid">0.1%</div>
            </div>
            <div class="bacteria-card">
                <h4>비타민 C</h4>
                <div style="font-size: 2rem;">🍊</div>
                <div id="vitaminC">100%</div>
            </div>
        </div>
        
        <div class="timeline" id="timeline">
            <h3>📅 발효 진행 과정</h3>
            <div class="day-marker" data-day="0">
                <div class="day-icon">🥬</div>
                <div>
                    <strong>0일차 - 담금</strong>
                    <p>신선한 배추, pH 6.5, 유산균 활동 시작</p>
                </div>
            </div>
            <div class="day-marker" data-day="3">
                <div class="day-icon">🫧</div>
                <div>
                    <strong>3일차 - 초기 발효</strong>
                    <p>pH 5.5, 탄산가스 발생, 시큼한 향</p>
                </div>
            </div>
            <div class="day-marker" data-day="7">
                <div class="day-icon">🌶️</div>
                <div>
                    <strong>7일차 - 적숙기</strong>
                    <p>pH 4.3, 최적의 맛과 영양, 먹기 좋은 상태</p>
                </div>
            </div>
            <div class="day-marker" data-day="14">
                <div class="day-icon">🍃</div>
                <div>
                    <strong>14일차 - 숙성</strong>
                    <p>pH 4.0, 깊은 맛, 유산균 최대</p>
                </div>
            </div>
            <div class="day-marker" data-day="30">
                <div class="day-icon">🥃</div>
                <div>
                    <strong>30일차 - 묵은지</strong>
                    <p>pH 3.8, 진한 발효향, 묵은지 특유의 맛</p>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        let fermentationInterval;
        let currentDay = 0;
        
        function updateDisplay() {
            document.getElementById('tempValue').textContent = 
                document.getElementById('temperature').value;
            document.getElementById('saltValue').textContent = 
                document.getElementById('salinity').value;
        }
        
        function updateFermentation() {
            const days = parseInt(document.getElementById('days').value);
            document.getElementById('daysValue').textContent = days;
            
            // pH 계산 (날짜에 따라 감소)
            const temp = parseFloat(document.getElementById('temperature').value);
            const salt = parseFloat(document.getElementById('salinity').value);
            
            // 온도와 염도에 따른 발효 속도 조정
            const fermentRate = (temp / 20) * (3 / salt);
            let pH = 6.5 - (days * 0.08 * fermentRate);
            pH = Math.max(3.5, pH); // 최소 pH 3.5
            
            document.getElementById('phDisplay').textContent = pH.toFixed(1);
            
            // 김치 색깔 변화
            const kimchi = document.getElementById('kimchiContent');
            const redness = Math.min(100, days * 3);
            kimchi.style.background = `linear-gradient(to bottom, 
                hsl(0, ${redness}%, 50%) 0%, 
                hsl(0, ${redness}%, 40%) 100%)`;
            
            // 상태 업데이트
            let status = '';
            if (pH > 5.5) status = '신선한 김치';
            else if (pH > 4.5) status = '살짝 익은 김치';
            else if (pH > 4.0) status = '잘 익은 김치 (최적)';
            else status = '묵은지';
            
            document.getElementById('fermentStatus').textContent = status;
            
            // 유산균 수 증가
            const bacteria = Math.min(9, 6 + days * 0.1);
            document.getElementById('bacteriaCount').textContent = 
                `10^${bacteria.toFixed(0)} CFU/mL`;
            
            // 젖산 농도
            const lactic = (days * 0.1).toFixed(1);
            document.getElementById('lacticAcid').textContent = lactic + '%';
            
            // 비타민 C (초기에 증가 후 감소)
            let vitC = 100 + days * 5;
            if (days > 7) vitC = 135 - (days - 7) * 2;
            vitC = Math.max(50, vitC);
            document.getElementById('vitaminC').textContent = vitC.toFixed(0) + '%';
            
            // 타임라인 활성화
            document.querySelectorAll('.day-marker').forEach(marker => {
                const markerDay = parseInt(marker.dataset.day);
                if (days >= markerDay) {
                    marker.classList.add('active');
                } else {
                    marker.classList.remove('active');
                }
            });
        }
        
        function startFermentation() {
            clearInterval(fermentationInterval);
            currentDay = 0;
            document.getElementById('days').value = 0;
            
            fermentationInterval = setInterval(() => {
                currentDay++;
                if (currentDay <= 30) {
                    document.getElementById('days').value = currentDay;
                    updateFermentation();
                } else {
                    clearInterval(fermentationInterval);
                }
            }, 500); // 0.5초마다 1일 경과 (시뮬레이션)
        }
        
        // 초기화
        updateDisplay();
        updateFermentation();
    </script>
</body>
</html>`;
}

// 스마트폰 배터리 수명 과학
function generateBatteryLife() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>스마트폰 배터리 수명 과학</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        h1 {
            text-align: center;
            color: #2e7d32;
            margin-bottom: 30px;
        }
        .formula-box {
            background: #e8f5e9;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
            font-family: 'Courier New', monospace;
        }
        .phone-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 50px;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        .phone {
            width: 250px;
            height: 500px;
            background: #263238;
            border-radius: 30px;
            padding: 20px;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .screen {
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .battery-icon {
            font-size: 5rem;
            margin-bottom: 20px;
        }
        .battery-level {
            width: 80%;
            height: 30px;
            background: #333;
            border-radius: 15px;
            overflow: hidden;
            margin-bottom: 20px;
        }
        .battery-fill {
            height: 100%;
            background: linear-gradient(to right, #4caf50, #8bc34a);
            transition: width 0.5s ease;
        }
        .battery-percent {
            color: white;
            font-size: 2rem;
            font-weight: bold;
        }
        .usage-info {
            flex: 1;
            max-width: 400px;
        }
        .info-card {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .control-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
        }
        .control-card h3 {
            color: #2e7d32;
            margin-bottom: 15px;
        }
        .app-toggles {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 10px 0;
        }
        .app-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .toggle-switch {
            width: 50px;
            height: 25px;
            background: #ccc;
            border-radius: 25px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }
        .toggle-switch.active {
            background: #4caf50;
        }
        .toggle-knob {
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2.5px;
            left: 2.5px;
            transition: left 0.3s;
        }
        .toggle-switch.active .toggle-knob {
            left: 27.5px;
        }
        input[type="range"] {
            width: 100%;
            margin: 10px 0;
        }
        .simulate-button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #4caf50, #2e7d32);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .simulate-button:hover {
            transform: scale(1.05);
        }
        .results {
            background: #e8f5e9;
            padding: 25px;
            border-radius: 15px;
            margin-top: 20px;
        }
        .power-chart {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            align-items: flex-end;
            height: 200px;
        }
        .power-bar {
            width: 60px;
            background: linear-gradient(to top, #ff5252, #ffeb3b, #4caf50);
            border-radius: 5px 5px 0 0;
            position: relative;
            transition: height 0.5s;
        }
        .power-label {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.8rem;
            white-space: nowrap;
        }
        .tips {
            background: #fff3e0;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 스마트폰 배터리 수명 과학</h1>
        
        <div class="formula-box">
            <h3>전하량(Q) = 전류(I) × 시간(t)</h3>
            <p style="margin-top: 10px;">배터리 용량: mAh = mA × h</p>
            <p>사용 시간 = 배터리 용량 ÷ 평균 소비 전류</p>
        </div>
        
        <div class="phone-container">
            <div class="phone">
                <div class="screen">
                    <div class="battery-icon">🔋</div>
                    <div class="battery-level">
                        <div class="battery-fill" id="batteryFill" style="width: 100%"></div>
                    </div>
                    <div class="battery-percent" id="batteryPercent">100%</div>
                    <div style="color: white; margin-top: 20px;">
                        <div>남은 시간: <span id="remainingTime">24시간</span></div>
                        <div>소비 전력: <span id="currentDraw">200mA</span></div>
                    </div>
                </div>
            </div>
            
            <div class="usage-info">
                <div class="info-card">
                    <h3>📊 배터리 사양</h3>
                    <p>용량: <strong id="batteryCapacity">4000</strong> mAh</p>
                    <p>전압: <strong>3.7</strong> V</p>
                    <p>에너지: <strong id="batteryEnergy">14.8</strong> Wh</p>
                    <p>충전 사이클: <strong id="chargeCycles">0</strong> 회</p>
                </div>
            </div>
        </div>
        
        <div class="controls">
            <div class="control-card">
                <h3>📱 앱 사용 현황</h3>
                <div class="app-toggles">
                    <div class="app-toggle">
                        <span>🎮 게임</span>
                        <div class="toggle-switch" onclick="toggleApp(this, 'game')" data-power="500">
                            <div class="toggle-knob"></div>
                        </div>
                    </div>
                    <div class="app-toggle">
                        <span>🎬 동영상</span>
                        <div class="toggle-switch" onclick="toggleApp(this, 'video')" data-power="350">
                            <div class="toggle-knob"></div>
                        </div>
                    </div>
                    <div class="app-toggle">
                        <span>📶 WiFi</span>
                        <div class="toggle-switch active" onclick="toggleApp(this, 'wifi')" data-power="80">
                            <div class="toggle-knob"></div>
                        </div>
                    </div>
                    <div class="app-toggle">
                        <span>📍 GPS</span>
                        <div class="toggle-switch" onclick="toggleApp(this, 'gps')" data-power="150">
                            <div class="toggle-knob"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="control-card">
                <h3>⚙️ 설정</h3>
                <label>화면 밝기</label>
                <input type="range" id="brightness" min="0" max="100" value="50" oninput="updatePower()">
                <div style="text-align: center; margin-bottom: 15px;">
                    <span id="brightnessValue">50</span>%
                </div>
                
                <label>배터리 용량</label>
                <input type="range" id="capacity" min="2000" max="6000" value="4000" step="500" oninput="updateCapacity()">
                <div style="text-align: center;">
                    <span id="capacityValue">4000</span> mAh
                </div>
            </div>
        </div>
        
        <button class="simulate-button" onclick="simulateBattery()">🔋 배터리 사용 시뮬레이션</button>
        
        <div class="power-chart">
            <div style="text-align: center;">
                <div class="power-bar" id="idlePower" style="height: 20px;">
                    <div class="power-label">대기</div>
                </div>
            </div>
            <div style="text-align: center;">
                <div class="power-bar" id="normalPower" style="height: 50px;">
                    <div class="power-label">일반 사용</div>
                </div>
            </div>
            <div style="text-align: center;">
                <div class="power-bar" id="currentPower" style="height: 80px;">
                    <div class="power-label">현재 설정</div>
                </div>
            </div>
            <div style="text-align: center;">
                <div class="power-bar" id="maxPower" style="height: 180px;">
                    <div class="power-label">최대 사용</div>
                </div>
            </div>
        </div>
        
        <div class="results" id="results" style="display: none;">
            <h3>📊 배터리 분석 결과</h3>
            <p>현재 소비 전력: <strong id="totalPower">0</strong> mA</p>
            <p>예상 사용 시간: <strong id="estimatedTime">0</strong> 시간</p>
            <p>하루 충전 필요 횟수: <strong id="chargesPerDay">0</strong> 회</p>
            <p>연간 전기료 (충전): <strong id="yearlyElectricCost">0</strong> 원</p>
        </div>
        
        <div class="tips">
            <h3>💡 배터리 수명 연장 팁</h3>
            <ul style="margin-left: 20px;">
                <li>충전은 20~80% 사이에서 유지하세요</li>
                <li>고온 환경에서 사용을 피하세요</li>
                <li>화면 밝기를 적절히 조절하세요</li>
                <li>사용하지 않는 앱은 종료하세요</li>
                <li>배경 앱 새로고침을 제한하세요</li>
            </ul>
        </div>
    </div>
    
    <script>
        let activeApps = { wifi: true };
        let batteryInterval;
        
        function toggleApp(toggle, app) {
            toggle.classList.toggle('active');
            activeApps[app] = toggle.classList.contains('active');
            updatePower();
        }
        
        function updatePower() {
            const brightness = document.getElementById('brightness').value;
            document.getElementById('brightnessValue').textContent = brightness;
            
            // 기본 전력 소비 (mA)
            let basePower = 100; // 시스템 기본
            let screenPower = brightness * 2; // 화면 밝기에 따른 전력
            
            // 앱별 전력 소비
            let appPower = 0;
            document.querySelectorAll('.toggle-switch.active').forEach(toggle => {
                appPower += parseInt(toggle.dataset.power);
            });
            
            const totalPower = basePower + screenPower + appPower;
            document.getElementById('currentDraw').textContent = totalPower + 'mA';
            
            // 남은 시간 계산
            const capacity = parseInt(document.getElementById('capacity').value);
            const remainingHours = (capacity / totalPower).toFixed(1);
            document.getElementById('remainingTime').textContent = remainingHours + '시간';
            
            // 차트 업데이트
            const maxHeight = 180;
            document.getElementById('currentPower').style.height = 
                (totalPower / 1000 * maxHeight) + 'px';
            
            return totalPower;
        }
        
        function updateCapacity() {
            const capacity = document.getElementById('capacity').value;
            document.getElementById('capacityValue').textContent = capacity;
            document.getElementById('batteryCapacity').textContent = capacity;
            
            // 에너지 계산 (Wh = mAh × V / 1000)
            const energy = (capacity * 3.7 / 1000).toFixed(1);
            document.getElementById('batteryEnergy').textContent = energy;
            
            updatePower();
        }
        
        function simulateBattery() {
            clearInterval(batteryInterval);
            let batteryLevel = 100;
            let cycles = 0;
            
            document.getElementById('results').style.display = 'block';
            
            batteryInterval = setInterval(() => {
                const totalPower = updatePower();
                const capacity = parseInt(document.getElementById('capacity').value);
                
                // 배터리 감소율 (시뮬레이션 가속)
                const drainRate = (totalPower / capacity) * 10;
                batteryLevel = Math.max(0, batteryLevel - drainRate);
                
                document.getElementById('batteryPercent').textContent = 
                    Math.round(batteryLevel) + '%';
                document.getElementById('batteryFill').style.width = 
                    batteryLevel + '%';
                
                // 배터리 색상 변경
                const fill = document.getElementById('batteryFill');
                if (batteryLevel > 50) {
                    fill.style.background = 'linear-gradient(to right, #4caf50, #8bc34a)';
                } else if (batteryLevel > 20) {
                    fill.style.background = 'linear-gradient(to right, #ffeb3b, #ffc107)';
                } else {
                    fill.style.background = 'linear-gradient(to right, #ff5252, #f44336)';
                }
                
                // 결과 업데이트
                document.getElementById('totalPower').textContent = totalPower;
                document.getElementById('estimatedTime').textContent = 
                    (capacity / totalPower).toFixed(1);
                
                const chargesPerDay = (24 / (capacity / totalPower)).toFixed(1);
                document.getElementById('chargesPerDay').textContent = chargesPerDay;
                
                // 연간 전기료 계산 (대략적)
                const yearlyKWh = capacity * 3.7 * chargesPerDay * 365 / 1000000;
                const yearlyElectricCost = Math.round(yearlyKWh * 120); // 120원/kWh
                document.getElementById('yearlyElectricCost').textContent = 
                    yearlyElectricCost.toLocaleString();
                
                // 충전 사이클 증가
                if (batteryLevel <= 0) {
                    batteryLevel = 100;
                    cycles++;
                    document.getElementById('chargeCycles').textContent = cycles;
                }
            }, 100);
        }
        
        // 초기화
        updatePower();
        updateCapacity();
    </script>
</body>
</html>`;
}

// 스크립트 실행
generateDailyApps().catch(console.error);
