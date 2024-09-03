const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// List of players
const players = [
    "Seyiito",
    "Freezy",
    "Adam",
    "alpi",
    "RushMMA",
    "Arezmaa",
    "thegame2612",
    "AlpiQLF",
    "Tahir_UFC",
    "Ronaldinho",
    "Edmir04", 
    "ANNOYIING",
    "Rebell",
    // "Bronxs_MMA",
    "zBuschZigo",
    "Zem01",
    "Simouney",
    "Lahana Turşusu", 
    "FuriUFC",
];

// List of weight classes
const weightClasses = [
    "Heavyweight", 
    "Light Heavyweight",
    "Middleweight", 
    "Welterweight", 
    "Lightweight",
    "Featherweight", 
    "Bantamweight", 
    "Flyweight", 
    // "Bantamweight (W)", 
    // "Flyweight (W)", 
    // "Strawweight (W)"
];

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle players and match them with weight classes
// shuffleArray(players);
const fightCard = [];
for (let i = 0; i < players.length / 2; i++) {
    fightCard.push({
        "Player 1": players[2 * i],
        "Player 2": players[2 * i + 1],
        "Weight Class": weightClasses[Math.floor(Math.random() * weightClasses.length)]
    });
}

// Function to generate HTML content
function generateHTMLTable(data) {
    const tableRows = data.map(fight => `
        <tr>
            <td style="font-weight: bold; font-size: 1.1em;">${fight['Player 1']}</td>
            <td style="font-weight: bold; font-size: 1.1em;">${fight['Player 2']}</td>
            <td>${fight['Weight Class']}</td>
        </tr>
    `).join('');

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
                caption { font-size: 1.8em; margin-bottom: 8px; font-weight: bold; color: #f44336; }
                td:nth-child(1), td:nth-child(2) { font-weight: bold; font-size: 1.1em; }
            </style>
        </head>
        <body>
            <table>
                <caption>Fight Card</caption>
                <thead>
                    <tr>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Weight Class</th>
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
const htmlContent = generateHTMLTable(fightCard);
createTableScreenshot(htmlContent);
