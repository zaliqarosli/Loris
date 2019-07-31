import React, {Component} from 'react';
import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import Modal from 'Modal';

import Toolbar from './toolbar';
import Canvas from './canvas';
import EditDrawer from './editdrawer';
import AddListItemForm from './addListItemForm';
import AddPageForm from './addPageForm';

import expandFull from './../../../htdocs/js/jsonldexpander';

class InstrumentBuilderApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      formData: {
        schema: {},
        fields: [],
        multiparts: [],
        pages: [],
        sections: [],
        tables: [],
      },
      schemaData: {},
      schemaURI: this.props.schemaURI,
      selectedField: null,
      selectedFieldType: null,
      selectedPage: null,
      showModal: false,
      openDrawer: false,
    };
    this.updateFormData = this.updateFormData.bind(this);
    this.mapKeysToAlias = this.mapKeysToAlias.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.onDropFieldType = this.onDropFieldType.bind(this);
    this.reIndexField = this.reIndexField.bind(this);
    this.deleteField = this.deleteField.bind(this);
    this.deletePage = this.deletePage.bind(this);
    this.saveField = this.saveField.bind(this);
    this.savePage = this.savePage.bind(this);
    this.pushToFields = this.pushToFields.bind(this);
    this.pushToPages = this.pushToPages.bind(this);
    this.selectField = this.selectField.bind(this);
  }

  async componentDidMount() {
    if (this.state.schemaURI !== '') {
      try {
        // Have to do this twice because deep cloning doesn't seem to be working currently
        const formData = await expandFull(this.state.schemaURI);
        const schemaData = Object.assign({}, formData);
        this.setState({formData, schemaData});
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

  updateFormData(element, value) {
    let formData = Object.assign({}, this.state.formData);
    const fullKeyName = 'http://www.w3.org/2004/02/skos/core#' + element;
    formData.schema[fullKeyName][0]['@value'] = value;
    this.setState({formData});
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  showDrawer(e) {
    let openDrawer = !this.state.openDrawer;
    this.setState({openDrawer});
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

  onDropFieldType(e) {
    const selectedPage = e.target.id;
    const selectedFieldType = e.dataTransfer.getData('text');
    this.setState({selectedFieldType, selectedPage});
    this.openModal();
    e.dataTransfer.clearData();
  }

  reIndexField(e) {
    const targetField = e.target.id;
    const selectedField = e.dataTransfer.getData('text');
    let formData = Object.assign({}, this.state.formData);
    let temp = formData.fields[selectedField];
    formData.fields[selectedField] = formData.fields[targetField];
    formData.fields[targetField] = temp;
    this.setState({formData});
    e.dataTransfer.clearData();
  }

  deleteField(e) {
    const fieldKey = e.currentTarget.parentNode.id;
    let formData = Object.assign({}, this.state.formData);
    swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all field information.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete field!',
    }).then((result) => {
      if (result.value) {
        formData.fields.splice(fieldKey, 1);
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

  saveField(formData) {
    formData.onPage = this.state.selectedPage;
    pushToItems(formData);
    swal.fire('Success!', 'Item added.', 'success').then((result) => {
      if (result.value) {
        this.closeModal();
      }
    });
  }

  savePage(formData) {
    pushToPages(formData);
    swal.fire('Success!', 'Page added.', 'success').then((result) => {
      if (result.value) {
        this.closeModal();
      }
    });
  }

  pushToFields(field) {
    let formData = Object.assign([], this.state.formData);
    formData.fields.push(field);
    this.setState({formData});
  }

  pushToPages(page) {
    let formData = Object.assign([], this.state.formData);
    formData.pages.push(page);
    this.setState({formData});
  }

  selectField(e) {
    let fieldIndex = e.currentTarget.id;
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
    let profile = {};
    if (this.state.formData.schema['http://www.w3.org/2004/02/skos/core#altLabel'] && this.state.formData.schema['http://www.w3.org/2004/02/skos/core#prefLabel']) {
      profile = {
        name: this.state.formData.schema['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'],
        fullName: this.state.formData.schema['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'],
      };
    }
    let pages = [];
    if ((this.state.formData['pages']).length == 0) {
      pages.push({
        'http://www.w3.org/2004/02/skos/core#altLabel': '',
        'http://schema.org/description': '',
        '@id': '',
        'http://schema.repronim.org/preamble': '',
        'http://www.w3.org/2004/02/skos/core#prefLabel': '',
        'https://schema.repronim.org/order': [
          {
            '@list': [],
          },
        ],
      });
    } else {
      pages = [...this.state.formData.pages];
    }
    return (
      <div>
        {this.renderModal()}
        <div style={divStyle}>
          <Toolbar
            profile={profile}
            onUpdate={this.updateFormData}
          >
          </Toolbar>
          <Canvas
            fields={this.state.formData.fields}
            multiparts={this.state.formData.multiparts}
            pages={pages}
            sections={this.state.formData.sections}
            tables={this.state.formData.tables}
            onDropFieldType={this.onDropFieldType}
            reIndexField={this.reIndexField}
            deletePage={this.deletePage}
            deleteField={this.deleteField}
            selectField={this.selectField}
          >
          </Canvas>
          <EditDrawer
            open={this.state.openDrawer}
            showDrawer={this.showDrawer}
            selectedField={this.state.formData.fields[this.state.selectedField] || {}}
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
