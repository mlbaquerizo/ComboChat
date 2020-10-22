import React from 'react';
import PropTypes from 'prop-types';
import './countShake.css';

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
    <div className={comboCountClass}></div>
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
  </div>
);

ComboCount.propTypes = {
  count: PropTypes.number.isRequired,
};

export default ComboCount;
