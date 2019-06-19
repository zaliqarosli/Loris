import React, {Component} from 'react';
// import PropTypes from 'prop-types';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const dragNDropField = {
      background: 'transparent',
      border: '1px solid #C3D5DB',
      zIndex: 2,
      order: 2,
      flex: '3',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      margin: '-1px -1px 0 -1px',
    };
    const paper = {
      background: 'white',
      boxShadow: '0px -1px 4px 2px rgba(0,0,0,0.175)',
      margin: '20px 30px 0 30px',
      flex: '1',
      height: '792px',
      width: '612px',
      zIndex: 2,
      alignSelf: 'center',
    };
    return (
      <div style={dragNDropField}>
        <div style={paper}>

        </div>
      </div>
    );
  }
}

Canvas.propTypes = {

};

export default Canvas;
