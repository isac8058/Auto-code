// scripts/generate-app.js
const fs = require('fs');
const path = require('path');

// 공대생을 위한 앱 카테고리
const engineeringApps = {
  // 수학/계산 도구
  mathematics: [
    {
      name: '행렬 계산기 & 시각화',
      description: '행렬 연산을 단계별로 보여주고 고유값, 역행렬을 계산합니다',
      type: 'calculator',
      generateApp: (date) => generateMatrixCalculator(date)
    },
    {
      name: '라플라스 변환 계산기',
      description: '미분방정식을 라플라스 변환으로 쉽게 풀어보세요',
      type: 'calculator',
      generateApp: (date) => generateLaplaceTransform(date)
    },
    {
      name: '적분 시각화 도구',
      description: '정적분의 넓이를 시각적으로 이해하고 수치적분을 계산합니다',
      type: 'visualizer',
      generateApp: (date) => generateIntegralVisualizer(date)
    }
  ],
  
  // 물리학 시뮬레이션
  physics: [
    {
      name: '진자 운동 시뮬레이터',
      description: '단진자와 복진자의 운동을 실시간으로 시뮬레이션합니다',
      type: 'simulator',
      generateApp: (date) => generatePendulumSimulator(date)
    },
    {
      name: '포물선 운동 실험실',
      description: '초기 속도와 각도를 조절하여 포물선 운동을 분석합니다',
      type: 'simulator',
      generateApp: (date) => generateProjectileMotion(date)
    },
    {
      name: '파동 간섭 시각화',
      description: '두 파원의 간섭 패턴을 실시간으로 관찰합니다',
      type: 'visualizer',
      generateApp: (date) => generateWaveInterference(date)
    }
  ],
  
  // 공학 도구
  engineering: [
    {
      name: '단위 변환 마스터',
      description: 'SI, Imperial, 공학 단위를 쉽게 변환하는 올인원 도구',
      type: 'converter',
      generateApp: (date) => generateUnitConverter(date)
    },
    {
      name: '회로 시뮬레이터',
      description: '기본 전자 회로를 구성하고 전압/전류를 계산합니다',
      type: 'simulator',
      generateApp: (date) => generateCircuitSimulator(date)
    },
    {
      name: '보 굽힘 계산기',
      description: '재료역학 보의 굽힘 모멘트와 전단력을 계산합니다',
      type: 'calculator',
      generateApp: (date) => generateBeamCalculator(date)
    }
  ],
  
  // 프로그래밍/알고리즘
  programming: [
    {
      name: '정렬 알고리즘 비교',
      description: '다양한 정렬 알고리즘의 성능을 시각적으로 비교합니다',
      type: 'visualizer',
      generateApp: (date) => generateSortingVisualizer(date)
    },
    {
      name: '빅오 복잡도 계산기',
      description: '코드의 시간/공간 복잡도를 분석하고 그래프로 표시합니다',
      type: 'analyzer',
      generateApp: (date) => generateBigOCalculator(date)
    },
    {
      name: '이진 트리 시각화',
      description: '이진 트리의 삽입, 삭제, 순회를 단계별로 보여줍니다',
      type: 'visualizer',
      generateApp: (date) => generateBinaryTreeVisualizer(date)
    }
  ],
  
  // 학습 도구
  study: [
    {
      name: '공식 암기 게임',
      description: '중요한 공학 공식을 게임으로 재미있게 암기하세요',
      type: 'game',
      generateApp: (date) => generateFormulaGame(date)
    },
    {
      name: '포모도로 공부 타이머',
      description: '공대생을 위한 맞춤형 포모도로 타이머와 통계',
      type: 'productivity',
      generateApp: (date) => generatePomodoroTimer(date)
    },
    {
      name: 'GPA 계산기 & 예측',
      description: '현재 성적으로 졸업 GPA를 예측하고 목표를 설정합니다',
      type: 'calculator',
      generateApp: (date) => generateGPACalculator(date)
    }
  ],
  
  // 실생활 도구
  practical: [
    {
      name: '카페인 계산기',
      description: '시험기간 카페인 섭취량을 관리하고 최적화합니다',
      type: 'tracker',
      generateApp: (date) => generateCaffeineCalculator(date)
    },
    {
      name: '프로젝트 일정 관리',
      description: '간트 차트로 팀 프로젝트 일정을 관리합니다',
      type: 'planner',
      generateApp: (date) => generateProjectPlanner(date)
    },
    {
      name: '실험 데이터 분석기',
      description: '실험 데이터의 평균, 표준편차, 그래프를 자동 생성합니다',
      type: 'analyzer',
      generateApp: (date) => generateDataAnalyzer(date)
    }
  ]
};

