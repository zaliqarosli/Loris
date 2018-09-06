// Import libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddTableForm extends Component {
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
    const inputTypeOptions = {
      multipart: 'Multipart',
      section: 'Section',
      table: 'Table',
      header: 'Header',
      text: 'Text',
      textarea: 'Text Area',
      select: 'Select',
      radio: 'Radio',
      label: 'Label',
      numeric: 'Numeric',
      date: 'Date',
      boolean: 'Boolean',
      score: 'Score',
    };
    const addButton = (this.props.mode=='edit') ? null : (
      <ButtonElement
        name='submit'
        type='submit'
        label='Add item'
      />
    );
    const headersInput = (
      <div style={{display: 'flex', flexDirection: 'column', marginRight: '15px', float: 'right'}}>
        {this.props.formData.tableHeaders.map((header, index) => {
          return (
            <div key={index} style={{display: 'flex', justifyContent: 'flex-end'}}>
              <div style={{marginRight: '20px'}}>
                <TextboxElement
                  key={'header_'+index}
                  name={'header_'+index}
                  label={'Header '+(index+1)}
                  value={header}
                  onUserInput={this.props.onEdit}
                />
              </div>
              <ButtonElement
                name='addHeader'
                type='button'
                label={
                  <span><i className='fas fa-plus'></i></span>
                }
                onUserInput={this.props.addHeader}
              />
            </div>
          );
        })}
      </div>
    );
    const rowsInput = (
      <div>
        <StaticElement
          label='Row elements in order of given headers:'
        />
        {this.props.formData.tableHeaders.map((header, index) => {
          return (
            <div key={index} style={{marginRight: '20px', display: 'flex', flexDirection: 'column'}}>
              <StaticElement
                label={'Field '+(index+1)}
                text=''
              />
              <TextboxElement
                // key={'item_'+index}
                name={'rowitem_'+index}
                label='Item ID:'
                value={this.props.formData.order[index].list}
                required={true}
                onUserInput={this.props.onEdit}
              />
              <SelectElement
                name={'inputType_'+index}
                label='Input Type'
                options={inputTypeOptions}
                onUserInput={this.props.onEdit}
                value={this.props.formData.order[index].inputType}
                required={true}
              />
            </div>
          );
        })}
      </div>
    );

    // Return what you want the form to look like using components from `jsx/Form.js`
    return (
      <FormElement
        name='addTableItem'
        id='addTableItem'
        onSubmit={this.handleSubmit}
      >
        <TextboxElement
          name='itemID'
          label='Table ID'
          value={this.props.formData.itemID}
          onUserInput={this.props.onEdit}
          required={true}
        />
        <StaticElement
          label='UI type'
          text='Table'
        />
        <TextboxElement
          name='description'
          label='Description'
          value={this.props.formData.description}
          onUserInput={this.props.onEdit}
        />
        <TextboxElement
          name='preamble'
          label='Question text'
          value={this.props.formData.preamble}
          onUserInput={this.props.onEdit}
        />
        {headersInput}
        {rowsInput}
        <NumericElement
          name='noOfRows'
          min={1}
          max={10}
          label='Number of rows'
          value={this.props.formData.noOfRows}
          onUserInput={this.props.onEdit}
        />
        {addButton}
      </FormElement>
    );
  }
}

// Define props to pass to the component when called
AddTableForm.propTypes = {
  formData: PropTypes.object.isRequired,
  onSave: PropTypes.func, // a call-back function defined in parent class that will be triggered when called in this class
  mode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  addHeader: PropTypes.func.isRequired,
};

// Export component to be used in other classes
export default AddTableForm;
