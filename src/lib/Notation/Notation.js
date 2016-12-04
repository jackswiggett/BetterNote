import React, { Component } from 'react';
import Note from '../Note';

function Notation(props) {
  return (
    <div className="notation">
      <p>{props.notes}</p>
    </div>
  );
}

export default Notation;