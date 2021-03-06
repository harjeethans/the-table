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
import {BasicTable, LocalTableSample} from './table';

class Docs extends Component {
  render() {
    return (
        <Router>
          <div className="the-table-docs">
            <div className="header">
              <header className="header">
                <div className="header__row">
                  <section className="nav-section">
                    <Link className="nav-link" to="/">
                      <h4 className="">the-table</h4>
                    </Link>
                    <Link className="nav-link" to="/about">
                      <h4 className="">About</h4>
                    </Link>
                    <Link className="nav-link" to="/topics">
                      <h4 className="">Getting Started</h4>
                    </Link>
                    <Link className="nav-link" to="/components">
                      <h4 className="">Components</h4>
                    </Link>
                    <Link className="nav-link" to="/table">
                      <h4 className="">Table</h4>
                    </Link>
                    <Link className="nav-link" to="/localtable">
                      <h4 className="">Local Table</h4>
                    </Link>
                    <Link className="nav-link" to="/faq">
                      <h4 className=""> FAQ </h4>
                    </Link>
                  </section>
                </div>
            </header>
            <main className="mdc-layout__content">
              {this.props.children}
            </main>
            <div className="container-fluid">
              <Route exact path="/" component={Home}/>
              <Route path="/about" component={About}/>
              <Route path="/topics" component={Topics}/>
              <Route path="/components" component={Components}/>
              <Route path="/table" component={BT}/>
              <Route path="/localtable" component={LocalTableSample}/>

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
