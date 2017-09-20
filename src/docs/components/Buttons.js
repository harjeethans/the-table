

import React from 'react';

import {Button, IconButton} from 'the-table';

class Buttons extends React.Component {

  render() {

    return (
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
    );
  }
}

export default Buttons;
