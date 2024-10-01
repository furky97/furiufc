const puppeteer = require('puppeteer');
const path = require('path');
const {rankings} = require('./data');

function generatePlayerCard(player, index) {
    const positionLabel = index === 0 ? `C` : `${index}`;

    return `
    <div class="leaderboard-card">
        <div class="player-position">${positionLabel}</div>
        <div class="player-name">${player.Name}</div>
        <div class="player-stat wins">
            <span class="label">W</span>
            <span class="value">${player.Wins}</span>
        </div>
        <div class="player-stat losses">
            <span class="label">L</span>
            <span class="value">${player.Losses}</span>
        </div>
        <div class="player-stat draws">
            <span class="label">D</span>
            <span class="value">${player.Draws}</span>
        </div>
    </div>
    `;
}

function generateHTMLTable(data) {
    // Separate the champion (position 0) from the rest of the players
    const champion = data.find((player, index) => index === 0);
    const others = data.slice(1);

    const championCard = champion ? `
    <div class="champion-card">
        <div class="player-position">C</div>
        <div class="player-name">${champion.Name}</div>
        <div class="player-stat wins">
            <span class="label">W</span>
            <span class="value">${champion.Wins}</span>
        </div>
        <div class="player-stat losses">
            <span class="label">L</span>
            <span class="value">${champion.Losses}</span>
        </div>
        <div class="player-stat draws">
            <span class="label">D</span>
            <span class="value">${champion.Draws}</span>
        </div>
    </div>` : '';

    const otherPlayers = others.map((player, index) => {
        return generatePlayerCard(player, index + 1);
    }).join('');

    return `
        <html>
        <head>
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap');
            
            * {
                box-sizing: border-box;
            }

            body {
                font-family: 'Roboto Slab', Arial, sans-serif;
                padding: 20px;
                background: linear-gradient(to bottom, #dddddd 0%, #eeeeee 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }

            .header-section {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .ffl-header {
                font-family: 'Impact', Arial, sans-serif;
                font-size: 8rem;
                color: black;
                font-weight: bold;
                text-align: center;
                border-bottom: 1mm solid black;
                padding: 10px 20px;
            }

            /* Champion card styles */
            .champion-card {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #ffffff;
                color: #000000;
                padding: 15px 30px;
                border-radius: 12px;
                border: 2mm ridge goldenrod;
                margin-bottom: 30px;
                width: 60%;
                max-width: 800px;
                gap: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            /* General leaderboard card styles */
            .leaderboard-card {
                display: flex;
                align-items: center;
                background-color: #ffffff;
                color: #000000;
                padding: 10px 15px;
                border-radius: 8px;
                margin-bottom: 4px;
                width: 70%;
                height: 15%;
                max-width: 700px;
                gap: 20px;
                transition: box-shadow 0.3s;
            }

            .player-position {
                font-size: 2rem;
                font-weight: bold;
                background-color: darkred;
                color: white;
                padding: 10px 15px;
                border-radius: 20%;
                text-align: center;
            }
            
            .champion-card .player-position {
                background-color: goldenrod;
            }
            
            .champion-card .player-name {
                font-size: 2.5rem;
                font-weight: bold;
            }
            
            .player-name {
                font-size: 1.8rem;
                flex-grow: 1;
                color: #000000;
            }

            .player-stat {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
                font-size: 1.5rem;
            }

            .player-stat .label {
                font-size: 1rem;
                color: grey;
                text-transform: uppercase;
            }

            .player-stat .value {
                font-size: 2rem;
                font-weight: bold;
                color: #000000;
            }
            
            .champion-card .player-stat .value {
                font-size: 2.5rem;
            }
            
            </style>
        </head>
        <body>
            <div class="header-section">
              <h1 class="ffl-header">Rangliste</h1>
            </div>
            ${championCard}
            ${otherPlayers}
        </body>
        </html>
    `;
}


// Function to rank players and return an array of objects
function rank(data) {
    const rankedPlayers = data.map((player) => {
        return {
            Name: player.name,
            Wins: player.wins,
            Draws: player.draws,
            Losses: player.losses,
            Champion: player.champion
        };
    });

    rankedPlayers.forEach((player, index) => {
        player.Pos = index;
    });

    return rankedPlayers;
}

// Generate HTML table from ranked players
const rankedPlayers = rank(rankings);
const htmlContent = generateHTMLTable(rankedPlayers);

// Function to create and save a screenshot of the table
async function createTableScreenshot(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const screenshotPath = path.join(__dirname, `leaderboards-${Date.now()}.png`);
    await page.screenshot({path: screenshotPath, fullPage: true});
    await browser.close();
    console.log(`Ranking table screenshot saved to ${screenshotPath}`);
}

createTableScreenshot(htmlContent);
