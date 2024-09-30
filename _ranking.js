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
    // { player: 'Tahir_UFC', wins: 4, draws: 0, losses: 3 },
    // { player: 'PROCESS', wins: 2, draws: 0, losses: 0 },
    // { player: 'zBuschZigo', wins: 3, draws: 0, losses: 2 },
    // { player: 'djamil', wins: 0, draws: 0, losses: 1 },
    // { player: 'Atilla', wins: 0, draws: 0, losses: 1 },
    // { player: 'Adam', wins: 0, draws: 0, losses: 3 },
    // { player: 'AlpiQLF', wins: 0, draws: 0, losses: 1 },
  ],
};

const contenders = data.splice(1)
.map(
  (fight) => `
    <tr>
        <td style="font-weight: bold; font-size: 1.1em; color: #333;">${fight['Player 1']}</td>
        <td style="font-weight: bold; font-size: 1.1em; color: #333;">vs</td>
        <td style="font-weight: bold; font-size: 1.1em; color: #333;">${fight['Player 2']}</td>
        <td style="text-transform: uppercase;">${fight['Weight Class']}</td>
    </tr>
`
)
.join('');

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
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&family=Lobster&display=swap');
                header-section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #000; /* Black background */
                }

                .ffl-header {
                    margin-top: 0;
                    margin-left: 25%;
                    margin-bottom: 0;
                    font-family: 'Arial Black', sans-serif; /* Bold font style */
                    font-size: 5rem; /* Large font size */
                    color: #b30000; /* UFC Red color */
                    letter-spacing: -0.05em; /* Tight letter spacing */
                    text-transform: uppercase; /* Make sure all letters are uppercase */
                    font-weight: bold; /* Extra bold text */
                    padding: 5px 5px; /* Space inside the border */
                    display: inline-block;
                    transform: skew(-15deg); /* Create an angular skew effect */
                }

	  
                body { font-family: 'Roboto Slab', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f0f0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; background-color: white; border-radius: 10px;}
                th, td { padding: 15px; text-align: center; }
                tr:hover { background-color: #eaeaea; }
                caption { font-size: 2em; margin-bottom: 10px; font-weight: bold; color: #333; font-family: 'Lobster', cursive; text-transform: uppercase; }
                td { font-weight: bold; font-size: 1.2em; }
                .header { background-color: #333; color: white; text-align: center; padding: 20px; font-size: 2.5em; text-transform: uppercase; font-family: 'Lobster', cursive; font-style: italic; }
                .champ { font-weight: bold; font-size: 2.2em; text-align: center; margin-top: 20px; background-color: #cc9900; color: black; text-transform: uppercase; padding: 10px; border-radius: 10px;}
                .contenders { font-weight: bold; font-size: 1.5em; text-align: center; margin-top: 20px; background-color: #cc0000; color: white; text-transform: uppercase; padding: 10px; border-radius: 10px;}
                .footer { text-align: center; margin-top: 20px; font-size: 1.2em; color: #333; }
            </style>
        </head>
        <body>
            <div class="header-section">
              <h1 class="ffl-header">FFL - Rankings</h1>
            </div>
            <div class="champ">Champ</div>
            <table>
                <tbody>
                    ${data[0]}
                </tbody>
            </table>
            <div class="contenders">Main Card</div>
            <table>
                <tbody>
                    ${mainCardRows}
                </tbody>
            </table>

            <div class="footer">${ffl} © 2024</div>
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
