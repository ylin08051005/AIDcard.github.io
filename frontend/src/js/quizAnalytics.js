// frontend/src/js/quizAnalytics.js
// document.addEventListener('DOMContentLoaded', async function () {
//     try {
//         // 獲取所有的測驗ID
//         const quizResponse = await fetch('/api/getAllQuizzes');
//         const quizzes = await quizResponse.json();

//         const quizSelect = document.getElementById('quizSelect');

//         // 清空並填充測驗選項
//         quizSelect.innerHTML = '';
//         quizzes.forEach(quiz => {
//             const option = document.createElement('option');
//             option.value = quiz._id;
//             option.textContent = quiz.question;
//             quizSelect.appendChild(option);
//         });

//         // 取得當前選擇的測驗ID
//         let quizId = quizSelect.value;
//         let analysisType = document.getElementById('analysisType').value;

//         // 當使用者更改選單或分析類型時，更新圖表
//         quizSelect.addEventListener('change', async function () {
//             quizId = quizSelect.value;
//             await updateChart(quizId, analysisType);
//         });

//         document.getElementById('analysisType').addEventListener('change', async function () {
//             analysisType = this.value;
//             await updateChart(quizId, analysisType);
//         });

//         // 初始化圖表，顯示第一個測驗的數據
//         await updateChart(quizId, analysisType);

//          // 如果未定義 lotteryButton，則定義並添加抽獎按鈕
//          let lotteryButton = document.getElementById('lotteryButton');
//          if (!lotteryButton) {
//              lotteryButton = document.createElement('button');
//              lotteryButton.id = 'lotteryButton';
//              lotteryButton.textContent = '參加抽獎';
//              document.body.appendChild(lotteryButton);
//          }

//         // 設置抽獎按鈕
//         lotteryButton.addEventListener('click', async () => {
//             const token = localStorage.getItem('token');  // 獲取 token
//             try {
//                 const response = await fetch('/api/lottery', {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error(`Failed to participate in lottery: ${response.statusText}`);
//                 }

