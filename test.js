const puppeteer = require('puppeteer');
const path = require('path');

// Sample data
const data = {
  rankings: [
    { player: 'Rebell', wins: 5, draws: 0, losses: 1 },
    { player: 'Zem01', wins: 5, draws: 0, losses: 2 },
    { player: 'Edmir04', wins: 5, draws: 0, losses: 2 },
    { player: 'Lahana Tursusu', wins: 4, draws: 0, losses: 2 },
    { player: 'FuriUFC', wins: 3, draws: 0, losses: 1 },
    { player: 'ANNOYIING', wins: 3, draws: 0, losses: 1 },
    { player: 'Arezmaa', wins: 3, draws: 0, losses: 2 },
    { player: 'Carnalito61', wins: 1, draws: 0, losses: 0 },
    { player: 'Bronxs_MMA', wins: 2, draws: 0, losses: 2 },
    { player: 'RushMMA', wins: 2, draws: 0, losses: 3 },
    { player: 'zFreezy', wins: 2, draws: 0, losses: 4 },
    { player: 'Seyiito', wins: 2, draws: 0, losses: 4 },
    { player: 'thegame2621', wins: 1, draws: 0, losses: 3 },
    { player: 'Simouny', wins: 1, draws: 0, losses: 3 },
    { player: 'alpi', wins: 1, draws: 0, losses: 4 },
    { player: 'Ronaldinho', wins: 0, draws: 0, losses: 4 },
  ],
};

// Function to generate HTML content
function generateHTMLTable(data) {
  const tableRows = data
    .map(
      (player, index) => `
        <tr style="${index === 0 ? 'background-color: gold; font-weight: bold;' : ''}">
            <td style="font-weight: bold; font-size: 1.1em;">${index === 0 ? 'Champ' : player.Pos}</td>
            <td>${player.Player}</td>
            <td>${player.Wins}</td>
            <td>${player.Draws}</td>
            <td>${player.Losses}</td>
            <td>${player['Win Rate (%)']}</td>
        </tr>
    `
    )
    .join('');

  return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .title-section { font-size: 1.8em; text-align: center; font-weight: bold; background-color: gold; padding: 10px; color: #fff; }
                .main-card, .prelims { font-size: 1.5em; background-color: #f44336; color: white; text-align: center; padding: 5px; margin-top: 15px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 12px 15px; border: 1px solid #ddd; text-align: center; }
                th { background-color: #333; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                tr:hover { background-color: #ddd; }
                caption { font-size: 2em; margin-bottom: 10px; font-weight: bold; color: #333; }
                td:nth-child(2) { font-weight: bold; font-size: 1.2em; }
                .subtitle { font-size: 1.2em; background-color: #ddd; padding: 8px; margin-top: 10px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="title-section">FFL - 008</div>
            <div class="main-card">Main Card</div>
            <table>
                <caption>FFL Season 01 - Rangliste</caption>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Player</th>
                        <th>Wins</th>
                        <th>Draws</th>
                        <th>Losses</th>
                        <th>Win Rate (%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <div class="prelims">Prelims</div>
        </body>
        </html>
    `;
}

// Function to rank players and return an array of objects
function rank(data) {
  const rankedPlayers = data.rankings.map((player) => {
    const totalMatches = player.wins + player.draws + player.losses;
    const winRate = totalMatches > 0 ? Math.floor((player.wins / totalMatches) * 100) : 0;

    return {
      Player: player.player,
      Wins: player.wins,
      Draws: player.draws,
      Losses: player.losses,
      'Win Rate (%)': winRate + '%',
    };
  });

  rankedPlayers.forEach((player, index) => {
    player.Pos = index;
  });

  return rankedPlayers;
}

// Generate HTML table from ranked players
const rankedPlayers = rank(data);
const htmlContent = generateHTMLTable(rankedPlayers);

// Function to create and save a screenshot of the table
async function createTableScreenshot(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const screenshotPath = path.join(__dirname, `ffl-ranking-${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();
  console.log(`Ranking table screenshot saved to ${screenshotPath}`);
}

createTableScreenshot(htmlContent);
