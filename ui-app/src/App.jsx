import './app.scss';
import Sidebar from './components/sidebar/Sidebar.jsx';

const App = () => {
  return (
    <main>
      <Sidebar />
      <div className='root-container'>
        <div className='container'>
          <h2>Furkan</h2>
          <p>Test</p>
        </div>
        <div className='container'>
          <h2>Furkan</h2>
          <p>Test</p>
        </div>
        <div className='container'>
          <h2>Furkan</h2>
          <p>Test</p>
        </div>
        <div className='container'>
          <h2>Furkan</h2>
          <p>Test</p>
        </div>
      </div>
    </main>
  );
};

export default App;