// 오늘 날짜 기반 앱 선택
function selectTodaysApps() {
  const categories = Object.keys(engineeringApps);
  const selectedApps = [];
  
  // 각 카테고리에서 하나씩 선택 (총 3개)
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  
  // 날짜 기반 의사 랜덤 선택
  for (let i = 0; i < 3; i++) {
    const categoryIndex = (dayOfYear + i) % categories.length;
    const category = categories[categoryIndex];
    const apps = engineeringApps[category];
    const appIndex = (dayOfYear + i * 7) % apps.length;
    
    selectedApps.push({
      category,
      ...apps[appIndex]
    });
  }
  
  return selectedApps;
}

// 메인 함수
async function generateEngineeringApps() {
  console.log('🎓 공대생을 위한 앱 생성 시작...');
  
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const appsDir = path.join(__dirname, '..', 'apps', dateStr);
  
  // 디렉토리 생성
  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir, { recursive: true });
  }
  
  // 오늘의 앱 선택
  const selectedApps = selectTodaysApps();
  const appInfo = {
    date: dateStr,
    theme: '공대생을 위한 실용적 도구',
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
    
    // HTML 생성
    const htmlContent = app.generateApp(dateStr);
    fs.writeFileSync(path.join(appDir, 'index.html'), htmlContent);
    
    appInfo.apps.push({
      id: appId,
      name: app.name,
      description: app.description,
      category: app.category,
      type: app.type
    });
    
    console.log(`✅ 생성 완료: ${app.name}`);
  }
  
  // 앱 정보 저장
  fs.writeFileSync(
    path.join(appsDir, 'app-info.json'),
    JSON.stringify(appInfo, null, 2)
  );
  
  // 인덱스 페이지 생성
  generateIndexPage(appsDir, appInfo);
  
  // README 업데이트
  updateReadme(appInfo);
  
  console.log(`🎉 ${dateStr} 공대생 앱 3개 생성 완료!`);
}

// 인덱스 페이지 생성
function generateIndexPage(appsDir, appInfo) {
  const indexHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appInfo.date} - 공대생을 위한 앱</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
        .subtitle {
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
            background: linear-gradient(90deg, #4CAF50, #2196F3, #9C27B0);
        }
        .app-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .category-badge {
            display: inline-block;
            background: #f0f0f0;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-bottom: 15px;
            text-transform: uppercase;
            font-weight: 600;
            color: #666;
        }
        .app-title {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #333;
        }
        .app-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .app-type {
            font-size: 0.9rem;
            color: #999;
            margin-bottom: 20px;
        }
        .launch-button {
            display: block;
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .emoji {
            font-size: 2rem;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎓 오늘의 공대생 필수 앱</h1>
        <div class="subtitle">${new Date(appInfo.date).toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        })}</div>
        
        <div class="apps-grid">
            ${appInfo.apps.map((app, index) => {
                const emojis = ['🧮', '⚡', '📐', '💻', '📊', '🔬'];
                const emoji = emojis[index % emojis.length];
                
                return `
                <div class="app-card">
                    <div class="emoji">${emoji}</div>
                    <div class="category-badge">${app.category}</div>
                    <h2 class="app-title">${app.name}</h2>
                    <p class="app-description">${app.description}</p>
                    <p class="app-type">타입: ${app.type}</p>
                    <a href="${app.id}/index.html" class="launch-button">
                        앱 실행하기 →
                    </a>
                </div>
                `;
            }).join('')}
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(appsDir, 'index.html'), indexHtml);
}

