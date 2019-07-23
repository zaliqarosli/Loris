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
      schemaData: {},
      formData: {
        schema: {},
        fields: [],
        multiparts: [],
        pages: [],
        sections: [],
        tables: [],
      },
      error: false,
    };
    this.updateFormData = this.updateFormData.bind(this);
    this.mapKeysToAlias = this.mapKeysToAlias.bind(this);
  }

  async componentDidMount() {
    if (this.state.schemaURI !== '') {
      let formData = {};
      let schemaData = {};
      try {
        formData = await expandFull(this.state.schemaURI);
        // Have to do this twice because deep cloning doesn't seem to be working currently
        schemaData = await expandFull(this.state.schemaURI);
      } catch (error) {
        console.error(error);
      }
      // Map formData keys to aliases
      const items = ['fields', 'multiparts', 'pages', 'sections', 'tables'];
      items.forEach((item) => {
        formData[item] = [...formData[item].map((schema, index) => {
          return this.mapKeysToAlias(schema);
        })];
      });
      formData.schema = this.mapKeysToAlias(formData.schema);
      this.setState({formData, schemaData});
    }
  }

  mapKeysToAlias(data) {
    const keyValues = Object.keys(data).map((key) => {
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
          fields={this.state.formData.fields}
          multiparts={this.state.formData.multiparts}
          pages={this.state.formData.pages}
          sections={this.state.formData.sections}
          tables={this.state.formData.tables}
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
