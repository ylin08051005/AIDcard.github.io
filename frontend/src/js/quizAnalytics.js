// document.addEventListener('DOMContentLoaded', async function () {
//     const quizSelect = document.getElementById('quizSelect'); // 取得測驗選擇的元素
//     let quizId = quizSelect.value; // 根據選擇的測驗 ID 獲取

//     quizSelect.addEventListener('change', async function () {
//         quizId = quizSelect.value; // 當用戶改變選擇時更新 quizId

//         // 發送請求並更新圖表
//         await updateChart(quizId);
//     });

//     // 初次載入時更新圖表
//     await updateChart(quizId);
// });

// async function updateChart(quizId) {
//     try {
//         console.log(`Fetching data for quizId: ${quizId}`); // 調試訊
//         const response = await fetch(`/api/quizStats/${quizId}`);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch quiz stats: ${response.statusText}`);
//         }

//         const stats = await response.json();
//         console.log('Fetched stats:', stats); // 調試訊息

//         // 使用 Chart.js 繪製圖表
//         const ctx = document.getElementById('myChart').getContext('2d');
//         new Chart(ctx, {
//             type: 'doughnut',
//             data: {
//                 labels: ['總作答次數', '正確作答次數'],
//                 datasets: [{
//                     label: '測驗統計',
//                     data: [stats.totalAttempts, stats.correctAttempts],
//                     backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)'],
//                     borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     },
//                     tooltip: {
//                         enabled: true
//                     }
//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         alert('無法獲取測驗統計數據，請稍後再試。');
//     }
// }

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

        let quizId = quizSelect.value; 

        quizSelect.addEventListener('change', async function () {
            quizId = quizSelect.value; 
            await updateChart(quizId);
        });

        await updateChart(quizId);
    } catch (error) {
        console.error('Error:', error);
        alert('無法加載測驗列表，請稍後再試。');
    }
});

let myChart = null; // 在全局範圍內定義一個變量來保存圖表實例

async function updateChart(quizId) {
    try {
        console.log(`Fetching data for quizId: ${quizId}`);
        const response = await fetch(`/api/quizStats/${quizId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch quiz stats: ${response.statusText}`);
        }

        const stats = await response.json();
        console.log('Fetched stats:', stats); // 直接打印返回的數據，看是否有正確的數據
        const ctx = document.getElementById('myChart').getContext('2d');
        
        // 如果已有圖表，先銷毀它
        if (myChart) {
            myChart.destroy();
        }

        // 創建新的圖表實例
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['總作答次數', '正確作答次數'],
                datasets: [{
                    label: '測驗統計',
                    data: [stats.totalAttempts, stats.correctAttempts],
                    backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
                    borderWidth: 1
                }]
            },
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
    } catch (error) {
        console.error('Error:', error);
        alert('無法獲取測驗統計數據，請稍後再試。');
    }
}
