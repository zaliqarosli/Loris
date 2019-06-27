import React, {Component} from 'react';
// import PropTypes from 'prop-types';

import Panel from 'Panel';
// import Modal from 'Modal';

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
      filter: {
        searchFieldType: '',
      },
    };

    this.renderProfilePanel = this.renderProfilePanel.bind(this);
    this.renderFieldsLibrary = this.renderFieldsLibrary.bind(this);
    this.renderFieldChips = this.renderFieldChips.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.isFiltered = this.isFiltered.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
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
            label='Name'
            required={false}
            // errorMessage='Please enter name of instrument.'
          />
          <TextboxElement
            name='instrumentDesc'
            label='Description'
            required={false}
            // errorMessage="Please enter instrument's description"
          />
        </FormElement>
      </Panel>
    );
  }

  updateFilter(name, value) {
    let filter = Object.assign({}, this.state.filter);
    filter.searchFieldType = value;
    this.setState({filter});
  }

  isFiltered(keyword) {
    let filter = this.state.filter.searchFieldType.toLowerCase();
    keyword = keyword.toLowerCase();

    return (keyword.indexOf(filter) > -1);
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
            name='searchFieldType'
            label='Search'
            placeholder='Name of Field Type'
            value={this.state.filter.searchFieldType}
            onUserInput={this.updateFilter}
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

    return this.state.fieldTypes.map((fieldType, key) => {
      if (this.isFiltered(fieldType.label)) {
        return (
          <div
            key={fieldType.type}
            style={chipStyle}
            draggable={true}
            onDragStart={this.onDragStart}
          >
            <label>{fieldType.label}</label>
          </div>
        );
      }
    });
  }

  onDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData('text/html', e.currentTarget);
  }

  onDragEnd(e) {
    // show form modal for attributes
  }

  render() {
    const style = {
      background: 'white',
      border: '1px solid #C3D5DB',
      padding: '10px',
      marginLeft: '-1px',
      marginTop: '-1px',
      zIndex: 2,
      order: 1,
      flex: '1',
      overflow: 'auto',
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
