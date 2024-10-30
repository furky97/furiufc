import PropTypes from 'prop-types';
import '../home.scss';
import GameCard from './GameCard';

const Games = ({ games }) => {
  return (
    <section>
      <h2>🎮 My Games</h2>
      <div className='gamecards'>
        {games.map((game, key) => (
          <GameCard imgPath={game.imgPath} name={game.name} key={key} />
        ))}
      </div>
    </section>
  );
};

Games.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      imgPath: PropTypes.string.isRequired,
    })
  ),
};

export default Games;
