/* The Note class is not a React component; it represents a musical note and is
 * the data structure that App, Keyboard, and Notation use to communicate. */

const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
const hasSharp = [true, true, false, true, true, true, false];
const hasFlat = [false, true, true, false, true, true, true];

class Note {
  constructor(noteName, octave, state="natural") {
    /* noteName: any of the values in noteNames (defined above)
     * octave: any integer >= 0
     * state: "natural", "sharp", or "flat"
     */

    // check that the note name is valid
    if (!noteNames.includes(noteName)) {
      throw new Error(
        "Note name \"" + noteName + "\" is invalid. Valid note names are: " + noteNames);
    }

    // check that the octave is valid
    if (octave < 0) {
      throw new Error("Attempt to create a note in octave " + octave + ". " +
                      "Octave cannot be negative.");
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
    this.notes = notes;
  }

  describe() {
    return this.notes.map((note) => note.describe()).join(" ");
  }
}

export {
  Note,
  Chord
};