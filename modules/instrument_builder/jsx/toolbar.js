import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
        {type: 'radio', label: 'Radio'},
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
            name='altLabel'
            label='Name'
            required={false}
            value={this.props.profile.name}
            onUserInput={this.props.onUpdate}
            // errorMessage='Please enter name of instrument.'
          />
          <TextboxElement
            name='prefLabel'
            label='Full Name'
            required={false}
            value={this.props.profile.fullName}
            onUserInput={this.props.onUpdate}
            // errorMessage="Please enter instrument's description"
          />
        </FormElement>
      </Panel>
    );
  }

  updateFilter(element, value) {
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
      border: '1px solid #CCC',
      borderRadius: '20px',
      padding: '5px',
      margin: '2px',
      color: '#064785',
      textAlign: 'center',
    };

    return this.state.fieldTypes.map((fieldType, key) => {
      if (this.isFiltered(fieldType.label)) {
        return (
          <div
            id={fieldType.type}
            key={fieldType.type}
            style={chipStyle}
            draggable={true}
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
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
    console.log(e.target.id);
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  onDragEnd(e) {
    let placeholder = document.getElementById('placeholder');
    if (placeholder != null) {
      placeholder.remove();
    }
  }

  render() {
    const style = {
      background: 'white',
      border: '1px solid #C3D5DB',
      padding: '10px',
      marginLeft: '-1px',
      marginTop: '-1px',
      order: 1,
      flex: '6',
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
  profile: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default Toolbar;
