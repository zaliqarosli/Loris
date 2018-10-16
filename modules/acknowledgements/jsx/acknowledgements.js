import FilterForm from 'FilterForm';
import Loader from 'Loader';
import Panel from 'Panel';

/**
 * Acknowledgements Module Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders main page consisting of FilterForm and
 * StaticDataTable components.
 *
 * @author Zaliqa Rosli
 * @version 1.0.0
 *
 */
class Acknowledgements extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data: {},
      formData: {},
      filter: {},
      affiliationsOptions: {
        douglas: "Douglas",
        mcgill: "McGill"
      },
      degreesOptions: {
        bachelors: "Bachelors",
        masters: "Masters",
        phd: "PhD",
        postdoc: "Postdoctoral",
        md: "MD",
        registeredNurse: "Registered Nurse"
      },
      rolesOptions: {
        investigators: "Investigators",
        projectAdministration: "Project Administration",
        databaseManagement: "Database Management",
        interviewDataCollection: "Interview Data Collection",
        dataAnalyses: "Data Analyses",
        mriAcquisition: "MRI Acquisition",
        dataEntry: "Data Entry",
        databaseProgramming: "Database Programming",
        imagingProcessingAndEvaluation: "Imaging Processing and Evaluation",
        geneticAnalysisAndBiochemicalAssays: "Genetic Analysis and Biochemical Assays",
        randomizationAndPharmacyAllocation: "Randomization and Pharmacy Allocation",
        consultants: "Consultants",
        lpCsfCollection: "LP/CSF Collection"
      },
      presentOptions: {
        yes: "Yes",
        no: "No"
      }
    };

    /**
     * Set filter to the element's ref for filtering
     */
    this.filter = null;
    this.setFilterRef = element => {
      this.filter = element;
    };

    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.pickElements = this.pickElements.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   */
  fetchData() {
    const self = this;
    let formData = {};
    $.ajax(this.props.DataURL, {
      method: 'GET',
      dataType: 'json',
      success: data => {
        self.setState({
          data: data,
          isLoaded: true
        });
      },
      error: error => {
        console.error(error);
      }
    });
  }

  pickElements(formElement, keys) {
    let subset = {};
    keys.forEach((key) => {
      if (formElement.hasOwnProperty(key)) {
        subset[key] = formElement[key];
      }
    });
    return subset;
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    const formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  }

  /**
   * Set this.state.filter to the input filter object
   *
   * @param {object} filter - the filter object
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  /**
   * Reset the filter elements with filter refs to empty values
   */
  resetFilters() {
    this.filter.clearFilter();
  }

  /**
   * Handles the submission of the Add Acknowledgements form
   *
   * @param {event} e - event of the form
   */
  handleSubmit(e) {
    let formData = this.state.formData;
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
    formObject.append('fire_away', 'Add');
    $.ajax({
      type: 'POST',
      url: loris.BaseURL + '/acknowledgements/',
      data: formObject,
      cache: false,
      contentType: false,
      processData: false,
      success: data => {
        swal('Success!', 'Acknowledgement added.', 'success');
        this.fetchData();
      },
      error: error => {
        console.error(error);
        let message = error.responseText;
        swal('Error!', message, 'error');
      }
    });
  }

  /**
   * Modify behaviour of specified column cells in the Static Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   *
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    return(<td>{cell}</td>);
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <Loader/>
      );
    }

    let citationPolicy = (
      <Panel
        id="citationPolicy"
        title="Citation Policy"
      >
        <div className="col-sm-12 col-md-12">
          <span>{this.state.data.citation_policy}</span>
        </div>
      </Panel>
    );

    let addAcknowledgements = (
      <Panel
        id="addAcknowledgements"
        title="Add Acknowledgements"
      >
        <FormElement
          Module="acknowledgements"
          name="acknowledgements"
          id="acknowledgements"
          onSubmit={this.handleSubmit}
          method="POST"
          columns={4}
        >
          <TextboxElement
            name="ordering"
            label="Ordering"
            value={this.state.formData.ordering}
            id="ordering"
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name="fullName"
            label="Full Name"
            value={this.state.formData.fullName}
            id="fullName"
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name="citationName"
            label="Citation Name"
            value={this.state.formData.citationName}
            id="citationName"
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="affiliations"
            options={this.state.affiliationsOptions}
            label="Affiliations"
            value={this.state.formData.affiliations}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="degrees"
            options={this.state.degreesOptions}
            label="Degrees"
            value={this.state.formData.degrees}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="roles"
            options={this.state.rolesOptions}
            label="Roles"
            value={this.state.formData.roles}
            onUserInput={this.setFormData}
          />
          <DateElement
            name="startDate"
            label="Start Date"
            value={this.state.formData.startDate}
            id="startDate"
            onUserInput={this.setFormData}
          /> 
          <DateElement
            name="endDate"
            label="End Date"
            value={this.state.formData.endDate}
            id="endDate"
            onUserInput={this.setFormData}
          /> 
          <SelectElement
            name="present"
            options={this.state.presentOptions}
            label="Present"
            value={this.state.formData.present}
            onUserInput={this.setFormData}
          />
          <div className="row col-xs-12">
            <div className="col-sm-6 col-md-2 col-xs-12">
              <ButtonElement
                name="fire_away"
                label="Save"
                type="submit"
                buttonClass="btn btn-sm btn-primary col-xs-12"
              />
            </div>
            <div className="col-sm-6 col-md-2 col-xs-12">
              <ButtonElement
                name="reset"
                label="Reset"
                type="reset"
                buttonClass="btn btn-sm btn-primary col-xs-12"
              />
            </div>
          </div> 
        </FormElement>
      </Panel>
    );

    return (
      <div>
        <div id="forms" className="row">
          <div id="filter-acknowledgements" className="col-sm-9">
            <FilterForm
              Module="acknowledgements"
              name="acknowledgements_filter"
              id="acknowledgements_filter_form"
              ref={this.setFilterRef}
              columns={3}
              formElements={
                this.pickElements(
                  this.state.data.form,
                  ['full_name', 'citation_name', 'present', 'start_date', 'end_date']
                )
              }
              onUpdate={this.updateFilter}
              filter={this.state.filter}
            >
              <div className="col-md-6 col-md-offset-6 col-sm-6">
                <ButtonElement
                  name="reset"
                  label="Clear Filters"
                  type="reset"
                  buttonClass="btn btn-sm btn-primary col-xs-12"
                  onUserInput={this.resetFilters}
                />
              </div>
            </FilterForm>
          </div>
        </div>
        <div id="citation-policy-div">
          {citationPolicy}
        </div>
        <div id="add-form-div">
          {addAcknowledgements}
        </div>
        <div id="datatable">
          <StaticDataTable
            Data={this.state.data.Data}
            Headers={this.state.data.Headers}
            Filter={this.state.filter}
            getFormattedCell={this.formatColumn}
          />
        </div>
      </div>
    );
  }
}

Acknowledgements.propTypes = {
    Module: React.PropTypes.string.isRequired,
    DataURL: React.PropTypes.string.isRequired
};

/**
 * Render acknowledgements on page load
 */
window.onload = () => {
  let acknowledgements = (
    <div id="page-acknowledgements">
      <Acknowledgements
        Module="acknowledgements"
        DataURL={`${loris.BaseURL}/acknowledgements/?format=json`}
      />
    </div>
  );
  ReactDOM.render(acknowledgements, document.getElementById('lorisworkspace'));
};
