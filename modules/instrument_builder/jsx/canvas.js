import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.onDragOver = this.onDragOver.bind(this);
    this.renderField = this.renderField.bind(this);
    this.renderMultipart = this.renderMultipart.bind(this);
    this.renderSection = this.renderSection.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderPages = this.renderPages.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  renderField(fieldIndex) {
    const name = this.props.fields[fieldIndex].altLabel[0]['@value'];
    const question = this.props.fields[fieldIndex].question[0]['@value'];
    const inputType = this.props.fields[fieldIndex].inputType[0]['@value'];
    const itemStyle = {
      borderRadius: '2px',
      background: 'transparent',
      padding: '10px',
      margin: '15px',
      color: '#333',
      textAlign: 'left',
      alignSelf: 'center',
      order: {fieldIndex} + 1,
      minWidth: '90%',
      minHeight: '20%',
      display: 'flex',
      flexDirection: 'column',
    };
    const deleteBtnStyle = {
      float: 'right',
      background: 'transparent',
      border: 0,
      paddingRight: 0,
    };
    let input = null;
    switch (inputType) {
      case 'radio':
      case 'select':
        input = <SelectElement
                  name={name}
                  label={question}
                />;
        break;
      case 'multiselect':
        input = <SelectElement
                  name={name}
                  label={question}
                  multiple={true}
                />;
        break;
      case 'text':
        input = <TextboxElement
                  name={name}
                  label={question}
                />;
        break;
      case 'textarea':
        input = <TextareaElement
                  name={name}
                  label={question}
                />;
        break;
      case 'date':
        input = <DateElement
                  name={name}
                  label={question}
                />;
        break;
      case 'checkbox':
        input = <CheckboxElement
                  name={name}
                  label={question}
                />;
        break;
      case 'static':
        input = <StaticElement
                  label={question}
                />;
        break;
    }
    return (
      <div
        className="fields"
        key={fieldIndex}
        id={fieldIndex}
        style={itemStyle}
      >
        <button
          name="deleteField"
          type="button"
          style={deleteBtnStyle}
          onClick={this.props.deleteField}
        >
          <span style={{background: '#FCFCFC', float: 'right'}}>
            <i className="fas fa-times-circle"></i>
          </span>
        </button>
        <div style={{marginTop: '10px'}}>
          {input}
        </div>
      </div>
    );
  }

  renderMultipart(multipartIndex) {
    // what we essentially want is an array of items in this multipart
    // then map for each item in the array, call this.render[ItemType].
    let itemTypes = ['fields', 'sections', 'tables'];
    let items = [];
    // ItemsID array of items in this section
    (this.props.multiparts[multipartIndex].order[0]['@list']).map((item, index) => {
      let id = item['@id'];
      // find itemID and return item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          // Bug with jsonld.js dependency that knocks off '.jsonld' from the ends of expanded @id URI
          // Need to add .jsonld back in to searchItemSchema.id
          let correctedURI = searchItemSchema.id.concat('.jsonld');
          if (id === correctedURI) {
            items[searchIndex] = searchItemSchema;
          }
        });
      });
    });
    let rendered = items.map((itemSchema, itemIndex) => {
      let inputType = itemSchema.inputType[0]['@value'];
      switch (inputType) {
        case 'section':
          return this.renderSection(itemIndex);
          break;
        case 'table':
          return this.renderTable(itemIndex);
          break;
        default:
          return this.renderField(itemIndex);
      }
    });
    return (
      <div key={'multipart'+multipartIndex}>
        <h3>Multipart</h3>
        {rendered}
      </div>
    );
  }

  renderSection(sectionIndex) {
    let title = this.props.sections[sectionIndex].preamble[0]['@value'];
    // what we essentially want is an array of items in this section
    // then map for each item in the array, call this.render[ItemType].
    let itemTypes = ['fields', 'tables'];
    let items = [];
    // ItemsID array of items in this section
    (this.props.sections[sectionIndex].order[0]['@list']).map((item, index) => {
      let id = item['@id'];
      // find itemID and return item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          // Bug with jsonld.js dependency that knocks off '.jsonld' from the ends of expanded @id URI
          // Need to add .jsonld back in to searchItemSchema.id
          let correctedURI = searchItemSchema.id.concat('.jsonld');
          if (id === correctedURI) {
            items[searchIndex] = searchItemSchema;
          }
        });
      });
    });
    let rendered = items.map((itemSchema, itemIndex) => {
      let inputType = itemSchema.inputType[0]['@value'];
      switch (inputType) {
        case 'table':
          return this.renderTable(itemIndex);
          break;
        default:
          return this.renderField(itemIndex);
      }
    });
    return (
      <div key={'section'+sectionIndex}>
        <h2 style={{margin: '15px'}}>{title}</h2>
        {rendered}
      </div>
    );
  }

  renderTable(tableIndex) {

  }

  renderItems(pageIndex) {
    // what we essentially want is an array of items on this page
    // then map for each item in the array, call this.render[ItemType].

    let itemTypes = ['fields', 'multiparts', 'sections', 'tables'];
    let items = [];
    // ItemsID array of items on this page
    (this.props.pages[pageIndex].order[0]['@list']).map((item, index) => {
      let id = item['@id'];
      // find itemID and return item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          // Bug with jsonld.js dependency that knocks off '.jsonld' from the ends of expanded @id URI
          // Need to add .jsonld back in to searchItemSchema.id
          let correctedURI = searchItemSchema.id.concat('.jsonld');
          if (id == correctedURI) {
            items[searchIndex] = searchItemSchema;
          }
        });
      });
    });
    return items.map((itemSchema, itemIndex) => {
      let inputType = itemSchema.inputType[0]['@value'];
      switch (inputType) {
        case 'multipart':
          return this.renderMultipart(itemIndex);
          break;
        case 'section':
          return this.renderSection(itemIndex);
          break;
        case 'table':
          return this.renderTable(itemIndex);
          break;
        default:
          return this.renderField(itemIndex);
      }
    });
  }

  renderPages() {
    return this.props.pages.map((page, index) => {
      const pageStyle = {
        background: 'white',
        boxShadow: '0px -1px 4px 2px rgba(0,0,0,0.175)',
        margin: '20px 30px 0 30px',
        padding: '20px',
        flex: '1',
        minHeight: '792px',
        width: '612px',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
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
          key={index}
          id={index}
          style={pageStyle}
          onDragOver={this.onDragOver}
          onDrop={this.props.onDrop}
        >
          <button
            name="deleteItem"
            type="button"
            style={deleteBtnStyle}
            onClick={this.props.deletePage}
          >
            <span style={{background: '#FCFCFC', float: 'right'}}>
              <i className="fas fa-times-circle"></i>
            </span>
          </button>
          {this.renderItems(index)}
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
  deletePage: PropTypes.func.isRequired,
  deleteField: PropTypes.func.isRequired,
};

export default Canvas;
