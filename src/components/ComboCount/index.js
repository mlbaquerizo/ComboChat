import React from 'react';
import PropTypes from 'prop-types';
import './countShake.css';

const ComboCount = ({ count, comboCountClass }) => (
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
    <div className={comboCountClass}>
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
  count: PropTypes.objectOf(PropTypes.number).isRequired,
  comboCountClass: PropTypes.string,
};

ComboCount.defaultProps = {
  comboCountClass: '',
};

export default ComboCount;
