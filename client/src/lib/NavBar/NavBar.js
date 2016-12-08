import React, { Component } from 'react';
import './NavBar.css';

class NavBar extends Component {
  /* props:
   *   pages: an array of objects with the following keys:
                name - page name to display in the nav bar
                active - true if this is the current page
                onClick - function to call when this page is clicked
   */
  createLinks() {
    const links = [];
    const pages = this.props.pages;
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const className = page.active ? "nav-link active" : "nav-link";

      links.push(
        <li className={className} onClick={page.onClick} key={i}>
          {page.name}
        </li>
      );
    }

    return links;
  }


  render() {
    return (
      <ul className="nav-bar">
        {this.createLinks()}
      </ul>
    );
  }
}

export default NavBar;
