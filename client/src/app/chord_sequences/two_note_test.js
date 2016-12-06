import {
  Note,
  Chord
} from '../../lib';

const chordSequence = [
  new Chord([
    new Note("A", 4),
    new Note("C", 5, "sharp")
  ]),
  new Chord([
    new Note("E", 4),
    new Note("F", 4)
  ]),
  new Chord([
    new Note("G", 4),
    new Note("B", 4, "flat")
  ]),
];

export default chordSequence;