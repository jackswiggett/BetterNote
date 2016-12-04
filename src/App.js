import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

const notesSequence = [
  ["F"],
  ["G, B, D"],
  ["F#"]
]

function Notation(props) {
  return (
    <div className="notation">
      <p>{props.notes}</p>
    </div>
  );
}

function Keyboard(props) {
  return (
    <div className="keyboard">
      <p>We will render the keyboard here.</p>
    </div>
  );
}

function NextButton(props) {
  return (
    <button
      className="next-button"
      onClick={props.onClick}>
      Next
    </button>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentNotesIndex: 0
    };
  }

  nextNotes() {
    const index = this.state.currentNotesIndex;
    if (index < notesSequence.length - 1) {
      this.setState({currentNotesIndex: index + 1})
    }
  }

  render() {
    return (
      <div>
        <h1>Notation Test</h1>
        <Notation notes={notesSequence[this.state.currentNotesIndex]}/>
        <Keyboard />
        <NextButton onClick={() => this.nextNotes()} />
      </div>
    );
  }
}

export default App;
