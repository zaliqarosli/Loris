import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from './toolbar';
import Canvas from './canvas';
import EditDrawer from './editdrawer';

import expandFull from './../../../htdocs/js/jsonldexpander';

class InstrumentBuilderApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schemaURI: this.props.schemaURI,
      schemaExpanded: {},
      fields: [],
      multiparts: [],
      pages: [],
      sections: [],
      tables: [],
      formData: {},
      error: false,
    };
    this.updateFormData = this.updateFormData.bind(this);
    this.mapJSON = this.mapJSON.bind(this);
  }

  async componentDidMount() {
    if (this.state.schemaURI !== '') {
      let schemaObject = {};
      try {
        schemaObject = await expandFull(this.state.schemaURI);
      } catch (error) {
        console.error(error);
      }
      this.setState({
        schemaExpanded: schemaObject.schema,
        fields: schemaObject.fields,
        multiparts: schemaObject.multiparts,
        pages: schemaObject.pages,
        sections: schemaObject.sections,
        tables: schemaObject.tables,
      });
    }
  }

  mapJSON(data) {
    const keyValues = Object.keys(data[0]).map((key) => {
      let newKey = '';
      if (key.charAt(0) === '@') {
        newKey = key.substring(1);
      } else {
        let lastPiece = key.substring(key.lastIndexOf('/') + 1);
        if (lastPiece.lastIndexOf('#') > -1) {
          lastPiece = key.substring(key.lastIndexOf('#') + 1);
        }
        newKey = lastPiece;
      }
      return {[newKey]: data[0][key]};
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
    let profile = {};
    if (this.state.formData['altLabel'] && this.state.formData['prefLabel']) {
      profile = {
        name: this.state.formData['altLabel'][0]['@value'],
        fullName: this.state.formData['prefLabel'][0]['@value'],
      };
    }
    return (
      <div style={divStyle}>
        <Toolbar
          profile={profile}
          onUpdate={this.updateFormData}
        >
        </Toolbar>
        <Canvas
          // order={order}
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
