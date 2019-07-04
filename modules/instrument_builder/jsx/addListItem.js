import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <FormElement
        name="addListItem"
        id="addListItem"
      >
        <TextboxElement
          name="itemid"
          label="Item ID"
        />
        <StaticElement
          label="UI type"
          text={this.props.uiType}
        />
        <TextboxElement
          label="Question text"
        />
        <SelectElement
          label="Data type"
        />

      </FormElement>
    );
  }

AddListItem.propTypes = {
  uiType: PropTypes.string.isRequired,
};
}
