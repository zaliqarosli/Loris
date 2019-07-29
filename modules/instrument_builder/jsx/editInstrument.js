import React, {Component} from 'react';
import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import Modal from 'Modal';
import Loader from 'Loader';
import {Tabs, TabPane} from 'Tabs';
import FilterableDataTable from 'FilterableDataTable';

import InstrumentBuilderTab from './instrumentBuilderTab';

class InstrumentBuilderIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      formData: {
        fileToLoad: null,
      },
      showModal: false,
      schemaID: null,
    };

    this.fetchData = this.fetchData.bind(this);
    this.chooseFile = this.chooseFile.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.loadInstrument = this.loadInstrument.bind(this);
    this.goToBuilder = this.goToBuilder.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
     return fetch(this.props.fetchURL, {credentials: 'same-origin'})
    .then((resp) => resp.json())
    .then((data) => {
      this.setState({data});
    })
    .catch((error) => {
      this.setState({error: true});
      console.error(error);
    });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  chooseFile(formElement, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[formElement] = value;
    this.setState(formData);
  }

  /**
   * Handles the submission of the Load Instrument Form
   *
   * @param {event} e - event of the form
   */
  loadFile() {
    let formData = Object.assign({}, this.state.formData);
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
    formObject.append('fire_away', 'Load');

    fetch(this.props.loadURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => {
      if (resp.ok && resp.status === 200) {
        swal('Success!', 'Instrument loaded.', 'success').then((result) => {
          if (result.value) {
            this.fetchData();
          }
        });
      } else {
        resp.text().then((message) => {
          swal('Error!', message, 'error');
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  goToBuilder(e) {

  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = <td>{cell}</td>;
    switch (column) {
      case 'Instrument':
        const url = loris.BaseURL + '/instrument_builder?schemaID=' +
                      row.ID + '#buildInstruments';
        result = <td><a href={url}>{cell}</a></td>;
        break;
      case 'Edit Instrument':
        const editButton = (
          <ButtonElement
            key={'edit_' + column}
            name="edit"
            label="Edit"
            onUserInput={this.goToBuilder}
          />
        );
        result = <td>{editButton}</td>;
        break;
        
    }
    return result;
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  loadInstrument() {
    return (
      <Modal
        title='Load Instrument'
        onClose={this.closeModal}
        show={this.state.showModal}
      >
        <FormElement
          Module="instrumentBuilder"
          name="loadInstrument"
          id="loadInstrumentForm"
          onSubmit={this.loadFile}
          method="POST"
        >
          <FileElement
            name='instrumentFileUpload'
            id='instrumentFileUpload'
            onUserInput={this.chooseFile}
            label='Instrument'
            required={true}
            value={this.state.formData.fileToLoad}
          />
          <ButtonElement
            name="fire_away"
            label="Load Instrument"
            type="submit"
          />
        </FormElement>
      </Modal>
    );
  }

  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    return (
      <InstrumentBuilderTab
        fetchURL={`${loris.BaseURL}/instrument_builder/edit/`}
      />
    );
  }
}

InstrumentBuilderIndex.propTypes = {
  fetchURL: PropTypes.string.isRequired,
  loadURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <InstrumentBuilderIndex
      fetchURL={`${loris.BaseURL}/instrument_builder/?format=json`}
      loadURL={`${loris.BaseURL}/instrument_buider/`}
    />,
    document.getElementById('lorisworkspace')
  );
});