import React, { Component } from 'react';
import $ from 'jquery';
import { Test } from '../lib';
import './App.css';

import oneNoteSequence from './chord_sequences/one_note_test.js';
import twoNoteSequence from './chord_sequences/two_note_test.js';
import threeNoteSequence from './chord_sequences/three_note_test.js';

class TestSelector extends Component {
  onClick() {
    const notation = $("#notation-selector").find(":selected").val();
    const sequenceName = $("#sequence-selector").find(":selected").val();

    let sequence;
    switch (sequenceName) {
      case "one-note":
        sequence = oneNoteSequence;
        break;
      case "two-note":
        sequence = twoNoteSequence;
        break;
      case "three-note":
        sequence = threeNoteSequence;
        break;
      default:
        console.log("Invalid sequence selection: " + sequenceName);
        return;
    }

    this.props.onClick(notation, sequence);
  }

  render() {
    return (
      <div className="test-selector">
        <select id="notation-selector">
          <option value="klavar">KN</option>
          <option value="traditional">TN</option>
        </select>
        <select id="sequence-selector">
          <option value="one-note">Single Notes</option>
          <option value="two-note">Two-note Chords</option>
          <option value="three-note">Three-note chords</option>
        </select>
        <button
          className="button test-selector-button"
          onClick={() => this.onClick()}>
        Start
        </button>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      testInProgress: false,
      notationRenderer: null,
      chordSequence: null
    }
  }

  testCompleted(data) {
    console.log(data);
    this.setState({
      testInProgress: false,
      notationRenderer: null,
      chordSequence: null
    });
  }

  startTest(notation, sequence) {
    this.setState({
      testInProgress: true,
      notationRenderer: notation,
      chordSequence: sequence
    });
  }

  render() {
    if (this.state.testInProgress) {
      // display the current test
      return (
        <Test
          chordSequence={this.state.chordSequence}
          notationRenderer={this.state.notationRenderer}
          testCompleted={(data) => this.testCompleted(data)} />
      );
    } else {
      // let the user begin a test
      return (
        <div>
          <h1>Create A New Test</h1>
          <TestSelector
            onClick={(n, s) => this.startTest(n, s)} />
        </div>
      )
    }
  }
}

export default App;
