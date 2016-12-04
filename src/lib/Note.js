/* The Note class is not a React component; it represents a musical note and is
 * the data structure that App, Keyboard, and Notation use to communicate. */

const whiteNoteNames = ["C", "D", "E", "F", "G", "A", "B"];
const blackNoteNames = ["C#", "D#", null, "F#", "G#", "A#", null];

class Note {
  constructor(noteName, octave) {
    // make sure input is valid; otherwise throw an error
    const validNotes = whiteNoteNames.concat(blackNoteNames);
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

  static whiteNoteNames() {
    return whiteNoteNames;
  }

  static blackNoteNames() {
    return blackNoteNames;
  }
}

export default Note;