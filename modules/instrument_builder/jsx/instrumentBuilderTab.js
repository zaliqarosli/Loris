import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from './toolbar';
import Canvas from './canvas';
import EditDrawer from './editdrawer';

class InstrumentBuilderTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schemaJson: {},
      schemaID: null,
      error: false,
      formData: {},
    };

    this.fetchData = this.fetchData.bind(this);
    this.updateFormData = this.updateFormData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
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
        schemaJson: data.schemaJSON,
        schemaID: data.schemaID,
        formData: data.schemaJSON,
      });
    })
    .catch((error) => {
      // if response is not json but instead html from display(),
      // catch error. this should probably be updated to be more robust
      // this.setState({error: true});
      // console.error(error);
    });
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
      name: this.state.formData['@id'] || '',
      description: this.state.formData['schema:description'] || '',
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

InstrumentBuilderTab.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};

InstrumentBuilderTab.defaultProps = {
  fetchURL: null,
};

export default InstrumentBuilderTab;
