import axios from "axios";
import fs from "fs";

const apiKey = process.env.WAKATIME_API_KEY;
if (!apiKey) throw new Error("Set WAKATIME_API_KEY in secrets");

const url = "https://wakatime.com/api/v1/users/current/stats/all_time";

(async () => {
  const { data } = await axios.get(url, {
    headers: { Authorization: `Basic ${Buffer.from(apiKey + ":api_token").toString("base64")}` }
  });

  const langs = data.data.languages
    .sort((a, b) => b.text_seconds - a.text_seconds)
    .slice(0, 10); // топ 10 языков

  const svgLines = langs.map(
    (l, i) => `<text x="10" y="${30 + i*30}" font-size="16">${l.name}: ${Math.floor(l.text_seconds/3600)} hrs</text>`
  );

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="${langs.length*30 + 50}">
    <text x="10" y="20" font-size="18" font-weight="bold">My WakaTime Stats</text>
    ${svgLines.join("\n")}
  </svg>
  `;

  fs.writeFileSync("waka-stats.svg", svg);
})();
