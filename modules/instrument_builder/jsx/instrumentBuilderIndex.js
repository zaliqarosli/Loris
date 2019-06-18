import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.loadInstrument = this.loadInstrument.bind(this);
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
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    return <td>{cell}</td>;
  }

  loadInstrument() {

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

    let tabList = [
      {id: 'browseInstruments', label: 'Browse'},
      {id: 'buildInstruments', label: 'Build'},
    ];

    /**
    * XXX: Currently, the order of these fields MUST match the order of the
    * queried columns in _setupVariables() in instrument_builder.class.inc
    */
    const fields = [
      {label: 'Instrument ID', show: true, filter: {
        name: 'instrumentID',
        type: 'text',
      }},
      {label: 'Instrument Name', show: true, filter: {
        name: 'instrumentName',
        type: 'text',
      }},
      {label: 'Description', show: true, filter: {
        name: 'description',
        type: 'text',
      }},
    ];
    const actions = [
      {label: 'Load Instrument', action: this.loadInstrument},
    ];

    return (
      <Tabs
        tabs={tabList}
        defaultTab='browseInstruments'
      >
        <TabPane
          TabId={'browseInstruments'}
        >
          <FilterableDataTable
            name='instrumentBuilder'
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
            actions={actions}
          />
        </TabPane>
        <TabPane
          TabId={'buildInstruments'}
        >
          <InstrumentBuilderTab

          />
        </TabPane>
      </Tabs>
    );
  }
}

InstrumentBuilderIndex.propTypes = {
  fetchURL: PropTypes.string.isRequired,
  submitURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <InstrumentBuilderIndex
      fetchURL={`${loris.BaseURL}/instrument_builder/?format=json`}
      submitURL={`${loris.BaseURL}/instrument_buider/`}
    />,
    document.getElementById('lorisworkspace')
  );
});
