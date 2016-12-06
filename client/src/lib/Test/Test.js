import React, { Component } from 'react';
import {
  Keyboard,
  Notation
} from '..';

function NextButton(props) {
  return (
    <button
      className="next-button"
      onClick={props.onClick}>
      Next &#8594;
    </button>
  );
}

function StartButton(props) {
  return (
    <button
      className="start-button"
      onClick={props.onClick}>
      Start
    </button>
  );
}

class TestLog {
  constructor() {
    this.sequence = [];
  }

  logChord(chord, played, elapsedTime) {
    const correctNotes = chord.notes.map((note) => note.describe());
    const playedNotes = played.map((note) => note.describe());
    const numNotesPlayed = playedNotes.length;

    let numCorrectNotesPlayed = 0;
    for (let correctNote of chord.notes) {
      for (let playedNote of played) {
        if (playedNote.equals(correctNote)) {
          numCorrectNotesPlayed++;
          break;
        }
      }
    }

    const totalElapsedTime = elapsedTime[elapsedTime.length - 1];

    const data = {
      correctNotes: correctNotes,
      playedNotes: playedNotes,
      numNotesPlayed: numNotesPlayed,
      numCorrectNotesPlayed: numCorrectNotesPlayed,
      elapsedTime: elapsedTime,
      totalElapsedTime: totalElapsedTime
    }

    this.sequence.push(data);
  }

  getData() {
    return this.sequence;
  }
}

class Test extends Component {
  /* props:
   *   chordSequence: An array of Chord objects that make up the test
   *   notationRenderer: Name of one of the renderers supported
   *                      by the Notation component, as a string
   *   testCompleted: A function to be called when the test if finished.
   *                  Takes one parameter, an object storing log data
   *                  for the completed test
   */
  constructor() {
    super();
    this.state = {
      currentChordIndex: 0,
      highlightedNotes: [],
      canPlayNotes: false,
      testStarted: false
    };
    this.testLog = new TestLog();
  }

  startTest() {
    this.setState({
      testStarted: true,
      canPlayNotes: true
    });

    this.chordStartTime = performance.now();
    this.chordElapsedTime = [];
  }

  notePlayed(note) {
    if (this.state.canPlayNotes) {
      const playedNotes = this.state.highlightedNotes.slice();
      playedNotes.push(note);
      this.chordElapsedTime.push(performance.now() - this.chordStartTime);
      this.setState({
        highlightedNotes: playedNotes
      });

      const correctChord = this.props.chordSequence[this.state.currentChordIndex];
      if (playedNotes.length === correctChord.notes.length) {
        // user has finished playing notes for this chord
        this.setState({
          canPlayNotes: false
        });
      }
    }
  }

  nextChord() {
    const playedNotes = this.state.highlightedNotes.slice();
    const correctChord = this.props.chordSequence[this.state.currentChordIndex];
    if (playedNotes.length === correctChord.notes.length) {
      // add the chord they played to the test log
      this.testLog.logChord(correctChord, playedNotes, this.chordElapsedTime);

      const index = this.state.currentChordIndex + 1;
      if (index === this.props.chordSequence.length) {
        // done with the test; send test log to parent component
        this.props.testCompleted(this.testLog.getData());
      } else {
        console.log("Next chord");

        this.setState({
          currentChordIndex: index,
          highlightedNotes: [],
          canPlayNotes: true
        });

        this.chordStartTime = performance.now();
        this.chordElapsedTime = [];
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.testStarted &&
          <Notation
            width={400}
            height={300}
            chord={this.props.chordSequence[this.state.currentChordIndex]}
            renderer={this.props.notationRenderer} />}
        <Keyboard
          notePlayed={(note) => this.notePlayed(note)}
          highlightedNotes={this.state.highlightedNotes} />
        {this.state.testStarted ?
          <NextButton
            onClick={() => this.nextChord()} /> :
          <StartButton
            onClick={() => this.startTest()} />}
      </div>
    );
  }
}

export default Test;