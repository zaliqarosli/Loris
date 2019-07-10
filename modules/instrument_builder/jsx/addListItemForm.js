import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddListItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
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
      dataType: {
        integer: 'Integer',
        string: 'String',
        boolean: 'Boolean',
      },
      uiType: {
        select: 'Select',
        radio: 'Radio',
      },
    };

    this.setChoiceLabel = this.setChoiceLabel.bind(this);
    this.setChoiceValue = this.setChoiceValue.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.setCheckbox = this.setCheckbox.bind(this);
    this.setRules = this.setRules.bind(this);
    this.addOptions = this.addOptions.bind(this);
    this.renderFieldOptions = this.renderFieldOptions.bind(this);
  }

  setChoiceLabel(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    const choiceKey = elementName;
    formData.options.choices[choiceKey].name = value;
    this.setState({formData});
  }

  setChoiceValue(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    const choiceKey = elementName;
    formData.options.choices[choiceKey].value = value;
    this.setState({formData});
  }

  setFormData(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[elementName] = value;
    this.setState({formData});
  }

  setCheckbox(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    formData.options[elementName] = value;
    this.setState({formData});
  }

  setRules(elementName, value) {
    let formData = Object.assign({}, this.state.formData);
    formData.rules[elementName] = value;
    this.setState({formData});
  }

  addOptions(e) {
    let formData = Object.assign({}, this.state.formData);
    const newChoice = {name: '', value: ''};
    formData.options.choices.push(newChoice);
    this.setState({formData});
  }

  renderFieldOptions() {
    let optionsBlock = this.state.formData.options.choices.map((choice, key) => {
      return (
        <div key={key} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{marginRight: '20px'}}>
            <TextboxElement
              name={key}
              label='Label'
              onUserInput={this.addChoiceLabel}
              value={this.state.formData.options.choices[key].name}
            />
          </div>
          <div style={{marginRight: '17px'}}>
            <TextboxElement
              name={key}
              label='Value'
              onUserInput={this.addChoiceValue}
              value={this.state.formData.options.choices[key].value}
            />
          </div>
          <ButtonElement
            name='addOptions'
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

  render() {
    return (
      <FormElement
        name='addListItem'
        id='addListItem'
      >
        <TextboxElement
          name='itemID'
          label='Item ID'
          value={this.state.formData.itemID}
          onUserInput={this.setFormData}
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
          label='Item is required'
          value={this.state.formData.options.requiredValue}
          onUserInput={this.setCheckbox}
        />
      </FormElement>
    );
  }
}

AddListItemForm.propTypes = {
  uiType: PropTypes.string.isRequired,
};

export default AddListItemForm;
