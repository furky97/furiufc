const puppeteer = require('puppeteer');
const path = require('path');
const data = require('./ranking.json');

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
                margin: 0;
                padding: 20px;
                background: linear-gradient(90deg, rgba(245,227,227,1) 0%, rgba(210,214,215,1) 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }

            .header-section {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .ffl-header {
                font-family: 'Roboto Slab', Arial, sans-serif;
                font-size: 5rem;
                color: white;
                font-weight: bold;
                text-align: center;
            }

            /* Champion card styles */
            .champion-card {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                color: #333;
                padding: 15px 30px;
                border-radius: 12px;
                border: 2px solid #ffd700;
                margin-bottom: 30px;
                width: 70%;
                max-width: 800px;
                gap: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            /* General leaderboard card styles */
            .leaderboard-card {
                display: flex;
                align-items: center;
                background-color: #ffffff;
                color: #333;
                padding: 10px 15px;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
                margin-bottom: 10px;
                width: 90%;
                max-width: 700px;
                gap: 20px;
                transition: box-shadow 0.3s;
            }

            .leaderboard-card:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .player-position {
                font-size: 1.5rem;
                font-weight: bold;
                background-color: #f0f0f0;
                color: #333;
                padding: 10px 15px;
                border-radius: 20%;
                text-align: center;
            }
            
            .champion-card .player-position {
                background-color: goldenrod;
            }

            .player-name {
                font-size: 1.4rem;
                font-weight: bold;
                flex-grow: 1;
                color: #333;
            }

            .player-stat {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 1rem;
            }

            .player-stat .label {
                font-size: 0.8rem;
                color: #666;
                text-transform: uppercase;
            }

            .player-stat .value {
                font-size: 1.4rem;
                font-weight: bold;
                color: #333;
            }
            
            </style>
        </head>
        <body>
            <div class="header-section">
              <h1 class="ffl-header">Leaderboards</h1>
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
const rankedPlayers = rank(data);
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
