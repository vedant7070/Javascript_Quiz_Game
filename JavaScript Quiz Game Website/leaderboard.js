function saveScore(score) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  const playerName = prompt('Enter your name for the leaderboard:') || 'Anonymous';
  leaderboard.push({ name: playerName, score, date: new Date().toLocaleDateString() });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 5)));
}

function displayLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  leaderboardList.innerHTML = leaderboard.map((entry, index) => `
    <li class="py-2">${index + 1}. ${entry.name}: ${entry.score} points (${entry.date})</li>
  `).join('');
}