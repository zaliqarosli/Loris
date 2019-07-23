import React, {Component} from 'react';
import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import Modal from 'Modal';
import AddListItemForm from './addListItemForm';
import AddPageForm from './addPageForm';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    this.onDragOver = this.onDragOver.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderPages = this.renderPages.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  renderItems(pageIndex) {
    return this.props.fields.map((item, key) => {
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
    return this.props.pages.map((item, key) => {
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
          onDrop={this.props.onDrop}
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
        {this.renderPages()}
      </div>
    );
  }
}

Canvas.propTypes = {
  fields: PropTypes.array,
  multiparts: PropTypes.array,
  pages: PropTypes.array,
  sections: PropTypes.array,
  tables: PropTypes.array,
  onDrop: PropTypes.func.isRequired,
};

export default Canvas;
