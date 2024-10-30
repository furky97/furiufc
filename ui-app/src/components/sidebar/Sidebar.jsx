// import Link from './links/Link';
import MaterialIcon from 'material-icons-react';
import { Link } from 'react-router-dom';
import './sidebar.scss';

const Sidebar = () => {
  return (
    <nav className='sidebar'>
      <ul>
        <Link to='/home'>
          <span className='logo'>MatchLeague</span>
        </Link>
        <Link to='/home'>
          <MaterialIcon icon='home' color='var(--text-clr)' />
          <span>Home</span>
        </Link>
        <Link to='/explore'>
          <MaterialIcon icon='explore' color='var(--text-clr)' />
          <span>Explore</span>
        </Link>
        <Link to='/profile'>
          <MaterialIcon icon='person' color='var(--text-clr)' />
          <span>Profile</span>
        </Link>
      </ul>
    </nav>
  );
};

export default Sidebar;
