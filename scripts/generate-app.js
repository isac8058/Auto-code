// scripts/generate-app.js
const fs = require('fs');
const path = require('path');
const https = require('https');

// News API 키 (선택사항)
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'YOUR_API_KEY_HERE';

// 트렌드와 공학을 융합한 재미있는 앱 템플릿
const trendyEngineeringApps = {
  // K-POP/엔터 × 물리학
  entertainment: [
    {
      name: '아이돌 안무 물리학',
      description: '좋아하는 아이돌의 안무를 물리학적으로 분석해보세요! 회전 관성, 무게중심 이동을 시각화합니다.',
      keywords: ['K-pop', '아이돌', 'BTS', 'NewJeans', '댄스'],
      generateApp: (trend) => generateIdolPhysics(trend)
    },
    {
      name: '콘서트 음향 공학 시뮬레이터',
      description: '콘서트장 음향을 설계해보세요! 파동의 간섭과 반사를 이용한 최적의 스피커 배치를 찾아봅시다.',
      keywords: ['콘서트', '페스티벌', '공연', '음악'],
      generateApp: (trend) => generateConcertAcoustics(trend)
    },
    {
      name: '뮤직비디오 조명 설계',
      description: '빛의 삼원색과 렌즈 공식을 활용해 화려한 뮤비 조명을 설계해보세요!',
      keywords: ['뮤직비디오', 'MV', '촬영', '영상'],
      generateApp: (trend) => generateMVLighting(trend)
    }
  ],

  // 게임 × 수학/알고리즘
  gaming: [
    {
      name: '배틀그라운드 포물선 마스터',
      description: '수류탄 투척 각도를 계산하고 최적의 포물선 궤적을 찾아보세요!',
      keywords: ['배그', 'PUBG', '게임', 'FPS', '슈팅'],
      generateApp: (trend) => generateGameProjectile(trend)
    },
    {
      name: '리그오브레전드 최단경로 계산기',
      description: '다익스트라 알고리즘으로 정글링 최적 경로를 찾아보세요!',
      keywords: ['롤', 'LOL', '리그오브레전드', 'AOS'],
      generateApp: (trend) => generateGamePathfinding(trend)
    },
    {
      name: '게임 아이템 확률 시뮬레이터',
      description: '가챠 확률의 비밀! 기댓값과 확률분포로 뽑기 시스템을 분석해봅시다.',
      keywords: ['가챠', '뽑기', '확률', '아이템'],
      generateApp: (trend) => generateGachaSimulator(trend)
    }
  ],

  // SNS/인플루언서 × 데이터과학
  social: [
    {
      name: '인스타그램 알고리즘 해부학',
      description: '좋아요와 도달률의 상관관계를 분석하고 최적의 업로드 시간을 찾아보세요!',
      keywords: ['인스타그램', 'SNS', '인플루언서', '릴스'],
      generateApp: (trend) => generateInstagramAnalytics(trend)
    },
    {
      name: '유튜브 썸네일 황금비율',
      description: '조회수 높은 썸네일의 비밀! 황금비와 색채 이론으로 완벽한 썸네일을 만들어보세요.',
      keywords: ['유튜브', '유튜버', '영상', '콘텐츠'],
      generateApp: (trend) => generateYoutubeThumbnail(trend)
    },
    {
      name: 'TikTok 바이럴 공식 찾기',
      description: '지수함수적 확산! 바이럴 영상의 전파 속도를 미분방정식으로 예측해보세요.',
      keywords: ['틱톡', 'TikTok', '숏폼', '바이럴'],
      generateApp: (trend) => generateViralFormula(trend)
    }
  ],

  // 음식/카페 × 화학/열역학
  food: [
    {
      name: '완벽한 커피 추출 과학',
      description: '온도, 압력, 시간의 삼박자! 열역학으로 나만의 완벽한 커피를 만들어보세요.',
      keywords: ['커피', '카페', '바리스타', '스타벅스'],
      generateApp: (trend) => generateCoffeeScience(trend)
    },
    {
      name: '치킨 튀김 최적화 계산기',
      description: '바삭함의 과학! 열전달 방정식으로 완벽한 치킨을 만드는 온도와 시간을 찾아보세요.',
      keywords: ['치킨', '음식', '요리', '프라이드'],
      generateApp: (trend) => generateFryingOptimizer(trend)
    },
    {
      name: '버블티 당도 맞춤 설계',
      description: '삼투압과 용해도로 나만의 완벽한 버블티 레시피를 만들어보세요!',
      keywords: ['버블티', '음료', '디저트', '카페'],
      generateApp: (trend) => generateBubbleTeaChemistry(trend)
    }
  ],

  // 패션/뷰티 × 기하학/재료공학
  fashion: [
    {
      name: '옷 조합 색채 공학',
      description: 'RGB 색상환과 보색 이론으로 완벽한 코디를 완성하세요!',
      keywords: ['패션', '옷', '코디', 'OOTD'],
      generateApp: (trend) => generateFashionColorTheory(trend)
    },
    {
      name: '화장품 성분 분석기',
      description: '화학 구조식으로 화장품 성분을 분석하고 피부 타입별 최적 조합을 찾아보세요.',
      keywords: ['화장품', '뷰티', '스킨케어', '메이크업'],
      generateApp: (trend) => generateCosmeticsChemistry(trend)
    },
    {
      name: '신발 쿠션 물리학',
      description: '충격 흡수의 과학! 탄성계수와 압력분산으로 편안한 신발을 설계해보세요.',
      keywords: ['신발', '운동화', '나이키', '아디다스'],
      generateApp: (trend) => generateShoeCushioning(trend)
    }
  ],

  // 환경/지속가능성 × 에너지공학
  environment: [
    {
      name: '탄소발자국 게이미피케이션',
      description: '일상 속 탄소배출을 게임처럼! 에너지 보존 법칙으로 지구를 지켜보세요.',
      keywords: ['환경', '탄소중립', '기후변화', 'ESG'],
      generateApp: (trend) => generateCarbonGame(trend)
    },
    {
      name: '전기차 vs 내연기관 배틀',
      description: '효율성 대결! 열기관 사이클과 전기모터 효율을 비교해보세요.',
      keywords: ['전기차', '테슬라', '현대', '자동차'],
      generateApp: (trend) => generateEVBattle(trend)
    },
    {
      name: '제로웨이스트 최적화',
      description: '선형계획법으로 쓰레기를 최소화하는 라이프스타일을 설계해보세요!',
      keywords: ['제로웨이스트', '재활용', '친환경', '지속가능'],
      generateApp: (trend) => generateZeroWasteOptimizer(trend)
    }
  ]
};

// 트렌드 키워드 수집 (실제 또는 시뮬레이션)
async function collectTrendingTopics() {
  try {
    if (NEWS_API_KEY !== 'YOUR_API_KEY_HERE') {
      // 실제 뉴스 API 호출
      return await fetchRealTrends();
    }
  } catch (error) {
    console.log('뉴스 API 실패, 시뮬레이션 모드 사용');
  }
  
  // 시뮬레이션된 트렌드
  const simulatedTrends = [
    { keyword: 'NewJeans 신곡', category: 'entertainment', description: '하입보이 이후 최고 히트곡 등장' },
    { keyword: '롤드컵 결승', category: 'gaming', description: 'T1 vs Gen.G 세기의 대결' },
    { keyword: '인스타 릴스 업데이트', category: 'social', description: '새로운 AI 필터 기능 추가' },
    { keyword: '스타벅스 신메뉴', category: 'food', description: '여름 시즌 한정 음료 출시' },
    { keyword: '나이키 콜라보', category: 'fashion', description: '유명 아티스트와 한정판 스니커즈' },
    { keyword: '탄소중립 정책', category: 'environment', description: '2030년까지 탄소배출 50% 감축' }
  ];
  
  // 오늘 날짜 기반으로 3개 선택
  const today = new Date();
  const dayIndex = today.getDate() % simulatedTrends.length;
  
  return [
    simulatedTrends[dayIndex % simulatedTrends.length],
    simulatedTrends[(dayIndex + 1) % simulatedTrends.length],
    simulatedTrends[(dayIndex + 2) % simulatedTrends.length]
  ];
}

