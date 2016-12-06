import {
  Note,
  Chord
} from '../../lib';

const chordSequence = [
  new Chord([
    new Note("E", 4, "flat"),
    new Note("F", 4),
    new Note("G", 4, "flat")
  ]),
  new Chord([
    new Note("C", 4),
    new Note("F", 4),
    new Note("A", 4)
  ]),
  new Chord([
    new Note("G", 4),
    new Note("C", 5),
    new Note("E", 5, "flat")
  ]),
];

export default chordSequence;