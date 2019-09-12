// Import libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddPageForm extends Component {
  // Define constructor with super props, state, and methods
  constructor(props) {
    // Pass props to parent constructor
    super(props);

    // Bind all methods to `this` (except for render method)
    this.renderContentFields = this.renderContentFields.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  renderContentFields() {
    let contentBlock = this.props.formData.order.map((content, key) => {
      return (
        <div key={key} style={{display: 'flex'}}>
          <div style={{flex: '1', margin: 'auto 20px'}}>
            <TextboxElement
              name={key}
              label='ID'
              onUserInput={this.setPageContent}
              value={this.props.formData.order[key]}
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
        name='addPageItem'
        id='addPageItem'
        onSubmit={this.handleSubmit}
      >
        <TextboxElement
          name='itemID'
          label='Page ID'
          value={this.props.formData.itemID}
          onUserInput={this.props.onEdit}
          required={true}
        />
        <StaticElement
          label='UI type'
          text='Page'
        />
        <TextboxElement
          name='pageNumber'
          label='Page Number'
          value={this.props.formData.pageNumber}
          onUserInput={this.props.onEdit}
        />
        <TextboxElement
          name='description'
          label='Description'
          value={this.props.formData.description}
          onUserInput={this.props.onEdit}
        />
        <StaticElement
          label=''
          text='*Optional: Add ID of items or sub activities you want to add to this page'
        />
        {this.renderContentFields()}
        {addButton}
      </FormElement>
    );
  }
}

// Define props to pass to the component when called
AddPageForm.propTypes = {
  formData: PropTypes.object,
  onSave: PropTypes.func, // a call-back function defined in parent class that will be triggered when called in this class
  mode: PropTypes.string,
  onEdit: PropTypes.func,
};

// Export component to be used in other classes
export default AddPageForm;
