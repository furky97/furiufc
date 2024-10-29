import MaterialIcon from 'material-icons-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Link = (props) => {
  const [isActive, setActive] = useState(false);

  const toggleLink = (e) => {
    e.preventDefault();
    setActive(!isActive);
  };

  return (
    <li className={isActive ? 'active' : ''}>
      <a href='' onClick={toggleLink}>
        <MaterialIcon icon={props.icon} size={24} color='var(--text-clr)' />
        <span>{props.name}</span>
      </a>
    </li>
  );
};

Link.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
};

export default Link;
