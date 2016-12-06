import React, { Component } from 'react';
import $ from 'jquery';
import {
  Test,
  Note,
  Chord
} from '../lib';

const chordSequence = [
  new Chord([
    new Note("E", 4, "flat"),
    new Note("F", 4),
    new Note("G", 4, "flat")
  ]),
  new Chord([
    new Note("C", 4),
    new Note("F", 4),
    new Note("A", 4)
  ]),
  new Chord([
    new Note("G", 4)
  ]),
];

class App extends Component {
  testCompleted(data) {
    console.log(data);
  }

  render() {
    return (
      <div>
        <Test
          chordSequence={chordSequence}
          notationRenderer="klavar"
          testCompleted={(data) => this.testCompleted(data)} />
      </div>
    );
  }
}

export default App;
