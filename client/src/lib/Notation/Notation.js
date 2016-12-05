import React, { Component } from 'react';
import {
  renderTraditional,
  renderKlavar
} from './renderers';
import './Notation.css';

class Notation extends Component {
  render() {
    const style = {
      width: this.props.width,
      height: this.props.height
    }

    return (
      <div id="notation" style={style}></div>
    );
  }

  renderNotes() {
    var renderFunc;

    switch (this.props.renderer) {
      case "traditional":
        renderFunc = renderTraditional;
        break;
      case "klavar":
        renderFunc = renderKlavar;
        break;
      default:
        break;
    }

    console.log("Rendering chord: " + this.props.chord.describe());
    renderFunc(this.props.chord, this.documentElement);
  }

  componentDidMount() {
    this.documentElement = document.getElementById("notation");
    this.renderNotes();
  }

  componentDidUpdate() {
    // remove the existing render
    while (this.documentElement.firstChild) {
      this.documentElement.removeChild(this.documentElement.firstChild);
    }

    // re-render
    this.renderNotes();
  }
}

export default Notation;