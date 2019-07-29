import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AddListItemForm from './addListItemForm';

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
    let hidden = !this.state.open;
    let contentDiv = {
      order: 2,
      flex: 10,
      padding: '10px',
      overflow: 'scroll',
    };
    if (!this.state.open) {
      contentDiv = {
        order: 2,
        flex: 1,
      };
    }
    let editForm = null;
    let inputType = null;
    if (Object.keys(this.props.selectedField).length != 0) {
      inputType = this.props.selectedField.inputType[0]['@value'];
    }
    switch (inputType) {
      case 'select':
      case 'multiselect':
        editForm = <AddListItemForm uiType='select' formData={this.props.selectedField} onSave={this.submitEdit}/>;
        break;
      case 'radio':
        editForm = <AddListItemForm uiType='radio' formData={this.props.selectedField} onSave={this.submitEdit}/>;
        break;
    }
    return (
      <div style={contentDiv} hidden={hidden}>
        <FieldsetElement
          name='editFieldForm'
          legend='Edit Field'
        >
        {editForm}
        </FieldsetElement>
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
  selectedField: PropTypes.object,
};

export default EditDrawer;
