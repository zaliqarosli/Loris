// Import libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddScoreItemForm extends Component {
  // Define constructor with super props, state, and methods
  constructor(props) {
    // Pass props to parent constructor
    super(props);

    // Bind all methods to `this` (except for render method)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // On clicking 'Add item', call the call-back method passed in this.props.onSave
  // This call-back method can be anything you want it to be, what's important here is
  // that handleSubmit calls `this.props.onSave`.
  handleSubmit(e) {
    this.props.onSave();
  }

  // Define render method that returns JSX/React elements
  // The render() method is the only required method in a class component
  render() {
    const addButton = (this.props.mode=='edit') ? null : (
      <ButtonElement
        name='submit'
        type='submit'
        label='Add item'
      />
    );
    // Return what you want the form to look like using components from `jsx/Form.js`
    return (
      <FormElement
        name='addScoreItem'
        id='addScoreItem'
        onSubmit={this.handleSubmit}
      >
        <TextboxElement
          name='itemID'
          label='Item ID'
          value={this.props.formData.itemID}
          onUserInput={this.props.onEditField}
          required={true}
        />
        <StaticElement
          label='UI type'
          text='Static score'
        />
        <TextboxElement
          name='question'
          label='Question text'
          value={this.props.formData.question}
          onUserInput={this.props.onEditField}
          required={true}
        />
        <TextboxElement
          name='description'
          label='Description'
          value={this.props.formData.description}
          onUserInput={this.props.onEditField}
        />
        <TextboxElement
          name='branching'
          label='Branching formula'
          value={this.props.formData.branching}
          onUserInput={this.props.onEditField}
        />
        <TextboxElement
          name='scoring'
          label='Scoring formula'
          value={this.props.formData.scoring}
          onUserInput={this.props.onEditField}
        />
        {addButton}
      </FormElement>
    );
  }
}

// Define props to pass to the component when called
AddScoreItemForm.propTypes = {
  formData: PropTypes.object,
  onSave: PropTypes.func, // a call-back function defined in parent class that will be triggered when called in this class
  mode: PropTypes.string,
  onEditField: PropTypes.func,
};

// Export component to be used in other classes
export default AddScoreItemForm;
