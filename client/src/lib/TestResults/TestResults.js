import React, { Component } from 'react';
import $ from 'jquery';
import './TestResults.css';

const LoadStatus = Object.freeze({
  LOADING: "loading",
  LOAD_SUCCESS: "load-success",
  LOAD_FAILURE: "load-failure"
});

class TestResult extends Component {
  /* props:
   *   testLog */
  calculateOverallAccuracy(log) {
    if (!log.sequence) {
      return 0;
    }

    let totalNotes = 0;
    let totalCorrectNotes = 0;
    for (let chord of log.sequence) {
      totalNotes += chord.numNotesPlayed;
      totalCorrectNotes += chord.numCorrectNotesPlayed;
    }

    return Math.round(totalCorrectNotes * 1000 / totalNotes) / 10;
  }

  calculateMedianElapsedTime(log) {
    if (!log.sequence) {
      return 0;
    }

    let elapsedTimes = [];
    for (let chord of log.sequence){
      elapsedTimes.push(chord.totalElapsedTime);
    }

    const medianElapsedTime = elapsedTimes[Math.floor(elapsedTimes.length / 2)];
    const inSeconds = medianElapsedTime / 1000;
    const rounded = Math.round(inSeconds * 100) / 100;

    return rounded;
  }

  render() {
    const log = this.props.testLog;
    return (
      <div className="test-result">
        <div>{log.testerName}</div>
        <div>Notation style: {log.notation}</div><br/>
        <div>Overall accuracy: {this.calculateOverallAccuracy(log)}%</div>
        <div>Median elapsed time: {this.calculateMedianElapsedTime(log)} seconds</div><br/>
        <div className="log-time-range">{log.startTime} - {log.endTime}</div>
      </div>
    );
  }
}

class TestResults extends Component {
  constructor() {
    super();
    this.state = {
      loadStatus: LoadStatus.LOADING,
      testLogs: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    // load test results from server
    const self = this;
    
    const APIServerURL = "//localhost:3000/api/test-logs";
    const jqxhr = $.get({
      url: APIServerURL,
      success: function (data, status) {
        if (jqxhr.status === 200) {
          console.log("Successfully loaded test logs.");
          self.setState({
            testLogs: data,
            loadStatus: LoadStatus.LOAD_SUCCESS
          });
        } else {
          console.log("Failed to load test logs with states " + status + ".");
          self.setState({
            loadStatus: LoadStatus.LOAD_FAILURE
          });
        }
      }
    });
    
    jqxhr.fail(function() {
      console.log("Failed to load test logs: GET request failed.");
      self.setState({
        loadStatus: LoadStatus.LOAD_FAILURE
      });
    });
  }

  createTestResults() {
    const testResults = [];

    const logs = this.state.testLogs;
    for (let i = logs.length - 1; i >= 0; i--) {
      testResults.push(<TestResult testLog={logs[i]} />);
    }

    return testResults;
  }

  render() {
    switch (this.state.loadStatus) {
      case LoadStatus.LOADING:
        return (<p>Loading data...</p>);
      case LoadStatus.LOAD_SUCCESS:
        return (
          <div>
            {this.createTestResults()}
          </div>
        );
      case LoadStatus.LOAD_FAILURE:
        return (<p>Unable to load data from server!</p>);
      default:
        return (<p> hello </p>);
    }
  }
}

export default TestResults;

