import PropTypes from 'prop-types';
import '../home.scss';

const GameCard = ({ imgPath, name }) => {
  return (
    <div className='game-card'>
      <img src={imgPath} alt={name} />
      <div className='game-title'>
        <h3>{name}</h3>
      </div>
    </div>
  );
};

GameCard.propTypes = {
  imgPath: PropTypes.string,
  name: PropTypes.string,
};

export default GameCard;
