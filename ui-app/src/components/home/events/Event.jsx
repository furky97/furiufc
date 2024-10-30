import PropTypes from 'prop-types';
import '../home.scss';

const Event = ({ name, date, logoPath }) => {
  return (
    <tr className='event'>
      <td>
        <img src={logoPath}></img>
      </td>
      <td>
        <span>{name}</span>
      </td>
      <td>
        <span>{date}</span>
      </td>
    </tr>
  );
};

Event.propTypes = {
  name: PropTypes.string,
  date: PropTypes.string,
  logoPath: PropTypes.string,
};

export default Event;