//                 const data = await response.json();
//                 alert(`恭喜你！你獲得了${data.msg}`);
//             } catch (error) {
//                 console.error('Error:', error);
//                 alert(`抽獎失敗: ${error.message}`);
//             }
//         });
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // 獲取所有的測驗ID
        const quizResponse = await fetch('/api/getAllQuizzes');
        const quizzes = await quizResponse.json();

        const quizSelect = document.getElementById('quizSelect');

        // 清空並填充測驗選項
        quizSelect.innerHTML = '';
        quizzes.forEach(quiz => {
            const option = document.createElement('option');
            option.value = quiz._id;
            option.textContent = quiz.question;
            quizSelect.appendChild(option);
        });

        // 取得當前選擇的測驗ID
        let quizId = quizSelect.value;
        let analysisType = document.getElementById('analysisType').value;

        // 當使用者更改選單或分析類型時，更新圖表
        quizSelect.addEventListener('change', async function () {
            quizId = quizSelect.value;
            await updateChart(quizId, analysisType);
        });

        document.getElementById('analysisType').addEventListener('change', async function () {
            analysisType = this.value;
            await updateChart(quizId, analysisType);
        });

        // 初始化圖表，顯示第一個測驗的數據
        await updateChart(quizId, analysisType);

        // 如果未定義 lotteryButton，則定義並添加抽獎按鈕
        let lotteryButton = document.getElementById('lotteryButton');
        if (!lotteryButton) {
            lotteryButton = document.createElement('button');
            lotteryButton.id = 'lotteryButton';
            lotteryButton.textContent = '參加抽獎';
            document.body.appendChild(lotteryButton);
        }

        // 設置抽獎按鈕
        lotteryButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');  // 獲取 token
            try {
                const response = await fetch('/api/lottery', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to participate in lottery: ${response.statusText}`);
                }

                const data = await response.json();
                alert(`恭喜你！你獲得了${data.msg}`);
            } catch (error) {
                console.error('Error:', error);
                alert(`抽獎失敗: ${error.message}`);
            }
        });

    } catch (error) {
        console.error('Error:', error);
        alert('無法加載測驗列表，請稍後再試。');
    }
});

let myChart = null; // 在全局範圍內定義一個變量來保存圖表實例

// 添加一個抽獎按鈕
const lotteryButton = document.createElement('button');
lotteryButton.id = 'lotteryButton';
lotteryButton.textContent = '參加抽獎';
document.body.appendChild(lotteryButton);

async function updateChart(quizId, analysisType) {
    try {
        let apiUrl = '';
        switch (analysisType) {
            case 'quizResults':
                apiUrl = `/api/quizStats/${quizId}`;
                break;
            case 'userParticipation':
                apiUrl = '/api/userParticipation';
                break;
            case 'timePerformance':
                apiUrl = '/api/timePerformance';
                break;
            case 'completionTimeDistribution':
                apiUrl = '/api/completionTimeDistribution';
                break;
            case 'cnnAccuracy':
                apiUrl = '/api/cnnAccuracy';
                break;
            case 'userProgress':
                apiUrl = '/api/userProgress';
                break;
            default:
                throw new Error('Invalid analysis type');
        }

        console.log(`Fetching data from: ${apiUrl}`);
        const token = localStorage.getItem('token'); // 假設 token 存在 localStorage
        // const response = await fetch(apiUrl);
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}` // 傳遞 token
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        // 在這裡添加用戶進度數據結構檢查
        if (analysisType === 'userProgress' && (!data || !data[0] || !data[0].timestamps)) {
            throw new Error('Invalid data structure: timestamps not found');
        }

        const ctx = document.getElementById('myChart').getContext('2d');

        if (myChart) {
            myChart.destroy();
        }

        // 根據分析類型決定要顯示的圖表類型和數據
        let chartConfig = {};
        switch (analysisType) {
            case 'quizResults':
                chartConfig = {
                    type: 'doughnut',
                    data: {
                        labels: ['總作答次數', '正確作答次數'],
                        datasets: [{
                            label: '測驗統計',
                            data: [data.totalAttempts, data.correctAttempts],
                            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
                            borderWidth: 1
                        }]
                    },
                };
                break;
            case 'userParticipation':
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: data.map(item => item.username),
                        datasets: [{
                            label: '用戶參與度',
                            data: data.map(item => item.participationCount),
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                };
                break;
            case 'timePerformance':
                chartConfig = {
                    type: 'bar',
                    data: {
                        labels: data.map(item => item.quizName),
                        datasets: [{
                            label: '平均時間 (秒)',
                            data: data.map(item => item.averageTime),
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        }, {
                            label: '平均成績',
                            data: data.map(item => item.averageScore),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                };
                break;
            case 'completionTimeDistribution':
                chartConfig = {
                    type: 'pie',
                    data: {
                        labels: data.map(item => `範圍 ${item._id} 秒`),
                        datasets: [{
                            label: '完成時間分佈',
                            data: data.map(item => item.count),
                            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                            borderWidth: 1
                        }]
                    },
                };
                break;
            case 'cnnAccuracy':
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: data.map(item => item.timestamp),
                        datasets: [{
                            label: 'CNN 準確率',
                            data: data.map(item => item.accuracy),
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        }]
                    },
                };
                break;
            case 'userProgress':
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: data[0].timestamps,
                        datasets: data.map(user => ({
                            label: user.username,
                            data: user.scores,
                            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
                            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                            borderWidth: 1
                        }))
                    },
                };
                break;
            default:
                throw new Error('Invalid analysis type');
        }

        // 創建新的圖表實例
        myChart = new Chart(ctx, {
            ...chartConfig,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });

        // 成功加載圖表後，解鎖成就
        const unlockAchievementResponse = await fetch('/api/achievements/unlockAchievement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 确保正确传递了令牌
            },
            body: JSON.stringify({
                userId: localStorage.getItem('userId'), // 從 localStorage 獲取用戶ID
                achievementId: '成就ID'  // 這裡需要動態傳遞具體的成就ID
            }),
        });

        if (!unlockAchievementResponse.ok) {
            throw new Error(`Failed to unlock achievement: ${unlockAchievementResponse.statusText}`);
        }

        const achievementData = await unlockAchievementResponse.json();
        console.log('成就解鎖成功:', achievementData.msg);

    } catch (error) {
        console.error('Error:', error);
        alert('無法獲取分析數據，請稍後再試。');
    }
}
