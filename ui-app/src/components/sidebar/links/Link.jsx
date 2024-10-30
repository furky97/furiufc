import MaterialIcon from 'material-icons-react';
import PropTypes from 'prop-types';

const Link = (props) => {
  return (
    <li>
      <a href=''>
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
