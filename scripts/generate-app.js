// scripts/generate-app.js
const fs = require('fs');
const path = require('path');
const https = require('https');

// News API 무료 키 (월 1000회 제한)
// https://newsapi.org 에서 무료 API 키를 받아서 교체하세요
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'YOUR_API_KEY_HERE';

// 트렌드 키워드에 따른 앱 템플릿
const trendingAppTemplates = {
  // 스포츠 관련
  sports: [
    {
      type: '승부 예측 게임',
      template: (keyword, data) => generateSportsPrediction(keyword, data)
    },
    {
      type: '선수 통계 비교',
      template: (keyword, data) => generatePlayerStats(keyword, data)
    },
    {
      type: '팀 응원 카운터',
      template: (keyword, data) => generateTeamSupport(keyword, data)
    }
  ],
  
  // 정치/선거 관련
  politics: [
    {
      type: '여론조사 시뮬레이터',
      template: (keyword, data) => generatePollSimulator(keyword, data)
    },
    {
      type: '정책 비교 도구',
      template: (keyword, data) => generatePolicyCompare(keyword, data)
    },
    {
      type: '선거 카운트다운',
      template: (keyword, data) => generateElectionCountdown(keyword, data)
    }
  ],
  
  // 경제/금융 관련
  finance: [
    {
      type: '환율 계산기',
      template: (keyword, data) => generateCurrencyCalc(keyword, data)
    },
    {
      type: '투자 수익률 계산기',
      template: (keyword, data) => generateROICalculator(keyword, data)
    },
    {
      type: '물가 상승률 체감 도구',
      template: (keyword, data) => generateInflationTool(keyword, data)
    }
  ],
  
  // 엔터테인먼트 관련
  entertainment: [
    {
      type: '인기도 투표',
      template: (keyword, data) => generatePopularityVote(keyword, data)
    },
    {
      type: '팬덤 퀴즈',
      template: (keyword, data) => generateFanQuiz(keyword, data)
    },
    {
      type: '콘텐츠 추천 룰렛',
      template: (keyword, data) => generateContentRoulette(keyword, data)
    }
  ],
  
// 기술/IT 관련
technology: [
  {
    type: 'AI 대화 시뮬레이터',
    template: (keyword, data) => generateAIChat(keyword, data)
  },
  {
    type: '키워드 빙고 게임',
    template: (keyword, data) => generateKeywordBingo(keyword, data)  // 있는 함수로 대체
  },
  {
    type: '팬덤 퀴즈',
    template: (keyword, data) => generateFanQuiz(keyword, data)  // 있는 함수로 대체
  }
],
  // 날씨/환경 관련
  weather: [
    {
      type: '날씨 기분 일기',
      template: (keyword, data) => generateWeatherMood(keyword, data)
    },
    {
      type: '환경 보호 챌린지',
      template: (keyword, data) => generateEcoChallenge(keyword, data)
    },
    {
      type: '계절 활동 추천',
      template: (keyword, data) => generateSeasonActivity(keyword, data)
    }
  ],
  
  // 건강/의료 관련
  health: [
    {
      type: '증상 체크리스트',
      template: (keyword, data) => generateSymptomChecker(keyword, data)
    },
    {
      type: '건강 습관 트래커',
      template: (keyword, data) => generateHealthTracker(keyword, data)
    },
    {
      type: '운동 타이머',
      template: (keyword, data) => generateExerciseTimer(keyword, data)
    }
  ],
  
  // 기본/일반
  general: [
    {
      type: '키워드 빙고 게임',
      template: (keyword, data) => generateKeywordBingo(keyword, data)
    },
    {
      type: '트렌드 단어 구름',
      template: (keyword, data) => generateWordCloud(keyword, data)
    },
    {
      type: '해시태그 생성기',
      template: (keyword, data) => generateHashtagMaker(keyword, data)
    }
  ]
};

// 뉴스 API에서 트렌딩 토픽 가져오기
async function fetchTrendingTopics() {
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
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// 키워드 카테고리 분류
function categorizeKeyword(keyword, description) {
  const categories = {
    sports: ['축구', '야구', '농구', '올림픽', '월드컵', '리그', '선수', '감독', '경기', '승리', '패배'],
    politics: ['대통령', '선거', '정치', '국회', '법안', '정책', '여당', '야당', '투표', '공약'],
    finance: ['주식', '코인', '비트코인', '환율', '경제', '금리', '부동산', '투자', '상승', '하락'],
    entertainment: ['영화', '드라마', '음악', '콘서트', '배우', '가수', '아이돌', 'K-pop', '넷플릭스'],
    technology: ['AI', '인공지능', 'GPT', '스마트폰', '삼성', '애플', '구글', '메타', '로봇', '자율주행'],
    weather: ['날씨', '비', '눈', '태풍', '폭염', '한파', '미세먼지', '기후', '온도'],
    health: ['코로나', '독감', '백신', '병원', '의료', '건강', '운동', '다이어트', '정신건강']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => keyword.includes(kw) || description.includes(kw))) {
      return category;
    }
  }
  return 'general';
}

// 메인 앱 생성 함수
async function generateTrendingApps() {
  console.log('🔍 트렌딩 토픽을 가져오는 중...');
  
  let trendingData;
  let topKeywords = [];
  
  try {
    // 실제 API 호출 (API 키가 있을 경우)
    if (NEWS_API_KEY !== 'YOUR_API_KEY_HERE') {
      trendingData = await fetchTrendingTopics();
      
      if (trendingData.articles && trendingData.articles.length > 0) {
        // 상위 3개 기사에서 키워드 추출
        topKeywords = trendingData.articles.slice(0, 3).map(article => ({
          keyword: article.title.split(' ')[0],
          description: article.description || article.title,
          source: article.source.name
        }));
      }
    }
  } catch (error) {
    console.log('⚠️ API 호출 실패, 대체 키워드 사용');
  }
  
  // API 실패시 또는 키가 없을 경우 대체 트렌딩 키워드 사용
  if (topKeywords.length === 0) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // 요일별 다른 트렌드 시뮬레이션
    const fallbackTrends = [
      { keyword: 'AI 혁신', description: 'GPT-5 출시 임박, AI 기술 새로운 전환점', source: '테크뉴스' },
      { keyword: '프로야구', description: 'KBO 리그 순위 경쟁 치열, 1위 자리 놓고 3파전', source: '스포츠투데이' },
      { keyword: '환율 급등', description: '달러 환율 1400원 돌파, 경제 불안정성 증가', source: '경제신문' },
      { keyword: 'K-드라마', description: '넷플릭스 한국 드라마 전세계 1위 등극', source: '엔터뉴스' },
      { keyword: '폭염 경보', description: '전국 폭염특보, 역대 최고 기온 경신', source: '날씨뉴스' },
      { keyword: '전기차', description: '테슬라 한국 공장 설립 확정, 일자리 1만개 창출', source: '자동차신문' },
      { keyword: '부동산', description: '서울 아파트 가격 반등, 거래량 증가세', source: '부동산타임즈' }
    ];
    
    // 요일에 따라 다른 조합 선택
    topKeywords = [
      fallbackTrends[dayOfWeek % fallbackTrends.length],
      fallbackTrends[(dayOfWeek + 1) % fallbackTrends.length],
      fallbackTrends[(dayOfWeek + 2) % fallbackTrends.length]
    ];
  }
  
  // 날짜별 폴더 생성
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const appsDir = path.join(__dirname, '..', 'apps', dateStr);
  
  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir, { recursive: true });
  }
  
  // 오늘의 트렌드 정보 저장
  const trendInfo = {
    date: dateStr,
    keywords: topKeywords,
    generatedApps: []
  };
  
  // 3개의 앱 생성
  for (let i = 0; i < topKeywords.length; i++) {
    const { keyword, description, source } = topKeywords[i];
    const category = categorizeKeyword(keyword, description);
    const templates = trendingAppTemplates[category];
    const appTemplate = templates[i % templates.length];
    
    const appName = `${keyword} ${appTemplate.type}`;
    const appId = `app${i + 1}`;
    const appDir = path.join(appsDir, appId);
    
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    
    // HTML 생성
    const htmlContent = appTemplate.template(keyword, {
      description,
      source,
      date: dateStr
    });
    
    fs.writeFileSync(path.join(appDir, 'index.html'), htmlContent);
    
    trendInfo.generatedApps.push({
      id: appId,
      name: appName,
      keyword: keyword,
      type: appTemplate.type,
      category: category,
      source: source
    });
    
    console.log(`✅ 앱 생성 완료: ${appName}`);
  }
  
  // 트렌드 정보 JSON 저장
  fs.writeFileSync(
    path.join(appsDir, 'trend-info.json'), 
    JSON.stringify(trendInfo, null, 2)
  );
  
  // 인덱스 페이지 생성
  generateIndexPage(appsDir, trendInfo);
  
  // README 업데이트
  updateReadme(trendInfo);
  
  console.log(`🎉 ${dateStr} 트렌딩 앱 3개 생성 완료!`);
}

