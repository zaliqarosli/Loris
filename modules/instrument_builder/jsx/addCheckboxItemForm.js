// Import libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddCheckboxItemForm extends Component {
  // Define constructor with super props, state, and methods 
  constructor(props) {
    // Pass props to parent constructor
    super(props);

    // Define component's states
    this.state = {
      formData: {     // the object in which the form's data on user input is stored

      },
      dataType: {     // options for 'Data type' select element
        integer: 'Integer',
        string: 'String',
        boolean: 'Boolean',
      },
    };

    // Bind all methods to `this` (except for render method)
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Create custom methods ..

  // Sets this.state.formData on user input for the other remaining elements
  setFormData(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[elementName] = value;
    this.setState({formData});
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
        name='addCheckboxItem'
        id='addCheckboxItem'
        onSubmit={this.handleSubmit}
      >
        <TextboxElement
          name='itemID'
          label='Item ID'
          value={this.state.formData.itemID}
          onUserInput={this.setFormData}
          required={true}
        />
        <StaticElement
          label='UI type'
          text='Checkbox'
        />

        // Add missing form elements

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
AddCheckboxItemForm.propTypes = {
  onSave: PropTypes.func.isRequired,   // a call-back function defined in parent class that will be triggered when called in this class 
};

// Export component to be used in other classes
export default AddCheckboxItemForm;
