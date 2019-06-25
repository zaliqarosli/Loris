import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Toolbar from './toolbar';
import Canvas from './canvas';
import EditDrawer from './editdrawer';

class InstrumentBuilderTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      schemaID: null,
      error: false,
    };

    this.fetchData = this.fetchData.bind(this);
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
        data: data.data,
        schemaID: data.schemaID,
      });
    })
    .catch((error) => {
      this.setState({error: true});
      console.error(error);
    });
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

    return (
      <div style={divStyle}>
        <Toolbar
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
