const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Sample data
const data = {
  rankings: [
    { player: 'ZemO1', wins: 5, draws: 0, losses: 0 },
    { player: 'Tahir_UFC', wins: 4, draws: 0, losses: 1 },
    { player: 'Lahana Tursusu', wins: 3, draws: 0, losses: 2 },
    // { player: 'PROCESS', wins: 2, draws: 0, losses: 0 },
    { player: 'zBuschZigo', wins: 3, draws: 0, losses: 1 },
    { player: 'FuriUFC', wins: 3, draws: 0, losses: 0 },
    { player: 'Edmir04', wins: 3, draws: 0, losses: 2 },
    { player: 'zFreezy', wins: 1, draws: 0, losses: 3 },
    { player: 'thegame2621', wins: 1, draws: 0, losses: 3 },
    { player: 'Ronaldinho', wins: 0, draws: 0, losses: 4 },
    { player: 'Bronxs_MMA', wins: 0, draws: 0, losses: 2 },
    { player: 'Rebell', wins: 3, draws: 0, losses: 1 },
    // { player: 'Atilla', wins: 0, draws: 0, losses: 1 },
    { player: 'Adam', wins: 0, draws: 0, losses: 3 },
    { player: 'Arezmaa', wins: 2, draws: 0, losses: 1 },
    { player: 'RushMMA', wins: 1, draws: 0, losses: 2 },
    { player: 'Seyiito', wins: 2, draws: 0, losses: 2 },
    { player: 'alpi', wins: 1, draws: 0, losses: 3 },
    { player: 'AlpiQLF', wins: 0, draws: 0, losses: 1 },
    { player: 'ANNOYIING', wins: 1, draws: 0, losses: 1 },
    { player: 'Simouny', wins: 0, draws: 0, losses: 2 },
  ],
};

// Function to generate HTML content
function generateHTMLTable(data) {
  const tableRows = data
    .map(
      (player) => `
        <tr>
            <td>${player.Pos}</td>
            <td style="font-weight: bold; font-size: 1.1em;">${player.Player}</td>
            <td>${player.Wins}</td>
            <td>${player.Draws}</td>
            <td>${player.Losses}</td>
            <td>${player['Diff (W-L)']}</td>
            <td>${player.Total}</td>
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
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 12px 15px; border: 1px solid #ddd; text-align: center; }
                th { background-color: #f44336; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                tr:hover { background-color: #ddd; }
                caption { font-size: 1.8em; margin-bottom: 10px; font-weight: bold; color: #f44336; }
                td:nth-child(2) { font-weight: bold; font-size: 1.1em; }
            </style>
        </head>
        <body>
            <table>
                <caption>FFL Season 01 - Rangliste</caption>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Player</th>
                        <th>Wins</th>
                        <th>Draws</th>
                        <th>Losses</th>
                        <th>Diff (W-L)</th>
                        <th>Total</th>
                        <th>Win Rate (%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `;
}

// Function to rank players and return an array of objects
function rank(data) {
  const rankedPlayers = data.rankings.map((player) => {
    const totalMatches = player.wins + player.draws + player.losses;
    const winLossDiff = player.wins - player.losses;
    const winRate = totalMatches > 0 ? Math.floor((player.wins / totalMatches) * 100) : 0;

    return {
      Player: player.player,
      Wins: player.wins,
      Draws: player.draws,
      Losses: player.losses,
      'Diff (W-L)': winLossDiff,
      Total: totalMatches,
      'Win Rate (%)': winRate,
    };
  });

  rankedPlayers.sort((a, b) => {
    if (b['Diff (W-L)'] !== a['Diff (W-L)']) {
      return b['Diff (W-L)'] - a['Diff (W-L)'];
    } else {
      return b.Total - a.Total;
    }
  });

  let currentPosition = 1;
  rankedPlayers.forEach((player, index) => {
    if (index > 0) {
      const previousPlayer = rankedPlayers[index - 1];
      if (
        player.Wins === previousPlayer.Wins &&
        player.Draws === previousPlayer.Draws &&
        player.Losses === previousPlayer.Losses &&
        player['Diff (W-L)'] === previousPlayer['Diff (W-L)'] &&
        player.Total === previousPlayer.Total
      ) {
        player.Pos = currentPosition;
      } else {
        currentPosition += 1;
        player.Pos = currentPosition;
      }
    } else {
      player.Pos = currentPosition;
    }
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
