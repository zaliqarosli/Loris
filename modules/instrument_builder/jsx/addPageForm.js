// Import libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddPageForm extends Component {
  // Define constructor with super props, state, and methods
  constructor(props) {
    // Pass props to parent constructor
    super(props);

    // Define component's states
    this.state = {
      formData: { // the object in which the form's data on user input is stored
        pageID: '',
        pageNumber: null,
        description: '',
        order: [
          '',
        ],
      },
    };

    // Bind all methods to `this` (except for render method)
    this.setFormData = this.setFormData.bind(this);
    this.setPageContent = this.setPageContent.bind(this);
    this.addPageContent = this.addPageContent.bind(this);
    this.renderContentFields = this.renderContentFields.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Sets this.state.formData on user input for the other remaining elements
  setFormData(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[elementName] = value;
    this.setState({formData});
  }

  setPageContent(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    const contentKey = elementName;
    formData.order[contentKey] = value;
    this.setState({formData});
  }

  addPageContent(e) {
    let formData = Object.assign({}, this.state.formData);
    formData.order.push('');
    this.setState({formData});
  }

  renderContentFields() {
    let contentBlock = this.state.formData.order.map((content, key) => {
      return (
        <div key={key} style={{display: 'flex'}}>
          <div style={{flex: '1', margin: 'auto 20px'}}>
            <TextboxElement
              name={key}
              label='ID'
              onUserInput={this.setPageContent}
              value={this.state.formData.order[key]}
            />
          </div>
          <div style={{marginRight: '-5px', alignSelf: 'flex-end', marginBottom: '15px'}}>
            <ButtonElement
              name='addContent'
              type='button'
              label={
                <span><i className='fas fa-plus'></i></span>
              }
              onUserInput={this.addPageContent}
              columnSize=''
              className=''
            />
          </div>
        </div>
      );
    });

    return (
      <div>
        {contentBlock}
      </div>
    );
  }

  // On clicking 'Add item', call the call-back method passed in this.props.onSave
  // This call-back method can be anything you want it to be, what's important here is
  // that handleSubmit calls `this.props.onSave`.
  // Passing `formData` to the prop function sends the formData up to the parent level
  handleSubmit(e) {
    let formData = Object.assign({}, this.state.formData);
    this.props.onSave(formData);
  }

  // Define render method that returns JSX/React elements
  // The render() method is the only required method in a class component
  render() {
    // Return what you want the form to look like using components from `jsx/Form.js`
    return (
      <FormElement
        name='addPage'
        id='addPage'
        onSubmit={this.handleSubmit}
      >
        <TextboxElement
          name='pageID'
          label='Page ID'
          value={this.state.formData.pageID}
          onUserInput={this.setFormData}
          required={true}
        />
        <StaticElement
          label='UI type'
          text='Page'
        />
        <TextboxElement
          name='pageNumber'
          label='Page Number'
          value={this.state.formData.pageNumber}
          onUserInput={this.setFormData}
        />
        <TextboxElement
          name='description'
          label='Description'
          value={this.state.formData.description}
          onUserInput={this.setFormData}
        />
        <StaticElement
          label='Contents'
          text='*Optional: Add ID of items or sub activities you want to add to this page'
        />
        {this.renderContentFields()}
        <ButtonElement
          name='submit'
          type='submit'
          label='Add item'
        />
      </FormElement>
    );
  }
}

// Define props to pass to the component when called
AddPageForm.propTypes = {
  onSave: PropTypes.func.isRequired, // a call-back function defined in parent class that will be triggered when called in this class
};

// Export component to be used in other classes
export default AddPageForm;
