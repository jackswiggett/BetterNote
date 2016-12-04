import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

/* Modify these properties to change the appearance of the keyboard */
const keyboardProps = {
  width: 700, // total keyboard width, in pixels
  height: 150, // total keyboard height, in pixels
  numWhiteKeys: 14, // 14 white keys = two full octaves
  firstKey: 0, // index of first white key on the left of the keyboard; 0 = C, 1 = D, etc.
  firstOctave: 4, // index of the octave on the piano that the first white key belongs to
  highlightedColor: "#edc66a", // color of a key when it is highlighted
  blackKeyHeightRatio: 0.6, // ratio of black key height to white key height
  blackKeyWidthRatio: 0.6 // ratio of black key width to white key width
};

/* Properties for white and black keys are calculated based on the keyboardProps */
const whiteKeyProps = {
  width: keyboardProps.width / keyboardProps.numWhiteKeys,
  height: keyboardProps.height,
  names: ["C", "D", "E", "F", "G", "A", "B"]
};

const blackKeyProps = {
  width: whiteKeyProps.width * keyboardProps.blackKeyWidthRatio,
  height: whiteKeyProps.height * keyboardProps.blackKeyHeightRatio,
  names: ["C#", "D#", null, "F#", "G#", "A#", null]
};

const notesSequence = [
  ["F"],
  ["G, B, D"],
  ["F#"]
];

class Note {
  constructor(noteName, octave) {
    // make sure input is valid; otherwise throw an error
    const validNotes = whiteKeyProps.names.concat(blackKeyProps.names);
    if (!validNotes.includes(noteName)) {
      throw new Error(
        "Note name \"" + noteName + "\" is invalid. Valid note names are: " + validNotes);
    }
    if (octave < 0) {
      throw new Error("Attempt to create a note in octave " + octave + ". " +
                      "Octave cannot be negative.");
    }

    // initialize the note
    this.noteName = noteName;
    this.octave = octave;
  }
}

function Notation(props) {
  return (
    <div className="notation">
      <p>{props.notes}</p>
    </div>
  );
}

class Keyboard extends Component {
  constructor() {
    super();

    this.state = {
      highlightedNotes: []
    };

    this.style = {
      width: keyboardProps.width,
      height: keyboardProps.height
    };

    // create array of white keys
    this.whiteKeys = [];
    this.whiteNotes = [];
    for (let i = 0; i < keyboardProps.numWhiteKeys; i++) {
      this.whiteKeys.push(
        <Key
          type="white-key"
          xPos={i*whiteKeyProps.width}
          key={i} // required by React
          index={i}
          onClick={(index) => this.whiteKeyClicked(index)} />
      );
      this.whiteNotes.push(
        new Note(
          whiteKeyProps.names[(i + keyboardProps.firstKey) % 7], // note name
          keyboardProps.firstOctave + Math.floor((i + keyboardProps.firstKey) / 7) // note octave
        )
      );
    }

    // create array of black keys
    this.blackKeys = [];
    this.blackNotes = [];
    const blackKeyOffset = whiteKeyProps.width - blackKeyProps.width / 2;
    for (let i = 0; i < keyboardProps.numWhiteKeys - 1; i++) {
      const indices = [0, 1, 3, 4, 5]; // indices of white keys after which there should be a black key
      if (indices.includes((i + keyboardProps.firstKey) % 7)) {
        this.blackKeys.push(
          <Key
            type="black-key"
            xPos={blackKeyOffset + i*whiteKeyProps.width}
            key={i} // required by React
            index={i}
            onClick={(index) => this.blackKeyClicked(index)} />
        );
        this.blackNotes.push(
          new Note(
            blackKeyProps.names[(i + keyboardProps.firstKey) % 7], // note name
            keyboardProps.firstOctave + Math.floor((i + keyboardProps.firstKey) / 7) // note octave
          )
        );
      } else {
        this.blackKeys.push(null);
        this.blackNotes.push(null);
      }
    }
  }

  blackKeyClicked(index) {
    const note = this.blackNotes[index];
    this.props.notePlayed(note);
  }

  whiteKeyClicked(index) {
    const note = this.whiteNotes[index];
    this.props.notePlayed(note);
  }

  render() {
    const whiteKeys = this.whiteKeys.slice();
    const blackKeys = this.blackKeys.slice();

    // Highlight keys corresponding to the notes in props.highlightedNotes
    for (var i = 0; i < this.props.highlightedNotes.length; i++) {
      const note = this.props.highlightedNotes[i];
      if (whiteKeyProps.names.includes(note.noteName)) {
        // this highlighted key is white
        const index = this.whiteNotes.indexOf(note);
        whiteKeys[index] = (
          <Key
            type="white-key"
            xPos={whiteKeys[index].props.xPos}
            key={index} // required by React
            index={index}
            highlighted={true}
            onClick={() => false} /> // do nothing when a highlighted key is clicked
        );
      } else {
        // this highlighted key is black
        const index = this.blackNotes.indexOf(note);
        blackKeys[index] = (
          <Key
            type="black-key"
            xPos={blackKeys[index].props.xPos}
            key={index}
            index={index}
            highlighted={true}
            onClick={() => false} /> // do nothing when a highlighted key is clicked
        );
      }
    }

    return (
      <div className="keyboard" style={this.style}>
        {whiteKeys}
        {blackKeys}
      </div>
    );
  }
}

function Key(props) {
  /* props:
   *   type: "white-key" or "black-key"
   *   xPos: x-position at which to render the left edge of the key
   *   highlighted: true if the key should be higlighted, false or undefined otherwise
   *   index: index of this key, starting with 0 at the left of the keyboard. Black and
   *          white keys are separately indexed.
   */
  const style = {
    left: props.xPos,
    width: props.type === "white-key" ? whiteKeyProps.width : blackKeyProps.width,
    height: props.type === "white-key" ? whiteKeyProps.height : blackKeyProps.height
  };

  if (props.highlighted) {
    style.backgroundColor = keyboardProps.highlightedColor;
  }

  function onClick() {
    props.onClick(props.index);
  }

  return (
    <div className={props.type} style={style} onClick={onClick}></div>
  )
}

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
    this.setState({currentNotesIndex: index});

    this.setState({highlightedNotes: []});
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
