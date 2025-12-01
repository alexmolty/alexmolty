import fetch from 'node-fetch';
import fs from 'fs';

const apiKey = process.env.WAKATIME_API_KEY;

if (!apiKey) {
  console.error("Missing WAKATIME_API_KEY");
  process.exit(1);
}

async function getStats() {
  const res = await fetch(`https://wakatime.com/api/v1/users/current/stats/all_time`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    console.error("Error fetching stats:", res.statusText);
    process.exit(1);
  }

  return res.json();
}

function generateSVG(stats) {
  const lines = stats.data.languages.map(lang => {
    const hours = Math.floor(lang.text / 60);
    const minutes = Math.floor(lang.text % 60);
    return `<text x="10" y="${20 + stats.data.languages.indexOf(lang)*20}" font-size="14">${lang.name}: ${hours}h ${minutes}m</text>`;
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${stats.data.languages.length * 20 + 30}">
  <rect width="100%" height="100%" fill="#fff"/>
  <text x="10" y="15" font-size="16" font-weight="bold">My Waka Stats (All-Time)</text>
  ${lines.join('\n')}
</svg>
  `;
}

(async () => {
  const stats = await getStats();
  const svg = generateSVG(stats);
  fs.writeFileSync('waka-stats.svg', svg);
})();
