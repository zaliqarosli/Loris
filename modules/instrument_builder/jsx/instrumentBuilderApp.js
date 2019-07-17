import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from './toolbar';
import Canvas from './canvas';
import EditDrawer from './editdrawer';

const jsonld = require('jsonld');

class InstrumentBuilderApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schemaURI: this.props.schemaURI,
      schemaJSON: {},
      expanded: {},
      flattened: {},
      formData: {},
      error: false,
    };
    this.fetchData = this.fetchData.bind(this);
    this.updateFormData = this.updateFormData.bind(this);
    this.mapFormData = this.mapFormData.bind(this);
  }

  async componentDidMount() {
    try {
      // this.fetchData();
      const resp = await fetch(this.state.schemaURI);
      if (!resp.ok) {
        console.error(resp.statusText);
      }
      const schemaJSON = await resp.json();
      const expanded = await jsonld.expand(this.state.schemaURI);
      const flattened = await jsonld.flatten(schemaJSON);
      this.setState({
        schemaJSON,
        expanded,
        flattened,
      });
      let formData = this.mapFormData(this.state.expanded);
      this.setState({formData});
    } catch (error) {
      console.error(error);
    }
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
      this.setState({
        schemaURI: data.schemaURI,
      });
    })
    .catch((error) => {
      // if response is not json but instead html from display(),
      // catch error. this should probably be updated to be more robust
      // this.setState({error: true});
      // console.error(error);
    });
  }

  mapFormData(data) {
    const newKeys = {
      '@context': 'context',
      '@id': 'id',
      '@type': 'type',
      'schema:description': 'description',
      'schema:schemaVersion': 'schemaVersion',
      'schema:version': 'version',
      'skos:altLabel': 'altLabel',
      'skos:prefLabel': 'prefLabel',
    };

    const keyValues = Object.keys(data).map((key) => {
      const newKey = newKeys[key] || key;
      return {[newKey]: data[key]};
    });

    return Object.assign({}, ...keyValues);
  }

  updateFormData(element, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[element] = value;
    this.setState({formData});
  }

  render() {
    const divStyle = {
      border: '1px solid #C3D5DB',
      borderRadius: '4px',
      height: '678px',
      marginTop: '-6px',
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'stretch',
      background: '#FCFCFC',
    };

    const profile = {
      name: this.state.formData['altLabel'] || '',
      description: this.state.formData['prefLabel'] || '',
    };

    return (
      <div style={divStyle}>
        <Toolbar
          profile={profile}
          onUpdate={this.updateFormData}
        >
        </Toolbar>
        <Canvas
        >
        </Canvas>
        <EditDrawer
        >
        </EditDrawer>

      </div>
    );
  }
}

InstrumentBuilderApp.propTypes = {
  schemaURI: PropTypes.string.isRequired,
};

InstrumentBuilderApp.defaultProps = {
  schemaURI: null,
};

export default InstrumentBuilderApp;