// 메인 함수
async function generateTrendyApps() {
  console.log('🎯 트렌드 융합 공학 앱 생성 시작...');
  
  const trends = await collectTrendingTopics();
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const appsDir = path.join(__dirname, '..', 'apps', dateStr);
  
  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir, { recursive: true });
  }
  
  const appInfo = {
    date: dateStr,
    theme: '트렌드 × 공학 = 재미있는 학습',
    trends: trends,
    apps: []
  };
  
  // 각 트렌드에 맞는 앱 생성
  for (let i = 0; i < trends.length && i < 3; i++) {
    const trend = trends[i];
    const category = trendyEngineeringApps[trend.category];
    
    if (!category) continue;
    
    // 카테고리에서 랜덤 앱 선택
    const appTemplate = category[i % category.length];
    const appId = `app${i + 1}`;
    const appDir = path.join(appsDir, appId);
    
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    
    // HTML 생성
    const htmlContent = appTemplate.generateApp(trend);
    fs.writeFileSync(path.join(appDir, 'index.html'), htmlContent);
    
    appInfo.apps.push({
      id: appId,
      name: appTemplate.name,
      description: appTemplate.description,
      trend: trend.keyword,
      category: trend.category
    });
    
    console.log(`✅ 생성 완료: ${appTemplate.name} (트렌드: ${trend.keyword})`);
  }
  
  // 정보 저장
  fs.writeFileSync(
    path.join(appsDir, 'trend-info.json'),
    JSON.stringify(appInfo, null, 2)
  );
  
  // 인덱스 페이지 생성
  generateIndexPage(appsDir, appInfo);
  
  // README 업데이트
  updateReadme(appInfo);
  
  console.log(`🎉 ${dateStr} 트렌디한 공학 앱 생성 완료!`);
}

