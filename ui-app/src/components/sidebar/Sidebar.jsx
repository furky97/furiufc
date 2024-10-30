import Link from './links/Link';
import './sidebar.scss';

const Sidebar = () => {
  return (
    <nav className='sidebar'>
      <ul>
        <li>
          <span className='logo'>MatchLeague</span>
        </li>
        <Link icon='home' name='Home' />
        <Link icon='explore' name='Explore' />
        <Link icon='dashboard' name='Dashboard' />
        <Link icon='person' name='Profile' />
      </ul>
    </nav>
  );
};

export default Sidebar;
