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
        itemID: this.props.formData['http://www.w3.org/2004/02/skos/core#altLabel'][0]['@value'] || '',
        uiType: this.props['https://schema.repronim.org/inputType'],
        question: this.props.formData['http://schema.org/question'][0]['@value'] || '',
        description: this.props.formData['http://schema.org/description'][0]['@value'] || '',
        selectedType: null,
        options: {
          choices: this.props.choices || [{name: '', value: ''}],
          multipleChoice: false,
          requiredValue: false,
        },
        rules: {
          branching: '',
          scoring: '',
        },
      },
      uiType: { // options for UI type given this.props.uiType
        select: 'Select',
        radio: 'Radio',
      },
    };

    // Bind all methods to `this` (except for render method)
    this.setCheckbox = this.setCheckbox.bind(this);
    this.setRules = this.setRules.bind(this);
    this.renderFieldOptions = this.renderFieldOptions.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Create custom methods ..

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

  // Render 'Label' and 'Value' text elements and '+' button element for each object in the choices array
  renderFieldOptions() {
    let optionsBlock = this.state.formData.options.choices.map((choice, key) => {
      return (
        <div key={key} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{marginRight: '20px'}}>
            <TextboxElement
              name={'name_'+key}
              label='Label'
              onUserInput={this.props.onEditField}
              value={this.state.formData.options.choices[key].name}
            />
          </div>
          <div style={{marginRight: '17px'}}>
            <TextboxElement
              name={'value_'+key}
              label='Value'
              onUserInput={this.props.onEditField}
              value={this.state.formData.options.choices[key].value}
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
          value={this.state.formData.itemID}
          onUserInput={this.props.onEditField}
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
          onUserInput={this.props.onEditField}
          required={true}
        />
        <TextboxElement
          name='description'
          label='Description'
          value={this.state.formData.description}
          onUserInput={this.props.onEditField}
        />
        <StaticElement
          label='Field options:'
        />
        {this.renderFieldOptions()}
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
  choices: PropTypes.array,
  mode: PropTypes.string,
  onEditField: PropTypes.func,
  addChoices: PropTypes.func,
};

// Export component to be used in other classes
export default AddListItemForm;
