const puppeteer = require('puppeteer');
const path = require('path');

const ffl = '<span>FFL - 008</span>';
// List of players
const players = [
  'Seyiito',
  'ANNOYIING',
  'Arezmaa',
  'Freezy',
  'Carnalito61',
  'Zem01',
  'RushMMA',
  'djamil',
  'Edmir04',
  'Simouny',
  'alpi',
  'Lahana Turşusu',
  'Bronxs_MMA',
  'Tahir_UFC',
  'Rebell',
  'FuriUFC',
];

// List of weight classes
const weightClasses = [
  'Heavyweight',
  'Light Heavyweight',
  'Middleweight',
  'Welterweight',
  'Lightweight',
  'Featherweight',
  'Bantamweight',
  // "Flyweight",
  // "Bantamweight (W)",
  // "Flyweight (W)",
  // "Strawweight (W)"
];

// Championship fight
const championshipFight = {
  'Player 1': players[0],
  'Player 2': players[1],
  'Weight Class': weightClasses[Math.floor(Math.random() * weightClasses.length)],
};

// Create fight card by excluding championship fight players
const fightCard = [];
for (let i = 2; i < players.length; i += 2) {
  fightCard.push({
    'Player 1': players[i],
    'Player 2': players[i + 1],
    'Weight Class': weightClasses[Math.floor(Math.random() * weightClasses.length)],
  });
}

// Split into Main Card and Prelims
const mainCard = fightCard.slice(0, 4); // First 4 fights for Main Card
const prelims = fightCard.slice(4); // Remaining fights for Prelims

// Function to generate HTML content
function generateHTMLTable(mainCard, prelims, championship) {
  const mainCardRows = mainCard
    .map(
      (fight) => `
        <tr>
            <td style="font-weight: bold; font-size: 1.1em; color: #333;">${fight['Player 1']}</td>
            <td style="font-weight: bold; font-size: 1.1em; color: #333;">${fight['Player 2']}</td>
            <td style="text-transform: uppercase;">${fight['Weight Class']}</td>
        </tr>
    `
    )
    .join('');

  const prelimRows = prelims
    .map(
      (fight) => `
        <tr>
            <td style="font-weight: bold; font-size: 1.1em; color: #333;">${fight['Player 1']}</td>
            <td style="font-weight: bold; font-size: 1.1em; color: #333;">${fight['Player 2']}</td>
            <td style="text-transform: uppercase;">${fight['Weight Class']}</td>
        </tr>
    `
    )
    .join('');

  const championshipRow = `
        <tr>
            <td style="font-weight: bold; font-size: 1.5em; color: #333;">${championship['Player 1']} <span style="color: #d4af37; font-size: 1.1em;">(C)</span></td>
            <td style="font-weight: bold; font-size: 1.5em; color: #333;">${championship['Player 2']}</td>
            <td style="font-size: 1.5em; font-weight: bold; color: #333; text-transform: uppercase;">${championship['Weight Class']}</td>
        </tr>
    `;

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
                .title-card { font-weight: bold; font-size: 2.2em; text-align: center; margin-top: 20px; background-color: #cc9900; color: black; text-transform: uppercase; padding: 10px; border-radius: 10px;}
                .main-card { font-weight: bold; font-size: 1.5em; text-align: center; margin-top: 20px; background-color: #cc0000; color: white; text-transform: uppercase; padding: 10px; border-radius: 10px;}
                .prelims-card { font-weight: bold; font-size: 1.0em; text-align: center; margin-top: 20px; background-color: #333; color: white; text-transform: uppercase; padding: 10px; border-radius: 10px;}
                .footer { text-align: center; margin-top: 20px; font-size: 1.2em; color: #333; }
            </style>
        </head>
        <body>
            <div class="header-section">
              <h1 class="ffl-header">${ffl}</h1>
            </div>
            <div class="title-card">Title Fight</div>
            <table>
                <tbody>
                    ${championshipRow}
                </tbody>
            </table>
            <div class="main-card">Main Card</div>
            <table>
                <tbody>
                    ${mainCardRows}
                </tbody>
            </table>

            <div class="prelims-card">Prelims</div>
            <table>
                <tbody>
                    ${prelimRows}
                </tbody>
            </table>

            <div class="footer">${ffl} © 2024</div>
        </body>
        </html>
    `;
}

// Function to create and save a screenshot of the table
async function createTableScreenshot(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const screenshotPath = path.join(__dirname, `fight-card-${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();
  console.log(`Fight card screenshot saved to ${screenshotPath}`);
}

// Generate HTML and create screenshot
const htmlContent = generateHTMLTable(mainCard, prelims, championshipFight);
createTableScreenshot(htmlContent);