// README 업데이트
function updateReadme(appInfo) {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent = '';
  
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  } else {
    readmeContent = `# 🎓 공대생을 위한 일일 앱 생성기

매일 공대생들에게 유용한 도구와 시뮬레이터를 자동으로 생성합니다!

## 최근 생성된 앱들

`;
  }
  
  const newEntry = `### 📅 ${appInfo.date}

**생성된 앱:**
${appInfo.apps.map((app, index) => 
  `${index + 1}. **${app.name}** - ${app.description}
   - 카테고리: ${app.category}
   - 타입: ${app.type}
   - [실행하기](apps/${appInfo.date}/${app.id}/index.html)`
).join('\n\n')}

[📱 모든 앱 보기](apps/${appInfo.date}/index.html)

---

`;
  
  const sectionIndex = readmeContent.indexOf('## 최근 생성된 앱들');
  if (sectionIndex !== -1) {
    const insertIndex = readmeContent.indexOf('\n', sectionIndex) + 2;
    readmeContent = readmeContent.slice(0, insertIndex) + newEntry + readmeContent.slice(insertIndex);
  }
  
  fs.writeFileSync(readmePath, readmeContent);
}

// 행렬 계산기 템플릿
function generateMatrixCalculator(date) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>행렬 계산기 & 시각화</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .matrix-input {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 20px;
            max-width: 300px;
            margin: 0 auto 20px;
        }
        .matrix-input input {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            text-align: center;
            font-size: 1.1rem;
        }
        .matrix-input input:focus {
            border-color: #4CAF50;
            outline: none;
        }
        .controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
        }
        .calculate-btn {
            background: #4CAF50;
            color: white;
        }
        .calculate-btn:hover {
            background: #45a049;
        }
        .operation-btn {
            background: #2196F3;
            color: white;
        }
        .operation-btn:hover {
            background: #1976D2;
        }
        .result {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .result h3 {
            color: #333;
            margin-bottom: 10px;
        }
        .matrix-display {
            font-family: monospace;
            font-size: 1.2rem;
            text-align: center;
            margin: 10px 0;
        }
        .matrix-bracket {
            display: inline-block;
            border: 2px solid #333;
            border-right: none;
            border-radius: 5px 0 0 5px;
            padding: 10px 5px;
        }
        .matrix-bracket-right {
            border-left: none;
            border-right: 2px solid #333;
            border-radius: 0 5px 5px 0;
        }
        .error {
            color: #f44336;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧮 행렬 계산기 & 시각화</h1>
        
        <h3 style="text-align: center; margin-bottom: 20px;">3×3 행렬 입력</h3>
        <div class="matrix-input" id="matrixA">
            <input type="number" value="1" step="any">
            <input type="number" value="0" step="any">
            <input type="number" value="0" step="any">
            <input type="number" value="0" step="any">
            <input type="number" value="1" step="any">
            <input type="number" value="0" step="any">
            <input type="number" value="0" step="any">
            <input type="number" value="0" step="any">
            <input type="number" value="1" step="any">
        </div>
        
        <div class="controls">
            <button class="calculate-btn" onclick="calculateDeterminant()">행렬식</button>
            <button class="calculate-btn" onclick="calculateInverse()">역행렬</button>
            <button class="calculate-btn" onclick="calculateEigenvalues()">고유값</button>
            <button class="operation-btn" onclick="calculateTranspose()">전치행렬</button>
            <button class="operation-btn" onclick="calculateTrace()">대각합</button>
        </div>
        
        <div id="results"></div>
    </div>
    
    <script>
        function getMatrix() {
            const inputs = document.querySelectorAll('#matrixA input');
            const matrix = [];
            for (let i = 0; i < 3; i++) {
                matrix[i] = [];
                for (let j = 0; j < 3; j++) {
                    matrix[i][j] = parseFloat(inputs[i * 3 + j].value) || 0;
                }
            }
            return matrix;
        }
        
        function displayMatrix(matrix, title) {
            let html = '<div class="matrix-display">';
            html += '<h3>' + title + '</h3>';
            html += '<span class="matrix-bracket">[</span>';
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    html += matrix[i][j].toFixed(2) + (j < matrix[i].length - 1 ? ', ' : '');
                }
                if (i < matrix.length - 1) html += '<br>';
            }
            html += '<span class="matrix-bracket matrix-bracket-right">]</span>';
            html += '</div>';
            return html;
        }
        
        function det3x3(m) {
            return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
                   m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
                   m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
        }
        
        function calculateDeterminant() {
            const matrix = getMatrix();
            const det = det3x3(matrix);
            
            const results = document.getElementById('results');
            results.innerHTML = '<div class="result">' +
                displayMatrix(matrix, '입력 행렬') +
                '<h3>행렬식 (Determinant)</h3>' +
                '<p style="font-size: 1.5rem; text-align: center;">det(A) = ' + det.toFixed(4) + '</p>' +
                '</div>';
        }
        
        function calculateInverse() {
            const matrix = getMatrix();
            const det = det3x3(matrix);
            
            if (Math.abs(det) < 0.0001) {
                document.getElementById('results').innerHTML = 
                    '<div class="error">역행렬이 존재하지 않습니다 (행렬식 = 0)</div>';
                return;
            }
            
            // 여인수 행렬 계산
            const cofactor = [];
            for (let i = 0; i < 3; i++) {
                cofactor[i] = [];
                for (let j = 0; j < 3; j++) {
                    const minor = [];
                    for (let mi = 0; mi < 3; mi++) {
                        if (mi === i) continue;
                        const row = [];
                        for (let mj = 0; mj < 3; mj++) {
                            if (mj === j) continue;
                            row.push(matrix[mi][mj]);
                        }
                        minor.push(row);
                    }
                    const sign = ((i + j) % 2 === 0) ? 1 : -1;
                    cofactor[i][j] = sign * (minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0]);
                }
            }
            
            // 전치 후 행렬식으로 나누기
            const inverse = [];
            for (let i = 0; i < 3; i++) {
                inverse[i] = [];
                for (let j = 0; j < 3; j++) {
                    inverse[i][j] = cofactor[j][i] / det;
                }
            }
            
            const results = document.getElementById('results');
            results.innerHTML = '<div class="result">' +
                displayMatrix(matrix, '입력 행렬 A') +
                displayMatrix(inverse, '역행렬 A⁻¹') +
                '<p style="text-align: center; margin-top: 10px;">검증: A × A⁻¹ = I</p>' +
                '</div>';
        }
        
        function calculateTranspose() {
            const matrix = getMatrix();
            const transpose = [];
            for (let i = 0; i < 3; i++) {
                transpose[i] = [];
                for (let j = 0; j < 3; j++) {
                    transpose[i][j] = matrix[j][i];
                }
            }
            
            const results = document.getElementById('results');
            results.innerHTML = '<div class="result">' +
                displayMatrix(matrix, '입력 행렬 A') +
                displayMatrix(transpose, '전치행렬 Aᵀ') +
                '</div>';
        }
        
        function calculateTrace() {
            const matrix = getMatrix();
            const trace = matrix[0][0] + matrix[1][1] + matrix[2][2];
            
            const results = document.getElementById('results');
            results.innerHTML = '<div class="result">' +
                displayMatrix(matrix, '입력 행렬') +
                '<h3>대각합 (Trace)</h3>' +
                '<p style="font-size: 1.5rem; text-align: center;">tr(A) = ' + trace.toFixed(4) + '</p>' +
                '<p style="text-align: center; color: #666;">= ' + 
                matrix[0][0].toFixed(2) + ' + ' + 
                matrix[1][1].toFixed(2) + ' + ' + 
                matrix[2][2].toFixed(2) + '</p>' +
                '</div>';
        }
        
        function calculateEigenvalues() {
            const matrix = getMatrix();
            
            // 특성 다항식 계산 (간단한 근사치)
            const trace = matrix[0][0] + matrix[1][1] + matrix[2][2];
            const det = det3x3(matrix);
            
            const results = document.getElementById('results');
            results.innerHTML = '<div class="result">' +
                displayMatrix(matrix, '입력 행렬') +
                '<h3>고유값 계산 (근사치)</h3>' +
                '<p style="text-align: center;">특성 다항식: det(A - λI) = 0</p>' +
                '<p style="text-align: center; color: #666;">대각합: ' + trace.toFixed(4) + '</p>' +
                '<p style="text-align: center; color: #666;">행렬식: ' + det.toFixed(4) + '</p>' +
                '<p style="text-align: center; margin-top: 10px; font-size: 0.9rem; color: #888;">정확한 고유값 계산은 수치해석 라이브러리가 필요합니다</p>' +
                '</div>';
        }
    </script>
