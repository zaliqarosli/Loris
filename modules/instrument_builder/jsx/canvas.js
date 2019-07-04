import React, {Component} from 'react';
// import PropTypes from 'prop-types';

import Modal from 'Modal';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      pages: [],
      showModal: false,
    };
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderModal = this.renderModal.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    let target = e.dataTransfer.getData('text');
    let items = Object.assign([], this.state.items);
    items.push(target);
    this.setState({items});
    this.openModal();
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  renderModal() {
    return (
      <Modal
        title='Add Field'
        onClose={this.closeModal}
        show={this.state.showModal}
      >
        <FormElement
          name="addField"
          id="addField"
        >
          <StaticElement
            label="Field Type"
            text="test"
          />
        </FormElement>
      </Modal>
    );
  }

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
        </div>
      );
    });
  }

  render() {
    const dragNDropField = {
      background: 'transparent',
      border: '1px solid #C3D5DB',
      order: 2,
      flex: '3',
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
