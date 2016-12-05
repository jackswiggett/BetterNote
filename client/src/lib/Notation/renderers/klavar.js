/* The renderer for Klavar notation uses Fabric.js, available at
 * https://github.com/kangax/fabric.js/ */

import {fabric} from 'fabric';

const numSpaces = 13;
const paddingLeftSpaces = 0;
const paddingRightSpaces = 1;
const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
const hasSharp = [true, true, false, true, true, true, false];
const topLineWidth = 3;
const verticalLineWidth = 2;
const stemWidth = 3;
const stemYPositionRatio = 0.5; // y position of stem as a fraction of canvas height
const stemLengthSpaces = 2.2; // length of stem, in spaces

function renderNote(note, canvas, lineSpacing) {
  // calculate the note position
  let index = noteNames.indexOf(note.noteName);
  index += noteNames.length * (note.octave - 4); // offset to account for octave
  let xPos = (paddingLeftSpaces + index) * lineSpacing + verticalLineWidth / 2;
  let yPos = canvas.height * stemYPositionRatio;
  let color = note.state === "natural" ? "white" : "black";

  // translate the note according to state
  switch (note.state) {
    case "sharp":
      xPos += lineSpacing / 2;
      yPos -= lineSpacing - stemWidth;
      break;
    case "flat":
      xPos -= lineSpacing / 2;
      yPos -= lineSpacing - stemWidth;
      break;
    default:
      break;
  }

  canvas.add(new fabric.Circle({
    radius: lineSpacing / 2 - stemWidth / 2,
    left: xPos,
    top: yPos,
    fill: color,
    stroke: "black",
    strokeWidth: stemWidth
  }));

  return xPos; // so we can keep track of leftmost and rightmost notes in order
               // to draw the stem
}

function renderStem(leftNoteXPos, rightNoteXPos, canvas, lineSpacing) {
  const stemStart = leftNoteXPos + lineSpacing / 2;
  const stemEnd = rightNoteXPos + lineSpacing * (stemLengthSpaces + 1/2);
  const stemYPos = canvas.height * stemYPositionRatio;
  canvas.add(new fabric.Line(
    [stemStart, stemYPos, stemEnd, stemYPos],
    {
      stroke: 'black',
      strokeWidth: stemWidth
    }
  ));
}

function render(chord, documentElement) {
  const width = documentElement.clientWidth;
  const height = documentElement.clientHeight;

  const canvasElement = document.createElement("canvas");
  documentElement.appendChild(canvasElement);
  const canvas = new fabric.StaticCanvas(canvasElement);
  canvas.setDimensions({
    width: width,
    height: height
  });

  // add top line
  const lineSpacing = width / (numSpaces + paddingLeftSpaces + paddingRightSpaces);
  canvas.add(new fabric.Line(
    [0, 0, width - lineSpacing*paddingRightSpaces, 0],
    {
      stroke: 'black',
      strokeWidth: topLineWidth
    }
  ));

  // add vertical lines
  let xPos = lineSpacing * (paddingLeftSpaces + 1)
  for (let i = 0; i < numSpaces; i++) {
    // check if a line should be drawn
    if (hasSharp[i % hasSharp.length]) {
      // the leftmost two lines are dashed
      const isDashed = i < 2;

      // create the line
      canvas.add(new fabric.Line(
        [xPos, 0, xPos, height],
        {
          stroke: 'black',
          strokeWidth: verticalLineWidth,
          strokeDashArray: isDashed ? [10, 5] : []
        }
      ));
    }

    xPos += lineSpacing;
  }

  // add notes
  const xPositions = [];
  for (let note of chord.notes) {
    xPositions.push(renderNote(note, canvas, lineSpacing));
  }

  // add stem
  const leftNoteXPos = Math.min.apply(null, xPositions);
  const rightNoteXPos = Math.max.apply(null, xPositions);
  renderStem(leftNoteXPos, rightNoteXPos, canvas, lineSpacing);
}

export default render;