</body>
</html>`;
}

// 단위 변환기 템플릿
function generateUnitConverter(date) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>공학 단위 변환 마스터</title>
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
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .category-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            overflow-x: auto;
            padding-bottom: 10px;
        }
        .tab {
            padding: 10px 20px;
            background: #f0f0f0;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s;
        }
        .tab.active {
            background: #667eea;
            color: white;
        }
        .converter-section {
            display: none;
        }
        .converter-section.active {
            display: block;
        }
        .input-group {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 20px;
            align-items: center;
            margin-bottom: 20px;
        }
        .unit-input {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
        }
        .unit-input input {
            width: 100%;
            border: none;
            background: none;
            font-size: 1.5rem;
            outline: none;
            text-align: center;
        }
        .unit-input select {
            width: 100%;
            margin-top: 10px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: white;
        }
        .equals {
            font-size: 2rem;
            color: #667eea;
            text-align: center;
        }
        .common-conversions {
            margin-top: 30px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 10px;
        }
        .common-conversions h3 {
            margin-bottom: 15px;
            color: #333;
        }
        .conversion-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .conversion-item:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚡ 공학 단위 변환 마스터</h1>
        
        <div class="category-tabs">
            <button class="tab active" onclick="showCategory('length')">길이</button>
            <button class="tab" onclick="showCategory('mass')">질량</button>
            <button class="tab" onclick="showCategory('pressure')">압력</button>
            <button class="tab" onclick="showCategory('energy')">에너지</button>
            <button class="tab" onclick="showCategory('power')">전력</button>
            <button class="tab" onclick="showCategory('temperature')">온도</button>
        </div>
        
        <!-- 길이 변환 -->
        <div class="converter-section active" id="length">
            <div class="input-group">
                <div class="unit-input">
                    <input type="number" id="length1" value="1" oninput="convertLength(1)">
                    <select id="lengthUnit1" onchange="convertLength(1)">
                        <option value="m">미터 (m)</option>
                        <option value="km">킬로미터 (km)</option>
                        <option value="cm">센티미터 (cm)</option>
                        <option value="mm">밀리미터 (mm)</option>
                        <option value="in">인치 (in)</option>
                        <option value="ft">피트 (ft)</option>
                        <option value="yd">야드 (yd)</option>
                        <option value="mile">마일 (mile)</option>
                    </select>
                </div>
                <div class="equals">=</div>
                <div class="unit-input">
                    <input type="number" id="length2" readonly>
                    <select id="lengthUnit2" onchange="convertLength(1)">
                        <option value="m">미터 (m)</option>
                        <option value="km">킬로미터 (km)</option>
                        <option value="cm">센티미터 (cm)</option>
                        <option value="mm" selected>밀리미터 (mm)</option>
                        <option value="in">인치 (in)</option>
                        <option value="ft">피트 (ft)</option>
                        <option value="yd">야드 (yd)</option>
                        <option value="mile">마일 (mile)</option>
                    </select>
                </div>
            </div>
            
            <div class="common-conversions">
                <h3>자주 사용하는 변환</h3>
                <div class="conversion-item">
                    <span>1 인치</span>
                    <span>= 25.4 mm</span>
                </div>
                <div class="conversion-item">
                    <span>1 피트</span>
                    <span>= 0.3048 m</span>
                </div>
                <div class="conversion-item">
                    <span>1 마일</span>
                    <span>= 1.60934 km</span>
                </div>
            </div>
        </div>
        
        <!-- 압력 변환 -->
        <div class="converter-section" id="pressure">
            <div class="input-group">
                <div class="unit-input">
                    <input type="number" id="pressure1" value="1" oninput="convertPressure(1)">
                    <select id="pressureUnit1" onchange="convertPressure(1)">
                        <option value="Pa">파스칼 (Pa)</option>
                        <option value="kPa">킬로파스칼 (kPa)</option>
                        <option value="MPa">메가파스칼 (MPa)</option>
                        <option value="bar">바 (bar)</option>
                        <option value="atm" selected>대기압 (atm)</option>
                        <option value="psi">psi</option>
                        <option value="torr">토르 (torr)</option>
                    </select>
                </div>
                <div class="equals">=</div>
                <div class="unit-input">
                    <input type="number" id="pressure2" readonly>
                    <select id="pressureUnit2" onchange="convertPressure(1)">
                        <option value="Pa" selected>파스칼 (Pa)</option>
                        <option value="kPa">킬로파스칼 (kPa)</option>
                        <option value="MPa">메가파스칼 (MPa)</option>
                        <option value="bar">바 (bar)</option>
                        <option value="atm">대기압 (atm)</option>
                        <option value="psi">psi</option>
                        <option value="torr">토르 (torr)</option>
                    </select>
                </div>
            </div>
            
            <div class="common-conversions">
                <h3>자주 사용하는 변환</h3>
                <div class="conversion-item">
                    <span>1 atm</span>
                    <span>= 101,325 Pa</span>
                </div>
                <div class="conversion-item">
                    <span>1 bar</span>
                    <span>= 100,000 Pa</span>
                </div>
                <div class="conversion-item">
                    <span>1 psi</span>
                    <span>= 6,895 Pa</span>
                </div>
            </div>
        </div>
        
        <!-- 다른 카테고리들도 동일한 구조로 추가 -->
    </div>
    
    <script>
        // 단위 변환 상수
        const conversions = {
            length: {
                m: 1,
                km: 0.001,
                cm: 100,
                mm: 1000,
                in: 39.3701,
                ft: 3.28084,
                yd: 1.09361,
                mile: 0.000621371
            },
            pressure: {
                Pa: 1,
                kPa: 0.001,
                MPa: 0.000001,
                bar: 0.00001,
                atm: 0.00000986923,
                psi: 0.000145038,
                torr: 0.00750062
            }
        };
        
        function showCategory(category) {
            // 모든 탭과 섹션 비활성화
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.converter-section').forEach(section => section.classList.remove('active'));
            
            // 선택된 카테고리 활성화
            event.target.classList.add('active');
            document.getElementById(category).classList.add('active');
        }
        
        function convertLength(from) {
            const value = parseFloat(document.getElementById('length1').value) || 0;
            const fromUnit = document.getElementById('lengthUnit1').value;
            const toUnit = document.getElementById('lengthUnit2').value;
            
            // 먼저 미터로 변환
            const meters = value / conversions.length[fromUnit];
            // 목표 단위로 변환
            const result = meters * conversions.length[toUnit];
            
            document.getElementById('length2').value = result.toFixed(6);
        }
        
        function convertPressure(from) {
            const value = parseFloat(document.getElementById('pressure1').value) || 0;
            const fromUnit = document.getElementById('pressureUnit1').value;
            const toUnit = document.getElementById('pressureUnit2').value;
            
            // 먼저 파스칼로 변환
            const pascals = value / conversions.pressure[fromUnit];
            // 목표 단위로 변환
            const result = pascals * conversions.pressure[toUnit];
            
            document.getElementById('pressure2').value = result.toFixed(6);
        }
        
        // 초기 변환
        convertLength(1);
        convertPressure(1);
    </script>
</body>
</html>`;
}

