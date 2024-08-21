document.addEventListener('DOMContentLoaded', async function () {
    const quizSelect = document.getElementById('quizSelect');
    const quizId = quizSelect.value; // 根據用戶選擇的測驗設置 quizId

    quizSelect.addEventListener('change', async function () {
        const quizId = quizSelect.value; // 當用戶改變選擇時更新 quizId

        // 發送請求並更新圖表
        await updateChart(quizId);
    });

    // 初次載入時更新圖表
    await updateChart(quizId);
});

async function updateChart(quizId) {
    try {
        console.log(`Fetching data for quizId: ${quizId}`); // 調試訊
        const response = await fetch(`/api/quizStats/${quizId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch quiz stats: ${response.statusText}`);
        }

        const stats = await response.json();
        console.log('Fetched stats:', stats); // 調試訊息

        // 使用 Chart.js 繪製圖表
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
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
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('無法獲取測驗統計數據，請稍後再試。');
    }
}
