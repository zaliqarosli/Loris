import React, {Component} from 'react';
// import PropTypes from 'prop-types';

import Panel from 'Panel';

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldTypes: [
        {type: 'pageBreak', label: 'Page Break'},
        {type: 'section', label: 'Section'},
        {type: 'header', label: 'Header'},
        {type: 'text', label: 'Text'},
        {type: 'select', label: 'Select'},
        {type: 'label', label: 'Label'},
        {type: 'numeric', label: 'Numeric'},
        {type: 'date', label: 'Date'},
        {type: 'boolean', label: 'Boolean'},
        {type: 'score', label: 'Score'},
      ],
    };

    this.renderProfilePanel = this.renderProfilePanel.bind(this);
    this.renderFieldsLibrary = this.renderFieldsLibrary.bind(this);
    this.renderFieldChips = this.renderFieldChips.bind(this);
  }

  componentDidMount() {

  }

  renderProfilePanel() {
    return (
      <Panel
        id='profile'
        title='Instrument Profile'
      >
        <FormElement
          name='profileForm'
          columns={1}
        >
          <TextboxElement
            name='instrumentName'
            class='col-sm-12'
            placeholder='Name'
            required={false}
            // errorMessage='Please enter name of instrument.'
          />
          <TextboxElement
            name='instrumentDesc'
            class='col-sm-12'
            placeholder='Description'
            required={false}
            // errorMessage="Please enter instrument's description"
          />
        </FormElement>
      </Panel>
    );
  }

  renderFieldsLibrary() {
    return (
      <Panel
        id='library'
        title='Field Types'
      >
        <FormElement
          name='libraryForm'
          columns={1}
        >
          <TextboxElement
            name='fieldType'
            label='Search'
            placeholder='Name of Field Type'
          />
        </FormElement>
        {this.renderFieldChips()}
      </Panel>
    );
  }

  renderFieldChips() {
    const chipStyle = {
      border: '1px solid #064785',
      borderRadius: '2px',
      background: 'white',
      padding: '5px',
      color: '#246EB6',
      textAlign: 'center',
    };
    // const fieldTypes = Object.assign({}, this.state.fieldTypes);

    return this.state.fieldTypes.map((fieldType, key) => {
      return (
        <div key={fieldType.type} style={chipStyle}>
          <label>{fieldType.label}</label>
        </div>
      );
    });
  }

  render() {
    const style = {
      background: '#E4EBF2',
      border: '1px solid #C3D5DB',
      padding: '10px',
      marginLeft: '-1px',
      marginTop: '-1px',
      zIndex: 1000,
      order: 1,
      flex: '1',
    };

    return (
      <div id="toolbar" style={style}>
        {this.renderProfilePanel()}
        {this.renderFieldsLibrary()}
      </div>
    );
  }
}

Toolbar.propTypes = {

};

export default Toolbar;
