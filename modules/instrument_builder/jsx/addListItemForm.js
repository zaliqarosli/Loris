// Import libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddListItemForm extends Component {
  // Define constructor with super props, state, and methods
  constructor(props) {
    // Pass props to parent constructor
    super(props);

    // Define component's states
    this.state = {
      uiType: { // options for UI type given this.props.uiType
        select: 'Select',
        radio: 'Radio',
      },
    };

    // Bind all methods to `this` (except for render method)
    // this.setRules = this.setRules.bind(this);
    this.renderFieldOptions = this.renderFieldOptions.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Create custom methods ..

  // Sets this.state.formData on user input for branching/scoring formula text element
  // setRules(elementName, value) {
  //   let formData = Object.assign({}, this.state.formData);
  //   formData.rules[elementName] = value;
  //   this.setState({formData});
  // }

  // Render 'Label' and 'Value' text elements and '+' button element for each object in the choices array
  renderFieldOptions() {
    let optionsBlock = this.props.formData.choices.map((choice, key) => {
      return (
        <div key={key} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{marginRight: '20px'}}>
            <TextboxElement
              name={'name_'+key}
              label='Label'
              onUserInput={this.props.onEditField}
              value={this.props.formData.choices[key].name}
            />
          </div>
          <div style={{marginRight: '17px'}}>
            <TextboxElement
              name={'value_'+key}
              label='Value'
              onUserInput={this.props.onEditField}
              value={this.props.formData.choices[key].value}
            />
          </div>
          <ButtonElement
            name='addChoices'
            type='button'
            label={
              <span><i className='fas fa-plus'></i></span>
            }
            onUserInput={this.props.addChoices}
          />
        </div>
      );
    });
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        marginRight: '15px',
        float: 'right',
      }}>
        {optionsBlock}
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
        name='addListItem'
        id='addListItem'
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
          text={this.state.uiType[this.props.formData.inputType]}
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
        <StaticElement
          label='Field options:'
        />
        {this.renderFieldOptions()}
        <CheckboxElement
          name='multipleChoice'
          label='Allow multiple values'
          value={this.props.formData.multipleChoice}
          onUserInput={this.props.onEditField}
        />
        <TextboxElement
          name='branching'
          label='Branching formula'
          value={''}
          // onUserInput={}
        />
        <TextboxElement
          name='scoring'
          label='Scoring formula'
          value={''}
          // onUserInput={}
        />
        <CheckboxElement
          name='requiredValue'
          label='Required item'
          value={false}
          // onUserInput={}
        />
        {addButton}
      </FormElement>
    );
  }
}

// Define props to pass to the component when called
AddListItemForm.propTypes = {
  uiType: PropTypes.string.isRequired, // i.e. whether it is "select" or "radio"
  formData: PropTypes.object,
  onSave: PropTypes.func, // a call-back function defined in parent class that will be triggered when called in this class,
  mode: PropTypes.string,
  onEditField: PropTypes.func,
  addChoices: PropTypes.func,
};

// Export component to be used in other classes
export default AddListItemForm;