// 인덱스 페이지
function generateIndexPage(appsDir, appInfo) {
  const indexHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appInfo.date} - 오늘의 트렌디 공학 앱</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f0f0f;
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            font-size: 3rem;
            text-align: center;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 3s ease infinite;
        }
        @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: #888;
            margin-bottom: 50px;
        }
        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }
        .app-card {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid #333;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        .app-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #ff006e, #8338ec, #3a86ff);
            animation: gradient 3s ease infinite;
        }
        .app-card:hover {
            transform: translateY(-10px);
            border-color: #555;
            box-shadow: 0 20px 40px rgba(131, 56, 236, 0.3);
        }
        .trend-badge {
            display: inline-block;
            background: rgba(131, 56, 236, 0.2);
            border: 1px solid #8338ec;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-bottom: 20px;
            color: #8338ec;
        }
        .app-title {
            font-size: 1.8rem;
            margin-bottom: 15px;
            color: white;
        }
        .app-description {
            color: #aaa;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .launch-btn {
            display: block;
            width: 100%;
            padding: 15px;
            background: linear-gradient(45deg, #ff006e, #8338ec);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            text-align: center;
            font-weight: bold;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
        }
        .launch-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(131, 56, 236, 0.5);
        }
        .trend-summary {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 50px;
            text-align: center;
        }
        .trend-list {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .trend-item {
            background: rgba(131, 56, 236, 0.1);
            padding: 10px 20px;
            border-radius: 25px;
            border: 1px solid #8338ec;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 오늘의 트렌디 공학 앱</h1>
        <p class="subtitle">${new Date(appInfo.date).toLocaleDateString('ko-KR', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        })}</p>
        
        <div class="trend-summary">
            <h2>📈 오늘의 핫 트렌드</h2>
            <div class="trend-list">
                ${appInfo.trends.map(trend => 
                    `<div class="trend-item">${trend.keyword}</div>`
                ).join('')}
            </div>
        </div>
        
        <div class="apps-grid">
            ${appInfo.apps.map(app => `
                <div class="app-card">
                    <div class="trend-badge">🔥 ${app.trend}</div>
                    <h2 class="app-title">${app.name}</h2>
                    <p class="app-description">${app.description}</p>
                    <a href="${app.id}/index.html" class="launch-btn">
                        앱 실행하기 →
                    </a>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(appsDir, 'index.html'), indexHtml);
}

// 아이돌 안무 물리학 앱
function generateIdolPhysics(trend) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${trend.keyword} 안무 물리학 분석</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: white;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5rem;
        }
        .trend-info {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .dance-stage {
            width: 100%;
            height: 400px;
            background: rgba(0,0,0,0.3);
            border-radius: 15px;
            position: relative;
            margin-bottom: 30px;
            overflow: hidden;
        }
        .dancer {
            width: 60px;
            height: 120px;
            background: linear-gradient(180deg, #ff006e 0%, #8338ec 100%);
            border-radius: 30px 30px 10px 10px;
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            transition: all 0.5s;
        }
        .physics-display {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .physics-card {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .physics-value {
            font-size: 2rem;
            font-weight: bold;
            color: #ffeb3b;
            margin: 10px 0;
        }
        .controls {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        button {
            padding: 12px 30px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 1rem;
        }
        button:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.05);
        }
        .move-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 30px;
        }
        .move-item {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        .move-item:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.05);
        }
        @keyframes spin {
            from { transform: translateX(-50%) rotate(0deg); }
            to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes jump {
            0%, 100% { bottom: 50px; }
            50% { bottom: 200px; }
        }
        @keyframes slide {
            0% { left: 20%; }
            100% { left: 80%; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💃 ${trend.keyword} 안무 물리학 분석</h1>
        
        <div class="trend-info">
            🔥 ${trend.description}
        </div>
        
        <div class="dance-stage" id="stage">
            <div class="dancer" id="dancer"></div>
        </div>
        
        <div class="physics-display">
            <div class="physics-card">
                <div>각속도</div>
                <div class="physics-value" id="angularVelocity">0</div>
                <div>rad/s</div>
            </div>
            <div class="physics-card">
                <div>운동에너지</div>
                <div class="physics-value" id="kineticEnergy">0</div>
                <div>J</div>
            </div>
            <div class="physics-card">
                <div>무게중심 높이</div>
                <div class="physics-value" id="centerMass">1.2</div>
                <div>m</div>
            </div>
            <div class="physics-card">
                <div>회전 관성</div>
                <div class="physics-value" id="inertia">45</div>
                <div>kg·m²</div>
            </div>
        </div>
        
        <div class="controls">
            <button onclick="resetDance()">🔄 리셋</button>
            <button onclick="startSequence()">▶️ 안무 시작</button>
            <button onclick="slowMotion()">🐌 슬로모션</button>
        </div>
        
        <div class="move-list">
            <div class="move-item" onclick="performMove('spin')">
                <div>🌀</div>
                <div>회전</div>
            </div>
            <div class="move-item" onclick="performMove('jump')">
                <div>🦘</div>
                <div>점프</div>
            </div>
            <div class="move-item" onclick="performMove('slide')">
                <div>➡️</div>
                <div>슬라이드</div>
            </div>
            <div class="move-item" onclick="performMove('wave')">
                <div>🌊</div>
                <div>웨이브</div>
            </div>
        </div>
    </div>
    
    <script>
        let currentMove = null;
        let mass = 60; // kg
        let height = 1.7; // m
        
        function performMove(move) {
            const dancer = document.getElementById('dancer');
            dancer.style.animation = 'none';
            
            // 애니메이션 리셋
            setTimeout(() => {
                switch(move) {
                    case 'spin':
                        dancer.style.animation = 'spin 1s linear';
                        updatePhysics('spin');
                        break;
                    case 'jump':
                        dancer.style.animation = 'jump 1s ease-in-out';
                        updatePhysics('jump');
                        break;
                    case 'slide':
                        dancer.style.animation = 'slide 2s ease-in-out';
                        updatePhysics('slide');
                        break;
                    case 'wave':
                        dancer.style.transform = 'translateX(-50%) skewX(10deg)';
                        setTimeout(() => {
                            dancer.style.transform = 'translateX(-50%) skewX(-10deg)';
                        }, 500);
                        updatePhysics('wave');
                        break;
                }
            }, 10);
        }
        
        function updatePhysics(move) {
            let angularVel = 0;
            let kinetic = 0;
            let centerMass = 1.2;
            let inertia = 45;
            
            switch(move) {
                case 'spin':
                    angularVel = 6.28; // 1회전/초 = 2π rad/s
                    inertia = 0.5 * mass * 0.3 * 0.3; // 실린더 근사
                    kinetic = 0.5 * inertia * angularVel * angularVel;
                    break;
                case 'jump':
                    const jumpHeight = 0.5; // m
                    const velocity = Math.sqrt(2 * 9.8 * jumpHeight);
                    kinetic = 0.5 * mass * velocity * velocity;
                    centerMass = 1.2 + jumpHeight;
                    break;
                case 'slide':
                    const slideVel = 2; // m/s
                    kinetic = 0.5 * mass * slideVel * slideVel;
                    break;
                case 'wave':
                    angularVel = 1.57; // π/2 rad/s
                    kinetic = 0.5 * mass * 0.5 * 0.5; // 부분 운동
                    break;
            }
            
            // 값 업데이트 (애니메이션)
            animateValue('angularVelocity', angularVel);
            animateValue('kineticEnergy', kinetic);
            animateValue('centerMass', centerMass);
            animateValue('inertia', inertia);
        }
        
        function animateValue(id, value) {
            const element = document.getElementById(id);
            const start = parseFloat(element.textContent);
            const duration = 500;
            const startTime = Date.now();
            
            function update() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = start + (value - start) * progress;
                element.textContent = current.toFixed(1);
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            update();
        }
        
        function resetDance() {
            const dancer = document.getElementById('dancer');
            dancer.style.animation = 'none';
            dancer.style.transform = 'translateX(-50%)';
            
            document.getElementById('angularVelocity').textContent = '0';
            document.getElementById('kineticEnergy').textContent = '0';
            document.getElementById('centerMass').textContent = '1.2';
            document.getElementById('inertia').textContent = '45';
        }
        
        function startSequence() {
            const moves = ['spin', 'jump', 'slide', 'wave'];
            let index = 0;
            
            function nextMove() {
                if (index < moves.length) {
                    performMove(moves[index]);
                    index++;
                    setTimeout(nextMove, 2000);
                }
            }
            
            nextMove();
        }
        
        function slowMotion() {
            const dancer = document.getElementById('dancer');
            dancer.style.animationDuration = '3s';
        }
    </script>
</body>
</html>`;
}

// 게임 포물선 계산기
function generateGameProjectile(trend) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${trend.keyword} 수류탄 물리학</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #1a1a1a;
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #ff6b6b;
        }
        .game-area {
            width: 100%;
            height: 400px;
            background: linear-gradient(to bottom, #87CEEB 0%, #98D8E8 60%, #8B7355 60%, #654321 100%);
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            margin-bottom: 30px;
            cursor: crosshair;
        }
        .player {
            width: 30px;
            height: 50px;
            background: #4CAF50;
            position: absolute;
            bottom: 100px;
            left: 50px;
            border-radius: 5px;
        }
        .grenade {
            width: 15px;
            height: 15px;
            background: #333;
            border-radius: 50%;
            position: absolute;
            display: none;
        }
        .target {
            width: 40px;
            height: 60px;
            background: #f44336;
            position: absolute;
            bottom: 100px;
            right: 100px;
            border-radius: 5px;
        }
        .trajectory {
            stroke: #ffeb3b;
            stroke-width: 2;
            fill: none;
            stroke-dasharray: 5, 5;
        }
        .controls {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .control-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .slider-container {
            margin-bottom: 15px;
        }
        .slider-container label {
            display: block;
            margin-bottom: 5px;
        }
        input[type="range"] {
            width: 100%;
            margin-bottom: 5px;
        }
        .value-display {
            text-align: center;
            font-size: 1.2rem;
            color: #ffeb3b;
        }
        button {
            width: 100%;
            padding: 15px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
        }
        button:hover {
            background: #ff5252;
            transform: scale(1.05);
        }
        .physics-info {
            background: rgba(255,255,255,0.05);
            padding: 20px;
            border-radius: 10px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        .info-item {
            text-align: center;
        }
        .info-value {
            font-size: 1.5rem;
            color: #4CAF50;
            font-weight: bold;
        }
        .explosion {
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #ff6b6b 0%, #ff9800 50%, transparent 70%);
            border-radius: 50%;
            position: absolute;
            display: none;
            animation: explode 0.5s ease-out;
        }
        @keyframes explode {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💣 ${trend.keyword} 수류탄 마스터</h1>
        
        <div class="game-area" id="gameArea">
            <svg style="position: absolute; width: 100%; height: 100%;">
                <path id="trajectoryPath" class="trajectory" />
            </svg>
            <div class="player"></div>
            <div class="target"></div>
            <div class="grenade" id="grenade"></div>
            <div class="explosion" id="explosion"></div>
        </div>
        
        <div class="controls">
            <div class="control-group">
                <div class="slider-container">
                    <label>투척 각도</label>
                    <input type="range" id="angle" min="0" max="90" value="45" oninput="updateTrajectory()">
                    <div class="value-display"><span id="angleValue">45</span>°</div>
                </div>
                <div class="slider-container">
                    <label>초기 속도</label>
                    <input type="range" id="velocity" min="5" max="30" value="20" oninput="updateTrajectory()">
                    <div class="value-display"><span id="velocityValue">20</span> m/s</div>
                </div>
                <div class="slider-container">
                    <label>바람 (횡풍)</label>
                    <input type="range" id="wind" min="-10" max="10" value="0" oninput="updateTrajectory()">
                    <div class="value-display"><span id="windValue">0</span> m/s</div>
                </div>
            </div>
            <button onclick="throwGrenade()">수류탄 투척!</button>
        </div>
        
        <div class="physics-info">
            <div class="info-item">
                <div>최대 높이</div>
                <div class="info-value" id="maxHeight">0</div>
                <div>m</div>
            </div>
            <div class="info-item">
                <div>비행 시간</div>
                <div class="info-value" id="flightTime">0</div>
                <div>초</div>
            </div>
            <div class="info-item">
                <div>사거리</div>
                <div class="info-value" id="range">0</div>
                <div>m</div>
            </div>
            <div class="info-item">
                <div>착탄 속도</div>
                <div class="info-value" id="impactVelocity">0</div>
                <div>m/s</div>
            </div>
        </div>
    </div>
    
    <script>
        const g = 9.8; // 중력가속도
        const scale = 5; // 픽셀/미터 변환
        
        function updateTrajectory() {
            const angle = parseFloat(document.getElementById('angle').value);
            const velocity = parseFloat(document.getElementById('velocity').value);
            const wind = parseFloat(document.getElementById('wind').value);
            
            document.getElementById('angleValue').textContent = angle;
            document.getElementById('velocityValue').textContent = velocity;
            document.getElementById('windValue').textContent = wind;
            
            // 물리 계산
            const angleRad = angle * Math.PI / 180;
            const vx = velocity * Math.cos(angleRad) + wind;
            const vy = velocity * Math.sin(angleRad);
            
            // 최대 높이
            const maxHeight = (vy * vy) / (2 * g);
            
            // 비행 시간
            const flightTime = 2 * vy / g;
            
            // 사거리
            const range = vx * flightTime;
            
            // 착탄 속도
            const impactVy = -vy;
            const impactVelocity = Math.sqrt(vx * vx + impactVy * impactVy);
            
            // 정보 업데이트
            document.getElementById('maxHeight').textContent = maxHeight.toFixed(1);
            document.getElementById('flightTime').textContent = flightTime.toFixed(1);
            document.getElementById('range').textContent = range.toFixed(1);
            document.getElementById('impactVelocity').textContent = impactVelocity.toFixed(1);
            
            // 궤적 그리기
            drawTrajectory(vx, vy);
        }
        
        function drawTrajectory(vx, vy) {
            const path = document.getElementById('trajectoryPath');
            let pathData = 'M 50 300'; // 시작점
            
            for (let t = 0; t <= 5; t += 0.1) {
                const x = 50 + vx * t * scale;
                const y = 300 - (vy * t - 0.5 * g * t * t) * scale;
                
                if (y > 300) break; // 지면 도달
                pathData += ' L ' + x + ' ' + y;
            }
            
            path.setAttribute('d', pathData);
        }
        
        function throwGrenade() {
            const angle = parseFloat(document.getElementById('angle').value);
            const velocity = parseFloat(document.getElementById('velocity').value);
            const wind = parseFloat(document.getElementById('wind').value);
            
            const angleRad = angle * Math.PI / 180;
            const vx = velocity * Math.cos(angleRad) + wind;
            const vy = velocity * Math.sin(angleRad);
            
            const grenade = document.getElementById('grenade');
            grenade.style.display = 'block';
            grenade.style.left = '50px';
            grenade.style.bottom = '300px';
            
            let t = 0;
            const interval = setInterval(() => {
                t += 0.05;
                
                const x = 50 + vx * t * scale;
                const y = 300 - (vy * t - 0.5 * g * t * t) * scale;
                
                grenade.style.left = x + 'px';
                grenade.style.bottom = y + 'px';
                
                // 지면 도달 또는 화면 밖
                if (y <= 100 || x > 900) {
                    clearInterval(interval);
                    grenade.style.display = 'none';
                    
                    // 폭발 효과
                    const explosion = document.getElementById('explosion');
                    explosion.style.display = 'block';
                    explosion.style.left = x + 'px';
                    explosion.style.bottom = '100px';
                    
                    setTimeout(() => {
                        explosion.style.display = 'none';
                    }, 500);
                    
                    // 타겟 명중 체크
                    if (Math.abs(x - 860) < 40) {
                        alert('🎯 명중! 완벽한 투척입니다!');
                    }
                }
            }, 50);
        }
        
        // 초기화
        updateTrajectory();
    </script>
</body>
</html>`;
}

// 인스타그램 알고리즘 분석기
function generateInstagramAnalytics(trend) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${trend.keyword} 알고리즘 분석기</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
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
            background: linear-gradient(45deg, #f093fb, #f5576c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 30px;
        }
        .phone-mockup {
            width: 300px;
            height: 600px;
            background: #000;
            border-radius: 30px;
            padding: 20px;
            margin: 0 auto 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .screen {
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
        }
        .post {
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #f5576c;
            margin: 10px 0;
        }
        .engagement-chart {
            width: 100%;
            height: 300px;
            background: #f8f9fa;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 30px;
            position: relative;
        }
        .chart-bar {
            display: inline-block;
            width: 30px;
            background: linear-gradient(to top, #f093fb, #f5576c);
            margin: 0 5px;
            vertical-align: bottom;
            transition: height 0.5s ease;
        }
        .time-selector {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .time-slot {
            padding: 10px 20px;
            background: #f8f9fa;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .time-slot.active {
            background: linear-gradient(45deg, #f093fb, #f5576c);
            color: white;
        }
        .algorithm-factors {
            background: #fff3cd;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }
        .factor-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #ffeaa7;
        }
        .factor-score {
            width: 150px;
            height: 10px;
            background: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
        }
        .factor-fill {
            height: 100%;
            background: linear-gradient(90deg, #f093fb, #f5576c);
            transition: width 0.5s ease;
        }
        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(45deg, #f093fb, #f5576c);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: transform 0.3s;
        }
        button:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 ${trend.keyword} 알고리즘 해부학</h1>
        
        <div class="metrics">
            <div class="metric-card">
                <div>평균 도달률</div>
                <div class="metric-value" id="reachRate">0%</div>
                <div>팔로워 대비</div>
            </div>
            <div class="metric-card">
                <div>참여율</div>
                <div class="metric-value" id="engagementRate">0%</div>
                <div>좋아요 + 댓글 + 공유</div>
            </div>
            <div class="metric-card">
                <div>최적 업로드 시간</div>
                <div class="metric-value" id="bestTime">오후 7시</div>
                <div>가장 높은 참여율</div>
            </div>
            <div class="metric-card">
                <div>해시태그 효과</div>
                <div class="metric-value" id="hashtagEffect">+45%</div>
                <div>도달률 증가</div>
            </div>
        </div>
        
        <h3>시간대별 참여율 분석</h3>
        <div class="time-selector">
            <div class="time-slot" onclick="selectTime(6)">오전 6시</div>
            <div class="time-slot" onclick="selectTime(9)">오전 9시</div>
            <div class="time-slot" onclick="selectTime(12)">오후 12시</div>
            <div class="time-slot" onclick="selectTime(15)">오후 3시</div>
            <div class="time-slot" onclick="selectTime(18)">오후 6시</div>
            <div class="time-slot active" onclick="selectTime(19)">오후 7시</div>
            <div class="time-slot" onclick="selectTime(21)">오후 9시</div>
            <div class="time-slot" onclick="selectTime(23)">오후 11시</div>
        </div>
        
        <div class="engagement-chart" id="chart">
            <!-- 차트 바들이 여기에 동적으로 생성됨 -->
        </div>
        
        <h3>알고리즘 점수 요소</h3>
        <div class="algorithm-factors">
            <div class="factor-item">
                <span>초기 30분 참여도</span>
                <div class="factor-score">
                    <div class="factor-fill" style="width: 85%"></div>
                </div>
                <span>85점</span>
            </div>
            <div class="factor-item">
                <span>시청 시간</span>
                <div class="factor-score">
                    <div class="factor-fill" style="width: 70%"></div>
                </div>
                <span>70점</span>
            </div>
            <div class="factor-item">
                <span>저장 & 공유</span>
                <div class="factor-score">
                    <div class="factor-fill" style="width: 60%"></div>
                </div>
                <span>60점</span>
            </div>
            <div class="factor-item">
                <span>댓글 상호작용</span>
                <div class="factor-score">
                    <div class="factor-fill" style="width: 75%"></div>
                </div>
                <span>75점</span>
            </div>
            <div class="factor-item">
                <span>프로필 방문 유도</span>
                <div class="factor-score">
                    <div class="factor-fill" style="width: 50%"></div>
                </div>
                <span>50점</span>
            </div>
        </div>
        
        <button onclick="simulatePost()">📊 새 게시물 시뮬레이션</button>
    </div>
    
    <script>
        const timeData = {
            6: [20, 25, 30, 35, 30, 25, 20],
            9: [40, 45, 50, 55, 50, 45, 40],
            12: [60, 65, 70, 65, 60, 55, 50],
            15: [50, 55, 60, 65, 60, 55, 50],
            18: [70, 75, 80, 85, 80, 75, 70],
            19: [85, 90, 95, 90, 85, 80, 75],
            21: [75, 80, 85, 80, 75, 70, 65],
            23: [40, 45, 50, 45, 40, 35, 30]
        };
        
        let currentTime = 19;
        
        function selectTime(hour) {
            currentTime = hour;
            
            // 활성 시간대 업데이트
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // 차트 업데이트
            updateChart(hour);
            
            // 메트릭 업데이트
            updateMetrics(hour);
        }
        
        function updateChart(hour) {
            const chart = document.getElementById('chart');
            const data = timeData[hour];
            const maxValue = Math.max(...Object.values(timeData).flat());
            
            chart.innerHTML = '';
            data.forEach((value, index) => {
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.height = (value / maxValue * 250) + 'px';
                
                setTimeout(() => {
                    chart.appendChild(bar);
                }, index * 100);
            });
        }
        
        function updateMetrics(hour) {
            const avgEngagement = timeData[hour].reduce((a, b) => a + b) / timeData[hour].length;
            const reachRate = Math.round(avgEngagement * 1.2);
            const engagementRate = (avgEngagement / 10).toFixed(1);
            
            animateValue('reachRate', reachRate + '%');
            animateValue('engagementRate', engagementRate + '%');
            
            if (hour === 19) {
                document.getElementById('bestTime').textContent = '오후 7시';
            } else {
                document.getElementById('bestTime').textContent = '오후 7시';
            }
        }
        
        function animateValue(id, value) {
            const element = document.getElementById(id);
            element.style.transform = 'scale(1.2)';
            element.textContent = value;
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        }
        
        function simulatePost() {
            // 랜덤 시뮬레이션
            const factors = document.querySelectorAll('.factor-fill');
            factors.forEach(factor => {
                const newWidth = Math.random() * 50 + 50; // 50-100%
                factor.style.width = newWidth + '%';
                factor.parentElement.nextElementSibling.textContent = Math.round(newWidth) + '점';
            });
            
            // 새로운 메트릭 계산
            const newReach = Math.round(Math.random() * 30 + 70);
            const newEngagement = (Math.random() * 5 + 5).toFixed(1);
            
            animateValue('reachRate', newReach + '%');
            animateValue('engagementRate', newEngagement + '%');
            
            // 해시태그 효과도 업데이트
            const hashtagBoost = Math.round(Math.random() * 30 + 30);
            animateValue('hashtagEffect', '+' + hashtagBoost + '%');
        }
        
        // 초기화
        updateChart(19);
        updateMetrics(19);
    </script>
</body>
</html>`;
}

// 커피 추출 과학 앱
function generateCoffeeScience(trend) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${trend.keyword} 완벽한 추출 과학</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #6F4E37 0%, #3E2723 100%);
            min-height: 100vh;
            padding: 20px;
            color: white;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5rem;
        }
        .coffee-machine {
            width: 300px;
            height: 400px;
            margin: 0 auto 30px;
            position: relative;
            background: linear-gradient(180deg, #8D6E63 0%, #5D4037 100%);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .water-tank {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 100px;
            background: rgba(33, 150, 243, 0.3);
            border: 2px solid #2196F3;
            border-radius: 10px;
        }
        .water-level {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: #2196F3;
            border-radius: 0 0 8px 8px;
            transition: height 0.5s ease;
        }
        .portafilter {
            position: absolute;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 60px;
            background: #424242;
            border-radius: 0 0 60px 60px;
        }
        .coffee-stream {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 0;
            background: linear-gradient(180deg, #6F4E37 0%, #8D6E63 100%);
            transition: height 1s ease;
        }
        .cup {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 60px;
            background: white;
            border-radius: 0 0 40px 40px;
        }
        .controls-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .control-card {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 15px;
        }
        .control-card h3 {
            margin-bottom: 15px;
            color: #FFD54F;
        }
        .slider-container {
            margin-bottom: 15px;
        }
        input[type="range"] {
            width: 100%;
            margin: 10px 0;
        }
        .value-display {
            text-align: center;
            font-size: 1.5rem;
            color: #FFD54F;
            margin-bottom: 10px;
        }
        .formula-display {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-family: 'Courier New', monospace;
            text-align: center;
        }
        .result-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .result-item {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }
        .result-value {
            font-size: 1.8rem;
            color: #4CAF50;
            font-weight: bold;
            margin: 5px 0;
        }
        .brew-button {
            width: 100%;
            padding: 20px;
            background: linear-gradient(45deg, #FF6F00, #FFD54F);
            color: #3E2723;
            border: none;
            border-radius: 15px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
        }
        .brew-button:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(255, 111, 0, 0.5);
        }
        .quality-meter {
            width: 100%;
            height: 30px;
            background: #333;
            border-radius: 15px;
            overflow: hidden;
            margin-top: 20px;
        }
        .quality-fill {
            height: 100%;
            background: linear-gradient(90deg, #f44336 0%, #FFEB3B 50%, #4CAF50 100%);
            width: 0%;
            transition: width 1s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>☕ ${trend.keyword} 완벽한 추출 과학</h1>
        
        <div class="coffee-machine">
            <div class="water-tank">
                <div class="water-level" id="waterLevel" style="height: 70%"></div>
            </div>
            <div class="portafilter"></div>
            <div class="coffee-stream" id="coffeeStream"></div>
            <div class="cup"></div>
        </div>
        
        <div class="controls-grid">
            <div class="control-card">
                <h3>🌡️ 물 온도</h3>
                <div class="value-display"><span id="tempValue">93</span>°C</div>
                <input type="range" id="temperature" min="85" max="98" value="93" oninput="updateValues()">
                <small>이상적: 90-96°C</small>
            </div>
            
            <div class="control-card">
                <h3>💨 압력</h3>
                <div class="value-display"><span id="pressureValue">9</span> bar</div>
                <input type="range" id="pressure" min="6" max="12" value="9" oninput="updateValues()">
                <small>이상적: 8-10 bar</small>
            </div>
            
            <div class="control-card">
                <h3>⏱️ 추출 시간</h3>
                <div class="value-display"><span id="timeValue">25</span>초</div>
                <input type="range" id="extractTime" min="15" max="35" value="25" oninput="updateValues()">
                <small>이상적: 20-30초</small>
            </div>
            
            <div class="control-card">
                <h3>⚖️ 분쇄도</h3>
                <div class="value-display"><span id="grindValue">중간</span></div>
                <input type="range" id="grindSize" min="1" max="5" value="3" oninput="updateValues()">
                <small>1:극세분 ~ 5:조분</small>
            </div>
        </div>
        
        <div class="formula-display">
            <h3>추출 방정식</h3>
            <p>추출률(%) = (용해된 고형물 / 원두 중량) × 100</p>
            <p>TDS = 1.2 × (압력^0.5) × (온도/100) × (시간/30)</p>
        </div>
        
        <button class="brew-button" onclick="startBrewing()">☕ 추출 시작!</button>
        
        <div class="quality-meter">
            <div class="quality-fill" id="qualityFill"></div>
        </div>
        
        <div class="result-grid">
            <div class="result-item">
                <div>추출률</div>
                <div class="result-value" id="extractionRate">0%</div>
            </div>
            <div class="result-item">
                <div>TDS</div>
                <div class="result-value" id="tds">0</div>
            </div>
            <div class="result-item">
                <div>커피 강도</div>
                <div class="result-value" id="strength">-</div>
            </div>
            <div class="result-item">
                <div>맛 밸런스</div>
                <div class="result-value" id="balance">-</div>
            </div>
        </div>
    </div>
    
    <script>
        function updateValues() {
            const temp = document.getElementById('temperature').value;
            const pressure = document.getElementById('pressure').value;
            const time = document.getElementById('extractTime').value;
            const grind = document.getElementById('grindSize').value;
            
            document.getElementById('tempValue').textContent = temp;
            document.getElementById('pressureValue').textContent = pressure;
            document.getElementById('timeValue').textContent = time;
            
            const grindNames = ['극세분', '세분', '중간', '조분', '극조분'];
            document.getElementById('grindValue').textContent = grindNames[grind - 1];
        }
        
        function startBrewing() {
            const temp = parseFloat(document.getElementById('temperature').value);
            const pressure = parseFloat(document.getElementById('pressure').value);
            const time = parseFloat(document.getElementById('extractTime').value);
            const grind = parseFloat(document.getElementById('grindSize').value);
            
            // 시각적 효과
            const waterLevel = document.getElementById('waterLevel');
            const coffeeStream = document.getElementById('coffeeStream');
            
            waterLevel.style.height = '30%';
            coffeeStream.style.height = '60px';
            
            setTimeout(() => {
                coffeeStream.style.height = '0';
                calculateResults(temp, pressure, time, grind);
            }, 2000);
        }
        
        function calculateResults(temp, pressure, time, grind) {
            // 추출률 계산 (이상적: 18-22%)
            let extractionRate = 18;
            extractionRate += (temp - 90) * 0.3;
            extractionRate += (pressure - 9) * 0.5;
            extractionRate += (time - 25) * 0.2;
            extractionRate += (3 - grind) * 1.5;
            extractionRate = Math.max(15, Math.min(25, extractionRate));
            
            // TDS 계산 (Total Dissolved Solids)
            const tds = 1.2 * Math.sqrt(pressure) * (temp/100) * (time/30);
            
            // 품질 점수 계산
            let quality = 50;
            
            // 온도 점수
            if (temp >= 90 && temp <= 96) quality += 20;
            else quality += Math.max(0, 20 - Math.abs(93 - temp));
            
            // 압력 점수
            if (pressure >= 8 && pressure <= 10) quality += 20;
            else quality += Math.max(0, 20 - Math.abs(9 - pressure) * 5);
            
            // 시간 점수
            if (time >= 20 && time <= 30) quality += 10;
            else quality += Math.max(0, 10 - Math.abs(25 - time) * 0.5);
            
            quality = Math.min(100, quality);
            
            // 결과 표시
            document.getElementById('extractionRate').textContent = extractionRate.toFixed(1) + '%';
            document.getElementById('tds').textContent = tds.toFixed(2);
            
            // 강도 판정
            let strength = '약함';
            if (tds > 1.2 && tds <= 1.35) strength = '적당';
            else if (tds > 1.35) strength = '강함';
            document.getElementById('strength').textContent = strength;
            
            // 밸런스 판정
            let balance = '언밸런스';
            if (extractionRate >= 18 && extractionRate <= 22 && quality > 70) {
                balance = '완벽';
            } else if (quality > 60) {
                balance = '양호';
            }
            document.getElementById('balance').textContent = balance;
            
            // 품질 미터 업데이트
            const qualityFill = document.getElementById('qualityFill');
            qualityFill.style.width = quality + '%';
            
            // 물 레벨 복구
            setTimeout(() => {
                document.getElementById('waterLevel').style.height = '70%';
            }, 1000);
        }
        
        // 초기화
        updateValues();
    </script>
</body>
</html>`;
}

// 게임 확률 시뮬레이터
function generateGachaSimulator(trend) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${trend.keyword} 가챠 확률 시뮬레이터</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .gacha-machine {
            width: 300px;
            height: 400px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
            border-radius: 20px;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .gacha-window {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
        }
        .rarity-display {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .rarity-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            border: 3px solid transparent;
        }
        .rarity-ssr { border-color: #FFD700; background: #FFFACD; }
        .rarity-sr { border-color: #C0C0C0; background: #F0F0F0; }
        .rarity-r { border-color: #CD853F; background: #FAF0E6; }
        .rarity-percentage {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 5px 0;
        }
        .statistics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 15px;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        .pull-button {
            width: 100%;
            padding: 20px;
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 1.3rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 10px;
        }
        .pull-button:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(255,107,107,0.5);
        }
        .probability-math {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            font-family: 'Courier New', monospace;
        }
        .history {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 20px;
            max-height: 200px;
            overflow-y: auto;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .history-item {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.5); opacity: 0; }
            50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.2); }
            100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); opacity: 1; }
        }
        .spinning {
            animation: spin 1s ease-out;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎰 ${trend.keyword} 확률의 비밀</h1>
        
        <div class="gacha-machine">
            <div class="gacha-window" id="result">?</div>
        </div>
        
        <div class="rarity-display">
            <div class="rarity-item rarity-ssr">
                <div>SSR ⭐⭐⭐</div>
                <div class="rarity-percentage">0.6%</div>
                <div>최고 등급</div>
            </div>
            <div class="rarity-item rarity-sr">
                <div>SR ⭐⭐</div>
                <div class="rarity-percentage">2.5%</div>
                <div>희귀 등급</div>
            </div>
            <div class="rarity-item rarity-r">
                <div>R ⭐</div>
                <div class="rarity-percentage">96.9%</div>
                <div>일반 등급</div>
            </div>
        </div>
        
        <div class="probability-math">
            <h3>📊 확률 계산</h3>
            <p>SSR을 뽑을 확률 = 0.6% = 0.006</p>
            <p>10연차 중 최소 1개 SSR = 1 - (0.994)^10 = 5.8%</p>
            <p>SSR 기댓값 = 1 / 0.006 = 약 167회</p>
        </div>
        
        <div class="statistics">
            <div class="stat-card">
                <div>총 뽑기 횟수</div>
                <div class="stat-value" id="totalPulls">0</div>
            </div>
            <div class="stat-card">
                <div>SSR 획득</div>
                <div class="stat-value" id="ssrCount">0</div>
            </div>
            <div class="stat-card">
                <div>소비 금액 (1회 3,000원)</div>
                <div class="stat-value" id="totalCost">0원</div>
            </div>
            <div class="stat-card">
                <div>실제 SSR 확률</div>
                <div class="stat-value" id="actualRate">0%</div>
            </div>
        </div>
        
        <button class="pull-button" onclick="pullOnce()">1회 뽑기 (3,000원)</button>
        <button class="pull-button" onclick="pull10()">10연차 (30,000원)</button>
        <button class="pull-button" style="background: #e74c3c;" onclick="resetStats()">통계 초기화</button>
        
        <h3>뽑기 히스토리</h3>
        <div class="history" id="history"></div>
    </div>
    
    <script>
        let stats = {
            total: 0,
            ssr: 0,
            sr: 0,
            r: 0
        };
        
        function getRandomRarity() {
            const rand = Math.random() * 100;
            if (rand < 0.6) return 'SSR';
            else if (rand < 3.1) return 'SR';
            else return 'R';
        }
        
        function pullOnce() {
            const result = getRandomRarity();
            stats.total++;
            stats[result.toLowerCase()]++;
            
            showResult(result);
            updateStatistics();
            addToHistory(result);
        }
        
        function pull10() {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    pullOnce();
                }, i * 200);
            }
        }
        
        function showResult(rarity) {
            const resultEl = document.getElementById('result');
            resultEl.classList.add('spinning');
            
            const icons = {
                'SSR': '🌟',
                'SR': '💎',
                'R': '🔷'
            };
            
            resultEl.textContent = icons[rarity];
            
            // 배경색 변경
            const machine = document.querySelector('.gacha-machine');
            if (rarity === 'SSR') {
                machine.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
            } else if (rarity === 'SR') {
                machine.style.background = 'linear-gradient(135deg, #C0C0C0, #E5E5E5)';
            }
            
            setTimeout(() => {
                resultEl.classList.remove('spinning');
                if (rarity !== 'SSR') {
                    machine.style.background = 'linear-gradient(135deg, #ff6b6b, #feca57)';
                }
            }, 1000);
        }
        
        function updateStatistics() {
            document.getElementById('totalPulls').textContent = stats.total;
            document.getElementById('ssrCount').textContent = stats.ssr;
            document.getElementById('totalCost').textContent = (stats.total * 3000).toLocaleString() + '원';
            
            const actualRate = stats.total > 0 ? (stats.ssr / stats.total * 100).toFixed(2) : 0;
            document.getElementById('actualRate').textContent = actualRate + '%';
        }
        
        function addToHistory(rarity) {
            const history = document.getElementById('history');
            const item = document.createElement('div');
            item.className = 'history-item rarity-' + rarity.toLowerCase();
            
            const icons = {
                'SSR': '🌟',
                'SR': '💎',
                'R': '🔷'
            };
            
            item.textContent = icons[rarity];
            history.insertBefore(item, history.firstChild);
            
            // 최대 50개만 표시
            if (history.children.length > 50) {
                history.removeChild(history.lastChild);
            }
        }
        
        function resetStats() {
            stats = { total: 0, ssr: 0, sr: 0, r: 0 };
            updateStatistics();
            document.getElementById('history').innerHTML = '';
            document.getElementById('result').textContent = '?';
        }
    </script>
</body>
</html>`;
}

// 유튜브 썸네일 황금비율
function generateYoutubeThumbnail(trend) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${trend.keyword} 썸네일 황금비율</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f0f0f;
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 30px;
            background: linear-gradient(45deg, #ff0000, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .thumbnail-editor {
            width: 100%;
            max-width: 800px;
            margin: 0 auto 40px;
            position: relative;
            background: #282828;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .thumbnail-canvas {
            width: 100%;
            aspect-ratio: 16/9;
            position: relative;
            background: linear-gradient(45deg, #1e3c72, #2a5298);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .golden-grid {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        .golden-line {
            position: absolute;
            background: rgba(255, 215, 0, 0.3);
        }
        .golden-line.vertical1 { left: 38.2%; width: 1px; height: 100%; }
        .golden-line.vertical2 { left: 61.8%; width: 1px; height: 100%; }
        .golden-line.horizontal1 { top: 38.2%; width: 100%; height: 1px; }
        .golden-line.horizontal2 { top: 61.8%; width: 100%; height: 1px; }
        
        .text-overlay {
            position: absolute;
            font-size: 3rem;
            font-weight: bold;
            text-transform: uppercase;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
            cursor: move;
            user-select: none;
        }
        
        .controls {
            background: #1a1a1a;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
        }
        .control-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .control-item {
            background: #282828;
            padding: 20px;
            border-radius: 10px;
        }
        .control-item h3 {
            margin-bottom: 15px;
            color: #ff0000;
        }
        input[type="text"], input[type="color"], input[type="range"] {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            background: #3a3a3a;
            border: none;
            border-radius: 5px;
            color: white;
        }
        .color-presets {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        .color-preset {
            width: 40px;
            height: 40px;
            border-radius: 5px;
            cursor: pointer;
            border: 2px solid transparent;
        }
        .color-preset:hover {
            border-color: white;
        }
        .analytics {
            background: #1a1a1a;
            padding: 30px;
            border-radius: 15px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .metric {
            text-align: center;
            background: #282828;
            padding: 20px;
            border-radius: 10px;
        }
        .metric-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #4CAF50;
            margin: 10px 0;
        }
        .tips {
            background: #ff0000;
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
        }
        button {
            background: #ff0000;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover {
            background: #cc0000;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 ${trend.keyword} 썸네일 황금비율 마스터</h1>
        
        <div class="thumbnail-editor">
            <div class="thumbnail-canvas" id="canvas">
                <div class="golden-grid" id="gridOverlay">
                    <div class="golden-line vertical1"></div>
                    <div class="golden-line vertical2"></div>
                    <div class="golden-line horizontal1"></div>
                    <div class="golden-line horizontal2"></div>
                </div>
                <div class="text-overlay" id="mainText" style="color: #FFD700;">
                    제목 입력
                </div>
            </div>
        </div>
        
        <div class="controls">
            <div class="control-group">
                <div class="control-item">
                    <h3>📝 텍스트 설정</h3>
                    <input type="text" id="textInput" placeholder="썸네일 제목" oninput="updateText()">
                    <input type="range" id="fontSize" min="20" max="80" value="48" oninput="updateFontSize()">
                    <small>폰트 크기: <span id="fontSizeValue">48</span>px</small>
                </div>
                
                <div class="control-item">
                    <h3>🎨 색상 설정</h3>
                    <input type="color" id="textColor" value="#FFD700" oninput="updateTextColor()">
                    <div class="color-presets">
                        <div class="color-preset" style="background: #FFD700" onclick="setColor('#FFD700')"></div>
                        <div class="color-preset" style="background: #FF0000" onclick="setColor('#FF0000')"></div>
                        <div class="color-preset" style="background: #00FF00" onclick="setColor('#00FF00')"></div>
                        <div class="color-preset" style="background: #FFFFFF" onclick="setColor('#FFFFFF')"></div>
                        <div class="color-preset" style="background: #000000" onclick="setColor('#000000')"></div>
                    </div>
                </div>
                
                <div class="control-item">
                    <h3>🖼️ 배경 설정</h3>
                    <button onclick="changeBackground()">배경 변경</button>
                    <button onclick="toggleGrid()">황금비 격자 토글</button>
                </div>
            </div>
        </div>
        
        <div class="analytics">
            <div class="metric">
                <div>황금비 정렬도</div>
                <div class="metric-value" id="alignmentScore">85%</div>
            </div>
            <div class="metric">
                <div>색상 대비</div>
                <div class="metric-value" id="contrastScore">92%</div>
            </div>
            <div class="metric">
                <div>가독성 점수</div>
                <div class="metric-value" id="readabilityScore">88%</div>
            </div>
            <div class="metric">
                <div>예상 CTR</div>
                <div class="metric-value" id="ctrScore">12.5%</div>
            </div>
        </div>
        
        <div class="tips">
            <h3>💡 황금비율 팁</h3>
            <ul>
                <li>중요한 요소는 황금비 교차점(38.2%, 61.8%)에 배치</li>
                <li>강렬한 색상 대비로 시선 끌기 (보색 활용)</li>
                <li>텍스트는 전체 면적의 30% 이하로 유지</li>
                <li>얼굴이나 중요 객체는 황금비 선상에 위치</li>
                <li>3색 이상 사용하지 않기 (주색, 보조색, 강조색)</li>
            </ul>
        </div>
    </div>
    
    <script>
        let isDragging = false;
        let dragElement = null;
        let startX, startY, initialX, initialY;
        
        // 텍스트 드래그 기능
        const mainText = document.getElementById('mainText');
        
        mainText.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        function startDrag(e) {
            isDragging = true;
            dragElement = e.target;
            
            const rect = dragElement.getBoundingClientRect();
            const parentRect = dragElement.parentElement.getBoundingClientRect();
            
            startX = e.clientX;
            startY = e.clientY;
            initialX = rect.left - parentRect.left;
            initialY = rect.top - parentRect.top;
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            dragElement.style.left = (initialX + dx) + 'px';
            dragElement.style.top = (initialY + dy) + 'px';
            
            updateScores();
        }
        
        function endDrag() {
            isDragging = false;
            dragElement = null;
        }
        
        function updateText() {
            const text = document.getElementById('textInput').value || '제목 입력';
            document.getElementById('mainText').textContent = text;
            updateScores();
        }
        
        function updateFontSize() {
            const size = document.getElementById('fontSize').value;
            document.getElementById('mainText').style.fontSize = size + 'px';
            document.getElementById('fontSizeValue').textContent = size;
            updateScores();
        }
        
        function updateTextColor() {
            const color = document.getElementById('textColor').value;
            document.getElementById('mainText').style.color = color;
            updateScores();
        }
        
        function setColor(color) {
            document.getElementById('textColor').value = color;
            updateTextColor();
        }
        
        const backgrounds = [
            'linear-gradient(45deg, #1e3c72, #2a5298)',
            'linear-gradient(45deg, #ff6b6b, #feca57)',
            'linear-gradient(45deg, #4ecdc4, #44a08d)',
            'linear-gradient(45deg, #8e44ad, #3498db)',
            'linear-gradient(45deg, #2c3e50, #34495e)'
        ];
        let currentBg = 0;
        
        function changeBackground() {
            currentBg = (currentBg + 1) % backgrounds.length;
            document.querySelector('.thumbnail-canvas').style.background = backgrounds[currentBg];
            updateScores();
        }
        
        function toggleGrid() {
            const grid = document.getElementById('gridOverlay');
            grid.style.display = grid.style.display === 'none' ? 'block' : 'none';
        }
        
        function updateScores() {
            // 황금비 정렬도 계산
            const text = document.getElementById('mainText');
            const canvas = document.querySelector('.thumbnail-canvas');
            const textRect = text.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const textCenterX = (textRect.left - canvasRect.left + textRect.width / 2) / canvasRect.width;
            const textCenterY = (textRect.top - canvasRect.top + textRect.height / 2) / canvasRect.height;
            
            // 황금비 위치와의 거리 계산
            const goldenPoints = [
                {x: 0.382, y: 0.382}, {x: 0.618, y: 0.382},
                {x: 0.382, y: 0.618}, {x: 0.618, y: 0.618}
            ];
            
            let minDistance = 1;
            goldenPoints.forEach(point => {
                const distance = Math.sqrt(
                    Math.pow(textCenterX - point.x, 2) + 
                    Math.pow(textCenterY - point.y, 2)
                );
                minDistance = Math.min(minDistance, distance);
            });
            
            const alignmentScore = Math.round((1 - minDistance) * 100);
            document.getElementById('alignmentScore').textContent = alignmentScore + '%';
            
            // 색상 대비 점수 (간단한 시뮬레이션)
            const contrastScore = Math.round(Math.random() * 20 + 80);
            document.getElementById('contrastScore').textContent = contrastScore + '%';
            
            // 가독성 점수
            const fontSize = parseInt(document.getElementById('fontSize').value);
            const readabilityScore = Math.min(100, Math.round(fontSize * 1.5 + 20));
            document.getElementById('readabilityScore').textContent = readabilityScore + '%';
            
            // 예상 CTR
            const avgScore = (alignmentScore + contrastScore + readabilityScore) / 3;
            const ctr = (avgScore * 0.15).toFixed(1);
            document.getElementById('ctrScore').textContent = ctr + '%';
        }
        
        // 초기화
        updateScores();
    </script>
</body>
</html>`;
}

// 나머지 필요한 함수들 (기본 템플릿)
function generateConcertAcoustics(trend) {
  return generateIdolPhysics(trend); // 임시
}

function generateMVLighting(trend) {
  return generateIdolPhysics(trend); // 임시
}

function generateGamePathfinding(trend) {
  return generateGameProjectile(trend); // 임시
}

function generateViralFormula(trend) {
  return generateInstagramAnalytics(trend); // 임시
}

function generateFryingOptimizer(trend) {
  return generateCoffeeScience(trend); // 임시
}

function generateBubbleTeaChemistry(trend) {
  return generateCoffeeScience(trend); // 임시
}

function generateFashionColorTheory(trend) {
  return generateYoutubeThumbnail(trend); // 임시
}

function generateCosmeticsChemistry(trend) {
  return generateCoffeeScience(trend); // 임시
}

function generateShoeCushioning(trend) {
  return generateGameProjectile(trend); // 임시
}

function generateCarbonGame(trend) {
  return generateGachaSimulator(trend); // 임시
}

function generateEVBattle(trend) {
  return generateGameProjectile(trend); // 임시
}

function generateZeroWasteOptimizer(trend) {
  return generateInstagramAnalytics(trend); // 임시
}

// README 업데이트
function updateReadme(appInfo) {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent = '';
  
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  } else {
    readmeContent = `# 🎯 트렌드 × 공학 = 재미있는 학습

매일 최신 트렌드와 공학을 융합한 재미있는 학습 앱을 자동으로 생성합니다!

## 최근 생성된 앱들

`;
  }
  
  const newEntry = `### 📅 ${appInfo.date}

**오늘의 트렌드:**
${appInfo.trends.map(t => `- ${t.keyword}: ${t.description}`).join('\n')}

**생성된 앱:**
${appInfo.apps.map((app, index) => 
  `${index + 1}. **${app.name}**
   - 트렌드: ${app.trend}
   - 설명: ${app.description}
   - [🚀 실행하기](apps/${appInfo.date}/${app.id}/index.html)`
).join('\n\n')}

---

`;
  
  const sectionIndex = readmeContent.indexOf('## 최근 생성된 앱들');
  if (sectionIndex !== -1) {
    const insertIndex = readmeContent.indexOf('\n', sectionIndex) + 2;
    readmeContent = readmeContent.slice(0, insertIndex) + newEntry + readmeContent.slice(insertIndex);
  }
  
  fs.writeFileSync(readmePath, readmeContent);
}

// 실제 뉴스 API 호출
async function fetchRealTrends() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'newsapi.org',
      path: `/v2/top-headlines?country=kr&apiKey=${NEWS_API_KEY}`,
      method: 'GET'
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.articles && parsed.articles.length > 0) {
            const trends = parsed.articles.slice(0, 6).map(article => {
              // 카테고리 추정
              const title = article.title || '';
              const desc = article.description || '';
              const combined = title + ' ' + desc;
              
              let category = 'general';
              if (combined.match(/아이돌|가수|음악|콘서트|K-?pop|BTS|블랙핑크/i)) {
                category = 'entertainment';
              } else if (combined.match(/게임|e스포츠|리그오브|배틀그라운드|롤|LOL/i)) {
                category = 'gaming';
              } else if (combined.match(/인스타|유튜브|틱톡|SNS|인플루언서/i)) {
                category = 'social';
              } else if (combined.match(/커피|음식|카페|맛집|요리/i)) {
                category = 'food';
              } else if (combined.match(/패션|뷰티|화장|옷|스타일/i)) {
                category = 'fashion';
              } else if (combined.match(/환경|탄소|전기차|친환경|재활용/i)) {
                category = 'environment';
              }
              
              return {
                keyword: title.split(' ').slice(0, 3).join(' '),
                category: category,
                description: desc || title
              };
            });
            
            resolve(trends.slice(0, 3));
          } else {
            reject(new Error('No articles found'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// 메인 실행
if (require.main === module) {
  generateTrendyApps().catch(console.error);
}
