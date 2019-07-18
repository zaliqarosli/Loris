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
      pages: [
        {
          pageID: '',
          pageNumber: 1,
          description: '',
          order: [
            '',
          ],
        },
      ],
      showModal: false,
      selectedFieldType: null,
      selectedPage: null,
    };
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deletePage = this.deletePage.bind(this);
    this.savePage = this.savePage.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderPages = this.renderPages.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    const selectedPage = e.target.id;
    const selectedFieldType = e.dataTransfer.getData('text');
    this.setState({
      selectedFieldType,
      selectedPage,
    });
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
        addForm = <AddPageForm onSave={this.savePage}/>;
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
        title='Add Field'
        onClose={this.closeModal}
        show={this.state.showModal}
      >
        {addForm}
      </Modal>
    );
  }

  saveItem(formData) {
    let items = Object.assign([], this.state.items);
    formData.onPage = this.state.selectedPage;
    items.push(formData);
    this.setState({items});
    swal.fire('Success!', 'Item added.', 'success').then((result) => {
      if (result.value) {
        this.closeModal();
      }
    });
  }

  savePage(formData) {
    let pages = Object.assign([], this.state.pages);
    pages.push(formData);
    this.setState({pages});
    swal.fire('Success!', 'Page added.', 'success').then((result) => {
      if (result.value) {
        this.closeModal();
      }
    });
  }

  deleteItem(e) {
    const itemKey = e.currentTarget.parentNode.id;
    let items = Object.assign([], this.state.items);
    swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all item information.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete item!',
    }).then((result) => {
      if (result.value) {
        delete items[itemKey];
        this.setState({items});
        swal.fire('Deleted!', 'Item has been deleted.', 'success');
      }
    });
  }

  deletePage(e) {
    const pageKey = e.currentTarget.parentNode.id;
    let pages = Object.assign([], this.state.pages);
    swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all page information.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete page!',
    }).then((result) => {
      if (result.value) {
        delete pages[pageKey];
        this.setState({pages});
        swal.fire('Deleted!', 'Page has been deleted.', 'success');
      }
    });
  }

  renderItems(pageIndex) {
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
      const deleteBtnStyle = {
        float: 'right',
        background: 'transparent',
        border: 0,
      };
      if (item.onPage == pageIndex) {
        return (
          <div
            className="items"
            key={key}
            id={key}
            style={itemStyle}
          >
            <button
              name="deleteItem"
              type="button"
              style={deleteBtnStyle}
              onClick={this.deleteItem}
            >
              <span style={{background: '#FCFCFC', float: 'right'}}>
                <i className="fas fa-times-circle"></i>
              </span>
            </button>
          </div>
        );
      }
    });
  }

  renderPages() {
    return this.state.pages.map((item, key) => {
      const pageStyle = {
        background: 'white',
        boxShadow: '0px -1px 4px 2px rgba(0,0,0,0.175)',
        margin: '20px 30px 0 30px',
        flex: '1',
        minHeight: '792px',
        width: '612px',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
      };
      const deleteBtnStyle = {
        float: 'right',
        background: 'transparent',
        border: 0,
        marginTop: '5px',
      };
      return (
        <div
          className="pages"
          key={key}
          id={key}
          style={pageStyle}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        >
          <button
            name="deleteItem"
            type="button"
            style={deleteBtnStyle}
            onClick={this.deletePage}
          >
            <span style={{background: '#FCFCFC', float: 'right'}}>
              <i className="fas fa-times-circle"></i>
            </span>
          </button>
          {this.renderItems(key)}
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
    return (
      <div style={dragNDropField}>
        {this.renderModal()}
        {this.renderPages()}
      </div>
    );
  }
}

Canvas.propTypes = {
};

export default Canvas;
