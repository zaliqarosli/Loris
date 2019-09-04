import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.getPlaceholder = this.getPlaceholder.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
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
      placeholder.addEventListener('drop', (e) => {
        this.props.onDropFieldType(e);
      });
      this.placeholder = placeholder;
    }
    return this.placeholder;
  }

  onDragOver(e) {
    e.preventDefault();
    let dropLocation = e.target;
    if (dropLocation.id != '') {
      if (dropLocation.className === 'placeholder') {
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

  renderField(fieldIndex, includeLabel = true) {
    const field = this.props.fields[fieldIndex];
    const name = field['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'];
    const question = includeLabel ? field['http://schema.org/question'][0]['@value'] : '';
    const inputType = field['https://schema.repronim.org/inputType'][0]['@value'];
    let mapped = [];
    if (field['https://schema.repronim.org/valueconstraints']) {
      if ((field['https://schema.repronim.org/valueconstraints'][0]).hasOwnProperty('http://schema.org/itemListElement')) {
        const valueconstraints = field['https://schema.repronim.org/valueconstraints'][0]['http://schema.org/itemListElement'][0]['@list'];
        mapped = valueconstraints.map((option, index) => {
          const key = option['http://schema.org/value'][0]['@value'];
          return {[key]: option['http://schema.org/name'][0]['@value']};
        });
      }
    }
    let options = {};
    mapped.forEach((option, index) => {
      options[Object.keys(option)] = option[Object.keys(option)];
    });
    const requiredValue = this.props.requiredValues[name];
    let headerLevel = null;
    if (field.hasOwnProperty('https://schema.repronim.org/headerLevel')) {
      headerLevel = field['https://schema.repronim.org/headerLevel'][0]['@value'];
    }
    let input = null;
    switch (inputType) {
      case 'radio':
      case 'select':
        input = <SelectElement
                  name={name}
                  label={question}
                  options={options}
                  required={requiredValue}
                />;
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
        input = <TextboxElement
                  name={name}
                  label={question}
                  required={requiredValue}
                />;
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
      case 'static':
        input = <StaticElement
                  label={question}
                />;
        break;
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
    return (
      <div
        className="items"
        key={fieldIndex}
        id={'field_'+fieldIndex}
        style={itemStyle}
        draggable={true}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
        onClick={this.props.selectField}
      >
        <span>
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
        </span>
        <div style={{marginTop: '10px'}}>
          {input}
        </div>
      </div>
    );
  }

  onDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  onDragEnd(e) {
  // remove placeholder node
  // update data
  // do the whole splice thing
  }

  renderMultipart(multipartIndex) {
    let title = this.props.multiparts[multipartIndex]['http://schema.repronim.org/preamble'][0]['@value'];
    let itemTypes = ['fields', 'sections', 'tables'];
    let seenIDs = [];
    let rendered = [];
    (this.props.multiparts[multipartIndex]['https://schema.repronim.org/order'][0]['@list']).map((item, index) => {
      let id = item['@id'];
      // find itemID and render item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          let searchURI = searchItemSchema['@id'];
          if (id === searchURI && !seenIDs.includes(searchURI)) {
            let inputType = searchItemSchema['https://schema.repronim.org/inputType'][0]['@value'];
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
        key={multipartIndex}
        id={'multipart_'+multipartIndex}
        className="items"
        onDragOver={this.onDragOver}
        style={multipartStyle}
      >
        <span>
          <button
            name="deleteMultipart"
            type="button"
            style={deleteBtnStyle}
            onClick={this.props.deleteMultipart}
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
    let title = this.props.sections[sectionIndex]['http://schema.repronim.org/preamble'][0]['@value'];
    let itemTypes = ['fields', 'tables'];
    let seenIDs = [];
    let rendered = [];
    (this.props.sections[sectionIndex]['https://schema.repronim.org/order'][0]['@list']).map((item, index) => {
      let id = item['@id'];
      // find itemID and render item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          let searchURI = searchItemSchema['@id'];
          if (id === searchURI && !seenIDs.includes(searchURI)) {
            let inputType = searchItemSchema['https://schema.repronim.org/inputType'][0]['@value'];
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
        key={sectionIndex}
        id={'section_'+sectionIndex}
        className="items"
        style={sectionStyle}
        onDragOver={this.onDragOver}
      >
        <span>
          <button
            name="deleteSection"
            type="button"
            style={deleteBtnStyle}
            onClick={this.props.deleteSection}
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
    const title = thisTable['http://schema.repronim.org/preamble'][0]['@value'];
    const headers = (
      <tr key={'headers_'+tableIndex}>
        {thisTable['https://schema.repronim.org/tableheaders'][0]['@list'].map((header) => {
          const headerString = header['@value'];
          return (
            <th style={{borderTop: 'none'}} key={headerString}>
              {headerString}
            </th>
          );
        })}
      </tr>
    );
    const rows = thisTable['https://schema.repronim.org/tablerows'][0]['@list'].map((row, rowIndex) => {
      return (
        <tr key={'tablerow_'+rowIndex+'_'+tableIndex}>
          {row['https://schema.repronim.org/order'][0]['@list'].map((field, fieldIndex) => {
              const id = field['@id'];
              let seenIDs = [];
              let renderedField = null;
              this.props.fields.forEach((searchItemSchema, searchIndex) => {
                let searchURI = searchItemSchema['@id'];
                if (id === searchURI && !seenIDs.includes(searchURI)) {
                  renderedField = this.renderField(searchIndex, false);
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
        key={tableIndex}
        id={'table_'+tableIndex}
        className="items"
        style={tableStyle}
        onDragOver={this.onDragOver}
      >
        <span>
          <button
            name="deleteTable"
            type="button"
            style={deleteBtnStyle}
            onClick={this.props.deleteTable}
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
    let items = [];
    // ItemsID array of items on this page
    (this.props.pages[pageIndex]['https://schema.repronim.org/order'][0]['@list']).map((item, index) => {
      const id = item['@id'];
      // find itemID and return item
      itemTypes.forEach((type) => {
        this.props[type].forEach((searchItemSchema, searchIndex) => {
          if (searchItemSchema.hasOwnProperty('@id')) {
            const searchURI = searchItemSchema['@id'];
            if (id == searchURI) {
              items[searchIndex] = searchItemSchema;
            }
          }
        });
      });
    });
    return items.map((itemSchema, itemIndex) => {
      let inputType = itemSchema['https://schema.repronim.org/inputType'][0]['@value'];
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
          key={index}
          id={'page_'+index}
          style={pageStyle}
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
  // reIndexField: PropTypes.func.isRequired,
  deletePage: PropTypes.func.isRequired,
  deleteMultipart: PropTypes.func.isRequired,
  deleteSection: PropTypes.func.isRequired,
  deleteField: PropTypes.func.isRequired,
  selectField: PropTypes.func.isRequired,
};

export default Canvas;
