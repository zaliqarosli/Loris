import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.getPlaceholder = this.getPlaceholder.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.renderField = this.renderField.bind(this);
    this.renderMultipart = this.renderMultipart.bind(this);
    this.renderSection = this.renderSection.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderPages = this.renderPages.bind(this);
  }

  getPlaceholder() {
    if (!this.placeholder) {
      let placeholder = document.createElement('div');
      placeholder.className = 'placeholder-field';
      placeholder.id = 'placeholder';
      placeholder.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      this.placeholder = placeholder;
    }
    if (this.dragged === undefined) {
      this.placeholder.addEventListener('drop', this.onDrop);
    } else {
      this.placeholder.removeEventListener('drop', this.onDrop);
    }
    return this.placeholder;
  }

  onDrop(e) {
    this.props.onDropFieldType(e);
  }

  onDragStart(e) {
    this.dragged = e.target;
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  onDragEnd(e) {
    // remove placeholder node and let dragged item reappear
    this.dragged.style.display = 'flex';
    let container = this.placeholder.parentNode;
    container.removeChild(this.getPlaceholder());
    // update data and splice item array
    this.props.reIndexField(this.dragged.id, this.over.id, this.dragged.parentNode.id, container.id);
    this.dragged = undefined;
  }

  onDragOver(e) {
    e.preventDefault();
    let dropLocation = e.target;
    if (this.dragged) {
      this.dragged.style.display = 'none';
    }
    if (dropLocation.id != '') {
      if (dropLocation.id === 'placeholder') {
        return;
      }
      this.over = dropLocation;
      let relY = e.pageY - $(this.over).offset().top;
      let height = this.over.offsetHeight / 2;
      let parent = dropLocation.parentNode;

      if (relY >= height) {
        this.nodePlacement = 'after';
        parent.insertBefore(this.getPlaceholder(), dropLocation.nextElementSibling);
      } else {
        this.nodePlace = 'before';
        parent.insertBefore(this.getPlaceholder(), dropLocation);
      }
    } else {
      return;
    }
  }

  renderField(fieldIndex, inTable = false) {
    const field = this.props.fields[fieldIndex];
    const name = field['altLabel']['en'] || field['altLabel'];
    const question = field['question']['en'] || field['question'];
    const inputType = field['inputType'];
    let mapped = [];
    if (field['responseOptions']) {
      const choices = field['responseOptions']['choices'];
      mapped = choices.map((option, index) => {
        const key = option['value'];
        return {[key]: option['name']['en'] || option['name']};
      });
    }
    let options = {};
    mapped.forEach((option, index) => {
      options[Object.keys(option)] = option[Object.keys(option)];
    });
    const requiredValue = this.props.requiredValues[name];
    let headerLevel = null;
    if (field['ui'].hasOwnProperty('headerLevel')) {
      headerLevel = field['ui']['headerLevel'];
    }
    let input = null;
    switch (inputType) {
      case 'radio':
      case 'select':
        input = !inTable ? (
          <SelectElement
             name={name}
             label={question}
             options={options}
             required={requiredValue}
           />
        ) : (
          <SelectElement
             name={name}
             options={options}
             required={requiredValue}
           />
        );
        break;
      case 'multiselect':
        input = <SelectElement
                  name={name}
                  label={question}
                  multiple={true}
                  options={options}
                  required={requiredValue}
                />;
        break;
      case 'text':
        input = !inTable ? (
          <TextboxElement
            name={name}
            label={question}
            required={requiredValue}
          />
        ) : (
          <TextboxElement
            name={name}
            required={requiredValue}
          />
        );
        break;
      case 'textarea':
        input = <TextareaElement
                  name={name}
                  label={question}
                  required={requiredValue}
                />;
        break;
      case 'date':
        input = <DateElement
                  name={name}
                  label={question}
                  required={requiredValue}
                />;
        break;
      case 'checkbox':
        input = <CheckboxElement
                  name={name}
                  label={question}
                  required={requiredValue}
                />;
        break;
      case 'number':
        input = <NumericElement
                  name={name}
                  label={question}
                  required={requiredValue}
                />;
        break; // TODO: Add rendering for slider inputType
      case 'label':
      case 'static_score':
        input = <StaticElement
                  label={question}
                />;
        break;
      case 'header':
        input = <HeaderElement
                  text={question}
                  headerLevel={headerLevel}
                />;
        break;
    }
    const itemStyle = {
      borderRadius: '2px',
      background: 'transparent',
      margin: '10px 0',
      padding: '10px',
      color: '#333',
      textAlign: 'left',
      alignSelf: 'center',
      order: {fieldIndex} + 1,
      width: '95%',
      minHeight: '20%',
      display: 'flex',
      flexDirection: 'column',
    };
    const deleteBtnStyle = {
      float: 'right',
      background: 'transparent',
      border: 0,
      padding: 0,
    };
    const draggable = !inTable;
    const deleteButton = !inTable ? (
      <span>
        <button
          name="deleteField"
          type="button"
          style={deleteBtnStyle}
          onClick={this.props.deleteItem}
        >
          <span style={{background: '#FCFCFC', float: 'right'}}>
            <i className="fas fa-times-circle"></i>
          </span>
        </button>
      </span>
    ) : null;
    return (
      <div
        className="items"
        key={'fields_'+fieldIndex}
        id={'fields_'+fieldIndex}
        style={itemStyle}
        draggable={draggable}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
        onClick={this.props.selectItem}
      >
        {deleteButton}
        <div style={{marginTop: '10px'}}>
          {input}
        </div>
      </div>
    );
  }

  renderMultipart(multipartIndex) {
    const title = this.props.multiparts[multipartIndex]['preamble']['en'] || this.props.multiparts[multipartIndex]['preamble'];
    const itemTypes = ['fields', 'sections', 'tables'];
    let seenIDs = [];
    let rendered = [];
    (this.props.multiparts[multipartIndex]['ui']['order']).map((item, index) => {
      const id = item['@id'];
      // find itemID and render item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          const searchURI = searchItemSchema['@id'];
          if (id === searchURI && !seenIDs.includes(searchURI)) {
            const inputType = searchItemSchema['ui']['inputType'];
            switch (inputType) {
              case 'section':
                rendered.push(this.renderSection(searchIndex));
                break;
              case 'table':
                rendered.push(this.renderTable(searchIndex));
                break;
              default:
                rendered.push(this.renderField(searchIndex));
            }
            seenIDs.push(id);
          }
        });
      });
    });
    const multipartStyle = {
      background: 'transparent',
      margin: '10px 0',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
    };
    const deleteBtnStyle = {
      float: 'right',
      background: 'transparent',
      border: 0,
      padding: 0,
    };
    return (
      <div
        key={'multiparts_'+multipartIndex}
        id={'multiparts_'+multipartIndex}
        className="items"
        onDragOver={this.onDragOver}
        style={multipartStyle}
      >
        <span>
          <button
            name="deleteMultipart"
            type="button"
            style={deleteBtnStyle}
            onClick={this.props.deleteItem}
          >
            <span style={{background: '#FCFCFC', float: 'right'}}>
              <i className="fas fa-times-circle"></i>
            </span>
          </button>
        </span>
        <h2 style={{margin: '15px'}}>{title}</h2>
        {rendered}
      </div>
    );
  }

  renderSection(sectionIndex) {
    const title = this.props.sections[sectionIndex]['preamble']['en'] || this.props.sections[sectionIndex]['preamble'];
    const itemTypes = ['fields', 'tables'];
    let seenIDs = [];
    let rendered = [];
    (this.props.sections[sectionIndex]['ui']['order']).map((item, index) => {
      const id = item['@id'];
      // find itemID and render item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          const searchURI = searchItemSchema['@id'];
          if (id === searchURI && !seenIDs.includes(searchURI)) {
            const inputType = searchItemSchema['ui']['inputType'];
            switch (inputType) {
              case 'table':
                rendered.push(this.renderTable(searchIndex));
                break;
              default:
                rendered.push(this.renderField(searchIndex));
            }
            seenIDs.push(id);
          }
        });
      });
    });
    const sectionStyle = {
      background: 'transparent',
      margin: '10px 0',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
    };
    const deleteBtnStyle = {
      float: 'right',
      background: 'transparent',
      border: 0,
      padding: 0,
    };
    return (
      <div
        key={'sections_'+sectionIndex}
        id={'sections_'+sectionIndex}
        className="items"
        style={sectionStyle}
        onDragOver={this.onDragOver}
        onClick={this.props.selectItem}
      >
        <span>
          <button
            name="deleteSection"
            type="button"
            style={deleteBtnStyle}
            onClick={this.props.deleteItem}
          >
            <span style={{background: '#FCFCFC', float: 'right'}}>
              <i className="fas fa-times-circle"></i>
            </span>
          </button>
        </span>
        <h2 style={{margin: '15px'}}>{title}</h2>
        {rendered}
      </div>
    );
  }

  renderTable(tableIndex) {
    const thisTable = this.props.tables[tableIndex];
    const title = thisTable['preamble']['en'] || thisTable['preamble'];
    const headers = (
      <tr key={'headers_'+tableIndex}>
        {thisTable['tableheaders'].map((header) => {
          const headerString = header['@value'];
          return (
            <th style={{borderTop: 'none'}} key={headerString}>
              {headerString}
            </th>
          );
        })}
      </tr>
    );
    const rows = thisTable['tablerows'].map((row, rowIndex) => {
      return (
        <tr key={'tablerow_'+rowIndex+'_'+tableIndex}>
          {row['ui']['order'].map((field, fieldIndex) => {
              const id = field['@id'];
              let seenIDs = [];
              let renderedField = null;
              this.props.fields.forEach((searchItemSchema, searchIndex) => {
                const searchURI = searchItemSchema['@id'];
                if (id === searchURI && !seenIDs.includes(searchURI)) {
                  renderedField = this.renderField(searchIndex, true);
                  seenIDs.push(id);
                }
              });
              return (
                <td style={{borderTop: 'none'}} key={fieldIndex+'_tablerow_'+rowIndex}>
                  {renderedField}
                </td>
              );
          })}
        </tr>
      );
    });
    const table = (
      <table className='table table-instrument'>
        <tbody>
          {headers}
          {rows}
        </tbody>
      </table>
    );
    const tableStyle = {
      borderRadius: '2px',
      background: 'transparent',
      margin: '10px 0',
      padding: '10px',
      alignSelf: 'center',
      width: '95%',
      minHeight: '20%',
      display: 'flex',
      flexDirection: 'column',
    };
    const deleteBtnStyle = {
      float: 'right',
      background: 'transparent',
      border: 0,
      padding: 0,
    };
    return (
      <div
        key={'tables_'+tableIndex}
        id={'tables_'+tableIndex}
        className="items"
        style={tableStyle}
        onDragOver={this.onDragOver}
        onClick={this.props.selectItem}
      >
        <span>
          <button
            name="deleteTable"
            type="button"
            style={deleteBtnStyle}
            onClick={this.props.deleteItem}
          >
            <span style={{background: '#FCFCFC', float: 'right'}}>
              <i className="fas fa-times-circle"></i>
            </span>
          </button>
        </span>
        <label>{title}</label>
        {table}
      </div>
    );
  }

  renderItems(pageIndex) {
    // what we essentially want is an array of items on this page
    // then map for each item in the array, call this.render[ItemType].
    const itemTypes = ['fields', 'multiparts', 'sections', 'tables'];
    let seenIDs = [];
    let rendered = [];
    (this.props.pages[pageIndex]['ui']['order']).map((item, index) => {
      const id = item['@id'];
      // find itemID and return item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          if (searchItemSchema.hasOwnProperty('@id')) {
            const searchURI = searchItemSchema['@id'];
            if (id == searchURI && !seenIDs.includes(searchURI)) {
              const inputType = searchItemSchema['ui']['inputType'];
              switch (inputType) {
                case 'multipart':
                  rendered.push(this.renderMultipart(searchIndex));
                  break;
                case 'section':
                  rendered.push(this.renderSection(searchIndex));
                  break;
                case 'table':
                  rendered.push(this.renderTable(searchIndex));
                  break;
                default:
                  rendered.push(this.renderField(searchIndex));
              }
              seenIDs.push(id);
            }
          }
        });
      });
    });
    return rendered;
  }

  renderPages() {
    const pageStyle = {
      background: 'white',
      boxShadow: '0 -1px 4px 2px rgba(0,0,0,0.175)',
      margin: '20px auto 0',
      padding: '20px',
      width: '612px',
      minHeight: '792px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
    };
    return this.props.pages.map((page, index) => {
      const deleteBtnStyle = {
        float: 'right',
        background: 'transparent',
        border: 0,
        padding: 0,
      };
      return (
        <div
          className="pages"
          key={'pages_'+index}
          id={'pages_'+index}
          style={pageStyle}
          onClick={this.props.selectItem}
        >
          <span>
            <button
              name="deletePage"
              type="button"
              style={deleteBtnStyle}
              onClick={this.props.deletePage}
            >
              <span style={{background: '#FCFCFC', float: 'right'}}>
                <i className="fas fa-times-circle"></i>
              </span>
            </button>
          </span>
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
      flex: '15',
      overflow: 'auto',
      overflowX: 'scroll',
      margin: '-1px 0 0 -1px',
      paddingBottom: '20px',
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
  requiredValues: PropTypes.object,
  onDropFieldType: PropTypes.func.isRequired,
  reIndexField: PropTypes.func.isRequired,
  deletePage: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  selectField: PropTypes.func.isRequired,
};

export default Canvas;
