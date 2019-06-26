import React, {Component} from 'react';
// import PropTypes from 'prop-types';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      pages: [],
    };
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    let target = e.dataTransfer.getData('text');
    let items = Object.assign([], this.state.items);
    items.push(target);
    this.setState({items});
  }

  renderItems() {
    return this.state.items.map((item, key) => {
      const itemStyle = {
        border: '1px dashed #246EB6',
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
      display: 'flex',
      flexDirection: 'column',
    };
    return (
      <div style={dragNDropField}>
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
