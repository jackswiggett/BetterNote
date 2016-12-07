import React, { Component } from 'react';
import {
  Keyboard,
  Notation
} from '..';
import './Test.css';

function NextButton(props) {
  return (
    <button
      className="button next-button"
      onClick={props.onClick}
      disabled={props.disabled && "disabled"}>
      Next &#8594;
    </button>
  );
}

function StartButton(props) {
  return (
    <button
      className="button start-button"
      onClick={props.onClick}
      disabled={props.disabled && "disabled"}>
      Begin Test
    </button>
  );
}

class TestLog {
  constructor(testerName, notationRenderer, maxDuration) {
    const date = new Date();
    this.sequence = [];
    this.startTime = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    this.testerName = testerName;
    this.notation = notationRenderer;
    this.maxDuration = maxDuration;
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
    };

    this.sequence.push(data);
  }

  getData() {
    const date = new Date();
    return {
      testerName: this.testerName,
      sequence: this.sequence,
      startTime: this.startTime,
      endTime: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
      notation: this.notation,
      maxDuration: this.maxDuration
    };
  }
}

class StartPage extends Component {
  render() {
    const style = {
      width: this.props.width,
      height: this.props.height
    };

    return (
      <div className="test-start-page" style={style}>
        {
        this.props.practice ?
          null :
          <div className="tester-name">
            Name of tester:
            <input
              id="tester-name-input"
              type="text"
              value={this.props.testerName}
              onChange={this.props.onChange} />
          </div>
        }
        <div className="notation-placeholder">
          Music notation will appear here <br/>
          when you click "Begin Test."
          {
          this.props.practice ?
            null :
            <span>
            <br/><br/>
            Try to go as quickly as you can <br/>
            while still being accurate.
            </span>
          }
        </div>
      </div>
    );
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
   *   maxDuration: Once this duration (in seconds) has elapsed, the test
   *                will exit with "Next" is pressed, regardless of whether
   *                the tester has finished identifying all the chords
   *   practice:    This is a practice test; show the answers once the user
   *                has selected all the notes of the chord
   */
  constructor() {
    super();
    this.state = {
      currentChordIndex: 0,
      highlightedNotes: [],
      correctNotesMarked: [],
      canPlayNotes: false,
      testStarted: false,
      testerName: ""
    };
  }

  testerNameChanged(event) {
    this.setState({
      testerName: event.target.value
    });
  }

  startTest() {
    this.testLog = new TestLog(this.state.testerName,
                               this.props.notationRenderer,
                               this.props.maxDuration);
    this.setState({
      testStarted: true,
      canPlayNotes: true,
      startTime: performance.now()
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
          canPlayNotes: false,
          correctNotesMarked: this.props.practice ? correctChord.notes : []
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
      const totalTestingTime = (performance.now() - this.state.startTime) / 1000;
      if (index === this.props.chordSequence.length ||
          (this.props.maxDuration &&
           totalTestingTime > this.props.maxDuration)) {
        // done with the test; send test log to parent component
        this.props.testCompleted(this.testLog.getData());
      } else {
        console.log("Next chord");

        this.setState({
          currentChordIndex: index,
          highlightedNotes: [],
          correctNotesMarked: [],
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
        {
        this.state.testStarted ?
          <Notation
            width={400}
            height={300}
            chord={this.props.chordSequence[this.state.currentChordIndex]}
            renderer={this.props.notationRenderer} /> :
          <StartPage
            width={400}
            height={300}
            testerName={this.props.testerName}
            onChange={(event) => this.testerNameChanged(event)}
            practice={this.props.practice} />
        }
        <Keyboard
          notePlayed={(note) => this.notePlayed(note)}
          highlightedNotes={this.state.highlightedNotes}
          correctNotesMarked={this.state.correctNotesMarked} />
        {
        this.state.testStarted ?
          <NextButton
            onClick={() => this.nextChord()}
            disabled={this.state.canPlayNotes} /> :
          <StartButton
            onClick={() => this.startTest()}
            disabled={!(this.state.testerName || this.props.practice)} />
        }
      </div>
    );
  }
}

export default Test;