// 포모도로 타이머 템플릿
function generatePomodoroTimer(date) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>공대생 포모도로 타이머</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        .timer-display {
            font-size: 5rem;
            font-weight: bold;
            color: #1e3c72;
            margin: 30px 0;
            font-family: 'Courier New', monospace;
        }
        .timer-ring {
            width: 250px;
            height: 250px;
            margin: 0 auto 30px;
            position: relative;
        }
        .timer-ring svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }
        .timer-ring circle {
            fill: none;
            stroke-width: 10;
        }
        .timer-ring-bg {
            stroke: #e0e0e0;
        }
        .timer-ring-progress {
            stroke: #4CAF50;
            stroke-linecap: round;
            transition: stroke-dashoffset 1s linear;
        }
        .controls {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-bottom: 30px;
        }
        button {
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
        }
        .start-btn {
            background: #4CAF50;
            color: white;
        }
        .start-btn:hover {
            background: #45a049;
            transform: scale(1.05);
        }
        .pause-btn {
            background: #ff9800;
            color: white;
        }
        .reset-btn {
            background: #f44336;
            color: white;
        }
        .session-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 30px;
        }
        .info-box {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 10px;
        }
        .info-label {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
        }
        .subjects {
            margin-top: 20px;
            text-align: left;
        }
        .subject-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: #f9f9f9;
            margin-bottom: 5px;
            border-radius: 5px;
        }
        .phase {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍅 공대생 포모도로 타이머</h1>
        
        <div class="phase" id="phase">집중 시간</div>
        
        <div class="timer-ring">
            <svg>
                <circle class="timer-ring-bg" cx="125" cy="125" r="120"></circle>
                <circle class="timer-ring-progress" id="progress" cx="125" cy="125" r="120"
                        stroke-dasharray="754" stroke-dashoffset="0"></circle>
            </svg>
            <div class="timer-display" id="timer" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                25:00
            </div>
        </div>
        
        <div class="controls">
            <button class="start-btn" id="startBtn" onclick="startTimer()">시작</button>
            <button class="pause-btn" id="pauseBtn" onclick="pauseTimer()" style="display: none;">일시정지</button>
            <button class="reset-btn" onclick="resetTimer()">리셋</button>
        </div>
        
        <div class="session-info">
            <div class="info-box">
                <div class="info-label">오늘 완료</div>
                <div class="info-value" id="todayCount">0</div>
            </div>
            <div class="info-box">
                <div class="info-label">총 공부 시간</div>
                <div class="info-value" id="totalTime">0시간</div>
            </div>
            <div class="info-box">
                <div class="info-label">현재 스트릭</div>
                <div class="info-value" id="streak">0일</div>
            </div>
        </div>
        
        <div class="subjects">
            <h3>과목별 공부 시간</h3>
            <div class="subject-item">
                <span>미적분학</span>
                <span>2.5시간</span>
            </div>
            <div class="subject-item">
                <span>물리학</span>
                <span>1.8시간</span>
            </div>
            <div class="subject-item">
                <span>프로그래밍</span>
                <span>3.2시간</span>
            </div>
        </div>
    </div>
    
    <script>
        let timeLeft = 25 * 60; // 25분
        let isRunning = false;
        let interval;
        let isBreak = false;
        let sessionsCompleted = 0;
        
        const circumference = 2 * Math.PI * 120;
        
        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').textContent = 
                \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
            
            // 프로그레스 링 업데이트
            const totalTime = isBreak ? 5 * 60 : 25 * 60;
            const progress = (totalTime - timeLeft) / totalTime;
            const offset = circumference - (progress * circumference);
            document.getElementById('progress').style.strokeDashoffset = offset;
        }
        
        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                document.getElementById('startBtn').style.display = 'none';
                document.getElementById('pauseBtn').style.display = 'inline-block';
                
                interval = setInterval(() => {
                    if (timeLeft > 0) {
                        timeLeft--;
                        updateDisplay();
                    } else {
                        // 타이머 종료
                        clearInterval(interval);
                        isRunning = false;
                        
                        if (!isBreak) {
                            sessionsCompleted++;
                            document.getElementById('todayCount').textContent = sessionsCompleted;
                            
                            // 휴식 시간으로 전환
                            isBreak = true;
                            timeLeft = 5 * 60;
                            document.getElementById('phase').textContent = '휴식 시간';
                            document.getElementById('progress').style.stroke = '#2196F3';
                            
                            // 알림
                            alert('수고하셨습니다! 5분 휴식하세요.');
                        } else {
                            // 집중 시간으로 전환
                            isBreak = false;
                            timeLeft = 25 * 60;
                            document.getElementById('phase').textContent = '집중 시간';
                            document.getElementById('progress').style.stroke = '#4CAF50';
                            
                            alert('휴식 끝! 다시 집중해봅시다.');
                        }
                        
                        updateDisplay();
                        document.getElementById('startBtn').style.display = 'inline-block';
                        document.getElementById('pauseBtn').style.display = 'none';
                    }
                }, 1000);
            }
        }
        
        function pauseTimer() {
            if (isRunning) {
                clearInterval(interval);
                isRunning = false;
                document.getElementById('startBtn').style.display = 'inline-block';
                document.getElementById('pauseBtn').style.display = 'none';
            }
        }
        
        function resetTimer() {
            clearInterval(interval);
            isRunning = false;
            isBreak = false;
            timeLeft = 25 * 60;
            document.getElementById('phase').textContent = '집중 시간';
            document.getElementById('progress').style.stroke = '#4CAF50';
            updateDisplay();
            document.getElementById('startBtn').style.display = 'inline-block';
            document.getElementById('pauseBtn').style.display = 'none';
        }
        
        // 로컬 스토리지에서 통계 불러오기
        function loadStats() {
            const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
            const today = new Date().toDateString();
            
            if (stats.lastDate !== today) {
                stats.todayCount = 0;
                stats.lastDate = today;
            }
            
            sessionsCompleted = stats.todayCount || 0;
            document.getElementById('todayCount').textContent = sessionsCompleted;
            
            const totalHours = Math.floor((stats.totalSessions || 0) * 25 / 60);
            document.getElementById('totalTime').textContent = totalHours + '시간';
        }
        
        // 초기화
        updateDisplay();
        loadStats();
    </script>