// 인덱스 페이지 생성
function generateIndexPage(appsDir, trendInfo) {
  const indexHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${trendInfo.date} 트렌딩 앱</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            margin-bottom: 10px;
            font-size: 2.5rem;
        }
        .date {
            color: rgba(255,255,255,0.8);
            text-align: center;
            margin-bottom: 40px;
            font-size: 1.2rem;
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
        }
        .app-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .keyword {
            background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
            color: white;
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        .app-title {
            font-size: 1.8rem;
            margin-bottom: 15px;
            color: #333;
        }
        .app-type {
            color: #666;
            margin-bottom: 10px;
        }
        .source {
            font-size: 0.9rem;
            color: #999;
            margin-bottom: 20px;
        }
        .launch-button {
            display: block;
            width: 100%;
            padding: 15px;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
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
        .trend-summary {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 30px;
            color: white;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔥 오늘의 트렌딩 앱</h1>
        <div class="date">${new Date(trendInfo.date).toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        })}</div>
        
        <div class="trend-summary">
            <p>오늘의 핫 키워드를 기반으로 자동 생성된 인터랙티브 앱 3개</p>
        </div>
        
        <div class="apps-grid">
            ${trendInfo.generatedApps.map(app => `
                <div class="app-card">
                    <div class="keyword">${app.keyword}</div>
                    <h2 class="app-title">${app.name}</h2>
                    <p class="app-type">타입: ${app.type}</p>
                    <p class="source">출처: ${app.source}</p>
                    <a href="${app.id}/index.html" class="launch-button">
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

// 승부 예측 게임 템플릿
function generateSportsPrediction(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} 승부 예측 게임</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(to bottom, #1e3c72, #2a5298);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .game-container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2rem;
        }
        .teams {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
        }
        .team {
            text-align: center;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .team:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.05);
        }
        .team.selected {
            background: rgba(76, 175, 80, 0.5);
            border: 2px solid #4CAF50;
        }
        .vs {
            font-size: 2rem;
            font-weight: bold;
        }
        .team-name {
            font-size: 1.5rem;
            margin-bottom: 10px;
        }
        .team-score {
            font-size: 3rem;
            font-weight: bold;
        }
        .prediction-input {
            margin: 20px 0;
            text-align: center;
        }
        input[type="number"] {
            width: 80px;
            padding: 10px;
            font-size: 1.5rem;
            border: none;
            border-radius: 10px;
            text-align: center;
            margin: 0 10px;
        }
        .submit-btn {
            display: block;
            width: 100%;
            padding: 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        .submit-btn:hover {
            background: #45a049;
        }
        .results {
            margin-top: 30px;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            text-align: center;
            display: none;
        }
        .trending-info {
            text-align: center;
            margin-bottom: 20px;
            font-size: 0.9rem;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>${keyword} 승부 예측 🏆</h1>
        
        <div class="trending-info">
            📰 ${data.source} | ${data.description}
        </div>
        
        <div class="teams">
            <div class="team" id="team1" onclick="selectTeam(1)">
                <div class="team-name">팀 A</div>
                <div class="team-score" id="score1">?</div>
            </div>
            <div class="vs">VS</div>
            <div class="team" id="team2" onclick="selectTeam(2)">
                <div class="team-name">팀 B</div>
                <div class="team-score" id="score2">?</div>
            </div>
        </div>
        
        <div class="prediction-input">
            <p>예상 스코어를 입력하세요:</p>
            <input type="number" id="pred1" min="0" max="99" value="0">
            :
            <input type="number" id="pred2" min="0" max="99" value="0">
        </div>
        
        <button class="submit-btn" onclick="makePrediction()">예측하기</button>
        
        <div class="results" id="results">
            <h2>예측 결과</h2>
            <p id="resultText"></p>
        </div>
    </div>
    
    <script>
        let selectedTeam = null;
        let predictions = JSON.parse(localStorage.getItem('sportsPredictions') || '{}');
        
        function selectTeam(team) {
            document.querySelectorAll('.team').forEach(t => t.classList.remove('selected'));
            document.getElementById('team' + team).classList.add('selected');
            selectedTeam = team;
        }
        
        function makePrediction() {
            const score1 = parseInt(document.getElementById('pred1').value);
            const score2 = parseInt(document.getElementById('pred2').value);
            
            // 실제 결과 시뮬레이션
            const actual1 = Math.floor(Math.random() * 5);
            const actual2 = Math.floor(Math.random() * 5);
            
            document.getElementById('score1').textContent = actual1;
            document.getElementById('score2').textContent = actual2;
            
            const winner = actual1 > actual2 ? 1 : actual2 > actual1 ? 2 : 0;
            const predWinner = score1 > score2 ? 1 : score2 > score1 ? 2 : 0;
            
            let resultText = '';
            if (winner === 0) {
                resultText = '무승부입니다! ';
            } else {
                resultText = \`팀 \${winner === 1 ? 'A' : 'B'}가 승리했습니다! \`;
            }
            
            if (predWinner === winner) {
                resultText += '🎉 승부 예측 성공!';
            } else {
                resultText += '😅 다음엔 더 잘 예측해보세요!';
            }
            
            if (Math.abs(score1 - actual1) <= 1 && Math.abs(score2 - actual2) <= 1) {
                resultText += ' 🎯 스코어도 거의 맞췄네요!';
            }
            
            document.getElementById('resultText').textContent = resultText;
            document.getElementById('results').style.display = 'block';
            
            // 예측 기록 저장
            const today = new Date().toDateString();
            if (!predictions[today]) predictions[today] = [];
            predictions[today].push({
                keyword: '${keyword}',
                predicted: [score1, score2],
                actual: [actual1, actual2],
                correct: predWinner === winner
            });
            localStorage.setItem('sportsPredictions', JSON.stringify(predictions));
        }
    </script>
</body>
</html>`;
}

// 여론조사 시뮬레이터 템플릿
function generatePollSimulator(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} 여론조사 시뮬레이터</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .poll-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
            color: #666;
        }
        .options {
            margin: 30px 0;
        }
        .option {
            background: #f0f0f0;
            padding: 20px;
            margin: 10px 0;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        .option:hover {
            background: #e0e0e0;
            transform: translateX(5px);
        }
        .option.selected {
            background: #667eea;
            color: white;
        }
        .option-text {
            font-size: 1.1rem;
            position: relative;
            z-index: 2;
        }
        .option-bar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: rgba(102, 126, 234, 0.2);
            transition: width 0.5s ease;
        }
        .option-percentage {
            float: right;
            font-weight: bold;
        }
        .vote-button {
            display: block;
            width: 100%;
            padding: 15px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
            margin-top: 20px;
        }
        .vote-button:hover {
            background: #764ba2;
        }
        .vote-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .results {
            margin-top: 30px;
            display: none;
        }
        .total-votes {
            text-align: center;
            color: #666;
            margin-top: 20px;
        }
        .chart {
            margin: 30px 0;
            height: 300px;
            position: relative;
        }
        @keyframes grow {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
        }
        .bar {
            position: absolute;
            bottom: 0;
            width: 60px;
            background: #667eea;
            border-radius: 5px 5px 0 0;
            transform-origin: bottom;
            animation: grow 1s ease-out;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${keyword} 여론조사 📊</h1>
        
        <div class="poll-info">
            <p>🔥 실시간 트렌드: ${data.description}</p>
            <p>출처: ${data.source} | ${new Date().toLocaleString('ko-KR')}</p>
        </div>
        
        <div class="options" id="options">
            <div class="option" onclick="selectOption(0)">
                <div class="option-bar" style="width: 0%"></div>
                <span class="option-text">매우 찬성</span>
                <span class="option-percentage">0%</span>
            </div>
            <div class="option" onclick="selectOption(1)">
                <div class="option-bar" style="width: 0%"></div>
                <span class="option-text">찬성</span>
                <span class="option-percentage">0%</span>
            </div>
            <div class="option" onclick="selectOption(2)">
                <div class="option-bar" style="width: 0%"></div>
                <span class="option-text">중립</span>
                <span class="option-percentage">0%</span>
            </div>
            <div class="option" onclick="selectOption(3)">
                <div class="option-bar" style="width: 0%"></div>
                <span class="option-text">반대</span>
                <span class="option-percentage">0%</span>
            </div>
            <div class="option" onclick="selectOption(4)">
                <div class="option-bar" style="width: 0%"></div>
                <span class="option-text">매우 반대</span>
                <span class="option-percentage">0%</span>
            </div>
        </div>
        
        <button class="vote-button" onclick="submitVote()" id="voteBtn">투표하기</button>
        
        <div class="results" id="results">
            <h2>📊 실시간 여론조사 결과</h2>
            <div class="chart" id="chart"></div>
        </div>
        
        <div class="total-votes" id="totalVotes">
            총 참여자: 0명
        </div>
    </div>
    
    <script>
        let selectedOption = null;
        let hasVoted = false;
        
        // 로컬 스토리지에서 투표 데이터 가져오기
        const pollKey = 'poll_' + '${keyword}'.replace(/\s/g, '_');
        let pollData = JSON.parse(localStorage.getItem(pollKey) || '{"votes": [0,0,0,0,0], "totalVotes": 0}');
        
        // 초기 데이터에 약간의 랜덤 투표 추가 (더 현실적으로 보이게)
        if (pollData.totalVotes === 0) {
            for (let i = 0; i < 5; i++) {
                pollData.votes[i] = Math.floor(Math.random() * 20) + 5;
                pollData.totalVotes += pollData.votes[i];
            }
            localStorage.setItem(pollKey, JSON.stringify(pollData));
        }
        
        function updateDisplay() {
            const options = document.querySelectorAll('.option');
            options.forEach((option, index) => {
                const percentage = pollData.totalVotes > 0 
                    ? Math.round((pollData.votes[index] / pollData.totalVotes) * 100) 
                    : 0;
                option.querySelector('.option-percentage').textContent = percentage + '%';
                option.querySelector('.option-bar').style.width = percentage + '%';
            });
            
            document.getElementById('totalVotes').textContent = '총 참여자: ' + pollData.totalVotes + '명';
        }
        
        function selectOption(index) {
            if (hasVoted) return;
            
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            document.querySelectorAll('.option')[index].classList.add('selected');
            selectedOption = index;
        }
        
        function submitVote() {
            if (selectedOption === null) {
                alert('옵션을 선택해주세요!');
                return;
            }
            
            if (hasVoted) {
                alert('이미 투표하셨습니다!');
                return;
            }
            
            // 투표 추가
            pollData.votes[selectedOption]++;
            pollData.totalVotes++;
            localStorage.setItem(pollKey, JSON.stringify(pollData));
            
            hasVoted = true;
            document.getElementById('voteBtn').disabled = true;
            document.getElementById('voteBtn').textContent = '투표 완료!';
            
            // 결과 표시
            updateDisplay();
            showResults();
        }
        
        function showResults() {
            document.getElementById('results').style.display = 'block';
            
            // 차트 그리기
            const chart = document.getElementById('chart');
            chart.innerHTML = '';
            
            const maxVotes = Math.max(...pollData.votes);
            const labels = ['매우 찬성', '찬성', '중립', '반대', '매우 반대'];
            
            pollData.votes.forEach((votes, index) => {
                const height = maxVotes > 0 ? (votes / maxVotes) * 250 : 0;
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = height + 'px';
                bar.style.left = (index * 150 + 50) + 'px';
                bar.style.backgroundColor = 
                    index < 2 ? '#4CAF50' : 
                    index === 2 ? '#FFC107' : 
                    '#F44336';
                
                const label = document.createElement('div');
                label.style.position = 'absolute';
                label.style.bottom = '-30px';
                label.style.left = (index * 150 + 20) + 'px';
                label.style.width = '120px';
                label.style.textAlign = 'center';
                label.style.fontSize = '0.9rem';
                label.textContent = labels[index];
                
                const count = document.createElement('div');
                count.style.position = 'absolute';
                count.style.bottom = (height + 10) + 'px';
                count.style.left = (index * 150 + 50) + 'px';
                count.style.width = '60px';
                count.style.textAlign = 'center';
                count.style.fontWeight = 'bold';
                count.textContent = votes;
                
                chart.appendChild(bar);
                chart.appendChild(label);
                chart.appendChild(count);
            });
        }
        
        // 초기 표시 업데이트
        updateDisplay();
        
        // 실시간 업데이트 시뮬레이션 (5초마다)
        setInterval(() => {
            // 랜덤하게 투표 추가 (다른 사용자가 투표하는 것처럼)
            if (Math.random() < 0.3) {
                const randomOption = Math.floor(Math.random() * 5);
                pollData.votes[randomOption]++;
                pollData.totalVotes++;
                localStorage.setItem(pollKey, JSON.stringify(pollData));
                updateDisplay();
                if (hasVoted) showResults();
            }
        }, 5000);
    </script>
</body>
</html>`;
}

// 환율 계산기 템플릿
function generateCurrencyCalc(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} 환율 계산기</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .calculator {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
        }
        .trend-info {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 30px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .currency-input {
            margin-bottom: 30px;
        }
        label {
            display: block;
            margin-bottom: 10px;
            color: #555;
            font-weight: 500;
        }
        .input-group {
            display: flex;
            align-items: center;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 5px;
        }
        input[type="number"] {
            flex: 1;
            border: none;
            background: none;
            padding: 15px;
            font-size: 1.5rem;
            outline: none;
        }
        .currency-symbol {
            padding: 0 15px;
            color: #666;
            font-size: 1.2rem;
            font-weight: 500;
        }
        .exchange-rate {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background: #f0f8ff;
            border-radius: 10px;
        }
        .rate-display {
            font-size: 2rem;
            color: #0066cc;
            font-weight: bold;
            margin: 10px 0;
        }
        .rate-change {
            font-size: 0.9rem;
            margin-top: 5px;
        }
        .rate-up { color: #d32f2f; }
        .rate-down { color: #388e3c; }
        .convert-button {
            width: 100%;
            padding: 15px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        .convert-button:hover {
            background: #0052a3;
        }
        .result {
            margin-top: 30px;
            padding: 20px;
            background: #e8f5e9;
            border-radius: 10px;
            text-align: center;
            display: none;
        }
        .result-amount {
            font-size: 2.5rem;
            color: #2e7d32;
            font-weight: bold;
        }
        .history {
            margin-top: 30px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
        }
        .history-item {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            font-size: 0.9rem;
            color: #666;
        }
        .history-item:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <h1>💱 ${keyword} 환율 계산기</h1>
        
        <div class="trend-info">
            📈 ${data.description}<br>
            <small>출처: ${data.source}</small>
        </div>
        
        <div class="exchange-rate">
            <div>현재 USD/KRW 환율</div>
            <div class="rate-display" id="currentRate">1,387.50</div>
            <div class="rate-change rate-up" id="rateChange">▲ 12.30 (+0.89%)</div>
        </div>
        
        <div class="currency-input">
            <label>미국 달러 (USD)</label>
            <div class="input-group">
                <span class="currency-symbol">$</span>
                <input type="number" id="usdAmount" placeholder="0.00" step="0.01">
            </div>
        </div>
        
        <button class="convert-button" onclick="convertCurrency()">환율 계산하기</button>
        
        <div class="result" id="result">
            <div>한국 원화 (KRW)</div>
            <div class="result-amount" id="krwAmount">₩ 0</div>
        </div>
        
        <div class="history" id="history">
            <h3>최근 계산 내역</h3>
            <div id="historyList"></div>
        </div>
    </div>
    
    <script>
        // 실시간 환율 시뮬레이션
        let baseRate = 1387.50;
        let currentRate = baseRate;
        let previousRate = baseRate - 12.30;
        
        // 환율 변동 시뮬레이션
        function updateRate() {
            // 작은 변동 추가
            const change = (Math.random() - 0.5) * 2;
            currentRate += change;
            
            const diff = currentRate - previousRate;
            const percentage = (diff / previousRate * 100).toFixed(2);
            
            document.getElementById('currentRate').textContent = currentRate.toFixed(2);
            
            const changeElement = document.getElementById('rateChange');
            if (diff > 0) {
                changeElement.textContent = '▲ ' + Math.abs(diff).toFixed(2) + ' (+' + Math.abs(percentage) + '%)';
                changeElement.className = 'rate-change rate-up';
            } else {
                changeElement.textContent = '▼ ' + Math.abs(diff).toFixed(2) + ' (-' + Math.abs(percentage) + '%)';
                changeElement.className = 'rate-change rate-down';
            }
        }
        
        // 환전 계산
        function convertCurrency() {
            const usdAmount = parseFloat(document.getElementById('usdAmount').value) || 0;
            const krwAmount = usdAmount * currentRate;
            
            document.getElementById('krwAmount').textContent = '₩ ' + krwAmount.toLocaleString('ko-KR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            
            document.getElementById('result').style.display = 'block';
            
            // 계산 내역 추가
            addToHistory(usdAmount, krwAmount, currentRate);
        }
        
        // 계산 내역 관리
        function addToHistory(usd, krw, rate) {
            const historyKey = 'currencyHistory_${keyword}';
            let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            
            history.unshift({
                usd: usd,
                krw: krw,
                rate: rate,
                time: new Date().toLocaleString('ko-KR')
            });
            
            // 최대 5개만 유지
            history = history.slice(0, 5);
            localStorage.setItem(historyKey, JSON.stringify(history));
            
            displayHistory();
        }
        
        // 계산 내역 표시
        function displayHistory() {
            const historyKey = 'currencyHistory_${keyword}';
            const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            const historyList = document.getElementById('historyList');
            
            historyList.innerHTML = history.map(item => \`
                <div class="history-item">
                    $\${item.usd.toFixed(2)} → ₩\${item.krw.toLocaleString('ko-KR')} 
                    (환율: \${item.rate.toFixed(2)})<br>
                    <small>\${item.time}</small>
                </div>
            \`).join('');
        }
        
        // Enter 키로 계산
        document.getElementById('usdAmount').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                convertCurrency();
            }
        });
        
        // 초기화
        updateRate();
        displayHistory();
        
        // 5초마다 환율 업데이트
        setInterval(updateRate, 5000);
    </script>
</body>
</html>`;
}

// 키워드 빙고 게임 템플릿
function generateKeywordBingo(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} 트렌드 빙고</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .game-container {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            max-width: 600px;
            width: 100%;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 20px;
        }
        .keyword-highlight {
            color: #ff6b6b;
            font-weight: bold;
        }
        .trend-context {
            background: #fff3cd;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            color: #856404;
        }
        .bingo-board {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin: 20px 0;
        }
        .bingo-cell {
            aspect-ratio: 1;
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 0.9rem;
            text-align: center;
            padding: 5px;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        .bingo-cell:hover {
            background: #e9ecef;
            transform: scale(1.05);
        }
        .bingo-cell.marked {
            background: #28a745;
            color: white;
            border-color: #28a745;
        }
        .bingo-cell.center {
            background: #ffc107;
            color: #333;
            font-weight: bold;
            pointer-events: none;
        }
        @keyframes bingo-flash {
            0%, 100% { background: #28a745; }
            50% { background: #ffc107; }
        }
        .bingo-line {
            animation: bingo-flash 1s ease-in-out 3;
        }
        .score-board {
            text-align: center;
            margin: 20px 0;
            font-size: 1.2rem;
        }
        .bingo-count {
            font-size: 2rem;
            color: #ff6b6b;
            font-weight: bold;
        }
        .reset-button {
            display: block;
            width: 100%;
            padding: 15px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
            margin-top: 20px;
        }
        .reset-button:hover {
            background: #5a6268;
        }
        .word-list {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .word-item {
            display: inline-block;
            padding: 5px 10px;
            margin: 5px;
            background: #e9ecef;
            border-radius: 5px;
            font-size: 0.9rem;
        }
        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background: #ff6b6b;
            position: absolute;
            animation: fall 3s linear;
        }
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>🎯 <span class="keyword-highlight">${keyword}</span> 트렌드 빙고</h1>
        
        <div class="trend-context">
            📰 ${data.description}<br>
            <small>출처: ${data.source} | ${data.date}</small>
        </div>
        
        <div class="score-board">
            현재 빙고: <span class="bingo-count" id="bingoCount">0</span>개
        </div>
        
        <div class="bingo-board" id="bingoBoard"></div>
        
        <button class="reset-button" onclick="resetGame()">🔄 새 게임 시작</button>
        
        <div class="word-list">
            <h3>📝 오늘의 트렌드 키워드</h3>
            <div id="wordList"></div>
        </div>
    </div>
    
    <script>
        // 트렌드 관련 단어 생성
        function generateTrendWords(keyword) {
            const baseWords = {
                'AI': ['GPT', '자동화', '딥러닝', '챗봇', '혁신', '미래', '기술', '알고리즘', '데이터', '예측'],
                '경제': ['환율', '주식', '투자', '상승', '하락', '금리', '인플레이션', '시장', '거래', '자산'],
                '스포츠': ['승리', '경기', '선수', '팀', '리그', '우승', '기록', '팬', '응원', '경쟁'],
                '정치': ['정책', '선거', '투표', '여론', '법안', '국회', '대통령', '정부', '민주', '개혁'],
                '연예': ['팬', '콘서트', '드라마', '영화', '음악', '스타', '공연', '시청률', '화제', '인기'],
                '날씨': ['기온', '비', '맑음', '구름', '예보', '태풍', '습도', '바람', '계절', '변화'],
                '기술': ['스마트폰', '앱', '업데이트', '출시', '혁신', '개발', '플랫폼', '서비스', '네트워크', '보안']
            };
            
            // 키워드에 맞는 단어 찾기
            let words = [];
            for (const [key, values] of Object.entries(baseWords)) {
                if (keyword.includes(key) || key.includes(keyword)) {
                    words = [...words, ...values];
                }
            }
            
            // 기본 단어 추가
            const defaultWords = [keyword, '트렌드', '화제', '뉴스', '이슈', '관심', '급상승', '실시간', '핫토픽', '인기'];
            words = [...new Set([...words, ...defaultWords])];
            
            // 25개로 맞추기 (5x5 빙고)
            while (words.length < 25) {
                const randomWords = ['최신', '속보', '발표', '공개', '논란', '기대', '주목', '분석', '전망', '영향'];
                words.push(randomWords[Math.floor(Math.random() * randomWords.length)]);
            }
            
            return words.slice(0, 25);
        }
        
        let board = [];
        let markedCells = new Array(25).fill(false);
        let bingoCount = 0;
        
        function initGame() {
            const words = generateTrendWords('${keyword}');
            
            // 단어 섞기
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [words[i], words[j]] = [words[j], words[i]];
            }
            
            // 가운데는 FREE
            words[12] = 'FREE';
            board = words;
            
            // 보드 렌더링
            const boardElement = document.getElementById('bingoBoard');
            boardElement.innerHTML = '';
            
            board.forEach((word, index) => {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                if (index === 12) {
                    cell.className += ' center marked';
                    markedCells[12] = true;
                }
                cell.textContent = word;
                cell.onclick = () => toggleCell(index);
                boardElement.appendChild(cell);
            });
            
            // 단어 목록 표시
            const wordListElement = document.getElementById('wordList');
            const uniqueWords = [...new Set(words.filter(w => w !== 'FREE'))];
            wordListElement.innerHTML = uniqueWords.map(word => 
                \`<span class="word-item">\${word}</span>\`
            ).join('');
            
            checkBingo();
        }
        
        function toggleCell(index) {
            if (index === 12) return; // FREE 칸은 클릭 불가
            
            markedCells[index] = !markedCells[index];
            const cells = document.querySelectorAll('.bingo-cell');
            
            if (markedCells[index]) {
                cells[index].classList.add('marked');
            } else {
                cells[index].classList.remove('marked');
            }
            
            checkBingo();
        }
        
        function checkBingo() {
            let newBingoCount = 0;
            const lines = [];
            
            // 가로 체크
            for (let i = 0; i < 5; i++) {
                if (markedCells.slice(i * 5, (i + 1) * 5).every(marked => marked)) {
                    newBingoCount++;
                    lines.push(...Array(5).fill(0).map((_, j) => i * 5 + j));
                }
            }
            
            // 세로 체크
            for (let i = 0; i < 5; i++) {
                const column = [0, 1, 2, 3, 4].map(row => markedCells[row * 5 + i]);
                if (column.every(marked => marked)) {
                    newBingoCount++;
                    lines.push(...[0, 1, 2, 3, 4].map(row => row * 5 + i));
                }
            }
            
            // 대각선 체크
            if ([0, 6, 12, 18, 24].every(i => markedCells[i])) {
                newBingoCount++;
                lines.push(0, 6, 12, 18, 24);
            }
            if ([4, 8, 12, 16, 20].every(i => markedCells[i])) {
                newBingoCount++;
                lines.push(4, 8, 12, 16, 20);
            }
            
            // 빙고 애니메이션
            if (newBingoCount > bingoCount) {
                const cells = document.querySelectorAll('.bingo-cell');
                lines.forEach(index => {
                    cells[index].classList.add('bingo-line');
                });
                
                // 축하 효과
                createConfetti();
                
                setTimeout(() => {
                    cells.forEach(cell => cell.classList.remove('bingo-line'));
                }, 3000);
            }
            
            bingoCount = newBingoCount;
            document.getElementById('bingoCount').textContent = bingoCount;
            
            // 모든 칸을 채웠을 때
            if (markedCells.filter(m => m).length === 25 && bingoCount > 0) {
                setTimeout(() => {
                    alert('🎉 완벽한 빙고! 모든 트렌드를 마스터했습니다!');
                }, 500);
            }
        }
        
        function createConfetti() {
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.background = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1'][Math.floor(Math.random() * 4)];
                    confetti.style.animationDelay = Math.random() * 0.5 + 's';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => confetti.remove(), 3000);
                }, i * 30);
            }
        }
        
        function resetGame() {
            markedCells = new Array(25).fill(false);
            bingoCount = 0;
            initGame();
        }
        
        // 게임 시작
        initGame();
    </script>
</body>
</html>`;
}

// README 업데이트 함수
function updateReadme(trendInfo) {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent = '';
  
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  } else {
    readmeContent = `# 🔥 트렌드 기반 자동 앱 생성기

매일 실시간 트렌드를 분석하여 관련 웹 앱을 자동으로 생성합니다!

## 🚀 특징

- 📰 뉴스 API를 통한 실시간 트렌드 수집
- 🤖 트렌드 키워드 기반 맞춤형 앱 자동 생성
- 🎮 인터랙티브하고 재미있는 미니 앱
- 📊 카테고리별 특화된 앱 템플릿
- 🔄 매일 3개의 새로운 앱 자동 생성

## 📱 최근 생성된 앱들

`;
  }
  
  // 새 앱 정보 추가
  const newEntry = `### 📅 ${new Date(trendInfo.date).toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}

**오늘의 트렌드 키워드:**
${trendInfo.keywords.map(k => `- 🔸 ${k.keyword} (${k.source})`).join('\n')}

**생성된 앱:**
${trendInfo.generatedApps.map((app, index) => 
  `${index + 1}. [${app.name}](apps/${trendInfo.date}/${app.id}/index.html) - ${app.category} 카테고리`
).join('\n')}

[🎯 오늘의 앱 모두 보기](apps/${trendInfo.date}/index.html)

---

`;
  
  // "## 📱 최근 생성된 앱들" 섹션 찾기
  const sectionIndex = readmeContent.indexOf('## 📱 최근 생성된 앱들');
  if (sectionIndex !== -1) {
    const insertIndex = readmeContent.indexOf('\n', sectionIndex) + 2;
    readmeContent = readmeContent.slice(0, insertIndex) + newEntry + readmeContent.slice(insertIndex);
  }
  
  fs.writeFileSync(readmePath, readmeContent);
}

// 추가 템플릿 함수들...

// AI 대화 시뮬레이터
function generateAIChat(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} AI 대화 시뮬레이터</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f0f0f;
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .chat-container {
            background: #1a1a1a;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        h1 {
            text-align: center;
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }
        .trend-badge {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            padding: 10px 20px;
            border-radius: 20px;
            text-align: center;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }
        .chat-box {
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 15px;
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            margin-bottom: 20px;
        }
        .message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .message.user {
            flex-direction: row-reverse;
        }
        .message-content {
            background: #252525;
            padding: 10px 15px;
            border-radius: 10px;
            max-width: 70%;
        }
        .message.user .message-content {
            background: #00ff88;
            color: #000;
        }
        .message.ai .message-content {
            background: #1e3a5f;
        }
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        .avatar.ai {
            background: linear-gradient(135deg, #00ff88, #00d4ff);
            color: #000;
        }
        .avatar.user {
            background: #555;
        }
        .typing-indicator {
            display: none;
            padding: 10px;
            color: #888;
        }
        .typing-indicator span {
            animation: blink 1.4s infinite;
            animation-delay: 0s;
        }
        .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes blink {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
        }
        .input-area {
            display: flex;
            gap: 10px;
        }
        .input-field {
            flex: 1;
            background: #252525;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 15px;
            color: #fff;
            font-size: 1rem;
        }
        .send-button {
            background: linear-gradient(135deg, #00ff88, #00d4ff);
            color: #000;
            border: none;
            border-radius: 10px;
            padding: 15px 30px;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.3s;
        }
        .send-button:hover {
            opacity: 0.9;
        }
        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <h1>🤖 ${keyword} AI 대화</h1>
        
        <div class="trend-badge">
            💡 ${data.description}
        </div>
        
        <div class="chat-box" id="chatBox">
            <div class="message ai">
                <div class="avatar ai">AI</div>
                <div class="message-content">
                    안녕하세요! ${keyword}에 대해 이야기해보고 싶으신가요? 최신 트렌드와 정보를 바탕으로 대화할 수 있습니다.
                </div>
            </div>
        </div>
        
        <div class="typing-indicator" id="typingIndicator">
            AI가 입력 중입니다<span>.</span><span>.</span><span>.</span>
        </div>
        
        <div class="input-area">
            <input type="text" class="input-field" id="userInput" 
                   placeholder="${keyword}에 대해 물어보세요..." 
                   onkeypress="handleKeyPress(event)">
            <button class="send-button" id="sendButton" onclick="sendMessage()">전송</button>
        </div>
    </div>
    
    <script>
        const keyword = '${keyword}';
        const responses = {
            general: [
                '흥미로운 질문이네요! ${keyword}은(는) 최근 많은 관심을 받고 있습니다.',
                '${keyword}에 대한 다양한 의견이 있죠. 어떤 측면이 가장 궁금하신가요?',
                '최신 트렌드를 보면 ${keyword}의 영향력이 점점 커지고 있어요.',
                '많은 사람들이 ${keyword}에 대해 이야기하고 있습니다. 특별한 이유가 있을까요?'
            ],
            positive: [
                '정말 그렇습니다! ${keyword}의 긍정적인 면을 잘 보셨네요.',
                '맞아요. ${keyword}은(는) 우리 생활에 좋은 영향을 미치고 있죠.',
                '동의합니다. ${keyword}의 발전이 기대되는 부분이에요.'
            ],
            negative: [
                '우려되는 점도 있죠. ${keyword}의 부정적 측면도 고려해야 합니다.',
                '걱정이 되시는군요. ${keyword}에 대한 균형잡힌 시각이 필요해요.',
                '그런 관점도 있습니다. ${keyword}의 문제점을 어떻게 해결할 수 있을까요?'
            ],
            question: [
                '${keyword}에 대해 더 알고 싶으신 것 같네요. 구체적으로 어떤 부분이 궁금하신가요?',
                '좋은 질문입니다! ${keyword}의 어떤 측면에 대해 이야기해볼까요?',
                '${keyword}은(는) 복잡한 주제죠. 함께 탐구해보면 좋겠네요.'
            ]
        };
        
        function getAIResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            if (lowerMessage.includes('?') || lowerMessage.includes('무엇') || lowerMessage.includes('어떻게')) {
                return responses.question[Math.floor(Math.random() * responses.question.length)];
            } else if (lowerMessage.includes('좋') || lowerMessage.includes('훌륭') || lowerMessage.includes('최고')) {
                return responses.positive[Math.floor(Math.random() * responses.positive.length)];
            } else if (lowerMessage.includes('나쁘') || lowerMessage.includes('문제') || lowerMessage.includes('걱정')) {
                return responses.negative[Math.floor(Math.random() * responses.negative.length)];
            } else {
                return responses.general[Math.floor(Math.random() * responses.general.length)];
            }
        }
        
        function addMessage(content, isUser = false) {
            const chatBox = document.getElementById('chatBox');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + (isUser ? 'user' : 'ai');
            
            messageDiv.innerHTML = \`
                <div class="avatar \${isUser ? 'user' : 'ai'}">\${isUser ? 'You' : 'AI'}</div>
                <div class="message-content">\${content}</div>
            \`;
            
            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        
        function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // 사용자 메시지 추가
            addMessage(message, true);
            input.value = '';
            
            // 버튼 비활성화
            document.getElementById('sendButton').disabled = true;
            document.getElementById('typingIndicator').style.display = 'block';
            
            // AI 응답 시뮬레이션
            setTimeout(() => {
                const response = getAIResponse(message).replace(/\${keyword}/g, keyword);
                addMessage(response);
                
                document.getElementById('sendButton').disabled = false;
                document.getElementById('typingIndicator').style.display = 'none';
            }, 1500 + Math.random() * 1000);
        }
        
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
        
        // 초기 포커스
        document.getElementById('userInput').focus();
    </script>
</body>
</html>`;
}

// 팬덤 퀴즈 템플릿
function generateFanQuiz(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} 팬덤 퀴즈</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .quiz-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
        }
        .trend-info {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 30px;
        }
        .quiz-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .question-counter {
            font-weight: bold;
            color: #667eea;
        }
        .score {
            font-weight: bold;
            color: #28a745;
        }
        .question {
            font-size: 1.3rem;
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }
        .options {
            display: grid;
            gap: 15px;
        }
        .option {
            padding: 20px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            font-size: 1.1rem;
        }
        .option:hover {
            background: #e9ecef;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .option.selected {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
        .option.correct {
            background: #28a745;
            color: white;
            border-color: #28a745;
        }
        .option.incorrect {
            background: #dc3545;
            color: white;
            border-color: #dc3545;
        }
        .next-button {
            display: none;
            margin: 30px auto 0;
            padding: 15px 40px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        .next-button:hover {
            background: #764ba2;
        }
        .result-screen {
            display: none;
            text-align: center;
        }
        .result-title {
            font-size: 2rem;
            margin-bottom: 20px;
            color: #333;
        }
        .result-score {
            font-size: 3rem;
            color: #667eea;
            margin-bottom: 20px;
        }
        .result-message {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 30px;
        }
        .restart-button {
            padding: 15px 40px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        .restart-button:hover {
            background: #218838;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .pulse {
            animation: pulse 0.5s ease-in-out;
        }
    </style>
</head>
<body>
    <div class="quiz-container">
        <h1>🎯 ${keyword} 팬덤 퀴즈</h1>
        <div class="trend-info">
            ${data.description} | ${data.source}
        </div>
        
        <div id="quizScreen">
            <div class="quiz-header">
                <div class="question-counter">
                    문제 <span id="currentQuestion">1</span> / <span id="totalQuestions">5</span>
                </div>
                <div class="score">
                    점수: <span id="currentScore">0</span>
                </div>
            </div>
            
            <div class="question" id="questionText"></div>
            
            <div class="options" id="optionsContainer"></div>
            
            <button class="next-button" id="nextButton" onclick="nextQuestion()">다음 문제 →</button>
        </div>
        
        <div class="result-screen" id="resultScreen">
            <h2 class="result-title">퀴즈 완료! 🎉</h2>
            <div class="result-score" id="finalScore"></div>
            <div class="result-message" id="resultMessage"></div>
            <button class="restart-button" onclick="restartQuiz()">다시 도전하기</button>
        </div>
    </div>
    
    <script>
        const keyword = '${keyword}';
        
        // 키워드별 퀴즈 생성
        function generateQuizQuestions(keyword) {
            const baseQuestions = [
                {
                    question: \`\${keyword}와 가장 관련이 깊은 것은?\`,
                    options: ['최신 트렌드', '전통 문화', '고전 예술', '역사적 사건'],
                    correct: 0
                },
                {
                    question: \`\${keyword}가 화제가 된 주된 이유는?\`,
                    options: ['혁신적인 기술', '사회적 영향력', '경제적 가치', '모든 것'],
                    correct: 3
                },
                {
                    question: \`\${keyword}의 미래 전망은?\`,
                    options: ['매우 밝음', '불확실함', '점진적 성장', '급격한 변화'],
                    correct: 0
                },
                {
                    question: \`\${keyword}에 대한 대중의 반응은?\`,
                    options: ['매우 긍정적', '다소 회의적', '뜨거운 관심', '의견 분분'],
                    correct: 2
                },
                {
                    question: \`\${keyword}가 우리 생활에 미치는 영향은?\`,
                    options: ['거의 없음', '일부 영향', '상당한 영향', '혁명적 변화'],
                    correct: 2
                }
            ];
            
            return baseQuestions;
        }
        
        let questions = generateQuizQuestions(keyword);
        let currentQuestionIndex = 0;
        let score = 0;
        let selectedOption = null;
        
        function loadQuestion() {
            const question = questions[currentQuestionIndex];
            document.getElementById('questionText').textContent = question.question;
            document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
            document.getElementById('totalQuestions').textContent = questions.length;
            
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.textContent = option;
                optionElement.onclick = () => selectOption(index);
                optionsContainer.appendChild(optionElement);
            });
            
            selectedOption = null;
            document.getElementById('nextButton').style.display = 'none';
        }
        
        function selectOption(index) {
            if (selectedOption !== null) return;
            
            selectedOption = index;
            const options = document.querySelectorAll('.option');
            const correctIndex = questions[currentQuestionIndex].correct;
            
            options[index].classList.add('selected');
            
            setTimeout(() => {
                if (index === correctIndex) {
                    options[index].classList.add('correct', 'pulse');
                    score += 20;
                    document.getElementById('currentScore').textContent = score;
                } else {
                    options[index].classList.add('incorrect');
                    options[correctIndex].classList.add('correct', 'pulse');
                }
                
                document.getElementById('nextButton').style.display = 'block';
            }, 500);
        }
        
        function nextQuestion() {
            currentQuestionIndex++;
            
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                showResult();
            }
        }
        
        function showResult() {
            document.getElementById('quizScreen').style.display = 'none';
            document.getElementById('resultScreen').style.display = 'block';
            document.getElementById('finalScore').textContent = score + '점';
            
            let message = '';
            if (score >= 80) {
                message = '완벽해요! 진정한 ' + keyword + ' 전문가시네요! 🏆';
            } else if (score >= 60) {
                message = '훌륭해요! ' + keyword + '에 대해 잘 알고 계시네요! 👏';
            } else if (score >= 40) {
                message = '좋아요! ' + keyword + '에 대해 더 알아가고 있네요! 💪';
            } else {
                message = keyword + '에 대해 더 알아볼 기회예요! 화이팅! 🌟';
            }
            
            document.getElementById('resultMessage').textContent = message;
        }
        
        function restartQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            document.getElementById('currentScore').textContent = score;
            document.getElementById('quizScreen').style.display = 'block';
            document.getElementById('resultScreen').style.display = 'none';
            loadQuestion();
        }
        
        // 퀴즈 시작
        loadQuestion();
    </script>
</body>
</html>`;
}

// 메인 실행
if (require.main === module) {
  generateTrendingApps().catch(console.error);
}
// 기술 트렌드 타임라인 템플릿
function generateTechTimeline(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} 기술 타임라인</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f0f0f;
            color: #fff;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 40px;
            font-size: 2.5rem;
        }
        .timeline {
            position: relative;
            padding: 20px 0;
        }
        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, #00ff88, #00d4ff);
            transform: translateX(-50%);
        }
        .event {
            position: relative;
            margin: 40px 0;
            display: flex;
            align-items: center;
        }
        .event:nth-child(odd) {
            flex-direction: row-reverse;
        }
        .event-content {
            width: 45%;
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .event-content:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(0,255,136,0.3);
        }
        .event-dot {
            width: 20px;
            height: 20px;
            background: #00ff88;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0 0 20px #00ff88;
        }
        .event-date {
            font-size: 0.9rem;
            color: #00ff88;
            margin-bottom: 10px;
        }
        .event-title {
            font-size: 1.3rem;
            margin-bottom: 10px;
        }
        .event-description {
            color: rgba(255,255,255,0.8);
            line-height: 1.6;
        }
        .trend-info {
            text-align: center;
            background: rgba(0,255,136,0.1);
            border: 1px solid #00ff88;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 40px;
        }
        @media (max-width: 768px) {
            .timeline::before {
                left: 30px;
            }
            .event {
                flex-direction: column !important;
                margin-left: 50px;
            }
            .event-content {
                width: 100%;
            }
            .event-dot {
                left: 30px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${keyword} 기술 발전 타임라인</h1>
        
        <div class="trend-info">
            📈 ${data.description}<br>
            <small>출처: ${data.source}</small>
        </div>
        
        <div class="timeline" id="timeline"></div>
    </div>
    
    <script>
        const events = [
            {
                date: '2020년',
                title: '${keyword} 초기 개발',
                description: '혁신적인 기술의 시작점이 되었습니다.'
            },
            {
                date: '2021년',
                title: '프로토타입 공개',
                description: '첫 번째 실용적인 데모가 공개되어 큰 관심을 받았습니다.'
            },
            {
                date: '2022년',
                title: '상용화 시작',
                description: '일반 사용자들도 사용할 수 있게 되었습니다.'
            },
            {
                date: '2023년',
                title: '대중화 단계',
                description: '${keyword} 기술이 일상생활에 통합되기 시작했습니다.'
            },
            {
                date: '2024년',
                title: '혁신적 발전',
                description: '기술의 성능이 비약적으로 향상되었습니다.'
            },
            {
                date: '2025년 (현재)',
                title: '${keyword} 새로운 전환점',
                description: '${data.description}'
            }
        ];
        
        const timeline = document.getElementById('timeline');
        
        events.forEach((event, index) => {
            const eventEl = document.createElement('div');
            eventEl.className = 'event';
            eventEl.innerHTML = \`
                <div class="event-content">
                    <div class="event-date">\${event.date}</div>
                    <div class="event-title">\${event.title}</div>
                    <div class="event-description">\${event.description}</div>
                </div>
                <div class="event-dot"></div>
            \`;
            
            // 애니메이션 효과
            eventEl.style.opacity = '0';
            eventEl.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
            
            timeline.appendChild(eventEl);
            
            // 순차적으로 나타나는 애니메이션
            setTimeout(() => {
                eventEl.style.transition = 'all 0.8s ease';
                eventEl.style.opacity = '1';
                eventEl.style.transform = 'translateX(0)';
            }, index * 200);
        });
    </script>
</body>
</html>`;
}

// 선수 통계 비교 템플릿
function generatePlayerStats(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} 선수 통계 비교</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(to bottom, #1a1a2e, #16213e);
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
            font-size: 2.5rem;
        }
        .players-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 30px;
            align-items: start;
        }
        .player-card {
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
        }
        .player-name {
            font-size: 1.5rem;
            text-align: center;
            margin-bottom: 20px;
        }
        .stat-bar {
            margin: 15px 0;
        }
        .stat-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 0.9rem;
        }
        .stat-progress {
            height: 10px;
            background: rgba(255,255,255,0.2);
            border-radius: 5px;
            overflow: hidden;
        }
        .stat-fill {
            height: 100%;
            background: linear-gradient(to right, #4CAF50, #8BC34A);
            transition: width 1s ease;
        }
        .vs {
            font-size: 3rem;
            font-weight: bold;
            align-self: center;
        }
        .trend-info {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚽ ${keyword} 선수 통계 비교</h1>
        
        <div class="trend-info">
            📊 ${data.description}<br>
            <small>출처: ${data.source}</small>
        </div>
        
        <div class="players-grid">
            <div class="player-card">
                <h2 class="player-name">선수 A</h2>
                <div id="player1Stats"></div>
            </div>
            
            <div class="vs">VS</div>
            
            <div class="player-card">
                <h2 class="player-name">선수 B</h2>
                <div id="player2Stats"></div>
            </div>
        </div>
    </div>
    
    <script>
        const stats = [
            { name: '골', max: 30 },
            { name: '어시스트', max: 20 },
            { name: '패스 성공률', max: 100 },
            { name: '드리블 성공', max: 50 },
            { name: '태클 성공', max: 40 }
        ];
        
        function generateRandomStats() {
            return stats.map(stat => ({
                ...stat,
                value: Math.floor(Math.random() * stat.max * 0.7 + stat.max * 0.3)
            }));
        }
        
        function renderStats(containerId, playerStats) {
            const container = document.getElementById(containerId);
            container.innerHTML = playerStats.map(stat => \`
                <div class="stat-bar">
                    <div class="stat-label">
                        <span>\${stat.name}</span>
                        <span>\${stat.value}</span>
                    </div>
                    <div class="stat-progress">
                        <div class="stat-fill" style="width: 0%" data-width="\${(stat.value / stat.max * 100)}%"></div>
                    </div>
                </div>
            \`).join('');
            
            // 애니메이션
            setTimeout(() => {
                container.querySelectorAll('.stat-fill').forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
            }, 100);
        }
        
        renderStats('player1Stats', generateRandomStats());
        renderStats('player2Stats', generateRandomStats());
    </script>
</body>
</html>`;
}

// 팀 응원 카운터 템플릿
function generateTeamSupport(keyword, data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} 팀 응원 카운터</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 30px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            max-width: 600px;
            width: 100%;
            text-align: center;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 30px;
            color: #333;
        }
        .teams {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
        }
        .team {
            padding: 30px;
            border-radius: 20px;
            transition: transform 0.3s;
            cursor: pointer;
        }
        .team:hover {
            transform: translateY(-5px);
        }
        .team1 {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        .team2 {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
        }
        .team-name {
            font-size: 1.5rem;
            margin-bottom: 15px;
        }
        .support-count {
            font-size: 3rem;
            font-weight: bold;
            margin: 20px 0;
        }
        .support-btn {
            background: white;
            color: #333;
            border: none;
            padding: 10px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
        }
        .support-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }
        .total-supporters {
            margin-top: 30px;
            font-size: 1.2rem;
            color: #666;
        }
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        .bounce {
            animation: bounce 0.5s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏆 ${keyword} 응원 배틀</h1>
        
        <div class="teams">
            <div class="team team1" onclick="support(1)">
                <h2 class="team-name">팀 A</h2>
                <div class="support-count" id="count1">0</div>
                <button class="support-btn">응원하기 📣</button>
            </div>
            
            <div class="team team2" onclick="support(2)">
                <h2 class="team-name">팀 B</h2>
                <div class="support-count" id="count2">0</div>
                <button class="support-btn">응원하기 📣</button>
            </div>
        </div>
        
        <div class="total-supporters">
            총 <span id="totalCount">0</span>명이 응원 중!
        </div>
    </div>
    
    <script>
        // 로컬 스토리지에서 응원 데이터 가져오기
        const supportKey = 'teamSupport_${keyword}';
        let supportData = JSON.parse(localStorage.getItem(supportKey) || '{"team1": 0, "team2": 0}');
        
        // 초기값에 랜덤 추가 (더 현실적으로)
        if (supportData.team1 === 0 && supportData.team2 === 0) {
            supportData.team1 = Math.floor(Math.random() * 50) + 10;
            supportData.team2 = Math.floor(Math.random() * 50) + 10;
        }
        
        function updateDisplay() {
            document.getElementById('count1').textContent = supportData.team1;
            document.getElementById('count2').textContent = supportData.team2;
            document.getElementById('totalCount').textContent = supportData.team1 + supportData.team2;
        }
        
        function support(team) {
            const countEl = document.getElementById('count' + team);
            countEl.classList.add('bounce');
            
            if (team === 1) {
                supportData.team1++;
            } else {
                supportData.team2++;
            }
            
            localStorage.setItem(supportKey, JSON.stringify(supportData));
            updateDisplay();
            
            setTimeout(() => {
                countEl.classList.remove('bounce');
            }, 500);
        }
        
        // 초기 표시
        updateDisplay();
        
        // 실시간 업데이트 시뮬레이션
        setInterval(() => {
            // 가끔 다른 사용자가 투표하는 것처럼
            if (Math.random() < 0.1) {
                const randomTeam = Math.random() < 0.5 ? 1 : 2;
                if (randomTeam === 1) {
                    supportData.team1++;
                } else {
                    supportData.team2++;
                }
                updateDisplay();
            }
        }, 3000);
    </script>
</body>
</html>`;
}

// 정책 비교 도구 템플릿
function generatePolicyCompare(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 선거 카운트다운 템플릿
function generateElectionCountdown(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 투자 수익률 계산기 템플릿
function generateROICalculator(keyword, data) {
  return generateCurrencyCalc(keyword, data); // 임시로 다른 함수 사용
}

// 물가 상승률 체감 도구 템플릿
function generateInflationTool(keyword, data) {
  return generateCurrencyCalc(keyword, data); // 임시로 다른 함수 사용
}

// 인기도 투표 템플릿
function generatePopularityVote(keyword, data) {
  return generatePollSimulator(keyword, data); // 임시로 다른 함수 사용
}

// 콘텐츠 추천 룰렛 템플릿
function generateContentRoulette(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 스펙 비교 도구 템플릿
function generateSpecCompare(keyword, data) {
  return generatePlayerStats(keyword, data); // 임시로 다른 함수 사용
}

// 날씨 기분 일기 템플릿
function generateWeatherMood(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 환경 보호 챌린지 템플릿
function generateEcoChallenge(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 계절 활동 추천 템플릿
function generateSeasonActivity(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 증상 체크리스트 템플릿
function generateSymptomChecker(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 건강 습관 트래커 템플릿
function generateHealthTracker(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 운동 타이머 템플릿
function generateExerciseTimer(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 단어 구름 템플릿
function generateWordCloud(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}

// 해시태그 생성기 템플릿
function generateHashtagMaker(keyword, data) {
  return generateKeywordBingo(keyword, data); // 임시로 다른 함수 사용
}
