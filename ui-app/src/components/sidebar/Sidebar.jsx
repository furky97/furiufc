import { useState } from 'react';
import './sidebar.scss';
import MaterialIcon from 'material-icons-react';
import Link from './links/Link';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className={isSidebarOpen ? 'sidebar' : 'sidebar close'}>
      <ul>
        <li>
          <span className='logo'>FuriUFC</span>
          <button
            className={isSidebarOpen ? 'toggle-button' : 'toggle-button rotate'}
            onClick={toggleSidebar}
          >
            <MaterialIcon icon='keyboard_double_arrow_left' color='var(--text-clr)'/>
          </button>
        </li>
        <Link icon='home' name='Home'/>
        <Link icon='dashboard' name='Dashboard' />
        <Link icon='person' name='Profile' />
        <Link icon='dashboard' name='Dashboard' />
      </ul>
    </nav>
  );
};

export default Sidebar;
