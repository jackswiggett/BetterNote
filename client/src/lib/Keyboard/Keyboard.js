import React, { Component } from 'react';
import { Note } from '../Note';
import './Keyboard.css';

/* Modify these properties to change the appearance of the keyboard */
const keyboardProps = {
  width: 900, // total keyboard width, in pixels
  height: 200, // total keyboard height, in pixels
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
  height: keyboardProps.height
};

const blackKeyProps = {
  width: whiteKeyProps.width * keyboardProps.blackKeyWidthRatio,
  height: whiteKeyProps.height * keyboardProps.blackKeyHeightRatio
};

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
          Note.noteName((i + keyboardProps.firstKey) % Note.numNoteNames()), // name
          keyboardProps.firstOctave +
            Math.floor((i + keyboardProps.firstKey) / Note.numNoteNames()), // octave
          "natural" // state
        )
      );
    }

    // create array of black keys
    this.blackKeys = [];
    this.blackNotes = [];
    const blackKeyOffset = whiteKeyProps.width - blackKeyProps.width / 2;
    for (let i = 0; i < keyboardProps.numWhiteKeys - 1; i++) {
      //const indices = [0, 1, 3, 4, 5]; // indices of white keys after which there should be a black key
      if (Note.hasSharp((i + keyboardProps.firstKey) % Note.numNoteNames())) {
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
            Note.noteName((i + keyboardProps.firstKey) % Note.numNoteNames()), // name
            keyboardProps.firstOctave +
              Math.floor((i + keyboardProps.firstKey) / Note.numNoteNames()), // octave
            "sharp" // state
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

  noteIsHighlighted(note) {
    for (let highlightedNote of this.props.highlightedNotes) {
      if (note.equals(highlightedNote, true)) {
        return true;
      }
    }
    return false;
  }

  noteIsMarkedCorrect(note) {
    for (let markedNote of this.props.correctNotesMarked) {
      if (note.equals(markedNote)) {
        return true;
      }
    }
    return false;
  }

  render() {
    const whiteKeys = this.whiteKeys.slice();
    const blackKeys = this.blackKeys.slice();

    for (let noteSet of [this.whiteNotes, this.blackNotes]) {

      for (let index = 0; index < noteSet.length; index++) {
        const note = noteSet[index];
        if (note === null) {
          continue;
        }
        const isHighlighted = this.noteIsHighlighted(note);
        const isMarkedCorrect = this.noteIsMarkedCorrect(note);

        if (isHighlighted || isMarkedCorrect) {
          const keySet = (noteSet === this.whiteNotes) ? whiteKeys : blackKeys;
          keySet[index] = (
            <Key
              type={(noteSet === this.whiteNotes) ? "white-key" : "black-key"}
              xPos={keySet[index].props.xPos}
              key={index}
              index={index}
              highlighted={isHighlighted}
              markedCorrect={isMarkedCorrect}
              onClick={() => false} /> // do nothing when a marked key is clicked
          );
        }

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
   *   markedCorrect: true if the key should be marked as a correct note, false or undefined otherwise
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
    <div className={props.type} style={style} onClick={onClick}>
    {props.markedCorrect ?
      <div className="key-marked-correct" onClick={onClick}></div> :
      null
    }
    </div>
  )
}

export default Keyboard;
