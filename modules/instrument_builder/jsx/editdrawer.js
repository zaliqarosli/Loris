import React, {Component} from 'react';
// import PropTypes from 'prop-types';


class EditDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const style = {
      background: 'white',
      border: '1px solid #C3D5DB',
      order: 3,
      flex: '1',
      margin: '-1px -1px 0 0px',
      zIndex: 2,
    };

    return (
      <div style={style}>

      </div>
    );
  }
}

EditDrawer.propTypes = {

};

export default EditDrawer;
