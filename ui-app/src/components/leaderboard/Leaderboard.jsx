import './leaderboard.scss';
import LeaderboardCard from './LeaderboardCard.jsx';
import {useState} from "react";

function Leaderboard() {
    const [cards, setCards] = useState([
        {position: 0, name: 'Zem01', wins: 7, losses: 2, draws: 0,},
        {position: 1, name: 'FuriUFC', wins: 3, losses: 1, draws: 0,},
        {position: 2, name: 'Edmir04', wins: 1, losses: 1, draws: 0,}
    ]);

    return (
        <div className="leaderboards">
            <h1 className="section-header">Leaderboards</h1>
            {cards.map((card, index) => {
                return (
                    <div className={card.position === 0 ? "champion-card" : "leaderboard-card"} key={index}>
                        <LeaderboardCard card={card}/>
                    </div>);
            })}
        </div>
    );
}

export default Leaderboard;