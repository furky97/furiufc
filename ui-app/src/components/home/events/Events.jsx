import { useState } from 'react';
import '../home.scss';
import Event from './Event';

const Events = () => {
  const [events, setEvents] = useState([
    {
      name: 'FFL 012',
      date: new Date().toLocaleDateString('de-de'),
      logoPath: 'src/assets/games/ufc5.png',
    },
    {
      name: 'UFC 308',
      date: new Date().toLocaleDateString('de-de'),
      logoPath: 'src/assets/games/ufc5.png',
    },
    {
      name: 'Primetime 176',
      date: new Date().toLocaleDateString('de-de'),
      logoPath: 'src/assets/games/ufc5.png',
    },
  ]);

  return (
    <section>
      <h2>🕛 My Events</h2>
      <table className='events'>
        <thead>
          <tr>
            <th>Game</th>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, key) => (
            <Event name={event.name} date={event.date} logoPath={event.logoPath} key={key} />
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Events;
