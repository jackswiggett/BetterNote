import React, { Component } from 'react';
import $ from 'jquery';
import {
  Keyboard,
  Notation,
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

function NextButton(props) {
  return (
    <button
      className="next-button"
      onClick={props.onClick}>
      Next &#8594;
    </button>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentChordIndex: 0,
      highlightedNotes: []
    };
  }

  notePlayed(note) {
    console.log("Played " + note.describe());

    const highlightedNotes = this.state.highlightedNotes.slice();
    highlightedNotes.push(note);
    this.setState({
      highlightedNotes: highlightedNotes
    });
  }

  nextChord() {
    console.log("Next chord")
    const index = this.state.currentChordIndex + 1;
    this.setState({
      currentChordIndex: index,
      highlightedNotes: []
    });
  }

  render() {
    return (
      <div>
        <Notation
          width={400}
          height={300}
          chord={chordSequence[this.state.currentChordIndex]}
          renderer="klavar" />
        <Keyboard
          notePlayed={(note) => this.notePlayed(note)}
          highlightedNotes={this.state.highlightedNotes} />
        <NextButton
          onClick={() => this.nextChord()} />
      </div>
    );
  }
}

export default App;
