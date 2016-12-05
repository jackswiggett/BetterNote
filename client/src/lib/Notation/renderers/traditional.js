/* The renderer for traditional notation uses the VexFlow library, available
 * at https://github.com/0xfe/vexflow */

import {Flow as VF} from 'vexflow';

const defaultStaffHeight = 73; // by default, the VexFlow staff is ~73px tall

function render(chord, documentElement) {
  // Create an SVG renderer and attach it to the documentElement
  const renderer = new VF.Renderer(documentElement, VF.Renderer.Backends.SVG);

  // Configure the rendering context
  const width = documentElement.clientWidth;
  const height = documentElement.clientHeight;
  renderer.resize(width, height);
  const context = renderer.getContext();
  context.setFont("Arial", 10, "").setBackgroundFillStyle("#fff");

  // Scale context so that notation fills the documentElement
  const scale = height / defaultStaffHeight;
  context.scale(scale, scale);

  // Create a stave
  const options = {
    fill_style: 'black',
    space_above_staff_ln: 1.5 // leave just enough space for the treble clef
  }
  const stave = new VF.Stave(0, 0, width, options);
  stave.addClef("treble");
  stave.setContext(context).draw();

  // Create a chord
  const numNotes = chord.notes.length;
  const keys = chord.notes.map(function(note) {
    return note.noteName + "/" + note.octave;
  });
  const vfChord = new VF.StaveNote({clef: "treble", keys: keys, duration: "q" });

  // Add accidentals
  for (let i = 0; i < numNotes; i++) {
    const note = chord.notes[i];
    if (note.state !== "natural") {
      vfChord.addAccidental(i, new VF.Accidental(note.state === "sharp" ? "#" : "b"));
    }
  }

  // Create a voice with the above chord
  var voice = new VF.Voice({num_beats: 1,  beat_value: 4});
  voice.addTickables([vfChord]);

  // Format and justify the notes to the context width
  new VF.Formatter().joinVoices([voice]).format([voice], width);

  // Render voice
  voice.draw(context, stave);
}

export default render;
