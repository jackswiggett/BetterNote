import React, { Component } from 'react';
import {
  renderTraditional
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
    renderTraditional(this.props.chord, this.documentElement);
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