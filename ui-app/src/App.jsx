import './app.scss';
import Home from './components/home/Home.jsx';
import Sidebar from './components/sidebar/Sidebar.jsx';

const App = () => {
  return (
    <main>
      <Sidebar />
      <div className='root-container'>
        <Home />
      </div>
    </main>
  );
};

export default App;
