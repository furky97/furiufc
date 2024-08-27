import time
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

def rank(data):
    # Create a new list with total matches and win-loss difference calculated
    ranked_players = []
    for player in data['rankings']:
        total_matches = player['wins'] + player['draws'] + player['losses']
        win_loss_diff = player['wins'] - player['losses']
        win_rate = int((player['wins'] / total_matches) * 100 if total_matches > 0 else 0)
        player_with_stats = {
            "Player": player['player'],
            "Wins": player['wins'],
            "Draws": player['draws'],
            "Losses": player['losses'],
            "Diff (W-L)": win_loss_diff,
            "Total": total_matches,
            "Win Rate (%)": win_rate
        }
        ranked_players.append(player_with_stats)

    # Sort the rankings based on win-loss difference (descending), then total matches (descending)
    sorted_rankings = sorted(
        ranked_players,
        key=lambda x: (-x['Diff (W-L)'], -x['Total'])
    )

    # Assign positions with handling for ties, ensuring positions always increase by 1
    current_position = 1
    for index, player in enumerate(sorted_rankings):
        if index > 0:
            previous_player = sorted_rankings[index - 1]
            if (player['Wins'], player['Draws'], player['Losses'], player['Diff (W-L)'], player['Total']) == \
               (previous_player['Wins'], previous_player['Draws'], previous_player['Losses'], previous_player['Diff (W-L)'], previous_player['Total']):
                player['Pos'] = current_position
            else:
                current_position += 1
                player['Pos'] = current_position
        else:
            player['Pos'] = current_position

    # Convert the list to a pandas DataFrame
    df = pd.DataFrame(sorted_rankings, columns=['Pos', 'Player', 'Wins', 'Draws', 'Losses', 'Diff (W-L)', 'Total', 'Win Rate (%)'])

    return df

# Sample data without the position attribute
data = {
    "rankings": [
        {"player": "ZEMO1", "wins": 2, "draws": 0, "losses": 0},
        {"player": "TAHIR_UFC", "wins": 2, "draws": 0, "losses": 0},
        {"player": "LAHANA TURSUSU", "wins": 2, "draws": 0, "losses": 0},
        {"player": "PROCESS", "wins": 1, "draws": 0, "losses": 0},
        {"player": "ZBUSCHZIGO", "wins": 1, "draws": 0, "losses": 0},
        {"player": "FURIUFC", "wins": 1, "draws": 0, "losses": 0},
        {"player": "EDMIRO4", "wins": 1, "draws": 0, "losses": 1},
        {"player": "FREEZY", "wins": 0, "draws": 0, "losses": 1},
        {"player": "THEGAME", "wins": 0, "draws": 0, "losses": 1},
        {"player": "RONALDINHO", "wins": 0, "draws": 0, "losses": 1},
        {"player": "DERTIJARISTO69", "wins": 0, "draws": 0, "losses": 1},
        {"player": "REBELL", "wins": 0, "draws": 0, "losses": 1},
        {"player": "ATILLA", "wins": 0, "draws": 0, "losses": 1},
        {"player": "ALPI", "wins": 0, "draws": 0, "losses": 2}
    ]
}

# Call the function and get the DataFrame
df = rank(data)

# Plot the DataFrame as a table
fig, ax = plt.subplots(figsize=(12, 8))

# Remove the axes
ax.axis('off')
ax.axis('tight')

# Define a custom color map
cmap = LinearSegmentedColormap.from_list('custom_cmap', ['#ffcccc', '#ccffcc'], N=100)

# Create a table with colored cells based on the position
table = ax.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center', colColours=["#40466e"] * len(df.columns))

# Style the header
table.auto_set_font_size(False)
table.set_fontsize(12)

# Adjust the scale - make the second column wider and all others tighter
table.scale(1.0, 2.0)  # Overall scale for height
table.auto_set_column_width([i for i in range(len(df.columns))])  # Make all columns equally wide

for key, cell in table.get_celld().items():
    if key[0] == 0:
        cell.set_text_props(weight='bold', color='white')
        cell.set_facecolor('#40466e')
    else:
        cell.set_facecolor(cmap((key[0]-1) / len(df)))
        cell.set_text_props(color='black')

# Add title and subtitle
plt.suptitle('Rangliste', fontsize=20, fontweight='bold', color='#40466e')
plt.title('FFL Season-01', fontsize=16, color='#40466e')

plt.subplots_adjust(top=0.8)  # Adjust title position

# Save the figure as an image
plt.savefig('ffl-ranking' + time.strftime("%Y%m%d-%H%M%S") + '.png', bbox_inches='tight', dpi=300)

