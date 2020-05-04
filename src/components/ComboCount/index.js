import React from 'react';
<<<<<<< HEAD
import './countShake.css';

const ComboCount = ({count, comboCountClass}) => {
  return (
    <div className="circleContainer" style={{zIndex: '1', borderRadius:'50%', width: '100px', height: '100px', background: 'lightblue', paddingBottom:'15px'}}>
      <div className={comboCountClass}>
        <h1 style={{ textAlign: 'center', fontSize: '100px', color: "white", marginBottom:'2px' }}>{count}</h1>
      </div>
    </div>
  );
}
=======
import PropTypes from 'prop-types';

const ComboCount = ({ count }) => (
  <div
    className="circleContainer"
    style={{
      zIndex: '1',
      borderRadius: '50%',
      width: '100px',
      height: '100px',
      background: 'lightblue',
      paddingBottom: '15px',
    }}
  >
    <h1
      style={{
        textAlign: 'center',
        fontSize: '100px',
        color: 'white',
        marginBottom: '2px',
      }}
    >
      {count}
    </h1>
  </div>
);
>>>>>>> master

ComboCount.propTypes = {
  count: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default ComboCount;
