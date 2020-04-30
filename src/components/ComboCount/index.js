import React from 'react';

const ComboCount = ({count}) => {
  return (
    <div className="circleContainer" style={{zIndex: '1', borderRadius:'50%', width: '100px', height: '100px', background: 'lightblue', paddingBottom:'15px'}}>
      <h1 style={{ textAlign: 'center', fontSize: '100px', color: "white", marginBottom:'2px' }}>{count}</h1>
    </div>
  );
}

export default ComboCount;