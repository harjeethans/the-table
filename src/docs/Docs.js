import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import './Docs.css';
import '../sass/index.css';
//import '../../node_modules/material-components-web/dist/material-components-web.css';

import Buttons from './components/Buttons';
import Menus from './components/Menus';
import Dialogs from './components/Dialogs';
import {BasicTable} from './table';

class Docs extends Component {
  render() {
    return (
        <Router>
          <div className="the-table-docs">
            <div className="mdc-layout mdc-js-layout mdc-layout--fixed-header">
              <header className="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--platform">
              <div className="mdc-toolbar__row">
                <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
                  <Link className="mdc-toolbar__title-link" to="/">
                    <h4 className="mdc-toolbar__title mdc-toolbar__title--full">the-table</h4>
                  </Link>
                  <Link className="mdc-toolbar__title-link" to="/about">
                    <h1 className="mdc-toolbar__title mdc-toolbar__title--full">About</h1>
                  </Link>
                  <Link className="mdc-toolbar__title-link" to="/topics">
                    <h1 className="mdc-toolbar__title mdc-toolbar__title--full">Getting Started</h1>
                  </Link>
                  <Link className="mdc-toolbar__title-link" to="/components">
                    <h1 className="mdc-toolbar__title mdc-toolbar__title--full">Components</h1>
                  </Link>
                  <Link className="mdc-toolbar__title-link" to="/table">
                    <h1 className="mdc-toolbar__title mdc-toolbar__title--full">Table</h1>
                  </Link>
                  <Link className="mdc-toolbar__title-link" to="/faq">
                    <h1 className="mdc-toolbar__title mdc-toolbar__title--full"> FAQ </h1>
                  </Link>
                </section>
              </div>
            </header>
            <main className="mdc-layout__content">
              {this.props.children}
            </main>
            <div>
              <Route exact path="/" component={Home}/>
              <Route path="/about" component={About}/>
              <Route path="/topics" component={Topics}/>
              <Route path="/components" component={Components}/>
              <Route path="/table" component={BT}/>
            </div>
          </div>
          </div>

        </Router>
    );
  }
}

const Home = () => (
  <div className="docs-sample">
    HOME
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Components = () => (
  <div className="docs-sample">
    <Buttons></Buttons>
    <Menus></Menus>
    <Dialogs></Dialogs>
  </div>
)

const BT = () => (
  <BasicTable></BasicTable>
)

const Tables = () => (
  <div>
    <h2>Table</h2>
      <div className="table-responsive-vertical shadow-z-1">
    <table className="table table-hover table-mc-light-blue">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Link</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-title="ID">1</td>
          <td data-title="Name">Material Design Color Palette</td>
          <td data-title="Link">
            GitHub
          </td>
          <td data-title="Status">Completed</td>
        </tr>
        <tr>
          <td data-title="ID">2</td>
          <td data-title="Name">Material Design Iconic Font</td>
          <td data-title="Link">
            Codepen
          </td>
          <td data-title="Status">Completed</td>
        </tr>
        <tr>
          <td data-title="ID">3</td>
          <td data-title="Name">Material Design Hierarchical Display</td>
          <td data-title="Link">
            GitHub
          </td>
          <td data-title="Status">Completed</td>
        </tr>
        <tr>
          <td data-title="ID">4</td>
          <td data-title="Name">Material Design Sidebar</td>
            <td data-title="Link">
              GitHub
            </td>

          <td data-title="Status">Completed</td>
        </tr>
        <tr>
          <td data-title="ID">5</td>
          <td data-title="Name">Material Design Tiles</td>
          <td data-title="Link">
            Codepen
          </td>
          <td data-title="Status">Completed</td>
        </tr>
        <tr>
          <td data-title="ID">6</td>
          <td data-title="Name">Material Design Typography</td>
          <td data-title="Link">
            GitHub
          </td>
          <td data-title="Status">Completed</td>
        </tr>
        <tr>
          <td data-title="ID">7</td>
          <td data-title="Name">Material Design Buttons</td>
          <td data-title="Link">
            Codepen
          </td>
          <td data-title="Status">In progress</td>
        </tr>
        <tr>
          <td data-title="ID">8</td>
          <td data-title="Name">Material Design Form Elements</td>
          <td data-title="Link">
            Codepen
          </td>
          <td data-title="Status">In progress</td>
        </tr>
        <tr>
          <td data-title="ID">9</td>
          <td data-title="Name">Material Design Email Template</td>
          <td data-title="Link">
            Codepen
          </td>
          <td data-title="Status">Completed</td>
        </tr>
        <tr>
          <td data-title="ID">10</td>
          <td data-title="Name">Material Design Animation Timing (old one)</td>
          <td data-title="Link">
            Codepen
          </td>
          <td data-title="Status">Completed</td>
        </tr>
      </tbody>
    </table>
  </div>
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
