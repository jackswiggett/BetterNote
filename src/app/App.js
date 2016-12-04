import React, { Component } from 'react';
import './App.css';
import {
  Keyboard,
  Notation,
  Note
} from '../lib';

const notesSequence = [
  ["F"],
  ["G, B, D"],
  ["F#"]
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
      currentNotesIndex: 0,
      highlightedNotes: []
    };
  }

  notePlayed(note) {
    console.log("Played " + note.noteName + note.octave);

    const highlightedNotes = this.state.highlightedNotes.slice();
    highlightedNotes.push(note);
    this.setState({
      highlightedNotes: highlightedNotes
    });
  }

  nextNotes() {
    console.log("next notes")
    const index = this.state.currentNotesIndex + 1;
    this.setState({
      currentNotesIndex: index,
      highlightedNotes: []
    });
  }

  render() {
    return (
      <div>
        <h1>Notation Test</h1>
        <Notation notes={notesSequence[this.state.currentNotesIndex]}/>
        <Keyboard
          notePlayed={(note) => this.notePlayed(note)}
          highlightedNotes={this.state.highlightedNotes} />
        <NextButton
          onClick={() => this.nextNotes()} />
      </div>
    );
  }
}

export default App;
