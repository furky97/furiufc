import { VscChevronDown } from 'react-icons/vsc';
import './leaderboard.scss';

import PropTypes from 'prop-types';

function LeaderboardCard({ card }) {
  return (
    <>
      <div className='player-info'>
        <div className='player-position'>{card.position === 0 ? 'C' : card.position}</div>
        <div className='player-name'>{card.name}</div>
      </div>
      <div className='stats'>
        <div className='player-stat'>
          <span className='label'>W</span>
          <span className='value'>{card.wins}</span>
        </div>
        <div className='player-stat'>
          <span className='label'>L</span>
          <span className='value'>{card.losses}</span>
        </div>
        <div className='player-stat'>
          <span className='label'>D</span>
          <span className='value'>{card.draws}</span>
        </div>
        <div className='player-recent'>
          <VscChevronDown />
        </div>
      </div>
    </>
  );
}

LeaderboardCard.propTypes = {
  card: {
    position: PropTypes.number,
    name: PropTypes.string,
    wins: PropTypes.number,
    losses: PropTypes.number,
    draws: PropTypes.number,
  },
};

export default LeaderboardCard;
