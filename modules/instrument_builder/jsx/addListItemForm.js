import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddListItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        options: {
          choices: [],
          multipleChoice: false,
          requiredValue: false,
          readOnly: false,
        },
        rules: {},
      },
      dataType: {
        integer: 'Integer',
        string: 'String',
      },
      uiType: {
        select: 'Select',
        radio: 'Radio',
      },
    };

    this.addChoices = this.addChoices.bind(this);
    this.setCheckbox = this.setCheckbox.bind(this);
  }

  addChoices(element, value) {
    let formData = Object.assign({}, this.state.formData);
    let newChoice= {
      name: value,
      value: value,
    };
    formData.options.choices[element] = newChoice;
    this.setState({formData});
  }

  setCheckbox(element, value) {
    let formData = Object.assign({}, this.state.formData);
    formData.options.element = value;
    this.setState({formData});
  }

  render() {
    return (
      <FormElement
        name='addListItem'
        id='addListItem'
      >
        <TextboxElement
          name='itemid'
          label='Item ID'
        />
        <StaticElement
          label='UI type'
          text={this.state.uiType[this.props.uiType]}
        />
        <TextboxElement
          label='Question text'
        />
        <TextboxElement
          label='Description'
        />
        <SelectElement
          label='Data type'
          options={this.state.dataType}
        />
        <TextboxElement
          name='option1'
          label='Options 1'
          onUserInput={this.addChoices}
          value={(this.state.formData.options.choices['option1'] || {}).value}
        />
        <TextboxElement
          name='option2'
          label='Options 2'
          onUserInput={this.addChoices}
          value={(this.state.formData.options.choices['option2'] || {}).value}
        />
        <TextboxElement
          name='option3'
          label='Options 3'
          onUserInput={this.addChoices}
          value={(this.state.formData.options.choices['option3'] || {}).value}
        />
        <TextboxElement
          name='option4'
          label='Options 4'
          onUserInput={this.addChoices}
          value={(this.state.formData.options.choices['option4'] || {}).value}
        />
        <CheckboxElement
          name='multipleChoice'
          label='Allow multiple values'
          value={this.state.formData.options.multipleChoice}
          onUserInput={this.setCheckbox}
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