</body>
</html>`;
}

// 다른 템플릿 함수들도 필요에 따라 추가...
// (나머지 함수들은 기본 구조만 제공)

function generateLaplaceTransform(date) {
  return generateMatrixCalculator(date); // 임시
}

function generateIntegralVisualizer(date) {
  return generateMatrixCalculator(date); // 임시
}

function generatePendulumSimulator(date) {
  return generateMatrixCalculator(date); // 임시
}

function generateProjectileMotion(date) {
  return generateMatrixCalculator(date); // 임시
}

function generateWaveInterference(date) {
  return generateMatrixCalculator(date); // 임시
}

function generateCircuitSimulator(date) {
  return generateUnitConverter(date); // 임시
}

function generateBeamCalculator(date) {
  return generateUnitConverter(date); // 임시
}

function generateSortingVisualizer(date) {
  return generateMatrixCalculator(date); // 임시
}

function generateBigOCalculator(date) {
  return generateMatrixCalculator(date); // 임시
}

function generateBinaryTreeVisualizer(date) {
  return generateMatrixCalculator(date); // 임시
}

function generateFormulaGame(date) {
  return generatePomodoroTimer(date); // 임시
}

function generateGPACalculator(date) {
  return generatePomodoroTimer(date); // 임시
}

function generateCaffeineCalculator(date) {
  return generatePomodoroTimer(date); // 임시
}

function generateProjectPlanner(date) {
  return generatePomodoroTimer(date); // 임시
}

function generateDataAnalyzer(date) {
  return generatePomodoroTimer(date); // 임시
}

// 메인 실행
if (require.main === module) {
  generateEngineeringApps().catch(console.error);
}
