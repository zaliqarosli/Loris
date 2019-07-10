import React, {Component} from 'react';
// import PropTypes from 'prop-types';

class EditDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
    this.closeDrawer = this.closeDrawer.bind(this);
    this.renderDrawerContent = this.renderDrawerContent.bind(this);
  }

  closeDrawer(e) {
    let open = !this.state.open;
    this.setState({open});
  }

  renderDrawerContent() {
    let contentDiv = {
      order: 2,
      flex: 10,
    };
    if (!this.state.open) {
      contentDiv = {
        order: 2,
        flex: 1,
      };
    }

    return (
      <div style={contentDiv}>

      </div>
    );
  }

  render() {
    let icon = 'fas fa-chevron-right';
    let outerDiv = {
      background: 'white',
      border: '1px solid #C3D5DB',
      order: 3,
      flex: 7,
      margin: '-1px -1px 0 -1px',
      display: 'flex',
      justifyContent: 'space-between',
    };
    if (!this.state.open) {
      icon = 'fas fa-chevron-left';
      outerDiv = {
        background: 'white',
        border: '1px solid #C3D5DB',
        order: 3,
        flex: 1,
        margin: '-1px -1px 0 -1px',
        display: 'flex',
        justifyContent: 'space-between',
      };
    }

    return (
      <div style={outerDiv}>
        <div
          style={{order: 1, flex: 1, display: 'flex', justifyContent: 'center'}}
          onClick={this.closeDrawer}
        >
          <span style={{alignSelf: 'center'}}><i className={icon}></i></span>
        </div>
        {this.renderDrawerContent()}
      </div>
    );
  }
}

EditDrawer.propTypes = {
};

export default EditDrawer;
