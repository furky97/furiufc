import { useState } from 'react';
import Games from './games/Games';
import './home.scss';

export const Home = () => {
  const [games, setGames] = useState([
    { name: 'UFC 5', imgPath: 'src/assets/games/ufc5.png' },
    { name: 'FC 25', imgPath: 'src/assets/games/eafc25.png' },
    { name: 'Unidsputed', imgPath: 'src/assets/games/undisputed.png' },
  ]);

  return (
    <div className='home'>
      <h1>Home</h1>
      <Games games={games} />
    </div>
  );
};

export default Home;
