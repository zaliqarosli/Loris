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
      formData: { // the object in which the form's data on user input is stored
        itemID: '',
        uiType: this.props.uiType,
        question: '',
        description: '',
        selectedType: null,
        options: {
          choices: [
            {name: '', value: ''},
          ],
          multipleChoice: false,
          requiredValue: false,
        },
        rules: {
          branching: '',
          scoring: '',
        },
      },
      dataType: { // options for 'Data type' select element
        integer: 'Integer',
        string: 'String',
        boolean: 'Boolean',
      },
      uiType: { // options for UI type given this.props.uiType
        select: 'Select',
        radio: 'Radio',
      },
    };

    // Bind all methods to `this` (except for render method)
    this.setChoiceLabel = this.setChoiceLabel.bind(this);
    this.setChoiceValue = this.setChoiceValue.bind(this);
    this.setCheckbox = this.setCheckbox.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.setRules = this.setRules.bind(this);
    this.addOptions = this.addOptions.bind(this);
    this.renderFieldOptions = this.renderFieldOptions.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Create custom methods ..

  // Sets this.state.formData on user input for Field options 'Label' text element
  setChoiceLabel(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    const choiceKey = elementName;
    formData.options.choices[choiceKey].name = value;
    this.setState({formData});
  }

  // Sets this.state.formData on user input for Field options 'Value' text element
  setChoiceValue(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    const choiceKey = elementName;
    formData.options.choices[choiceKey].value = value;
    this.setState({formData});
  }

  // Sets this.state.formData on user input for checkbox elements
  setCheckbox(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    formData.options[elementName] = value;
    this.setState({formData});
  }

  // Sets this.state.formData on user input for branching/scoring formula text element
  setRules(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    formData.rules[elementName] = value;
    this.setState({formData});
  }

  // Sets this.state.formData on user input for the other remaining elements
  setFormData(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[elementName] = value;
    this.setState({formData});
  }

  // Adds new choice object to this.state.formData.options.choices when '+' button is clicked
  addOptions(e) {
    let formData = Object.assign({}, this.state.formData);
    const newChoice = {name: '', value: ''};
    formData.options.choices.push(newChoice);
    this.setState({formData});
  }

  // Render 'Label' and 'Value' text elements and '+' button element for each object in the choices array
  renderFieldOptions() {
    let optionsBlock = this.state.formData.options.choices.map((choice, key) => {
      return (
        <div key={key} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{marginRight: '20px'}}>
            <TextboxElement
              name={key}
              label='Label'
              onUserInput={this.setChoiceLabel}
              value={this.state.formData.options.choices[key].name}
            />
          </div>
          <div style={{marginRight: '17px'}}>
            <TextboxElement
              name={key}
              label='Value'
              onUserInput={this.setChoiceValue}
              value={this.state.formData.options.choices[key].value}
            />
          </div>
          <ButtonElement
            name='addOptions'
            type='button'
            label={
              <span><i className='fas fa-plus'></i></span>
            }
            onUserInput={this.addOptions}
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
          value={this.state.formData.itemID}
          onUserInput={this.setFormData}
          required={true}
        />
        <StaticElement
          label='UI type'
          text={this.state.uiType[this.props.uiType]}
        />
        <TextboxElement
          name='question'
          label='Question text'
          value={this.state.formData.question}
          onUserInput={this.setFormData}
          required={true}
        />
        <TextboxElement
          name='description'
          label='Description'
          value={this.state.formData.description}
          onUserInput={this.setFormData}
        />
        <SelectElement
          name='selectedType'
          label='Data type'
          options={this.state.dataType}
          value={this.state.formData.selectedType}
          onUserInput={this.setFormData}
          required={true}
        />
        <StaticElement
          label='Field options:'
        />
        {this.renderFieldOptions()}   // Call this method to render the field options portion of the form
        <CheckboxElement
          name='multipleChoice'
          label='Allow multiple values'
          value={this.state.formData.options.multipleChoice}
          onUserInput={this.setCheckbox}
        />
        <TextboxElement
          name='branching'
          label='Branching formula'
          value={this.state.formData.rules.branching}
          onUserInput={this.setRules}
        />
        <TextboxElement
          name='scoring'
          label='Scoring formula'
          value={this.state.formData.rules.scoring}
          onUserInput={this.setRules}
        />
        <CheckboxElement
          name='requiredValue'
          label='Required item'
          value={this.state.formData.options.requiredValue}
          onUserInput={this.setCheckbox}
        />
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
AddListItemForm.propTypes = {
  uiType: PropTypes.string.isRequired, // i.e. whether it is "select" or "radio"
  onSave: PropTypes.func.isRequired, // a call-back function defined in parent class that will be triggered when called in this class
};

// Export component to be used in other classes
export default AddListItemForm;
