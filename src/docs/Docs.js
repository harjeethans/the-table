import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import './Docs.css';
import '../sass/index.css';
//import '../../node_modules/material-components-web/dist/material-components-web.css';

import {Button, Table, Icon, IconButton} from '../lib/index'

class Docs extends Component {
  render() {
    return (
        <Router>
          <div className="mdc-layout mdc-js-layout mdc-layout--fixed-header">
            <header className="mdc-layout__header">
            <div className="mdc-layout__header-row">
              <span className="mdc-layout-title">the-table</span>
              <nav className="mdc-navigation mdc-layout--large-screen-only">
                <Link className="mdc-navigation__link" to="/">About</Link>
                <Link className="mdc-navigation__link" to="/about">About</Link>
                <Link className="mdc-navigation__link" to="/topics">Getting Started</Link>
                <Link className="mdc-navigation__link" to="/components">Components</Link>
                <Link className="mdc-navigation__link" to="/faq">FAQ</Link>
              </nav>
              <div className="mdc-layout-spacer"></div>
              <nav className="mdc-navigation mdc-layout--large-screen-only">
              <Link className="mdc-navigation__link" to="https://github.com/harjeethans/the-table">GitHub</Link>
              </nav>
            </div>
          </header>
          <div className="mdc-layout__drawer">
            <span className="mdc-layout-title">materialistic</span>
            <nav className="mdc-navigation">
              <Link className="mdc-navigation__link" to="https://github.com/harjeethans/the-table">GitHub</Link>
            </nav>
          </div>
          <main className="mdc-layout__content">
            {this.props.children}
          </main>
          <div>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/topics" component={Topics}/>
          </div>

        </div>
        </Router>
    );
  }
}

const Home = () => (
  <div className="docs-sample">
    <Button accent={true}>accent</Button>&nbsp;
    <Button compact={true}>compact</Button>&nbsp;
    <Button dense={true}>dense</Button>&nbsp;
    <Button primary={true}>primary</Button>&nbsp;
    <Button raised={true}>raised</Button>&nbsp;
    <IconButton primary={true} iconName="search"></IconButton>

      <select className="mdc-select">
      <option value="" default selected>Pick a food</option>
      <option value="grains">Bread, Cereal, Rice, and Pasta</option>
      <option value="vegetables">Vegetables</option>
      <optgroup label="Fruits">
        <option value="apple">Apple</option>
        <option value="oranges">Orange</option>
        <option value="banana">Banana</option>
      </optgroup>
      <option value="dairy">Milk, Yogurt, and Cheese</option>
      <option value="meat">Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts</option>
      <option value="fats">Fats, Oils, and Sweets</option>
    </select>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

export default Docs;
