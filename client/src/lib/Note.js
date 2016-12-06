/* The Note class is not a React component; it represents a musical note and is
 * the data structure that App, Keyboard, and Notation use to communicate. */

const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
const hasSharp = [true, true, false, true, true, true, false];
const hasFlat = [false, true, true, false, true, true, true];

class Note {
  constructor(noteName, octave, state="natural") {
    /* noteName: any of the values in noteNames (defined above)
     * octave: any integer between 0 and 9
     * state: "natural", "sharp", or "flat"
     *
     * Alternatively, octave and state can be ommitted, and noteName
     * passed in the form "C4", "Bb5", "A#5", etc.
     */
    if (!octave) {
      const fullNoteName = noteName;
      noteName = fullNoteName[0];
      if (isNaN(fullNoteName[1])) {
        switch (fullNoteName[1]) {
          case "#":
            state="sharp"
            break;
          case "b":
            state="flat"
            break;
          default:
            throw new Error("Invalid accidental " + fullNoteName[1]);
        }
        octave = +fullNoteName[2];
      } else {
        octave = +fullNoteName[1];
      }
    }

    // check that the note name is valid
    if (!noteNames.includes(noteName)) {
      throw new Error(
        "Note name \"" + noteName + "\" is invalid. Valid note names are: " + noteNames);
    }

    // check that the octave is valid
    if (octave < 0 || octave > 9) {
      throw new Error("Attempt to create a note in octave " + octave + ". " +
                      "Octave must be between 0 and 9.");
    }

    // check that the state is valid
    const validStates = ["natural", "sharp", "flat"];
    if (!validStates.includes(state)) {
      throw new Error("Note state \"" + state + "\" is invalid. Valid note states are: " + validStates);
    }
    const index = noteNames.indexOf(noteName);
    if (state === "sharp" && !hasSharp[index]) {
      throw new Error(noteName + " sharp is not a valid note.");
    } else if (state === "flat" && !hasFlat[index]) {
      throw new Error(noteName + " flat is not a valid note.");
    }

    // initialize the note
    this.noteName = noteName;
    this.octave = octave;
    this.state = state;
  }



  standardized() {
    /* Returns a copy of this note. If this note is a flat, the copy will be the equivalent
     * note, represented as a sharp. */
    const copy = new Note(this.noteName, this.octave, this.state);
    if (copy.state === "flat") {
      const name = copy.noteName;
      copy.noteName = noteNames[noteNames.indexOf(name) - 1];
      copy.state = "sharp";
    }

    return copy;
  }

  equals(note, checkOctave=false) {
    /* Returns true if this note is equivalent to the other note, ignoring whether it is
     * represented as a sharp or as a flat (i.e. C# = Db). Returns false otherwise. */
    // convert both to sharps
    const thisNote = this.standardized();
    const otherNote = note.standardized();

    if (checkOctave && thisNote.octave !== otherNote.octave) {
      return false;
    }

    return (thisNote.noteName === otherNote.noteName &&
            thisNote.state === otherNote.state);
  }

  describe() {
    var symbol;
    switch (this.state) {
      case "sharp":
        symbol = "#";
        break;
      case "flat":
        symbol = "b";
        break;
      default:
        symbol = "";
    }

    return this.noteName + symbol + this.octave;
  }

  static numNoteNames() {
    return noteNames.length;
  }

  static noteName(index) {
    return noteNames[index];
  }

  static hasSharp(index) {
    return hasSharp[index];
  }
}

class Chord {
  constructor(notes) {
    if (typeof notes === 'string') {
      notes = notes.match(/\S+/g) || []
      this.notes = notes.map((noteName) => new Note(noteName));
    } else {
      this.notes = notes;
    }
  }

  describe() {
    return this.notes.map((note) => note.describe()).join(" ");
  }
}

export {
  Note,
  Chord
};