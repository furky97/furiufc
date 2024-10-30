import { Outlet } from 'react-router-dom';
import './app.scss';
import Sidebar from './components/sidebar/Sidebar.jsx';

const App = () => {
  return (
    <main>
      <Sidebar />
      <div className='root-container'>
        <Outlet />
      </div>
    </main>
  );
};

export default App;
