import React, { Component } from 'react';
import $ from 'jquery';
import { Test } from '../lib';
import './App.css';
import {
  oneNotePractice,
  twoNotePractice,
  threeNotePractice,
  oneNoteTest,
  twoNoteTest,
  threeNoteTest
} from './chord_sequences';

const maxTestDuration = 210; // tests will end after 210 seconds (3.5 minutes)

class TestSelector extends Component {
  onClick(practice=false) {
    const notation = $("#notation-selector").find(":selected").val();
    const sequenceName = $("#sequence-selector").find(":selected").val();

    let sequence;
    switch (sequenceName) {
      case "one-note":
        sequence = practice ? oneNotePractice : oneNoteTest;
        break;
      case "two-note":
        sequence = practice ? twoNotePractice : twoNoteTest;
        break;
      case "three-note":
        sequence = practice ? threeNotePractice : threeNoteTest;
        break;
      default:
        console.log("Invalid sequence selection: " + sequenceName);
        return;
    }

    this.props.onClick(notation, sequence, practice);
  }

  render() {
    return (
      <div className="test-selector">
        <select id="notation-selector">
          <option value="klavar">Notation K</option>
          <option value="traditional">Notation T</option>
        </select>
        <select id="sequence-selector">
          <option value="one-note">Single Notes</option>
          <option value="two-note">Two Note Chords</option>
          <option value="three-note">Three Note Chords</option>
        </select>
        <button
          className="button test-selector-button"
          onClick={() => this.onClick(true)}>
        Start Practice
        </button>
        <button
          className="button test-selector-button"
          onClick={() => this.onClick()}>
        Start Test
        </button>
      </div>
    );
  }
}

function TestLogSavedMessage(props) {
  if (props.visible) {
    if (props.success) {
      return (
        <div className="test-log-saved-success">
          <h4>Test completed and test log saved successfully :)</h4>
        </div>
      );
    } else {
      return (
        <div className="test-log-saved-failure">
          <h4>Test completed, but test log failed to save to database.</h4>
        </div>
      );
    }
  } else {
    return null;
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      testInProgress: false,
      notationRenderer: null,
      chordSequence: null,
      testLogSavedAttempt: false,
      testLogSavedSuccess: null,
      practiceTest: null
    }
  }

  testCompleted(data) {
    console.log(data);
    this.setState({
      testInProgress: false,
      notationRenderer: null,
      chordSequence: null
    });

    if (this.state.practiceTest) {
      this.setState({
        testLogSavedAttempt: false
      });
    } else {
      // send the test log data to the server
      const self = this;
      
      const APIServerURL = "//localhost:3000/api/test-logs";
      const jqxhr = $.post({
        url: APIServerURL,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data, status) {
          if (jqxhr.status === 201) {
            console.log("Successfully saved test log.");
            self.setState({
              testLogSavedAttempt: true,
              testLogSavedSuccess: true
            });
          } else {
            console.log("Failed to save test log with status " + status + ".");
            self.setState({
              testLogSavedAttempt: true,
              testLogSavedSuccess: false
            });
          }
        }
      });
      
      jqxhr.fail(function() {
        console.log("Failed to save test log: POST request failed.");
        self.setState({
          testLogSavedAttempt: true,
          testLogSavedSuccess: false
        });
      });
    }
  }

  startTest(notation, sequence, practice=false) {
    this.setState({
      testInProgress: true,
      practiceTest: practice,
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
          testCompleted={(data) => this.testCompleted(data)}
          maxDuration={this.state.practiceTest ? null : maxTestDuration}
          practice={this.state.practiceTest} />
      );
    } else {
      // let the user begin a test
      return (
        <div>
          <h1>Create A New Test</h1>
          <TestSelector
            onClick={(n, s, p) => this.startTest(n, s, p)} />
          <TestLogSavedMessage
            visible={this.state.testLogSavedAttempt}
            success={this.state.testLogSavedSuccess} />
        </div>
      );
    }
  }
}

export default App;
