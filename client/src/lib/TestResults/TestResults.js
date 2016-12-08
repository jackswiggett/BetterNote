import React, { Component } from 'react';
import $ from 'jquery';
import './TestResults.css';

const LoadStatus = Object.freeze({
  LOADING: "loading",
  LOAD_SUCCESS: "load-success",
  LOAD_FAILURE: "load-failure"
});

function SearchAndFilter(props) {
  return (
    <form className="search-and-filter-results">
      <div>
        Tester name:&emsp;
        <input
          type="text"
          value={props.searchQuery}
          onChange={props.searchQueryChanged} />
      </div>
      <div id="notation-filter">
        Notation style:&emsp;
        <label>
          <input
            type="checkbox"
            value="klavar"
            checked={props.showKlavar}
            onChange={props.showKlavarChanged} />
          Klavar
        </label>
        &emsp;
        <label>
          <input
            type="checkbox"
            value="traditional"
            checked={props.showTraditional}
            onChange={props.showTraditionalChanged} />
          Traditional
        </label>
      </div>
      <div id="num-notes-filter">
        Number of notes:&emsp;
        <label>
          <input
            type="checkbox"
            value="one-note"
            checked={props.showOneNote}
            onChange={props.showOneNoteChanged} />
          1&emsp;
        </label>
        <label>
          <input
            type="checkbox"
            value="two-note"
            checked={props.showTwoNotes}
            onChange={props.showTwoNotesChanged} />
          2&emsp;
        </label>
        <label>
          <input
            type="checkbox"
            value="three-note"
            checked={props.showThreeNotes}
            onChange={props.showThreeNotesChanged} />
          3&emsp;
        </label>
      </div>
    </form>
  );
}

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
        <div className="test-result-left-panel">
          <div>Tester name: {log.testerName}</div>
          <div>Notation style: {log.notation}</div>
          <div>Number of notes: {log.sequence && log.sequence[0].numNotesPlayed}</div>
        </div>
        <div className="test-result-right-panel">
          <div>Overall accuracy: {this.calculateOverallAccuracy(log)}%</div>
          <div>Median elapsed time: {this.calculateMedianElapsedTime(log)} seconds</div>
          <div className="log-time-range">{log.startTime} - {log.endTime}</div>
        </div>
      </div>
    );
  }
}

class TestResults extends Component {
  constructor() {
    super();
    this.state = {
      loadStatus: LoadStatus.LOADING,
      testLogs: [],
      searchQuery: "",
      showKlavar: true,
      showTraditional: true,
      showOneNote: true,
      showTwoNotes: true,
      showThreeNotes: true
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
    const searchQueries = this.state.searchQuery.toLowerCase().split(" ");

    const logs = this.state.testLogs;
    for (let i = logs.length - 1; i >= 0; i--) {
      let testerName = logs[i].testerName;
      const sequence = logs[i].sequence;
      const notation = logs[i].notation;

      if (testerName && sequence) {
        testerName = testerName.toLowerCase();
        const numNotes = sequence[0].numNotesPlayed;
        let showResult = true;
        for (let query of searchQueries) {
          if (!testerName.includes(query) ||
              (!this.state.showKlavar && notation === "klavar") ||
              (!this.state.showTraditional && notation === "traditional") ||
              (!this.state.showOneNote && numNotes === 1) ||
              (!this.state.showTwoNotes && numNotes === 2) ||
              (!this.state.showThreeNotes && numNotes === 3)) {
            showResult = false;
            break;
          }
        }

        if (showResult) {
          testResults.push(<TestResult testLog={logs[i]} key={i} />);
        }
      }
    }

    return testResults;
  }

  searchQueryChanged(event) {
    this.setState({
      searchQuery: event.target.value
    });
  }

  filterChanged(event, filter) {
    console.log(filter, event.target.checked);
    const newState = {};
    newState[filter] = event.target.checked;
    this.setState(newState);
  }

  render() {
    switch (this.state.loadStatus) {
      case LoadStatus.LOADING:
        return (<p>Loading data...</p>);
      case LoadStatus.LOAD_SUCCESS:
        return (
          <div>
            <SearchAndFilter
              searchQuery={this.state.searchQuery}
              searchQueryChanged={(event) => this.searchQueryChanged(event)}
              showKlavar={this.state.showKlavar}
              showKlavarChanged={(event) => this.filterChanged(event, "showKlavar")}
              showTraditional={this.state.showTraditional}
              showTraditionalChanged={(event) => this.filterChanged(event, "showTraditional")}
              showOneNote={this.state.showOneNote}
              showOneNoteChanged={(event) => this.filterChanged(event, "showOneNote")}
              showTwoNotes={this.state.showTwoNotes}
              showTwoNotesChanged={(event) => this.filterChanged(event, "showTwoNotes")}
              showThreeNotes={this.state.showThreeNotes}
              showThreeNotesChanged={(event) => this.filterChanged(event, "showThreeNotes")} />
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

