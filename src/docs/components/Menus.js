import React from 'react';

import {Menu, MenuItem} from 'the-table';

class Menus extends React.Component {
  render() {
    return (
      <div style={{width:200}}>
        <Menu className="foo" label="options">
          <MenuItem className="mdl-menu__item">Some Action</MenuItem>
          <MenuItem className="mdl-menu__item mdl-menu__item--full-bleed-divider">Another Action</MenuItem>
          <MenuItem disabled className="mdl-menu__item">Disabled Action</MenuItem>
          <MenuItem className="mdl-menu__item">Yet Another Action</MenuItem>
        </Menu>
        <Menu className="bar" icon="settings">
          <MenuItem className="mdl-menu__item">Some Action</MenuItem>
          <MenuItem className="mdl-menu__item mdl-menu__item--full-bleed-divider">Another Action</MenuItem>
          <MenuItem disabled className="mdl-menu__item">Disabled Action</MenuItem>
          <MenuItem className="mdl-menu__item">Yet Another Action</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default Menus;
