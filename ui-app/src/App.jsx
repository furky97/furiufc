import './app.scss';
import Sidebar from './components/sidebar/Sidebar.jsx';
import GameCard from './components/home/games/GameCard.jsx';

const App = () => {
  return (
    <main>
      <Sidebar />
      <div className='root-container'>
        <div className='container'>
          <h2>🎮 Games</h2>
          <section className='gamecards'>
            <GameCard imgPath='src/assets/games/ufc5.png' name='UFC 5' />
            <GameCard imgPath='src/assets/games/eafc25.png' name='FC 25' />
            <GameCard imgPath='src/assets/games/undisputed.png' name='Undisputed' />
            <GameCard imgPath='src/assets/games/ufc5.png' name='UFC 5' />
            <GameCard imgPath='src/assets/games/eafc25.png' name='FC 25' />
            <GameCard imgPath='src/assets/games/undisputed.png' name='Undisputed' /><GameCard imgPath='src/assets/games/ufc5.png' name='UFC 5' />
            <GameCard imgPath='src/assets/games/eafc25.png' name='FC 25' />
            <GameCard imgPath='src/assets/games/undisputed.png' name='Undisputed' />
          </section>
        </div>
        <div className='container'>
          <h2>🎮 Games</h2>
          <section className='gamecards'>
            <GameCard imgPath='src/assets/games/ufc5.png' name='UFC 5' />
            <GameCard imgPath='src/assets/games/eafc25.png' name='FC 25' />
            <GameCard imgPath='src/assets/games/undisputed.png' name='Undisputed' />
            <GameCard imgPath='src/assets/games/ufc5.png' name='UFC 5' />
            <GameCard imgPath='src/assets/games/eafc25.png' name='FC 25' />
            <GameCard imgPath='src/assets/games/undisputed.png' name='Undisputed' /><GameCard imgPath='src/assets/games/ufc5.png' name='UFC 5' />
            <GameCard imgPath='src/assets/games/eafc25.png' name='FC 25' />
            <GameCard imgPath='src/assets/games/undisputed.png' name='Undisputed' />
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
