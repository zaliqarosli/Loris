import React, {Component} from 'react';
import PropTypes from 'prop-types';

import JsonLDExpander from './../../../htdocs/js/JsonLDExpander';
import swal from 'sweetalert2';
import Modal from 'Modal';

import Toolbar from './toolbar';
import Canvas from './canvas';
import EditDrawer from './editdrawer';
import AddListItemForm from './addListItemForm';
import AddTextItemForm from './addTextItemForm';
import AddLabelItemForm from './addLabelItemForm';
import AddScoreItemForm from './addScoreItemForm';
import AddHeaderItemForm from './addHeaderItemForm';
import AddNumericItemForm from './addNumericItemForm';
import AddPageForm from './addPageForm';
import AddSectionForm from './addSectionForm';
import AddMultipartForm from './addMultipartForm';
import AddTableForm from './addTableForm';

class InstrumentBuilderApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      formData: {
        schema: {
          '@id': '',
          '@type': ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Activity'],
          'http://schema.ord/description': [{
            '@language': 'en',
            '@value': '',
          }],
          'http://schema.org/schemaVersion': [{
            '@language': 'en',
            '@value': '0.0.1',
          }],
          'http://schema.org/version': [{
            '@language': 'en',
            '@value': '0.0.1',
          }],
          'http://schema.repronim.org/preamble': [{
            '@language': 'en',
            '@value': '',
          }],
          'http://www.w3.org/2004/02/skos/core#altLabel': [{
            '@language': 'en',
            '@value': '',
          }],
          'http://www.w3.org/2004/02/skos/core#prefLabel': [{
            '@language': 'en',
            '@value': '',
          }],
          'https://schema.repronim.org/addStatus': [{}],
          'https://schema.repronim.org/order': [{
            '@list': [{
              '@id': 'page1',
            }],
          }],
          'https://schema.repronim.org/required': [{}],
          'https://schema.repronim.org/statusOptions': [{
            '@list': [],
          }],
          'https://schema.repronim.org/visibility': [{}],
        },
        fields: [{
          '@id': 'field_1',
          '@type': ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Field'],
          'http://schema.org/description': [{
            '@language': 'en',
            '@value': '',
          }],
          'http://schema.org/question': [{
            '@language': 'en',
            '@value': '',
          }],
          'http://schema.org/schemaVersion': [{
            '@language': 'en',
            '@value': '0.0.1',
          }],
          'http://schema.org/version': [{
            '@language': 'en',
            '@value': '0.0.1',
          }],
          'http://schema.repronim.org/preamble': [{
            '@language': 'en',
            '@value': '',
          }],
          'http://www.w3.org/2004/02/skos/core#altLabel': [{
            '@language': 'en',
            '@value': 'field_1',
          }],
          'http://www.w3.org/2004/02/skos/core#prefLabel': [{
            '@language': 'en',
            '@value': 'Field 1',
          }],
          'https://schema.repronim.org/headerLevel': [{
            '@type': 'http://www.w3.org/2001/XMLSchema#int',
            '@value': '3',
          }],
          'https://schema.repronim.org/inputType': [{
            '@type': 'http://www.w3.org/2001/XMLSchema#string',
            '@value': 'header',
          }],
          'https://schema.repronim.org/valueconstraints': null,
        }],
        multiparts: [],
        pages: [{
          '@id': 'page1',
          '@type': ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Activity'],
          'http://schema.ord/description': [{
            '@language': 'en',
            '@value': '',
          }],
          'http://schema.org/schemaVersion': [{
            '@language': 'en',
            '@value': '0.0.1',
          }],
          'http://schema.org/version': [{
            '@language': 'en',
            '@value': '0.0.1',
          }],
          'http://schema.repronim.org/preamble': [{
            '@language': 'en',
            '@value': '',
          }],
          'http://www.w3.org/2004/02/skos/core#altLabel': [{
            '@language': 'en',
            '@value': 'page1',
          }],
          'http://www.w3.org/2004/02/skos/core#prefLabel': [{
            '@language': 'en',
            '@value': 'Page 1',
          }],
          'https://schema.repronim.org/inputType': [{
            '@type': 'http://www.w3.org/2001/XMLSchema#string',
            '@value': 'page',
          }],
          'https://schema.repronim.org/order': [{
            '@list': [{
              '@id': 'field_1',
            }],
          }],
        }],
        sections: [],
        tables: [],
      },
      schemaURI: this.props.schemaURI,
      selectedField: null,
      selectedItemType: null,
      prevItem: null,
      nextItem: null,
      showModal: false,
      openDrawer: false,
      newField: {
        itemID: '',
        description: '',
        question: '',
        choices: [{name: '', value: ''}],
        multipleChoice: false,
        branching: '',
        scoring: '',
        requiredValue: false,
        headerLevel: null,
      },
      newSubActivity: {
        itemID: '',
        description: '',
        preamble: '',
        branching: '',
        order: [{list: '', inputType: ''}],
      },
    };
    this.mapKeysToAlias = this.mapKeysToAlias.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.editFormData = this.editFormData.bind(this);
    this.addValueConstraints = this.addValueConstraints.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.onDropFieldType = this.onDropFieldType.bind(this);
    // this.reIndexField = this.reIndexField.bind(this);
    this.deleteItemFromParent = this.deleteItemFromParent.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deletePage = this.deletePage.bind(this);
    this.addField = this.addField.bind(this);
    this.addSubActivity = this.addSubActivity.bind(this);
    this.addPageToSchema = this.addPageToSchema.bind(this);
    this.addItemToParent = this.addItemToParent.bind(this);
    this.pushToPages = this.pushToPages.bind(this);
    this.pushToMultiparts = this.pushToMultiparts.bind(this);
    this.pushToSections = this.pushToSections.bind(this);
    this.pushToTables = this.pushToTables.bind(this);
    this.selectField = this.selectField.bind(this);
  }

  async componentDidMount() {
    if (this.state.schemaURI !== '') {
      try {
        // Have to do this twice because deep cloning doesn't seem to be working currently
        const formData = await JsonLDExpander.expandFull(this.state.schemaURI);
        // const schemaData = Object.assign({}, formData);
        this.setState({formData});
      } catch (error) {
        console.error(error);
      }
    }
  }

  mapKeysToAlias(data) {
    const keyValues = Object.keys(data).map((key) => {
      let newKey = '';
      if (key.charAt(0) === '@') {
        newKey = key.substring(1);
      } else {
        let lastPiece = key.substring(key.lastIndexOf('/') + 1);
        if (lastPiece.lastIndexOf('#') > -1) {
          lastPiece = key.substring(key.lastIndexOf('#') + 1);
        }
        newKey = lastPiece;
      }
      return {[newKey]: data[key]};
    });

    return Object.assign({}, ...keyValues);
  }

  updateProfile(element, value) {
    let formData = Object.assign({}, this.state.formData);
    const fullKeyName = 'http://www.w3.org/2004/02/skos/core#' + element;
    formData.schema[fullKeyName][0]['@value'] = value;
    this.setState({formData});
  }

  editFormData(elementName, value) {
    const currentField = this.state.selectedField;
    let formData = Object.assign({}, this.state.formData);
    const itemID = formData.fields[currentField]['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'];
    let requiredValueIndex = null;
    (formData.schema['https://schema.repronim.org/required']).forEach((object, index) => {
      if (object['@index'] == itemID) {
        requiredValueIndex = index;
      }
    });
    let scoringLogicIndex = null;
    if (formData.schema.hasOwnProperty('https://schema.repronim.org/scoringLogic')) {
      (formData.schema['https://schema.repronim.org/scoringLogic']).forEach((object, index) => {
        if (object['@index'] == itemID) {
          scoringLogicIndex = index;
        }
      });
    }
    switch (elementName) {
      case 'itemID':
        formData.fields[currentField]['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'] = value;
        break;
      case 'description':
        formData.fields[currentField]['http://schema.org/description'][0]['@value'] = value;
        formData.fields[currentField]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'] = value;
        break;
      case 'question':
        formData.fields[currentField]['http://schema.org/question'][0]['@value'] = value;
        break;
      case 'headerLevel':
        formData.fields[currentField]['https://schema.repronim.org/headerLevel'][0]['@value'] = value;
        break;
      case 'multipleChoice':
         formData.fields[currentField]['https://schema.repronim.org/valueconstraints'][0]['http://schema.repronim.org/multipleChoice'][0]['@value'] = value;
        break;
      case 'branching':
        formData.schema['https://schema.repronim.org/visibility'][currentField]['@value'] = value;
        break;
      case 'scoring':
        formData.schema['https://schema.repronim.org/scoringLogic'][scoringLogicIndex]['@value'] = value;
        break;
      case 'requiredValue':
        formData.schema['https://schema.repronim.org/required'][requiredValueIndex]['@value'] = value;
        break;
      default:
        // for value constraint choice options
        if (elementName.includes('name')) {
          const index = elementName.substring(elementName.indexOf('_')+1);
         formData.fields[currentField]['https://schema.repronim.org/valueconstraints'][0]['http://schema.org/itemListElement'][0]['@list'][index]['http://schema.org/name'][0]['@value'] = value;
        } else if (elementName.includes('value')) {
          const index = elementName.substring(elementName.indexOf('_')+1);
         formData.fields[currentField]['https://schema.repronim.org/valueconstraints'][0]['http://schema.org/itemListElement'][0]['@list'][index]['http://schema.org/value'][0]['@value'] = value;
        }
    }
    this.setState({formData});
  }

  addValueConstraints(e) {
    const currentField = this.state.selectedField;
    let formData = Object.assign({}, this.state.formData);
    const newValueConstraint = {
      'http://schema.org/name': [{
        '@language': 'en',
        '@value': '',
      }],
      'http://schema.org/value': [{
        '@language': 'en',
        '@value': '',
      }],
    };
    (formData.fields[currentField]['https://schema.repronim.org/valueconstraints'][0]['http://schema.org/itemListElement'][0]['@list']).push(newValueConstraint);
    this.setState({formData});
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    const newField = {
      itemID: '',
      description: '',
      question: '',
      choices: [{name: '', value: ''}],
      multipleChoice: false,
      branching: '',
      scoring: '',
      requiredValue: false,
      headerLevel: null,
    };
    this.setState({showModal: false, newField});
  }

  showDrawer(e) {
    let openDrawer = !this.state.openDrawer;
    this.setState({openDrawer});
  }


  renderModal() {
    let addForm = null;
    const addValueConstraint = () => {
      let newField = Object.assign({}, this.state.newField);
      const newValueConstraint = {name: '', value: ''};
      newField.choices.push(newValueConstraint);
      this.setState({newField});
    };
    const editField = (elementName, value) => {
      let newField = Object.assign({}, this.state.newField);
      if (elementName.includes('name') || elementName.includes('value')) {
        const split = elementName.split('_');
        const index = split[1];
        const name = split[0];
        newField.choices[index][name] = value;
      } else {
        newField[elementName] = value;
      }
      this.setState({newField});
    };
    const editSubActivity = (elementName, value) => {
      let newSubActivity = Object.assign({}, this.state.newSubActivity);
      if (elementName.includes('list') || elementName.includes('inputType')) {
        const split = elementName.split('_');
        const index = split[1];
        const name = split[0];
        newSubActivity.order[index][name] = value;
      } else {
        newSubActivity[elementName] = value;
      }
      this.setState({newSubActivity});
    };
    const addToOrderList = () => {
      let newSubActivity = Object.assign({}, this.state.newSubActivity);
      newSubActivity.order.push('');
      this.setState({newSubActivity});
    };
    switch (this.state.selectedItemType) {
      case 'pageBreak':
        addForm = <AddPageForm
                    mode= 'add'
                    formData={this.state.newSubActivity}
                    onSave={this.addSubActivity}
                    onEdit={editSubActivity}
                    addPageContent={addToOrderList}
                  />;
        break;
      case 'section':
        addForm = <AddSectionForm
                    mode= 'add'
                    formData={this.state.newSubActivity}
                    onSave={this.addSubActivity}
                    onEdit={editSubActivity}
                  />;
        break;
      case 'multipart':
        addForm = <AddMultipartForm
                    mode= 'add'
                    formData={this.state.newSubActivity}
                    onSave={this.addSubActivity}
                    onEdit={editSubActivity}
                  />;
        break;
      case 'addTable':
        addForm = <AddTableForm
                    mode= 'add'
                    formData={this.state.newSubActivity}
                    onSave={this.addSubActivity}
                    onEdit={editSubActivity}
                  />;
        break;
      case 'select':
        addForm = <AddListItemForm
                    mode='add'
                    uiType='select'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                    addChoices={addValueConstraint}
                  />;
        break;
      case 'radio':
        addForm = <AddListItemForm
                    mode='add'
                    uiType='radio'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                    addChoices={addValueConstraint}
                  />;
        break;
      case 'text':
        addForm = <AddTextItemForm
                    mode='add'
                    uiType='text'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                  />;
        break;
      case 'textarea':
        addForm = <AddTextItemForm
                    mode='add'
                    uiType='textarea'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                  />;
        break;
      case 'number':
        addForm = <AddNumericItemForm
                    mode='add'
                    uiType='numeric'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                  />;
        break;
      case 'slider':
        addForm = <AddNumericItemForm
                    mode='add'
                    uiType='slider'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                  />;
        break;
      case 'label':
        addForm = <AddLabelItemForm
                    mode='add'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                  />;
        break;
      case 'static_score':
        addForm = <AddScoreItemForm
                    mode='add'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                  />;
        break;
      case 'header':
        addForm = <AddHeaderItemForm
                    mode='add'
                    formData={this.state.newField}
                    onSave={this.addField}
                    onEditField={editField}
                  />;
        break;
    }

    return (
      <Modal
        title='Add Field'
        onClose={this.closeModal}
        show={this.state.showModal}
        throwWarning={true}
      >
        {addForm}
      </Modal>
    );
  }

  onDropFieldType(e) {
    const selectedItemType = e.dataTransfer.getData('text');
    const placeholder = e.target;
    const prevSibling = placeholder.previousElementSibling;
    const nextSibling = placeholder.nextElementSibling;
    let prevItem = null;
    let nextItem = null;
    if (prevSibling != null) {
      prevItem = prevSibling.id;
    }
    if (nextSibling != null) {
      nextItem = nextSibling.id;
    }
    this.setState({selectedItemType, prevItem, nextItem});
    this.openModal();
    e.dataTransfer.clearData();
  }

  // addNewFieldTo(itemType, itemIndex) {
  //   const formDataKey = itemType.concat('s');
  // we want to add a new field to the order list of this.state.formData[formDataKey][itemIndex];
  // we need to push to fields array first
  // this function actually only needs to be called after data on add item form has been submitted
  // }


  // reIndexField(e) {
  // // should actually be reindexing the order array in each parent div i.e. section/ pages.
  // // splice(e.target.id??, 0, tempfield) insert temp field element into current index of fields array
  //   const targetField = e.target.id;
  //   const selectedField = e.dataTransfer.getData('text');
  //   let formData = Object.assign({}, this.state.formData);
  //   formData.fields.splice();
  //   let temp = formData.fields[selectedField];
  //   formData.fields[selectedField] = formData.fields[targetField];
  //   formData.fields[targetField] = temp;
  //   this.setState({formData});
  //   e.dataTransfer.clearData();
  // }

  deleteItem(e) {
    const itemDOMID = e.currentTarget.parentNode.parentNode.id;
    const itemInfo = itemDOMID.split('_');
    const itemType = itemInfo[0].concat('s');
    const itemIndex = itemInfo[1];
    let formData = Object.assign({}, this.state.formData);
    const itemID = formData[itemType][itemIndex]['@id'];
    swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all field information.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete field!',
    }).then((result) => {
      if (result.value) {
        formData[itemType].splice(itemIndex, 1);
        this.deleteItemFromParent(itemID, formData);
        this.setState({formData});
        swal.fire('Deleted!', 'Field has been deleted.', 'success');
      }
    });
  }

  deletePage(e) {
    const pageKey = e.currentTarget.parentNode.id;
    let formData = Object.assign([], this.state.formData);
    swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all page information.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete page!',
    }).then((result) => {
      if (result.value) {
        formData.pages.splice(pageKey, 2);
        this.setState({formData});
        swal.fire('Deleted!', 'Page has been deleted.', 'success');
      }
    });
  }

  addField(e) {
    let formDataCopy = Object.assign({}, this.state.formData);
    const valueConstraints = this.state.newField.choices.map((choice, index) => {
      return {
        'http://schema.org/name': [{
          '@language': 'en',
          '@value': choice.name,
        }],
        'http://schema.org/value': [{
          '@language': 'en',
          '@value': choice.value,
        }],
      };
    });
    let field = {
      '@id': this.state.newField.itemID,
      '@type': ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Field'],
      'http://schema.org/description': [{
        '@language': 'en',
        '@value': this.state.newField.description,
      }],
      'http://schema.org/question': [{
        '@language': 'en',
        '@value': this.state.newField.question,
      }],
      'http://www.w3.org/2004/02/skos/core#altLabel': [{
        '@language': 'en',
        '@value': this.state.newField.itemID,
      }],
      'http://www.w3.org/2004/02/skos/core#prefLabel': [{
        '@language': 'en',
        '@value': this.state.newField.description,
      }],
      'https://schema.repronim.org/inputType': [{
        '@type': 'http://www.w3.org/2001/XMLSchema#string',
        '@value': this.state.selectedItemType,
      }],
      'https://schema.repronim.org/valueconstraints': [{
        'http://schema.org/itemListElement': [{
          '@list': valueConstraints,
        }],
      }],
      'http://schema.repronim.org/multipleChoice': [{
        '@type': 'http://schema.org/Boolean',
        '@value': this.state.newField.multipleChoice,
      }],
    };
    if (this.state.selectedItemType === 'header') {
      field['https://schema.repronim.org/headerLevel'] = [{
        '@type': 'http://www.w3.org/2001/XMLSchema#int',
        '@value': this.state.newField.headerLevel,
      }];
    }
    formDataCopy.fields.push(field);
    const formData = this.addItemToParent(this.state.newField.itemID, formDataCopy);
    this.setState({formData}, () => {
      swal.fire('Success!', 'Item added.', 'success').then((result) => {
        if (result.value) {
          this.closeModal();
        }
      });
    });
  }

  addSubActivity(e) {
    // add accompanying field(s) to their arrays in formdata
    let formData = Object.assign({}, this.state.formData);
    this.state.newSubActivity.order.map((item) => {
      let contentType = null;
      let itemType = null;
      switch (item.inputType) {
        case 'boolean':
        case 'date':
        case 'header':
        case 'label':
        case 'numeric':
        case 'radio':
        case 'score':
        case 'select':
        case 'text':
        case 'textarea':
          contentType = ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Field'];
          itemType = 'fields';
          break;
        case 'multipart':
          contentType = ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Activity'];
          itemType = 'multiparts';
          break;
        case 'section':
          contentType = ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Activity'];
          itemType = 'sections';
          break;
        case 'table':
          contentType = ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Activity'];
          itemType = 'tables';
          break;
      }
      let content = {
        '@id': item.list,
        '@type': contentType,
        'http://schema.org/description': [{
          '@language': 'en',
          '@value': '',
        }],
        'http://schema.org/question': [{
          '@language': 'en',
          '@value': '',
        }],
        'http://www.w3.org/2004/02/skos/core#altLabel': [{
          '@language': 'en',
          '@value': item.list,
        }],
        'http://www.w3.org/2004/02/skos/core#prefLabel': [{
          '@language': 'en',
          '@value': '',
        }],
        'https://schema.repronim.org/inputType': [{
          '@type': 'http://www.w3.org/2001/XMLSchema#string',
          '@value': item.inputType,
        }],
        'https://schema.repronim.org/valueconstraints': [{
          'http://schema.org/itemListElement': [{
            '@list': [{
              'http://schema.org/name': [{
                '@language': 'en',
                '@value': '',
              }],
              'http://schema.org/value': [{
                '@language': 'en',
                '@value': '',
              }],
            }],
          }],
        }],
        'http://schema.repronim.org/multipleChoice': [{
          '@type': 'http://schema.org/Boolean',
          '@value': '',
        }],
      };
      if (item.inputType === 'header') {
        content['https://schema.repronim.org/headerLevel'] = [{
          '@type': 'http://www.w3.org/2001/XMLSchema#int',
          '@value': '',
        }];
      }
      formData[itemType].push(content);
    });
    this.setState({formData});

    // push subactivity to their type arrays
    const subActivityType = this.state.selectedItemType;
    const orderList = this.state.newSubActivity.order.map((item) => {
      return {
        '@id': item.list,
      };
    });
    let subActivity = {
      '@id': this.state.newSubActivity.itemID,
      '@type': ['https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Activity'],
      'http://schema.org/description': [{
        '@language': 'en',
        '@value': this.state.newSubActivity.description,
      }],
      'http://schema.repronim.org/preamble': [{
        '@language': 'en',
        '@value': this.state.newSubActivity.preamble,
      }],
      'http://www.w3.org/2004/02/skos/core#altLabel': [{
        '@language': 'en',
        '@value': this.state.newSubActivity.itemID,
      }],
      'http://www.w3.org/2004/02/skos/core#prefLabel': [{
        '@language': 'en',
        '@value': this.state.newSubActivity.description,
      }],
      'https://schema.repronim.org/inputType': [{
        '@type': 'http://www.w3.org/2001/XMLSchema#string',
        '@value': subActivityType,
      }],
      'https://schema.repronim.org/order': [
        {
          '@list': orderList,
        },
      ],
    };
    switch (subActivityType) {
      case 'pageBreak':
        this.pushToPages(subActivity);
        break;
      case 'section':
        this.pushToSections(subActivity);
        break;
      case 'multipart':
        this.pushToMultiparts(subActivity);
        break;
      case 'addTable':
        this.pushToTables(subActivity);
        break;
    }
  }

  deleteItemFromParent(itemID, formDataCopy) {
    // TODO: delete itemID from item's parent's order list
    // need to find parent id somehow
  }

  addPageToSchema(pageID, formDataCopy) {
    // Add new item to schema order list
    const currentDropPage = (document.getElementById(this.state.prevItem)).parentNode || (document.getElementById(this.state.nextItem)).parentNode;
    const pageIdInfo = (currentDropPage.id).split('_');
    const currentPageIndex = pageIdInfo[1];
    const currentPageItemId = formDataCopy.pages[currentPageIndex]['@id'];
    let currentPageOrder = null;
    (formDataCopy.schema['https://schema.repronim.org/order'][0]['@list']).forEach((item, index) => {
      if (item['@id'] === currentPageItemId) {
        currentPageOrder = index;
      }
    });
    // insert new page in correct location of schema's order list
    // correct location is directly after currentPageOrder
    (formDataCopy.schema['https://schema.repronim.org/order'][0]['@list']).splice(currentPageOrder+1, 0, {
      '@id': pageID,
    });

    // TODO: Add functionality of breaking nextItem into the new page
    // depending on where the page break is dropped
    // const siblings = [this.state.prevItem, this.state.nextItem];
    // const siblingsID = siblings.map((sibling) => {
    //   if (sibling != null) {
    //     const split = sibling.split('_');
    //     const type = split[0].concat('s');
    //     const index = split[1];
    //     return formDataCopy[type][index]['@id'];
    //   } else {
    //     return null;
    //   }
    // });

    return formDataCopy;
  }

  addItemToParent(itemID, formDataCopy) {
    // Add new item to parent's order list
    const parentContainer = (document.getElementById(this.state.prevItem)).parentNode || (document.getElementById(this.state.nextItem)).parentNode;
    const parentItem = (parentContainer.id).split('_');
    const siblings = [this.state.prevItem, this.state.nextItem];
    const siblingsID = siblings.map((sibling) => {
      if (sibling != null) {
        const split = sibling.split('_');
        const type = split[0].concat('s');
        const index = split[1];
        return formDataCopy[type][index]['@id'];
      } else {
        return null;
      }
    });
    // for each '@id' of this.state.prevItem/nextItem, return location in parent of ids
    const parentType = parentItem[0].concat('s');
    const parentIndex = parentItem[1];
    const order = siblingsID.map((id) => {
      let siblingOrder = null;
      (formDataCopy[parentType][parentIndex]['https://schema.repronim.org/order'][0]['@list']).forEach((item, index) => {
        if (item['@id'] === id) {
          siblingOrder = index;
        }
      });
      return siblingOrder;
    });
    // insert new item ID in correct location of order list
    if ((order[0]+1 == order[1]) || order[0] == undefined) {
      (formDataCopy[parentType][parentIndex]['https://schema.repronim.org/order'][0]['@list']).splice(order[1], 0, {
        '@id': itemID,
      });
    } else if (order[1] == undefined) {
      (formDataCopy[parentType][parentIndex]['https://schema.repronim.org/order'][0]['@list']).push({
        '@id': itemID,
      });
    } else {
      swal.fire('Error.', 'Error indexing and adding new item.', 'error');
    }
    return formDataCopy;
  }

  pushToPages(page) {
    const pageID = this.state.newSubActivity.itemID;
    let formDataCopy = Object.assign([], this.state.formData);
    formDataCopy.pages.push(page);
    // Add new page to schema order list
    const formData = this.addPageToSchema(pageID, formDataCopy);
    this.setState({formData}, () => {
      swal.fire('Success!', 'Page added.', 'success').then((result) => {
        if (result.value) {
          this.closeModal();
        }
      });
    });
  }

  pushToMultiparts(multipart) {
    const multipartID = this.state.newSubActivity.itemID;
    let formData = Object.assign([], this.state.formData);
    formData.multiparts.push(multipart);
    // Add new multipart to parent's order list
    formData = this.addItemToParent(multipartID, formData);
    this.setState({formData}, () => {
      swal.fire('Success!', 'Multipart added.', 'success').then((result) => {
        if (result.value) {
          this.closeModal();
        }
      });
    });
  }

  pushToSections(section) {
    const sectionID = this.state.newSubActivity.itemID;
    let formData = Object.assign([], this.state.formData);
    formData.sections.push(section);
    // Add new section to parent's order list
    formData = this.addItemToParent(sectionID, formData);
    this.setState({formData}, () => {
      swal.fire('Success!', 'Section added.', 'success').then((result) => {
        if (result.value) {
          this.closeModal();
        }
      });
    });
  }

  pushToTables(table) {
    const tableID = this.state.newSubActivity.itemID;
    let formData = Object.assign([], this.state.formData);
    formData.tables.push(table);
    // Add new table to parent's order list
    formData = this.addItemToParent(tableID, formData);
    this.setState({formData}, () => {
      swal.fire('Success!', 'Table added.', 'success').then((result) => {
        if (result.value) {
          this.closeModal();
        }
      });
    });
  }

  selectField(e) {
    let fieldIndex = (e.currentTarget.id).substring((e.currentTarget.id).indexOf('_')+1);
    this.setState({
      selectedField: fieldIndex,
      openDrawer: true,
    });
  }

  render() {
    const divStyle = {
      border: '1px solid #C3D5DB',
      borderRadius: '4px',
      height: '678px',
      marginTop: '-6px',
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'stretch',
      background: '#FCFCFC',
    };

    // Setup variables for toolbar component
    let profile = {};
    if (this.state.formData.schema['http://www.w3.org/2004/02/skos/core#altLabel'] && this.state.formData.schema['http://www.w3.org/2004/02/skos/core#prefLabel']) {
      profile = {
        name: this.state.formData.schema['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'],
        fullName: this.state.formData.schema['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'],
      };
    }

    // Setup variables for drawer component
    let field = {};
    let inputType = null;
    // Define required boolean
    let requiredValues = {};
    if (this.state.formData.schema.hasOwnProperty('https://schema.repronim.org/required')) {
      (this.state.formData.schema['https://schema.repronim.org/required']).map((required, index) => {
        requiredValues[required['@index']] = required['@value'];
      });
    }
    if (this.state.selectedField != null) {
      const currentField = this.state.selectedField;
      // Define choices
      let choices = [];
      let multipleChoice = null;
      if (this.state.formData.fields[currentField]['https://schema.repronim.org/valueconstraints']) {
        if ((this.state.formData.fields[currentField]['https://schema.repronim.org/valueconstraints'][0]).hasOwnProperty('http://schema.org/itemListElement')) {
          choices = this.state.formData.fields[currentField]['https://schema.repronim.org/valueconstraints'][0]['http://schema.org/itemListElement'][0]['@list'].map((valueConstraint, index) => {
            return ({
              name: valueConstraint['http://schema.org/name'][0]['@value'],
              value: valueConstraint['http://schema.org/value'][0]['@value'],
            });
          });
        }
        // Define multiplechoice boolean
        if ((this.state.formData.fields[currentField]['https://schema.repronim.org/valueconstraints'][0]).hasOwnProperty('http://schema.repronim.org/multipleChoice')) {
          multipleChoice = this.state.formData.fields[currentField]['https://schema.repronim.org/valueconstraints'][0]['http://schema.repronim.org/multipleChoice'][0]['@value'];
        }
      }
      // Define branching logic string
      // Find visibility array index where '@index' = currentField's altLabel
      const itemID = this.state.formData.fields[currentField]['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'];
      let branching = '';
      if (this.state.formData.schema['https://schema.repronim.org/visibility']) {
        (this.state.formData.schema['https://schema.repronim.org/visibility']).forEach((object, index) => {
          if (object['@index'] == itemID) {
            branching = object['@value'];
          }
        });
      }
      // Define scoring logic string
      // Find scoringLogic array index where '@index' = currentField's altLabel
      let scoring = '';
      if (this.state.formData.schema['https://schema.repronim.org/scoringLogic']) {
        (this.state.formData.schema['https://schema.repronim.org/scoringLogic']).forEach((object, index) => {
          if (object['@index'] == itemID) {
            scoring = object['@value'];
          }
        });
      }
      // Define header level if it exists
      let headerLevel = null;
      if (this.state.formData.fields[currentField]['https://schema.repronim.org/headerLevel']) {
        headerLevel = this.state.formData.fields[currentField]['https://schema.repronim.org/headerLevel'][0]['@value'];
      }
      // Create field object to pass as prop to edit drawer component
      field = {
        itemID: itemID,
        description: this.state.formData.fields[currentField]['http://schema.org/description'][0]['@value'],
        question: this.state.formData.fields[currentField]['http://schema.org/question'][0]['@value'],
        choices: choices,
        multipleChoice: multipleChoice,
        branching: branching,
        requiredValue: requiredValues[itemID] || false,
        headerLevel: headerLevel,
        scoring: scoring,
      };
      inputType = this.state.formData.fields[currentField]['https://schema.repronim.org/inputType'][0]['@value'];
    }
    return (
      <div>
        {this.renderModal()}
        <div style={divStyle}>
          <Toolbar
            profile={profile}
            onUpdate={this.updateProfile}
          >
          </Toolbar>
          <Canvas
            fields={this.state.formData.fields}
            multiparts={this.state.formData.multiparts}
            pages={this.state.formData.pages}
            sections={this.state.formData.sections}
            tables={this.state.formData.tables}
            requiredValues={requiredValues}
            onDropFieldType={this.onDropFieldType}
            // reIndexField={this.reIndexField}
            deletePage={this.deletePage}
            deleteMultipart={this.deleteItem}
            deleteSection={this.deleteItem}
            deleteField={this.deleteItem}
            selectField={this.selectField}
          >
          </Canvas>
          <EditDrawer
            open={this.state.openDrawer}
            showDrawer={this.showDrawer}
            inputType={inputType}
            field={field}
            onEditField={this.editFormData}
            addChoices={this.addValueConstraints}
          >
          </EditDrawer>
        </div>
      </div>
    );
  }
}

InstrumentBuilderApp.propTypes = {
  schemaURI: PropTypes.string.isRequired,
};

InstrumentBuilderApp.defaultProps = {
  schemaURI: null,
};

export default InstrumentBuilderApp;
