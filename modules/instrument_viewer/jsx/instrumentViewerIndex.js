import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';

import InstrumentFormContainer from '../../../jsx/InstrumentFormContainer';

const INPUT_ELEMENT_TYPES = ['select', 'date', 'radio', 'text', 'calc', 'checkbox', 'numeric'];

function getAgeInMonths(dob) {
  function monthsBetween(date1, date2) {
    return date2.getMonth() - date1.getMonth() + (12 * (date2.getFullYear() - date1.getFullYear()));
  }
  return monthsBetween(dob, new Date());
}

class InstrumentViewerIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      options: {
        surveyMode: false,
      },
      lang: 'en-ca',
      context: {
        age_mths: 161,
        dob: '2005-07-06',
        lang: '2',
      },
    };

    this.fetchData = this.fetchData.bind(this);
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
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
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
      <div name='instrumentView' className='panel panel-primary'>
        <InstrumentFormContainer
          instrument={this.state.data}
          options={this.state.options}
          initialData={getInitialData(this.state.data)}
          lang={this.state.lang}
          context={this.state.context}
        />
      </div>
    );
  }
}

InstrumentViewerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <InstrumentViewerIndex dataURL={`${loris.BaseURL}/instrument_viewer/fetchInstrument/`}/>,
    document.getElementById('lorisworkspace')
  );
});
