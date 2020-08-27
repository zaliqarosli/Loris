import React, {Component} from 'react';
import PropTypes from 'prop-types';

// import JsonLDExpander from './../../../htdocs/js/JsonLDExpander';
import swal from 'sweetalert2';
import Modal from 'Modal';
import Loader from 'Loader';

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
import AddTableForm from './addTableForm';

class Builder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schemaData: {},
      error: false,
      isLoaded: false,
      formData: {
        schema: {
          '@type': 'reproschema:Activity',
          '@id': '',
          'altLabel': {},
          'prefLabel': {},
          'description': '',
          'schemaVersion': '1.0.0-rc1',
          'version': '0.0.1',
          'preamble': {},
          'ui': {
            'order': [{}],
          },
        },
        fields: [{
          '@type': 'reproschema:Field',
          '@id': '',
          'altLabel': {},
          'prefLabel': {},
          'description': '',
          'schemaVersion': '1.0.0-rc1',
          'version': '0.0.1',
          'question': {},
          'ui': {
            'inputType': '',
          },
        }],
        multiparts: [],
        pages: [{
          '@type': 'reproschema:Activity',
          '@id': '',
          'altLabel': {},
          'prefLabel': {},
          'description': '',
          'schemaVersion': '1.0.0-rc1',
          'version': '0.0.1',
          'preamble': {},
          'ui': {
            'inputType': 'page',
            'order': [{}],
          },
        }],
        sections: [],
        tables: [],
      },
      schemaURI: this.props.schemaURI,
      selectedItem: null,
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
        headerLevel: '',
      },
      newSubActivity: {
        itemID: '',
        description: '',
        preamble: '',
        branching: '',
        order: [{list: '', inputType: ''}],
        tableHeaders: [''],
        noOfRows: undefined,
      },
    };
    this.updateProfile = this.updateProfile.bind(this);
    this.editField = this.editField.bind(this);
    this.editSubActivity = this.editSubActivity.bind(this);
    this.addValueConstraints = this.addValueConstraints.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.onDropFieldType = this.onDropFieldType.bind(this);
    this.reIndexField = this.reIndexField.bind(this);
    this.deleteItemFromParent = this.deleteItemFromParent.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deletePageFromSchema = this.deletePageFromSchema.bind(this);
    this.deletePage = this.deletePage.bind(this);
    this.addField = this.addField.bind(this);
    this.addSubActivity = this.addSubActivity.bind(this);
    this.addPageToSchema = this.addPageToSchema.bind(this);
    this.addItemToParent = this.addItemToParent.bind(this);
    this.pushToPages = this.pushToPages.bind(this);
    this.pushToMultiparts = this.pushToMultiparts.bind(this);
    this.pushToSections = this.pushToSections.bind(this);
    this.pushToTables = this.pushToTables.bind(this);
    this.selectItem = this.selectItem.bind(this);
    // this.getAltLabelById = this.getAltLabelById.bind(this);
    this.addTableHeader = this.addTableHeader.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
     return fetch(this.props.DataURL, {credentials: 'same-origin'})
    .then((resp) => resp.json())
    .then((data) => {
      this.setState({schemaData: data['schemaJSON']});
    })
    .catch((error) => {
      this.setState({error: true});
      console.error(error);
    });
  }

  updateProfile(element, value) {
    let formData = Object.assign({}, this.state.formData);
    const fullKeyName = element;
    formData.schema[fullKeyName][0]['@value'] = value;
    this.setState({formData});
  }

  editSubActivity(elementName, value) {
    const currentItem = this.state.selectedItem.split('_');
    const currentItemType = currentItem[0];
    const currentItemIndex = currentItem[1];
    let formData = Object.assign({}, this.state.formData);
    const itemID = formData[currentItemType][currentItemIndex]['altLabel'][0]['@value'];
    let branchingLogicIndex = null;
    if (formData.schema.hasOwnProperty('isVis')) {
      (formData.schema['isVis']).forEach((object, index) => {
        if (object['@index'] == itemID) {
          branchingLogicIndex = index;
        }
      });
    }
    switch (elementName) {
      case 'itemID':
        formData[currentItemType][currentItemIndex]['altLabel'][0]['@value'] = value;
        break;
      case 'description':
        formData[currentItemType][currentItemIndex]['description'][0]['@value'] = value;
        formDatap[currentItemType][currentItemIndex]['prefLabel'][0]['@value'] = value;
        break;
      case 'preamble':
        formData[currentItemType][currentItemIndex]['preamble'][0]['@value'] = value;
        break;
      case 'branching':
        formData.schema['isVis'][branchingLogicIndex]['@value'] = value;
        break;
      case 'noOfRows':
        // TODO: Fix that you can't change value by keyboard
        const currentNumber = formData.tables[currentItemIndex]['tablerows'][0]['@list'].length;
        let lastIndex = currentNumber - 1;
        const rowToCopy = formData.tables[currentItemIndex]['tablerows'][0]['@list'][0];
        if (value === '') {
          value = currentNumber;
        }
        const toAdd = value - currentNumber;
        if (toAdd > 0) {
          for (let i = 0; i < value; i++) {
            formData.tables[currentItemIndex]['tablerows'][0]['@list'].splice(lastIndex, 0, rowToCopy);
            lastIndex += 1;
          }
        } else if (toAdd < 0) {
          formData.tables[currentItemIndex]['tablerows'][0]['@list'].splice(toAdd);
        }
        break;
      default:
        // for table elements
        const index = (elementName.split('_'))[1];
        if (elementName.includes('header')) {
          formData.tables[currentItemIndex]['tableheaders'][0]['@list'][index]['@value'] = value;
        } else if (elementName.includes('rowitem')) {
          formData[currentItemType][currentItemIndex]['tablerows'][0]['@list'].forEach((row, rowIndex) => {
            // row['https://schema.repronim.org/order'][0]['@list'][index]['@id'] = value;
            // what is saved above is the id, not the altLabel
            // TODO: figure out what happens when you change altLabel (i.e. front-end id) of items inside subActivity
          });
        } else if (elementName.includes('list')) {
          formData[currentItemType][currentItemIndex]['order'][0]['@list'].forEach((item, index) => {
            // TODO: figure out what happens when you change id of items inside subActivity
          });
        }
    }
    this.setState({formData});
  }

  editField(elementName, value) {
    const currentField = (this.state.selectedItem).split('_')[1];
    let formData = Object.assign({}, this.state.formData);
    const itemID = formData.fields[currentField]['altLabel'][0]['@value'];
    let requiredValueIndex = null;
    (formData.schema['valueRequired']).forEach((object, index) => {
      if (object['@index'] == itemID) {
        requiredValueIndex = index;
      }
    });
    let scoringLogicIndex = null;
    if (formData.schema.hasOwnProperty('jsExpression')) {
      (formData.schema['jsExpression']).forEach((object, index) => {
        if (object['@index'] == itemID) {
          scoringLogicIndex = index;
        }
      });
    }
    switch (elementName) {
      case 'itemID':
        formData.fields[currentField]['altLabel']['en'] = value;
        break;
      case 'description':
        formData.fields[currentField]['description'] = value;
        formData.fields[currentField]['prefLabel']['en'] = value;
        break;
      case 'question':
        formData.fields[currentField]['question']['en'] = value;
        break;
      case 'headerLevel':
        formData.fields[currentField]['ui']['headerLevel'] = value;
        break;
      case 'multipleChoice':
         formData.fields[currentField]['responseOptions']['multipleChoice'] = value;
        break;
      case 'branching':
        formData.schema['isVis'][currentField]['@value'] = value;
        break;
      case 'scoring':
        formData.schema['jsExpression'][scoringLogicIndex]['@value'] = value;
        break;
      case 'requiredValue':
        formData.schema['valueRequired'][requiredValueIndex]['@value'] = value;
        break;
      default:
        // for value constraint choice options
        const index = (elementName.split('_'))[1];
        if (elementName.includes('name')) {
         formData.fields[currentField]['responseOptions']['choices'][index]['name']['en'] = value;
        } else if (elementName.includes('value')) {
         formData.fields[currentField]['responseOptions']['choices'][0][index]['value'] = value;
        }
    }
    this.setState({formData});
  }

  addValueConstraints(e) {
    const currentField = this.state.selectedItem;
    let formData = Object.assign({}, this.state.formData);
    const newValueConstraint = {
      'name': {
        'en': '',
      },
      'value': '',
    };
    (formData.fields[currentField]['valueconstraints'][0]['itemListElement'][0]['@list']).push(newValueConstraint);
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
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occurred while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    let addForm = null;
    const addValueConstraint = () => {
      let newField = Object.assign({}, this.state.newField);
      const newValueConstraint = {name: '', value: ''};
      newField.choices.push(newValueConstraint);
      this.setState({newField});
    };
    const addTableHeader = () => {
      let newSubActivity = Object.assign({}, this.state.newSubActivity);
      newSubActivity.tableHeaders.push('');
      this.setState({newSubActivity});
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
      } else if (elementName.includes('header')) {
        const split = elementName.split('_');
        const index = split[1];
        newSubActivity.tableHeaders[index] = value;
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
                    mode='add'
                    formData={this.state.newSubActivity}
                    onSave={this.addSubActivity}
                    onEdit={editSubActivity}
                    addPageContent={addToOrderList}
                  />;
        break;
      case 'section':
        addForm = <AddSectionForm
                    mode='add'
                    formData={this.state.newSubActivity}
                    onSave={this.addSubActivity}
                    onEdit={editSubActivity}
                  />;
        break;
      // case 'multipart':
      //   addForm = <AddMultipartForm
      //               mode='add'
      //               formData={this.state.newSubActivity}
      //               onSave={this.addSubActivity}
      //               onEdit={editSubActivity}
      //             />;
      //   break;
      case 'addTable':
        addForm = <AddTableForm
                    mode='add'
                    formData={this.state.newSubActivity}
                    onSave={this.addSubActivity}
                    onEdit={editSubActivity}
                    addHeader={addTableHeader}
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

  reIndexField(from, to, fromParent, toParent) {
    let formData = Object.assign({}, this.state.formData);
    // dragged item info
    const fromInfo = from.split('_');
    const fromType = fromInfo[0];
    const fromIndex = fromInfo[1];
    const fromID = formData[fromType][fromIndex]['@id'];
    // dragged parent info
    const fromParentInfo = fromParent.split('_');
    const fromParentType = fromParentInfo[0];
    const fromParentIndex = fromParentInfo[1];
    // get dragged item order in parent's order list
    let fromOrder = null;
    (formData[fromParentType][fromParentIndex]['order'][0]['@list']).forEach((item, index) => {
      if (item['@id'] === fromID) {
        fromOrder = index;
      }
    });

    // over item info
    const toInfo = to.split('_');
    const toType = toInfo[0];
    const toIndex = toInfo[1];
    const toID = formData[toType][toIndex]['@id'];
    // over parent info
    const toParentInfo = toParent.split('_');
    const toParentType = toParentInfo[0];
    const toParentIndex = toParentInfo[1];
    // get over item order in parent's order list
    let toOrder = null;
    (formData[toParentType][toParentIndex]['order'][0]['@list']).forEach((item, index) => {
      if (item['@id'] === toID) {
        toOrder = index;
      }
    });

    // TODO: case where dragged reindexes to itself
    // case of to-- if from < to, and to++ if nodePlacement === 'after'
    // case where field gets pulled out of subactivity into another parent subactivity

    // start splicing
    const elementToAdd = ((formData[fromParentType][fromParentIndex]['order'][0]['@list']).splice(fromOrder, 1))[0];
    (formData[toParentType][toParentIndex]['order'][0]['@list']).splice(toOrder, 0, elementToAdd);
    this.setState({formData});
  }

  deleteItem(e) {
    const itemDOMID = e.currentTarget.parentNode.parentNode.id;
    const itemInfo = itemDOMID.split('_');
    const itemType = itemInfo[0];
    const itemIndex = itemInfo[1];
    let formDataCopy = Object.assign({}, this.state.formData);
    const itemID = formDataCopy[itemType][itemIndex]['@id'];
    swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all field information.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete field!',
    }).then((result) => {
      if (result.value) {
        formDataCopy[itemType].splice(itemIndex, 1);
        const formData = this.deleteItemFromParent(itemID, itemDOMID, formDataCopy);
        this.setState({formData}, () => {
          swal.fire('Deleted!', 'Field has been deleted.', 'success');
        });
      }
    });
    // stop click from propagating
    if (!e) {
      e = window.event;
    }
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  }

  deletePage(e) {
    const pageDOMID = e.currentTarget.parentNode.parentNode.id;
    const pageIndex = (pageDOMID.split('_'))[1];
    let formDataCopy = Object.assign([], this.state.formData);
    const pageID = formDataCopy.pages[pageIndex]['@id'];
    swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all page information.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete page!',
    }).then((result) => {
      if (result.value) {
        formDataCopy.pages.splice(pageIndex, 1);
        const formData = this.deletePageFromSchema(pageID, formDataCopy);
        this.setState({formData}, () => {
          swal.fire('Deleted!', 'Page has been deleted.', 'success');
        });
      }
    });
  }

  addField(e) {
    let formDataCopy = Object.assign({}, this.state.formData);
    const choices = this.state.newField.choices.map((choice, index) => {
      return {
        'name': {
          'en': choice.name,
        },
        'value': choice.value,
      };
    });
    let field = {
      '@type': 'reproschema:Field',
      '@id': this.state.newField.itemID,
      'altLabel': {
        'en': this.state.newField.itemID,
      },
      'prefLabel': {
        'en': this.state.newField.description,
      },
      'description': this.state.newField.description,
      'schemaVersion': '1.0.0-rc1',
      'version': '0.0.1',
      'question': {
        'en': this.state.newField.question,
      },
      'ui': {
        'inputType': this.state.selectedItemType,
      },
      'responseOptions': {
        'valueType': '',
        'multipleChoice': this.state.newField.multipleChoice,
        'choices': choices,
      },
    };
    if (this.state.selectedItemType === 'header') {
      field['ui']['headerLevel'] = this.state.newField.headerLevel;
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
      let displayText = null;
      switch (item.inputType) {
        case 'select':
        case 'text':
        case 'textarea':
          contentType = 'reproschema:Field';
          itemType = 'fields';
          displayText = 'question';
          break;
        case 'multipart':
          contentType = 'reproschema:Activity';
          itemType = 'multiparts';
          displayText = 'preamble';
          break;
        case 'section':
          contentType = 'reproschema:Activity';
          itemType = 'sections';
          displayText = 'preamble';
          break;
        case 'table':
          contentType = 'reproschema:Activity';
          itemType = 'tables';
          displayText = 'preamble';
          break;
      }
      let content = {
        '@type': contentType,
        '@id': item.list,
        'altLabel': {
          'en': item.list,
        },
        'prefLabel': {
          'en': '',
        },
        'description': '',
        [displayText]: {
          'en': '',
        },
        'ui': {
          'inputType': item.inputType,
        },
        'responseOptions': {
          'multipleChoice': '',
          'choices': [
            {
              'name': {
                'en': '',
              },
              'value': '',
            },
           ],
        },
      };
      if (item.inputType === 'header') {
        content['ui']['headerLevel'] = '';
      }
      if (item.inputType === 'multipart' || item.inputType === 'section' || item.inputType === 'table') {
        content['ui']['order'] = [
          {
            '@type': 'reproschema:Field',
            '@id': '',
          },
        ];
      }
      console.log(itemType);
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
      '@type': 'reproschema:Activity',
      'altLabel': {
        'en': this.state.newSubActivity.itemID,
      },
      'prefLabel': {
        'en': this.state.newSubActivity.description,
      },
      'description': this.state.newSubActivity.description,
      'preamble': {
        'en': this.state.newSubActivity.preamble,
      },
      'ui': {
        'inputType': subActivityType,
        'order': orderList,
      },
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

  deleteItemFromParent(itemID, itemDOMID, formDataCopy) {
    const parentDOMID = (document.getElementById(itemDOMID)).parentNode.id;
    const parentInfo = parentDOMID.split('_');
    const parentType = parentInfo[0];
    const parentIndex = parentInfo[1];
    let itemOrder = null;
    formDataCopy[parentType][parentIndex]['order'][0]['@list'].forEach((item, index) => {
      if (item['@id'] === itemID) {
        itemOrder = index;
      }
    });
    // splice out that index
    (formDataCopy[parentType][parentIndex]['order'][0]['@list']).splice(itemOrder, 1);
    return formDataCopy;
  }

  deletePageFromSchema(pageID, formDataCopy) {
    let pageOrder = null;
    formDataCopy.schema['order'][0]['@list'].forEach((page, index) => {
      if (page['@id'] === pageID) {
        pageOrder = index;
      }
    });
    // splice out that index
    (formDataCopy.schema['order'][0]['@list']).splice(pageOrder, 1);
    return formDataCopy;
  }

  addPageToSchema(pageID, formDataCopy) {
    // Add new item to schema order list
    const currentDropPage = (document.getElementById(this.state.prevItem)).parentNode || (document.getElementById(this.state.nextItem)).parentNode;
    const pageIdInfo = (currentDropPage.id).split('_');
    const currentPageIndex = pageIdInfo[1];
    const currentPageItemId = formDataCopy.pages[currentPageIndex]['@id'];
    let currentPageOrder = null;
    (formDataCopy.schema['order'][0]['@list']).forEach((item, index) => {
      if (item['@id'] === currentPageItemId) {
        currentPageOrder = index;
      }
    });
    // insert new page in correct location of schema's order list
    // correct location is directly after currentPageOrder
    (formDataCopy.schema['order'][0]['@list']).splice(currentPageOrder+1, 0, {
      '@id': pageID,
    });

    // TODO: Add functionality of breaking nextItem into the new page
    // depending on where the page break is dropped
    // const siblings = [this.state.prevItem, this.state.nextItem];
    // const siblingsID = siblings.map((sibling) => {
    //   if (sibling != null) {
    //     const split = sibling.split('_');
    //     const type = split[0];
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
        const type = split[0];
        const index = split[1];
        return formDataCopy[type][index]['@id'];
      } else {
        return null;
      }
    });
    // for each '@id' of this.state.prevItem/nextItem, return location in parent of ids
    const parentType = parentItem[0];
    const parentIndex = parentItem[1];
    const order = siblingsID.map((id) => {
      let siblingOrder = null;
      (formDataCopy[parentType][parentIndex]['order'][0]['@list']).forEach((item, index) => {
        if (item['@id'] === id) {
          siblingOrder = index;
        }
      });
      return siblingOrder;
    });
    // insert new item ID in correct location of order list
    if ((order[0]+1 == order[1]) || order[0] == undefined) {
      (formDataCopy[parentType][parentIndex]['order'][0]['@list']).splice(order[1], 0, {
        '@id': itemID,
      });
    } else if (order[1] == undefined) {
      (formDataCopy[parentType][parentIndex]['order'][0]['@list']).push({
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

  selectItem(e) {
    this.setState({
      selectedItem: e.currentTarget.id,
      openDrawer: true,
    });
    // stop click from propagating
    if (!e) {
      e = window.event;
    }
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  }

  // getAltLabelById(itemId, itemType) {
  //   let altLabel = null;
  //   this.state.formData[itemType].forEach((item, index) => {
  //     if (item['@id'] === itemId) {
  //       altLabel = item['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'];
  //     }
  //   });
  //   return altLabel;
  // }

  addTableHeader(e) {
    let tableIndex = this.state.selectedItem.split('_')[1];
    let formData = Object.assign({}, this.state.formData);
    formData.tables[tableIndex]['tableheaders'][0]['@list'].push({
      '@language': 'en',
      '@value': '',
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
    if (this.state.formData.schema['altLabel'] && this.state.formData.schema['prefLabel']) {
      profile = {
        name: this.state.formData.schema['altLabel'][0]['@value'],
        fullName: this.state.formData.schema['prefLabel'][0]['@value'],
      };
    }

    // Setup variables for drawer component
    let item = {};
    let inputType = null;
    // Define required boolean
    let requiredValues = {};
    if (this.state.formData.schema.hasOwnProperty('valueRequired')) {
      (this.state.formData.schema['valueRequired']).map((required, index) => {
        requiredValues[required['@index']] = required['@value'];
      });
    }
    if (this.state.selectedItem != null) {
      const currentItem = this.state.selectedItem.split('_');
      const currentItemType = currentItem[0];
      const currentItemIndex = currentItem[1];
      // Define choices
      let choices = [];
      let multipleChoice = null;
      if (this.state.formData[currentItemType][currentItemIndex]['responseOptions']['choices']) {
          choices = this.state.formData[currentItemType][currentItemIndex]['responseOptions']['choices'].map((choice, index) => {
            return ({
              name: choice['name']['en'],
              value: choice['value'],
            });
          });
        // Define multiplechoice boolean
        if ((this.state.formData[currentItemType][currentItemIndex]['responseOptions']).hasOwnProperty('multipleChoice')) {
          multipleChoice = this.state.formData[currentItemType][currentItemIndex]['responseOptions']['multipleChoice'];
        }
      }
      // Define branching logic string
      // Find visibility array index where '@index' = currentItem's altLabel
      const itemID = this.state.formData[currentItemType][currentItemIndex]['altLabel'][0]['@value'];
      let branching = '';
      if (this.state.formData.schema['isVis']) {
        (this.state.formData.schema['isVis']).forEach((object, index) => {
          if (object['@index'] == itemID) {
            branching = object['@value'];
          }
        });
      }
      // Define scoring logic string
      // Find scoringLogic array index where '@index' = currentItem's altLabel
      let scoring = '';
      if (this.state.formData.schema['jsExpression']) {
        (this.state.formData.schema['jsExpression']).forEach((object, index) => {
          if (object['@index'] == itemID) {
            scoring = object['@value'];
          }
        });
      }
      // Define header level if it exists
      let headerLevel = '';
      if (this.state.formData[currentItemType][currentItemIndex]['headerLevel']) {
        headerLevel = this.state.formData[currentItemType][currentItemIndex]['headerLevel'][0]['@value'];
      }

      // Define preamble and question if it exists
      let question = '';
      let preamble = '';
      if ((this.state.formData[currentItemType][currentItemIndex]).hasOwnProperty('question')) {
        question = this.state.formData[currentItemType][currentItemIndex]['question'][0]['@value'];
      }
      if ((this.state.formData[currentItemType][currentItemIndex]).hasOwnProperty('preamble')) {
        preamble = this.state.formData[currentItemType][currentItemIndex]['preamble'][0]['@value'];
      }
      let tableHeaders = [];
      let noOfRows = null;
      if (currentItemType === 'tables') {
        // Define table headers if it exists
        if ((this.state.formData[currentItemType][currentItemIndex]).hasOwnProperty('tableheaders')) {
          tableHeaders = this.state.formData[currentItemType][currentItemIndex]['tableheaders'][0]['@list'].map((header) => {
            return header['@value'];
          });
        }
        // Define table rows if it exists
        if ((this.state.formData[currentItemType][currentItemIndex]).hasOwnProperty('tablerows')) {
          noOfRows = this.state.formData.tables[currentItemIndex]['tablerows'][0]['@list'].length;
        }
      }

      // Define order inside subActivity
      let order = [];
      if ((this.state.formData[currentItemType][currentItemIndex]).hasOwnProperty('order')) {
        order = this.state.formData[currentItemType][currentItemIndex]['order'][0]['@list'].map((field) => {
          const fieldID = field['@id'];
          let altLabel = null;
          let inputType = null;
          // TODO: Access sections/multiparts if those are the child of pages, not only fields
          this.state.formData.fields.forEach((field) => {
            if (field['@id'] === fieldID) {
              altLabel = field['altLabel'][0]['@value'];
              inputType = field['inputType'][0]['@value'];
            }
          });
          return ({
            list: altLabel,
            inputType: inputType,
          });
        });
      }
      if ((this.state.formData[currentItemType][currentItemIndex]).hasOwnProperty('tablerows')) {
        order = this.state.formData[currentItemType][currentItemIndex]['tablerows'][0]['@list'][0]['order'][0]['@list'].map((row) => {
          const fieldID = row['@id'];
          let altLabel = null;
          let inputType = null;
          this.state.formData.fields.forEach((field) => {
            if (field['@id'] === fieldID) {
              altLabel = field['altLabel'][0]['@value'];
              inputType = field['inputType'][0]['@value'];
            }
          });
          return ({
            list: altLabel,
            inputType: inputType,
          });
        });
      }

      // Create field object to pass as prop to edit drawer component
      item = {
        itemID: itemID,
        description: this.state.formData[currentItemType][currentItemIndex]['description'][0]['@value'],
        question: question,
        preamble: preamble,
        choices: choices,
        multipleChoice: multipleChoice,
        branching: branching,
        requiredValue: requiredValues[itemID] || false,
        headerLevel: headerLevel,
        scoring: scoring,
        tableHeaders: tableHeaders,
        noOfRows: noOfRows,
        order: order,
      };
      inputType = this.state.formData[currentItemType][currentItemIndex]['inputType'][0]['@value'];
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
            reIndexField={this.reIndexField}
            deletePage={this.deletePage}
            deleteItem={this.deleteItem}
            selectItem={this.selectItem}
          >
          </Canvas>
          <EditDrawer
            open={this.state.openDrawer}
            showDrawer={this.showDrawer}
            inputType={inputType}
            item={item}
            onEditField={this.editField}
            onEditSubActivity={this.editSubActivity}
            addChoices={this.addValueConstraints}
            addHeader={this.addTableHeader}
          >
          </EditDrawer>
        </div>
      </div>
    );
  }
}

Builder.propTypes = {
  DataURL: PropTypes.string.isRequired,
};

const id = location.href.split('/build/')[1];
window.addEventListener('load', () => {
  const builder = (
    <div id='builder'>
      <Builder
        DataURL={`${loris.BaseURL}/instrument_builder/build/${id}`}
      />
    </div>
  );
  ReactDOM.render(
    builder,
    document.getElementById('lorisworkspace')
  );
});
