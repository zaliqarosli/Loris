import React, {Component} from 'react';
// import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import Modal from 'Modal';
import AddListItemForm from './addListItemForm';
import AddPageForm from './addPageForm';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      pages: [],
      showModal: false,
      selectedFieldType: null,
    };
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.saveItem = this.saveItem.bind(this);
    // this.deleteItem = this.deleteItem.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    let target = e.dataTransfer.getData('text');
    this.setState({selectedFieldType: target});
    this.openModal();
    e.dataTransfer.clearData();
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  renderModal() {
    let addForm = null;
    switch (this.state.selectedFieldType) {
      case 'pageBreak':
        addForm = <AddPageForm onSave={this.saveItem}/>;
        break;
      case 'section':

        break;
      case 'select':
        addForm = <AddListItemForm uiType='select' onSave={this.saveItem}/>;
        break;
      case 'radio':
        addForm = <AddListItemForm uiType='radio' onSave={this.saveItem}/>;
        break;
    }
    return (
      <Modal
        title='Add Item'
        onClose={this.closeModal}
        show={this.state.showModal}
      >
        {addForm}
      </Modal>
    );
  }

  saveItem(formData) {
    let items = Object.assign([], this.state.items);
    items.push(formData);
    this.setState({items});
    swal.fire('Success!', 'Item added.', 'success').then((result) => {
      if (result.value) {
        this.closeModal();
      }
    });
  }

  // deleteItem(itemKey) {
  //   let items = Object.assign([], this.state.items);
  //   delete items[itemKey];
  //   this.setState({items});
  // }

  renderItems() {
    return this.state.items.map((item, key) => {
      const itemStyle = {
        borderRadius: '2px',
        background: 'transparent',
        padding: '10px',
        margin: '15px',
        color: '#333',
        textAlign: 'center',
        alignSelf: 'center',
        order: {key} + 1,
        minWidth: '90%',
        minHeight: '20%',
      };
      return (
        <div
          className="items"
          key={key}
          style={itemStyle}
        >
        <span style={{background: '#FCFCFC', float: 'right'}}>
          <i className="fas fa-times-circle"></i>
        </span>
        </div>
      );
    });
  }

  render() {
    const dragNDropField = {
      background: 'transparent',
      border: '1px solid #C3D5DB',
      order: 2,
      flex: '18',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      margin: '-1px 0px 0 -1px',
    };
    const paper = {
      background: 'white',
      boxShadow: '0px -1px 4px 2px rgba(0,0,0,0.175)',
      margin: '20px 30px 0 30px',
      flex: '1',
      height: '792px',
      width: '612px',
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
    };
    return (
      <div style={dragNDropField}>
        {this.renderModal()}
        <div
          style={paper}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        >
          {this.renderItems()}
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
};

export default Canvas;
