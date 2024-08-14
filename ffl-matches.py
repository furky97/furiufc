import pandas as pd
import random
import matplotlib.pyplot as plt
import seaborn as sns

# List of players
players = [
    "Zem01", 
    "Edmir04", 
    "Lahana Turşusu", 
    "alpi",
    "Tahir_UFC",
    "DerTijarist069"
    ]

# List of weight classes
weightClasses = [
    "Heavyweight", 
    "Light Heavyweight", 
    "Middleweight", 
    "Welterweight", 
    "Lightweight",
    "Featherweight", 
    "Bantamweight", 
    "Flyweight", 
    "Bantamweight (W)", 
    "Flyweight (W)", 
    "Strawweight (W)"
]

# Randomize players and weight classes
random.shuffle(players)
random.shuffle(weightClasses)

# Create pairs of players and match weight classes
fight_card = []
for i in range(len(players) // 2):
    fight_card.append((players[2*i], 
                       players[2*i + 1], 
                       weightClasses[random.randint(0,len(weightClasses)-1)]))

# Create a DataFrame for display
fight_card_df = pd.DataFrame(fight_card, columns=["Player 1", "Player 2", "Weight Class"])

# Set up the matplotlib figure
fig, ax = plt.subplots(figsize=(8, 3))  # Set the size of the figure
ax.axis('tight')
ax.axis('off')

# Create a color palette
cmap = sns.light_palette("blue", as_cmap=True)

# Create the table
table = ax.table(cellText=fight_card_df.values,
                 colLabels=fight_card_df.columns,
                 cellLoc='center',
                 loc='center',
                 colColours=["#40466e"] * len(fight_card_df.columns))

# Enhance the table appearance
table.auto_set_font_size(False)
table.set_fontsize(10)
table.scale(1.2, 1.4)

# Apply color to the cells
for i in range(len(fight_card_df)):
    for j in range(len(fight_card_df.columns)):
        cell = table[(i+1, j)]
        if j == 3:  # Apply specific coloring for the 'Score' column
            cell.set_facecolor(cmap(fight_card_df['Score'].iloc[i] / 100))
        cell.set_edgecolor('black')

# Style the header
for j in range(len(fight_card_df.columns)):
    cell = table[(0, j)]
    cell.set_fontsize(12)
    cell.set_text_props(weight='bold', color='white')
    cell.set_facecolor('#40466e')

# Save the figure as an image
plt.savefig('fightcard.png', bbox_inches='tight', dpi=300)
