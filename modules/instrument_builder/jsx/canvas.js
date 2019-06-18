import React, {Component} from 'react';
// import PropTypes from 'prop-types';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const outerDiv = {
      background: 'white',
      border: '1px solid #C3D5DB',
      order: 2,
      flex: '3',
      display: 'flex',
      margin: '-1px 0 0 -2px',
    };
    const dragNDropField = {
      background: '#FCFCFC',
      border: '1px solid #C3D5DB',
      borderRadius: '6px',
      margin: '20px',
      zIndex: 2,
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
    };
    const paper = {
      background: 'white',
      boxShadow: '0px -1px 4px 2px rgba(0,0,0,0.175)',
      margin: '20px 30px 0 30px',
      flex: '1',
    };
    return (
      <div style={outerDiv}>
        <div style={dragNDropField}>
          <div style={paper}>

          </div>
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {

};

export default Canvas;
